import { useState, useCallback, useEffect, useRef } from 'react';
import Router from './router.jsx';
import SubscriptionManagement, { setSubscriptionData, getSubscriptionData, clearSubscriptionData } from './components/SubscriptionManagement.jsx';
import { setupGlobalErrorHandlers } from './components/ErrorBoundary.jsx';
import { useSupabaseData, filterForTable } from './hooks/useSupabaseData.js';
import useAuthState from './hooks/useAuthState.js';
import useSyncEngine from './hooks/useSyncEngine.js';
import { useLocalStorage, useSyncStatus } from './hooks/useLocalStorage.js';
import useAnalytics from './hooks/useAnalytics.js';
import { STORAGE_KEYS } from './utils/constants.js';
import { isSameService } from './utils/serviceMatcher.js';
import { getTier, normalizePlan, canAddVehicle, isStickyPaid, setPremiumFlag } from './utils/tiering.js';
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
  // Supabase auth + premium state (extracted to useAuthState hook)
  const authState = useAuthState();

  // Destructure for convenience — preserves all existing variable names
  const {
    user, loading: authLoading, isRecovery: authIsRecovery,
    authError, clearAuthError, signUp, signIn, signInWithGoogle,
    signInWithApple, signOut: authSignOut, resetPassword, updatePassword,
    checkPremium, setPremiumStatus, clearRecovery,
    isAuthenticated, premium, setPremium,
  } = authState;

  // Legacy auth object — used by pages that expect { user, signIn, ... }
  const auth = {
    user, loading: authLoading, isRecovery: authIsRecovery,
    authError, clearAuthError, signUp, signIn, signInWithGoogle,
    signInWithApple, signOut: authSignOut, resetPassword, updatePassword,
    checkPremium, setPremiumStatus, clearRecovery,
  };

  const [forceOffline, setForceOffline] = useState(false);

  // Current tier (Free / Family / Fleet) — derived from premium flag +
  // subscription plan key. Used for feature gates (Owner's Manual, Inspected
  // Vessels) and the garage header badge. OR'd with the ACCOUNT-SCOPED sticky
  // paid marker so a paid user's tier never collapses to Free mid-sync while
  // a different account on the same device is never credited with it.
  const tier = getTier({ isPremium: premium || isStickyPaid(user?.id) });

  // Global error handlers — runs once on mount, not on every render
  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);

  const [cancelSubDialog, setCancelSubDialog] = useState(false);
  const [syncError, setSyncError] = useState(null); // temporary error banner for failed Supabase writes

  // Global selected vehicle — persists across pages, saved to localStorage
  const [selectedVehicleId, setSelectedVehicleId] = useState(() => {
    return localStorage.getItem('mtxtrkr_selected_vehicle') || null;
  });

  const handleSelectVehicle = useCallback((id) => {
    setSelectedVehicleId(id);
    localStorage.setItem('mtxtrkr_selected_vehicle', id);
  }, []);

  // Analytics hook — auto-tracks page views and user identity (after auth)
  const analytics = useAnalytics(page, user, premium);

  // Activate premium from URL parameter (mobile-friendly activation link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('activate') === 'premium') {
      setPremiumFlag(auth.user?.id);
      // 3-tier model: legacy 'monthly'/'yearly' (or missing) → 'family';
      // the billing interval is preserved (legacy 'yearly' → family+yearly).
      const rawPlan = params.get('plan') || 'family';
      const plan = normalizePlan(rawPlan);
      const interval = params.get('interval') || (rawPlan === 'yearly' ? 'yearly' : 'monthly');
      const nextBilling = params.get('next_billing') || null;
      setSubscriptionData({ plan, status: 'active', nextBilling, interval });
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
      setPremiumFlag(auth.user?.id);
      // The checkout session's success_url includes &tier= and &interval=
      // (set server-side); record them so the client stores the right plan
      // key + billing interval even if the optimistic write was lost
      // (e.g. different browser/device).
      const tier = normalizePlan(params.get('tier') || null);
      const interval = params.get('interval') === 'yearly' ? 'yearly' : 'monthly';
      if (tier !== 'free') {
        setSubscriptionData({ plan: tier, status: 'active', nextBilling: null, interval });
      }
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
    // The cleanup effect no longer auto-downgrades premium, so there is no
    // race — React state and localStorage stay in sync, and the premium
    // sync effect verifies against Supabase on the next auth cycle.
    if (params.get('restore-premium') === '1') {
      setPremiumFlag(auth.user?.id);
      // Owner restore maps to Family (3-tier model; default monthly billing).
      setSubscriptionData({ plan: 'family', status: 'active', nextBilling: null, interval: 'monthly' });
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

  // ── Sync engine (extracted to useSyncEngine hook) ──────────────────
  const syncEngine = useSyncEngine({
    isAuthenticated,
    userId: auth.user?.id,
    syncStores,
    showSyncError,
    analytics,
    premium,
    setPremium,
    supabaseVehicles, supabaseLogs, supabaseReminders,
    supabaseFuelLogs, supabaseMods, supabaseDocuments,
    localVehicles, localLogs, localReminders,
    localFuelLogs, localMods, localDocuments,
  });

  const sync = useSyncStatus();

  // Override online status when force offline is toggled
  const effectiveOnline = forceOffline ? false : sync.isOnline;

  // Listen for custom navigate events
  useEffect(() => {
    const handler = (e) => setPage(e.detail);
    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, []);

  // Listen for localStorage quota exceeded events from useLocalStorage
  // Uses { once: true } so only one alert fires — all stores share the same quota.
  useEffect(() => {
    const handler = () => {
      window.alert('Storage full — data saved in memory only and will be lost on refresh. Try clearing old documents or syncing to cloud.');
    };
    window.addEventListener('mtxtrkr:quota-exceeded', handler, { once: true });
    return () => window.removeEventListener('mtxtrkr:quota-exceeded', handler);
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
      // Convert camelCase item keys to snake_case for Supabase, and strip
      // complex nested objects (e.g. vinDecoded) that have no matching DB column.
      const toDbSafe = (item, tableName) => {
        return filterForTable(tableName, item, auth.user.id);
      };
      // Build confirmed vehicle IDs from Supabase data to prevent 409
      // foreign-key constraint errors when parent vehicle rows are missing.
      // Also track vehicles that are successfully upserted during this logout pass
      // so their child rows are allowed through.
      const confirmedVehicleIds = new Set(
        (supabaseVehicles.data || []).map(v => v.id)
      );
      for (const { data, table } of dataStores) {
        const items = data || [];
        if (items.length === 0) continue;
        const isVehicleStore = table === 'vehicles';
        for (const item of items) {
          // Skip child rows whose parent vehicle_id isn't confirmed in Supabase
          if (!isVehicleStore) {
            const vehicleId = item.vehicleId || item.vehicle_id;
            if (vehicleId && !confirmedVehicleIds.has(vehicleId)) {
              continue;
            }
          }
          try {
            const result = await supabase.from(table).upsert(
              toDbSafe(item, table),
              { onConflict: 'id' }
            );
            // If a vehicle was successfully upserted, add its ID to confirmed set
            if (isVehicleStore && result && !result.error) {
              confirmedVehicleIds.add(result.data?.id || item.id);
            }
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
  const addVehicle = useCallback(async (data) => {
    // 3-tier gate (owner-ratified): Free = 1 automotive vehicle only;
    // Family = up to 4 any type; Fleet = unlimited. Client-side at add-time
    // (Supabase DB is READ-ONLY — no server-side column for tier).
    const tier = getTier({ isPremium: premium || isStickyPaid(user?.id) });
    const gate = canAddVehicle(tier.id, vehiclesStore.data, data?.type || 'car');
    if (!gate.allowed) {
      analytics.track('premium_gate_hit', {
        gate: gate.reason === 'non-automotive' ? 'add_non_automotive' : 'add_vehicle_limit',
        tier: tier.id,
        vehicleCount: vehiclesStore.data.length,
      });
      setPage('premium');
      return;
    }
    const isFirstVehicle = vehiclesStore.data.length === 0; // check before add
    const mileage = parseInt(data.mileage) || 0;
    const vehicleData = { ...data, mileage };
    const savedVehicle = vehiclesStore.add(vehicleData);

    // Auto-create reminders from manufacturer schedule (via VIN-decoded make/model)
    // Dynamic import: autoReminders.js transitively imports maintenance-schedules.js (192KB),
    // so we only load it when a user actually adds a vehicle.
    try {
      const { generateAutoReminders } = await import('./utils/autoReminders.js');
      const autoReminders = generateAutoReminders(savedVehicle, remindersStore.data);
      autoReminders.forEach(reminder => {
        remindersStore.add(reminder);
      });
      
      analytics.track('vehicle_added', { make: data.make, model: data.model, year: data.year, autoReminders: autoReminders.length });
      if (autoReminders.length > 0) {
        analytics.track('auto_reminders_created', { count: autoReminders.length });
      }
    } catch (e) {
      console.warn('[addVehicle] Failed to load auto-reminders module:', e);
      analytics.track('vehicle_added', { make: data.make, model: data.model, year: data.year, autoReminders: 0 });
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
      mileage: parseInt(data.mileage, 10) || 0,
      cost: parseFloat(data.cost) || 0,
    };
    // Ensure serviceTypes array is always stored for multi-job support
    if (!Array.isArray(logData.serviceTypes) || logData.serviceTypes.length === 0) {
      logData.serviceTypes = logData.serviceType ? [logData.serviceType] : ['Other'];
    }

    logsStore.add(logData);

    const logMileage = parseInt(logData.mileage, 10) || 0;
    const logDateBase = new Date(logData.date);
    const serviceTypes = Array.isArray(logData.serviceTypes) && logData.serviceTypes.length > 0
      ? logData.serviceTypes
      : (logData.serviceType ? [logData.serviceType] : []);

    remindersStore.data.forEach((reminder) => {
      if (!reminder?.enabled) return;
      if (reminder.vehicleId !== logData.vehicleId) return;

      const isMatchingService = serviceTypes.some((serviceType) =>
        isSameService(reminder.title || '', serviceType || '')
      );

      if (!isMatchingService) return;

      const intervalMiles = parseInt(reminder.intervalMiles, 10) || 0;
      const intervalDays = parseInt(reminder.intervalDays, 10) || 0;
      const baseDateMs = Number.isNaN(logDateBase.getTime()) ? Date.now() : logDateBase.getTime();

      remindersStore.updateItem(reminder.id, {
        lastCompletedMileage: logMileage,
        lastCompletedDate: logData.date,
        dueMileage: logMileage + intervalMiles,
        dueDate: new Date(baseDateMs + (intervalDays * 86400000)).toISOString(),
      });
    });

    analytics.track('maintenance_log_added', {
      serviceType: logData.serviceType,
      serviceTypes: logData.serviceTypes,
      cost: parseFloat(data.cost) || 0,
      vehicleId: data.vehicleId,
    });
    sync.markChanged();
  }, [logsStore, remindersStore, sync, analytics]);

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

  // Force sync from cloud — thin wrapper around useSyncEngine
  const handleSyncFromCloud = useCallback(async () => {
    const result = await syncEngine.handleSyncFromCloud();
    sync.markChanged();
    return result;
  }, [syncEngine.handleSyncFromCloud, sync]);

  // Force push to cloud — thin wrapper around useSyncEngine
  const handlePushToCloud = useCallback(async () => {
    const result = await syncEngine.handlePushToCloud();
    sync.markChanged();
    return result;
  }, [syncEngine.handlePushToCloud, sync]);

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
    setPremiumFlag(auth.user?.id);
    if (auth.user?.id) {
      auth.setPremiumStatus(auth.user.id);
    }
    setPremium(true);
    analytics.track('premium_upgraded', { method: 'inline_button', userId: auth.user?.id });
    setPage('dashboard');
  }, [auth, supabaseVehicles, supabaseLogs, supabaseReminders, supabaseFuelLogs, supabaseMods, supabaseDocuments, analytics]);

  // Render via Router
  return (
    <Router
      page={page}
      setPage={setPage}
      navigate={navigate}
      auth={auth}
      isAuthenticated={isAuthenticated}
      premium={premium}
      tier={tier}
      cancelSubDialog={cancelSubDialog}
      setCancelSubDialog={setCancelSubDialog}
      sync={sync}
      effectiveOnline={effectiveOnline}
      forceOffline={forceOffline}
      setForceOffline={setForceOffline}
      hasUnsyncedChanges={hasUnsyncedChanges}
      syncError={syncError}
      setSyncError={setSyncError}
      showSyncError={showSyncError}
      selectedVehicleId={selectedVehicleId}
      handleSelectVehicle={handleSelectVehicle}
      vehiclesStore={vehiclesStore}
      logsStore={logsStore}
      remindersStore={remindersStore}
      fuelLogsStore={fuelLogsStore}
      modsStore={modsStore}
      localDocuments={localDocuments}
      supabaseVehicles={supabaseVehicles}
      supabaseLogs={supabaseLogs}
      supabaseReminders={supabaseReminders}
      supabaseFuelLogs={supabaseFuelLogs}
      supabaseMods={supabaseMods}
      supabaseDocuments={supabaseDocuments}
      handleLogout={handleLogout}
      addVehicle={addVehicle}
      addLog={addLog}
      addReminder={addReminder}
      handleAddDocument={handleAddDocument}
      handleDeleteDocument={handleDeleteDocument}
      handleReset={handleReset}
      handleDeleteAccount={handleDeleteAccount}
      handleUpgrade={handleUpgrade}
      handleSyncFromCloud={handleSyncFromCloud}
      handlePushToCloud={handlePushToCloud}
      analytics={analytics}
    />
  );
}