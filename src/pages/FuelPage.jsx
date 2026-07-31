import FuelLog from '../components/FuelLog.jsx';

export default function FuelPage({
  fuelLogsStore, vehicles, sync, showSyncError,
  supabaseFuelLogs, selectedVehicleId,
}) {
  return (
    <FuelLog
      logs={fuelLogsStore.data}
      vehicles={vehicles}
      onAdd={(data) => { fuelLogsStore.add(data); sync.markChanged(); }}
      onDelete={async (id) => {
        fuelLogsStore.remove(id);
        const result = await supabaseFuelLogs.remove(id);
        if (result?.error) showSyncError('Delete not synced to cloud — tap Push to Cloud to retry');
        sync.markChanged();
      }}
      onUpdate={(id, data) => { fuelLogsStore.updateItem(id, data); sync.markChanged(); }}
      selectedVehicleId={selectedVehicleId}
    />
  );
}
