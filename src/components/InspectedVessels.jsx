import { useState, useEffect } from 'react';
import {
  Ship, ChevronRight, Plus, X, Trash2, Download, Calendar, FileUp, FileText,
  Loader2, Anchor, ShieldCheck, Lock, BellRing
} from 'lucide-react';
import { formatDate, generateId } from '../utils/helpers';
import { supabase } from '../lib/supabase';
import { VESSEL_TYPE_IDS } from '../utils/constants';
import { canAccessInspectedVessels, getTier } from '../utils/tiering';

// The 5 certified vessel document folders the owner specified (order matters).
// `folder` is the value stored on the documents row (reusing the existing
// `documents` table / `mtxtrkr_documents` store). The `vessel-*` prefix keeps
// these out of the normal Documents tab's folder filters (purchase/insurance/
// photos/registration) so they never leak there.
const CERT_FOLDERS = [
  { folder: 'vessel-uscg-doc', label: 'USCG Certificate of Documentation' },
  { folder: 'vessel-uscg-inspection', label: 'USCG Certificate of Inspection' },
  { folder: 'vessel-noaa-beacon', label: 'NOAA Beacon Registration' },
  { folder: 'vessel-fcc-radio', label: 'FCC Radiotelephony Certificate' },
  { folder: 'vessel-fire-system', label: 'Vessel Fire System Report' },
];

// ---------- Folder Section (mirrors DocumentsPage FolderTab) ----------
function CertFolder({ title, count, isExpanded, onToggle, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
      <div
        onClick={onToggle}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/40 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500/15">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{title}</h3>
            <p className="text-xs text-slate-500">{count} {count === 1 ? 'certificate' : 'certificates'}</p>
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

// ---------- Certificate Document Card ----------
function CertItem({ cert, onDelete }) {
  return (
    <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
            {cert.fileUrl ? (
              <img src={cert.fileUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <FileText className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{cert.name || 'Untitled'}</p>
            {cert.date && (
              <p className="text-xs text-slate-400">Issued {formatDate(cert.date)}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {cert.fileUrl && (
            <a
              href={cert.fileUrl}
              download={cert.name}
              className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              title="Download / View"
              target="_blank"
              rel="noreferrer"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={() => { if (window.confirm('Delete this certificate? This cannot be undone.')) onDelete(cert.id); }}
            className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {cert.notes && (
        <p className="text-xs text-slate-400 pl-12">{cert.notes}</p>
      )}
      {cert.expiryDate && (
        <div className="flex items-center gap-1.5 text-xs pl-12">
          <BellRing className="w-3 h-3 text-amber-400" />
          <span className="text-amber-400/80">Expires: {formatDate(cert.expiryDate)}</span>
        </div>
      )}
    </div>
  );
}

// ---------- Add Certificate Modal (mirrors DocumentsPage AddDocumentModal) ----------
function AddCertificateModal({ folder, label, vessel, onClose, onSave, userId }) {
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError('');
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    if (!fileName) setFileName(file.name);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSave = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    if (!userId) {
      setError('You must be signed in to upload certificates.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const docId = generateId();
      const safeFileName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      // Keep the first storage path segment as `${userId}/` (Supabase Storage RLS).
      const storagePath = `${userId}/${docId}-${Date.now()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(storagePath);

      const doc = {
        id: docId,
        folder,
        name: fileName || selectedFile.name || 'Untitled',
        fileUrl: publicUrl,
        storagePath,
        notes,
        date: date || undefined,
        expiryDate: expiryDate || undefined,
        vehicleId: vessel?.id,
        createdAt: new Date().toISOString(),
      };

      onSave(doc);
      onClose();
    } catch (err) {
      console.error('[InspectedVessels] Upload failed:', err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">{label}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Vessel (fixed to the selected vessel) */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Vessel</label>
            <div className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm">
              {vessel ? (vessel.name || `${vessel.year || ''} ${vessel.make || ''} ${vessel.model || ''}`.trim()) : '—'}
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">File</label>
            {selectedFile ? (
              <div className="relative rounded-xl border border-slate-700 bg-slate-800/30 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {previewUrl ? (
                      <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button onClick={() => { setSelectedFile(null); setPreviewUrl(null); }} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label
                className="block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all border-slate-700 hover:border-slate-500 bg-slate-800/30"
              >
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                    e.target.value = '';
                  }}
                />
                <FileUp className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Click or drag & drop a certificate</p>
              </label>
            )}
          </div>

          {/* File Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Document Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="e.g., USCG Certificate of Documentation"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Issue Date */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Issue Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Expiry Date</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Optional notes about this certificate..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={uploading || !selectedFile}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Save Certificate'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Inspected Vessels Component ----------
export default function InspectedVessels({
  vehicles = [], documents = [], onAddDocument, onDeleteDocument,
  isPremium, onNavigate, userId,
}) {
  const [activeFolder, setActiveFolder] = useState(null);
  const [modalFolder, setModalFolder] = useState(null);
  const [selectedVesselId, setSelectedVesselId] = useState('');

  // Fleet-only gate (REAL): Inspected Vessels is Fleet-tier ONLY, NOT Family.
  const tierId = getTier({ isPremium }).id;
  const canAccess = canAccessInspectedVessels(tierId);

  // Filter to vessel types only (single source of truth: VESSEL_TYPE_IDS).
  const vessels = (vehicles || []).filter(v => VESSEL_TYPE_IDS.includes(v.type));
  const selectedVessel = vessels.find(v => v.id === selectedVesselId) || vessels[0];

  // Keep the selected vessel in sync with the garage (default to first vessel).
  useEffect(() => {
    if (vessels.length > 0 && !vessels.some(v => v.id === selectedVesselId)) {
      setSelectedVesselId(vessels[0].id);
    }
  }, [vessels, selectedVesselId]);

  // Delete: remove storage object (if any), then local + cloud row.
  const handleDelete = async (id) => {
    const doc = documents.find(d => d.id === id);
    if (doc?.storagePath) {
      try {
        await supabase.storage.from('documents').remove([doc.storagePath]);
      } catch (e) {
        console.warn('[InspectedVessels] Failed to remove from storage:', e);
      }
    }
    if (onDeleteDocument) onDeleteDocument(id);
  };

  /* ── Fleet lock (Free + Family) ─────────────────────────────────── */
  if (!canAccess) {
    return (
      <div className="max-w-4xl mx-auto relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Inspected Vessels</h2>
            <p className="text-sm text-slate-400 mt-0.5">Keep every vessel certificate current</p>
          </div>
        </div>
        <div className="relative rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
          <div className="p-8 sm:p-12 opacity-40 pointer-events-none">
            <Ship className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-center text-slate-500 text-sm max-w-md mx-auto">
              Store your vessel's certified inspection documents — USCG certificates,
              NOAA beacon registrations, FCC radio licenses, and fire system reports —
              in one place.
            </p>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-[2px] z-10">
            <Lock className="w-7 h-7 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-white mb-1">Inspected Vessels</p>
            <p className="text-xs text-slate-400 mb-3 text-center max-w-xs">
              Fleet-tier feature — available with the Fleet plan ($9.99/mo).
              Not included in Family.
            </p>
            <button
              onClick={() => onNavigate?.('premium')}
              className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30"
            >
              Upgrade to Premium →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── No vessel of the right type ────────────────────────────────── */
  if (vessels.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
            <Ship className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Inspected Vessels</h1>
            <p className="text-sm text-slate-400">Store certified inspection documents for your vessels</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 text-center py-16">
          <Anchor className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No vessels yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Add an Outboard Engine or Marine Diesel to your Garage to start
            storing its certified inspection documents.
          </p>
          <button
            onClick={() => onNavigate?.('vehicles')}
            className="px-6 py-2.5 rounded-full bg-cyan-600 text-white text-sm font-bold hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-600/30"
          >
            Add a vessel in Garage →
          </button>
        </div>
      </div>
    );
  }

  /* ── Main content ───────────────────────────────────────────────── */
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
            <Ship className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Inspected Vessels</h1>
            <p className="text-sm text-slate-400">Store certified inspection documents for your vessels</p>
          </div>
        </div>
      </div>

      {/* Vessel picker (vessel types only) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <label className="block text-sm text-slate-400 mb-1.5">Vessel</label>
        <select
          value={selectedVessel?.id || ''}
          onChange={(e) => setSelectedVesselId(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50"
        >
          {vessels.map(v => (
            <option key={v.id} value={v.id}>
              {v.name || `${v.year || ''} ${v.make || ''} ${v.model || ''}`.trim()}
            </option>
          ))}
        </select>
        <p className="text-[11px] text-slate-500 mt-2">
          {vessels.length} vessel{vessels.length !== 1 ? 's' : ''} in your garage · {CERT_FOLDERS.length} certificate folders
        </p>
      </div>

      {/* The 5 required certificate folders */}
      {CERT_FOLDERS.map(({ folder, label }) => {
        const folderCerts = documents.filter(d =>
          d.folder === folder && d.vehicleId === selectedVessel?.id
        );
        const isExpanded = activeFolder === folder || (activeFolder === null && folder === CERT_FOLDERS[0].folder);
        return (
          <CertFolder
            key={folder}
            title={label}
            count={folderCerts.length}
            isExpanded={isExpanded}
            onToggle={() => setActiveFolder(isExpanded ? null : folder)}
          >
            {folderCerts.length > 0 ? (
              <div className="space-y-2">
                {folderCerts.map(cert => (
                  <CertItem key={cert.id} cert={cert} onDelete={handleDelete} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-3">No {label} uploaded yet for this vessel.</p>
            )}

            <button
              onClick={() => setModalFolder({ folder, label })}
              className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Upload {label}
            </button>
          </CertFolder>
        );
      })}

      {/* Add Certificate Modal */}
      {modalFolder && (
        <AddCertificateModal
          folder={modalFolder.folder}
          label={modalFolder.label}
          vessel={selectedVessel}
          userId={userId}
          onClose={() => setModalFolder(null)}
          onSave={(doc) => { if (onAddDocument) onAddDocument(doc); }}
        />
      )}
    </div>
  );
}
