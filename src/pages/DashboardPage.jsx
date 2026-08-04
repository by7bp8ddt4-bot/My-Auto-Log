import Dashboard from '../components/Dashboard.jsx';

export default function DashboardPage({
  vehicles, logs, reminders, fuelLogs, modifications, navigate, addLog,
  premium, selectedVehicleId, handleSelectVehicle, isAuthenticated,
}) {
  return (
    <Dashboard
      vehicles={vehicles}
      logs={logs}
      reminders={reminders}
      fuelLogs={fuelLogs}
      modifications={modifications}
      onNavigate={navigate}
      onAddLog={addLog}
      isPremium={premium}
      selectedVehicleId={selectedVehicleId}
      onSelectVehicle={handleSelectVehicle}
      isAuthenticated={isAuthenticated}
    />
  );
}
