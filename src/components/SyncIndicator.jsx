import { useState } from 'react';
import { Wifi, WifiOff, Cloud, CheckCircle2, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function SyncIndicator({ isOnline, syncing, lastSync, pendingChanges, forceOffline, setForceOffline }) {
  const [showDetails, setShowDetails] = useState(false);

  const lastSyncStr = lastSync
    ? new Date(lastSync).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : 'Never';

  const actuallyOnline = typeof forceOffline !== 'undefined' ? !forceOffline : isOnline;

  const indicatorText = syncing
    ? 'Syncing to cloud...'
    : actuallyOnline
      ? pendingChanges > 0
        ? `${pendingChanges} change${pendingChanges > 1 ? 's' : ''} pending sync`
        : 'Online — All changes synced'
      : 'Offline — Caching locally';

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Main Status Badge */}
      <div
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm transition-all duration-300 cursor-pointer
          ${syncing ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
            actuallyOnline ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
            'bg-amber-500/20 text-amber-300 border border-amber-500/30'}
        `}
        onClick={() => setShowDetails(!showDetails)}
      >
        {syncing ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Syncing...</span>
          </>
        ) : actuallyOnline ? (
          <>
            {pendingChanges > 0 ? (
              <Cloud className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{indicatorText}</span>
            <span className="hidden sm:inline opacity-60">{lastSyncStr}</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Offline — Caching locally</span>
          </>
        )}
      </div>

      {/* Details Panel */}
      {showDetails && (
        <div className="w-64 p-3 rounded-xl bg-slate-900/95 border border-slate-700/50 shadow-xl backdrop-blur-md">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-medium">Sync Status</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status</span>
              <span className={`font-medium ${syncing ? 'text-blue-300' : actuallyOnline ? 'text-emerald-300' : 'text-amber-300'}`}>
                {syncing ? 'Syncing...' : actuallyOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Last sync</span>
              <span className="text-slate-300">{lastSyncStr}</span>
            </div>
            {pendingChanges > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Pending changes</span>
                <span className="text-amber-300 font-medium">{pendingChanges}</span>
              </div>
            )}

            {/* Simulate Offline Toggle */}
            <div className="pt-2 mt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Simulate Offline Mode</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setForceOffline?.(!forceOffline);
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {forceOffline ? (
                    <ToggleRight className="w-5 h-5 text-amber-400" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-600 mt-1">
                {forceOffline
                  ? 'Offline mode active. Changes are cached locally.'
                  : 'Toggle to test offline capabilities.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}