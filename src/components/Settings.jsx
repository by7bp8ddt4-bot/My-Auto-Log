import { Settings2, Download, Trash2, RefreshCw, Database, User, Crown, ChevronRight, LogOut, Mail, Cloud, CheckCircle2 } from 'lucide-react';
import { getSubscriptionData } from './SubscriptionManagement.jsx';
import { useState } from 'react';

export default function Settings({ onReset, onExport, vehicles, logs, reminders, isAuthenticated, isPremium, onNavigate, onLogout, onDeleteAccount, showCancelSubDialog, onDismissCancelSub, onSyncFromCloud, onPushToCloud }) {
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [pushDone, setPushDone] = useState(false);
  const sub = getSubscriptionData();
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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPremium ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20' : 'bg-blue-500/10'}`}>
              {isPremium ? <Crown className="w-5 h-5 text-yellow-400" /> : <User className="w-5 h-5 text-blue-400" />}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">Account</h3>
              <p className="text-xs text-slate-500">
                {isPremium
                  ? `Premium — ${sub.plan === 'yearly' ? 'Yearly' : 'Monthly'} Plan`
                  : 'Free Plan — 1 vehicle limit'}
              </p>
            </div>
            {isPremium && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
                sub.status === 'cancelled'
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'bg-emerald-500/15 text-emerald-400'
              }`}>
                {sub.status === 'cancelled' ? 'Cancelled' : 'Active'}
              </span>
            )}
          </div>
          {isPremium ? (
            <button
              onClick={() => onNavigate('subscription')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
            >
              <Crown className="w-4 h-4" />
              Manage Subscription
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('premium')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium"
            >
              Upgrade to Premium
            </button>
          )}
        </div>

        {/* Sign Out */}
        {isAuthenticated && (
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Session</h3>
                <p className="text-xs text-slate-500">
                  Signed in with Supabase
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Sign out of MTXtrkr? Your data will remain saved in the cloud.')) {
                  onLogout();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}

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
            {isAuthenticated && (
              <>
                <button
                  onClick={async () => {
                    setSyncing(true);
                    setSyncDone(false);
                    await onSyncFromCloud();
                    setSyncing(false);
                    setSyncDone(true);
                    setTimeout(() => setSyncDone(false), 3000);
                  }}
                  disabled={syncing}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    syncDone
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : syncing
                        ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                        : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Syncing from Cloud...
                    </>
                  ) : syncDone ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Synced Successfully
                    </>
                  ) : (
                    <>
                      <Cloud className="w-4 h-4" />
                      Sync from Cloud
                    </>
                  )}
                </button>
                <button
                  onClick={async () => {
                    setPushing(true);
                    setPushDone(false);
                    await onPushToCloud();
                    setPushing(false);
                    setPushDone(true);
                    setTimeout(() => setPushDone(false), 3000);
                  }}
                  disabled={pushing}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    pushDone
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : pushing
                        ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                        : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {pushing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Pushing to Cloud...
                    </>
                  ) : pushDone ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Pushed Successfully
                    </>
                  ) : (
                    <>
                      <Cloud className="w-4 h-4" />
                      Push to Cloud
                    </>
                  )}
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-1">Not seeing your recent changes?</p>
              </>
            )}
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

        {/* Contact Support */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Need Help?</h3>
              <p className="text-xs text-slate-500">Contact our engineering team</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
          >
            <Mail className="w-4 h-4" />
            Issues? Contact our engineering team
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Delete Account */}
        {isAuthenticated && (
          <div className="p-5 rounded-2xl bg-red-900/10 border border-red-800/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Delete Account</h3>
                <p className="text-xs text-slate-500">Permanently delete all data and account</p>
              </div>
            </div>
            <button
              onClick={() => onDeleteAccount()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 text-sm text-red-400 hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        )}

        {/* Cancel Subscription First Dialog */}
        {showCancelSubDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">Cancel Subscription First</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    You have an active Premium subscription. You need to cancel it before you can delete your account. Once cancelled, you can return here to complete the deletion.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { onDismissCancelSub(); onNavigate('subscription'); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-all"
                >
                  <Crown className="w-4 h-4" />
                  Go to Subscription Management
                </button>
                <button
                  onClick={onDismissCancelSub}
                  className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-all"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}