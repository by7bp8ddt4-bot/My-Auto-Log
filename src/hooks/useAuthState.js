import { useState, useCallback, useEffect, useRef } from 'react';
import { useSupabaseAuth } from './useSupabaseData.js';
import { supabase } from '../lib/supabase.js';
import { isStickyPaid, setPremiumFlag } from '../utils/tiering.js';
import { setSubscriptionData, clearSubscriptionData } from '../components/SubscriptionManagement.jsx';

/**
 * Combined auth + premium state hook.
 * Wraps useSupabaseAuth and adds premium persistence with Supabase sync.
 * URL-based activation effects remain in App.jsx (they depend on analytics + page state).
 */
export default function useAuthState() {
  // ── Supabase auth ──────────────────────────────────────────────
  const auth = useSupabaseAuth();
  const isAuthenticated = !!auth.user;

  // ── Premium state ──────────────────────────────────────────────
  // Seeded from the ACCOUNT-SCOPED sticky paid marker (premium flag owned by
  // the current user, OR an active/trialing subscription plan+status) so a
  // post-payment fresh load — new tab, browser reopen, Capacitor iOS webview —
  // starts paid instead of bouncing back to the paywall before the server-side
  // profile sync catches up. On the very first render `auth.user` is still
  // null (the session is restoring), so `isStickyPaid(null)` honors the flag
  // provisionally and the sync below reconciles once the real user id is known.
  const [premium, setPremium] = useState(() => {
    return isStickyPaid(auth.user?.id);
  });

  // NOTE: There is intentionally NO client-side `profiles.premium=true` write
  // from a device-local marker here. The durable source of truth for "paid" is
  // server-side `profiles.premium`, set by the Stripe webhook (and by the
  // genuine checkout-success / restore / upgrade flows in App.jsx). Writing
  // premium=true to a profile from a stale device marker is exactly the
  // cross-account contamination this hook must never reintroduce.

  const fetchProfilePremium = useCallback(async (userId) => {
    if (!userId) return { ok: false, premium: null };
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('premium')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[Premium Sync] Premium query failed:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        return { ok: false, premium: null };
      }

      const premiumValue = data?.premium ?? null;
      console.log(`[Premium Sync] DB response: premium=${String(premiumValue)}, ok=true`);
      return { ok: true, premium: premiumValue };
    } catch (error) {
      console.warn('[Premium Sync] Premium query failed:', {
        message: error?.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
      });
      return { ok: false, premium: null };
    }
  }, []);

  // ── Premium sync with Supabase ────────────────────────────────
  // Which auth session (user id) the premium-confirmation poll has already
  // been started/completed for. Keying the poll to the user id — NOT to the
  // `premium` boolean — means a mid-session premium flip (the post-upgrade
  // jump right after checkout) does NOT tear down and restart the 6-attempt
  // poll (each restart also fired an extra persistPremiumBackup upsert), which
  // was the compounding re-render + write storm behind the post-upgrade
  // flicker. The ref is set synchronously the moment the poll begins, so it
  // never gates auth *before* the poll actually starts; the poll always runs
  // and completes on every fresh sign-in (a new user id), preserving
  // sign-in/sign-up redirect behavior (this is what #324's reverted
  // session-keying got wrong — never re-introduce a pre-poll gate).
  const premiumPollStartedFor = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !auth.user?.id) {
      // Signed out / cleared — reset so the next sign-in re-verifies premium.
      premiumPollStartedFor.current = null;
      return;
    }

    // Already polled for this user id this session — do not re-enter when
    // `premium` flips (it is intentionally not a dependency below).
    if (premiumPollStartedFor.current === auth.user.id) return;
    premiumPollStartedFor.current = auth.user.id;

    let cancelled = false;
    const timeoutEntries = [];
    const waitWithTimeout = (ms) => new Promise((resolve) => {
      const entry = { timeoutId: null, resolve };
      entry.timeoutId = setTimeout(() => {
        const idx = timeoutEntries.indexOf(entry);
        if (idx >= 0) timeoutEntries.splice(idx, 1);
        resolve();
      }, ms);
      timeoutEntries.push(entry);
    });

    const syncPremiumStatus = async () => {
      // Reconcile a stale cross-account seed. On the very first render the
      // premium state was seeded from the sticky flag before the real user id
      // was known. If the surviving marker belongs to a DIFFERENT account (or
      // there is no marker at all), drop back to Free rather than inheriting
      // another account's premium. The server poll below is the durable source
      // of truth and re-grants a genuine paid user.
      if (premium === true && !isStickyPaid(auth.user.id)) {
        setPremium(false);
      }

      let result = null;
      let attemptsCompleted = 0;
      const attemptDelays = [0, 1000, 1000, 5000, 15000, 30000];

      for (let index = 0; index < attemptDelays.length; index += 1) {
        if (cancelled) return;

        await waitWithTimeout(attemptDelays[index]);
        if (cancelled) return;

        const attemptNumber = index + 1;
        attemptsCompleted = attemptNumber;
        console.log(`[Premium Sync] Fetch attempt ${attemptNumber}/6`);

        const query = await fetchProfilePremium(auth.user.id);
        if (!query.ok) continue;

        result = query;

        if (query.premium === true) break;
        if (query.premium === false) break;
      }

      if (cancelled) return;

      if (!result) {
        if (attemptsCompleted >= 6) {
          console.warn('[Premium Sync] Premium lookup failed after 6 attempts. Keeping local premium state.');
        } else {
          console.warn('[Premium Sync] Keeping local premium after profile query failure.');
        }
        return;
      }

      if (result.premium === true) {
        // Genuine server-side grant — re-apply it locally (and record the
        // owning account) without writing anything to the DB: the server
        // already has premium=true.
        setPremium(true);
        setPremiumFlag(auth.user.id);
        setSubscriptionData({ plan: 'family', status: 'active', nextBilling: null });
        return;
      }

      // result.premium is null (profile not found / grant not visible yet) or
      // false (server says not paid). Do NOT write premium=true to the profile
      // from a device-local marker — that is the cross-account leak. Keep the
      // current local state: a genuine paid user whose webhook is still syncing
      // stays paid via the sticky marker; a never-paid account stays Free.
      if (result.premium === null && attemptsCompleted >= 6) {
        console.warn('[Premium Sync] Premium remained null after 6 attempts. Keeping local premium state.');
      }
    };

    syncPremiumStatus();

    return () => {
      cancelled = true;
      timeoutEntries.forEach(({ timeoutId, resolve }) => {
        clearTimeout(timeoutId);
        resolve();
      });
      timeoutEntries.length = 0;
    };
    // `premium` is intentionally NOT a dependency: the poll is keyed to the
    // signed-in user id via premiumPollStartedFor and must run once per
    // session, so a mid-session premium flip cannot restart it.
  }, [isAuthenticated, auth.user?.id, fetchProfilePremium]);

  // ── Clear account-scoped subscription + premium state on sign-out ──
  // Guarded by `auth.loading` so this does NOT run on the very first mount
  // (before the session is restored) — clearing the sticky premium marker
  // early would bounce a returning paid user to the paywall before the server
  // poll re-grants them. It only fires on a real sign-out / session expiry,
  // after the session state has settled.
  useEffect(() => {
    if (!isAuthenticated && !auth.loading) {
      clearSubscriptionData();
      setPremium(false);
    }
  }, [isAuthenticated, auth.loading]);

  return {
    // Auth (delegated from useSupabaseAuth)
    user: auth.user,
    session: auth.session,
    loading: auth.loading,
    isRecovery: auth.isRecovery,
    authError: auth.authError,
    clearAuthError: auth.clearAuthError,
    signUp: auth.signUp,
    signIn: auth.signIn,
    signInWithGoogle: auth.signInWithGoogle,
    signInWithApple: auth.signInWithApple,
    signOut: auth.signOut,
    resetPassword: auth.resetPassword,
    updatePassword: auth.updatePassword,
    checkPremium: auth.checkPremium,
    setPremiumStatus: auth.setPremiumStatus,
    clearRecovery: auth.clearRecovery,

    // Premium
    isAuthenticated,
    premium,
    setPremium,
  };
}
