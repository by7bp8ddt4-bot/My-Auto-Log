import { useState, useCallback, useEffect, useRef } from 'react';
import { useSupabaseAuth } from './useSupabaseData.js';
import { supabase } from '../lib/supabase.js';
import { STORAGE_KEYS } from '../utils/constants.js';
import { isStickyPaid } from '../utils/tiering.js';
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
  // Seeded from the STICKY paid marker (premium flag OR active/trialing
  // subscription plan+status) so a post-payment fresh load — new tab,
  // browser reopen, Capacitor iOS webview — starts paid instead of bouncing
  // back to the paywall before the server-side profile sync catches up.
  const [premium, setPremium] = useState(() => {
    return isStickyPaid();
  });

  // ── Premium persistence helpers ────────────────────────────────
  const persistPremiumBackup = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: userId, premium: true, updated_at: new Date().toISOString() });
      if (error) {
        console.warn('[Premium Sync] Failed to persist premium backup:', error);
      }
    } catch (error) {
      console.warn('[Premium Sync] Failed to persist premium backup:', error);
    }
  }, []);

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

  // Which auth session the premium-confirmation poll has already started for.
  // Guards against re-entering the poll when `premium` flips mid-session.
  const premiumSyncStartedFor = useRef(null);
  // ── Premium sync with Supabase ────────────────────────────────
  // NOTE: this premium-confirmation poll must run ONCE per auth session, NOT
  // restart whenever `premium` flips. Right after a successful checkout/upgrade
  // the app writes premium + subscription keys and `premium` toggles; if this
  // effect re-ran on that flip it would start a fresh 6-attempt profile poll +
  // re-upsert each time. Stacked on top of the sign-in wipe + two-way sync firing
  // in the same transition, that compounding churn renders the whole screen
  // unreadable (the "rapid flicker") right after an Apple/Family upgrade. Keying
  // the run to the session (isAuthenticated + user id) instead of the premium
  // bool makes it run exactly once per sign-in/session-restore — still seeding
  // sticky premium and confirming the cloud grant, never re-entering for a
  // mid-session premium write.
  useEffect(() => {
    if (!isAuthenticated || !auth.user?.id) {
      // Signed out / cleared — reset so the next sign-in re-verifies premium.
      premiumSyncStartedFor.current = null;
      return;
    }
    const sessionKey = `${isAuthenticated}:${auth.user?.id}`;
    if (premiumSyncStartedFor.current === sessionKey) return; // already syncing this session
    premiumSyncStartedFor.current = sessionKey;
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
      // Sticky paid = any local marker survived the reload. This keeps the
      // user paid (and re-upserts profiles.premium=true below) even when a
      // fresh profile query returns null/false, so a paying customer is never
      // downgraded to the paywall while the cloud grant is still syncing.
      const localPremium = isStickyPaid() || premium === true;

      if (localPremium) {
        localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
        if (!premium) setPremium(true);
        await persistPremiumBackup(auth.user.id);
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
        setPremium(true);
        localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
        setSubscriptionData({ plan: 'family', status: 'active', nextBilling: null });
        return;
      }

      if (result.premium === null) {
        // Profile not found / grant not visible yet. If a local sticky marker
        // exists the user IS paid — re-upsert the server grant so the cloud
        // catches up, and never downgrade.
        if (isStickyPaid() || premium === true) {
          await persistPremiumBackup(auth.user.id);
        }
        if (attemptsCompleted >= 6) {
          console.warn('[Premium Sync] Premium remained null after 6 attempts. Keeping local premium state.');
        }
        return;
      }

      // DB responded with premium=false. Never auto-downgrade: any surviving
      // local marker means the user was granted premium — re-upsert the grant.
      if (isStickyPaid() || premium === true) {
        await persistPremiumBackup(auth.user.id);
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
  // `premium` is intentionally omitted: the poll runs once per auth session via
  // premiumSyncStartedFor, so a mid-session premium flip (post-checkout jump)
  // must not restart the confirm/re-upsert cycle and re-render the tree.
  }, [isAuthenticated, auth.user?.id, fetchProfilePremium, persistPremiumBackup]);

  // ── Clear subscription data on sign-out ────────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      clearSubscriptionData();
    }
  }, [isAuthenticated]);

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
