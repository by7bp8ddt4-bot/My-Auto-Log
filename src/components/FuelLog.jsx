import { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Fuel, DollarSign, Gauge, Plus, X, Calendar } from 'lucide-react';
import { formatDate, formatCurrency, formatNumber, generateId, getLocalDateString } from '../utils/helpers';

const OCTANE_OPTIONS = ['regular', 'mid-grade', 'premium', 'diesel', 'e85'];

export default function FuelLog({ logs, vehicles, onAdd, onUpdate, onDelete, selectedVehicleId }) {
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  const filteredLogs = selectedVehicleId ? logs.filter(l => l.vehicleId === selectedVehicleId) : logs;
  const getVehicleName = (id) => vehicles.find(v => v.id === id)?.name || 'Unknown';

  // Calculate MPG from consecutive fill-ups
  const mpgData = useMemo(() => {
    const byVehicle = {};
    filteredLogs
      .filter(l => l.is_full_tank && l.gallons > 0)
      .sort((a, b) => a.mileage - b.mileage)
      .forEach((log, i, arr) => {
        if (i === 0) return;
        const prev = arr[i - 1];
        if (log.vehicleId !== prev.vehicleId) return;
        const miles = log.mileage - prev.mileage;
        const mpg = miles / log.gallons;
        if (mpg > 5 && mpg < 60) {
          byVehicle[log.vehicleId] = byVehicle[log.vehicleId] || [];
          byVehicle[log.vehicleId].push({
            date: log.date,
            mpg: Math.round(mpg * 10) / 10,
            miles,
            gallons: log.gallons,
          });
        }
      });
    return byVehicle;
  }, [filteredLogs]);

  const totalSpent = filteredLogs.reduce((s, l) => s + (l.cost || 0), 0);
  const totalGallons = filteredLogs.reduce((s, l) => s + (parseFloat(l.gallons) || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Fuel Economy</h2>
          <p className="text-sm text-slate-400 mt-0.5">{filteredLogs.length} fill-ups logged</p>
        </div>
        <button
          onClick={() => { if (vehicles.length === 0) return; setShowForm(true); }}
          disabled={vehicles.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Log Fill-Up
        </button>
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800">
          <Fuel className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-1">Add a vehicle first</p>
        </div>
      )}

      {vehicles.length > 0 && (
        <>
          {/* Vehicle filter + Stats */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button onClick={() => setVehicleFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${vehicleFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>All</button>
              {vehicles.map(v => (
                <button key={v.id} onClick={() => setVehicleFilter(v.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${vehicleFilter === v.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>{v.name}</button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 ml-auto">
              <span><span className="text-emerald-400 font-medium">{formatCurrency(totalSpent)}</span> total</span>
              <span><span className="text-cyan-400 font-medium">{formatNumber(totalGallons)}</span> gal</span>
            </div>
          </div>

          {/* MPG Summary Cards */}
          {Object.entries(mpgData).length > 0 && Object.entries(mpgData).map(([vId, entries]) => {
            const avgMpg = entries.reduce((s, e) => s + e.mpg, 0) / entries.length;
            const lastMpg = entries[entries.length - 1]?.mpg || 0;
            const vehicle = vehicles.find(v => v.id === vId);
            return (
              <div key={vId} className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-600/5 to-cyan-600/5 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-white">{vehicle?.name || 'Unknown'} — Fuel Economy</h3>
                  <span className="text-xs text-emerald-400 font-medium">{avgMpg.toFixed(1)} avg MPG</span>
                </div>
                {/* Mini MPG bar chart */}
                <div className="flex items-end gap-1 h-16">
                  {entries.slice(-12).map((e, i) => {
                    const pct = Math.min(100, (e.mpg / 50) * 100);
                    const isBest = e.mpg === Math.max(...entries.slice(-12).map(x => x.mpg));
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                        <div
                          className={`w-full rounded-sm transition-all ${isBest ? 'bg-emerald-400' : 'bg-emerald-500/40'}`}
                          style={{ height: `${Math.max(4, pct)}%` }}
                        />
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-[8px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                          {e.mpg} MPG
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>Last: {lastMpg.toFixed(1)} MPG</span>
                  <span>{entries.length} records</span>
                </div>
              </div>
            );
          })}

          {/* Fill-up List */}
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800">
              <Fuel className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-1">No fill-ups logged yet</p>
              <button onClick={() => setShowForm(true)}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium">
                <Plus className="w-3.5 h-3.5" /> Log your first fill-up
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.sort((a, b) => new Date(b.date) - new Date(a.date)).map(log => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{getVehicleName(log.vehicleId)}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{log.octane}</span>
                        {!log.is_full_tank && <span className="text-[10px] text-amber-400">Partial</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(log.date)}</span>
                        <span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{formatNumber(log.mileage)} mi</span>
                        <span className="flex items-center gap-1 text-cyan-400"><Fuel className="w-3 h-3" />{parseFloat(log.gallons).toFixed(2)} gal</span>
                        <span className="flex items-center gap-1 text-emerald-400"><DollarSign className="w-3 h-3" />{formatCurrency(log.cost)}</span>
                      </div>
                      {log.notes && <p className="text-[10px] text-slate-600 mt-1">{log.notes}</p>}
                    </div>
                    <button onClick={() => onDelete(log.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-all shrink-0">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showForm && (
        <FuelFormModal vehicles={vehicles} onSave={(data) => { onAdd(data); setShowForm(false); }} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

function FuelFormModal({ vehicles, onSave, onClose }) {
  const [form, setForm] = useState({
    vehicleId: vehicles[0]?.id || '',
    date: getLocalDateString(),
    mileage: '',
    gallons: '',
    cost: '',
    is_full_tank: true,
    octane: 'regular',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vehicleId || !form.mileage || !form.gallons) return;
    onSave({
      ...form,
      mileage: parseInt(form.mileage) || 0,
      gallons: parseFloat(form.gallons) || 0,
      cost: parseFloat(form.cost) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Log Fill-Up</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Vehicle *</label>
            <select value={form.vehicleId} onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" required>
              <option value="">Select vehicle</option>
              {vehicles.map(v => (<option key={v.id} value={v.id}>{v.name} — {v.make} {v.model}</option>))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Mileage *</label>
              <input type="number" value={form.mileage} onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))}
                placeholder="e.g. 45200"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Gallons *</label>
              <input type="number" step="0.01" value={form.gallons} onChange={e => setForm(f => ({ ...f, gallons: e.target.value }))}
                placeholder="e.g. 12.5"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Cost ($)</label>
              <input type="number" step="0.01" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Fuel Type</label>
              <select value={form.octane} onChange={e => setForm(f => ({ ...f, octane: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm">
                {OCTANE_OPTIONS.map(o => (<option key={o} value={o}>{o}</option>))}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_full_tank} onChange={e => setForm(f => ({ ...f, is_full_tank: e.target.checked }))}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600" />
                <span className="text-xs text-slate-400">Full tank</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Notes</label>
            <input type="text" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="e.g. Shell, 87 octane"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800">Cancel</button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium">Log Fill-Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}