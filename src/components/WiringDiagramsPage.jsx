import { useState, useMemo } from 'react';
import {
  GitGraph, Image, Plus, X, Trash2, Search, ChevronRight, ZoomIn, ZoomOut, Maximize
} from 'lucide-react';
import { formatDate, generateId } from '../utils/helpers';

// ---------- Wiring Diagram Store (localStorage) ----------
const STORAGE_KEY = 'mtxtrkr_wiring_diagrams';

function loadDiagrams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveDiagrams(diagrams) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
}

// ---------- Premium Upgrade Banner ----------
function PremiumUpgrade({ onNavigate }) {
  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 pb-24">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
          <GitMerge className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Wiring Diagrams</h1>
          <p className="text-sm text-slate-400">Store and view wiring diagrams for your vehicles</p>
        </div>
      </div>
      <div className="rounded-2xl border border-amber-800/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-8 text-center">
        <GitMerge className="w-16 h-16 text-amber-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Premium Feature</h2>
        <p className="text-slate-400 mb-6 max-w-md mx-auto">
          Upgrade to Premium to store wiring diagrams, service manuals, and electrical schematics for all your vehicles.
        </p>
        <button
          onClick={() => onNavigate?.('subscription')}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:brightness-110 transition-all"
        >
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
}

// ---------- Lightbox Viewer (full-screen zoom/pan) ----------
function LightboxViewer({ diagram, onClose, vehicles }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const vehicleName = vehicles?.find(v => v.id === diagram.vehicleId)?.name || 'Unknown Vehicle';

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(s => Math.max(0.25, Math.min(5, s + delta)));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex flex-col"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{diagram.name}</p>
            <p className="text-xs text-slate-400">{vehicleName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(s => Math.max(0.25, s - 0.25))}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500 min-w-[40px] text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(s => Math.min(5, s + 0.25))}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
            title="Reset view"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image container */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        {diagram.imageData ? (
          <img
            src={diagram.imageData}
            alt={diagram.name}
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            className="transition-transform duration-75"
            draggable={false}
          />
        ) : (
          <div className="text-slate-500 text-center">
            <Image className="w-16 h-16 mx-auto mb-2" />
            <p>No image data available</p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center">
          Scroll to zoom • Drag to pan • Click X to close
        </p>
      </div>
    </div>
  );
}

// ---------- Upload Modal ----------
function AddDiagramModal({ onClose, onSave, vehicles }) {
  const [name, setName] = useState('');
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vehicleId, setVehicleId] = useState(vehicles?.[0]?.id || '');

  const handleFileSelect = (file) => {
    if (!file) return;
    const type = file.type;
    if (!['image/png', 'image/jpeg', 'application/pdf'].includes(type)) {
      alert('Please upload a PNG, JPG, or PDF file.');
      return;
    }
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageData(e.target.result);
      if (!name) setName(file.name.replace(/\.[^/.]+$/, ''));
      setLoading(false);
    };
    reader.onerror = () => setLoading(false);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!imageData) return;
    const diagram = {
      id: generateId(),
      name: name || 'Untitled Diagram',
      imageData,
      vehicleId,
      dateAdded: new Date().toISOString(),
    };
    onSave(diagram);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Add Wiring Diagram</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Diagram File</label>
            {imageData ? (
              <div className="relative rounded-xl border border-slate-700 bg-slate-800/30 p-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={imageData} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white truncate">{name || 'Diagram'}</p>
                    <p className="text-xs text-emerald-400">File loaded</p>
                  </div>
                  <button onClick={() => setImageData(null)} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-slate-500 bg-slate-800/30 transition-all">
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    handleFileSelect(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
                <Plus className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Upload PNG, JPG, or PDF</p>
                <p className="text-xs text-slate-600 mt-1">Click to select a file</p>
              </label>
            )}
          </div>

          {/* Diagram Name */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Diagram Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Engine Bay Wiring, Stereo Harness"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Vehicle Selector */}
          {vehicles && vehicles.length > 0 && (
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Vehicle</label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name || v.make} {v.model}</option>
                ))}
              </select>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading || !imageData}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Save Diagram'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main WiringDiagramsPage Component ----------
export default function WiringDiagramsPage({ vehicles, onNavigate, isPremium }) {
  const [diagrams, setDiagrams] = useState(loadDiagrams);
  const [expandedVehicles, setExpandedVehicles] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingDiagram, setViewingDiagram] = useState(null);

  // If not premium, show upgrade prompt
  if (!isPremium) {
    return <PremiumUpgrade onNavigate={onNavigate} />;
  }

  const handleSave = (diagram) => {
    const updated = [...diagrams, diagram];
    setDiagrams(updated);
    saveDiagrams(updated);
    // Auto-expand the vehicle's folder
    setExpandedVehicles(prev => ({ ...prev, [diagram.vehicleId]: true }));
  };

  const handleDelete = (id) => {
    const updated = diagrams.filter(d => d.id !== id);
    setDiagrams(updated);
    saveDiagrams(updated);
  };

  const toggleVehicle = (vehicleId) => {
    setExpandedVehicles(prev => ({ ...prev, [vehicleId]: !prev[vehicleId] }));
  };

  // Group diagrams by vehicle
  const groupedDiagrams = useMemo(() => {
    const groups = {};
    diagrams.forEach(d => {
      const vid = d.vehicleId || 'unknown';
      if (!groups[vid]) groups[vid] = [];
      groups[vid].push(d);
    });
    return groups;
  }, [diagrams]);

  // Get vehicle name helper
  const getVehicleName = (vehicleId) => {
    if (!vehicles || vehicleId === 'unknown') return 'Unknown Vehicle';
    const v = vehicles.find(v => v.id === vehicleId);
    return v ? (v.name || `${v.make} ${v.model}`) : 'Unknown Vehicle';
  };

  // Filter by search term
  const filterDiagrams = (diagrams) => {
    if (!searchTerm) return diagrams;
    const term = searchTerm.toLowerCase();
    return diagrams.filter(d =>
      (d.name || '').toLowerCase().includes(term) ||
      getVehicleName(d.vehicleId).toLowerCase().includes(term)
    );
  };

  const totalDiagrams = diagrams.length;

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
          <GitMerge className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Wiring Diagrams</h1>
          <p className="text-sm text-slate-400">Store and view wiring diagrams for your vehicles</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search diagrams..."
          className="w-full bg-slate-800/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      {/* Summary */}
      <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <Image className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{totalDiagrams}</p>
            <p className="text-xs text-slate-400">{totalDiagrams === 1 ? 'Diagram' : 'Diagrams'} stored</p>
          </div>
        </div>
      </div>

      {/* Vehicle Folders */}
      {Object.keys(groupedDiagrams).length > 0 ? (
        Object.entries(groupedDiagrams).map(([vehicleId, vehicleDiagrams]) => {
          const filtered = filterDiagrams(vehicleDiagrams);
          const isExpanded = expandedVehicles[vehicleId] !== false;

          return (
            <div key={vehicleId} className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
              <div
                onClick={() => toggleVehicle(vehicleId)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800">
                    <GitMerge className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{getVehicleName(vehicleId)}</h3>
                    <p className="text-xs text-slate-500">{vehicleDiagrams.length} {vehicleDiagrams.length === 1 ? 'diagram' : 'diagrams'}</p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {filtered.length > 0 ? (
                    filtered.map(diagram => (
                      <div
                        key={diagram.id}
                        className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-3 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div
                            className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer"
                            onClick={() => setViewingDiagram(diagram)}
                          >
                            <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                              {diagram.imageData ? (
                                <img src={diagram.imageData} alt="" className="w-full h-full object-contain" />
                              ) : (
                                <Image className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">{diagram.name}</p>
                              {diagram.dateAdded && (
                                <p className="text-xs text-slate-400">{formatDate(diagram.dateAdded)}</p>
                              )}
                              <p className="text-xs text-amber-400/70">Click to view</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(diagram.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all shrink-0"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-4">No diagrams match your search.</p>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
          <Image className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No wiring diagrams yet.</p>
          <p className="text-sm text-slate-500 mt-1">Upload wiring diagrams, schematics, and electrical diagrams for your vehicles.</p>
        </div>
      )}

      {/* Add Diagram Button (FAB) */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 flex items-center justify-center hover:brightness-110 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Diagram Modal */}
      {showModal && (
        <AddDiagramModal
          vehicles={vehicles}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Lightbox Viewer */}
      {viewingDiagram && (
        <LightboxViewer
          diagram={viewingDiagram}
          vehicles={vehicles}
          onClose={() => setViewingDiagram(null)}
        />
      )}
    </div>
  );
}