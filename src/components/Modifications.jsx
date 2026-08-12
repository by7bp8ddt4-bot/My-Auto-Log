import { useState } from 'react';
import { Wrench, Palette, Armchair, Plus, X, ShoppingBag, Tag, Calendar, Gauge, DollarSign, ChevronUp, Pencil } from 'lucide-react';
import { formatDate, formatCurrency, formatNumber, getLocalDateString } from '../utils/helpers';

// 3 Folder definitions — matching the business plan
const FOLDER_DEFS = [
  {
    id: 'under-the-hood',
    label: 'Under the Hood',
    icon: Wrench,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    tabBg: 'bg-amber-600',
    tabBorder: 'border-amber-500/20',
    accent: 'text-amber-400',
    subCategories: [
      'Air Intake', 'Exhaust', 'Engine Management/Tuning', 'Forced Induction',
      'Cooling System', 'Fuel System', 'Ignition System', 'Other',
    ],
  },
  {
    id: 'exterior-accessories',
    label: 'Exterior Accessories',
    icon: Palette,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    tabBg: 'bg-blue-600',
    tabBorder: 'border-blue-500/20',
    accent: 'text-blue-400',
    subCategories: [
      'Body Kits/Aero', 'Lighting', 'Wheels/Tires', 'Suspension',
      'Roof Rack/Cargo', 'Tow/Hitch', 'Other',
    ],
  },
  {
    id: 'interior-accessories',
    label: 'Interior Accessories',
    icon: Armchair,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    tabBg: 'bg-emerald-600',
    tabBorder: 'border-emerald-500/20',
    accent: 'text-emerald-400',
    subCategories: [
      'Audio/Electronics', 'Gauges/Instrumentation', 'Seats/Harnesses',
      'Storage/Organization', 'Other',
    ],
  },
];

const FOLDER_CONFIG = {};
FOLDER_DEFS.forEach(f => { FOLDER_CONFIG[f.id] = f; });

// Map legacy category values to new folder IDs
const LEGACY_FOLDER_MAP = {
  'performance': 'under-the-hood',
  'exterior': 'exterior-accessories',
  'interior': 'interior-accessories',
  'wheels': 'exterior-accessories',
  'suspension': 'exterior-accessories',
  'lighting': 'exterior-accessories',
  'audio': 'interior-accessories',
  'other': 'under-the-hood',
  'under-hood': 'under-the-hood',
  'exterior-accessories': 'exterior-accessories',
  'interior-accessories': 'interior-accessories',
};

/** Resolve the folder ID for a mod, handling legacy data */
function getModFolder(mod) {
  if (mod.folder && FOLDER_CONFIG[mod.folder]) return mod.folder;
  if (mod.category) return LEGACY_FOLDER_MAP[mod.category] || 'under-the-hood';
  return 'under-the-hood';
}

export default function Modifications({ mods = [], vehicles, onAdd, onUpdate, onDelete, onNavigate, isPremium, selectedVehicleId }) {
  const [showForm, setShowForm] = useState(false);
  const [editingMod, setEditingMod] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);

  const filteredMods = selectedVehicleId ? mods.filter(m => m.vehicleId === selectedVehicleId) : mods;
  const getVehicleName = (id) => vehicles.find(v => v.id === id)?.name || 'Unknown';
  const totalSpent = filteredMods.reduce((s, m) => s + (m.cost || 0), 0);

  // Group mods by their resolved folder
  const grouped = FOLDER_DEFS.map(folder => {
    const folderMods = filteredMods.filter(m => getModFolder(m) === folder.id);
    const folderTotal = folderMods.reduce((s, m) => s + (m.cost || 0), 0);
    const lastDate = folderMods.reduce((best, m) => {
      const d = m.date || m.dateInstalled;
      if (!d) return best;
      return !best || new Date(d) > new Date(best) ? d : best;
    }, null);
    return { folder, mods: folderMods, totalCost: folderTotal, lastDate };
  });

  const toggleFolder = (folderId) => {
    setActiveFolder(prev => prev === folderId ? null : folderId);
  };

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
          {/* Stats summary */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <p className="text-xs text-slate-500 ml-auto">
              Total: <span className="text-emerald-400 font-medium">{formatCurrency(totalSpent)}</span> &middot;{' '}
              <span className="text-cyan-400 font-medium">{filteredMods.length}</span> parts
            </p>
          </div>

          {/* No mods state — banner, cabinet stays visible below (parity with Service Logs) */}
          {filteredMods.length === 0 && (
            <div className="text-center py-6 bg-slate-900/30 rounded-2xl border border-slate-800 mb-4">
              <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400 mb-1">No parts logged yet</p>
              <button onClick={() => setShowForm(true)}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium">
                <Plus className="w-3.5 h-3.5" /> Log your first modification
              </button>
            </div>
          )}

          {/* Cabinet Drawer Container — always visible, even when empty */}
          <div className="relative flex flex-col py-2 rounded-3xl bg-slate-950/20 border border-slate-900/60 shadow-inner">
            {/* Render in reverse so Under the Hood sits in the foreground (last = highest z-index) */}
            {grouped.slice().reverse().map(({ folder, mods: folderMods, totalCost, lastDate }, index, renderedOrder) => {
              // Always show all 3 folders
              const isActive = activeFolder === folder.id;
              const isAfterActive = index > 0 && renderedOrder[index - 1]?.folder.id === activeFolder;
              const config = FOLDER_CONFIG[folder.id];
              return (
                <div
                  key={folder.id}
                  onClick={() => toggleFolder(folder.id)}
                  style={{ zIndex: isActive ? 40 : 10 + index }}
                  className={`
                    relative flex flex-col rounded-2xl border-2
                    bg-gradient-to-b from-slate-900 to-slate-950
                    transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none
                    ${isActive
                      ? 'border-slate-700 -translate-y-2 scale-[1.01] shadow-[0_-12px_24px_rgba(2,6,23,0.6),_0_20px_30px_rgba(0,0,0,0.5)]'
                      : 'border-slate-800 hover:border-slate-700 shadow-[0_-4px_12px_rgba(0,0,0,0.3)]'
                    }
                    ${index > 0 && !isAfterActive ? '-mt-10 sm:-mt-12' : ''}
                    ${isAfterActive ? 'mt-10 sm:mt-12' : ''}
                  `}
                >
                  {/* The Tab — physically protruding from top of card */}
                  <div
                    className={`
                      absolute left-4 -top-[33px] h-9 px-4 flex items-center gap-2
                      rounded-t-xl border-t-2 border-x-2 border-b-0 transition-all duration-300 z-10
                      ${isActive
                        ? `${config.tabBg} backdrop-blur-md font-bold ${config.tabBorder}`
                        : 'bg-slate-900/80 border-slate-700/40 text-slate-400 hover:text-white'
                      }
                    `}
                  >
                    {/* Icon */}
                    <config.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    {/* Tab Label — uppercase per spec */}
                    <span className="text-[11px] uppercase tracking-wider font-mono whitespace-nowrap">{folder.label}</span>
                    {/* Part count badge inside tab */}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                      isActive ? 'bg-slate-950/40 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {folderMods.length}
                    </span>
                  </div>

                  {/* Folder Header — always visible (even when collapsed) */}
                  <div className="flex items-center justify-between p-4 pt-5">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        {folder.label}
                        {isActive && (
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFolder(folder.id); }}
                            className="ml-1 p-1 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
                            title="Collapse folder"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-1">
                        {lastDate ? `Last modded: ${formatDate(lastDate)}` : 'No modifications yet'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10">
                        {formatCurrency(totalCost)}
                      </span>
                    </div>
                  </div>

                  {/* Folder Contents — revealed on active state with max-h animation */}
                  <div
                    className={`
                      transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden
                      ${isActive ? 'max-h-[1200px] border-t border-slate-800 bg-slate-950/20 p-4 space-y-3' : 'max-h-0'}
                    `}
                  >
                    {folderMods.length > 0 ? (
                      folderMods
                        .sort((a, b) => new Date(b.date || b.dateInstalled || 0) - new Date(a.date || a.dateInstalled || 0))
                        .map(mod => {
                          const vName = getVehicleName(mod.vehicleId);
                          const subCat = mod.subCategory || mod.category || 'Other';
                          return (
                            <div key={mod.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/50 hover:border-slate-700 transition-all group">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <span className="text-xs font-semibold text-slate-200">{vName}</span>
                                    {subCat && (
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md ${config.bg} ${config.accent} font-medium`}>
                                        {subCat}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm font-medium text-white mb-1">
                                    {mod.partName || mod.name}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(mod.date || mod.dateInstalled)}</span>
                                    <span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{formatNumber(mod.mileage || mod.mileageAtInstall || 0)} mi</span>
                                    {mod.brand && <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{mod.brand}</span>}
                                    {mod.cost > 0 && <span className="flex items-center gap-1 text-emerald-400 font-medium"><DollarSign className="w-3 h-3" />{formatCurrency(mod.cost)}</span>}
                                  </div>
                                  {mod.notes && (
                                    <p className="text-[10px] text-slate-600 mt-1.5 italic leading-relaxed">{mod.notes}</p>
                                  )}
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditingMod(mod); setShowForm(true); }}
                                  className="p-1.5 rounded-lg hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 transition-all"
                                  title="Edit modification"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this modification? This cannot be undone.')) onDelete(mod.id); }}
                                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all shrink-0 opacity-0 group-hover:opacity-100"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingBag className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">No parts logged in {folder.label} yet</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowForm(true); }}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-medium transition-all"
                        >
                          <Plus className="w-3 h-3" /> Log a modification
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {showForm && (
        <ModFormModal
          vehicles={vehicles}
          initialVehicleId={selectedVehicleId}
          initialData={editingMod}
          isEditing={!!editingMod}
          onSave={editingMod
            ? (data) => { onUpdate(editingMod.id, data); setShowForm(false); setEditingMod(null); }
            : (data) => { onAdd(data); setShowForm(false); }
          }
          onClose={() => { setShowForm(false); setEditingMod(null); }}
        />
      )}
    </div>
  );
}

function ModFormModal({ vehicles, initialVehicleId, initialData, isEditing, onSave, onClose }) {
  const [form, setForm] = useState({
    vehicleId: initialData?.vehicleId || initialVehicleId || vehicles[0]?.id || '',
    partName: initialData?.name || '',
    folder: initialData?.category?.split(' > ')[0] || 'under-the-hood',
    subCategory: initialData?.category?.split(' > ')[1] || '',
    subCategoryMode: 'predetermined',
    customSubCategory: '',
    date: initialData?.date || getLocalDateString(),
    mileage: initialData?.mileage_at_install?.toString() || '',
    cost: initialData?.cost?.toString() || '',
    notes: initialData?.notes || '',
  });

  const currentFolder = FOLDER_CONFIG[form.folder] || FOLDER_DEFS[0];
  const subCategories = currentFolder.subCategories || [];

  const handleFolderChange = (folderId) => {
    setForm(f => ({
      ...f,
      folder: folderId,
      subCategory: '',
      subCategoryMode: 'predetermined',
      customSubCategory: '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vehicleId || !form.partName) return;
    const resolvedSubCategory =
      form.subCategoryMode === 'custom'
        ? form.customSubCategory.trim() || 'Other'
        : form.subCategory || subCategories[0];
    // Map form field names → Supabase column names
    const mapped = {
      vehicleId: form.vehicleId,
      name: form.partName,
      category: `${form.folder} > ${resolvedSubCategory}`,
      date: form.date,
      mileage_at_install: parseInt(form.mileage) || 0,
      cost: parseFloat(form.cost) || 0,
      notes: form.notes,
    };
    onSave(mapped);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Modification' : 'Add Modification'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Vehicle *</label>
            <select
              value={form.vehicleId}
              onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            >
              <option value="">Select vehicle</option>
              {vehicles.map(v => (<option key={v.id} value={v.id}>{v.name} — {v.make} {v.model}</option>))}
            </select>
          </div>

          {/* Part Name */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Part Name *</label>
            <input
              type="text"
              value={form.partName}
              onChange={e => setForm(f => ({ ...f, partName: e.target.value }))}
              placeholder="e.g. Cold Air Intake, Cat-Back Exhaust"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </div>

          {/* Folder */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {FOLDER_DEFS.map(f => {
                const isSelected = form.folder === f.id;
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleFolderChange(f.id)}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? `${f.tabBg} ${f.tabBorder} border-2 text-white font-semibold shadow-sm`
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                    <span className="leading-tight text-center">{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-Category: Predetermined / Custom toggle */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Sub-Category</label>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, subCategoryMode: 'predetermined', subCategory: '', customSubCategory: '' }))}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                  form.subCategoryMode === 'predetermined'
                    ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                Predetermined
              </button>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, subCategoryMode: 'custom', subCategory: '' }))}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                  form.subCategoryMode === 'custom'
                    ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                Custom
              </button>
            </div>

            {/* Predetermined Mode: Dropdown */}
            {form.subCategoryMode === 'predetermined' && (
              <select
                value={form.subCategory}
                onChange={e => setForm(f => ({ ...f, subCategory: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Select sub-category</option>
                {subCategories.map(sc => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            )}

            {/* Custom Mode: Text Input */}
            {form.subCategoryMode === 'custom' && (
              <input
                type="text"
                value={form.customSubCategory}
                onChange={e => setForm(f => ({ ...f, customSubCategory: e.target.value }))}
                placeholder="e.g. Wrap, Paint, Ceramic Coating..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            )}
          </div>

          {/* Date + Mileage */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Date Installed</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Mileage at Install</label>
              <input
                type="number"
                value={form.mileage}
                onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))}
                placeholder="e.g. 45200"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {/* Cost */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Cost ($)</label>
            <input
              type="number"
              step="0.01"
              value={form.cost}
              onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
              placeholder="0.00"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="e.g. Part number, installation notes, shop name"
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all">
              {isEditing ? 'Save Changes' : 'Add Part'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
