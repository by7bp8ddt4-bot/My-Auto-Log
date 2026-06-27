import { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout.jsx';
import LandingPage from './components/LandingPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import VehicleList from './components/VehicleList.jsx';
import MaintenanceLog from './components/MaintenanceLog.jsx';
import RemindersList from './components/RemindersList.jsx';
import PremiumPaywall from './components/PremiumPaywall.jsx';
import Settings from './components/Settings.jsx';
import SyncIndicator from './components/SyncIndicator.jsx';
import AuthPage from './components/AuthPage.jsx';
import { useSupabaseData, useSupabaseAuth } from './hooks/useSupabaseData.js';
import { useLocalStorage, useSyncStatus } from './hooks/useLocalStorage.js';
import { STORAGE_KEYS } from './utils/constants.js';

export default function App() {
  const [page, setPage] = useState('landing');
  const [premium, setPremium] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.PREMIUM_STATUS) === 'true';
  });
  const [forceOffline, setForceOffline] = useState(false);

  // Supabase auth
  const auth = useSupabaseAuth();
  const isAuthenticated = !!auth.user;

  // Auto-redirect to dashboard when user signs in / auth loads
  useEffect(() => {
    if (isAuthenticated && (page === 'auth' || (!auth.loading && page !== 'landing' && page !== 'premium' && page !== 'dashboard'))) {
      setPage('dashboard');
    }
  }, [isAuthenticated, auth.loading]);

  // Data stores — always call hooks in same order (React rules)
  const supabaseVehicles = useSupabaseData('vehicles', auth.user?.id);
  const supabaseLogs = useSupabaseData('maintenance_logs', auth.user?.id);
  const supabaseReminders = useSupabaseData('reminders', auth.user?.id);
  const localVehicles = useLocalStorage(STORAGE_KEYS.VEHICLES, []);
  const localLogs = useLocalStorage(STORAGE_KEYS.MAINTENANCE_LOGS, []);
  const localReminders = useLocalStorage(STORAGE_KEYS.REMINDERS, []);

  // Use Supabase when authenticated, localStorage when not
  const vehiclesStore = isAuthenticated ? supabaseVehicles : localVehicles;
  const logsStore = isAuthenticated ? supabaseLogs : localLogs;
  const remindersStore = isAuthenticated ? supabaseReminders : localReminders;

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
  const handleLogout = useCallback(() => {
    if (isAuthenticated) {
      auth.signOut();
    }
    setPage('landing');
  }, [auth, isAuthenticated]);

  // Add vehicle
  const addVehicle = useCallback((data) => {
    if (!premium && vehiclesStore.data.length >= 1) {
      setPage('premium');
      return;
    }
    const mileage = parseInt(data.mileage) || 0;
    vehiclesStore.add({ ...data, mileage });
    sync.markChanged();
  }, [premium, vehiclesStore, sync]);

  // Add maintenance log
  const addLog = useCallback((data) => {
    logsStore.add({
      ...data,
      mileage: parseInt(data.mileage) || 0,
      cost: parseFloat(data.cost) || 0,
    });
    sync.markChanged();
  }, [logsStore, sync]);

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
    sync.markChanged();
  }, [remindersStore, sync]);

  // Reset all data
  const handleReset = useCallback(() => {
    vehiclesStore.update([]);
    logsStore.update([]);
    remindersStore.update([]);
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
    localStorage.removeItem(STORAGE_KEYS.PREMIUM_STATUS);
    setPremium(false);
    sync.markChanged();
  }, [vehiclesStore, logsStore, remindersStore, sync]);

  // Upgrade to premium
  const handleUpgrade = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
    setPremium(true);
    setPage('dashboard');
  }, []);

  // Show auth page if not authenticated (after landing)
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

  // Render pages
  if (page === 'landing') {
    return (
      <>
        <LandingPage
          onGetStarted={() => setPage('dashboard')}
          onViewPremium={() => setPage('premium')}
        />
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

  if (page === 'premium') {
    return (
      <PremiumPaywall
        onClose={() => setPage('dashboard')}
        onUpgrade={handleUpgrade}
      />
    );
  }

  const pages = {
    dashboard: <Dashboard
      vehicles={vehiclesStore.data}
      logs={logsStore.data}
      reminders={remindersStore.data}
      onNavigate={navigate}
      onAddLog={addLog}
      isPremium={premium}
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
      onDelete={(id) => {
        logsStore.remove(id);
        sync.markChanged();
      }}
      onNavigate={navigate}
      isPremium={premium}
    />,
    reminders: <RemindersList
      reminders={remindersStore.data}
      vehicles={vehiclesStore.data}
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
    />,
    settings: <Settings
      onReset={handleReset}
      vehicles={vehiclesStore.data}
      logs={logsStore.data}
      reminders={remindersStore.data}
    />,
  };

  return (
    <>
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
    </>
  );
}