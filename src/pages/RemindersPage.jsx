import RemindersPage from '../components/RemindersPage.jsx';

export default function RemindersPageWrapper({
  remindersStore, vehicles, logs, addReminder, sync,
  showSyncError, supabaseReminders, premium, navigate, selectedVehicleId,
}) {
  return (
    <RemindersPage
      reminders={remindersStore.data}
      vehicles={vehicles}
      logs={logs}
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
    />
  );
}
