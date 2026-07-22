import { useState, useEffect } from 'react';
import {
      X, Plus, ClipboardList, Trash2, FileText, Upload, Calendar, DollarSign,
      Gauge, CheckCircle2, Loader2, Pencil, Cloud, ScanLine, ChevronUp
    } from 'lucide-react';
import { formatDate, formatCurrency, formatNumber } from '../utils/helpers';
import { SERVICE_TYPES } from '../utils/constants';
import { getScheduleForVehicle } from '../data/maintenance-schedules';
import { isSameService } from '../hooks/useMaintenanceSchedule';
import ReceiptScanner from './ReceiptScanner.jsx';

import oilIcon from '../assets/folder-icons/oil-drop.svg';
import tireIcon from '../assets/folder-icons/tire.svg';
import brakeIcon from '../assets/folder-icons/brake.svg';
import engineIcon from '../assets/folder-icons/engine.svg';
import transIcon from '../assets/folder-icons/transmission.svg';
import allIcon from '../assets/folder-icons/archive-drawer.svg';
import batteryIcon from '../assets/folder-icons/battery.svg';

// Folder config — only 6 folders. Each SERVICE_TYPE maps to one of these.
const FOLDER_DEFS = [
      { type: 'All Records',       icon: allIcon,       tabBorder: 'border-indigo-500/20', tabBg: 'bg-indigo-600',      accent: 'text-indigo-400', bodyBg: 'bg-indigo-500/5' },
      { type: 'Battery',           icon: batteryIcon,   tabBorder: 'border-lime-500/20',   tabBg: 'bg-lime-600',        accent: 'text-lime-400',   bodyBg: 'bg-lime-500/5' },
      { type: 'Oil & Filter Change', icon: oilIcon,     tabBorder: 'border-amber-500/20',  tabBg: 'bg-amber-600',       accent: 'text-amber-400',  bodyBg: 'bg-amber-500/5' },
      { type: 'Engine Service',    icon: engineIcon,    tabBorder: 'border-yellow-500/20', tabBg: 'bg-yellow-600',      accent: 'text-yellow-400', bodyBg: 'bg-yellow-500/5' },
      { type: 'Driveline Service', icon: transIcon,     tabBorder: 'border-purple-500/20', tabBg: 'bg-purple-600',      accent: 'text-purple-400', bodyBg: 'bg-purple-500/5' },
      { type: 'Brakes Service',    icon: brakeIcon,     tabBorder: 'border-red-500/20',    tabBg: 'bg-red-600',         accent: 'text-red-400',    bodyBg: 'bg-red-500/5' },
      { type: 'Tires',             icon: tireIcon,      tabBorder: 'border-blue-500/20',   tabBg: 'bg-blue-600',        accent: 'text-blue-400',   bodyBg: 'bg-blue-500/5' },
    ];

// Map every SERVICE_TYPE to its parent folder
const FOLDER_MAP = {
  'Oil & Filter Change': 'Oil & Filter Change',
  'Engine Service': 'Engine Service',
  'Battery Replacement': 'Battery',
  'Spark Plugs': 'Engine Service',
  'Air Filter': 'Engine Service',
  'Cabin Air Filter': 'Engine Service',
  'Fluid Check/Top-Up': 'Engine Service',
  'Wiper Blades': 'Engine Service',
  'Inspection': 'Engine Service',
  'Repair': 'Engine Service',
  'Other': 'Engine Service',
  'Transmission Service': 'Driveline Service',
  'Transfer Case Service': 'Driveline Service',
  'Front Differential Service': 'Driveline Service',
  'Rear Differential Service': 'Driveline Service',
  'Brake Service': 'Brakes Service',
  'Tire Rotation': 'Tires',
  'New Tires': 'Tires',
};

// Build SERVICE_CONFIG from folder defs for easy lookup
const SERVICE_CONFIG = {};
FOLDER_DEFS.forEach(f => { SERVICE_CONFIG[f.type] = f; });

/** Resolve the config for a service type, falling back via FOLDER_MAP then to Engine Service */
function getServiceConfig(type) {
  if (SERVICE_CONFIG[type]) return SERVICE_CONFIG[type];
  const folder = FOLDER_MAP[type];
  if (folder && SERVICE_CONFIG[folder]) return SERVICE_CONFIG[folder];
  return SERVICE_CONFIG['Engine Service']; // safe fallback for 'Other', 'Repair', etc.
}

/** Get the service types for a log entry (handles both old single-type and new multi-type) */
function getLogServiceTypes(log) {
  if (Array.isArray(log.serviceTypes) && log.serviceTypes.length > 0) return log.serviceTypes;
  if (log.serviceType) return [log.serviceType];
  return ['Other'];
}

export default function MaintenanceLog({ logs, vehicles, onAdd, onUpdate, onDelete, onNavigate, isPremium, selectedVehicleId }) {
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [activeFolder, setActiveFolder] = useState(null);
  // Pending service type from schedule "+" button — pre-fills service type, leaves date/mileage empty
  const [pendingServiceType, setPendingServiceType] = useState(null);

  // Check sessionStorage for pending schedule service (set by Dashboard "+" button)
  useEffect(() => {
    const pending = sessionStorage.getItem('mtxtrkr_pending_schedule_service');
    if (pending) {
      sessionStorage.removeItem('mtxtrkr_pending_schedule_service');
      try {
        const data = JSON.parse(pending);
        setPendingServiceType(data.serviceType);
        setShowForm(true);
      } catch (e) {
        console.warn('Invalid pending schedule service:', e);
      }
    }
  }, []);

  const filteredLogs = selectedVehicleId
    ? logs.filter(l => l.vehicleId === selectedVehicleId)
    : logs;

  const getVehicleName = (id) => vehicles.find(v => v.id === id)?.name || 'Unknown';

  const totalSpent = filteredLogs.reduce((sum, l) => sum + (l.cost || 0), 0);

  // Group logs by folder — each log goes into its parent folder based on service type
  const groupedLogs = filteredLogs.reduce((acc, log) => {
    const types = getLogServiceTypes(log);
    types.forEach(type => {
      const folder = FOLDER_MAP[type] || 'Engine Service';
      if (!acc[folder]) {
        acc[folder] = { type: folder, logs: [], totalCost: 0, lastDate: null };
      }
      acc[folder].logs.push(log);
      acc[folder].totalCost += (log.cost || 0);
      if (!acc[folder].lastDate || new Date(log.date) > new Date(acc[folder].lastDate)) {
        acc[folder].lastDate = log.date;
      }
    });
    return acc;
  }, {});

  // Ensure all relevant folder types are always visible, even when empty
  const allFolderTypes = FOLDER_DEFS.map(f => f.type).filter(t => t !== 'All Records');
  allFolderTypes.forEach(folderType => {
    if (!groupedLogs[folderType]) {
      groupedLogs[folderType] = { type: folderType, logs: [], totalCost: 0, lastDate: null };
    }
  });

  // All Records folder — always visible
  const allRecordsGroup = {
    type: 'All Records',
    logs: filteredLogs,
    totalCost: totalSpent,
    lastDate: filteredLogs.length > 0
      ? [...filteredLogs].sort((a,b) => new Date(b.date) - new Date(a.date))[0].date
      : null,
  };

  const sortedGroups = FOLDER_DEFS.map(def => {
    if (def.type === 'All Records') return allRecordsGroup;
    const group = groupedLogs[def.type];
    return group || { type: def.type, logs: [], totalCost: 0, lastDate: null };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Maintenance Log</h2>
          <p className="text-sm text-slate-400 mt-0.5">{filteredLogs.length} records</p>
        </div>
        <button
          onClick={() => {
            if (vehicles.length === 0) return;
            setShowScanner(true);
          }}
          disabled={vehicles.length === 0}
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-medium transition-all"
        >
          <ScanLine className="w-4 h-4" />
          <span className="hidden sm:inline">Scan Receipt</span>
        </button>
        <button
          onClick={() => {
            if (vehicles.length === 0) return;
            setShowForm(true);
          }}
          disabled={vehicles.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Log Service</span>
          <span className="sm:hidden">Add</span>
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
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-slate-500">
              Total: <span className="text-emerald-400 font-medium">{formatCurrency(totalSpent)}</span>
            </p>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-6 bg-slate-900/30 rounded-2xl border border-slate-800 mb-4">
              <ClipboardList className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No service logs yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                Log your first service
              </button>
            </div>
          )}

          {/* Cabinet Drawer Container — always visible, even when empty */}
            <div className="relative flex flex-col py-2 rounded-3xl bg-slate-950/20 border border-slate-900/60 shadow-inner">
              {sortedGroups.map((group, index) => {
                const config = getServiceConfig(group.type);
                const isActive = activeFolder === group.type;
                const isAfterActive = index > 0 && sortedGroups[index - 1]?.type === activeFolder;

                return (
                  <div
                    key={group.type}
                    onClick={() => setActiveFolder(group.type)}
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
                      <div
                        className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`}
                        style={{
                          backgroundColor: 'currentColor',
                          WebkitMaskImage: `url(${config.icon})`,
                          maskImage: `url(${config.icon})`,
                          maskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          maskPosition: 'center'
                        }}
                      />
                      {/* Tab Label — uppercase, monospace per spec */}
                      <span className="text-[11px] uppercase tracking-wider font-mono whitespace-nowrap">{group.type}</span>
                      {/* Record count badge inside tab */}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                        isActive ? 'bg-slate-950/40 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {group.logs.length}
                      </span>
                    </div>

                    {/* Folder Header — always visible (even when collapsed) */}
                    <div className="flex items-center justify-between p-4 pt-5">
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          {group.type}
                          {isActive && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveFolder(null); }}
                              className="ml-1 p-1 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
                              title="Collapse folder"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </h3>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {group.lastDate ? `Last serviced: ${formatDate(group.lastDate)}` : 'No service records yet'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10">
                          {formatCurrency(group.totalCost)}
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
                      {group.logs.length > 0 ? group.logs.sort((a,b) => new Date(b.date) - new Date(a.date)).map(log => {
                        const isAiGenerated = log.source === 'ai-copilot' || log.source === 'ai-copilot-scheduled';
                        const hasDocuments = log.documents && log.documents.length > 0;
                        const logTypes = getLogServiceTypes(log);
                        const isMultiJob = logTypes.length > 1;
                        return (
                          <div
                            key={log.id}
                            className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all group"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                  <span className="text-xs font-semibold text-slate-200">
                                    {getVehicleName(log.vehicleId)}
                                  </span>
                                  {isMultiJob && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 shrink-0 font-bold uppercase tracking-tighter">
                                      Multi-Job
                                    </span>
                                  )}
                                  {isAiGenerated && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 shrink-0 font-bold uppercase tracking-tighter">
                                      AI
                                    </span>
                                  )}
                                  {isPremium && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 shrink-0 flex items-center gap-0.5 font-bold uppercase tracking-tighter">
                                      <Cloud className="w-2.5 h-2.5" />
                                      Cloud
                                    </span>
                                  )}
                                </div>

                                {/* Service type tags — always shown */}
                                {logTypes.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {logTypes.map(t => {
                                      const cfg = getServiceConfig(t);
                                      return (
                                        <span key={t} className={`text-[9px] px-1.5 py-0.5 rounded-md ${cfg.bodyBg} ${cfg.accent} font-medium`}>
                                          {t}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}

                                {log.description && (
                                  <p className="text-xs text-slate-500 mb-2 line-clamp-2 italic leading-relaxed">
                                    &ldquo;{log.description}&rdquo;
                                  </p>
                                )}

                                {/* Document Thumbnails */}
                                {hasDocuments && (
                                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                                    {log.documents.slice(0, 3).map(doc => (
                                      <div key={doc.id} className="relative group/doc">
                                        {doc.type?.startsWith('image/') ? (
                                          <img
                                            src={doc.dataUrl}
                                            alt={doc.name}
                                            className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                                          />
                                        ) : (
                                          <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center">
                                            <FileText className="w-3.5 h-3.5 text-blue-400" />
                                            <span className="text-[7px] text-slate-500 mt-0.5">PDF</span>
                                          </div>
                                        )}
                                        <div className="absolute inset-0 rounded-lg bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover/doc:opacity-100 cursor-pointer">
                                          <FileText className="w-3.5 h-3.5 text-white" />
                                        </div>
                                      </div>
                                    ))}
                                    {log.documents.length > 3 && (
                                      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
                                        <span className="text-[10px] text-slate-400 font-medium">+{log.documents.length - 3}</span>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(log.date)}
                                  </span>
                                  <span className="flex items-center gap-1 font-bold text-slate-300">
                                    <Gauge className="w-3 h-3" />
                                    {formatNumber(log.mileage)} mi
                                  </span>
                                  {log.cost > 0 && (
                                    <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10">
                                      <DollarSign className="w-3 h-3" />
                                      {formatCurrency(log.cost)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditingLog(log); setShowForm(true); }}
                                  className="p-1.5 rounded-lg hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 transition-all"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this maintenance record? This cannot be undone.')) onDelete(log.id); }}
                                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }) : (
                        <div className="text-center py-8">
                          <ClipboardList className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                          <p className="text-xs text-slate-500">No {group.type.toLowerCase()} logs yet</p>
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowForm(true); }}
                            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-medium transition-all"
                          >
                            <Plus className="w-3 h-3" />
                            Log your first service
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

      {(showForm) && (
        <MaintenanceFormModal
          vehicles={vehicles}
          initialData={editingLog}
          initialVehicleId={selectedVehicleId}
          initialServiceType={pendingServiceType}
          isEditing={!!editingLog}
          onSave={editingLog
            ? (data) => { onUpdate(editingLog.id, data); setShowForm(false); setEditingLog(null); }
            : (data) => { onAdd(data); setShowForm(false); }
          }
          onClose={() => { setShowForm(false); setEditingLog(null); setPendingServiceType(null); }}
        />
      )}

      {/* Receipt Scanner Modal */}
      {(showScanner) && (
        <ReceiptScanner
          vehicles={vehicles}
          onSave={(data) => { onAdd(data); setShowScanner(false); }}
          onClose={() => setShowScanner(false)}
          isPremium={isPremium}
        />
      )}
    </div>
  );
}

function MaintenanceFormModal({ vehicles, initialData, initialVehicleId, initialServiceType, isEditing, onSave, onClose }) {
  const [form, setForm] = useState({
    vehicleId: initialData?.vehicleId || initialVehicleId || vehicles[0]?.id || '',
    date: initialData?.date || '',
    mileage: initialData?.mileage?.toString() || '',
    // Support both old single-type and new multi-type
    serviceTypes: initialData?.serviceTypes
      ? [...initialData.serviceTypes]
      : (initialData?.serviceType ? [initialData.serviceType]
        : (initialServiceType ? [initialServiceType] : [])),
    description: initialData?.description || '',
    cost: initialData?.cost?.toString() || '',
  });
  const [documents, setDocuments] = useState(initialData?.documents || []);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [serviceMode, setServiceMode] = useState('predetermined');
  const [customService, setCustomService] = useState('');
  const [customFolder, setCustomFolder] = useState('Engine Service');

  const folderOptions = FOLDER_DEFS.filter(f => f.type !== 'All Records');

  const selectedVehicle = vehicles.find(v => v.id === form.vehicleId);
  const schedule = selectedVehicle ? getScheduleForVehicle(selectedVehicle.make, selectedVehicle.model) : [];
  const scheduledTypes = schedule.map(s => s.service);
  const alwaysShown = ['New Tires', 'Battery Replacement'];

  // Filter SERVICE_TYPES to show only items matching the vehicle's schedule, plus always-shown ones
  const filteredServiceTypes = SERVICE_TYPES.filter(type =>
    alwaysShown.includes(type) || scheduledTypes.some(st => isSameService(st, type))
  );
  // Always include any service types already selected (e.g. from editing)
  const allDisplayTypes = [...new Set([...filteredServiceTypes, ...form.serviceTypes])];

  const toggleServiceType = (type) => {
    setForm(f => {
      const current = f.serviceTypes;
      if (current.includes(type)) {
        return { ...f, serviceTypes: current.filter(t => t !== type) };
      }
      return { ...f, serviceTypes: [...current, type] };
    });
  };

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
          setTimeout(() => { setUploadComplete(true); setUploadProgress(null); }, 400);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (documents.length <= 1) setUploadComplete(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vehicleId || form.serviceTypes.length === 0) return;
    const serviceTypes = form.serviceTypes;
    const serviceType = serviceTypes[0];
    
    // Register custom service type in FOLDER_MAP so it routes to the right folder
    const customTrimmed = customService.trim();
    if (customTrimmed && form.serviceTypes.includes(customTrimmed)) {
      FOLDER_MAP[customTrimmed] = customFolder;
    }
    
    onSave({
      ...form,
      serviceTypes,
      serviceType,
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
          <h3 className="text-lg font-bold text-white">{isEditing ? 'Edit Service' : 'Log Service'}</h3>
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

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Mileage</label>
              <input type="number" value={form.mileage} onChange={e => setForm(f => ({ ...f, mileage: e.target.value }))}
                placeholder="e.g. 45000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            </div>
          </div>

          {/* Multi-Job Service Types — Predetermined / Custom toggle */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">
              Service Type(s) * <span className="text-slate-500 font-normal">(select one or more)</span>
            </label>
            {!selectedVehicle ? (
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-500 text-xs italic">
                Select a vehicle to see recommended service types
              </div>
            ) : (
              <>
                {/* Mode Toggle — Predetermined vs Custom */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => { setServiceMode('predetermined'); setForm(f => ({ ...f, serviceTypes: [] })); setCustomService(''); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                      serviceMode === 'predetermined'
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    Predetermined
                  </button>
                  <button
                    type="button"
                    onClick={() => { setServiceMode('custom'); setForm(f => ({ ...f, serviceTypes: [] })); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                      serviceMode === 'custom'
                        ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    Custom Service
                  </button>
                </div>

                {/* Predetermined Mode — Checkbox Grid */}
                {serviceMode === 'predetermined' && (
                  <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto p-1 rounded-xl bg-slate-900/50 border border-slate-800">
                    {allDisplayTypes.map(type => {
                      const config = getServiceConfig(type);
                      const isSelected = form.serviceTypes.includes(type);
                      return (
                        <label
                          key={type}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-xs ${
                            isSelected
                              ? `${config.bodyBg} ${config.tabBorder} border`
                              : 'text-slate-400 hover:bg-slate-800/60 border border-transparent'
                          }`}
                        >
                          <input type="checkbox" checked={isSelected} onChange={() => toggleServiceType(type)}
                            className="w-3.5 h-3.5 rounded border-slate-600 text-blue-600 focus:ring-blue-500/30 bg-slate-800" />
                          <span className={isSelected ? config.accent : ''}>{type}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Custom Mode — Text Input + File Under */}
                {serviceMode === 'custom' && (
                  <div className="space-y-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">Service Name</label>
                      <input
                        type="text"
                        value={customService}
                        onChange={e => setCustomService(e.target.value)}
                        placeholder="e.g. Rust Undercoating, Ceramic Coating..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1.5">File Under</label>
                      <select
                        value={customFolder}
                        onChange={e => setCustomFolder(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        {folderOptions.map(f => (
                          <option key={f.type} value={f.type}>{f.type}</option>
                        ))}
                      </select>
                    </div>
                    {customService.trim() && (
                      <button
                        type="button"
                        onClick={() => {
                          const trimmed = customService.trim();
                          if (trimmed && !form.serviceTypes.includes(trimmed)) {
                            FOLDER_MAP[trimmed] = customFolder;
                            toggleServiceType(trimmed);
                          }
                        }}
                        disabled={form.serviceTypes.includes(customService.trim())}
                        className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-medium transition-all"
                      >
                        {form.serviceTypes.includes(customService.trim())
                          ? '✓ Added'
                          : `Add "${customService.trim()}"`}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
            {form.serviceTypes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.serviceTypes.map(t => {
                  const cfg = getServiceConfig(t);
                  return (
                    <span key={t} className={`text-[10px] px-2 py-0.5 rounded-full ${cfg.bodyBg} ${cfg.accent} font-medium`}>{t}</span>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Notes about this service..." rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Cost ($)</label>
            <input type="number" step="0.01" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
              placeholder="0.00"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>

          {/* Enhanced Document Upload */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Receipts / Documents</label>
            <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-700 hover:border-blue-500/50 cursor-pointer transition-all text-sm text-slate-400 hover:text-blue-400">
              {uploadComplete ? (
                <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Upload complete!</>
              ) : (
                <><Upload className="w-4 h-4" /> Upload files (receipts, photos)</>
              )}
              <input type="file" multiple accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
            </label>
            {uploadProgress !== null && (
              <div className="mt-2">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Loader2 className="w-3 h-3 animate-spin" /><span>Uploading...</span><span className="ml-auto">{uploadProgress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
            {documents.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {documents.map(d => (
                  <div key={d.id} className="relative group">
                    {d.type?.startsWith('image/') ? (
                      <img src={d.dataUrl} alt={d.name} className="w-16 h-16 rounded-lg object-cover border border-slate-700" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 flex flex-col items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-400" /><span className="text-[8px] text-slate-500">{d.name.split('.').pop()}</span>
                      </div>
                    )}
                    <button onClick={() => removeDocument(d.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center transition-all"><X className="w-3 h-3" /></button>
                    <div className="text-[9px] text-slate-500 text-center truncate max-w-[4rem] mt-0.5">{d.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={form.serviceTypes.length === 0}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium transition-all">
              {form.serviceTypes.length > 1 ? `Log ${form.serviceTypes.length} Services` : isEditing ? 'Save Changes' : 'Log Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}