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
  const [syncError, setSyncError] = useState(null); // temporary error banner for failed Supabase writes
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

  // Refs for Realtime → localStorage propagation (wired after local stores are created)
  const onVChange = useRef(null);
  const onLChange = useRef(null);
  const onRChange = useRef(null);
  const onFChange = useRef(null);
  const onMChange = useRef(null);
  const onDChange = useRef(null);

  // Stable callback wrappers that delegate to the latest ref value.
  // useCallback with [] deps ensures they never change identity, so useSupabaseData's
  // fetchData (which reads from the ref) is never unnecessarily recreated.
  const onVehiclesChange = useCallback((data) => { if (onVChange.current) onVChange.current(data); }, []);
  const onLogsChange = useCallback((data) => { if (onLChange.current) onLChange.current(data); }, []);
  const onRemindersChange = useCallback((data) => { if (onRChange.current) onRChange.current(data); }, []);
  const onFuelLogsChange = useCallback((data) => { if (onFChange.current) onFChange.current(data); }, []);
  const onModsChange = useCallback((data) => { if (onMChange.current) onMChange.current(data); }, []);
  const onDocumentsChange = useCallback((data) => { if (onDChange.current) onDChange.current(data); }, []);

  const supabaseVehicles = useSupabaseData('vehicles', auth.user?.id, 'user_id', onVehiclesChange);
  const supabaseLogs = useSupabaseData('maintenance_logs', auth.user?.id, 'user_id', onLogsChange);
  const supabaseReminders = useSupabaseData('reminders', auth.user?.id, 'user_id', onRemindersChange);
  const supabaseProfile = useSupabaseData('profiles', auth.user?.id, 'id');
  const supabaseFuelLogs = useSupabaseData('fuel_logs', auth.user?.id, 'user_id', onFuelLogsChange);
  const supabaseMods = useSupabaseData('modifications', auth.user?.id, 'user_id', onModsChange);
  const supabaseDocuments = useSupabaseData('documents', auth.user?.id, 'user_id', onDocumentsChange);

  const localVehicles = useLocalStorage(STORAGE_KEYS.VEHICLES, []);
  const localLogs = useLocalStorage(STORAGE_KEYS.MAINTENANCE_LOGS, []);
  const localReminders = useLocalStorage(STORAGE_KEYS.REMINDERS, []);
  const localFuelLogs = useLocalStorage('mtxtrkr_fuel_logs', []);
  const localMods = useLocalStorage('mtxtrkr_modifications', []);
  const localDocuments = useLocalStorage(STORAGE_KEYS.DOCUMENTS, []);

  // Wire up Realtime → localStorage propagation: after local stores are created,
  // point the refs at their update functions so that useSupabaseData's fetchData
  // (triggered by Realtime events) can push refreshed data into useLocalStorage.
  // Ref assignments run synchronously during render, while fetchData is async
  // (useEffect + Supabase call), so refs are set before any callback fires.
  onVChange.current = localVehicles.update;
  onLChange.current = localLogs.update;
  onRChange.current = localReminders.update;
  onFChange.current = localFuelLogs.update;
  onMChange.current = localMods.update;
  onDChange.current = localDocuments.update;

  // Aggregate unsynced changes across all Supabase stores
  const hasUnsyncedChanges =
    supabaseVehicles.hasUnsyncedChanges ||
    supabaseLogs.hasUnsyncedChanges ||
    supabaseReminders.hasUnsyncedChanges ||
    supabaseFuelLogs.hasUnsyncedChanges ||
    supabaseMods.hasUnsyncedChanges ||
    supabaseDocuments.hasUnsyncedChanges;

  // Helper to show a temporary error banner for failed Supabase writes.
  // Track the active timer so rapid sequential errors don't get cleared
  // by an earlier timer — each new error resets the 5s countdown.
  const syncErrorTimerRef = useRef(null);
  const showSyncError = useCallback((message) => {
    if (syncErrorTimerRef.current) clearTimeout(syncErrorTimerRef.current);
    setSyncError(message);
    syncErrorTimerRef.current = setTimeout(() => {
      setSyncError(null);
      syncErrorTimerRef.current = null;
    }, 5000);
  }, []);

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

  // Always use localStorage as the primary store — data persists forever
  // Supabase is only used for cloud sync (background) and cross-device portability
  const vehiclesStore = localVehicles;
  const logsStore = localLogs;
  const remindersStore = localReminders;
  const fuelLogsStore = localFuelLogs;
  const modsStore = localMods;
  const documentsStore = localDocuments;

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
        // Always restore subscription data when DB says premium.
        // Previously guarded by checking if the key existed in localStorage, but
        // that caused Bug #1: User A's "cancelled" status survived the auth-change
        // wipe (it was in PROTECTED_KEYS) and the guard prevented overwriting it.
        // Now subscription keys are NOT protected, so they're always wiped on auth
        // change, and this unconditional set restores correct state for premium users.
        setSubscriptionData({ plan: 'monthly', status: 'active', nextBilling: null });
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

  // Sync localStorage ↔ Supabase for data persistence
  // localStorage is always the primary source. Supabase is cloud backup.
  // Direction: local → Supabase (push on save)
  //            Supabase → local (pull on sign-in if local is empty — for cross-device)
  const syncStores = [
    { local: localVehicles, supabase: supabaseVehicles, key: STORAGE_KEYS.VEHICLES },
    { local: localLogs, supabase: supabaseLogs, key: STORAGE_KEYS.MAINTENANCE_LOGS },
    { local: localReminders, supabase: supabaseReminders, key: STORAGE_KEYS.REMINDERS },
    { local: localFuelLogs, supabase: supabaseFuelLogs, key: 'mtxtrkr_fuel_logs' },
    { local: localMods, supabase: supabaseMods, key: 'mtxtrkr_modifications' },
    { local: localDocuments, supabase: supabaseDocuments, key: STORAGE_KEYS.DOCUMENTS },
  ];

  // Reset initialSyncDone when the user changes (signs in, signs out, or switches accounts)
  // This ensures the sync effect re-runs for every new auth session.
  // Also clears stale localStorage data from a previous user to prevent
  // data contamination across accounts on shared devices (QA testing, etc.).
  useEffect(() => {
    setInitialSyncDone(false);
    pushedIdsRef.current = {};

    // CRITICAL: Reset all React state for data stores BEFORE clearing localStorage.
    // The localStorage wipe removes the on-disk data, but React state (useState hooks)
    // still holds the PREVIOUS user's data in memory. Without this reset, the two-way
    // sync effect reads stale React state (old user's vehicles/logs/etc.) and pushes
    // it to the new user's Supabase account — causing permanent cross-account
    // data contamination (Bug: "Sign in as wife, see husband's vehicles").
    //
    // We reset ALL local stores and supabase cache stores here. The two-way sync
    // effect depends on initialSyncDone (set to false above) AND allLoaded (supabase
    // stores must finish fetching). Since the supabase stores re-fetch when userId
    // changes, they will be in loading state during this reset, preventing the sync
    // from firing prematurely. By the time allLoaded becomes true, local data is []
    // and supabase data is the new user's — no stale data to push, no contamination.
    localVehicles.setData([]);
    localLogs.setData([]);
    localReminders.setData([]);
    localFuelLogs.setData([]);
    localMods.setData([]);
    localDocuments.setData([]);
    supabaseVehicles.resetData();
    supabaseLogs.resetData();
    supabaseReminders.resetData();
    supabaseFuelLogs.resetData();
    supabaseMods.resetData();
    supabaseDocuments.resetData();

    // Clear stale localStorage data from previous user.
    // Protect account-level and one-time flags — these should never be wiped on
    // auth changes. Wiping them causes data loss or catch-22s with sync effects.
    const PROTECTED_KEYS = [
      // mtxtrkr_premium_status protected as a fallback for slow Supabase fetches.
      // The premium sync effect verifies against Supabase on every auth change,
      // so a free user cannot permanently inherit premium from a previous session.
      'mtxtrkr_premium_status',           // fallback while Supabase verifies (cross-account leak prevented by premium sync effect)
      // Subscription keys intentionally NOT protected — they are ephemeral
      // Stripe-managed data that must be wiped on auth change. Protecting them
      // caused Bug #1: User A's "cancelled" status leaking into User B's session
      // via the premium sync effect's guard that only restores when the key is missing.
      'mtxtrkr_selected_vehicle',         // user's last-selected vehicle
      'mtxtrkr_logs_cleanup_done',        // one-time flag: prevents Supabase maintenance_logs deletion on every sign-in
      'mtxtrkr_stale_cache_cleaned',      // one-time flag: stale cache cleanup
      'mtxtrkr_cache_migrated',           // one-time flag: cache migration
      'mtxtrkr_supabase_cache_migrated',  // one-time flag: supabase cache migration
      'mtxtrkr_onboarding_dismissed',     // one-time flag: prevents onboarding wizard on every sign-in
    ];
    if (auth.user?.id) {
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
            userId: auth.user.id,
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
            .eq('user_id', auth.user.id);
          if (!error) {
            localStorage.setItem(CLEANUP_DONE_KEY, 'true');
          }
        }
      })();
    }
  }, [auth.user?.id]);

  // On sign-in: two-way sync between Supabase and localStorage.
  // 1. Pushes any local data that Supabase doesn't have yet (cross-device data).
  // 2. Pulls Supabase data into localStorage to overwrite stale cache.
  // This ensures the user sees ALL their data (from any device) when they log in,
  // without losing locally-added records that haven't been pushed yet.
  // Uses React state (not localStorage) so the guard resets when the user changes.
  // Waits for ALL Supabase stores to finish loading before syncing — fixes the race
  // condition where the effect fires before data arrives and sets a permanent flag.
  useEffect(() => {
    if (!isAuthenticated || !auth.user?.id) return;

    // Wait for all Supabase stores to finish fetching before attempting sync.
    // Without this, supabaseVehicles.data is still [] when the effect fires,
    // the sync finds nothing to pull, and the flag prevents any future retry.
    const allLoaded = !supabaseVehicles.loading && !supabaseLogs.loading && !supabaseReminders.loading && !supabaseFuelLogs.loading && !supabaseMods.loading && !supabaseDocuments.loading;
    if (!allLoaded) return;

    if (initialSyncDone) return;

    // Two-way sync: push local → Supabase, then pull Supabase → local.
    // Both steps wrapped in a single async IIFE so Step 1 (push) fully
    // completes before Step 2 (pull) runs — preventing the race condition
    // where a synchronous pull overwrites local data that hasn't been pushed yet.
    (async () => {
      // Step 1: Push local data to Supabase FIRST (AWAITED), so it's not lost
      // when we pull. This prevents the "disappearing logs" bug where Supabase
      // data overwrites local records that were never pushed to the cloud.
      for (const { local, supabase, key } of syncStores) {
        const localData = local.data || [];
        if (localData.length === 0) continue;
        const supabaseIds = new Set((supabase.data || []).map(s => s.id));
        const itemsToPush = localData.filter(item => !supabaseIds.has(item.id));
        for (const item of itemsToPush) {
          try {
            const result = await supabase.add(item);
            if (result?.error) {
              console.warn(`[Sync] Failed to push ${item.id} to ${key}:`, result.message);
              showSyncError(`Failed to sync ${key.replace('mtxtrkr_', '')} — tap Push to Cloud to retry`);
            }
          } catch (e) {
            console.warn(`[Sync] Failed to push ${item.id} to ${key}:`, e);
            showSyncError(`Failed to sync ${key.replace('mtxtrkr_', '')} — tap Push to Cloud to retry`);
          }
        }
      }

      // Step 2: Pull Supabase data into localStorage (runs AFTER Step 1 completes).
      // Clear supabase cache before pull to prevent stale data fallback
      // from a previous user's session contaminating the current user's data.
      for (const { key } of syncStores) {
        const cacheKey = `supabase_cache_${key.replace('mtxtrkr_', '')}`;
        localStorage.removeItem(cacheKey);
      }
      for (const { local, supabase, key } of syncStores) {
        const supabaseHasData = supabase.data && supabase.data.length > 0;

        if (supabaseHasData) {
          try {
            localStorage.setItem(key, JSON.stringify(supabase.data));
          } catch (e) {
            // If quota exceeded (receipt images too large), try sanitized version
            if (e.name === 'QuotaExceededError' || e.code === 22) {
              console.warn(`[Sync] Quota exceeded for "${key}", trying sanitized...`);
              try {
                const sanitized = sanitizeForStorage(supabase.data);
                localStorage.setItem(key, JSON.stringify(sanitized));
              } catch (e2) {
                console.warn(`[Sync] Still too large after sanitization for "${key}", keeping in memory only`, e2);
                showSyncError(`Local storage full — could not save ${key.replace('mtxtrkr_', '')}. Free up space and try again.`);
              }
            } else {
              console.warn(`[Sync] Failed to write "${key}" to localStorage:`, e);
              showSyncError(`Could not save ${key.replace('mtxtrkr_', '')} locally — try refreshing.`);
            }
          }
          local.setData(supabase.data);
        } else {
          // Fallback: if Supabase has no data but the migration restored data
          // to localStorage (e.g. stale cache cleanup + re-migration), load it.
          // This handles the case where mtxtrkr_* was wiped during PR #35 but
          // supabase_* survived and was copied by the migration.
          try {
            const localRaw = localStorage.getItem(key);
            const localParsed = localRaw ? JSON.parse(localRaw) : [];
            if (Array.isArray(localParsed) && localParsed.length > 0 &&
                (!local.data || local.data.length === 0)) {
              local.setData(localParsed);
            }
          } catch (e) {
            // Ignore corrupt localStorage
          }
        }
      }
      // Mark sync as complete even when both localStorage and Supabase
      // are empty (new user, no data anywhere). An empty state is valid —
      // we don't need to keep re-running the effect on every dependency change
      // just because there was nothing to sync.
      setInitialSyncDone(true);
    })();
  }, [
  isAuthenticated, auth.user?.id, initialSyncDone,
  supabaseVehicles.loading, supabaseLogs.loading, supabaseReminders.loading, supabaseFuelLogs.loading, supabaseMods.loading, supabaseDocuments.loading,
  supabaseVehicles.data, supabaseLogs.data, supabaseReminders.data, supabaseFuelLogs.data, supabaseMods.data, supabaseDocuments.data
]);

  // Continuous background sync: push local data to Supabase when it changes
  // Tracks { id → lastPushedUpdatedAt } so updated items are re-pushed.
  // Uses upsert (via supabase.add) so both new and modified items sync correctly.
  // All pushes run sequentially inside a single async IIFE — each store's pushes
  // are awaited before the next store begins, preventing concurrent fire-and-forget
  // operations that could race.
  const pushedIdsRef = useRef({});
  useEffect(() => {
    if (!isAuthenticated || !auth.user?.id) return;

    (async () => {
      for (const { local, supabase, key } of syncStores) {
        const localData = local.data || [];
        if (localData.length === 0) continue;

        const itemsToSync = localData.filter(item => {
          const lastPushed = pushedIdsRef.current[item.id];
          if (!lastPushed) return true; // never pushed
          // Re-push if item was updated after last push
          const itemUpdated = item.updatedAt || item.createdAt || '';
          return itemUpdated > lastPushed;
        });
        if (itemsToSync.length === 0) continue;

        for (const item of itemsToSync) {
          const itemTimestamp = item.updatedAt || item.createdAt || new Date().toISOString();
          // Mark as pushed immediately to prevent duplicate attempts
          pushedIdsRef.current[item.id] = itemTimestamp;
          try {
            const result = await supabase.add(item);
            if (result?.error) {
              console.error(`[Sync] Failed to push ${item.id} to ${key}:`, result.message);
              showSyncError(`${key.replace('mtxtrkr_', '')}: failed to sync ${item.id} — tap Push to Cloud to retry`);
              // Allow retry on failure — the add() function already tracks it in failedWrites
              delete pushedIdsRef.current[item.id];
            }
          } catch (e) {
            console.error(`[Sync] Failed to push ${item.id} to ${key}:`, e);
            showSyncError(`${key.replace('mtxtrkr_', '')}: failed to sync ${item.id} — tap Push to Cloud to retry`);
            // Allow retry on failure
            delete pushedIdsRef.current[item.id];
          }
        }
      }
    })();
      }, [isAuthenticated, auth.user?.id,
        localVehicles.data, localLogs.data, localReminders.data,
        localFuelLogs.data, localMods.data, localDocuments.data
      ]);

      // Auto-push to cloud when the app is closed or tab becomes hidden
  // Uses visibilitychange which fires on both mobile (app switch, lock) and desktop (close tab, navigate away)
  // Handler is async — all pushes are awaited before the tab fully suspends, reducing data loss risk.
  useEffect(() => {
    if (!isAuthenticated || !auth.user?.id) return;
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        // Push any unsynced (new or updated) items to Supabase — AWAITED sequentially
        for (const { local, supabase, key } of syncStores) {
          const localData = local.data || [];
          if (localData.length === 0) continue;
          const itemsToSync = localData.filter(item => {
            const lastPushed = pushedIdsRef.current[item.id];
            if (!lastPushed) return true;
            const itemUpdated = item.updatedAt || item.createdAt || '';
            return itemUpdated > lastPushed;
          });
          if (itemsToSync.length === 0) continue;
          for (const item of itemsToSync) {
            const itemTimestamp = item.updatedAt || item.createdAt || new Date().toISOString();
            pushedIdsRef.current[item.id] = itemTimestamp;
            try {
              const result = await supabase.add(item);
              if (result?.error) {
                console.error('[VisibilitySync] Push failed:', result.message);
                showSyncError(`${key.replace('mtxtrkr_', '')}: failed to sync ${item.id} — tap Push to Cloud to retry`);
                delete pushedIdsRef.current[item.id];
              }
            } catch (e) {
              console.error('[VisibilitySync] Push failed:', e);
              showSyncError(`${key.replace('mtxtrkr_', '')}: failed to sync ${item.id} — tap Push to Cloud to retry`);
              delete pushedIdsRef.current[item.id];
            }
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
      }, [isAuthenticated, auth.user?.id,
        localVehicles.data, localLogs.data, localReminders.data,
        localFuelLogs.data, localMods.data, localDocuments.data
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

      // Push all local data to Supabase BEFORE signing out.
      // This prevents data loss from the following chain of events:
      // 1. User adds data → localStorage updated, background sync starts (async)
      // 2. User signs out → auth.user becomes null → background sync aborts
      // 3. User signs back in → cleanup effect fires → wipes mtxtrkr_* keys
      // 4. Two-way sync has no local data to push, and Supabase never received
      //    the data (background sync didn't finish) → DATA LOST FOREVER
      //
      // By pushing ALL local data here (awaited, sequential), we guarantee that
      // every record is safely in Supabase before the session ends, so the
      // next sign-in's two-way sync can pull it back after the cleanup wipe.
      // Read from React state (.data), NOT localStorage, because the
      // useLocalStorage useEffect may not have flushed the latest state
      // to localStorage yet. If a user adds data and immediately signs
      // out, localStorage.getItem would return stale data — this fix
      // ensures all data (even just-added) reaches Supabase on logout.
      const dataStores = [
        { data: localVehicles.data, table: 'vehicles' },
        { data: localLogs.data, table: 'maintenance_logs' },
        { data: localReminders.data, table: 'reminders' },
        { data: localFuelLogs.data, table: 'fuel_logs' },
        { data: localMods.data, table: 'modifications' },
        { data: localDocuments.data, table: 'documents' },
      ];
      for (const { data, table } of dataStores) {
        const items = data || [];
        if (items.length === 0) continue;
        for (const item of items) {
          try {
            await supabase.from(table).upsert(
              { ...item, user_id: auth.user.id },
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
    localVehicles, localLogs, localReminders, localFuelLogs, localMods, localDocuments]);

  // Add vehicle
  const addVehicle = useCallback((data) => {
    if (!premium && vehiclesStore.data.length >= 1) {
      analytics.track('premium_gate_hit', { gate: 'add_vehicle', vehicleCount: vehiclesStore.data.length });
      setPage('premium');
      return;
    }
    const isFirstVehicle = vehiclesStore.data.length === 0; // check before add
    const mileage = parseInt(data.mileage) || 0;
    const vehicleData = { ...data, mileage };
    const savedVehicle = vehiclesStore.add(vehicleData);

    // Auto-create reminders from manufacturer schedule (via VIN-decoded make/model)
    const autoReminders = generateAutoReminders(savedVehicle, remindersStore.data);
    autoReminders.forEach(reminder => {
      remindersStore.add(reminder);
    });
    
    analytics.track('vehicle_added', { make: data.make, model: data.model, year: data.year, autoReminders: autoReminders.length });
    if (autoReminders.length > 0) {
      analytics.track('auto_reminders_created', { count: autoReminders.length });
    }
    sync.markChanged();
    // No longer redirect to dashboard on first vehicle — user stays on garage
    // to see their new vehicle appear in the list.
    // if (isFirstVehicle) setPage('dashboard');
  }, [premium, vehiclesStore, remindersStore, sync, analytics]);

  // Add maintenance log
  const addLog = useCallback((data) => {
    const logData = {
      ...data,
      mileage: parseInt(data.mileage) || 0,
      cost: parseFloat(data.cost) || 0,
    };
    // Ensure serviceTypes array is always stored for multi-job support
    if (!Array.isArray(logData.serviceTypes) || logData.serviceTypes.length === 0) {
      logData.serviceTypes = logData.serviceType ? [logData.serviceType] : ['Other'];
    }
    logsStore.add(logData);
    analytics.track('maintenance_log_added', {
      serviceType: logData.serviceType,
      serviceTypes: logData.serviceTypes,
      cost: parseFloat(data.cost) || 0,
      vehicleId: data.vehicleId,
    });
    sync.markChanged();
  }, [logsStore, sync, analytics]);

  // Add reminder
  const addReminder = useCallback((data) => {
    remindersStore.add({
      ...data,
      enabled: true,
      lastCompletedMileage: parseInt(data.lastCompletedMileage) || 0,
      intervalMiles: parseInt(data.intervalMiles) || 5000,
      intervalDays: parseInt(data.intervalDays) || 180,
      dueMileage: data.dueMileage || 0,
      dueDate: data.dueDate || new Date(Date.now() + 180 * 86400000).toISOString(),
    });
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
  const handleDeleteDocument = useCallback(async (id) => {
    localDocuments.remove(id);
    const result = await supabaseDocuments.remove(id);
    if (result?.error) showSyncError('Delete not synced to cloud — tap Push to Cloud to retry');
    sync.markChanged();
  }, [localDocuments, supabaseDocuments, sync, showSyncError]);

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

  // Force sync from cloud — overwrites local data with Supabase data
  // Used when switching devices or when cross-device sync didn't trigger automatically
  const handleSyncFromCloud = useCallback(async () => {
    if (!auth.user?.id) return { success: false, failedStores: [] };
    // Reset pushed IDs so the background sync re-tracks all items after cloud pull
    pushedIdsRef.current = {};
    const tables = [
      { table: 'vehicles', local: localVehicles, key: STORAGE_KEYS.VEHICLES },
      { table: 'maintenance_logs', local: localLogs, key: STORAGE_KEYS.MAINTENANCE_LOGS },
      { table: 'reminders', local: localReminders, key: STORAGE_KEYS.REMINDERS },
      { table: 'fuel_logs', local: localFuelLogs, key: 'mtxtrkr_fuel_logs' },
      { table: 'modifications', local: localMods, key: 'mtxtrkr_modifications' },
      { table: 'documents', local: localDocuments, key: STORAGE_KEYS.DOCUMENTS },
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
    const failedStores = [];
    for (const { table, local, key } of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', auth.user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        const camelData = keysToCamel(data || []);
        if (camelData.length > 0) {
          localStorage.setItem(key, JSON.stringify(camelData));
          local.setData(camelData);
        }
      } catch (err) {
        console.error(`[SyncFromCloud] Error fetching ${table}:`, err);
        failedStores.push(table);
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
        // Always restore subscription data when DB says premium
        // (same fix as the premium sync effect — no guard, unconditional restore).
        setSubscriptionData({ plan: 'monthly', status: 'active', nextBilling: null });
      }
    } catch (err) {
      console.error('[SyncFromCloud] Error fetching premium status:', err);
    }
    analytics.track('sync_from_cloud', { failedStores: failedStores.length > 0 ? failedStores : undefined });
    sync.markChanged();
    return { success: failedStores.length === 0, failedStores };
  }, [auth.user?.id, localVehicles, localLogs, localReminders, localFuelLogs, localMods, localDocuments, sync, analytics]);

  // Force push to cloud — sends all local data to Supabase (new + updated items)
  // Used when the background sync didn't trigger automatically
  const handlePushToCloud = useCallback(async () => {
    if (!auth.user?.id) return;
    const stores = [
      { local: localVehicles, supabase: supabaseVehicles, table: 'vehicles' },
      { local: localLogs, supabase: supabaseLogs, table: 'maintenance_logs' },
      { local: localReminders, supabase: supabaseReminders, table: 'reminders' },
      { local: localFuelLogs, supabase: supabaseFuelLogs, table: 'fuel_logs' },
      { local: localMods, supabase: supabaseMods, table: 'modifications' },
      { local: localDocuments, supabase: supabaseDocuments, table: 'documents' },
    ];
    // Track which stores had any push failures — only clear failed writes for
    // stores where every item pushed successfully, so failures are preserved
    // for the user to retry.
    const storesWithErrors = new Set();
    for (const { local, supabase, table } of stores) {
      const localData = local.data || [];
      if (localData.length === 0) continue;
      // Push items that are new OR updated since last cloud sync
      const supabaseMap = new Map((supabase.data || []).map(s => [s.id, s]));
      const itemsToSync = localData.filter(item => {
        const cloud = supabaseMap.get(item.id);
        if (!cloud) return true; // new item
        const localUpdated = item.updatedAt || item.createdAt || '';
        const cloudUpdated = cloud.updatedAt || cloud.createdAt || '';
        return localUpdated > cloudUpdated; // locally updated
      });
      if (itemsToSync.length === 0) continue;
      const now = new Date().toISOString();
      for (const item of itemsToSync) {
        const result = await supabase.add(item);
        if (result?.error) {
          showSyncError('Some items failed to push — try again');
          storesWithErrors.add(table);
        } else {
          // Track in push ref so background sync doesn't re-push
          pushedIdsRef.current[item.id] = item.updatedAt || item.createdAt || now;
        }
      }
    }
    // Only clear failed write trackers for stores that had zero push errors.
    // Failed stores preserve their failed writes so the user knows and can retry.
    if (!storesWithErrors.has('vehicles')) supabaseVehicles.clearAllFailedWrites();
    if (!storesWithErrors.has('maintenance_logs')) supabaseLogs.clearAllFailedWrites();
    if (!storesWithErrors.has('reminders')) supabaseReminders.clearAllFailedWrites();
    if (!storesWithErrors.has('fuel_logs')) supabaseFuelLogs.clearAllFailedWrites();
    if (!storesWithErrors.has('modifications')) supabaseMods.clearAllFailedWrites();
    if (!storesWithErrors.has('documents')) supabaseDocuments.clearAllFailedWrites();
    // Also push premium status (only if already premium — don't escalate free users)
    if (premium) {
      localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
      await supabase.from('profiles').upsert({ id: auth.user.id, premium: true });
    }
    analytics.track('push_to_cloud', {});
    sync.markChanged();
  }, [auth.user?.id, premium, localVehicles, localLogs, localReminders, localFuelLogs, localMods, localDocuments, supabaseVehicles, supabaseLogs, supabaseReminders, supabaseFuelLogs, supabaseMods, supabaseDocuments, sync, analytics]);

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
                await store.add(item);
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
          hasUnsyncedChanges={hasUnsyncedChanges}
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
      onDelete={async (id) => {
        vehiclesStore.remove(id);
        const result = await supabaseVehicles.remove(id);
        if (result?.error) showSyncError('Delete not synced to cloud — tap Push to Cloud to retry');
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
      onDelete={async (id) => {
        logsStore.remove(id);
        const result = await supabaseLogs.remove(id);
        if (result?.error) showSyncError('Delete not synced to cloud — tap Push to Cloud to retry');
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
      onDelete={async (id) => {
        remindersStore.remove(id);
        const result = await supabaseReminders.remove(id);
        if (result?.error) showSyncError('Delete not synced to cloud — tap Push to Cloud to retry');
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
      onAdd={(data) => { fuelLogsStore.add(data); sync.markChanged(); }}
      onDelete={async (id) => {
        fuelLogsStore.remove(id);
        const result = await supabaseFuelLogs.remove(id);
        if (result?.error) showSyncError('Delete not synced to cloud — tap Push to Cloud to retry');
        sync.markChanged();
      }}
      onUpdate={(id, data) => { fuelLogsStore.updateItem(id, data); sync.markChanged(); }}
      selectedVehicleId={selectedVehicleId}
    />,
    mods: <Modifications
      mods={modsStore.data}
      vehicles={vehiclesStore.data}
      onAdd={(data) => { modsStore.add(data); sync.markChanged(); }}
      onDelete={async (id) => {
        modsStore.remove(id);
        const result = await supabaseMods.remove(id);
        if (result?.error) showSyncError('Delete not synced to cloud — tap Push to Cloud to retry');
        sync.markChanged();
      }}
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
      {/* Sync error banner — shown when a Supabase write fails */}
      {syncError && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600/90 backdrop-blur-sm text-white text-sm py-2 px-4 text-center font-medium animate-pulse cursor-pointer"
          onClick={() => setSyncError(null)}>
          <span className="mr-2">⚠</span>
          {syncError}
          <span className="ml-2 text-xs opacity-70">(tap to dismiss)</span>
        </div>
      )}
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
        hasUnsyncedChanges={hasUnsyncedChanges}
      />
    </ErrorBoundary>
  );
}