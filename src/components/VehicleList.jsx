import { useState } from 'react';
import { X, Car, Plus, Pencil, Trash2, ChevronRight, ScanLine, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import { ManufacturerBadge } from '../utils/manufacturerBranding.jsx';
import { decodeVin, isValidVin } from '../utils/vinDecoder.js';

export default function VehicleList({ vehicles, onAdd, onEdit, onDelete, isPremium, vehicleCount, onNavigate }) {
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const handleAdd = () => {
    if (vehicles.length >= 1 && !isPremium) {
      onNavigate('premium');
      return;
    }
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">My Vehicles</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {vehicleCount} {vehicleCount === 1 ? 'vehicle' : 'vehicles'} tracked
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 mb-2">No vehicles yet</p>
          <p className="text-sm text-slate-600 mb-6">Add your first vehicle to get started</p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {vehicles.map(v => (
            <div
              key={v.id}
              className="group p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <ManufacturerBadge make={v.make} size={20} />
                  <div>
                    <h3 className="font-semibold text-white text-sm">{v.name}</h3>
                    <p className="text-xs text-slate-500">
                      {v.year} {v.make} {v.model}
                    </p>
                  </div>
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
          ))}
        </div>
      )}

      {/* Vehicle Form Modal */}
      {showForm && (
        <VehicleFormModal
          vehicle={editingVehicle}
          onSave={handleSubmit}
          onClose={() => { setShowForm(false); setEditingVehicle(null); }}
        />
      )}
    </div>
  );
}

function VehicleFormModal({ vehicle, onSave, onClose }) {
  const [form, setForm] = useState({
    name: vehicle?.name || '',
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    licensePlate: vehicle?.licensePlate || '',
    mileage: vehicle?.mileage || 0,
    purchaseDate: vehicle?.purchaseDate || '',
    purchaseMileage: vehicle?.purchaseMileage || 0,
    vin: vehicle?.vin || '',
  });
  const [vinState, setVinState] = useState({ status: 'idle', message: '', data: null }); // idle | loading | success | error

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
    const submitData = { ...form };
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
            {vehicle ? 'Edit Vehicle' : 'Add Vehicle'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* VIN Decoder Section */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/5 to-cyan-600/5 border border-blue-500/20">
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">
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
            <div className="mt-2 min-h-[20px]">
              {renderVinStatus()}
            </div>
          </div>

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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Make *</label>
              <input
                type="text"
                value={form.make}
                onChange={e => setForm(f => ({ ...f, make: e.target.value }))}
                placeholder="e.g. Toyota"
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
                placeholder="e.g. Camry"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Current Mileage</label>
              <input
                type="number"
                value={form.mileage}
                onChange={e => setForm(f => ({ ...f, mileage: parseInt(e.target.value) || 0 }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Mileage at Purchase</label>
              <input
                type="number"
                value={form.purchaseMileage}
                onChange={e => setForm(f => ({ ...f, purchaseMileage: parseInt(e.target.value) || 0 }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>
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