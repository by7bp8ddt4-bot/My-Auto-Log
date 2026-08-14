import { lazy, Suspense } from 'react';
import PageLoader from './PageLoader.jsx';
const OwnersManual = lazy(() => import('../components/OwnersManual.jsx'));
export default function OwnersManualPage({
  vehicles, selectedVehicleId, isPremium, navigate, userId,
}) {
  return (
    <Suspense fallback={<PageLoader />}>
      <OwnersManual
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
        isPremium={isPremium}
        onNavigate={navigate}
        userId={userId}
      />
    </Suspense>
  );
}
