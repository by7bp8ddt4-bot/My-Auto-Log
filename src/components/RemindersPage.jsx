import { useState } from 'react';
import {
  Gauge, Calendar, Bell, Crown, ArrowRight, X, Plus
} from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import { DEFAULT_REMINDER_TEMPLATES } from '../utils/constants';

// ---------- Premium Gate ----------

function PremiumGate({ onNavigate }) {
  return (
    <div className="py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
        <Crown className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Smart Reminders</h3>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
        Upgrade to Premium to unlock mileage-based reminders, lease alerts,
        maintenance schedule tracking, and more.
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
  );
}

// ---------- Highlight Card ----------

function HighlightCard({ icon: Icon, iconColor, title, subtitle, action }) {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[iconColor]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{subtitle}</p>
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Main Component ----------

export default function RemindersPage({ vehicles, onAdd, onNavigate, isPremium, selectedVehicleId }) {
  const [showReminderModal, setShowReminderModal] = useState(false);

  // ---------- Premium Gate ----------

  if (!isPremium) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Reminders</h2>
            <p className="text-sm text-slate-400 mt-0.5">Stay on top of your maintenance</p>
          </div>
        </div>
        <PremiumGate onNavigate={onNavigate} />
      </div>
    );
  }

  const handleUpdateMileage = () => {
    try {
      sessionStorage.setItem('mtxtrkr_pending_edit_vehicle', selectedVehicleId);
    } catch (e) {
      // sessionStorage may be unavailable; deep-link will still navigate
    }
    onNavigate('vehicles');
  };

  const handleSaveReminder = (data) => {
    onAdd(data);
    setShowReminderModal(false);
  };

  // ---------- Render ----------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Reminders</h2>
        <p className="text-sm text-slate-400 mt-0.5">Stay on top of your maintenance</p>
      </div>

      {/* Highlight Cards */}
      <div className="space-y-3">
        <HighlightCard
          icon={Gauge}
          iconColor="blue"
          title="Mileage Reminders"
          subtitle="Periodic email reminders to keep your odometer current for accurate predictions."
        />

        <HighlightCard
          icon={Calendar}
          iconColor="amber"
          title="Lease Reminders"
          subtitle="Monthly lease projection emails comparing your pace against your mileage limit."
        />

        <HighlightCard
          icon={Bell}
          iconColor="purple"
          title="Custom Reminders"
          subtitle="Set your own service reminders with mileage and date intervals."
          action={
            <button
              onClick={() => setShowReminderModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Reminder
            </button>
          }
        />
      </div>

      {/* Update Mileage Button */}
      <button
        onClick={handleUpdateMileage}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all"
      >
        <Gauge className="w-4 h-4" />
        Update Mileage
      </button>

      {/* Reminder Form Modal */}
      {showReminderModal && (
        <ReminderFormModal
          vehicles={vehicles}
          templates={DEFAULT_REMINDER_TEMPLATES}
          selectedVehicleId={selectedVehicleId}
          onSave={handleSaveReminder}
          onClose={() => setShowReminderModal(false)}
        />
      )}
    </div>
  );
}

// ---------- Reminder Form Modal ----------

function ReminderFormModal({ vehicles, templates, selectedVehicleId, onSave, onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [custom, setCustom] = useState(false);
  const [form, setForm] = useState({
    vehicleId: selectedVehicleId || vehicles[0]?.id || '',
    title: '',
    description: '',
    intervalMiles: 5000,
    intervalDays: 180,
    lastCompletedMileage: 0,
    lastCompletedDate: '',
    enabled: true,
  });

  const selectTemplate = (t) => {
    setSelectedTemplate(t.id);
    setCustom(false);
    setForm(f => ({
      ...f,
      title: t.title,
      description: t.description,
      intervalMiles: t.intervalMiles,
      intervalDays: t.intervalDays,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vehicleId || !form.title) return;
    onSave({
      ...form,
      lastCompletedMileage: parseInt(form.lastCompletedMileage) || 0,
      intervalMiles: parseInt(form.intervalMiles) || 5000,
      intervalDays: parseInt(form.intervalDays) || 180,
      dueMileage: (parseInt(form.lastCompletedMileage) || 0) + (parseInt(form.intervalMiles) || 5000),
      dueDate: form.lastCompletedDate
        ? new Date(new Date(form.lastCompletedDate).getTime() + (form.intervalDays || 180) * 86400000).toISOString()
        : new Date(Date.now() + (form.intervalDays || 180) * 86400000).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Add Reminder</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!custom && (
          <div className="mb-6">
            <p className="text-xs text-slate-400 mb-3 font-medium">Quick templates</p>
            <div className="grid grid-cols-2 gap-2">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => selectTemplate(t)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedTemplate === t.id
                      ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
                      : 'border-slate-700/50 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="font-medium mb-0.5">{t.title}</div>
                  <div className="opacity-60">{formatNumber(t.intervalMiles)} mi / {t.intervalDays}d</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => { setCustom(true); setSelectedTemplate(null); }}
              className="mt-2 text-xs text-blue-400 hover:text-blue-300"
            >
              Or create custom reminder →
            </button>
          </div>
        )}

        {custom && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              onClick={() => setCustom(false)}
              className="text-xs text-blue-400 hover:text-blue-300 mb-2 block"
            >
              ← Back to templates
            </button>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Vehicle *</label>
              <select
                value={form.vehicleId}
                onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                required
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Interval (miles)</label>
                <input type="number" value={form.intervalMiles} onChange={e => setForm(f => ({ ...f, intervalMiles: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Interval (days)</label>
                <input type="number" value={form.intervalDays} onChange={e => setForm(f => ({ ...f, intervalDays: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Last completed mileage</label>
                <input type="number" value={form.lastCompletedMileage} onChange={e => setForm(f => ({ ...f, lastCompletedMileage: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Last completed date</label>
                <input type="date" value={form.lastCompletedDate} onChange={e => setForm(f => ({ ...f, lastCompletedDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800">
                Cancel
              </button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium">
                Add Reminder
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
