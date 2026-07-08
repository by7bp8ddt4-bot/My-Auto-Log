import { useState, useMemo } from 'react';
import {
  Bell, Gauge, Calendar, TrendingUp, AlertTriangle, Clock,
  ChevronRight, Crown, ArrowRight, Car, FileText,
  CheckCircle2, X, ToggleRight, ToggleLeft, Plus, Loader2,
  AlertCircle, Info
} from 'lucide-react';
import { formatNumber, formatDate, generateId, calculateReminderStatus } from '../utils/helpers';
import { DEFAULT_REMINDER_TEMPLATES, VEHICLE_TYPES } from '../utils/constants';
import { getScheduleForVehicle } from '../data/maintenance-schedules';
import { isSameService, getLogServiceTypes } from '../hooks/useMaintenanceSchedule';
import MotorcycleIcon from './MotorcycleIcon';
import SemiTruckIcon from './SemiTruckIcon';
import RVIcon from './RVIcon';

// Map icon names to components for vehicle type display
const TYPE_ICONS = { Car, Motorcycle: MotorcycleIcon, Tractor: Car, Package: Car, Ship: Car, Anchor: Car, Cog: Car, SemiTruck: SemiTruckIcon, RV: RVIcon };

// ---------- Helper: Compute schedule status for one vehicle ----------

function computeVehicleSchedule(vehicle, vehicleLogs) {
  if (!vehicle) return [];
  const baseSchedule = getScheduleForVehicle(vehicle.make, vehicle.model);

  // Enrich with VIN data (same logic as useMaintenanceSchedule hook)
  const schedule = [...baseSchedule];
  const vinData = vehicle.vinDecoded;

  if (vinData?.driveType) {
    const dt = vinData.driveType.toLowerCase();
    const is4wd = dt.includes('4wd') || dt.includes('4-wheel') || dt.includes('4x4') || dt.includes('all-wheel') || dt.includes('awd');
    if (is4wd) {
      const hasDifferential = schedule.some(s => s.service.toLowerCase().includes('differential'));
      if (!hasDifferential) {
        schedule.push(
          { service: 'Front Differential Fluid', intervalMiles: 50000, intervalMonths: 48, severity: 'medium', description: 'Protects front differential gears.' },
          { service: 'Rear Differential Fluid', intervalMiles: 50000, intervalMonths: 48, severity: 'medium', description: 'Fresh fluid prevents rear axle gear wear.' },
        );
      }
      if (dt.includes('4wd') || dt.includes('4-wheel') || dt.includes('4x4')) {
        const hasTransferCase = schedule.some(s => s.service.toLowerCase().includes('transfer case'));
        if (!hasTransferCase) {
          schedule.push(
            { service: 'Transfer Case Fluid', intervalMiles: 50000, intervalMonths: 48, severity: 'medium', description: 'Keeps 4x4 transfer case operating smoothly.' },
          );
        }
      }
    }
  }

  if (vinData?.transmission?.toLowerCase().includes('manual')) {
    const hasClutch = schedule.some(s => s.service.toLowerCase().includes('clutch'));
    if (!hasClutch) {
      schedule.push(
        { service: 'Clutch Inspection', intervalMiles: 60000, intervalMonths: 60, severity: 'medium', description: 'Check clutch wear and adjustment for manual transmission.' },
      );
    }
  }

  function parseLocalDate(dateStr) {
    if (!dateStr) return new Date();
    const parts = dateStr.split('T')[0].split('-').map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date(dateStr);
  }

  return schedule.map(item => {
    const lastService = vehicleLogs
      .filter(log => {
        const serviceTypes = getLogServiceTypes(log);
        return serviceTypes.some(type => isSameService(item.service, type)) ||
          log.description?.toLowerCase().includes(item.service.toLowerCase());
      })
      .sort((a, b) => (b.mileage || 0) - (a.mileage || 0))[0];

    const lastMileage = lastService ? lastService.mileage : 0;
    const lastDate = lastService ? parseLocalDate(lastService.date) : parseLocalDate(vehicle.createdAt);

    const dueMileage = lastMileage + item.intervalMiles;
    const dueDate = new Date(lastDate.getTime() + (item.intervalMonths * 30 * 24 * 60 * 60 * 1000));

    const milesUntilDue = dueMileage - vehicle.mileage;
    const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));

    const mileageProgress = ((vehicle.mileage - lastMileage) / item.intervalMiles) * 100;
    const timeProgress = ((Date.now() - lastDate.getTime()) / (dueDate.getTime() - lastDate.getTime())) * 100;
    const percentComplete = Math.min(100, Math.max(0, Math.max(mileageProgress, timeProgress)));

    let status = 'upcoming';
    if (milesUntilDue <= 0 || daysUntilDue <= 0) {
      status = 'overdue';
    } else if (daysUntilDue <= 30) {
      status = 'critical';
    } else if (daysUntilDue <= 90) {
      status = 'due-soon';
    } else if (percentComplete < 50 && lastMileage > 0) {
      status = 'good';
    }

    return {
      ...item,
      vehicleName: vehicle.name,
      vehicleId: vehicle.id,
      lastMileage,
      lastDate: lastService ? lastDate.toISOString() : null,
      dueMileage,
      dueDate: dueDate.toISOString(),
      milesUntilDue,
      daysUntilDue,
      status,
      percentComplete,
    };
  });
}

// ---------- Premium Gate ----------

function PremiumGate({ onNavigate }) {
  return (
    <div className="py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
        <Crown className="w-8 h-8 text-blue-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Smart Reminders</h3>
      <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
        Upgrade to Premium to unlock mileage-based reminders, lease alerts,
        maintenance schedule tracking, and more.
      </p>
      <button
        onClick={() => onNavigate('premium')}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
      >
        <Crown className="w-4 h-4" />
        Upgrade to Premium
        <ArrowRight className="w-4 h-4" />
      </button>
      <p className="text-xs text-slate-600 mt-3">Includes unlimited vehicles, AI predictions, and more.</p>
    </div>
  );
}

// ---------- Reminder Card (reused across tabs) ----------

function ReminderCard({ reminder, vehicleName, onToggle, onDelete }) {
  const statusColor = reminder.status === 'overdue' ? 'red' : reminder.status === 'due-soon' ? 'amber' : 'slate';
  const dotColors = { red: 'bg-red-400', amber: 'bg-amber-400', slate: 'bg-slate-500' };
  const borderColors = { red: 'border-red-500/20', amber: 'border-amber-500/20', slate: 'border-slate-700/50' };
  const progressColors = { red: 'bg-red-500', amber: 'bg-amber-500', slate: 'bg-blue-500' };
  const bgColors = { red: 'bg-red-950/30', amber: 'bg-amber-950/30', slate: 'bg-slate-900/80' };

  return (
    <div className={`p-4 rounded-xl transition-all ${borderColors[statusColor]} border ${bgColors[statusColor]}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle className={`w-4 h-4 shrink-0 ${
            statusColor === 'red' ? 'text-red-400' : statusColor === 'amber' ? 'text-amber-400' : 'text-slate-500'
          }`} />
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate">{reminder.title}</div>
            {vehicleName && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {vehicleName}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onToggle && (
            <button
              onClick={() => onToggle(reminder.id, { enabled: !reminder.enabled })}
              className="p-1 rounded hover:bg-slate-800 text-slate-500"
            >
              {reminder.enabled ? <ToggleRight className="w-4 h-4 text-blue-400" /> : <ToggleLeft className="w-4 h-4" />}
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(reminder.id)} className="p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
          <span className="flex items-center gap-1">
            <Gauge className="w-3 h-3" />
            {reminder.milesUntilDue !== undefined ? (
              <span className={reminder.milesUntilDue < 0 ? 'text-red-400' : ''}>
                {formatNumber(Math.abs(reminder.milesUntilDue))} mi {reminder.milesUntilDue < 0 ? 'overdue' : 'remaining'}
              </span>
            ) : (
              <span>Mileage-based</span>
            )}
          </span>
          {reminder.daysUntilDue !== undefined && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {reminder.daysUntilDue < 0 ? `${Math.abs(reminder.daysUntilDue)}d overdue` : `${reminder.daysUntilDue}d left`}
            </span>
          )}
        </div>
        {reminder.percentComplete !== undefined && (
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColors[statusColor]}`}
              style={{ width: `${Math.min(100, reminder.percentComplete)}%` }}
            />
          </div>
        )}
      </div>

      {/* Urgency Warning */}
      {statusColor === 'red' && reminder.milesUntilDue !== undefined && (
        <div className="flex items-center gap-1.5 text-[10px] text-red-400/80 bg-red-500/5 rounded-lg px-2 py-1.5">
          <AlertTriangle className="w-3 h-3" />
          <span>Immediate attention required — {formatNumber(Math.abs(reminder.milesUntilDue))} miles past due</span>
        </div>
      )}
      {statusColor === 'amber' && reminder.milesUntilDue !== undefined && (
        <div className="flex items-center gap-1.5 text-[10px] text-amber-400/80 bg-amber-500/5 rounded-lg px-2 py-1.5">
          <Clock className="w-3 h-3" />
          <span>Schedule soon — only {formatNumber(Math.abs(reminder.milesUntilDue))} miles remaining</span>
        </div>
      )}
    </div>
  );
}

// ---------- Folder Tab Component ----------

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

// ---------- Main Component ----------

export default function RemindersPage({ reminders, vehicles, logs, onAdd, onUpdate, onDelete, onNavigate, isPremium, selectedVehicleId }) {
  const [showForm, setShowForm] = useState(false);
  const [expandedTabs, setExpandedTabs] = useState({
    mileage: true,
    lease: true,
    maintenance: true,
    other: true,
  });

  const toggleTab = (tab) => {
    setExpandedTabs(prev => ({ ...prev, [tab]: !prev[tab] }));
  };

  // Filter reminders by selected vehicle
  const filteredReminders = selectedVehicleId
    ? reminders.filter(r => r.vehicleId === selectedVehicleId)
    : reminders;

  // Compute status for each reminder
  const remindersWithStatus = useMemo(() => {
    return filteredReminders.map(r => {
      const vehicle = vehicles.find(v => v.id === r.vehicleId);
      const status = calculateReminderStatus(r, vehicle?.mileage || 0, r.vehicleId);
      return { ...r, ...status, vehicleName: vehicle?.name || 'Unknown' };
    });
  }, [filteredReminders, vehicles]);

  // Split into Mileage-based (has intervalMiles) vs Other (time-only or custom)
  const mileageReminders = useMemo(() => {
    return remindersWithStatus.filter(r => r.intervalMiles > 0);
  }, [remindersWithStatus]);

  const allReminders = useMemo(() => {
    return remindersWithStatus;
  }, [remindersWithStatus]);

  // Lease reminders: build from leased vehicles
  const leasedVehicles = useMemo(() => {
    return vehicles.filter(v => v.isLeased);
  }, [vehicles]);

  const leaseReminders = useMemo(() => {
    return leasedVehicles.map(v => {
      const mileage = v.mileage || 0;
      const purchaseMileage = v.purchaseMileage || 0;
      const purchaseDate = v.purchaseDate ? new Date(v.purchaseDate) : null;
      const leaseEndDate = v.leaseEndDate ? new Date(v.leaseEndDate) : null;
      const leaseLimit = v.leaseMileageLimit || 0;

      // Calculate daily average
      let dailyAvg = 0;
      if (purchaseDate && leaseEndDate) {
        const daysOwned = Math.max(1, Math.ceil((Date.now() - purchaseDate.getTime()) / (24 * 60 * 60 * 1000)));
        const milesDriven = mileage - purchaseMileage;
        dailyAvg = milesDriven / daysOwned;
      }

      // Days remaining on lease
      const daysRemaining = leaseEndDate ? Math.ceil((leaseEndDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)) : 0;

      // Projected mileage at lease end
      const projectedMileage = leaseEndDate && dailyAvg > 0
        ? Math.round(mileage + dailyAvg * daysRemaining)
        : mileage;

      const overUnder = projectedMileage - leaseLimit;

      return {
        vehicleId: v.id,
        vehicleName: v.name,
        vehicleMake: v.make,
        vehicleModel: v.model,
        mileage,
        leaseLimit,
        leaseEndDate: v.leaseEndDate,
        daysRemaining,
        projectedMileage,
        overUnder,
        dailyAvg,
      };
    });
  }, [leasedVehicles, vehicles]);

  // Maintenance reminders: aggregate schedule items across all vehicles where status !== 'good'
  const maintenanceReminders = useMemo(() => {
    const allVehicles = selectedVehicleId
      ? vehicles.filter(v => v.id === selectedVehicleId)
      : vehicles;

    const items = [];
    allVehicles.forEach(v => {
      const vehicleLogs = logs.filter(l => l.vehicleId === v.id);
      const schedule = computeVehicleSchedule(v, vehicleLogs);
      const incomplete = schedule.filter(item => item.status !== 'good');
      items.push(...incomplete);
    });

    // Sort by urgency
    const order = { overdue: 0, critical: 1, 'due-soon': 2, upcoming: 3 };
    items.sort((a, b) => {
      const aOrder = order[a.status] ?? 99;
      const bOrder = order[b.status] ?? 99;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return (a.milesUntilDue ?? 999999) - (b.milesUntilDue ?? 999999);
    });

    return items;
  }, [vehicles, logs, selectedVehicleId]);

  // Get vehicle name helper
  const getVehicleName = (id) => vehicles.find(v => v.id === id)?.name || 'Unknown';

  // ---------- Premium Gate ----------

  if (!isPremium) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Reminders</h2>
            <p className="text-sm text-slate-400 mt-0.5">Smart vehicle alerts</p>
          </div>
        </div>
        <PremiumGate onNavigate={onNavigate} />
      </div>
    );
  }

  // ---------- Render ----------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Reminders</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {mileageReminders.length + maintenanceReminders.length + leaseReminders.length + allReminders.length} total items
          </p>
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
          Add
        </button>
      </div>

      {/* 1. Mileage Reminders — Educational Section */}
      <FolderTab
        icon={Gauge}
        title="Mileage Reminders"
        count=""
        isExpanded={expandedTabs.mileage}
        onToggle={() => toggleTab('mileage')}
      >
        <div className="space-y-4">
          {/* WHAT */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <Info className="w-4 h-4 text-blue-400" />
              What Are Mileage Reminder Emails?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              MTXtrkr sends you periodic mileage update requests via email so we can keep
              your maintenance predictions accurate. When we ask, simply reply with your
              current odometer reading — or log in to update it instantly.
            </p>
          </div>

          {/* WHEN */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              When Do We Send Updates?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mileage reminder emails are triggered based on your driving activity. You'll
              receive a request if we haven't seen a mileage update in over 30 days, or
              when a scheduled maintenance item is approaching its due mileage. You can
              also proactively update your mileage at any time.
            </p>
          </div>

          {/* WHY */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Why Keeping Mileage Current Matters
            </h4>
            <ul className="space-y-2 mt-2">
              {[
                'Accurate prediction of upcoming maintenance needs',
                'Lease mileage tracking — avoid costly overage fees',
                'Precise schedule timing for oil, tires, and more',
                'Realistic resale value estimates for your vehicle',
                'Timely alerts when you\'re approaching a service threshold',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Update Mileage CTA */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Gauge className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white">Update Your Mileage</h4>
                <p className="text-xs text-slate-400">Keep your predictions accurate — update now</p>
              </div>
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </FolderTab>

      {/* 2. Lease Reminders — Educational Section */}
      <FolderTab
        icon={Calendar}
        title="Lease Reminders"
        count=""
        isExpanded={expandedTabs.lease}
        onToggle={() => toggleTab('lease')}
      >
        <div className="space-y-4">
          {/* WHAT */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <Info className="w-4 h-4 text-blue-400" />
              What Are Lease Projection Emails?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              MTXtrkr sends you monthly lease mileage projection emails that compare your
              actual driving pace against your lease mileage limit. Every month, you'll
              see whether you're on track, approaching your limit, or at risk of going
              over — so there are no surprises at turn-in.
            </p>
          </div>

          {/* WHEN */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              When Do We Send Lease Alerts?
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lease projection emails are sent <strong className="text-slate-200">monthly</strong> for each vehicle marked
              as leased in your account. Each email calculates your daily average mileage
              and projects your odometer reading at your lease end date — comparing it
              against your mileage limit so you know exactly where you stand.
            </p>
          </div>

          {/* WHY */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Why Lease Tracking Matters
            </h4>
            <ul className="space-y-2 mt-2">
              {[
                'Average overage fee: $0.25/mile — 5,000 miles over = $1,250',
                'Monthly awareness prevents last-minute surprises at turn-in',
                'Plan ahead: reduce driving, carpool, or arrange early turn-in',
                'Accurate projection based on YOUR driving patterns, not guesses',
                'Free basic tracking included — Premium adds monthly email alerts',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Check Lease Status CTA */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white">Check Your Lease Status</h4>
                <p className="text-xs text-slate-400">See your mileage projection and remaining allowance</p>
              </div>
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-all"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </FolderTab>

      {/* 3. Maintenance Reminders */}
      <FolderTab
        icon={FileText}
        title="Maintenance Reminders"
        count={maintenanceReminders.length}
        isExpanded={expandedTabs.maintenance}
        onToggle={() => toggleTab('maintenance')}
      >
        {maintenanceReminders.length > 0 ? (
          maintenanceReminders.map((item, idx) => {
            const statusColor = item.status === 'overdue' || item.status === 'critical' ? 'red' :
                                item.status === 'due-soon' ? 'amber' : 'slate';
            const borderColors = { red: 'border-red-500/20', amber: 'border-amber-500/20', slate: 'border-slate-700/50' };
            const bgColors = { red: 'bg-red-950/30', amber: 'bg-amber-950/30', slate: 'bg-slate-900/80' };
            const progressColors = { red: 'bg-red-500', amber: 'bg-amber-500', slate: 'bg-blue-500' };

            return (
              <div key={idx} className={`p-4 rounded-xl border ${borderColors[statusColor]} ${bgColors[statusColor]}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <AlertTriangle className={`w-4 h-4 shrink-0 ${
                      statusColor === 'red' ? 'text-red-400' : statusColor === 'amber' ? 'text-amber-400' : 'text-slate-500'
                    }`} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{item.service}</div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {item.vehicleName}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-medium">
                    <div className="flex items-center gap-1">
                      <Gauge className="w-3 h-3 opacity-70" />
                      {item.milesUntilDue <= 0 ? (
                        <span className="text-red-400">{formatNumber(Math.abs(item.milesUntilDue))} mi overdue</span>
                      ) : (
                        <span>Due in {formatNumber(item.milesUntilDue)} mi</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 opacity-70" />
                      {item.daysUntilDue <= 0 ? (
                        <span className="text-red-400">{Math.abs(item.daysUntilDue)}d overdue</span>
                      ) : (
                        <span>~{Math.round(item.daysUntilDue / 30)}mo left</span>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${progressColors[statusColor]}`}
                      style={{ width: `${Math.min(100, item.percentComplete)}%` }}
                    />
                  </div>
                  {item.description && (
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-1">{item.description}</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-slate-400">All maintenance items are up to date!</p>
            <p className="text-[10px] text-slate-600 mt-1">Great job keeping up with your vehicle's schedule.</p>
          </div>
        )}
      </FolderTab>

      {/* 4. Other Reminders — All user-created custom reminders */}
      <FolderTab
        icon={Bell}
        title="Other Reminders"
        count={allReminders.length}
        isExpanded={expandedTabs.other}
        onToggle={() => toggleTab('other')}
      >
        {/* Add reminder button inside the tab */}
        <div className="flex justify-end mb-3">
          <button
            onClick={() => {
              if (vehicles.length === 0) return;
              setShowForm(true);
            }}
            disabled={vehicles.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-[10px] font-medium transition-all"
          >
            <Plus className="w-3 h-3" />
            Create Custom Reminder
          </button>
        </div>
        {allReminders.length > 0 ? (
          allReminders.map(r => (
            <ReminderCard
              key={r.id}
              reminder={r}
              vehicleName={r.vehicleName}
              onToggle={onUpdate}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-500">No custom reminders yet</p>
            <p className="text-[10px] text-slate-600 mt-1">Create reminders for anything: "Wash the truck", "Check tire pressure before road trip", etc.</p>
          </div>
        )}
      </FolderTab>

      {/* Add Reminder Form Modal */}
      {showForm && (
        <ReminderFormModal
          vehicles={vehicles}
          templates={DEFAULT_REMINDER_TEMPLATES}
          selectedVehicleId={selectedVehicleId}
          onSave={(data) => { onAdd(data); setShowForm(false); }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

// ---------- Reminder Form Modal (from RemindersList) ----------

function ReminderFormModal({ vehicles, templates, selectedVehicleId, onSave, onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [custom, setCustom] = useState(false);
  const [form, setForm] = useState({
    vehicleId: selectedVehicleId || vehicles[0]?.id || '',
    title: '',
    description: '',
    intervalMiles: 5000,
    intervalDays: 180,
    lastCompletedMileage: 0,
    lastCompletedDate: '',
    enabled: true,
  });

  const selectTemplate = (t) => {
    setSelectedTemplate(t.id);
    setCustom(false);
    setForm(f => ({
      ...f,
      title: t.title,
      description: t.description,
      intervalMiles: t.intervalMiles,
      intervalDays: t.intervalDays,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vehicleId || !form.title) return;
    onSave({
      ...form,
      lastCompletedMileage: parseInt(form.lastCompletedMileage) || 0,
      intervalMiles: parseInt(form.intervalMiles) || 5000,
      intervalDays: parseInt(form.intervalDays) || 180,
      dueMileage: (parseInt(form.lastCompletedMileage) || 0) + (parseInt(form.intervalMiles) || 5000),
      dueDate: form.lastCompletedDate
        ? new Date(new Date(form.lastCompletedDate).getTime() + (form.intervalDays || 180) * 86400000).toISOString()
        : new Date(Date.now() + (form.intervalDays || 180) * 86400000).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Add Reminder</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!custom && (
          <div className="mb-6">
            <p className="text-xs text-slate-400 mb-3 font-medium">Quick templates</p>
            <div className="grid grid-cols-2 gap-2">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => selectTemplate(t)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedTemplate === t.id
                      ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
                      : 'border-slate-700/50 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="font-medium mb-0.5">{t.title}</div>
                  <div className="opacity-60">{formatNumber(t.intervalMiles)} mi / {t.intervalDays}d</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => { setCustom(true); setSelectedTemplate(null); }}
              className="mt-2 text-xs text-blue-400 hover:text-blue-300"
            >
              Or create custom reminder →
            </button>
          </div>
        )}

        {custom && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              onClick={() => setCustom(false)}
              className="text-xs text-blue-400 hover:text-blue-300 mb-2 block"
            >
              ← Back to templates
            </button>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Vehicle *</label>
              <select
                value={form.vehicleId}
                onChange={e => setForm(f => ({ ...f, vehicleId: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                required
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Title *</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                required />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Interval (miles)</label>
                <input type="number" value={form.intervalMiles} onChange={e => setForm(f => ({ ...f, intervalMiles: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Interval (days)</label>
                <input type="number" value={form.intervalDays} onChange={e => setForm(f => ({ ...f, intervalDays: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Last completed mileage</label>
                <input type="number" value={form.lastCompletedMileage} onChange={e => setForm(f => ({ ...f, lastCompletedMileage: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Last completed date</label>
                <input type="date" value={form.lastCompletedDate} onChange={e => setForm(f => ({ ...f, lastCompletedDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800">
                Cancel
              </button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium">
                Add Reminder
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}