import Modifications from '../components/Modifications.jsx';

export default function ModsPage({
  modsStore, vehicles, sync, showSyncError,
  supabaseMods, navigate, premium, selectedVehicleId,
}) {
  return (
    <Modifications
      mods={modsStore.data}
      vehicles={vehicles}
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
    />
  );
}
