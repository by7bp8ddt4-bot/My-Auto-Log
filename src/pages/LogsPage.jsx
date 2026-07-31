import MaintenanceLog from '../components/MaintenanceLog.jsx';

export default function LogsPage({
  logsStore, vehicles, addLog, sync, showSyncError,
  supabaseLogs, navigate, premium, selectedVehicleId,
}) {
  return (
    <MaintenanceLog
      logs={logsStore.data}
      vehicles={vehicles}
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
    />
  );
}
