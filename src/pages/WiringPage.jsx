import { lazy, Suspense } from 'react';
import { Crown, ArrowRight } from 'lucide-react';
import PageLoader from './PageLoader.jsx';

const FuseBox = lazy(() => import('../components/FuseBox.jsx'));

export default function WiringPage({ vehicles, selectedVehicleId, isPremium, onNavigate }) {
  // Fuse diagrams are a Family/Fleet premium feature (owner decision 2026-08-17).
  if (!isPremium) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Fuse Diagrams</h2>
            <p className="text-sm text-slate-400 mt-0.5">Fuse and relay reference</p>
          </div>
        </div>
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Upgrade to Premium to unlock fuse diagrams and more.</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Get tappable fuse box layouts, searchable fuse and relay indexes, and
            quick-reference specs for every vehicle in your garage.
          </p>
          <button
            onClick={() => onNavigate('premium')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Premium
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-slate-600 mt-3">Includes unlimited vehicles, AI predictions, and more.</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <FuseBox
        selectedVehicle={vehicles.find(v => v.id === selectedVehicleId) || vehicles[0] || null}
      />
    </Suspense>
  );
}
