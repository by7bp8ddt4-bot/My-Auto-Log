import { lazy, Suspense } from 'react';
import PageLoader from './PageLoader.jsx';

const MaintenanceSchedule = lazy(() => import('../components/MaintenanceSchedule.jsx'));

export default function SchedulePage({
  vehicles, selectedVehicleId, logs, addLog, navigate,
}) {
  return (
    <Suspense fallback={<PageLoader />}>
      <MaintenanceSchedule
        vehicle={vehicles.find(v => v.id === selectedVehicleId) || vehicles[0] || null}
        logs={logs}
        onAddLog={addLog}
        onNavigate={navigate}
        selectedVehicleId={selectedVehicleId}
      />
    </Suspense>
  );
}
