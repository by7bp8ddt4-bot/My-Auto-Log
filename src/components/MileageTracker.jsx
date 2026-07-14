import { useMemo } from 'react';
import { TrendingUp, Gauge, Lock } from 'lucide-react';
import { formatNumber, formatDate } from '../utils/helpers';

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatMonthYear(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Build mileage data points: purchase point + service log entries + current point.
 * Returns sorted array of { x: dateObj, y: mileage, label: string, isPurchase, isCurrent }
 */
function buildDataPoints(vehicle, vehicleLogs) {
  const points = [];

  // Purchase point
  if (vehicle?.purchaseMileage != null && vehicle?.purchaseDate) {
    points.push({
      x: new Date(vehicle.purchaseDate),
      y: Number(vehicle.purchaseMileage),
      label: 'Purchase',
      isPurchase: true,
    });
  }

  // Service log entries
  if (vehicleLogs?.length > 0) {
    vehicleLogs.forEach(log => {
      if (log.mileage && log.date) {
        // Deduplicate by date - keep highest mileage per date
        const logDate = new Date(log.date);
        const existing = points.find(p => !p.isPurchase && !p.isCurrent && p.x.toDateString() === logDate.toDateString());
        if (existing) {
          existing.y = Math.max(existing.y, Number(log.mileage));
        } else {
          points.push({
            x: logDate,
            y: Number(log.mileage),
            label: formatMonthYear(log.date),
            isLog: true,
          });
        }
      }
    });
  }

  // Current mileage point
  if (vehicle?.mileage != null && vehicle.mileage > 0) {
    points.push({
      x: new Date(),
      y: Number(vehicle.mileage),
      label: 'Now',
      isCurrent: true,
    });
  }

  // Sort by date
  points.sort((a, b) => a.x - b.x);
  return points;
}

/**
 * Linear regression on the last N data points.
 * Returns { slope, intercept, projectedMileage, projectedDate }
 */
function calculateProjection(points, monthsOut = 12) {
  if (points.length < 2) return null;

  // Use all data points for regression (at least 2)
  const n = points.length;
  const xVals = points.map((_, i) => i);
  const yVals = points.map(p => p.y);

  const sumX = xVals.reduce((a, b) => a + b, 0);
  const sumY = yVals.reduce((a, b) => a + b, 0);
  const sumXY = xVals.reduce((a, _, i) => a + i * yVals[i], 0);
  const sumXX = xVals.reduce((a, _, i) => a + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Projected value at index n + monthsOut (using ~30.4 days per month from last point)
  const lastDate = points[points.length - 1].x;
  const projectedDate = new Date(lastDate);
  projectedDate.setMonth(projectedDate.getMonth() + monthsOut);

  // Calculate projected mileage at the projected date
  // The x-value for the last point is n-1. The x-value for projected date:
  const msPerStep = (lastDate - points[0].x) / (n - 1);
  const msToProjected = projectedDate - lastDate;
  const stepsToProjected = msPerStep > 0 ? msToProjected / msPerStep : monthsOut;
  const projectedIdx = (n - 1) + stepsToProjected;
  const projectedMileage = Math.round(slope * projectedIdx + intercept);

  return {
    slope,
    intercept,
    projectedMileage: Math.max(0, projectedMileage),
    projectedDate,
    monthlyPace: Math.round(slope * (msPerStep > 0 ? (30.4 * 24 * 60 * 60 * 1000) / msPerStep : 1)),
  };
}

/** Compute chart SVG coordinates */
function computeChartLayout(points, projection, width = 340, height = 180) {
  if (points.length === 0) return null;

  const padLeft = 42;
  const padRight = 20;
  const padTop = 10;
  const padBottom = 24;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Determine Y range
  const allY = points.map(p => p.y);
  if (projection) allY.push(projection.projectedMileage);
  const minY = 0;
  const maxY = Math.max(...allY) * 1.15;

  // Determine X range
  const minDate = points[0].x.getTime();
  const maxDate = projection
    ? Math.max(points[points.length - 1].x.getTime(), projection.projectedDate.getTime())
    : points[points.length - 1].x.getTime();

  const xRange = maxDate - minDate || 1;
  const yRange = maxY - minY || 1;

  const toX = (date) => padLeft + ((date.getTime() - minDate) / xRange) * chartW;
  const toY = (mileage) => padTop + chartH - ((mileage - minY) / yRange) * chartH;

  // Grid lines (Y-axis)
  const gridLines = [];
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const val = minY + (maxY / steps) * i;
    const y = toY(val);
    if (y >= padTop && y <= padTop + chartH) {
      gridLines.push({ y, label: `${Math.round(val / 1000)}k` });
    }
  }

  // Build SVG paths
  const solidPath = points.map((p, i) => {
    const x = toX(p.x);
    const y = toY(p.y);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

  // Area fill path
  const lastPt = points[points.length - 1];
  const areaPath = solidPath
    + ` L ${toX(lastPt.x).toFixed(1)} ${toY(0).toFixed(1)}`
    + ` L ${toX(points[0].x).toFixed(1)} ${toY(0).toFixed(1)} Z`;

  // Projection line
  let dashPath = '';
  let projectedDot = null;
  if (projection && points.length >= 2) {
    const lastX = toX(lastPt.x);
    const lastY = toY(lastPt.y);
    const projX = toX(projection.projectedDate);
    const projY = toY(projection.projectedMileage);
    dashPath = `M ${lastX.toFixed(1)} ${lastY.toFixed(1)} L ${projX.toFixed(1)} ${projY.toFixed(1)}`;
    projectedDot = { x: projX, y: projY };
  }

  // X-axis labels
  const xLabels = [];
  const xTickY = padTop + chartH + 12;
  if (points.length > 0) {
    const firstX = toX(points[0].x);
    xLabels.push({ x: firstX, label: formatMonthYear(points[0].x), isPurchase: true });
  }
  if (points.length > 1) {
    const lastX = toX(lastPt.x);
    xLabels.push({ x: lastX, label: 'Today', isNow: true });
  }
  if (projectedDot) {
    xLabels.push({ x: projectedDot.x, label: formatMonthYear(projection.projectedDate), isProjected: true });
  }

  // Mileage dots
  const dots = points.map(p => ({
    x: toX(p.x),
    y: toY(p.y),
    isPurchase: p.isPurchase,
    isCurrent: p.isCurrent,
    mileage: p.y,
    label: p.label,
  }));

  // Pace badge
  const paceText = projection?.monthlyPace != null
    ? `~${formatNumber(Math.abs(projection.monthlyPace))} mi/mo pace`
    : '';

  return {
    gridLines,
    solidPath,
    areaPath,
    dashPath,
    dots,
    projectedDot: projectedDot ? { ...projectedDot, mileage: projection.projectedMileage } : null,
    xLabels,
    paceText,
    chartW,
    chartH,
    padLeft,
    padTop,
    minY,
    maxY,
    viewBox: `0 0 ${width} ${height}`,
  };
}

export default function MileageTracker({ activeVehicle, vehicleLogs = [], isPremium = false, onNavigate }) {
  const dataPoints = useMemo(() => buildDataPoints(activeVehicle, vehicleLogs), [activeVehicle, vehicleLogs]);
  const projection = useMemo(() => {
    if (!isPremium || dataPoints.length < 2) return null;
    return calculateProjection(dataPoints);
  }, [dataPoints, isPremium]);

  const chartLayout = useMemo(() => {
    if (dataPoints.length === 0) return null;
    return computeChartLayout(dataPoints, projection);
  }, [dataPoints, projection]);

  const purchaseMileage = activeVehicle?.purchaseMileage ?? null;
  const currentMileage = activeVehicle?.mileage ?? 0;
  const drivenMileage = (purchaseMileage != null) ? Math.max(0, currentMileage - purchaseMileage) : null;
  const purchaseDate = activeVehicle?.purchaseDate || activeVehicle?.createdAt;
  const isHourVehicle = activeVehicle && ['ag-equipment', 'forklift', 'watercraft', 'outboard', 'marine-diesel'].includes(activeVehicle.type);
  const unit = isHourVehicle ? 'hrs' : 'mi';

  // Lease calculations
  const isLeased = activeVehicle?.isLeased;
  const leaseLimit = activeVehicle?.leaseMileageLimit;
  const leaseEndDate = activeVehicle?.leaseEndDate;
  const leaseWarning = isLeased && leaseLimit && leaseEndDate && projection
    ? {
        projected: projection.projectedMileage,
        limit: leaseLimit,
        endDate: leaseEndDate,
        isOver: projection.projectedMileage > leaseLimit,
        diff: Math.abs(projection.projectedMileage - leaseLimit),
        earlyMonths: projection.projectedMileage > leaseLimit
          ? Math.round((projection.projectedMileage - leaseLimit) / (projection.monthlyPace || 1))
          : 0,
      }
    : null;

  if (!activeVehicle) return null;

  // ── Chart SVG ──
  const renderChart = () => {
    if (!chartLayout || dataPoints.length < 2) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-slate-500">
          <Gauge className="w-8 h-8 mb-2 text-slate-600" />
          <p className="text-xs">Log services with mileage to build your trend</p>
        </div>
      );
    }

    return (
      <svg viewBox={chartLayout.viewBox} xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="mileageFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="mileageFillBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {chartLayout.gridLines.map((g, i) => (
          <g key={i}>
            <line x1={chartLayout.padLeft} y1={g.y} x2={chartLayout.padLeft + chartLayout.chartW} y2={g.y}
              stroke="#222233" strokeWidth="0.5" />
            <text x={chartLayout.padLeft - 8} y={g.y + 3} fill="#444" fontSize="8" textAnchor="end">{g.label}</text>
          </g>
        ))}

        {/* Area fill */}
        <path d={chartLayout.areaPath} fill="url(#mileageFill)" opacity="0.5" />

        {/* Solid trend line */}
        <path d={chartLayout.solidPath} stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Dashed projection line */}
        {chartLayout.dashPath && (
          <path d={chartLayout.dashPath} stroke="#ef4444" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" fill="none" opacity="0.5" />
        )}

        {/* Dots */}
        {chartLayout.dots.map((d, i) => (
          <g key={i}>
            {d.isPurchase ? (
              <>
                <circle cx={d.x} cy={d.y} r="5" fill="#3b82f6" />
                <text x={d.x} y={d.y + 14} fill="#3b82f6" fontSize="8" fontWeight="600" textAnchor="middle">Purchase</text>
                <text x={d.x} y={d.y + 22} fill="#555" fontSize="7" textAnchor="middle">{formatNumber(d.mileage)} {unit}</text>
              </>
            ) : d.isCurrent ? (
              <>
                <circle cx={d.x} cy={d.y} r="6" fill="#ef4444" stroke="#0f0f16" strokeWidth="2" />
                <text x={d.x} y={d.y - 8} fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="middle">Now</text>
              </>
            ) : null}
          </g>
        ))}

        {/* Projected ghost dot */}
        {chartLayout.projectedDot && (
          <g>
            <circle cx={chartLayout.projectedDot.x} cy={chartLayout.projectedDot.y} r="4"
              fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x={chartLayout.projectedDot.x} y={chartLayout.projectedDot.y - 8}
              fill="#ef4444" fontSize="8" fontWeight="600" textAnchor="middle" opacity="0.7">Projected</text>
            <text x={chartLayout.projectedDot.x} y={chartLayout.projectedDot.y + 14}
              fill="#555" fontSize="7" textAnchor="middle" opacity="0.6">{formatNumber(chartLayout.projectedDot.mileage)} {unit}</text>
          </g>
        )}

        {/* Pace badge */}
        {chartLayout.paceText && (
          <g>
            <rect x={(chartLayout.chartW / 2) + chartLayout.padLeft - 45} y={chartLayout.chartH * 0.35 + chartLayout.padTop}
              rx="4" ry="4" width="90" height="18" fill="#1a1a28" opacity="0.8" />
            <text x={(chartLayout.chartW / 2) + chartLayout.padLeft} y={chartLayout.chartH * 0.35 + chartLayout.padTop + 12}
              fill="#aaa" fontSize="8" textAnchor="middle">{chartLayout.paceText}</text>
          </g>
        )}

        {/* X-axis labels */}
        {chartLayout.xLabels.map((l, i) => (
          <text key={i} x={l.x} y={chartLayout.padTop + chartLayout.chartH + 18}
            fill={l.isNow ? "#fff" : l.isProjected ? "#555" : "#555"}
            fontSize={l.isNow ? "9" : "8"}
            fontWeight={l.isNow ? "700" : "400"}
            textAnchor="middle" opacity={l.isProjected ? 0.6 : 1}>
            {l.label}
          </text>
        ))}
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      {/* ════════════════════════════════════════
          YOUR MILEAGE STORY — narrative card
          ════════════════════════════════════════ */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#16161f] to-[#12121a] border border-white/5 overflow-hidden">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#b91c1c] via-[#ef4444] to-[#dc2626]" />

        <div className="p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-red-500 mb-4">
            📖 Your Mileage Story
          </div>

          <div className="text-sm sm:text-base leading-relaxed text-[#c0c0d0]">
            You bought this <span className="font-semibold text-white">{activeVehicle?.name || 'vehicle'}</span>
            {purchaseMileage != null ? (
              <> with <span className="font-bold text-white bg-red-900/20 px-1.5 py-0.5 rounded">{formatNumber(purchaseMileage)}</span> miles</>
            ) : ''}
            {purchaseDate ? (
              <> on <span className="text-[#8888a0] font-medium">{formatDate(purchaseDate)}</span>.</>
            ) : '.'}
            {' '}Today you're at <span className="font-bold text-white bg-red-900/20 px-1.5 py-0.5 rounded">{formatNumber(currentMileage)}</span> {unit}.
          </div>

          {/* Three big-number summary cards */}
          <div className="flex gap-3 mt-5">
            <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/5 p-4 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#666] mb-1">Purchased</div>
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {purchaseMileage != null ? formatNumber(purchaseMileage) : '—'}
                <span className="text-sm font-semibold text-[#666] ml-0.5">{unit}</span>
              </div>
              <div className="text-[11px] text-[#555] mt-0.5">{purchaseDate ? formatDateShort(purchaseDate) : ''}</div>
            </div>
            <div className="flex-1 rounded-xl bg-red-900/10 border border-red-900/20 p-4 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#666] mb-1">Current</div>
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-red-500">
                {formatNumber(currentMileage)}
                <span className="text-sm font-semibold text-[#666] ml-0.5">{unit}</span>
              </div>
              <div className="text-[11px] text-[#555] mt-0.5">Today</div>
            </div>
            <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/5 p-4 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#666] mb-1">So Far</div>
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                {drivenMileage != null ? formatNumber(drivenMileage) : '—'}
                <span className="text-sm font-semibold text-[#666] ml-0.5">{unit}</span>
              </div>
              <div className="text-[11px] text-[#555] mt-0.5">driven</div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          CHART
          ════════════════════════════════════════
          Premium users see the full chart
          Free users see story card + blurred empty chart + upgrade nudge */}
      <div className="relative rounded-2xl bg-white/[0.02] border border-white/5 p-4">
        <div className={`${isPremium ? '' : 'blur-sm pointer-events-none select-none opacity-40'}`}>
          <div className="h-[220px]">
            {renderChart()}
          </div>
        </div>

        {!isPremium && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px] rounded-2xl z-10">
            <Lock className="w-7 h-7 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-white mb-1">Mileage projections & charts</p>
            <p className="text-xs text-slate-400 mb-3">Upgrade for full mileage tracking with projections.</p>
            <button
              onClick={() => onNavigate?.('premium')}
              className="px-6 py-2.5 rounded-full bg-red-600 text-white text-sm font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-600/30"
            >
              Upgrade to Premium →
            </button>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════
          PROJECTED OUTCOME — Premium only
          ════════════════════════════════════════ */}
      {isPremium && projection && (
        <div className="rounded-xl bg-red-900/10 border border-red-900/20 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-900/20 flex items-center justify-center shrink-0 text-xl">
            🔮
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-red-500 mb-0.5">Projected</div>
            <div className="text-xl font-extrabold tracking-tight text-white">
              {formatNumber(projection.projectedMileage)} <span className="text-sm font-semibold text-[#666]">{unit}</span>
            </div>
            <div className="text-xs text-[#777] mt-0.5">
              by {formatMonthYear(projection.projectedDate)} • at your current pace
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          LEASE WARNING — only when leased
          ════════════════════════════════════════ */}
      {isLeased && leaseLimit && leaseEndDate && (
        <div className="flex items-center gap-2 rounded-xl bg-yellow-900/10 border border-yellow-900/20 p-3.5">
          <span className="text-lg shrink-0">📋</span>
          {projection ? (
            <span className="text-xs text-[#a0a0b0]">
              If this is a lease, you're on track to hit your{' '}
              <strong className="text-yellow-500 font-semibold">{formatNumber(leaseLimit)} {unit}</strong> limit
              by <strong className="text-yellow-500 font-semibold">{formatMonthYear(projection.projectedDate)}</strong>
              {leaseWarning.isOver
                ? <> — <span className="text-red-500 font-semibold">{formatNumber(leaseWarning.diff)} {unit} over.</span></>
                : <> with <span className="text-emerald-400 font-semibold">{formatNumber(leaseWarning.diff)} {unit}</span> to spare.</>
              }
            </span>
          ) : (
            <span className="text-xs text-[#a0a0b0]">
              Lease ends <strong className="text-yellow-500 font-semibold">{formatDate(leaseEndDate)}</strong>
              {' '}with a <strong className="text-yellow-500 font-semibold">{formatNumber(leaseLimit)} {unit}</strong> limit.
              Log services with mileage to see projection.
            </span>
          )}
        </div>
      )}
    </div>
  );
}