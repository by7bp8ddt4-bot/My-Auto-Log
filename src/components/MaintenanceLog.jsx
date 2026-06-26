import { useState } from 'react';
import {
  X, Plus, ClipboardList, Trash2, FileText, Upload, Calendar, DollarSign,
  Gauge, Image, Cloud, CheckCircle2, Loader2
} from 'lucide-react';
import { formatDate, formatCurrency, formatNumber } from '../utils/helpers';
import { SERVICE_TYPES } from '../utils/constants';

export default function MaintenanceLog({ logs, vehicles, onAdd, onDelete, onNavigate, isPremium }) {
  const [showForm, setShowForm] = useState(false);
  const [vehicleFilter, setVehicleFilter] = useState('all');

  const filteredLogs = vehicleFilter === 'all'
    ? logs
    : logs.filter(l => l.vehicleId === vehicleFilter);

  const getVehicleName = (id) => vehicles.find(v => v.id === id)?.name || 'Unknown';

  const totalSpent = filteredLogs.reduce((sum, l) => sum + (l.cost || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Service Logs</h2>
          <p className="text-sm text-slate-400 mt-0.5">{filteredLogs.length} records</p>
        </div>
        <button
          onClick={() => {
            if (vehicles.length === 0) return;
            setShowForm(true);
          }}
          disabled={vehicles.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Log Service
        </button>
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800">
          <ClipboardList className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-1">Add a vehicle first</p>
          <p className="text-xs text-slate-600">You need at least one vehicle to log services</p>
        </div>
      )}

      {vehicles.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setVehicleFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  vehicleFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              {vehicles.map(v => (
                <button
                  key={v.id}
                  onClick={() => setVehicleFilter(v.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    vehicleFilter === v.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-500 ml-auto">
              Total: <span className="text-emerald-400 font-medium">{formatCurrency(totalSpent)}</span>
            </div>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800">
              <ClipboardList className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400">No service logs yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Log your first service
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.sort((a,b) => new Date(b.date) - new Date(a.date)).map(log => {
                const isAiGenerated = log.source === 'ai-copilot' || log.source === 'ai-copilot-scheduled';
                const hasDocuments = log.documents && log.documents.length > 0;
                return (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-sm font-semibold text-white truncate">{log.serviceType}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 shrink-0">
                            {getVehicleName(log.vehicleId)}
                          </span>
                          {/* AI Badge */}
                          {isAiGenerated && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 shrink-0">
                              AI
                            </span>
                          )}
                          {/* Premium Cloud Synced Badge */}
                          {isPremium && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 shrink-0 flex items-center gap-0.5">
                              <Cloud className="w-2.5 h-2.5" />
                              Cloud Synced
                            </span>
                          )}
                        </div>
                        {log.description && (
                          <p className="text-xs text-slate-500 mb-2 line-clamp-2">{log.description}</p>
                        )}

                        {/* Document Thumbnails */}
                        {hasDocuments && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {log.documents.slice(0, 3).map(doc => (
                              <div key={doc.id} className="relative group">
                                {doc.type?.startsWith('image/') ? (
                                  <img
                                    src={doc.dataUrl}
                                    alt={doc.name}
                                    className="w-12 h-12 rounded-lg object-cover border border-slate-700"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center">
                                    <FileText className="w-4 h-4 text-blue-400" />
                                    <span className="text-[8px] text-slate-500 mt-0.5">PDF</span>
                                  </div>
                                )}
                                <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <FileText className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            ))}
                            {log.documents.length > 3 && (
                              <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                                <span className="text-[10px] text-slate-400 font-medium">+{log.documents.length - 3}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(log.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Gauge className="w-3 h-3" />
                            {formatNumber(log.mileage)} mi
                          </span>
                          {log.cost > 0 && (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <DollarSign className="w-3 h-3" />
                              {formatCurrency(log.cost)}
                            </span>
                          )}
                          {hasDocuments && (
                            <span className="flex items-center gap-0.5 text-blue-400">
                              <Image className="w-3 h-3" />
                              {log.documents.length}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onDelete(log.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-all shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {showForm && (
        <MaintenanceFormModal
          vehicles={vehicles}
          onSave={onAdd}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function MaintenanceFormModal({ vehicles, onSave, onClose }) {
  const [form, setForm] = useState({
    vehicleId: vehicles[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    mileage: '',
    serviceType: '',
    description: '',
    cost: '',
  });
  const [documents, setDocuments] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadProgress(0);
    setUploadComplete(false);

    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onprogress = (ev) => {
        if (ev.lengthComputable) {
          setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
        }
      };
      reader.onload = (ev) => {
        setDocuments(prev => [...prev, {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: ev.target?.result,
        }]);
        if (idx === files.length - 1) {
          setUploadProgress(100);
          setTimeout(() => {
            setUploadComplete(true);
            setUploadProgress(null);
          }, 400);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (documents.length <= 1) {
      setUploadComplete(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vehicleId || !form.serviceType) return;
    onSave({
      ...form,
      mileage: parseInt(form.mileage) || 0,
      cost: parseFloat(form.cost) || 0,
      documents,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Log Service</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Vehicle *</label>
            <select
              value={form.vehicleId}
              onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            >
              <option value="">Select a vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.name} — {v.make} {v.model}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Mileage</label>
              <input
                type="number"
                value={form.mileage}
                onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))}
                placeholder="e.g. 45000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Service Type *</label>
            <select
              value={form.serviceType}
              onChange={e => setForm(f => ({ ...f, serviceType: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            >
              <option value="">Select service type</option>
              {SERVICE_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Notes about this service..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          </div>

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

          {/* Enhanced Document Upload with Progress */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Receipts / Documents</label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500/50 cursor-pointer transition-all text-sm text-slate-400 hover:text-blue-400">
              {uploadComplete ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Upload complete!
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload files (receipts, photos)
                </>
              )}
              <input type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
            </label>

            {/* Upload Progress Bar */}
            {uploadProgress !== null && (
              <div className="mt-2">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Uploading...</span>
                  <span className="ml-auto">{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Document Thumbnails Preview */}
            {documents.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {documents.map(d => (
                  <div key={d.id} className="relative group">
                    {d.type?.startsWith('image/') ? (
                      <img
                        src={d.dataUrl}
                        alt={d.name}
                        className="w-16 h-16 rounded-lg object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <span className="text-[8px] text-slate-500">{d.name.split('.').pop()}</span>
                      </div>
                    )}
                    <button
                      onClick={() => removeDocument(d.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="text-[9px] text-slate-500 text-center truncate max-w-[4rem] mt-0.5">{d.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all">
              Log Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}