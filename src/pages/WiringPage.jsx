import { lazy, Suspense } from 'react';
import PageLoader from './PageLoader.jsx';

const FuseBox = lazy(() => import('../components/FuseBox.jsx'));

export default function WiringPage({ vehicles, selectedVehicleId }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <FuseBox
        selectedVehicle={vehicles.find(v => v.id === selectedVehicleId) || vehicles[0] || null}
      />
    </Suspense>
  );
}
