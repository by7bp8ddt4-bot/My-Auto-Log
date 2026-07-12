import { useState, useEffect } from 'react';
import {
  Car, AlertTriangle, Clock, DollarSign, Bell, Gauge,
  TrendingUp, Wrench, ArrowUpRight, Calendar, Plus, Fuel,
  FileText, Download, CheckCircle
} from 'lucide-react';
import { formatCurrency, formatNumber, formatDate, getLocalDateString } from '../utils/helpers';
import { calculateReminderStatus } from '../utils/helpers';
import { generateResaleReport } from '../utils/generateReport';
import MileageChart from './MileageChart.jsx';
import AICopilot from './AICopilot.jsx';
import GettingStarted from './GettingStarted.jsx';
import { useMaintenanceSchedule } from '../hooks/useMaintenanceSchedule';
import { ManufacturerBadge } from '../utils/manufacturerBranding.jsx';

export default function Dashboard({ vehicles, logs, reminders, fuelLogs = [], onNavigate, onAddLog, isPremium, selectedVehicleId, onSelectVehicle }) {
  // Derive active vehicle from global prop — fall back to first if invalid
  const effectiveVehicleId = (vehicles.find(v => v.id === selectedVehicleId) ? selectedVehicleId : vehicles[0]?.id) || null;
  const activeVehicle = vehicles.find(v => v.id === effectiveVehicleId) || vehicles[0] || null;

  // Filter logs/reminders/fuelLogs by active vehicle
  const vehicleLogs = logs.filter(l => l.vehicleId === effectiveVehicleId);
  const vehicleReminders = reminders.filter(r => r.vehicleId === effectiveVehicleId);
  const vehicleFuelLogs = fuelLogs.filter(f => f.vehicleId === effectiveVehicleId);

  const schedule = useMaintenanceSchedule(activeVehicle, vehicleLogs);
  const overdueCount = schedule.filter(s => s.status === 'overdue').length;
  const dueSoonCount = schedule.filter(s => s.status === 'due-soon').length;

  const totalMileage = activeVehicle ? (activeVehicle.mileage || 0) : 0;
  const isHourVehicle = activeVehicle && ['ag-equipment', 'forklift', 'watercraft', 'outboard', 'marine-diesel'].includes(activeVehicle.type);
  const mileageUnit = isHourVehicle ? 'hrs' : 'mi';
  const totalSpent = vehicleLogs.reduce((sum, l) => sum + (l.cost || 0), 0);
  const servicesThisMonth = vehicleLogs.filter(l => {
    const d = new Date(l.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Get upcoming reminders (scoped to active vehicle)
  const upcomingReminders = vehicleReminders
    .filter(r => r.enabled !== false)
    .map(r => {
      const vehicle = vehicles.find(v => v.id === r.vehicleId);
      const status = calculateReminderStatus(r, vehicle?.mileage || 0);
      return { ...r, ...status, vehicleName: vehicle?.name || 'Unknown' };
    })
    .sort((a, b) => {
      const urgencyA = a.status === 'overdue' ? 0 : a.status === 'due-soon' ? 1 : 2;
      const urgencyB = b.status === 'overdue' ? 0 : b.status === 'due-soon' ? 1 : 2;
      return urgencyA - urgencyB;
    })
    .slice(0, 5);

  // Premium AI Mileage Prediction
  const aiMileagePrediction = isPremium && activeVehicle
    ? {
      predicted: Math.round(activeVehicle.mileage + Math.random() * 150 + 50),
      weeklyAvg: Math.round(150 + Math.random() * 100),
      confidence: 85 + Math.floor(Math.random() * 12),
    }
    : null;

  // Lease Mileage Projector — state & computed values
  const [targetDate, setTargetDate] = useState(() => {
    // Auto-populate from lease end date if available, otherwise default to 3 years
    if (activeVehicle?.isLeased && activeVehicle?.leaseEndDate) {
      return activeVehicle.leaseEndDate;
    }
    const d = new Date();
    d.setFullYear(d.getFullYear() + 3);
    return d.toISOString().split('T')[0];
  });

  // Re-sync target date when active vehicle changes (for lease auto-populate)
  useEffect(() => {
    if (activeVehicle?.isLeased && activeVehicle?.leaseEndDate) {
      setTargetDate(activeVehicle.leaseEndDate);
    } else {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 3);
      setTargetDate(d.toISOString().split('T')[0]);
    }
  }, [activeVehicle?.id, activeVehicle?.isLeased]);
  const daysSincePurchase = activeVehicle?.purchaseDate
    ? Math.floor((Date.now() - new Date(activeVehicle.purchaseDate).getTime()) / (24 * 60 * 60 * 1000))
    : 1;
  const dailyAvg = daysSincePurchase > 0 && activeVehicle?.purchaseMileage >= 0
    ? Math.max(0, (activeVehicle.mileage - activeVehicle.purchaseMileage) / daysSincePurchase)
    : 0;
  const daysToTarget = targetDate
    ? Math.max(0, Math.floor((new Date(targetDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;
  const projectedMileage = dailyAvg > 0 && daysToTarget > 0
    ? Math.round(activeVehicle.mileage + dailyAvg * daysToTarget)
    : 0;

  // Get service types from a log (handles both old single-type and new multi-type)
  const getLogServiceTypes = (log) => {
    if (Array.isArray(log.serviceTypes) && log.serviceTypes.length > 0) return log.serviceTypes;
    if (log.serviceType) return [log.serviceType];
    return ['Other'];
  };

  // Expense analytics data — count each log against ALL its service types
  const expenseByCategory = {};
  vehicleLogs.forEach(l => {
    if (l.cost > 0) {
      const types = getLogServiceTypes(l);
      const costPerType = l.cost / types.length; // split multi-job costs evenly
      types.forEach(type => {
        expenseByCategory[type] = (expenseByCategory[type] || 0) + costPerType;
      });
    }
  });
  const sortedCategories = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxCatCost = sortedCategories.length > 0 ? Math.max(...sortedCategories.map(([_, v]) => v)) : 1;

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Dashboard</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} • {logs.length} service records
          </p>
        </div>
        <button 
          onClick={() => onNavigate('fuel')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-600/30 transition-all"
        >
          <Fuel className="w-3.5 h-3.5" />
          Fuel Tracking
        </button>
      </div>

      {/* Vehicle Tab Bar — premium only, 2+ vehicles */}
      {isPremium && vehicles.length > 1 && (
        <div className="mb-5">
          <div className="flex flex-nowrap gap-2 -mx-4 px-4 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide">
            {vehicles.map(v => (
              <button
                key={v.id}
                onClick={() => onSelectVehicle(v.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 transition-all shrink-0 snap-start min-w-0 ${
                  v.id === effectiveVehicleId
                    ? 'bg-blue-600/15 border-blue-500/50 text-white shadow-sm shadow-blue-500/10'
                    : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:border-slate-600'
                }`}
              >
                <ManufacturerBadge make={v.make} size={22} />
                <span className="text-sm font-semibold whitespace-nowrap">{v.name || `${v.year} ${v.make}`}</span>
                {v.id === effectiveVehicleId && (
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-600 mt-1.5 text-center">
            ← Swipe or tap to switch vehicles →
          </p>
        </div>
      )}

      {/* Onboarding Wizard for new users */}
      {vehicles.length === 0 && (
        <div className="mb-8">
          <GettingStarted onNavigate={onNavigate} />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: Car,
            label: 'Vehicles',
            value: vehicles.length,
            color: 'blue',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            text: 'text-blue-400',
          },
          {
            icon: Gauge,
            label: 'Total Mileage',
            value: `${formatNumber(totalMileage)} ${mileageUnit}`,
            color: 'cyan',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/20',
            text: 'text-cyan-400',
          },
          {
            icon: Wrench,
            label: 'Services This Month',
            value: servicesThisMonth,
            color: 'purple',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            text: 'text-purple-400',
          },
          {
            icon: DollarSign,
            label: 'Total Spent',
            value: formatCurrency(totalSpent),
            color: 'emerald',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            text: 'text-emerald-400',
          },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-2xl ${s.bg} ${s.border} border shadow-sm glass-card`}>
            <div className="flex items-center gap-2 mb-3">
              <s.icon className={`w-4 h-4 ${s.text}`} />
              <span className="text-xs text-slate-400">{s.label}</span>
            </div>
            <div className={`text-2xl font-bold ${s.text}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Mileage Chart Section */}
      <div className="mb-8">
        <MileageChart 
          logs={vehicleLogs} 
          vehicles={vehicles} 
          isPremium={isPremium} 
        />
      </div>

      {/* AI Co-Pilot Section — Prominently featured */}
      <div className="mb-8">
        <AICopilot
          vehicles={vehicles}
          logs={logs}
          activeVehicleId={effectiveVehicleId}
          onAddLog={onAddLog}
          onNavigate={onNavigate}
          isPremium={isPremium}
        />
      </div>

      {/* Lease Mileage Projector — Premium */}
      {isPremium && activeVehicle?.isLeased && activeVehicle?.purchaseDate && activeVehicle?.purchaseMileage >= 0 ? (
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-violet-600/5 to-purple-600/5 border border-violet-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              Lease Mileage Projector
            </h3>
          </div>

          {/* Current Pace Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Daily Avg</div>
              <div className="text-lg font-bold text-violet-400">{formatNumber(Math.round(dailyAvg))} mi</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Weekly</div>
              <div className="text-lg font-bold text-violet-400">{formatNumber(Math.round(dailyAvg * 7))} mi</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Monthly</div>
              <div className="text-lg font-bold text-violet-400">{formatNumber(Math.round(dailyAvg * 30))} mi</div>
            </div>
          </div>

          {/* Target Date Projector */}
          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-xs text-slate-400 mb-1.5">Target Date (e.g. lease end)</label>
              <input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-1">Projected</div>
              <div className="text-xl font-bold text-violet-400">{formatNumber(projectedMileage)} {mileageUnit}</div>
            </div>
          </div>

          {projectedMileage > 0 && (
            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">At your current pace, you'll reach</span>
                <span className="text-white font-bold">{formatNumber(projectedMileage)} {mileageUnit}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-slate-500">by</span>
                <span className="text-white font-bold">{formatDate(targetDate)}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">That's</span>
                <span className="text-violet-400 font-bold">{formatNumber(Math.round(dailyAvg * daysToTarget))} {mileageUnit}</span>
                <span className="text-slate-500">from today</span>
              </div>
            </div>
          )}

          {/* Lease Limit Comparison — shown when vehicle has lease data */}
          {activeVehicle?.isLeased && activeVehicle?.leaseMileageLimit > 0 && activeVehicle?.leaseEndDate && (
            <div className="mt-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-500">Lease Limit</span>
                <span className="text-white font-bold">{formatNumber(activeVehicle.leaseMileageLimit)} {mileageUnit}</span>
              </div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-500">Projected at lease end</span>
                <span className={projectedMileage > activeVehicle.leaseMileageLimit ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {formatNumber(projectedMileage)} {mileageUnit}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${projectedMileage > activeVehicle.leaseMileageLimit ? 'bg-red-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, (projectedMileage / activeVehicle.leaseMileageLimit) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] mt-1">
                <span className="text-slate-600">{Math.round((projectedMileage / activeVehicle.leaseMileageLimit) * 100)}% used</span>
                {projectedMileage > activeVehicle.leaseMileageLimit ? (
                  <span className="text-red-400 font-medium">⚠ {formatNumber(projectedMileage - activeVehicle.leaseMileageLimit)} mi over limit</span>
                ) : (
                  <span className="text-emerald-400 font-medium">{formatNumber(activeVehicle.leaseMileageLimit - projectedMileage)} mi remaining</span>
                )}
              </div>
            </div>
          )}
        </div>
      ) : !isPremium && activeVehicle?.isLeased && activeVehicle?.purchaseDate && activeVehicle?.purchaseMileage >= 0 ? (
        /* Free user sees blurred preview with upgrade CTA */
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-violet-600/5 to-purple-600/5 border border-violet-500/20 relative overflow-hidden">
          <div className="filter blur-sm pointer-events-none select-none">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Daily Avg</div>
                <div className="text-lg font-bold text-violet-400">42 mi</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Weekly</div>
                <div className="text-lg font-bold text-violet-400">294 mi</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Monthly</div>
                <div className="text-lg font-bold text-violet-400">1,260 mi</div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] flex items-center justify-center rounded-xl">
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-violet-400" />
              </div>
              <p className="text-sm font-semibold text-white mb-1">Track Your Lease Mileage</p>
              <p className="text-xs text-slate-400 mb-4">Predict your mileage at lease end based on your actual driving pace.</p>
              <button
                onClick={() => onNavigate('premium')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 text-white text-xs font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Upgrade to Premium — $4.99/mo
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Maintenance Schedule Card */}
      {activeVehicle && (
        <div className="mb-8 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Your Vehicle's Maintenance Schedule
            </h3>
            <button 
              onClick={() => onNavigate('schedule')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Full Schedule <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-4 p-3 bg-slate-800/30 rounded-xl">
            <ManufacturerBadge make={activeVehicle.make} size={24} />
            <div className="flex-1">
              <div className="text-xs text-slate-400 mb-1">Active Vehicle</div>
              <div className="text-sm font-bold text-white">{activeVehicle.year} {activeVehicle.make} {activeVehicle.model}</div>
            </div>
            <div className="flex gap-2">
              {overdueCount > 0 && (
                <div className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400">
                  {overdueCount} OVERDUE
                </div>
              )}
              {dueSoonCount > 0 && (
                <div className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400">
                  {dueSoonCount} DUE SOON
                </div>
              )}
              {overdueCount === 0 && dueSoonCount === 0 && (
                <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                  ALL CAUGHT UP
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {schedule.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/50">
                <div className="flex-1">
                  <div className="text-xs font-bold text-white mb-0.5">{item.service}</div>
                  <div className="text-[10px] text-slate-500">
                    Due in {formatNumber(item.milesUntilDue)} mi / ~{Math.round(item.daysUntilDue / 30)} months
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.status === 'overdue' ? 'bg-red-500' : item.status === 'due-soon' ? 'bg-amber-500' : 'bg-blue-500'}`}
                      style={{ width: `${item.percentComplete}%` }}
                    />
                  </div>
                  <button 
                    onClick={() => {
                      sessionStorage.setItem('mtxtrkr_pending_schedule_service', JSON.stringify({
                        vehicleId: activeVehicle.id,
                        serviceType: item.service,
                      }));
                      onNavigate('logs');
                    }}
                    className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 transition-all"
                    title="Log this service"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity & Upcoming Reminders */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Recent Activity
            </h3>
            <button onClick={() => onNavigate('logs')} className="text-xs text-blue-400 hover:text-blue-300">
              View all
            </button>
          </div>
          {vehicleLogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">No recent activity</p>
              <button onClick={() => onNavigate('logs')} className="mt-2 text-xs text-blue-400 hover:text-blue-300">
                Log your first service →
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {vehicleLogs.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(log => {
                const vehicle = vehicles.find(v => v.id === log.vehicleId);
                const isAiGenerated = log.source === 'ai-copilot' || log.source === 'ai-copilot-scheduled';
                const logTypes = getLogServiceTypes(log);
                const isMultiJob = logTypes.length > 1;
                return (
                  <div key={log.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isAiGenerated ? 'bg-purple-500/10' : 'bg-blue-500/10'
                    }`}>
                      <Wrench className={`w-4 h-4 ${isAiGenerated ? 'text-purple-400' : 'text-blue-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate flex items-center gap-1.5">
                        {isMultiJob ? (
                          <span className="truncate">{logTypes[0]} +{logTypes.length - 1}</span>
                        ) : (
                          log.serviceType
                        )}
                        {isAiGenerated && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-300">AI</span>
                        )}
                        {isMultiJob && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Multi</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        {vehicle?.name || 'Unknown'} • {formatDate(log.date)} • {formatNumber(log.mileage)} mi
                      </div>
                    </div>
                    {log.cost > 0 && (
                      <span className="text-xs font-medium text-emerald-400">{formatCurrency(log.cost)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Reminders with Progress Bars */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              Upcoming Reminders
            </h3>
            <button onClick={() => onNavigate('reminders')} className="text-xs text-blue-400 hover:text-blue-300">
              View all
            </button>
          </div>
          {upcomingReminders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">No upcoming reminders</p>
              <button onClick={() => onNavigate('reminders')} className="mt-2 text-xs text-blue-400 hover:text-blue-300">
                Add a reminder →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingReminders.map(r => {
                const progressColor = r.status === 'overdue'
                  ? 'bg-red-500'
                  : r.status === 'due-soon'
                    ? 'bg-amber-500'
                    : 'bg-blue-500';
                const isUrgent = r.status === 'overdue' || r.status === 'due-soon';
                return (
                  <div key={r.id} className={`p-3 rounded-xl transition-all ${
                    isUrgent
                      ? 'bg-slate-900/80 border border-red-500/20'
                      : 'bg-slate-900/60 border border-slate-800/50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-3.5 h-3.5 ${
                          r.status === 'overdue' ? 'text-red-400' : r.status === 'due-soon' ? 'text-amber-400' : 'text-slate-500'
                        }`} />
                        <span className="text-sm font-medium text-white">{r.title}</span>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        r.status === 'overdue'
                          ? 'bg-red-500/15 text-red-400'
                          : r.status === 'due-soon'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-slate-800 text-slate-400'
                      }`}>
                        {r.status === 'overdue' ? 'Overdue' : r.status === 'due-soon' ? 'Due Soon' : 'OK'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span>{r.vehicleName}</span>
                        <span>{formatNumber(Math.abs(r.milesUntilDue))} mi {r.milesUntilDue < 0 ? 'over' : 'to go'}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                          style={{ width: `${Math.min(100, r.percentComplete)}%` }}
                        />
                      </div>
                    </div>

                    {r.percentComplete > 80 && r.status !== 'overdue' && (
                      <p className="text-[10px] text-amber-400/80 mt-1">
                        ⚠ {formatNumber(Math.abs(r.milesUntilDue))} miles remaining — schedule soon
                      </p>
                    )}
                    {r.status === 'overdue' && (
                      <p className="text-[10px] text-red-400/80 mt-1">
                        ⚠ Overdue by {formatNumber(Math.abs(r.milesUntilDue))} miles — service required
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Advanced Expense Reports / Premium Analytics */}
      <div className="mt-8 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Expense Analytics
          </h3>
          {!isPremium && (
            <button
              onClick={() => onNavigate('premium')}
              className="text-xs px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 text-blue-300"
            >
              Premium Feature
            </button>
          )}
        </div>

        {isPremium ? (
          <div className="space-y-4">
            {/* Category Breakdown */}
            <div className="space-y-2">
              {sortedCategories.length > 0 ? sortedCategories.map(([category, cost]) => (
                <div key={category}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300">{category}</span>
                    <span className="text-emerald-400 font-medium">{formatCurrency(cost)}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all"
                      style={{ width: `${(cost / maxCatCost) * 100}%` }}
                    />
                  </div>
                </div>
              )) : (
                <p className="text-xs text-slate-500 text-center py-4">No expense data yet. Log services with costs to see analytics.</p>
              )}
            </div>
            {/* Monthly trend bar */}
            <div className="pt-3 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 mb-2">Monthly Spending Trend</p>
              <div className="flex items-end gap-1.5 h-16">
                {Array.from({ length: 12 }, (_, i) => {
                  const monthLogs = vehicleLogs.filter(l => {
                    const d = new Date(l.date);
                    const now = new Date();
                    return d.getMonth() === (i % 12) && d.getFullYear() === now.getFullYear();
                  });
                  const monthTotal = monthLogs.reduce((s, l) => s + (l.cost || 0), 0);
                  const maxTotal = Math.max(...Array.from({ length: 12 }, (_, j) => {
                    const ml = vehicleLogs.filter(l => {
                      const d = new Date(l.date);
                      const now = new Date();
                      return d.getMonth() === (j % 12) && d.getFullYear() === now.getFullYear();
                    });
                    return ml.reduce((s, l) => s + (l.cost || 0), 0);
                  }), 1);
                  const height = (monthTotal / maxTotal) * 100;
                  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  const isCurrentMonth = i === new Date().getMonth();
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full rounded-sm transition-all ${
                          isCurrentMonth ? 'bg-cyan-400' : 'bg-blue-500/40'
                        }`}
                        style={{ height: `${Math.max(4, height)}%` }}
                      />
                      <span className="text-[8px] text-slate-600">{monthNames[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Free user sees blurred overlay with premium CTA */
          <div className="relative">
            <div className="filter blur-sm pointer-events-none select-none">
              <div className="space-y-3">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-2 bg-slate-800 rounded-full" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
                <div className="h-2 bg-slate-800 rounded-full" />
                <div className="h-4 bg-slate-800 rounded w-2/3" />
                <div className="h-2 bg-slate-800 rounded-full" />
                <div className="flex items-end gap-1.5 h-16">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-slate-800 rounded-sm" style={{ height: `${20 + Math.random() * 60}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[3px] flex items-center justify-center rounded-xl">
              <div className="text-center p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">Unlock Premium Analytics</p>
                <p className="text-xs text-slate-400 mb-4">Get detailed expense breakdowns, charts, and spending trends.</p>
                <button
                  onClick={() => onNavigate('premium')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Upgrade to Premium — $4.99/mo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Premium PDF Resale Report */}
      {isPremium && (
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-amber-600/5 to-orange-600/5 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Resale Value Report</h3>
            </div>
            <button
              onClick={() => generateResaleReport(vehicles, logs, reminders)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Generate PDF
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Generate a professional PDF report of your full service history — perfect for dealership trade-ins or private sales.
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-600/5 to-cyan-600/5 border border-blue-500/20">
        <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Log Service', icon: Wrench, action: 'logs' },
            { label: 'Add Vehicle', icon: Car, action: 'vehicles' },
            { label: 'Add Reminder', icon: Bell, action: 'reminders' },
            ...(isPremium
              ? [{ label: 'Resale Report', icon: FileText, action: 'logs' }]
              : [{ label: 'View Premium', icon: TrendingUp, action: 'premium' }]
            ),
          ].map(q => {
            const Icon = q.icon;
            return (
              <button
                key={q.label}
                onClick={() => onNavigate(q.action)}
                className="flex flex-col items-center gap-2 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/30 hover:bg-slate-900 transition-all"
              >
                <Icon className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-medium text-slate-300">{q.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isPremium ? (
        <div className="mt-6 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Need Help?</h3>
              <p className="text-xs text-slate-500">Contact our engineering team</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>
            Issues? Contact Support
          </button>
        </div>
      ) : null}
    </div>
  );
}