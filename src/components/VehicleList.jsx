import { useState, useEffect } from 'react';
import { X, Car, Plus, Pencil, Trash2, ChevronRight, ScanLine, Loader2, CheckCircle2, AlertCircle, Tractor, Package, Ship, Anchor, Cog } from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import { ManufacturerBadge } from '../utils/manufacturerBranding.jsx';
import { decodeVin, isValidVin } from '../utils/vinDecoder.js';
import { VEHICLE_TYPES } from '../utils/constants.js';
import MotorcycleIcon from './MotorcycleIcon';
import SemiTruckIcon from './SemiTruckIcon';
import RVIcon from './RVIcon';

// Map icon names to lucide-react components
const TYPE_ICONS = { Car, Motorcycle: MotorcycleIcon, Tractor, Package, Ship, Anchor, Cog, SemiTruck: SemiTruckIcon, RV: RVIcon };

export default function VehicleList({ vehicles, onAdd, onEdit, onDelete, isPremium, vehicleCount, onNavigate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [vehicleType, setVehicleType] = useState('car');
  const [focusMileage, setFocusMileage] = useState(false);
  const [expandedTypes, setExpandedTypes] = useState(() => {
    // Start with all types expanded
    const init = {};
    VEHICLE_TYPES.forEach(t => { init[t.id] = true; });
    return init;
  });

  // Check for pending edit from mileage update deep-link
  useEffect(() => {
    const pendingId = sessionStorage.getItem('mtxtrkr_pending_edit_vehicle');
    if (pendingId) {
      sessionStorage.removeItem('mtxtrkr_pending_edit_vehicle');
      const target = vehicles.find(v => v.id === pendingId);
      if (target) {
        setEditingVehicle(target);
        setFocusMileage(true);
        setShowForm(true);
      }
    }
  }, [vehicles]);

  const toggleType = (typeId) => {
    setExpandedTypes(prev => ({ ...prev, [typeId]: !prev[typeId] }));
  };

  const handleAdd = (type = 'car') => {
    if (vehicles.length >= 1 && !isPremium) {
      onNavigate('premium');
      return;
    }
    setVehicleType(type);
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEdit = (v) => {
    setEditingVehicle(v);
    setShowForm(true);
  };

  const handleSubmit = (data) => {
    if (editingVehicle) {
      onEdit(editingVehicle.id, data);
    } else {
      onAdd(data);
    }
    setShowForm(false);
    setEditingVehicle(null);
  };

  // Group vehicles by type
  const groupedByType = {};
  VEHICLE_TYPES.forEach(t => { groupedByType[t.id] = []; });
  vehicles.forEach(v => {
    const type = v.type || 'car';
    if (groupedByType[type]) groupedByType[type].push(v);
  });

  const hasAnyVehicles = vehicles.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Garage</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {vehicleCount} {vehicleCount === 1 ? 'vehicle' : 'vehicles'} tracked
          </p>
        </div>
      </div>

      {!hasAnyVehicles ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 mb-2">No vehicles yet</p>
          <p className="text-sm text-slate-600 mb-6">Add your first vehicle to get started</p>
          <div className="flex gap-3 justify-center">
            {VEHICLE_TYPES.map(type => {
              const Icon = TYPE_ICONS[type.icon];
              return (
                <button
                  key={type.id}
                  onClick={() => handleAdd(type.id)}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl ${type.color} text-white text-sm font-medium border ${type.border} transition-all`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  Add {type.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {VEHICLE_TYPES.map(type => {
            const typeVehicles = groupedByType[type.id] || [];
            const isExpanded = expandedTypes[type.id];
            const Icon = TYPE_ICONS[type.icon];

            return (
              <div key={type.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
                {/* Folder Header */}
                <div
                  onClick={() => toggleType(type.id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800">
                      {Icon && <Icon className="w-5 h-5 text-slate-400" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{type.plural || type.label + 's'}</h3>
                      <p className="text-xs text-slate-500">{typeVehicles.length} {typeVehicles.length === 1 ? 'vehicle' : 'vehicles'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAdd(type.id); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-medium transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      Add {type.label}
                    </button>
                    <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Vehicle List */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    {typeVehicles.length > 0 ? (
                      typeVehicles.map(v => (
            <div
              key={v.id}
              className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 transition-all glass-card btn-tactile"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {(() => {
                    const vt = VEHICLE_TYPES.find(t => t.id === v.type) || VEHICLE_TYPES[0];
                    const Icon = TYPE_ICONS[vt.icon];
                    return (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                          {Icon && <Icon className="w-5 h-5 text-slate-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white text-sm">{v.name}</h3>
                            {v.type && v.type !== 'car' && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium uppercase tracking-wider">{vt.label}</span>
                            )}
                          </div>
                    <p className="text-xs text-slate-500">
                      {v.year} {v.make} {v.model}
                    </p>
                  </div>
                    </>
                  );
                })()}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(v)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-blue-400 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(v.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-slate-400">Mileage: </span>
                  <span className="text-white font-medium">{formatNumber(v.mileage)} mi</span>
                </div>
                {v.licensePlate && (
                  <span className="text-xs text-slate-600 font-mono">{v.licensePlate}</span>
                )}
              </div>
            </div>
                      ))
                    ) : (
                      <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-slate-800">
                        <p className="text-xs text-slate-500">No {(type.plural || type.label + 's').toLowerCase()} yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Vehicle Form Modal */}
      {showForm && (
        <VehicleFormModal
          vehicle={editingVehicle}
          initialType={vehicleType}
          onSave={handleSubmit}
          onClose={() => { setShowForm(false); setEditingVehicle(null); setFocusMileage(false); }}
          focusMileage={focusMileage}
        />
      )}
    </div>
  );
}

function VehicleFormModal({ vehicle, onSave, onClose, initialType = 'car', focusMileage = false }) {
  const [form, setForm] = useState({
    name: vehicle?.name || '',
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    licensePlate: vehicle?.licensePlate || '',
    mileage: vehicle?.mileage || '',
    purchaseDate: vehicle?.purchaseDate || '',
    purchaseMileage: vehicle?.purchaseMileage || '',
    vin: vehicle?.vin || '',
    engineSerial: vehicle?.engineSerial || '',
    type: vehicle?.type || initialType || 'car',
    isLeased: vehicle?.isLeased || false,
    leaseEndDate: vehicle?.leaseEndDate || '',
    leaseMileageLimit: vehicle?.leaseMileageLimit || '',
  });
  const [vinState, setVinState] = useState({ status: 'idle', message: '', data: null }); // idle | loading | success | error

  // Per-type form helpers
  const usesHours = ['ag-equipment', 'forklift', 'watercraft', 'outboard', 'marine-diesel'].includes(form.type);
  const hasVinDecoder = ['car', 'motorcycle', 'semi-truck', 'rv'].includes(form.type);
  const hasLicensePlate = ['car', 'motorcycle', 'watercraft', 'semi-truck', 'rv'].includes(form.type);

  const mileageLabel = usesHours ? 'Engine Hours' : 'Current Mileage';
  const purchaseMileageLabel = usesHours ? 'Hours at Purchase' : 'Mileage at Purchase';
  const canLease = ['car', 'motorcycle', 'semi-truck', 'rv'].includes(form.type);

  const handleDecodeVin = async () => {
    const vin = form.vin?.trim().toUpperCase();
    if (!vin || vin.length < 17) {
      setVinState({ status: 'error', message: 'Enter a 17-character VIN first', data: null });
      return;
    }
    if (!isValidVin(vin)) {
      setVinState({ status: 'error', message: 'VIN contains invalid characters (no I, O, Q)', data: null });
      return;
    }
    setVinState({ status: 'loading', message: 'Decoding VIN...', data: null });
    const result = await decodeVin(vin);
    if (result.success) {
      setForm(f => ({
        ...f,
        make: result.data.make || f.make,
        model: result.data.model || f.model,
        year: result.data.year || f.year,
        vinDecoded: result.data,
      }));
      setVinState({
        status: 'success',
        message: `${result.data.year} ${result.data.make} ${result.data.model}`,
        data: result.data,
      });
    } else {
      setVinState({ status: 'error', message: result.error, data: null });
    }
  };

  const handleVinChange = (value) => {
    const cleaned = value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '').slice(0, 17);
    setForm(f => ({ ...f, vin: cleaned }));
    if (vinState.status !== 'idle') {
      setVinState({ status: 'idle', message: '', data: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.make || !form.model) return;
    const submitData = {
      ...form,
      mileage: parseInt(form.mileage) || 0,
      purchaseMileage: parseInt(form.purchaseMileage) || 0,
    };
    // Remove raw NHTSA reference to keep the vehicle object clean
    if (submitData.vinDecoded?._raw) {
      submitData.vinDecoded = { ...submitData.vinDecoded };
      delete submitData.vinDecoded._raw;
    }
    onSave(submitData);
  };

  const renderVinStatus = () => {
    switch (vinState.status) {
      case 'loading':
        return (
          <div className="flex items-center gap-2 text-xs text-blue-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            {vinState.message}
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {vinState.message}
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-3.5 h-3.5" />
            {vinState.message}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">
            {vehicle ? 'Edit Vehicle' : `Add ${(() => { const vt = VEHICLE_TYPES.find(t => t.id === form.type) || VEHICLE_TYPES[0]; return vt.label; })()}`}
            {form.type !== 'car' && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium ml-2">
                {VEHICLE_TYPES.find(t => t.id === form.type)?.label || form.type}
              </span>
            )}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!hasVinDecoder && !['watercraft', 'outboard', 'marine-diesel'].includes(form.type) ? (
            /* N/A identifier — for equipment without VIN/HIN/serial */
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">
                VIN / Serial Number <span className="text-slate-600 font-normal">(for lookup)</span>
              </label>
              <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-500 text-sm italic flex items-center gap-2">
                <span className="text-slate-600 text-[10px] font-medium uppercase tracking-wider">N/A</span>
                <span className="text-xs">No VIN required for this vehicle type</span>
              </div>
            </div>
          ) : form.type === 'marine-diesel' || form.type === 'outboard' ? (
            /* Engine Serial Number — for marine/outboard engines */
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">
                Engine Serial Number <span className="text-slate-600 font-normal">(for lookup)</span>
              </label>
              <input
                type="text"
                value={form.engineSerial}
                onChange={e => setForm(f => ({ ...f, engineSerial: e.target.value.toUpperCase() }))}
                placeholder="e.g. CAT 7.1 SERIAL #"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono tracking-wider placeholder:text-slate-600 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          ) : form.type === 'watercraft' ? (
            /* HIN Decoder — for personal watercraft */
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">
                HIN (Hull Identification Number) <span className="text-slate-600 font-normal">(for lookup)</span>
              </label>
              <input
                type="text"
                value={form.vin}
                onChange={e => setForm(f => ({ ...f, vin: e.target.value.toUpperCase().slice(0, 12) }))}
                placeholder="e.g. USCCP1234J899"
                maxLength={12}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono tracking-wider placeholder:text-slate-600 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all uppercase"
              />
            </div>
          ) : (
            /* VIN Decoder — for road vehicles */
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-medium">
                VIN Decoder <span className="text-slate-600 font-normal">(free NHTSA lookup)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.vin}
                  onChange={e => handleVinChange(e.target.value)}
                  placeholder="e.g. 1HGCM82633A004352"
                  maxLength={17}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-mono tracking-wider placeholder:text-slate-600 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all uppercase"
                />
                <button
                  type="button"
                  onClick={handleDecodeVin}
                  disabled={vinState.status === 'loading' || form.vin.length < 17}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-medium transition-all"
                >
                  {vinState.status === 'loading' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ScanLine className="w-3.5 h-3.5" />
                  )}
                  Decode
                </button>
              </div>
              <div className="mt-1 min-h-[18px]">
                {renderVinStatus()}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Vehicle Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Daily Driver"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Make *</label>
              <input
                type="text"
                value={form.make}
                onChange={e => setForm(f => ({ ...f, make: e.target.value }))}
                placeholder={form.type === 'motorcycle' ? 'e.g. Yamaha' : form.type === 'ag-equipment' ? 'e.g. John Deere' : form.type === 'forklift' ? 'e.g. Hyster' : form.type === 'watercraft' ? 'e.g. Yamaha' : form.type === 'outboard' ? 'e.g. Mercury' : form.type === 'marine-diesel' ? 'e.g. Cummins' : form.type === 'semi-truck' ? 'e.g. Freightliner' : form.type === 'rv' ? 'e.g. Winnebago' : 'e.g. Toyota'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Model *</label>
              <input
                type="text"
                value={form.model}
                onChange={e => setForm(f => ({ ...f, model: e.target.value }))}
                placeholder={form.type === 'motorcycle' ? 'e.g. R1' : form.type === 'ag-equipment' ? 'e.g. 6R' : form.type === 'forklift' ? 'e.g. H50' : form.type === 'watercraft' ? 'e.g. FX Cruiser' : form.type === 'outboard' ? 'e.g. F150' : form.type === 'marine-diesel' ? 'e.g. QSB 6.7' : form.type === 'semi-truck' ? 'e.g. Cascadia' : form.type === 'rv' ? 'e.g. Vista' : 'e.g. Camry'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Year</label>
              <input
                type="number"
                value={form.year}
                onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) || '' }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">{mileageLabel}</label>
              <input
                type="number"
                value={form.mileage}
                onChange={e => setForm(f => ({ ...f, mileage: e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0) }))}
                autoFocus={focusMileage}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Purchase Date</label>
              <input
                type="date"
                value={form.purchaseDate}
                onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))}
                max={(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })()}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">{purchaseMileageLabel}</label>
              <input
                type="number"
                value={form.purchaseMileage}
                onChange={e => setForm(f => ({ ...f, purchaseMileage: e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0) }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>
          {hasLicensePlate ? (
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">License Plate</label>
              <input
                type="text"
                value={form.licensePlate}
                onChange={e => setForm(f => ({ ...f, licensePlate: e.target.value }))}
                placeholder="e.g. ABC-1234"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">License Plate</label>
              <div className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-500 text-sm italic flex items-center gap-2">
                <span className="text-slate-600 text-[10px] font-medium uppercase tracking-wider">N/A</span>
                <span className="text-xs">No plate required for this vehicle type</span>
              </div>
            </div>
          )}

          {canLease && (
            <>
              {/* Leasing Section */}
              <div className="border-t border-slate-800 pt-4 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isLeased}
                    onChange={e => setForm(f => ({ ...f, isLeased: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-600 text-blue-600 focus:ring-blue-500/30 bg-slate-800"
                  />
                  <span className="text-sm text-white font-medium">This vehicle is leased</span>
                </label>
              </div>

              {form.isLeased && (
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Lease End Date</label>
                <input
                  type="date"
                  value={form.leaseEndDate}
                  onChange={e => setForm(f => ({ ...f, leaseEndDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Mileage Limit</label>
                <input
                  type="number"
                  value={form.leaseMileageLimit}
                  onChange={e => setForm(f => ({ ...f, leaseMileageLimit: e.target.value === '' ? '' : parseInt(e.target.value) || '' }))}
                  placeholder="e.g. 36000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
              <p className="col-span-2 text-[10px] text-amber-400/70">
                MTXtrkr will track your mileage pace and alert you if you're approaching your lease limit.
              </p>
            </div>
          )}
            </>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
            >
              {vehicle ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}