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
import SubscriptionManagement, { setSubscriptionData } from './components/SubscriptionManagement.jsx';
import ErrorBoundary, { setupGlobalErrorHandlers } from './components/ErrorBoundary.jsx';
import { useSupabaseData, useSupabaseAuth } from './hooks/useSupabaseData.js';
import { useLocalStorage, useSyncStatus } from './hooks/useLocalStorage.js';
import useAnalytics from './hooks/useAnalytics.js';
import { STORAGE_KEYS } from './utils/constants.js';
import { generateAutoReminders, summarizeAutoReminders } from './utils/autoReminders.js';
import { supabase } from './lib/supabase.js';

// Migration: myautolog_ → mtxtrkr_ localStorage keys (runs once on import)
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
    }
    localStorage.setItem(cacheMigrationKey, 'true');
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
  useEffect(() => {
    setInitialSyncDone(false);
  }, [auth.user?.id]);

  // On sign-in: load Supabase data into localStorage if local is empty (cross-device)
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

    for (const { local, supabase, key } of syncStores) {
      const localRaw = localStorage.getItem(key);
      const localEmpty = !localRaw || JSON.parse(localRaw).length === 0;
      const supabaseHasData = supabase.data && supabase.data.length > 0;

      if (localEmpty && supabaseHasData) {
        // Supabase has data, local is empty — load from cloud (new device)
        localStorage.setItem(key, JSON.stringify(supabase.data));
        local.setData(supabase.data);
      }
    }
    setInitialSyncDone(true);
  }, [
    isAuthenticated, auth.user?.id, initialSyncDone,
    supabaseVehicles.loading, supabaseLogs.loading, supabaseReminders.loading, supabaseFuelLogs.loading, supabaseMods.loading,
    supabaseVehicles.data, supabaseLogs.data, supabaseReminders.data, supabaseFuelLogs.data, supabaseMods.data
  ]);

  // Continuous background sync: push local data to Supabase when it changes
  // Syncs individual items by comparing IDs — pushes only what's missing from Supabase
  const lastSyncRef = useRef(0);
  useEffect(() => {
    if (!isAuthenticated || !auth.user?.id) return;

    const now = Date.now();
    if (now - lastSyncRef.current < 5000) return; // throttle: max once per 5s
    lastSyncRef.current = now;

    for (const { local, supabase } of syncStores) {
      const localData = local.data;
      const supabaseData = supabase.data || [];

      if (localData.length === 0) continue;

      const supabaseIds = new Set(supabaseData.map(s => s.id));
      const itemsToSync = localData.filter(item => !supabaseIds.has(item.id));

      if (itemsToSync.length > 0) {
        (async () => {
          for (const item of itemsToSync) {
            // Preserve the original id so the fallback in add() doesn't create a new UUID
            const { createdAt, updatedAt, ...syncItem } = item;
            await supabase.add(syncItem);
          }
        })();
      }
    }
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
    const mileage = parseInt(data.mileage) || 0;
    const vehicleData = { ...data, mileage };
    vehiclesStore.add(vehicleData);

    // Auto-create reminders from manufacturer schedule (via VIN-decoded make/model)
    const savedVehicle = { ...vehicleData, id: vehicleData.id || data.id };
    const autoReminders = generateAutoReminders(savedVehicle, remindersStore.data);
    autoReminders.forEach(reminder => {
      remindersStore.add(reminder);
    });
    
    analytics.track('vehicle_added', { make: data.make, model: data.model, year: data.year, autoReminders: autoReminders.length });
    if (autoReminders.length > 0) {
      analytics.track('auto_reminders_created', { count: autoReminders.length });
    }
    sync.markChanged();
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
  const handleReset = useCallback(() => {
    vehiclesStore.update([]);
    logsStore.update([]);
    remindersStore.update([]);
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
    localStorage.removeItem(STORAGE_KEYS.PREMIUM_STATUS);
    setPremium(false);
    analytics.track('data_reset', {});
    sync.markChanged();
  }, [vehiclesStore, logsStore, remindersStore, sync, analytics]);

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
        sync.markChanged();
      }}
      isPremium={premium}
      onNavigate={navigate}
      selectedVehicleId={selectedVehicleId}
    />,
    settings: <Settings
      onReset={handleReset}
      vehicles={vehiclesStore.data}
      logs={logsStore.data}
      reminders={remindersStore.data}
      isAuthenticated={isAuthenticated}
      isPremium={premium}
      onNavigate={navigate}
      onLogout={handleLogout}
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
      onDelete={(id) => { fuelLogsStore.remove(id); sync.markChanged(); }}
      onUpdate={(id, data) => { fuelLogsStore.updateItem(id, data); sync.markChanged(); }}
      selectedVehicleId={selectedVehicleId}
    />,
    mods: <Modifications
      mods={modsStore.data}
      vehicles={vehiclesStore.data}
      onAdd={(data) => { modsStore.add(data); sync.markChanged(); }}
      onDelete={(id) => { modsStore.remove(id); sync.markChanged(); }}
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
    auth: <AuthPage onAuth={auth} />,
  };

  return (
    <ErrorBoundary>
      <Layout currentPage={page} onNavigate={navigate} onLogout={handleLogout}>
        {pages[page] || pages.dashboard}
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