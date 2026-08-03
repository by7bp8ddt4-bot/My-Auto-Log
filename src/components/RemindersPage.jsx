import { useState, useMemo } from 'react';
import {
  Gauge, Calendar, AlertTriangle, Clock,
  ChevronRight, Crown, ArrowRight,
  X, ToggleRight, ToggleLeft,
  Bell, Plus
} from 'lucide-react';
import { formatNumber, calculateReminderStatus } from '../utils/helpers';
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

// ---------- Folder Tab Component ----------

function FolderTab({ icon: Icon, title, count, isExpanded, onToggle, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
      <div
        onClick={onToggle}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/40 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800">
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{title}</h3>
            <p className="text-xs text-slate-500">{count} {count === 1 ? 'item' : 'items'}</p>
          </div>
        </div>
        <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ---------- Main Component ----------

export default function RemindersPage({ reminders, vehicles, logs, onAdd, onUpdate, onDelete, onNavigate, isPremium, selectedVehicleId }) {
  const [expandedTabs, setExpandedTabs] = useState({
    mileage: true,
    lease: true,
    custom: true,
  });
  const [showReminderForm, setShowReminderForm] = useState(false);

  const toggleTab = (tab) => {
    setExpandedTabs(prev => ({ ...prev, [tab]: !prev[tab] }));
  };

  // Filter reminders by selected vehicle
  const filteredReminders = selectedVehicleId
    ? reminders.filter(r => r.vehicleId === selectedVehicleId)
    : reminders;

  // Compute status for each reminder
  const remindersWithStatus = useMemo(() => {
    return filteredReminders.map(r => {
      const vehicle = vehicles.find(v => v.id === r.vehicleId);
      const status = calculateReminderStatus(r, vehicle?.mileage || 0, r.vehicleId);
      return { ...r, ...status, vehicleName: vehicle?.name || 'Unknown' };
    });
  }, [filteredReminders, vehicles]);

  // Lease reminders: build from leased vehicles
  const leasedVehicles = useMemo(() => {
    return vehicles.filter(v => v.isLeased);
  }, [vehicles]);

  const leaseReminders = useMemo(() => {
    return leasedVehicles.map(v => {
      const mileage = v.mileage || 0;
      const purchaseMileage = v.purchaseMileage || 0;
      const purchaseDate = v.purchaseDate ? new Date(v.purchaseDate) : null;
      const leaseEndDate = v.leaseEndDate ? new Date(v.leaseEndDate) : null;
      const leaseLimit = v.leaseMileageLimit || 0;

      // Calculate daily average
      let dailyAvg = 0;
      if (purchaseDate && leaseEndDate) {
        const daysOwned = Math.max(1, Math.ceil((Date.now() - purchaseDate.getTime()) / (24 * 60 * 60 * 1000)));
        const milesDriven = mileage - purchaseMileage;
        dailyAvg = milesDriven / daysOwned;
      }

      // Days remaining on lease
      const daysRemaining = leaseEndDate ? Math.ceil((leaseEndDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : 0;

      // Projected mileage at lease end
      const projectedMileage = leaseEndDate && dailyAvg > 0
        ? Math.round(mileage + dailyAvg * daysRemaining)
        : mileage;

      const overUnder = projectedMileage - leaseLimit;

      return {
        vehicleId: v.id,
        vehicleName: v.name,
        vehicleMake: v.make,
        vehicleModel: v.model,
        mileage,
        leaseLimit,
        leaseEndDate: v.leaseEndDate,
        daysRemaining,
        projectedMileage,
        overUnder,
        dailyAvg,
      };
    });
  }, [leasedVehicles, vehicles]);

  // ---------- Premium Gate ----------

  if (!isPremium) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Reminders</h2>
            <p className="text-sm text-slate-400 mt-0.5">Smart vehicle alerts</p>
          </div>
        </div>
        <PremiumGate onNavigate={onNavigate} />
      </div>
    );
  }

  // ---------- Render ----------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Reminders</h2>
        <p className="text-sm text-slate-400 mt-0.5">{remindersWithStatus.length} total items</p>
      </div>

      {/* 1. Mileage Reminders */}
      <FolderTab
        icon={Gauge}
        title="Mileage Reminders"
        count=""
        isExpanded={expandedTabs.mileage}
        onToggle={() => toggleTab('mileage')}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            MTXtrkr sends you periodic mileage update requests via email to keep your
            maintenance predictions accurate. When we ask, simply reply with your current
            odometer reading — or log in to update it instantly.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all"
          >
            <Gauge className="w-3.5 h-3.5" />
            Update Mileage
          </button>
        </div>
      </FolderTab>

      {/* 2. Lease Reminders */}
      <FolderTab
        icon={Calendar}
        title="Lease Reminders"
        count=""
        isExpanded={expandedTabs.lease}
        onToggle={() => toggleTab('lease')}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            MTXtrkr sends you monthly lease mileage projection emails comparing your
            actual driving pace against your lease mileage limit — so you always know
            where you stand before turn-in.
          </p>

          {/* Check Lease Status CTA */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white">Check Your Lease Status</h4>
                <p className="text-xs text-slate-400">See your mileage projection and remaining allowance</p>
              </div>
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-all"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Lease Tracking
              </button>
            </div>
          </div>
        </div>
      </FolderTab>

      {/* 3. Custom Reminders */}
      <FolderTab
        icon={Bell}
        title="Custom Reminders"
        count=""
        isExpanded={expandedTabs.custom}
        onToggle={() => toggleTab('custom')}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Set custom maintenance reminders with mileage and date intervals. Get
            notified when specific services are due based on your own schedule.
          </p>
          <button
            onClick={() => setShowReminderForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Reminder
          </button>
        </div>
      </FolderTab>

      {/* Reminder Form Modal */}
      {showReminderForm && (
        <ReminderFormModal
          vehicles={vehicles}
          templates={DEFAULT_REMINDER_TEMPLATES}
          selectedVehicleId={selectedVehicleId}
          onSave={(data) => { onAdd(data); setShowReminderForm(false); }}
          onClose={() => setShowReminderForm(false)}
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
