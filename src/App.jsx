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
    if (params.get('restore-premium') === '1') {
      localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
      setPremium(true);

      // Only clear URL & persist when auth is ready
      if (auth.user?.id) {
        supabase.from('profiles').upsert({ id: auth.user.id, premium: true });
        window.history.replaceState({}, '', window.location.pathname);
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
  
  const localVehicles = useLocalStorage(STORAGE_KEYS.VEHICLES, []);
  const localLogs = useLocalStorage(STORAGE_KEYS.MAINTENANCE_LOGS, []);
  const localReminders = useLocalStorage(STORAGE_KEYS.REMINDERS, []);
  const localFuelLogs = useLocalStorage('mtxtrkr_fuel_logs', []);
  const localMods = useLocalStorage('mtxtrkr_modifications', []);

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
      // DB says premium but local doesn't → restore local (e.g. new device login)
      if (dbPremium === true && !premium) {
        setPremium(true);
        localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
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
  ];

  // Reset initialSyncDone when the user changes (signs in, signs out, or switches accounts)
  // This ensures the sync effect re-runs for every new auth session.
  // Also clears stale localStorage data from a previous user to prevent
  // data contamination across accounts on shared devices (QA testing, etc.).
  useEffect(() => {
    setInitialSyncDone(false);
    pushedIdsRef.current = {};
    // Clear stale localStorage data from previous user
    if (auth.user?.id) {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('mtxtrkr_') || key.startsWith('supabase_cache_'))) {
          localStorage.removeItem(key);
        }
      }
      // One-time cleanup: remove contaminated maintenance_logs from Supabase
      const CLEANUP_DONE_KEY = 'mtxtrkr_logs_cleanup_done';
      if (!localStorage.getItem(CLEANUP_DONE_KEY)) {
        (async () => {
          const { error } = await supabase
            .from('maintenance_logs')
            .delete()
            .eq('user_id', auth.user.id);
          if (!error) {
            localStorage.setItem(CLEANUP_DONE_KEY, 'true');
          }
        })();
      }
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
    const allLoaded = !supabaseVehicles.loading && !supabaseLogs.loading && !supabaseReminders.loading && !supabaseFuelLogs.loading && !supabaseMods.loading;
    if (!allLoaded) return;

    if (initialSyncDone) return;

    // Step 1: Push local data to Supabase FIRST, so it's not lost when we pull.
    // This prevents the "disappearing logs" bug where Supabase data overwrites
    // local records that were never pushed to the cloud.
    (async () => {
      for (const { local, supabase } of syncStores) {
        const localData = local.data || [];
        if (localData.length === 0) continue;
        const supabaseIds = new Set((supabase.data || []).map(s => s.id));
        const itemsToPush = localData.filter(item => !supabaseIds.has(item.id));
        for (const item of itemsToPush) {
          const { createdAt, updatedAt, ...syncItem } = item;
          try { await supabase.add(syncItem); } catch (e) {
            console.warn(`[Sync] Failed to push item to cloud:`, e);
          }
        }
      }
    })();

    // Step 2: Pull Supabase data into localStorage (overwrites stale cache).
    // Clear supabase cache before pull to prevent stale data fallback
    // from a previous user's session contaminating the current user's data.
    for (const { key } of syncStores) {
      const cacheKey = `supabase_cache_${key.replace('mtxtrkr_', '')}`;
      localStorage.removeItem(cacheKey);
    }
    // Track whether any data was actually synced — if Supabase is empty (new account),
    // don't mark sync as done so it retries when data arrives from another device.
    let anySynced = false;
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
            }
          } else {
            console.warn(`[Sync] Failed to write "${key}" to localStorage:`, e);
          }
        }
        local.setData(supabase.data);
        anySynced = true;
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
            anySynced = true;
          }
        } catch (e) {
          // Ignore corrupt localStorage
        }
      }
    }
    if (anySynced) {
      setInitialSyncDone(true);
    }
  }, [
  isAuthenticated, auth.user?.id, initialSyncDone,
  supabaseVehicles.loading, supabaseLogs.loading, supabaseReminders.loading, supabaseFuelLogs.loading, supabaseMods.loading,
  supabaseVehicles.data, supabaseLogs.data, supabaseReminders.data, supabaseFuelLogs.data, supabaseMods.data
]);

  // Continuous background sync: push local data to Supabase when it changes
  // Tracks { id → lastPushedUpdatedAt } so updated items are re-pushed.
  // Uses upsert (via supabase.add) so both new and modified items sync correctly.
  const pushedIdsRef = useRef({});
  useEffect(() => {
    if (!isAuthenticated || !auth.user?.id) return;

    for (const { local, supabase } of syncStores) {
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

      (async () => {
        for (const item of itemsToSync) {
          const itemTimestamp = item.updatedAt || item.createdAt || new Date().toISOString();
          // Mark as pushed immediately to prevent duplicate attempts
          pushedIdsRef.current[item.id] = itemTimestamp;
          const { createdAt, updatedAt, ...syncItem } = item;
          try {
            await supabase.add(syncItem);
          } catch (e) {
            console.error(`[Sync] Failed to push ${item.id}:`, e);
            // Allow retry on failure
            delete pushedIdsRef.current[item.id];
          }
        }
      })();
    }
  }, [isAuthenticated, auth.user?.id,
    localVehicles.data, localLogs.data, localReminders.data,
    localFuelLogs.data, localMods.data
  ]);

  // Auto-push to cloud when the app is closed or tab becomes hidden
  // Uses visibilitychange which fires on both mobile (app switch, lock) and desktop (close tab, navigate away)
  useEffect(() => {
    if (!isAuthenticated || !auth.user?.id) return;
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Push any unsynced (new or updated) items to Supabase
        for (const { local, supabase } of syncStores) {
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
            const { createdAt, updatedAt, ...syncItem } = item;
            supabase.add(syncItem).catch(e => {
              console.error('[VisibilitySync] Push failed:', e);
              delete pushedIdsRef.current[item.id];
            });
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated, auth.user?.id,
    localVehicles.data, localLogs.data, localReminders.data,
    localFuelLogs.data, localMods.data
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
    if (isAuthenticated) {
      analytics.track('user_logout', { page: 'settings' });
      analytics.logoutAnalytics();
      await auth.signOut();
    }
    // Set page to landing AFTER sign-out completes, so the auto-redirect
    // effect doesn't fire while isAuthenticated is still true and redirect
    // the user back to dashboard before the sign-out finishes.
    setPage('landing');
  }, [auth, isAuthenticated, analytics]);

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

  // Reset all data
  const handleReset = useCallback(async () => {
    if (!window.confirm('Are you sure? This will permanently delete ALL your data from both the app and the cloud. This cannot be undone.')) return;
    vehiclesStore.update([]);
    logsStore.update([]);
    remindersStore.update([]);
    fuelLogsStore.update([]);
    modsStore.update([]);
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
      const tables = ['vehicles', 'maintenance_logs', 'reminders', 'fuel_logs', 'modifications'];
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
    }, [vehiclesStore, logsStore, remindersStore, fuelLogsStore, modsStore, sync, analytics, auth.user?.id]);

  // Force sync from cloud — overwrites local data with Supabase data
  // Used when switching devices or when cross-device sync didn't trigger automatically
  const handleSyncFromCloud = useCallback(async () => {
    if (!auth.user?.id) return;
    // Reset pushed IDs so the background sync re-tracks all items after cloud pull
    pushedIdsRef.current = {};
    const tables = [
      { table: 'vehicles', local: localVehicles, key: STORAGE_KEYS.VEHICLES },
      { table: 'maintenance_logs', local: localLogs, key: STORAGE_KEYS.MAINTENANCE_LOGS },
      { table: 'reminders', local: localReminders, key: STORAGE_KEYS.REMINDERS },
      { table: 'fuel_logs', local: localFuelLogs, key: 'mtxtrkr_fuel_logs' },
      { table: 'modifications', local: localMods, key: 'mtxtrkr_modifications' },
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
        // Restore subscription data for premium users who don't have it in localStorage
        // (e.g. after clearing localStorage or signing in on a new device).
        // The actual subscription management (cancel, upgrade) is handled by Stripe,
        // so the exact plan/status values are informational — 'active' keeps the UI correct.
        if (!localStorage.getItem('mtxtrkr_subscription_status')) {
          setSubscriptionData({ plan: 'monthly', status: 'active', nextBilling: null });
        }
      }
    } catch (err) {
      console.error('[SyncFromCloud] Error fetching premium status:', err);
    }
    analytics.track('sync_from_cloud', {});
    sync.markChanged();
  }, [auth.user?.id, localVehicles, localLogs, localReminders, localFuelLogs, localMods, sync, analytics]);

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
    ];
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
        const { createdAt, updatedAt, ...syncItem } = item;
        await supabase.add(syncItem);
        // Track in push ref so background sync doesn't re-push
        pushedIdsRef.current[item.id] = item.updatedAt || item.createdAt || now;
      }
    }
    // Also push premium status (only if already premium — don't escalate free users)
    if (premium) {
      localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
      await supabase.from('profiles').upsert({ id: auth.user.id, premium: true });
    }
    analytics.track('push_to_cloud', {});
    sync.markChanged();
  }, [auth.user?.id, premium, localVehicles, localLogs, localReminders, localFuelLogs, localMods, supabaseVehicles, supabaseLogs, supabaseReminders, supabaseFuelLogs, supabaseMods, sync, analytics]);

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

      // If premium flag is stale (true but no subscription data), clear it
      // and clear any stale subscription keys so they don't interfere later
      if (premium && !sub?.status) {
        localStorage.removeItem(STORAGE_KEYS.PREMIUM_STATUS);
        clearSubscriptionData();
        setPremium(false);
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
  }, [auth, supabaseVehicles, supabaseLogs, supabaseReminders, supabaseFuelLogs, supabaseMods, analytics]);

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
      onSyncFromCloud={handleSyncFromCloud}
      onPushToCloud={handlePushToCloud}
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
      isAuthenticated={isAuthenticated}
      isPremium={premium}
      onNavigate={navigate}
      onLogout={handleLogout}
      showCancelSubDialog={cancelSubDialog}
      onDismissCancelSub={() => setCancelSubDialog(false)}
      onSyncFromCloud={handleSyncFromCloud}
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
      onDelete={(id) => { supabaseFuelLogs.remove(id); fuelLogsStore.remove(id); sync.markChanged(); }}
      onUpdate={(id, data) => { fuelLogsStore.updateItem(id, data); sync.markChanged(); }}
      selectedVehicleId={selectedVehicleId}
    />,
    mods: <Modifications
      mods={modsStore.data}
      vehicles={vehiclesStore.data}
      onAdd={(data) => { modsStore.add(data); sync.markChanged(); }}
      onDelete={(id) => { supabaseMods.remove(id); modsStore.remove(id); sync.markChanged(); }}
      onNavigate={navigate}
      isPremium={premium}
      selectedVehicleId={selectedVehicleId}
    />,
    documents: <DocumentsPage
      vehicles={vehiclesStore.data}
      onNavigate={navigate}
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
    </ErrorBoundary>
  );
}