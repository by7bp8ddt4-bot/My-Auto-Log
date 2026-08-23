import { lazy, Suspense } from 'react';
import PageLoader from './PageLoader.jsx';
const InspectedVessels = lazy(() => import('../components/InspectedVessels.jsx'));

export default function InspectedVesselsPage({
  vehicles, localDocuments, handleAddDocument, handleDeleteDocument,
  isPremium, navigate, userId,
}) {
  return (
    <Suspense fallback={<PageLoader />}>
      <InspectedVessels
        vehicles={vehicles}
        documents={localDocuments.data}
        onAddDocument={handleAddDocument}
        onDeleteDocument={handleDeleteDocument}
        isPremium={isPremium}
        onNavigate={navigate}
        userId={userId}
      />
    </Suspense>
  );
}
