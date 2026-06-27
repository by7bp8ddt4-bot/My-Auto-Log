import React from 'react';
import { 
  Calendar, 
  Gauge, 
  AlertTriangle, 
  Clock, 
  Plus, 
  ChevronRight, 
  Info,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { formatNumber, formatDate } from '../utils/helpers';
import { useMaintenanceSchedule } from '../hooks/useMaintenanceSchedule';

export default function MaintenanceSchedule({ vehicle: initialVehicle, logs, onAddLog, onNavigate, vehicles = [] }) {
  const [selectedVehicleId, setSelectedVehicleId] = React.useState(initialVehicle?.id || vehicles[0]?.id || '');
  
  const vehicle = vehicles.find(v => v.id === selectedVehicleId) || initialVehicle;
  const schedule = useMaintenanceSchedule(vehicle, logs);

  if (!vehicle && vehicles.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800">
        <Settings className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-sm text-slate-400 mb-1">Add a vehicle to see its maintenance schedule</p>
      </div>
    );
  }

  const overdue = schedule.filter(item => item.status === 'overdue');
  const dueSoon = schedule.filter(item => item.status === 'due-soon');
  const upcoming = schedule.filter(item => item.status === 'upcoming');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Maintenance Schedule</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {vehicle ? `Based on ${vehicle.year} ${vehicle.make} ${vehicle.model} manufacturer guidelines` : 'Manufacturer guidelines'}
          </p>
        </div>
        
        {vehicles.length > 1 && (
          <select 
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>
            ))}
          </select>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{overdue.length}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Overdue</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-400">{dueSoon.length}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Due Soon</div>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{upcoming.length}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Upcoming</div>
        </div>
      </div>

      <div className="space-y-4">
        {schedule.map((item, index) => (
          <ScheduleItem 
            key={index} 
            item={item} 
            vehicleId={vehicle.id} 
            onLog={() => onAddLog({
              vehicleId: vehicle.id,
              serviceType: item.service,
              date: new Date().toISOString().split('T')[0],
              mileage: vehicle.mileage,
              description: `Manufacturer scheduled maintenance: ${item.service}`,
              source: 'maintenance-schedule'
            })}
          />
        ))}
      </div>
      
      <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex gap-3 items-start">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 leading-relaxed">
          <span className="text-blue-300 font-medium">Tip:</span> These recommendations are typical for your vehicle. 
          Check your owner's manual for specific details related to severe driving conditions like heavy towing or extreme heat.
        </div>
      </div>
    </div>
  );
}

function ScheduleItem({ item, onLog }) {
  const statusColors = {
    overdue: 'text-red-400 border-red-500/20 bg-red-500/5',
    'due-soon': 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    upcoming: 'text-slate-400 border-slate-800 bg-slate-900/40'
  };

  const progressColors = {
    overdue: 'bg-red-500',
    'due-soon': 'bg-amber-500',
    upcoming: 'bg-blue-500'
  };

  return (
    <div className={`p-4 rounded-2xl border transition-all ${statusColors[item.status]} ${item.status !== 'upcoming' ? 'shadow-lg' : ''}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-white">{item.service}</h4>
            {item.severity === 'high' && (
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold uppercase tracking-tighter">Critical</span>
            )}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed mb-3">
            {item.description}
          </p>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-medium uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 opacity-70" />
              Every {formatNumber(item.intervalMiles)} mi / {item.intervalMonths} mo
            </div>
            {item.lastDate && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Last: {formatDate(item.lastDate)}
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={onLog}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-3 h-3" />
          Log
        </button>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-semibold">
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
              <span className="text-red-400">{Math.abs(item.daysUntilDue)} days overdue</span>
            ) : (
              <span>~{Math.round(item.daysUntilDue / 30)} months left</span>
            )}
          </div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${progressColors[item.status]}`}
            style={{ width: `${item.percentComplete}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// Add missing icon
function RefreshCw(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
