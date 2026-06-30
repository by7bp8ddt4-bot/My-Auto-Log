import { useState } from 'react';
import {
  Car, AlertTriangle, Clock, DollarSign, Bell, Gauge,
  TrendingUp, Wrench, ArrowUpRight, Calendar, Plus, Fuel,
  FileText, Download
} from 'lucide-react';
import { formatCurrency, formatNumber, formatDate } from '../utils/helpers';
import { calculateReminderStatus } from '../utils/helpers';
import { generateResaleReport } from '../utils/generateReport';
import MileageChart from './MileageChart.jsx';
import AICopilot from './AICopilot.jsx';
import GettingStarted from './GettingStarted.jsx';
import { useMaintenanceSchedule } from '../hooks/useMaintenanceSchedule';
import { ManufacturerBadge } from '../utils/manufacturerBranding.jsx';

export default function Dashboard({ vehicles, logs, reminders, fuelLogs = [], onNavigate, onAddLog, isPremium }) {
  const [showExpenseAnalytics, setShowExpenseAnalytics] = useState(false);

  const activeVehicle = vehicles[0];
  const schedule = useMaintenanceSchedule(activeVehicle, logs);
  const overdueCount = schedule.filter(s => s.status === 'overdue').length;
  const dueSoonCount = schedule.filter(s => s.status === 'due-soon').length;

  const totalMileage = vehicles.reduce((sum, v) => sum + (v.mileage || 0), 0);
  const totalSpent = logs.reduce((sum, l) => sum + (l.cost || 0), 0);
  const servicesThisMonth = logs.filter(l => {
    const d = new Date(l.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Get upcoming reminders
  const upcomingReminders = reminders
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
  const aiMileagePrediction = isPremium && vehicles[0]
    ? {
      predicted: Math.round(vehicles[0].mileage + Math.random() * 150 + 50),
      weeklyAvg: Math.round(150 + Math.random() * 100),
      confidence: 85 + Math.floor(Math.random() * 12),
    }
    : null;

  // Expense analytics data
  const expenseByCategory = {};
  logs.forEach(l => {
    if (l.cost > 0) {
      expenseByCategory[l.serviceType] = (expenseByCategory[l.serviceType] || 0) + l.cost;
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
            value: `${formatNumber(totalMileage)} mi`,
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
          <div key={s.label} className={`p-4 rounded-2xl ${s.bg} ${s.border} border shadow-sm`}>
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
          logs={logs} 
          vehicles={vehicles} 
          isPremium={isPremium} 
        />
      </div>

      {/* AI Co-Pilot Section — Prominently featured */}
      <div className="mb-8">
        <AICopilot
          vehicles={vehicles}
          logs={logs}
          onAddLog={onAddLog}
          onNavigate={onNavigate}
          isPremium={isPremium}
        />
      </div>

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
                    onClick={() => onAddLog({
                      vehicleId: activeVehicle.id,
                      serviceType: item.service,
                      date: new Date().toISOString().split('T')[0],
                      mileage: activeVehicle.mileage,
                      description: `Manufacturer scheduled maintenance: ${item.service}`,
                      source: 'schedule'
                    })}
                    className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 transition-all"
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
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">No recent activity</p>
              <button onClick={() => onNavigate('logs')} className="mt-2 text-xs text-blue-400 hover:text-blue-300">
                Log your first service →
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {logs.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(log => {
                const vehicle = vehicles.find(v => v.id === log.vehicleId);
                const isAiGenerated = log.source === 'ai-copilot' || log.source === 'ai-copilot-scheduled';
                return (
                  <div key={log.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isAiGenerated ? 'bg-purple-500/10' : 'bg-blue-500/10'
                    }`}>
                      <Wrench className={`w-4 h-4 ${isAiGenerated ? 'text-purple-400' : 'text-blue-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate flex items-center gap-1.5">
                        {log.serviceType}
                        {isAiGenerated && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-purple-500/20 text-purple-300">AI</span>
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
                  const monthLogs = logs.filter(l => {
                    const d = new Date(l.date);
                    const now = new Date();
                    return d.getMonth() === (i % 12) && d.getFullYear() === now.getFullYear();
                  });
                  const monthTotal = monthLogs.reduce((s, l) => s + (l.cost || 0), 0);
                  const maxTotal = Math.max(...Array.from({ length: 12 }, (_, j) => {
                    const ml = logs.filter(l => {
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

      {/* Mileage Graph */}
      <div className="mt-8">
        <MileageChart logs={logs} vehicles={vehicles} isPremium={isPremium} />
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
    </div>
  );
}