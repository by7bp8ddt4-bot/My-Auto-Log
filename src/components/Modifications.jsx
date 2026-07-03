import { useState } from 'react';
import { Wrench, Plus, X, ShoppingBag, Tag, Calendar, Gauge, DollarSign, ChevronDown, ChevronRight, Car, Zap, ArrowUpDown, Lightbulb, Speaker, Package } from 'lucide-react';
import { formatDate, formatCurrency, formatNumber, getLocalDateString } from '../utils/helpers';

const CATEGORIES = [
  { id: 'performance', label: 'Performance', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  { id: 'exterior', label: 'Exterior', icon: Car, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  { id: 'interior', label: 'Interior', icon: ShoppingBag, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { id: 'wheels', label: 'Wheels/Tires', icon: Tag, color: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-400/20' },
  { id: 'suspension', label: 'Suspension', icon: ArrowUpDown, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  { id: 'lighting', label: 'Lighting', icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  { id: 'audio', label: 'Audio/Electronics', icon: Speaker, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20' },
  { id: 'other', label: 'Other', icon: Package, color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/20' },
];

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

export default function Modifications({ mods = [], vehicles, onAdd, onDelete, onNavigate, isPremium }) {
  const [showForm, setShowForm] = useState(false);
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [expandedFolders, setExpandedFolders] = useState({});

  const filteredMods = vehicleFilter === 'all' ? mods : mods.filter(m => m.vehicleId === vehicleFilter);
  const getVehicleName = (id) => vehicles.find(v => v.id === id)?.name || 'Unknown';
  const totalSpent = filteredMods.reduce((s, m) => s + (m.cost || 0), 0);

  const toggleFolder = (catId) => {
    setExpandedFolders(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  // Group by category
  const groupedByCategory = {};
  CATEGORIES.forEach(c => { groupedByCategory[c.id] = []; });
  filteredMods.forEach(m => {
    const cat = m.category || 'other';
    if (groupedByCategory[cat]) groupedByCategory[cat].push(m);
    else groupedByCategory[cat] = [m];
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Modifications & Upgrades</h2>
          <p className="text-sm text-slate-400 mt-0.5">{filteredMods.length} parts logged</p>
        </div>
        <button
          onClick={() => { if (vehicles.length === 0) return; setShowForm(true); }}
          disabled={vehicles.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Part
        </button>
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800">
          <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-1">Add a vehicle first</p>
        </div>
      )}

      {vehicles.length > 0 && (
        <>
          {/* Vehicle filter + Stats */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
              <button onClick={() => setVehicleFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${vehicleFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>All Vehicles</button>
              {vehicles.map(v => (
                <button key={v.id} onClick={() => setVehicleFilter(v.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${vehicleFilter === v.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>{v.name}</button>
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 ml-auto">
              <span><span className="text-emerald-400 font-medium">{formatCurrency(totalSpent)}</span> total</span>
              <span><span className="text-cyan-400 font-medium">{filteredMods.length}</span> parts</span>
            </div>
          </div>

          {/* No mods state */}
          {filteredMods.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800">
              <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-1">No parts logged yet</p>
              <button onClick={() => setShowForm(true)}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium">
                <Plus className="w-3.5 h-3.5" /> Log your first modification
              </button>
            </div>
          ) : (
            /* Category Folder List */
            <div className="space-y-4">
              {CATEGORIES.map(cat => {
                const catMods = groupedByCategory[cat.id];
                if (!catMods || catMods.length === 0) return null;
                const isExpanded = expandedFolders[cat.id] !== false; // default expanded
                const catTotal = catMods.reduce((s, m) => s + (m.cost || 0), 0);
                return (
                  <div key={cat.id} className={`rounded-2xl border transition-all overflow-hidden ${isExpanded ? 'bg-slate-900/80 border-slate-700 shadow-lg' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}>
                    {/* Folder Header */}
                    <button
                      onClick={() => toggleFolder(cat.id)}
                      className="w-full flex items-center gap-4 p-4 text-left focus:outline-none"
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cat.bg} ${cat.border} border shadow-sm`}>
                        <cat.icon className={`w-6 h-6 ${cat.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-bold text-white truncate">{cat.label}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold tracking-tight">
                            {catMods.length} {catMods.length === 1 ? 'PART' : 'PARTS'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(catTotal)} total
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-slate-800/50 bg-slate-950/30 p-2 space-y-2">
                        {catMods.sort((a, b) => new Date(b.date || b.dateInstalled || 0) - new Date(a.date || a.dateInstalled || 0)).map(mod => {
                          const vName = getVehicleName(mod.vehicleId);
                          return (
                            <div key={mod.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/50 hover:border-slate-700 transition-all group">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <span className="text-xs font-semibold text-slate-200">{vName}</span>
                                  </div>
                                  <p className="text-sm font-medium text-white mb-1">{mod.partName || mod.name}</p>
                                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(mod.date || mod.dateInstalled)}</span>
                                    <span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{formatNumber(mod.mileage || mod.mileageAtInstall || 0)} mi</span>
                                    {mod.brand && <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{mod.brand}</span>}
                                    {mod.cost > 0 && <span className="flex items-center gap-1 text-emerald-400 font-medium"><DollarSign className="w-3 h-3" />{formatCurrency(mod.cost)}</span>}
                                  </div>
                                  {mod.notes && <p className="text-[10px] text-slate-600 mt-1.5 italic leading-relaxed">{mod.notes}</p>}
                                </div>
                                <button onClick={() => onDelete(mod.id)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all shrink-0 opacity-0 group-hover:opacity-100">
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {showForm && (
        <ModFormModal
          vehicles={vehicles}
          initialVehicleId={vehicleFilter !== 'all' ? vehicleFilter : undefined}
          onSave={(data) => { onAdd(data); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function ModFormModal({ vehicles, initialVehicleId, onSave, onClose }) {
  const [form, setForm] = useState({
    vehicleId: initialVehicleId || vehicles[0]?.id || '',
    partName: '',
    category: 'performance',
    brand: '',
    date: getLocalDateString(),
    mileage: '',
    cost: '',
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vehicleId || !form.partName) return;
    onSave({
      ...form,
      mileage: parseInt(form.mileage) || 0,
      cost: parseFloat(form.cost) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Add Modification</h3>
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
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Part Name *</label>
            <input type="text" value={form.partName} onChange={e => setForm(f => ({ ...f, partName: e.target.value }))}
              placeholder="e.g. Cold Air Intake, Cat-Back Exhaust"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm">
                {CATEGORIES.map(c => (<option key={c.id} value={c.id}>{c.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Brand</label>
              <input type="text" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                placeholder="e.g. K&N, Borla"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Date Installed</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Mileage at Install</label>
              <input type="number" value={form.mileage} onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))}
                placeholder="e.g. 45200"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Cost ($)</label>
            <input type="number" step="0.01" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
              placeholder="0.00"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="e.g. Part number, installation notes, shop name"
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800">Cancel</button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium">Add Part</button>
          </div>
        </form>
      </div>
    </div>
  );
}
