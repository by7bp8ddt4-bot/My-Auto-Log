import ErrorBoundary from './components/ErrorBoundary.jsx';
import Layout from './components/Layout.jsx';
import SyncIndicator from './components/SyncIndicator.jsx';
import { ShieldCheck } from 'lucide-react';

// Page components — each handles its own imports and rendering
import LandingPage from './pages/LandingPage.jsx';
import PremiumPage from './pages/PremiumPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import VehiclesPage from './pages/VehiclesPage.jsx';
import LogsPage from './pages/LogsPage.jsx';
import RemindersPage from './pages/RemindersPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import MileagePage from './pages/MileagePage.jsx';
import SchedulePage from './pages/SchedulePage.jsx';
import FuelPage from './pages/FuelPage.jsx';
import ModsPage from './pages/ModsPage.jsx';
import DocumentsPage from './pages/DocumentsPage.jsx';
import SpecsPage from './pages/SpecsPage.jsx';
import WiringPage from './pages/WiringPage.jsx';
import OwnersManualPage from './pages/OwnersManualPage.jsx';
import SubscriptionPage from './pages/SubscriptionPage.jsx';
import ContactPage from './pages/ContactPage.jsx';

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
  tier,
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
        <LandingPage analytics={analytics} setPage={setPage} />
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
        <PremiumPage
          analytics={analytics}
          setPage={setPage}
          handleUpgrade={handleUpgrade}
          userId={auth.user?.id}
        />
      </ErrorBoundary>
    );
  }

  const pages = {
    dashboard: <DashboardPage
      vehicles={vehiclesStore.data}
      logs={logsStore.data}
      reminders={remindersStore.data}
      fuelLogs={fuelLogsStore.data}
      modifications={modsStore.data}
      navigate={navigate}
      addLog={addLog}
      premium={premium}
      selectedVehicleId={selectedVehicleId}
      handleSelectVehicle={handleSelectVehicle}
      isAuthenticated={isAuthenticated}
    />,
    vehicles: <VehiclesPage
      vehiclesStore={vehiclesStore}
      addVehicle={addVehicle}
      sync={sync}
      showSyncError={showSyncError}
      supabaseVehicles={supabaseVehicles}
      premium={premium}
      tier={tier}
      navigate={navigate}
    />,
    logs: <LogsPage
      logsStore={logsStore}
      vehicles={vehiclesStore.data}
      addLog={addLog}
      sync={sync}
      showSyncError={showSyncError}
      supabaseLogs={supabaseLogs}
      navigate={navigate}
      premium={premium}
      selectedVehicleId={selectedVehicleId}
    />,
    reminders: <RemindersPage
      remindersStore={remindersStore}
      vehicles={vehiclesStore.data}
      logs={logsStore.data}
      addReminder={addReminder}
      sync={sync}
      showSyncError={showSyncError}
      supabaseReminders={supabaseReminders}
      premium={premium}
      navigate={navigate}
      selectedVehicleId={selectedVehicleId}
    />,
    settings: <SettingsPage
      handleReset={handleReset}
      handleDeleteAccount={handleDeleteAccount}
      vehicles={vehiclesStore.data}
      logs={logsStore.data}
      reminders={remindersStore.data}
      fuelLogs={fuelLogsStore.data}
      modifications={modsStore.data}
      isAuthenticated={isAuthenticated}
      premium={premium}
      navigate={navigate}
      handleLogout={handleLogout}
      cancelSubDialog={cancelSubDialog}
      setCancelSubDialog={setCancelSubDialog}
      handleSyncFromCloud={handleSyncFromCloud}
      handlePushToCloud={handlePushToCloud}
    />,
    mileage: <MileagePage
      logs={logsStore.data}
      vehicles={vehiclesStore.data}
      premium={premium}
    />,
    schedule: <SchedulePage
      vehicles={vehiclesStore.data}
      selectedVehicleId={selectedVehicleId}
      logs={logsStore.data}
      addLog={addLog}
      navigate={navigate}
    />,
    fuel: <FuelPage
      fuelLogsStore={fuelLogsStore}
      vehicles={vehiclesStore.data}
      sync={sync}
      showSyncError={showSyncError}
      supabaseFuelLogs={supabaseFuelLogs}
      selectedVehicleId={selectedVehicleId}
    />,
    mods: <ModsPage
      modsStore={modsStore}
      vehicles={vehiclesStore.data}
      sync={sync}
      showSyncError={showSyncError}
      supabaseMods={supabaseMods}
      navigate={navigate}
      premium={premium}
      selectedVehicleId={selectedVehicleId}
    />,
    documents: <DocumentsPage
      localDocuments={localDocuments}
      handleAddDocument={handleAddDocument}
      handleDeleteDocument={handleDeleteDocument}
      vehicles={vehiclesStore.data}
      navigate={navigate}
      userId={auth.user?.id}
    />,
    specs: <SpecsPage
      vehicles={vehiclesStore.data}
      selectedVehicleId={selectedVehicleId}
    />,
    wiring: <WiringPage
      vehicles={vehiclesStore.data}
      selectedVehicleId={selectedVehicleId}
    />,
    manual: <OwnersManualPage
      vehicles={vehiclesStore.data}
      selectedVehicleId={selectedVehicleId}
      isPremium={premium}
      navigate={navigate}
      userId={auth.user?.id}
    />,
    subscription: <SubscriptionPage
      userId={auth.user?.id}
      premium={premium}
      navigate={navigate}
      trackEvent={analytics.track}
    />,
    inspected: (
      <div className="max-w-4xl mx-auto text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
        <ShieldCheck className="w-12 h-12 text-purple-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Inspected Vessels</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Keep every vessel certificate current — upload certified inspection
          documents, auto-recognize expiry dates, and get reminders before they
          lapse. <span className="text-purple-300">Included with Fleet</span> — this
          feature is coming soon.
        </p>
      </div>
    ),
    contact: <ContactPage navigate={navigate} />,
    auth: <AuthPage auth={auth} navigate={navigate} />,
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
      <Layout currentPage={page} onNavigate={navigate} onLogout={handleLogout} tier={tier}>
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
