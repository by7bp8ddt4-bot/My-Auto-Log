import VehicleList from '../components/VehicleList.jsx';

export default function VehiclesPage({
  vehiclesStore, addVehicle, sync, showSyncError,
  supabaseVehicles, premium, tier, navigate,
}) {
  return (
    <VehicleList
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
      tier={tier}
      vehicleCount={vehiclesStore.data.length}
      onNavigate={navigate}
    />
  );
}
