import { useState, useCallback, useEffect, useRef } from 'react';
import Layout from './components/Layout.jsx';
import LandingPage from './components/LandingPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import VehicleList from './components/VehicleList.jsx';
import MaintenanceLog from './components/MaintenanceLog.jsx';
import RemindersPage from './components/RemindersPage.jsx';
import DocumentsPage from './components/DocumentsPage.jsx';
import PremiumPaywall from './components/PremiumPaywall.jsx';
import Settings from './components/Settings.jsx';
import SyncIndicator from './components/SyncIndicator.jsx';
import AuthPage from './components/AuthPage.jsx';
import MaintenanceSchedule from './components/MaintenanceSchedule.jsx';
import FuelLog from './components/FuelLog.jsx';
import MileageChart from './components/MileageChart.jsx';
import Modifications from './components/Modifications.jsx';
import FuseBox from './components/FuseBox.jsx';
import ContactSupport from './components/ContactSupport.jsx';
import SubscriptionManagement, { setSubscriptionData, getSubscriptionData, clearSubscriptionData } from './components/SubscriptionManagement.jsx';
import ErrorBoundary, { setupGlobalErrorHandlers } from './components/ErrorBoundary.jsx';
import { useSupabaseData, useSupabaseAuth } from './hooks/useSupabaseData.js';
import { useLocalStorage, useSyncStatus, sanitizeForStorage } from './hooks/useLocalStorage.js';
import useAnalytics from './hooks/useAnalytics.js';
import { STORAGE_KEYS } from './utils/constants.js';
import { generateAutoReminders, summarizeAutoReminders } from './utils/autoReminders.js';
import { isSameService } from './hooks/useMaintenanceSchedule.js';
import { supabase } from './lib/supabase.js';

// Migration: myautolog_ → mtxtrkr_ localStorage keys (runs once on import)
try {
(function migrateStorageKeys() {
  const OLD_PREFIX = 'myautolog_';
  const NEW_PREFIX = 'mtxtrkr_';
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(OLD_PREFIX)) {
      const newKey = key.replace(OLD_PREFIX, NEW_PREFIX);
      if (!localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, localStorage.getItem(key));
      }
    }
  }
  // Remove old keys after copying
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(OLD_PREFIX)) keysToRemove.push(key);
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
})();
} catch (e) {
  console.warn('[Storage] Migration failed (corrupted data?):', e);
}

export default function App() {
  // Global error handlers — logs uncaught errors/unhandled rejections to console
  setupGlobalErrorHandlers();
  const [page, setPage] = useState(() => {
    // Show auth page if URL path is /auth or /auth.html or recovery hash detected
    if (window.location.pathname === '/auth' || window.location.pathname === '/auth.html') return 'auth';
    if (window.location.hash && window.location.hash.includes('type=recovery')) return 'auth';
    // Check sessionStorage (set by auth.html redirect page)
    try {
      if (sessionStorage.getItem('mtxtrkr_recovery_hash')) return 'auth';
    } catch(e) {}
    return 'landing';
  });
  const [premium, setPremium] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS) === 'true';
  });
  const [forceOffline, setForceOffline] = useState(false);
  const [cancelSubDialog, setCancelSubDialog] = useState(false);
  // Supabase write error banner — shown when any data store's last write failed
  const [supabaseError, setSupabaseError] = useState(null);
  // Tracks whether initial Supabase→localStorage sync has completed.
  // Resets when the user changes (sign-in/out) so sync re-runs on every session.
  const [initialSyncDone, setInitialSyncDone] = useState(false);

  // Global selected vehicle — persists across pages, saved to localStorage
  const [selectedVehicleId, setSelectedVehicleId] = useState(() => {
    return localStorage.getItem('mtxtrkr_selected_vehicle') || null;
  });

  const handleSelectVehicle = useCallback((id) => {
    setSelectedVehicleId(id);
    localStorage.setItem('mtxtrkr_selected_vehicle', id);
  }, []);

  // Supabase auth
  const auth = useSupabaseAuth();
  const isAuthenticated = !!auth.user;

  // Analytics hook — auto-tracks page views and user identity (after auth)
  const analytics = useAnalytics(page, auth.user, premium);

  // Activate premium from URL parameter (mobile-friendly activation link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('activate') === 'premium') {
      localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
      const plan = params.get('plan') || 'monthly';
      const nextBilling = params.get('next_billing') || null;
      setSubscriptionData({ plan, status: 'active', nextBilling });
      setPremium(true);
      analytics.track('premium_activated', { method: 'url_param', plan });

      // Only clear URL & persist to Supabase when auth is ready
      if (auth.user?.id) {
        supabase.from('profiles').upsert({ id: auth.user.id, premium: true });
        window.history.replaceState({}, '', window.location.pathname);
      }
      // else: keep the URL param so this effect re-runs when auth loads
    }

    // Stripe checkout success — set premium when user returns from payment
    if (params.get('payment_success') === 'true') {
      localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
      setPremium(true);
      analytics.track('premium_activated', { method: 'stripe_checkout' });

      // Only clear URL & persist to Supabase when auth is ready
      if (auth.user?.id) {
        supabase.from('profiles').upsert({ id: auth.user.id, premium: true });
        window.history.replaceState({}, '', window.location.pathname);
      }
      // else: keep the URL param so this effect re-runs when auth loads
    }

    // Premium restore URL — forces premium=true in both localStorage and Supabase
    // Use: visit https://mtxtrkr.vercel.app/?restore-premium=1 while signed in
    // IMPORTANT: Do NOT make this useEffect callback async — React doesn't
    // accept async effect callbacks and will crash the entire component tree
    // in production (blank/dark screen). Use .then() chaining instead.
    //
    // Set React state AND localStorage IMMEDIATELY (before auth resolves).
    // The cleanup effect no longer calls setPremium(false), so there is no
    // race — React state and localStorage stay in sync, and the premium
    // sync effect verifies against Supabase on the next auth cycle.
    if (params.get('restore-premium') === '1') {
      localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
      setSubscriptionData({ plan: 'monthly', status: 'active', nextBilling: null });
      setPremium(true);
      analytics.track('premium_activated', { method: 'restore_url' });

      // Fire-and-forget Supabase upsert; only clean URL on confirmed success
      if (auth.user?.id) {
        supabase.from('profiles').upsert({
          id: auth.user.id,
          premium: true,
          updated_at: new Date().toISOString()
        }).then(({ error }) => {
          if (!error) {
            window.history.replaceState({}, '', window.location.pathname);
          }
        });
      }
      // else: keep the URL param so this effect re-runs when auth loads
    }

    // Mileage update deep-link — e.g. https://mtxtrkr.com/dashboard?update-mileage=VEHICLE_ID
    // Used by: mileage reminder email per-vehicle CTAs
    // Selects the vehicle, navigates to dashboard, and stores pending edit in sessionStorage
    const updateMileageId = params.get('update-mileage');
    if (updateMileageId) {
      // Store for VehicleList auto-edit if user later navigates to vehicles page
      sessionStorage.setItem('mtxtrkr_pending_edit_vehicle', updateMileageId);
      // Select vehicle globally and navigate to dashboard
      handleSelectVehicle(updateMileageId);
      setPage('dashboard');
      // Clear URL param to prevent re-selection on subsequent renders
      if (auth.user?.id) {
        window.history.replaceState({}, '', window.location.pathname);
      }
      // else: keep the URL param so this effect re-runs when auth loads
    }
  }, [auth.user?.id]);

  // Auto-navigate to auth page when password recovery is detected
  useEffect(() => {
    if (auth.isRecovery && page !== 'auth') {
      setPage('auth');
    }
  }, [auth.isRecovery, page]);

  // Auto-navigate to auth page when an OAuth callback error is detected
  // (e.g. Apple Sign-In "sign up not completed"). This covers the case
  // where the user returns from the OAuth redirect to / (landing) but
  // the session was not created — we need to show the auth page with
  // the error so the user knows what happened.
  useEffect(() => {
    if (auth.authError && !isAuthenticated && !auth.loading && page !== 'auth') {
      setPage('auth');
    }
  }, [auth.authError, isAuthenticated, auth.loading, page]);

  // Auto-redirect to dashboard when user signs in / auth loads (skip during password recovery)
  useEffect(() => {
    if (isAuthenticated && !auth.loading && (page === 'auth' || page === 'landing') && !auth.isRecovery) {
      analytics.track('auth_auto_redirect', { fromPage: page });
      setPage('dashboard');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, auth.loading, page]);

  // Data stores — always call hooks in same order (React rules)
  const supabaseVehicles = useSupabaseData('vehicles', auth.user?.id);
  const supabaseLogs = useSupabaseData('maintenance_logs', auth.user?.id);
  const supabaseReminders = useSupabaseData('reminders', auth.user?.id);
  const supabaseProfile = useSupabaseData('profiles', auth.user?.id, 'id');
  const supabaseFuelLogs = useSupabaseData('fuel_logs', auth.user?.id);
  const supabaseMods = useSupabaseData('modifications', auth.user?.id);
  const supabaseDocuments = useSupabaseData('documents', auth.user?.id);
  
  const localVehicles = useLocalStorage(STORAGE_KEYS.VEHICLES, []);
  const localLogs = useLocalStorage(STORAGE_KEYS.MAINTENANCE_LOGS, []);
  const localReminders = useLocalStorage(STORAGE_KEYS.REMINDERS, []);
  const localFuelLogs = useLocalStorage('mtxtrkr_fuel_logs', []);
  const localMods = useLocalStorage('mtxtrkr_modifications', []);
  const localDocuments = useLocalStorage(STORAGE_KEYS.DOCUMENTS, []);

  // One-time stale cache cleanup: wipe supabase_cache_* keys and reset migration
  // flags so the migrations below re-run. The supabase_cache_* keys are only a
  // fetch cache — the real data lives in mtxtrkr_* (primary store) and supabase_*
  // (legacy cache). Wiping the stale fetch cache forces useSupabaseData to
  // re-fetch from Supabase, which then triggers the sync effect.
  const staleCleanupDone = 'mtxtrkr_stale_cache_cleaned';
  useEffect(() => {
    if (localStorage.getItem(staleCleanupDone)) return;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('supabase_cache_')) localStorage.removeItem(key);
    }
    localStorage.removeItem('mtxtrkr_cache_migrated');
    localStorage.removeItem('mtxtrkr_supabase_cache_migrated');
    localStorage.setItem(staleCleanupDone, 'true');
  }, []);

  // One-time migration: old Supabase cache keys → new localStorage keys
  // The old useSupabaseData hook cached under 'supabase_*' keys.
  // We now use localStorage as primary store under 'mtxtrkr_*' keys.
  // Migrate any data from old cache to new keys to prevent data loss.
  const cacheMigrationKey = 'mtxtrkr_cache_migrated';
  useEffect(() => {
    if (localStorage.getItem(cacheMigrationKey)) return;
    const oldToNew = {
      'supabase_vehicles': STORAGE_KEYS.VEHICLES,
      'supabase_maintenance_logs': STORAGE_KEYS.MAINTENANCE_LOGS,
      'supabase_reminders': STORAGE_KEYS.REMINDERS,
      'supabase_fuel_logs': 'mtxtrkr_fuel_logs',
      'supabase_modifications': 'mtxtrkr_modifications',
    };
    for (const [oldKey, newKey] of Object.entries(oldToNew)) {
      try {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          const parsed = JSON.parse(oldData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const existing = localStorage.getItem(newKey);
            const existingParsed = existing ? JSON.parse(existing) : [];
            // Only copy if new key is empty or has less data
            if (existingParsed.length < parsed.length) {
              localStorage.setItem(newKey, JSON.stringify(parsed));
            }
          }
        }
      } catch (e) {
        console.warn(`[Cache migration] Failed to migrate ${oldKey}:`, e);
      }
    }
    localStorage.setItem(cacheMigrationKey, 'true');
  }, []);

  // One-time migration: old Supabase cache keys → new supabase_cache_ namespace
  // The useSupabaseData hook now uses 'supabase_cache_' prefix (separate from
  // the 'mtxtrkr_' main store prefix) to avoid the collision introduced in PR #35.
  // Migrate any stale 'supabase_*' cache data to the new namespace.
  const supabaseCacheMigrationKey = 'mtxtrkr_supabase_cache_migrated';
  useEffect(() => {
    if (localStorage.getItem(supabaseCacheMigrationKey)) return;
    const oldToCacheNew = {
      'supabase_vehicles': 'supabase_cache_vehicles',
      'supabase_maintenance_logs': 'supabase_cache_maintenance_logs',
      'supabase_reminders': 'supabase_cache_reminders',
      'supabase_fuel_logs': 'supabase_cache_fuel_logs',
      'supabase_modifications': 'supabase_cache_modifications',
    };
    for (const [oldKey, newKey] of Object.entries(oldToCacheNew)) {
      try {
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          const parsed = JSON.parse(oldData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const existing = localStorage.getItem(newKey);
            const existingParsed = existing ? JSON.parse(existing) : [];
            if (existingParsed.length < parsed.length) {
              localStorage.setItem(newKey, JSON.stringify(parsed));
            }
          }
        }
      } catch (e) {
        console.warn(`[Supabase cache migration] Failed for ${oldKey}:`, e);
      }
    }
    // Recovery: if the mtxtrkr_ primary store was wiped during PR #35's collision
    // window but data still survives in the old supabase_* cache keys, restore it.
    // This is the one-time data recovery for users affected by the key collision.
    const primaryRecoveryMap = {
      'supabase_vehicles': STORAGE_KEYS.VEHICLES,
      'supabase_maintenance_logs': STORAGE_KEYS.MAINTENANCE_LOGS,
      'supabase_reminders': STORAGE_KEYS.REMINDERS,
      'supabase_fuel_logs': 'mtxtrkr_fuel_logs',
      'supabase_modifications': 'mtxtrkr_modifications',
    };
    for (const [oldKey, newKey] of Object.entries(primaryRecoveryMap)) {
      try {
        const existingData = localStorage.getItem(newKey);
        const existingParsed = existingData ? JSON.parse(existingData) : [];
        // Only recover if the primary store is empty (data was wiped)
        if (!Array.isArray(existingParsed) || existingParsed.length === 0) {
          const oldData = localStorage.getItem(oldKey);
          if (oldData) {
            const parsed = JSON.parse(oldData);
            if (Array.isArray(parsed) && parsed.length > 0) {
              localStorage.setItem(newKey, JSON.stringify(parsed));
              console.log(`[Recovery] Restored ${parsed.length} items from ${oldKey} to ${newKey}`);
            }
          }
        }
      } catch (e) {
        console.warn(`[Recovery] Failed for ${oldKey}:`, e);
      }
    }
    localStorage.setItem(supabaseCacheMigrationKey, 'true');
  }, []);

  // Supabase-first architecture: Supabase is the source of truth.
  // Every write goes to Supabase first, then mirrors to localStorage as an offline cache.
  // localStorage is used for fast initial render and offline access, never as primary storage.
  const vehiclesStore = supabaseVehicles;
  const logsStore = supabaseLogs;
  const remindersStore = supabaseReminders;
  const fuelLogsStore = supabaseFuelLogs;
  const modsStore = supabaseMods;
  const documentsStore = supabaseDocuments;

  // Aggregate Supabase write errors from all stores into a single dismissible banner
  useEffect(() => {
    const stores = [
      { name: 'Vehicles', store: supabaseVehicles },
      { name: 'Maintenance Logs', store: supabaseLogs },
      { name: 'Reminders', store: supabaseReminders },
      { name: 'Fuel Logs', store: supabaseFuelLogs },
      { name: 'Modifications', store: supabaseMods },
      { name: 'Documents', store: supabaseDocuments },
    ];
    const failing = stores.filter(s => s.store.error).map(s => `${s.name}: ${s.store.error}`);
    if (failing.length > 0) {
      setSupabaseError(`Supabase sync issue — data saved locally and will retry. ${failing.join('; ')}`);
    }
  }, [
    supabaseVehicles.error, supabaseLogs.error, supabaseReminders.error,
    supabaseFuelLogs.error, supabaseMods.error, supabaseDocuments.error
  ]);

  // Mirror Supabase data to localStorage cache for offline access and fast hydration
  // Maps supabase_cache_* keys → mtxtrkr_* keys for backward compatibility
  const CACHE_MIRROR_MAP = [
    { store: supabaseVehicles, local: localVehicles, key: STORAGE_KEYS.VEHICLES },
    { store: supabaseLogs, local: localLogs, key: STORAGE_KEYS.MAINTENANCE_LOGS },
    { store: supabaseReminders, local: localReminders, key: STORAGE_KEYS.REMINDERS },
    { store: supabaseFuelLogs, local: localFuelLogs, key: 'mtxtrkr_fuel_logs' },
    { store: supabaseMods, local: localMods, key: 'mtxtrkr_modifications' },
    { store: supabaseDocuments, local: localDocuments, key: STORAGE_KEYS.DOCUMENTS },
  ];

  // Mirror Supabase data → localStorage cache whenever Supabase state changes
  useEffect(() => {
    if (!isAuthenticated) return;
    for (const { store, key } of CACHE_MIRROR_MAP) {
      const supabaseData = store.data || [];
      if (supabaseData.length > 0) {
        try {
          const sanitized = sanitizeForStorage(supabaseData);
          localStorage.setItem(key, JSON.stringify(sanitized));
        } catch (e) {
          console.warn(`[CacheMirror] Failed to write ${key}:`, e);
        }
      }
    }
  }, [isAuthenticated,
    supabaseVehicles.data, supabaseLogs.data, supabaseReminders.data,
    supabaseFuelLogs.data, supabaseMods.data, supabaseDocuments.data
  ]);

  // Sync premium status between Supabase and localStorage
  // Priority: localStorage -> Supabase (write local to DB on detection)
  //          : Supabase -> localStorage (restore from DB when local is missing)
  useEffect(() => {
    if (!isAuthenticated) return;
    // Wait for the profile fetch to finish before checking DB premium status.
    // Without this guard, the effect fires when supabaseProfile.data is still []
    // and never re-runs because 'loading' wasn't in the dependency array.
    if (supabaseProfile.loading) return;

    if (supabaseProfile.data.length > 0) {
      const dbPremium = supabaseProfile.data[0].premium;
      // DB says premium but local doesn't → restore local (e.g. new device login).
      // Check localStorage directly (not React state) because the stale-data cleanup
      // effect at line ~362 wipes localStorage on every auth change, but premium React
      // state survives the wipe (initialized at mount). Using React state creates a
      // catch-22: if premium=true at mount, the wipe clears localStorage, the guard
      // blocks, and subscription data is never restored.
      if (dbPremium === true && localStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS) !== 'true') {
        setPremium(true);
        localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
        // Restore subscription data for premium users who don't have it in localStorage
        // (e.g. after clearing localStorage or signing in on a new device).
        // The actual subscription management (cancel, upgrade) is handled by Stripe,
        // so the exact plan/status values are informational — 'active' keeps the UI correct.
        if (!localStorage.getItem('mtxtrkr_subscription_status')) {
          setSubscriptionData({ plan: 'monthly', status: 'active', nextBilling: null });
        }
      }
      // Local says premium but DB doesn't → persist to DB (e.g. Stripe activation)
      if (premium && !dbPremium) {
        supabase.from('profiles').upsert({ id: auth.user.id, premium: true });
      }
    } else if (premium) {
      // No profile row yet but localStorage says premium — create one
      supabase.from('profiles').upsert({ id: auth.user.id, premium: true });
    }
  }, [isAuthenticated, supabaseProfile.data, supabaseProfile.loading, premium]);


  // Reset initialSyncDone when the user changes (signs in, signs out, or switches accounts)
  // This ensures the sync effect re-runs for every new auth session.
  // Also clears stale localStorage data from a previous user to prevent
  // data contamination across accounts on shared devices (QA testing, etc.).
  //
  // KEY FIX: Only wipe localStorage when the authenticated user actually changes
  // to a DIFFERENT user. On hard refresh (Ctrl+Shift+R), Supabase auth briefly
  // transitions through SIGNED_OUT→SIGNED_IN with the SAME user, which would
  // previously trigger a full localStorage wipe and permanent data loss.
  // We track the previous user ID in sessionStorage (survives refresh, cleared
  // on tab close) so we can distinguish "same user refreshed" from "new user
  // signed in" and skip the wipe accordingly.
  useEffect(() => {
    setInitialSyncDone(false);

    const currentUserId = auth.user?.id || null;
    const previousUserId = previousUserIdRef.current;
    const isSameUser = currentUserId && previousUserId && currentUserId === previousUserId;

    // Clear stale localStorage data from previous user.
    // Protect account-level and one-time flags — these should never be wiped on
    // auth changes. Wiping them causes data loss or catch-22s with sync effects.
    const PROTECTED_KEYS = [
      // mtxtrkr_premium_status protected as a fallback for slow Supabase fetches.
      // The premium sync effect verifies against Supabase on every auth change,
      // so a free user cannot permanently inherit premium from a previous session.
      'mtxtrkr_premium_status',           // fallback while Supabase verifies (cross-account leak prevented by premium sync effect)
      'mtxtrkr_subscription_status',
      'mtxtrkr_subscription_plan',
      'mtxtrkr_subscription_next_billing',
      'mtxtrkr_selected_vehicle',         // user's last-selected vehicle
      'mtxtrkr_logs_cleanup_done',        // one-time flag: prevents Supabase maintenance_logs deletion on every sign-in
      'mtxtrkr_stale_cache_cleaned',      // one-time flag: stale cache cleanup
      'mtxtrkr_cache_migrated',           // one-time flag: cache migration
      'mtxtrkr_supabase_cache_migrated',  // one-time flag: supabase cache migration
      'mtxtrkr_onboarding_dismissed',     // one-time flag: prevents onboarding wizard on every sign-in
      'mtxtrkr_performance_mods',         // performance-modified service flags (cleanable air filters, etc.)
      'mtxtrkr_pre_wipe_backup',          // forensic snapshot: saved before wipes for data-loss diagnosis
      'mtxtrkr_sw_nuked',                 // one-time flag: prevents SW nuke from re-running after auth wipes
    ];

    if (currentUserId) {
      // Track the authenticated user in sessionStorage so we can detect
      // same-user refreshes in future page loads.
      try {
        sessionStorage.setItem('mtxtrkr_previous_user_id', currentUserId);
        previousUserIdRef.current = currentUserId;
      } catch(e) { /* non-critical */ }

      if (isSameUser) {
        // Same user, same session — this is a refresh or re-render, NOT a
        // new sign-in. Skip the wipe entirely to preserve localStorage data.
        return;
      }

      // Different user (or first sign-in): proceed with the wipe.
      // IMPORTANT: Do NOT push old localStorage data to Supabase here.
      // The sign-out handler (handleLogout) and visibilitychange handler
      // already push data before the session ends, and the two-way sync
      // on sign-in handles loading the correct user's data. Pushing here
      // would write the PREVIOUS user's data under the NEW user's ID,
      // causing permanent cross-account data contamination (Bug #1).
      (async () => {
        // Save a forensic snapshot BEFORE wiping localStorage.
        // This creates an audit trail if data loss occurs — the snapshot
        // contains timestamps, data counts per store, and userId so we can
        // diagnose what was present before the wipe.
        try {
          const snapshot = {
            timestamp: new Date().toISOString(),
            userId: currentUserId,
            counts: {
              vehicles: (localVehicles.data || []).length,
              maintenance_logs: (localLogs.data || []).length,
              reminders: (localReminders.data || []).length,
              fuel_logs: (localFuelLogs.data || []).length,
              modifications: (localMods.data || []).length,
              documents: (localDocuments.data || []).length,
            },
            premiumStatus: localStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS),
          };
          localStorage.setItem('mtxtrkr_pre_wipe_backup', JSON.stringify(snapshot));
        } catch (e) {
          // Non-fatal: snapshot failure should not block the wipe
          console.warn('[Cleanup] Failed to save pre-wipe snapshot:', e);
        }
        // Wipe localStorage data keys to prevent cross-account contamination.
        // Premium state is NOT reset here — the premium sync effect (below)
        // verifies against Supabase on every auth change, handling both
        // restore (DB=true) and cross-account protection (DB=false) scenarios.
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('mtxtrkr_') || key.startsWith('supabase_cache_')) && !PROTECTED_KEYS.includes(key)) {
            localStorage.removeItem(key);
          }
        }
        // One-time cleanup: remove contaminated maintenance_logs from Supabase
        const CLEANUP_DONE_KEY = 'mtxtrkr_logs_cleanup_done';
        if (!localStorage.getItem(CLEANUP_DONE_KEY)) {
          const { error } = await supabase
            .from('maintenance_logs')
            .delete()
            .eq('user_id', currentUserId);
          if (!error) {
            localStorage.setItem(CLEANUP_DONE_KEY, 'true');
          }
        }
      })();
    } else if (!auth.loading) {
      // Genuinely signed out (auth finished loading and user is null).
      // Clear the sessionStorage tracking so the next sign-in is treated
      // as a fresh session.
      //
      // IMPORTANT: Do NOT clear sessionStorage when auth is still loading
      // (auth.loading === true). On page refresh, auth.user starts as null
      // during the brief loading window, and clearing sessionStorage here
      // would defeat the same-user detection on the next effect fire,
      // causing a full localStorage wipe and permanent data loss.
      try {
        sessionStorage.removeItem('mtxtrkr_previous_user_id');
        previousUserIdRef.current = null;
      } catch(e) { /* non-critical */ }
    }
  }, [auth.user?.id, auth.loading]);

  // On sign-in: wait for Supabase data to load, then hydrate localStorage cache.
  // With Supabase-first architecture, data is already in Supabase from direct writes.
  // No push step needed — just pull from Supabase and hydrate the cache.
  // The cache mirror effect above handles continuous mirroring; this effect
  // just ensures the cache is hydrated on the first page load after sign-in.
  useEffect(() => {
    if (!isAuthenticated || !auth.user?.id) return;

    const allLoaded = !supabaseVehicles.loading && !supabaseLogs.loading && !supabaseReminders.loading && !supabaseFuelLogs.loading && !supabaseMods.loading && !supabaseDocuments.loading;
    if (!allLoaded) return;

    if (initialSyncDone) return;
    setInitialSyncDone(true);
  }, [
    isAuthenticated, auth.user?.id, initialSyncDone,
    supabaseVehicles.loading, supabaseLogs.loading, supabaseReminders.loading, supabaseFuelLogs.loading, supabaseMods.loading, supabaseDocuments.loading
  ]);

  // References for offline reconciliation tracking
  const syncInProgress = useRef(false);
  // Tracks the previously-authenticated user ID across page refreshes.
  const previousUserIdRef = useRef((() => {
    try { return sessionStorage.getItem('mtxtrkr_previous_user_id') || null; }
    catch(e) { return null; }
  })());

  // Offline reconciliation: when coming back online, push any items
  // in Supabase store state that failed to write while offline.
  // Runs on visibility change (app switch, tab close) as a safety net.
  useEffect(() => {
    if (!isAuthenticated || !auth.user?.id) return;
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        // Push all Supabase store data to ensure any offline-failed writes are reconciled.
        // With Supabase-first, writes go direct to Supabase; this is only needed
        // for items that were added while offline (caught by useSupabaseData's fallback).
        const tables = [
          { store: supabaseVehicles, table: 'vehicles' },
          { store: supabaseLogs, table: 'maintenance_logs' },
          { store: supabaseReminders, table: 'reminders' },
          { store: supabaseFuelLogs, table: 'fuel_logs' },
          { store: supabaseMods, table: 'modifications' },
          { store: supabaseDocuments, table: 'documents' },
        ];
        for (const { store, table } of tables) {
          const items = store.data || [];
          if (items.length === 0) continue;
          for (const item of items) {
            try {
              const { createdAt, updatedAt, ...syncItem } = item;
              await supabase.from(table).upsert(
                { ...syncItem, user_id: auth.user.id },
                { onConflict: 'id' }
              );
            } catch (e) {
              console.warn(`[VisibilitySync] Failed to reconcile ${table}:`, e);
            }
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated, auth.user?.id,
    supabaseVehicles.data, supabaseLogs.data, supabaseReminders.data,
    supabaseFuelLogs.data, supabaseMods.data, supabaseDocuments.data
  ]);

  const sync = useSyncStatus();

  // Override online status when force offline is toggled
  const effectiveOnline = forceOffline ? false : sync.isOnline;

  // Listen for custom navigate events
  useEffect(() => {
    const handler = (e) => setPage(e.detail);
    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, []);

  // Navigate with page tracking
  const navigate = useCallback((p) => {
    setPage(p);
    sync.markChanged();
  }, [sync]);

  // Logout
  const handleLogout = useCallback(async () => {
    if (isAuthenticated && auth.user?.id) {
      analytics.track('user_logout', { page: 'settings' });
      analytics.logoutAnalytics();

      // Safety net: push all Supabase store data to ensure offline-added items
      // (caught by useSupabaseData's fallback) are reconciled before sign-out.
      // With Supabase-first architecture, most data is already in Supabase;
      // this only catches items that failed to write while offline.
      const dataStores = [
        { data: supabaseVehicles.data, table: 'vehicles' },
        { data: supabaseLogs.data, table: 'maintenance_logs' },
        { data: supabaseReminders.data, table: 'reminders' },
        { data: supabaseFuelLogs.data, table: 'fuel_logs' },
        { data: supabaseMods.data, table: 'modifications' },
        { data: supabaseDocuments.data, table: 'documents' },
      ];
      for (const { data, table } of dataStores) {
        const items = data || [];
        if (items.length === 0) continue;
        for (const item of items) {
          try {
            const { createdAt, updatedAt, ...syncItem } = item;
            await supabase.from(table).upsert(
              { ...syncItem, user_id: auth.user.id },
              { onConflict: 'id' }
            );
          } catch (e) {
            console.warn(`[Logout] Failed to push item to ${table}:`, e);
          }
        }
      }
      // Also sync premium status
      if (premium) {
        try {
          await supabase.from('profiles').upsert({ id: auth.user.id, premium: true });
        } catch (e) {
          console.warn('[Logout] Failed to sync premium status:', e);
        }
      }

      await auth.signOut();
    }
    // Set page to landing AFTER sign-out completes, so the auto-redirect
    // effect doesn't fire while isAuthenticated is still true and redirect
    // the user back to dashboard before the sign-out finishes.
    setPage('landing');
  }, [auth, isAuthenticated, analytics, premium,
    supabaseVehicles, supabaseLogs, supabaseReminders, supabaseFuelLogs, supabaseMods, supabaseDocuments]);

  // Add vehicle
  const addVehicle = useCallback(async (data) => {
    if (!premium && vehiclesStore.data.length >= 1) {
      analytics.track('premium_gate_hit', { gate: 'add_vehicle', vehicleCount: vehiclesStore.data.length });
      setPage('premium');
      return;
    }
    const mileage = parseInt(data.mileage) || 0;
    const vehicleData = { ...data, mileage };
    // With Supabase-first, add() writes to Supabase then updates React state synchronously.
    // Await to get the saved record for auto-reminder generation.
    const savedVehicle = await vehiclesStore.add(vehicleData);
    if (!savedVehicle) return; // No userId — shouldn't happen when authenticated

    // Auto-create reminders from manufacturer schedule (via VIN-decoded make/model)
    const autoReminders = generateAutoReminders(savedVehicle, remindersStore.data);
    for (const reminder of autoReminders) {
      await remindersStore.add(reminder);
    }
    
    analytics.track('vehicle_added', { make: data.make, model: data.model, year: data.year, autoReminders: autoReminders.length });
    if (autoReminders.length > 0) {
      analytics.track('auto_reminders_created', { count: autoReminders.length });
    }
    sync.markChanged();
  }, [premium, vehiclesStore, remindersStore, sync, analytics]);

  // Add maintenance log
  const addLog = useCallback(async (data) => {
    const logData = {
      ...data,
      mileage: parseInt(data.mileage) || 0,
      cost: parseFloat(data.cost) || 0,
    };
    // Ensure serviceTypes array is always stored for multi-job support
    if (!Array.isArray(logData.serviceTypes) || logData.serviceTypes.length === 0) {
      logData.serviceTypes = logData.serviceType ? [logData.serviceType] : ['Other'];
    }
    // Await Supabase write — must complete before we consider data "saved"
    try {
      const result = await logsStore.add(logData);
      if (result === null) {
        console.error('[addLog] Supabase write returned null — user may not be authenticated');
      } else if (logsStore.error) {
        console.warn('[addLog] Supabase write had error, saved to local cache only:', logsStore.error);
      }
    } catch (e) {
      console.error('[addLog] Unexpected error during Supabase write:', e);
    }
    analytics.track('maintenance_log_added', {
      serviceType: logData.serviceType,
      serviceTypes: logData.serviceTypes,
      cost: parseFloat(data.cost) || 0,
      vehicleId: data.vehicleId,
    });

    // Update matching reminders so the dashboard's "Upcoming Reminders"
    // section stays in sync with logged services.
    const serviceTypes = logData.serviceTypes;
    const logMileage = logData.mileage;
    const logDate = logData.date ? new Date(logData.date) : new Date();
    const matchedIds = new Set();
    for (const serviceType of serviceTypes) {
      for (const reminder of remindersStore.data) {
        if (
          reminder.vehicleId === logData.vehicleId &&
          !matchedIds.has(reminder.id) &&
          isSameService(reminder.title, serviceType)
        ) {
          matchedIds.add(reminder.id);
          const intervalMiles = reminder.intervalMiles || 5000;
          const intervalDays = reminder.intervalDays || 180;
          const newDueMileage = logMileage + intervalMiles;
          const newDueDate = new Date(logDate.getTime() + intervalDays * 86400000);
          // Await each reminder update to ensure Supabase writes complete
          try {
            await remindersStore.updateItem(reminder.id, {
              lastCompletedMileage: logMileage,
              lastCompletedDate: logData.date || logDate.toISOString(),
              dueMileage: newDueMileage,
              dueDate: newDueDate.toISOString(),
            });
          } catch (e) {
            console.warn('[addLog] Reminder update failed:', e);
          }
        }
      }
    }

    sync.markChanged();
  }, [logsStore, remindersStore, sync, analytics]);

  // Add reminder
  const addReminder = useCallback(async (data) => {
    try {
      const result = await remindersStore.add({
        ...data,
        enabled: true,
        lastCompletedMileage: parseInt(data.lastCompletedMileage) || 0,
        intervalMiles: parseInt(data.intervalMiles) || 5000,
        intervalDays: parseInt(data.intervalDays) || 180,
        dueMileage: data.dueMileage || 0,
        dueDate: data.dueDate || new Date(Date.now() + 180 * 86400000).toISOString(),
      });
      if (result === null) {
        console.error('[addReminder] Supabase write returned null — user may not be authenticated');
      } else if (remindersStore.error) {
        console.warn('[addReminder] Supabase write had error, saved to local cache only:', remindersStore.error);
      }
    } catch (e) {
      console.error('[addReminder] Unexpected error during Supabase write:', e);
    }
    analytics.track('reminder_added', {
      reminderType: data.title,
      intervalMiles: parseInt(data.intervalMiles) || 5000,
    });
    sync.markChanged();
  }, [remindersStore, sync, analytics]);

  // Add document (already uploaded to Supabase Storage by the modal)
  const handleAddDocument = useCallback((doc) => {
    localDocuments.add(doc);
    sync.markChanged();
  }, [localDocuments, sync]);

  // Delete document (also removes from Supabase Storage if has storagePath)
  const handleDeleteDocument = useCallback((id) => {
    localDocuments.remove(id);
    supabaseDocuments.remove(id);
    sync.markChanged();
  }, [localDocuments, supabaseDocuments, sync]);

  // Reset all data
  const handleReset = useCallback(async () => {
    if (!window.confirm('Are you sure? This will permanently delete ALL your data from both the app and the cloud. This cannot be undone.')) return;
    vehiclesStore.update([]);
    logsStore.update([]);
    remindersStore.update([]);
    fuelLogsStore.update([]);
    modsStore.update([]);
    documentsStore.update([]);
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
    localStorage.removeItem(STORAGE_KEYS.PREMIUM_STATUS);
    // Clear all mtxtrkr_ and supabase_cache_ keys from localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('mtxtrkr_') || key.startsWith('supabase_cache_') || key.startsWith('supabase_'))) localStorage.removeItem(key);
    }
    setPremium(false);
    analytics.track('data_reset', {});
    // Also delete cloud data if authenticated — await all deletions before returning
    if (auth.user?.id) {
      const tables = ['vehicles', 'maintenance_logs', 'reminders', 'fuel_logs', 'modifications', 'documents'];
      const results = await Promise.allSettled(
        tables.map(table =>
          supabase.from(table).delete().eq('user_id', auth.user.id)
        )
      );
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`[Reset] Failed to delete ${tables[i]}:`, r.reason);
        } else if (r.value?.error) {
          console.error(`[Reset] Failed to delete ${tables[i]}:`, r.value.error);
        }
      });
    }
    sync.markChanged();
    }, [vehiclesStore, logsStore, remindersStore, fuelLogsStore, modsStore, documentsStore, sync, analytics, auth.user?.id]);

  // Force sync from cloud — re-fetches Supabase data and updates cache.
  // Supabase-first architecture: data is always in Supabase, this just
  // refreshes the local cache for cross-device sync or recovery.
  const handleSyncFromCloud = useCallback(async () => {
    if (!auth.user?.id) return;
    const stores = [
      { store: supabaseVehicles, table: 'vehicles', key: STORAGE_KEYS.VEHICLES },
      { store: supabaseLogs, table: 'maintenance_logs', key: STORAGE_KEYS.MAINTENANCE_LOGS },
      { store: supabaseReminders, table: 'reminders', key: STORAGE_KEYS.REMINDERS },
      { store: supabaseFuelLogs, table: 'fuel_logs', key: 'mtxtrkr_fuel_logs' },
      { store: supabaseMods, table: 'modifications', key: 'mtxtrkr_modifications' },
      { store: supabaseDocuments, table: 'documents', key: STORAGE_KEYS.DOCUMENTS },
    ];
    // Helper to convert snake_case keys to camelCase
    const toCamel = (str) => str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
    const keysToCamel = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      if (Array.isArray(obj)) return obj.map(keysToCamel);
      const newObj = {};
      for (const key in obj) {
        newObj[toCamel(key)] = obj[key];
      }
      return newObj;
    };
    for (const { store, table, key } of stores) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', auth.user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        const camelData = keysToCamel(data || []);
        if (camelData.length > 0) {
          store.setData(camelData);
          // Also update localStorage cache directly for immediate availability
          try {
            const sanitized = sanitizeForStorage(camelData);
            localStorage.setItem(key, JSON.stringify(sanitized));
          } catch (e) {
            console.warn(`[SyncFromCloud] Failed to cache ${key}:`, e);
          }
        }
      } catch (err) {
        console.error(`[SyncFromCloud] Error fetching ${table}:`, err);
      }
    }
    // Also sync premium status from Supabase
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('premium')
        .eq('id', auth.user.id)
        .single();
      if (profile?.premium === true) {
        localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
        setPremium(true);
        if (!localStorage.getItem('mtxtrkr_subscription_status')) {
          setSubscriptionData({ plan: 'monthly', status: 'active', nextBilling: null });
        }
      }
    } catch (err) {
      console.error('[SyncFromCloud] Error fetching premium status:', err);
    }
    analytics.track('sync_from_cloud', {});
    sync.markChanged();
  }, [auth.user?.id, supabaseVehicles, supabaseLogs, supabaseReminders, supabaseFuelLogs, supabaseMods, supabaseDocuments, sync, analytics]);

  // Force push to cloud — reconciles Supabase store data to ensure all items
  // are in Supabase. With Supabase-first, most data is already there; this is
  // a safety net for offline-added items (caught by useSupabaseData's fallback).
  const handlePushToCloud = useCallback(async () => {
    if (!auth.user?.id) return;
    const stores = [
      { store: supabaseVehicles, table: 'vehicles' },
      { store: supabaseLogs, table: 'maintenance_logs' },
      { store: supabaseReminders, table: 'reminders' },
      { store: supabaseFuelLogs, table: 'fuel_logs' },
      { store: supabaseMods, table: 'modifications' },
      { store: supabaseDocuments, table: 'documents' },
    ];
    for (const { store, table } of stores) {
      const items = store.data || [];
      if (items.length === 0) continue;
      for (const item of items) {
        try {
          const { createdAt, updatedAt, ...syncItem } = item;
          await supabase.from(table).upsert(
            { ...syncItem, user_id: auth.user.id },
            { onConflict: 'id' }
          );
        } catch (e) {
          console.warn(`[PushToCloud] Failed to push ${table}:`, e);
        }
      }
    }
    // Also push premium status
    if (premium) {
      localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
      await supabase.from('profiles').upsert({ id: auth.user.id, premium: true });
    }
    analytics.track('push_to_cloud', {});
    sync.markChanged();
  }, [auth.user?.id, premium, supabaseVehicles, supabaseLogs, supabaseReminders, supabaseFuelLogs, supabaseMods, supabaseDocuments, sync, analytics]);

  // Delete account — remove all data and sign out
  const handleDeleteAccount = useCallback(async () => {
    try {
      // Pre-check: only block deletion for premium users with an active subscription.
      // Must confirm ALL THREE conditions: premium flag, non-null status, and status is active or trialing.
      // Stale localStorage (premium=true with null/missing status) should NOT block deletion.
      const sub = getSubscriptionData();
      const hasActiveSub = premium && sub?.status && (sub.status === 'active' || sub.status === 'trialing');

      if (hasActiveSub) {
        setCancelSubDialog(true);
        return;
      }

      if (!window.confirm('This will permanently delete ALL your data and account. This cannot be undone. Continue?')) return;
      console.log('[DeleteAccount] Starting deletion...');

      // Get the current session access token for auth
      const sessionResponse = await supabase.auth.getSession();
      const accessToken = sessionResponse?.data?.session?.access_token;
      if (!accessToken) {
        alert('You must be signed in to delete your account.');
        return;
      }

      // Call the serverless API to delete the user
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId: auth.user?.id }),
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.error === 'cancel_subscription_first') {
          alert('Please cancel your subscription first via the Stripe dashboard before deleting your account.');
          return;
        }
        throw new Error(result.error || 'Failed to delete account');
      }

      console.log('[DeleteAccount] Cloud data deleted, result:', result);

      // Clear all local data
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('mtxtrkr_') || key.startsWith('supabase_cache_') || key.startsWith('supabase_'))) localStorage.removeItem(key);
      }
      console.log('[DeleteAccount] Local data cleared');
      // Sign out
      await auth.signOut();
      setPage('landing');
      console.log('[DeleteAccount] Signed out');
    } catch (e) {
      console.error('[DeleteAccount] Error:', e);
      alert('Failed to delete account: ' + (e.message || 'Unknown error'));
    }
  }, [auth, analytics]);

  // Upgrade to premium — migrate localStorage data to Supabase, then activate
  const handleUpgrade = useCallback(async () => {
    // 1. Migrate localStorage data to Supabase if user is authenticated
    if (auth.user?.id) {
      // Map each localStorage dataset to its Supabase store with the appropriate key
      const migrations = [
        { store: supabaseVehicles, key: STORAGE_KEYS.VEHICLES },
        { store: supabaseLogs, key: STORAGE_KEYS.MAINTENANCE_LOGS },
        { store: supabaseReminders, key: STORAGE_KEYS.REMINDERS },
        { store: supabaseFuelLogs, key: 'mtxtrkr_fuel_logs' },
        { store: supabaseMods, key: 'mtxtrkr_modifications' },
        { store: supabaseDocuments, key: STORAGE_KEYS.DOCUMENTS },
      ];
      for (const { store, key } of migrations) {
        try {
          const raw = localStorage.getItem(key);
          if (raw) {
            const items = JSON.parse(raw);
            if (Array.isArray(items) && items.length > 0) {
              // Insert each item using the store's .add() method
              for (const item of items) {
                // Preserve id so the add() fallback doesn't create a new UUID
                const { createdAt, updatedAt, ...cleanItem } = item;
                await store.add(cleanItem);
              }
            }
          }
        } catch (e) {
          console.warn(`[Upgrade] Could not migrate ${key}:`, e);
        }
      }
    }

    // 2. Activate premium (after migration completes)
    localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
    if (auth.user?.id) {
      auth.setPremiumStatus(auth.user.id);
    }
    setPremium(true);
    analytics.track('premium_upgraded', { method: 'inline_button', userId: auth.user?.id });
    setPage('dashboard');
  }, [auth, supabaseVehicles, supabaseLogs, supabaseReminders, supabaseFuelLogs, supabaseMods, supabaseDocuments, analytics]);

  // Show auth page if not authenticated (after landing)
  /*
  if (page !== 'landing' && page !== 'premium' && !isAuthenticated && !auth.loading) {
    return (
      <>
        <AuthPage onAuth={auth} />
        <SyncIndicator
          isOnline={effectiveOnline}
          syncing={sync.syncing}
          lastSync={sync.lastSync}
          pendingChanges={sync.pendingChanges}
          forceOffline={forceOffline}
          setForceOffline={setForceOffline}
        />
      </>
    );
  }
  */

  // Render pages
  if (page === 'landing') {
    return (
      <ErrorBoundary>
        <LandingPage
          onGetStarted={() => { analytics.track('landing_get_started'); setPage('auth'); }}
          onViewPremium={() => { analytics.track('landing_view_premium'); setPage('premium'); }}
        />
        <SyncIndicator
          isOnline={effectiveOnline}
          syncing={sync.syncing}
          lastSync={sync.lastSync}
          pendingChanges={sync.pendingChanges}
          forceOffline={forceOffline}
          setForceOffline={setForceOffline}
        />
      </ErrorBoundary>
    );
  }

  if (page === 'premium') {
    return (
      <ErrorBoundary>
        <PremiumPaywall
        onClose={() => { analytics.track('premium_paywall_closed'); setPage('dashboard'); }}
        onUpgrade={handleUpgrade}
        userId={auth.user?.id}
        trackEvent={analytics.track}
      />
      </ErrorBoundary>
    );
  }

  const pages = {
    dashboard: <Dashboard
      vehicles={vehiclesStore.data}
      logs={logsStore.data}
      reminders={remindersStore.data}
      fuelLogs={fuelLogsStore.data}
      onNavigate={navigate}
      onAddLog={addLog}
      isPremium={premium}
      selectedVehicleId={selectedVehicleId}
      onSelectVehicle={handleSelectVehicle}
      isAuthenticated={isAuthenticated}
    />,
    vehicles: <VehicleList
      vehicles={vehiclesStore.data}
      onAdd={addVehicle}
      onEdit={(id, updates) => {
        vehiclesStore.updateItem(id, updates);
        sync.markChanged();
      }}
      onDelete={(id) => {
        vehiclesStore.remove(id);
        supabaseVehicles.remove(id);
        sync.markChanged();
      }}
      isPremium={premium}
      vehicleCount={vehiclesStore.data.length}
      onNavigate={navigate}
    />,
    logs: <MaintenanceLog
      logs={logsStore.data}
      vehicles={vehiclesStore.data}
      onAdd={addLog}
      onUpdate={(id, data) => {
        logsStore.updateItem(id, data);
        sync.markChanged();
      }}
      onDelete={(id) => {
        logsStore.remove(id);
        supabaseLogs.remove(id);
        sync.markChanged();
      }}
      onNavigate={navigate}
      isPremium={premium}
      selectedVehicleId={selectedVehicleId}
    />,
    reminders: <RemindersPage
      reminders={remindersStore.data}
      vehicles={vehiclesStore.data}
      logs={logsStore.data}
      onAdd={addReminder}
      onUpdate={(id, updates) => {
        remindersStore.updateItem(id, updates);
        sync.markChanged();
      }}
      onDelete={(id) => {
        remindersStore.remove(id);
        supabaseReminders.remove(id);
        sync.markChanged();
      }}
      isPremium={premium}
      onNavigate={navigate}
      selectedVehicleId={selectedVehicleId}
    />,
    settings: <Settings
      onReset={handleReset}
      onDeleteAccount={handleDeleteAccount}
      vehicles={vehiclesStore.data}
      logs={logsStore.data}
      reminders={remindersStore.data}
      fuelLogs={fuelLogsStore.data}
      modifications={modsStore.data}
      isAuthenticated={isAuthenticated}
      isPremium={premium}
      onNavigate={navigate}
      onLogout={handleLogout}
      showCancelSubDialog={cancelSubDialog}
      onDismissCancelSub={() => setCancelSubDialog(false)}
      onSyncFromCloud={handleSyncFromCloud}
      onPushToCloud={handlePushToCloud}
    />,
    mileage: <div className="p-4 max-w-4xl mx-auto">
      <MileageChart logs={logsStore.data} vehicles={vehiclesStore.data} isPremium={premium} />
    </div>,
    schedule: <MaintenanceSchedule
      vehicle={vehiclesStore.data.find(v => v.id === selectedVehicleId) || vehiclesStore.data[0] || null}
      logs={logsStore.data}
      onAddLog={addLog}
      onNavigate={navigate}
      selectedVehicleId={selectedVehicleId}
    />,
    fuel: <FuelLog
      logs={fuelLogsStore.data}
      vehicles={vehiclesStore.data}
      onAdd={async (data) => { try { await fuelLogsStore.add(data); } catch(e) { console.error('[FuelLog add]', e); } sync.markChanged(); }}
      onDelete={(id) => { supabaseFuelLogs.remove(id); fuelLogsStore.remove(id); sync.markChanged(); }}
      onUpdate={(id, data) => { fuelLogsStore.updateItem(id, data); sync.markChanged(); }}
      selectedVehicleId={selectedVehicleId}
    />,
    mods: <Modifications
      mods={modsStore.data}
      vehicles={vehiclesStore.data}
      onAdd={async (data) => { try { await modsStore.add(data); } catch(e) { console.error('[Mods add]', e); } sync.markChanged(); }}
      onDelete={(id) => { supabaseMods.remove(id); modsStore.remove(id); sync.markChanged(); }}
      onNavigate={navigate}
      isPremium={premium}
      selectedVehicleId={selectedVehicleId}
    />,
    documents: <DocumentsPage
      documents={localDocuments.data}
      onAddDocument={handleAddDocument}
      onDeleteDocument={handleDeleteDocument}
      vehicles={vehiclesStore.data}
      onNavigate={navigate}
      userId={auth.user?.id}
    />,
    wiring: <FuseBox
      selectedVehicle={vehiclesStore.data.find(v => v.id === selectedVehicleId) || vehiclesStore.data[0] || null}
    />,
    subscription: <SubscriptionManagement
      userId={auth.user?.id}
      isPremium={premium}
      onNavigate={navigate}
      trackEvent={analytics.track}
    />,
    contact: <ContactSupport
      onNavigate={navigate}
    />,
    auth: <AuthPage onAuth={auth} onNavigate={navigate} />,
  };

  return (
    <ErrorBoundary>
      <Layout currentPage={page} onNavigate={navigate} onLogout={handleLogout}>
        {(!isAuthenticated && !auth.loading && page !== 'landing' && page !== 'premium') ? pages.auth : (pages[page] || pages.dashboard)}
      </Layout>
      <SyncIndicator
        isOnline={effectiveOnline}
        syncing={sync.syncing}
        lastSync={sync.lastSync}
        pendingChanges={sync.pendingChanges}
        forceOffline={forceOffline}
        setForceOffline={setForceOffline}
      />
      {supabaseError && isAuthenticated && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm max-w-md text-center cursor-pointer"
             onClick={() => setSupabaseError(null)}
             role="alert">
          ⚠️ {supabaseError}
          <span className="block text-xs opacity-70 mt-1">Tap to dismiss</span>
        </div>
      )}
    </ErrorBoundary>
  );
}