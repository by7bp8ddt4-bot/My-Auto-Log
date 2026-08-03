import { lazy, Suspense } from 'react';
import PageLoader from './PageLoader.jsx';

const VehicleSpecs = lazy(() => import('../components/VehicleSpecs.jsx'));

export default function SpecsPage({ vehicles, selectedVehicleId }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <VehicleSpecs
        selectedVehicle={vehicles.find(v => v.id === selectedVehicleId) || vehicles[0] || null}
      />
    </Suspense>
  );
}
