import Settings from '../components/Settings.jsx';

export default function SettingsPage({
  handleReset, handleDeleteAccount, vehicles, logs, reminders,
  fuelLogs, modifications, isAuthenticated, premium, navigate,
  handleLogout, cancelSubDialog, setCancelSubDialog,
  handleSyncFromCloud, handlePushToCloud,
}) {
  return (
    <Settings
      onReset={handleReset}
      onDeleteAccount={handleDeleteAccount}
      vehicles={vehicles}
      logs={logs}
      reminders={reminders}
      fuelLogs={fuelLogs}
      modifications={modifications}
      isAuthenticated={isAuthenticated}
      isPremium={premium}
      onNavigate={navigate}
      onLogout={handleLogout}
      showCancelSubDialog={cancelSubDialog}
      onDismissCancelSub={() => setCancelSubDialog(false)}
      onSyncFromCloud={handleSyncFromCloud}
      onPushToCloud={handlePushToCloud}
    />
  );
}
