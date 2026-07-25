import { useState, useMemo, useEffect } from 'react';
import {
  FileText, FileUp, Camera, Shield, Image, ChevronRight,
  Plus, X, Trash2, Calendar, Download, Search, ClipboardList,
  CloudUpload, AlertTriangle, Loader2
} from 'lucide-react';
import { formatDate, generateId } from '../utils/helpers';
import { supabase } from '../lib/supabase';

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

  const isLegacyBase64 = doc.fileUrl && doc.fileUrl.startsWith('data:');

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
            {isLegacyBase64 && (
              <p className="text-xs text-amber-400/70 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Local only — not backed up
              </p>
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
            onClick={() => { if (window.confirm('Delete this document? This cannot be undone.')) onDelete(doc.id); }}
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
function AddDocumentModal({ folder, onClose, onSave, vehicles, userId }) {
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');
  const [vehicleId, setVehicleId] = useState(vehicles?.[0]?.id || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setError('');
    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    if (!fileName) setFileName(file.name);
  };

  // Cleanup object URLs on unmount
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
      setError('You must be signed in to upload documents.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Generate document ID upfront
      const docId = generateId();
      const safeFileName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `${userId}/${docId}-${Date.now()}-${safeFileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(storagePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
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
        date,
        expiryDate: expiryDate || undefined,
        vehicleId,
        createdAt: new Date().toISOString(),
      };

      onSave(doc);
      onClose();
    } catch (err) {
      console.error('[DocumentsPage] Upload failed:', err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
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

          {/* Expiry Date (for Insurance & Registration) */}
          {(folder === 'insurance' || folder === 'registration') && (
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

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Save Button */}
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
            ) : !userId ? (
              'Sign in to upload'
            ) : (
              'Save Document'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Migration Banner for Legacy Base64 Documents ----------
function MigrationBanner({ legacyCount, onMigrate, migrating }) {
  if (legacyCount === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
          <CloudUpload className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-amber-300">
            {legacyCount} document{legacyCount !== 1 ? 's' : ''} not backed up
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {legacyCount === 1
              ? 'One document is stored only on this device. Sign in and upload it to the cloud for safe backup across all your devices.'
              : `${legacyCount} documents are stored only on this device. Sign in and upload them to the cloud for safe backup across all your devices.`}
          </p>
          <button
            onClick={onMigrate}
            disabled={migrating}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-medium hover:bg-amber-500/30 transition-all disabled:opacity-50"
          >
            {migrating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4" />
                Back up to cloud
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main DocumentsPage Component ----------
export default function DocumentsPage({ documents = [], onAddDocument, onDeleteDocument, vehicles, onNavigate, userId }) {
  const [expandedTabs, setExpandedTabs] = useState({
    purchase: true,
    insurance: false,
    photos: false,
    registration: false,
  });
  const [showModal, setShowModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [migrating, setMigrating] = useState(false);

  const toggleTab = (tab) => {
    setExpandedTabs(prev => ({ ...prev, [tab]: !prev[tab] }));
  };

  // Filter documents by folder
  const purchaseDocs = documents.filter(d => d.folder === 'purchase');
  const insuranceDocs = documents.filter(d => d.folder === 'insurance');
  const photoDocs = documents.filter(d => d.folder === 'photos');
  const registrationDocs = documents.filter(d => d.folder === 'registration');

  // Count legacy base64 documents
  const legacyDocs = useMemo(() => {
    return documents.filter(d => d.fileUrl && d.fileUrl.startsWith('data:'));
  }, [documents]);

  // Migrate legacy base64 documents to Supabase Storage
  const handleMigrateLegacy = async () => {
    if (!userId || legacyDocs.length === 0) return;
    setMigrating(true);

    // Process legacy docs one at a time
    const migrated = [];
    for (const doc of legacyDocs) {
      try {
        // Convert base64 data URL to a File/Blob
        const base64Data = doc.fileUrl;
        const mimeMatch = base64Data.match(/^data:([^;]+);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        const base64Content = base64Data.split(',')[1];
        const byteChars = atob(base64Content);
        const byteNums = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteNums[i] = byteChars.charCodeAt(i);
        }
        const byteArr = new Uint8Array(byteNums);
        const blob = new Blob([byteArr], { type: mimeType });

        const safeFileName = (doc.name || 'document').replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `${userId}/${doc.id}-${Date.now()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(storagePath, blob, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.warn(`[Migration] Failed to upload ${doc.id}:`, uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(storagePath);

        migrated.push({
          ...doc,
          fileUrl: publicUrl,
          storagePath,
          _migrated: true,
        });
      } catch (e) {
        console.warn(`[Migration] Error migrating ${doc.id}:`, e);
      }
    }

    if (migrated.length > 0 && onAddDocument) {
      // Call onAddDocument for each migrated doc (it's actually an upsert since IDs are preserved)
      for (const doc of migrated) {
        await onAddDocument(doc);
      }
    }

    setMigrating(false);
  };

  // Handle delete — also remove from Supabase Storage if it has a storagePath
  const handleDelete = async (id) => {
    const doc = documents.find(d => d.id === id);
    if (doc?.storagePath) {
      try {
        await supabase.storage.from('documents').remove([doc.storagePath]);
      } catch (e) {
        console.warn('[DocumentsPage] Failed to remove from storage:', e);
      }
    }
    if (onDeleteDocument) onDeleteDocument(id);
  };

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
          <p className="text-sm text-slate-400">Store purchase records, insurance, photos, and registration</p>
        </div>
      </div>

      {/* Migration Banner */}
      <MigrationBanner
        legacyCount={legacyDocs.length}
        onMigrate={handleMigrateLegacy}
        migrating={migrating}
      />

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
          { label: 'Purchase Records', count: purchaseDocs.length, icon: FileUp, color: 'from-emerald-500/20 to-teal-500/20' },
          { label: 'Insurance', count: insuranceDocs.length, icon: Shield, color: 'from-amber-500/20 to-orange-500/20' },
          { label: 'Photos', count: photoDocs.length, icon: Image, color: 'from-purple-500/20 to-pink-500/20' },
          { label: 'Registration', count: registrationDocs.length, icon: ClipboardList, color: 'from-blue-500/20 to-cyan-500/20' },
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

      {/* Purchase Records Tab */}
      <FolderTab
        icon={FileUp}
        title="Purchase Records"
        count={purchaseDocs.length}
        isExpanded={expandedTabs.purchase}
        onToggle={() => toggleTab('purchase')}
      >
        <div className="text-xs text-slate-400 space-y-1 mb-2">
          <p className="font-medium text-slate-300">Suggested documents:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Window sticker / Monroney label</li>
            <li>Purchase receipt / bill of sale</li>
            <li>Dealership add-ons receipts</li>
            <li>Accessory purchases (floor mats, bed liners, roof racks, etc.)</li>
          </ul>
        </div>

        {filterBySearch(purchaseDocs).length > 0 ? (
          <div className="space-y-2">
            {filterBySearch(purchaseDocs).map(doc => (
              <DocumentItem key={doc.id} doc={doc} onDelete={handleDelete} showVehicleName vehicles={vehicles} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">No purchase records yet. Upload your window sticker, purchase receipt, or accessory receipts.</p>
        )}

        <button
          onClick={() => setShowModal('purchase')}
          className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Upload Purchase Record
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
                  onClick={() => { if (window.confirm('Delete this document? This cannot be undone.')) handleDelete(doc.id); }}
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

      {/* Registration Tab */}
      <FolderTab
        icon={ClipboardList}
        title="Registration"
        count={registrationDocs.length}
        isExpanded={expandedTabs.registration}
        onToggle={() => toggleTab('registration')}
      >
        <div className="text-xs text-slate-400 space-y-1 mb-2">
          <p className="font-medium text-slate-300">Suggested documents:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Vehicle registration documents</li>
            <li>Registration renewal reminders</li>
            <li>Emissions / smog check certificates</li>
          </ul>
        </div>

        {/* Upcoming Renewals */}
        {registrationDocs.filter(d => d.expiryDate).length > 0 && (
          <div className="mb-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <p className="text-xs font-medium text-amber-300 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Upcoming Renewals
            </p>
            <div className="space-y-2">
              {registrationDocs
                .filter(d => d.expiryDate)
                .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
                .map(doc => {
                  const daysUntil = Math.ceil((new Date(doc.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
                  const vehicle = vehicles?.find(v => v.id === doc.vehicleId);
                  return (
                    <div key={doc.id} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-300">{vehicle?.name || vehicle?.make || 'Vehicle'}</span>
                        <span className="text-slate-500 ml-2">Renews {formatDate(doc.expiryDate)}</span>
                      </div>
                      <span className={`font-medium ${
                        daysUntil <= 30 ? 'text-red-400' :
                        daysUntil <= 60 ? 'text-amber-400' :
                        daysUntil <= 90 ? 'text-blue-400' :
                        'text-slate-400'
                      }`}>
                        {daysUntil <= 0 ? 'OVERDUE' : `${daysUntil} days`}
                      </span>
                    </div>
                  );
                })}
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Reminders sent at 90, 60, and 30 days before renewal.</p>
          </div>
        )}
          {filterBySearch(registrationDocs).length > 0 ? (
          <div className="space-y-2">
            {filterBySearch(registrationDocs).map(doc => (
              <DocumentItem key={doc.id} doc={doc} onDelete={handleDelete} showVehicleName vehicles={vehicles} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-4">No registration documents yet. Upload your registration or renewal reminders.</p>
        )}

        <button
          onClick={() => setShowModal('registration')}
          className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Upload Registration Document
        </button>
      </FolderTab>

      {/* Add Document Modal */}
      {showModal && (
        <AddDocumentModal
          folder={showModal}
          vehicles={vehicles}
          userId={userId}
          onClose={() => setShowModal(null)}
          onSave={(doc) => {
            if (onAddDocument) onAddDocument(doc);
          }}
        />
      )}
    </div>
  );
}
