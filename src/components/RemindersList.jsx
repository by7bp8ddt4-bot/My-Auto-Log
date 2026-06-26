import { useState } from 'react';
import {
  Bell, Plus, AlertTriangle, Clock, CheckCircle2, Gauge,
  X, ToggleLeft, ToggleRight, Loader2
} from 'lucide-react';
import { formatDate, formatNumber, generateId } from '../utils/helpers';
import { DEFAULT_REMINDER_TEMPLATES } from '../utils/constants';
import { calculateReminderStatus } from '../utils/helpers';

export default function RemindersList({ reminders, vehicles, onAdd, onUpdate, onDelete, onNavigate, isPremium }) {
  const [showForm, setShowForm] = useState(false);

  const getVehicleName = (id) => vehicles.find(v => v.id === id)?.name || 'Unknown';
  const getVehicleMileage = (id) => vehicles.find(v => v.id === id)?.mileage || 0;

  const remindersWithStatus = reminders.map(r => {
    const vehicle = vehicles.find(v => v.id === r.vehicleId);
    const status = calculateReminderStatus(r, vehicle?.mileage || 0, r.vehicleId);
    return { ...r, ...status, vehicleName: vehicle?.name || 'Unknown' };
  });

  const grouped = {
    overdue: remindersWithStatus.filter(r => r.status === 'overdue'),
    'due-soon': remindersWithStatus.filter(r => r.status === 'due-soon'),
    ok: remindersWithStatus.filter(r => r.status === 'ok'),
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Reminders</h2>
          <p className="text-sm text-slate-400 mt-0.5">{reminders.length} active reminders</p>
        </div>
        <div className="flex gap-2">
          {!isPremium && (
            <button
              onClick={() => onNavigate('premium')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 text-blue-300 text-xs font-medium"
            >
              <Bell className="w-3.5 h-3.5" />
              Unlock Smart Reminders
            </button>
          )}
          <button
            onClick={() => {
              if (vehicles.length === 0) return;
              setShowForm(true);
            }}
            disabled={vehicles.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {grouped.overdue.length > 0 && (
        <WarningSection title="Overdue" color="red" reminders={grouped.overdue} onToggle={onUpdate} onDelete={onDelete} getVehicleName={getVehicleName} />
      )}
      {grouped['due-soon'].length > 0 && (
        <WarningSection title="Due Soon" color="amber" reminders={grouped['due-soon']} onToggle={onUpdate} onDelete={onDelete} getVehicleName={getVehicleName} />
      )}
      {grouped.ok.length > 0 && (
        <WarningSection title="Upcoming" color="slate" reminders={grouped.ok} onToggle={onUpdate} onDelete={onDelete} getVehicleName={getVehicleName} />
      )}

      {reminders.length === 0 && (
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
          <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-1">No reminders yet</p>
          <p className="text-xs text-slate-600 mb-4">Add reminders to never miss a service</p>
          <button
            onClick={() => {
              if (vehicles.length === 0) return;
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Reminder
          </button>
        </div>
      )}

      {showForm && (
        <ReminderFormModal
          vehicles={vehicles}
          templates={DEFAULT_REMINDER_TEMPLATES}
          onSave={(data) => { onAdd(data); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function WarningSection({ title, color, reminders, onToggle, onDelete, getVehicleName }) {
  const dotColors = { red: 'bg-red-400', amber: 'bg-amber-400', slate: 'bg-slate-500' };
  const borderColors = { red: 'border-red-500/20', amber: 'border-amber-500/20', slate: 'border-slate-700/50' };
  const progressColors = { red: 'bg-red-500', amber: 'bg-amber-500', slate: 'bg-blue-500' };
  const bgColors = { red: 'bg-red-500/5', amber: 'bg-amber-500/5', slate: '' };

  return (
    <div className={`mb-6 p-4 rounded-2xl border ${borderColors[color]} ${bgColors[color]} bg-slate-900/40`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${dotColors[color]} animate-pulse`} />
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <span className="text-[10px] text-slate-500">({reminders.length} {reminders.length === 1 ? 'item' : 'items'})</span>
      </div>
      <div className="space-y-3">
        {reminders.map(r => (
          <div key={r.id} className={`p-4 rounded-xl transition-all ${
            color === 'red' ? 'bg-red-950/30 border border-red-500/20' :
            color === 'amber' ? 'bg-amber-950/30 border border-amber-500/20' :
            'bg-slate-900/80 border border-slate-800/50'
          }`}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle className={`w-4 h-4 shrink-0 ${
                  color === 'red' ? 'text-red-400' : color === 'amber' ? 'text-amber-400' : 'text-slate-500'
                }`} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white truncate">{r.title}</div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {getVehicleName(r.vehicleId)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onToggle(r.id, { enabled: !r.enabled })}
                  className="p-1 rounded hover:bg-slate-800 text-slate-500"
                >
                  {r.enabled ? <ToggleRight className="w-4 h-4 text-blue-400" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => onDelete(r.id)} className="p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3 h-3" />
                  <span className={r.milesUntilDue < 0 ? 'text-red-400' : ''}>
                    {formatNumber(Math.abs(r.milesUntilDue))} mi {r.milesUntilDue < 0 ? 'overdue' : 'remaining'}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {r.daysUntilDue < 0 ? `${Math.abs(r.daysUntilDue)}d overdue` : `${r.daysUntilDue}d left`}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${progressColors[color]}`}
                  style={{ width: `${Math.min(100, r.percentComplete)}%` }}
                />
              </div>
            </div>

            {/* Urgency Warning */}
            {color === 'red' && (
              <div className="flex items-center gap-1.5 text-[10px] text-red-400/80 bg-red-500/5 rounded-lg px-2 py-1.5">
                <AlertTriangle className="w-3 h-3" />
                <span>Immediate attention required — {formatNumber(Math.abs(r.milesUntilDue))} miles past due</span>
              </div>
            )}
            {color === 'amber' && (
              <div className="flex items-center gap-1.5 text-[10px] text-amber-400/80 bg-amber-500/5 rounded-lg px-2 py-1.5">
                <Clock className="w-3 h-3" />
                <span>Schedule soon — only {formatNumber(Math.abs(r.milesUntilDue))} miles remaining</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReminderFormModal({ vehicles, templates, onSave, onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [custom, setCustom] = useState(false);
  const [form, setForm] = useState({
    vehicleId: vehicles[0]?.id || '',
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