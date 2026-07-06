import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Gauge } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

export default function MileageChart({ logs, vehicles, isPremium }) {
  // Build initial data points from vehicles' purchase info (always available)
  const initialData = useMemo(() => {
    return vehicles
      .filter(v => v.purchaseDate && (v.purchaseMileage || v.mileage))
      .map(v => ({
        date: v.purchaseDate?.slice(0, 7) || 'Purchase',
        [v.name || 'Vehicle']: v.purchaseMileage || v.mileage || 0,
        sortKey: new Date(v.purchaseDate).getTime() || 0,
        _vehicleName: v.name || 'Vehicle',
        _isPurchase: true,
      }));
  }, [vehicles]);

  const chartData = useMemo(() => {
    // Start with purchase data points, overlay service log data
    if (!logs || logs.length === 0) return initialData;

    // Group by vehicle
    const byVehicle = {};
    logs.forEach(l => {
      if (!byVehicle[l.vehicleId]) byVehicle[l.vehicleId] = [];
      byVehicle[l.vehicleId].push({ mileage: l.mileage, date: l.date, serviceType: l.serviceType });
    });

    // Build data points per vehicle, sorted by date/mileage
    const result = [...initialData]; // Start with purchase points
    Object.entries(byVehicle).forEach(([vId, entries]) => {
      const vehicle = vehicles.find(v => v.id === vId);
      const sorted = entries.sort((a, b) => new Date(a.date) - new Date(b.date) || a.mileage - b.mileage);
      
      // Deduplicate by taking highest mileage per date
      const byDate = {};
      sorted.forEach(e => {
        const key = e.date?.split('T')[0] || e.date;
        byDate[key] = Math.max(byDate[key] || 0, e.mileage);
      });

      Object.entries(byDate).forEach(([date, mileage]) => {
        result.push({
          date: date?.slice(0, 7) || '',
          [vehicle?.name || 'Vehicle']: mileage,
          sortKey: new Date(date).getTime() || 0,
          _vehicleName: vehicle?.name || 'Vehicle',
        });
      });
    });

    // Sort combined data by date
    result.sort((a, b) => a.sortKey - b.sortKey);
    return result;
  }, [logs, vehicles, initialData]);

  // Generate projected mileage for premium
  const projectedData = useMemo(() => {
    if (!isPremium || chartData.length < 3) return [];

    const allValues = chartData.map(d => {
      const val = Object.values(d).find(v => typeof v === 'number' && v > 1000);
      return val;
    }).filter(Boolean);

    if (allValues.length < 2) return [];

    const x = Array.from({ length: allValues.length }, (_, i) => i);
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = allValues.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, _, i) => a + i * allValues[i], 0);
    const sumXX = x.reduce((a, _, i) => a + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Project next 3 points
    const projections = [];
    for (let i = 1; i <= 3; i++) {
      const nextIdx = chartData.length + i - 1;
      projections.push({
        date: `Proj. ${i}`,
        'Projected Mileage': Math.round(slope * nextIdx + intercept),
        _projected: true,
        sortKey: Date.now() + i * 86400000 * 30,
      });
    }
    return projections;
  }, [chartData, isPremium]);

  const allData = [...chartData, ...projectedData];

  if (chartData.length === 0) {
    return (
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Mileage Over Time</h3>
        </div>
        <p className="text-xs text-slate-500 text-center py-8">Add a vehicle with purchase date and mileage to start tracking</p>
      </div>
    );
  }

  if (chartData.length === 1 && chartData[0]._isPurchase) {
    return (
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">Mileage Over Time</h3>
        </div>
        <div className="py-6 text-center">
          <Gauge className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-300 font-medium mb-1">{formatNumber(chartData[0][chartData[0]._vehicleName])} mi</p>
          <p className="text-xs text-slate-500">Purchase mileage — {chartData[0].date}</p>
          <p className="text-xs text-slate-500 mt-3">Log services with mileage to build your trend</p>
        </div>
      </div>
    );
  }

  const vehicleNames = [...new Set(chartData.map(d => d._vehicleName))];
  // Using the defined palette: Cyan-500, Blue-600, Purple-500, Emerald-500
  const colors = ['#06b6d4', '#2563eb', '#8b5cf6', '#10b981'];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-lg shadow-cyan-500/5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Mileage Over Time</h3>
            <p className="text-[10px] text-slate-500">Vehicle usage trend</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {vehicleNames.map((name, i) => (
            <span key={name} className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
              {name}
            </span>
          ))}
          {isPremium && projectedData.length > 0 && (
            <span className="flex items-center gap-1.5 text-[10px] text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Projected
            </span>
          )}
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={allData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(30, 41, 59, 0.5)" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#64748b', fontSize: 10 }} 
              axisLine={{ stroke: '#334155' }} 
              tickLine={false}
              dy={10}
            />
            <YAxis 
              tick={{ fill: '#64748b', fontSize: 10 }} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} 
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid #334155', 
                borderRadius: '12px', 
                fontSize: '12px',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ padding: '2px 0' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}
              formatter={(value) => [formatNumber(value) + ' mi', '']}
            />
            {vehicleNames.map((name, i) => (
              <Line 
                key={name} 
                type="monotone" 
                dataKey={name} 
                stroke={colors[i % colors.length]}
                strokeWidth={3} 
                dot={{ r: 4, fill: colors[i % colors.length], strokeWidth: 2, stroke: '#0f172a' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls={false} 
                animationDuration={1500}
              />
            ))}
            {isPremium && projectedData.length > 0 && (
              <Line 
                type="monotone" 
                dataKey="Projected Mileage" 
                stroke="#f59e0b" 
                strokeWidth={2}
                strokeDasharray="6 4" 
                dot={{ r: 3, fill: '#f59e0b' }} 
                connectNulls={true} 
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {!isPremium && (
        <div className="mt-3 text-center">
          <p className="text-[10px] text-slate-500">
            <span className="text-blue-400 cursor-pointer hover:text-blue-300"
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'premium' }))}>
              Upgrade to Premium
            </span> for mileage projections
          </p>
        </div>
      )}
    </div>
  );
}