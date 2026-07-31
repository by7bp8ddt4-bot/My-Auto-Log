import { lazy, Suspense } from 'react';
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
import FuelLog from './components/FuelLog.jsx';
import MileageChart from './components/MileageChart.jsx';
import Modifications from './components/Modifications.jsx';
import ContactSupport from './components/ContactSupport.jsx';
import SubscriptionManagement from './components/SubscriptionManagement.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Lazy-loaded page components — code-splits the heavy data files
// (maintenance-schedules.js 192KB and fuse-boxes.js 188KB) out of the main bundle.
const MaintenanceSchedule = lazy(() => import('./components/MaintenanceSchedule.jsx'));
const FuseBox = lazy(() => import('./components/FuseBox.jsx'));

// Simple loading placeholder for lazy-loaded page components
function PageLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default function Router({
  // Page state
  page,
  setPage,
  navigate,

  // Auth state
  auth,
  isAuthenticated,

  // Premium state
  premium,
  cancelSubDialog,
  setCancelSubDialog,

  // Sync state
  sync,
  effectiveOnline,
  forceOffline,
  setForceOffline,
  hasUnsyncedChanges,
  syncError,
  setSyncError,
  showSyncError,

  // Vehicle selection
  selectedVehicleId,
  handleSelectVehicle,

  // Store data
  vehiclesStore,
  logsStore,
  remindersStore,
  fuelLogsStore,
  modsStore,
  localDocuments,

  // Supabase stores (for delete sync)
  supabaseVehicles,
  supabaseLogs,
  supabaseReminders,
  supabaseFuelLogs,
  supabaseMods,
  supabaseDocuments,

  // Handlers
  handleLogout,
  addVehicle,
  addLog,
  addReminder,
  handleAddDocument,
  handleDeleteDocument,
  handleReset,
  handleDeleteAccount,
  handleUpgrade,
  handleSyncFromCloud,
  handlePushToCloud,

  // Analytics
  analytics,
}) {
  // Render landing page
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

  // Render premium paywall
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
    schedule: <Suspense fallback={<PageLoader />}><MaintenanceSchedule
      vehicle={vehiclesStore.data.find(v => v.id === selectedVehicleId) || vehiclesStore.data[0] || null}
      logs={logsStore.data}
      onAddLog={addLog}
      onNavigate={navigate}
      selectedVehicleId={selectedVehicleId}
    /></Suspense>,
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
      onUpdate={(id, data) => { modsStore.updateItem(id, data); sync.markChanged(); }}
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
    wiring: <Suspense fallback={<PageLoader />}><FuseBox
      selectedVehicle={vehiclesStore.data.find(v => v.id === selectedVehicleId) || vehiclesStore.data[0] || null}
    /></Suspense>,
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
