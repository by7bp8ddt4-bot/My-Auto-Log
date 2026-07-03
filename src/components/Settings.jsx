import { Settings2, Download, Trash2, RefreshCw, Database, User } from 'lucide-react';

export default function Settings({ onReset, onExport, vehicles, logs, reminders, isAuthenticated }) {
  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      vehicles,
      maintenanceLogs: logs,
      reminders,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const d = new Date();
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    a.download = `mtxtrkr-export-${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-sm text-slate-400 mt-0.5">Manage your app data and preferences</p>
      </div>

      <div className="space-y-4">
        {/* Account */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Account</h3>
              <p className="text-xs text-slate-500">Free Plan — 1 vehicle limit</p>
            </div>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'premium' }))}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium"
          >
            Upgrade to Premium
          </button>
        </div>

        {/* Data Management */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Data Management</h3>
              <p className="text-xs text-slate-500">
                {vehicles.length} vehicles, {logs.length} logs, {reminders.length} reminders
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 text-sm text-slate-300 hover:bg-slate-800 transition-all"
            >
              <Download className="w-4 h-4" />
              Export All Data (JSON)
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset all data? This cannot be undone. All vehicles, logs, and reminders will be permanently deleted.')) {
                  onReset();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 text-sm text-red-400 hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Reset All Data
            </button>
          </div>
        </div>

        {/* Storage Info */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <RefreshCw className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-semibold text-white">Storage</h3>
          </div>
          <p className="text-xs text-slate-500">
            {isAuthenticated ? 'Your data is securely synced to the cloud and available across all your devices.' : 'Data is currently stored locally in your browser.'} Offline changes are saved and sync automatically when you're back online.
          </p>
        </div>
      </div>
    </div>
  );
}