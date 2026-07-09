import { useState, useMemo } from 'react';
import {
  FileText, FileUp, Camera, Shield, Image, ChevronRight,
  Plus, X, Trash2, Calendar, Download, ExternalLink,
  Search, AlertCircle, Info
} from 'lucide-react';
import { formatDate, formatNumber, generateId } from '../utils/helpers';

// ---------- Document Store (localStorage) ----------
const STORAGE_KEY = 'mtxtrkr_documents';

function loadDocuments() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveDocuments(docs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

// ---------- Folder Tab Component (mirrors RemindersPage style) ----------
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

// ---------- Document Upload Card ----------
function DocumentUploadCard({ onFileSelect, accept, label }) {
  const [dragOver, setDragOver] = useState(false);
  const inputId = `upload-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <label
      htmlFor={inputId}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFileSelect(file);
      }}
      className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
        ${dragOver ? 'border-blue-400 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-800/30'}`}
    >
      <input
        id={inputId}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
          e.target.value = '';
        }}
      />
      <FileUp className="w-8 h-8 text-slate-500 mx-auto mb-2" />
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-xs text-slate-600 mt-1">Click or drag & drop</p>
    </label>
  );
}

// ---------- Document Item Card ----------
function DocumentItem({ doc, onDelete, showVehicleName, vehicles }) {
  const vehicleName = showVehicleName && vehicles
    ? vehicles.find(v => v.id === doc.vehicleId)?.name || 'Unknown Vehicle'
    : null;

  return (
    <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
            {doc.fileUrl ? (
              <img src={doc.fileUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <FileText className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{doc.name || 'Untitled'}</p>
            {doc.date && (
              <p className="text-xs text-slate-400">{formatDate(doc.date)}</p>
            )}
            {vehicleName && (
              <p className="text-xs text-blue-400/70 truncate">{vehicleName}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {doc.fileUrl && (
            <a
              href={doc.fileUrl}
              download={doc.name}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={() => onDelete(doc.id)}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {doc.notes && (
        <p className="text-xs text-slate-400 pl-12">{doc.notes}</p>
      )}
      {doc.expiryDate && (
        <div className="flex items-center gap-1.5 text-xs pl-12">
          <Calendar className="w-3 h-3 text-amber-400" />
          <span className="text-amber-400/80">Expires: {formatDate(doc.expiryDate)}</span>
        </div>
      )}
    </div>
  );
}

// ---------- Add Document Modal ----------
function AddDocumentModal({ folder, onClose, onSave, vehicles }) {
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState(null);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');
  const [vehicleId, setVehicleId] = useState(vehicles?.[0]?.id || '');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileUrl(e.target.result);
      if (!fileName) setFileName(file.name);
      setLoading(false);
    };
    reader.onerror = () => setLoading(false);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const doc = {
      id: generateId(),
      folder,
      name: fileName || 'Untitled',
      fileUrl,
      notes,
      date,
      expiryDate: expiryDate || undefined,
      vehicleId,
      createdAt: new Date().toISOString(),
    };
    onSave(doc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Add Document</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">File</label>
            {fileUrl ? (
              <div className="relative rounded-xl border border-slate-700 bg-slate-800/30 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={fileUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">{fileName}</p>
                    <p className="text-xs text-emerald-400">File loaded</p>
                  </div>
                  <button onClick={() => setFileUrl(null)} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <DocumentUploadCard
                onFileSelect={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.txt"
                label="Upload a document or photo"
              />
            )}
          </div>

          {/* File Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Document Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g., Insurance Card - Front"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Vehicle Selector */}
          {vehicles && vehicles.length > 0 && (
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Vehicle</label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name || v.make} {v.model}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Expiry Date (for Insurance) */}
          {folder === 'insurance' && (
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Optional notes about this document..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Save Document'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main DocumentsPage Component ----------
export default function DocumentsPage({ logs, vehicles, onNavigate }) {
  const [documents, setDocuments] = useState(loadDocuments);
  const [expandedTabs, setExpandedTabs] = useState({
    service: true,
    purchase: false,
    insurance: false,
    photos: false,
  });
  const [showModal, setShowModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleTab = (tab) => {
    setExpandedTabs(prev => ({ ...prev, [tab]: !prev[tab] }));
  };

  const handleSave = (doc) => {
    const updated = [...documents, doc];
    setDocuments(updated);
    saveDocuments(updated);
  };

  const handleDelete = (id) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    saveDocuments(updated);
  };

  // Filter documents by folder
  const serviceDocs = documents.filter(d => d.folder === 'service');
  const purchaseDocs = documents.filter(d => d.folder === 'purchase');
  const insuranceDocs = documents.filter(d => d.folder === 'insurance');
  const photoDocs = documents.filter(d => d.folder === 'photos');

  // Filter by search term
  const filterBySearch = (docs) => {
    if (!searchTerm) return docs;
    const term = searchTerm.toLowerCase();
    return docs.filter(d =>
      (d.name || '').toLowerCase().includes(term) ||
      (d.notes || '').toLowerCase().includes(term)
    );
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
          <FileText className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Documents</h1>
          <p className="text-sm text-slate-400">Store receipts, photos, and service records</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search documents..."
          className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Service Records', count: serviceDocs.length, icon: FileText, color: 'from-blue-500/20 to-cyan-500/20' },
          { label: 'Purchase & Reg', count: purchaseDocs.length, icon: FileUp, color: 'from-emerald-500/20 to-teal-500/20' },
          { label: 'Insurance', count: insuranceDocs.length, icon: Shield, color: 'from-amber-500/20 to-orange-500/20' },
          { label: 'Photos', count: photoDocs.length, icon: Image, color: 'from-purple-500/20 to-pink-500/20' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
              <stat.icon className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.count}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Service Records Tab */}
      <FolderTab
        icon={FileText}
        title="Service Records"
        count={serviceDocs.length + (logs?.length || 0)}
        isExpanded={expandedTabs.service}
        onToggle={() => toggleTab('service')}
      >
        {/* Existing maintenance logs */}
        {logs && logs.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Maintenance Logs</p>
            {logs.slice(0, 10).map(log => (
              <div
                key={log.id}
                className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-3 cursor-pointer hover:bg-slate-700/40 transition-all"
                onClick={() => { onNavigate('logs'); }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">
                      {log.serviceTypes?.[0] || log.serviceType || 'Service'} — {vehicles?.find(v => v.id === log.vehicleId)?.name || 'Vehicle'}
                    </p>
                    <p className="text-xs text-slate-400">
                      {log.date ? formatDate(log.date) : ''} {log.odometer ? `• ${formatNumber(log.odometer)} mi` : ''}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
              </div>
            ))}
            {logs.length > 10 && (
              <p className="text-xs text-slate-500 text-center">
                +{logs.length - 10} more logs — <button onClick={() => onNavigate('logs')} className="text-blue-400 hover:underline">View all</button>
              </p>
            )}
          </div>
        )}

        {/* Uploaded service documents */}
        {filterBySearch(serviceDocs).length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Uploaded Documents</p>
            {filterBySearch(serviceDocs).map(doc => (
              <DocumentItem key={doc.id} doc={doc} onDelete={handleDelete} showVehicleName vehicles={vehicles} />
            ))}
          </div>
        )}

        {filterBySearch(serviceDocs).length === 0 && (!logs || logs.length === 0) && (
          <p className="text-sm text-slate-500 text-center py-4">No service records yet. Add a maintenance log or upload a document.</p>
        )}

        <button
          onClick={() => setShowModal('service')}
          className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Upload Service Document
        </button>
      </FolderTab>

      {/* Purchase & Registration Tab */}
      <FolderTab
        icon={FileUp}
        title="Purchase & Registration"
        count={purchaseDocs.length}
        isExpanded={expandedTabs.purchase}
        onToggle={() => toggleTab('purchase')}
      >
        {filterBySearch(purchaseDocs).length > 0 ? (
          <div className="space-y-2">
            {filterBySearch(purchaseDocs).map(doc => (
              <DocumentItem key={doc.id} doc={doc} onDelete={handleDelete} showVehicleName vehicles={vehicles} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">No purchase documents yet. Upload your bill of sale, title, or registration.</p>
        )}

        <button
          onClick={() => setShowModal('purchase')}
          className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Upload Purchase Document
        </button>
      </FolderTab>

      {/* Insurance Tab */}
      <FolderTab
        icon={Shield}
        title="Insurance"
        count={insuranceDocs.length}
        isExpanded={expandedTabs.insurance}
        onToggle={() => toggleTab('insurance')}
      >
        {filterBySearch(insuranceDocs).length > 0 ? (
          <div className="space-y-2">
            {filterBySearch(insuranceDocs).map(doc => (
              <DocumentItem key={doc.id} doc={doc} onDelete={handleDelete} showVehicleName vehicles={vehicles} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">No insurance documents yet. Upload your insurance card or policy documents.</p>
        )}

        <button
          onClick={() => setShowModal('insurance')}
          className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Upload Insurance Document
        </button>
      </FolderTab>

      {/* Photos Tab */}
      <FolderTab
        icon={Image}
        title="Photos"
        count={photoDocs.length}
        isExpanded={expandedTabs.photos}
        onToggle={() => toggleTab('photos')}
      >
        {filterBySearch(photoDocs).length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filterBySearch(photoDocs).map(doc => (
              <div key={doc.id} className="group relative rounded-xl overflow-hidden border border-slate-700/50 bg-slate-800/40">
                {doc.fileUrl ? (
                  <img src={doc.fileUrl} alt={doc.name} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-slate-700">
                    <Image className="w-8 h-8 text-slate-500" />
                  </div>
                )}
                <div className="p-2">
                  <p className="text-xs text-white truncate">{doc.name || 'Photo'}</p>
                  {doc.date && <p className="text-[10px] text-slate-400">{formatDate(doc.date)}</p>}
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">No photos yet. Upload vehicle photos for reference.</p>
        )}

        <button
          onClick={() => setShowModal('photos')}
          className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <Camera className="w-4 h-4" />
          Add Photo
        </button>
      </FolderTab>

      {/* Add Document Modal */}
      {showModal && (
        <AddDocumentModal
          folder={showModal}
          vehicles={vehicles}
          onClose={() => setShowModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}