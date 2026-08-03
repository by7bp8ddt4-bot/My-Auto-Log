import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { TrendingUp, Gauge, Lock, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
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

function formatDayMonth(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
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
    isLog: p.isLog,
    mileage: p.y,
    label: p.label,
    logDate: p.isLog ? formatDayMonth(p.x) : null,
  }));

  // ── Collision detection for log dots ──
  const CLUSTER_THRESHOLD = 25; // px — dots closer than this form an overlap group
  const TIGHT_THRESHOLD = 15;   // px — 3+ dots within this are a "tight" cluster

  const logIndices = [];
  dots.forEach((d, i) => { if (d.isLog) logIndices.push(i); });

  const clusters = [];
  let currentCluster = [];
  for (let i = 0; i < logIndices.length; i++) {
    const idx = logIndices[i];
    if (currentCluster.length === 0) {
      currentCluster = [idx];
    } else {
      const prevIdx = currentCluster[currentCluster.length - 1];
      if (dots[idx].x - dots[prevIdx].x < CLUSTER_THRESHOLD) {
        currentCluster.push(idx);
      } else {
        if (currentCluster.length > 1) clusters.push(currentCluster);
        else clusters.push([currentCluster[0]]);
        currentCluster = [idx];
      }
    }
  }
  if (currentCluster.length > 0) clusters.push(currentCluster);

  for (const cluster of clusters) {
    const isTight = cluster.length >= 3 && (() => {
      for (let j = 1; j < cluster.length; j++) {
        if (dots[cluster[j]].x - dots[cluster[j - 1]].x >= TIGHT_THRESHOLD) return false;
      }
      return true;
    })();

    for (let j = 0; j < cluster.length; j++) {
      const dotIdx = cluster[j];
      const dot = dots[dotIdx];
      dot._clusterSize = cluster.length;
      dot._staggerIndex = j;
      if (cluster.length === 1) {
        dot._clusterPosition = 'solo';
        dot._showBadge = false;
      } else if (isTight && j > 0 && j < cluster.length - 1) {
        dot._clusterPosition = 'middle-tight';
        dot._showBadge = false;
      } else if (j === cluster.length - 1) {
        dot._clusterPosition = 'last';
        dot._showBadge = isTight;
        dot._badgeCount = cluster.length - 1;
      } else if (j === 0) {
        dot._clusterPosition = 'first';
        dot._showBadge = false;
      } else {
        dot._clusterPosition = 'middle';
        dot._showBadge = false;
      }
    }
  }

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

  // ── Zoom / Pan state ──
  const [viewBox, setViewBox] = useState(null); // null = auto-fit
  const [isPanning, setIsPanning] = useState(false);
  const svgRef = useRef(null);
  const panStartRef = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);

  // Parse the chartLayout viewBox string into an object we can manipulate
  const originalViewBox = useMemo(() => {
    if (!chartLayout) return { x: 0, y: 0, w: 340, h: 180 };
    const parts = chartLayout.viewBox.split(' ').map(Number);
    return { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
  }, [chartLayout]);

  // Reset zoom whenever the chart data changes
  useEffect(() => {
    setViewBox(null);
  }, [chartLayout]);

  // Stable refs so the wheel listener always sees current values
  const viewBoxRef = useRef(viewBox);
  viewBoxRef.current = viewBox;
  const originalViewBoxRef = useRef(originalViewBox);
  originalViewBoxRef.current = originalViewBox;

  // Compute the effective viewBox string for the SVG
  const effectiveViewBox = viewBox || originalViewBox;
  const viewBoxStr = `${effectiveViewBox.x} ${effectiveViewBox.y} ${effectiveViewBox.w} ${effectiveViewBox.h}`;
  const isZoomed = viewBox !== null;

  // ── Zoom handlers ──
  const zoom = useCallback((factor) => {
    setViewBox(prev => {
      const vb = prev || originalViewBoxRef.current;
      const newW = vb.w * factor;
      const newH = vb.h * factor;
      const newX = vb.x + (vb.w - newW) / 2;
      const newY = vb.y + (vb.h - newH) / 2;
      return { x: newX, y: newY, w: newW, h: newH };
    });
  }, []);

  const handleZoomIn = useCallback(() => zoom(0.7), [zoom]);

  const handleZoomOut = useCallback(() => {
    setViewBox(prev => {
      if (!prev) return prev; // already at max extent
      const factor = 1 / 0.7;
      const newW = prev.w * factor;
      const newH = prev.h * factor;
      const ob = originalViewBoxRef.current;
      // Clamp to original viewBox — if we'd exceed it, reset to null
      if (newW >= ob.w && newH >= ob.h) return null;
      const newX = prev.x - (newW - prev.w) / 2;
      const newY = prev.y - (newH - prev.h) / 2;
      return { x: newX, y: newY, w: newW, h: newH };
    });
  }, []);

  const handleReset = useCallback(() => setViewBox(null), []);

  // ── Wheel zoom (non-passive listener on the SVG element) ──
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const onWheel = (e) => {
      e.preventDefault();
      const vb = viewBoxRef.current || originalViewBoxRef.current;
      const ob = originalViewBoxRef.current;
      const rect = svg.getBoundingClientRect();

      // Mouse position relative to SVG element
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Convert to SVG coordinate space
      const svgX = vb.x + (mouseX / rect.width) * vb.w;
      const svgY = vb.y + (mouseY / rect.height) * vb.h;

      const zoomFactor = e.deltaY < 0 ? 0.7 : 1 / 0.7;
      const newW = vb.w * zoomFactor;
      const newH = vb.h * zoomFactor;

      // Clamp zoom-out: don't let viewBox exceed original
      if (zoomFactor > 1 && newW >= ob.w && newH >= ob.h) {
        setViewBox(null);
        return;
      }

      // Calculate new origin so the point under the cursor stays fixed
      const newX = svgX - (mouseX / rect.width) * newW;
      const newY = svgY - (mouseY / rect.height) * newH;

      setViewBox({ x: newX, y: newY, w: newW, h: newH });
    };

    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [chartLayout]);

  // ── Pan handlers (mouse + touch) ──
  const handlePanStart = useCallback((e) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    panStartRef.current = { x: clientX, y: clientY };
    isPanningRef.current = true;
    setIsPanning(true);
  }, []);

  // Pan-move attached to window so dragging outside the SVG still works
  useEffect(() => {
    if (!isPanning) return;

    const onMove = (e) => {
      if (!isPanningRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const dx = clientX - panStartRef.current.x;
      const dy = clientY - panStartRef.current.y;
      panStartRef.current = { x: clientX, y: clientY };

      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();

      setViewBox(prev => {
        const vb = prev || originalViewBoxRef.current;
        const scaleX = vb.w / rect.width;
        const scaleY = vb.h / rect.height;
        return {
          x: vb.x - dx * scaleX,
          y: vb.y - dy * scaleY,
          w: vb.w,
          h: vb.h,
        };
      });
    };

    const onEnd = () => {
      isPanningRef.current = false;
      setIsPanning(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isPanning]);

  // ── Business logic (unchanged) ──
  const purchaseMileage = activeVehicle?.purchaseMileage ?? null;
  const currentMileage = activeVehicle?.mileage ?? 0;
  const drivenMileage = (purchaseMileage != null) ? Math.max(0, currentMileage - purchaseMileage) : null;
  const purchaseDate = activeVehicle?.purchaseDate || activeVehicle?.createdAt;
  const isHourVehicle = activeVehicle && ['ag-equipment', 'forklift', 'watercraft', 'outboard', 'marine-diesel'].includes(activeVehicle.type);
  const unit = isHourVehicle ? 'hrs' : 'mi';

  // Average monthly mileage: drivenMileage ÷ months since purchase (or first log)
  const avgMonthlyMileage = useMemo(() => {
    if (drivenMileage == null || drivenMileage === 0) return null;
    let startDate = purchaseDate;
    if (!startDate && vehicleLogs?.length > 0) {
      // Fall back to earliest log date
      const sorted = [...vehicleLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
      startDate = sorted[0]?.date;
    }
    if (!startDate) return null;
    const msPerMonth = 30.44 * 24 * 60 * 60 * 1000;
    const months = (Date.now() - new Date(startDate).getTime()) / msPerMonth;
    if (months < 0.5) return null; // too recent to be meaningful
    return Math.round(drivenMileage / months);
  }, [drivenMileage, purchaseDate, vehicleLogs]);

  const avgYearlyMileage = useMemo(() => {
    return avgMonthlyMileage != null ? avgMonthlyMileage * 12 : null;
  }, [avgMonthlyMileage]);

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
      <svg
        ref={svgRef}
        viewBox={viewBoxStr}
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full select-none ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handlePanStart}
        onTouchStart={handlePanStart}
      >
        <defs>
          <linearGradient id="mileageFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
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
        <path d={chartLayout.solidPath} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Dashed projection line */}
        {chartLayout.dashPath && (
          <path d={chartLayout.dashPath} stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" fill="none" opacity="0.5" />
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
                <circle cx={d.x} cy={d.y} r="6" fill="#3b82f6" stroke="#0f0f16" strokeWidth="2" />
                <text x={d.x} y={d.y - 8} fill="#3b82f6" fontSize="9" fontWeight="700" textAnchor="middle">Now</text>
              </>
            ) : d.isLog ? (() => {
                const isTightMiddle = d._clusterPosition === 'middle-tight';
                const stagger = d._staggerIndex || 0;
                const above = stagger % 2 === 0;
                // Mileage label: above for even stagger, below for odd
                const mileageY = above ? d.y - 8 : d.y + 14;
                // Date label: mirrored — if mileage above, date below; if mileage below, date above
                const dateY = above ? d.y + 14 : d.y - 8;
                return (
                  <>
                    <title>{d.label}: {formatNumber(d.mileage)} {unit}</title>
                    <circle cx={d.x} cy={d.y} r="4" fill="#3b82f6" opacity="0.9" />
                    {!isTightMiddle && (
                      <>
                        <text x={d.x} y={mileageY} fill="#3b82f6" fontSize="7" textAnchor="middle">{formatNumber(d.mileage)}</text>
                        <text x={d.x} y={dateY} fill="#555" fontSize="7" textAnchor="middle">{d.logDate}</text>
                      </>
                    )}
                    {d._showBadge && (
                      <g>
                        <rect x={d.x + 6} y={d.y - 12} width="14" height="10" rx="5" fill="#3b82f6" opacity="0.85" />
                        <text x={d.x + 13} y={d.y - 4} fill="#fff" fontSize="6" fontWeight="700" textAnchor="middle">+{d._badgeCount}</text>
                      </g>
                    )}
                  </>
                );
              })() : null}
          </g>
        ))}

        {/* Projected ghost dot */}
        {chartLayout.projectedDot && (
          <g>
            <circle cx={chartLayout.projectedDot.x} cy={chartLayout.projectedDot.y} r="4"
              fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x={chartLayout.projectedDot.x} y={chartLayout.projectedDot.y - 8}
              fill="#3b82f6" fontSize="8" fontWeight="600" textAnchor="middle" opacity="0.7">Projected</text>
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

  const showZoomControls = isPremium && chartLayout && dataPoints.length >= 2;

  return (
    <div className="space-y-4">
      {/* ════════════════════════════════════════
          CHART
          ════════════════════════════════════════
          Premium users see the full chart
          Free users see blurred empty chart + upgrade nudge */}
      <div className="relative rounded-2xl bg-white/[0.02] border border-white/5 p-4">
        <div className={`${isPremium ? '' : 'blur-sm pointer-events-none select-none opacity-40'}`}>
          <div className="relative h-[220px]">
            {renderChart()}

            {/* Zoom controls — top-right corner of chart area */}
            {showZoomControls && (
              <div className="absolute top-1 right-1 flex gap-0.5 z-10">
                <button
                  onClick={handleZoomIn}
                  className="p-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-colors"
                  title="Zoom in"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-colors"
                  title="Zoom out"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                {isZoomed && (
                  <button
                    onClick={handleReset}
                    className="p-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-white transition-colors"
                    title="Reset zoom"
                    aria-label="Reset zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {!isPremium && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px] rounded-2xl z-10">
            <Lock className="w-7 h-7 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-white mb-1">Mileage projections & charts</p>
            <p className="text-xs text-slate-400 mb-3">Upgrade for full mileage tracking with projections.</p>
            <button
              onClick={() => onNavigate?.('premium')}
              className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30"
            >
              Upgrade to Premium →
            </button>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════
          YOUR MILEAGE STORY — narrative card
          ════════════════════════════════════════ */}
      <div className="rounded-xl bg-blue-900/10 border border-blue-900/20 p-4">
        <div className="text-[10px] font-medium uppercase tracking-wider text-blue-400 mb-2">
          📖 Mileage Story
        </div>

        <div className="text-xs sm:text-sm leading-relaxed text-slate-400">
          You bought this <span className="font-semibold text-white">{activeVehicle?.name || 'vehicle'}</span>
          {purchaseMileage != null ? (
            <> with <span className="font-bold text-white bg-blue-900/20 px-1.5 py-0.5 rounded">{formatNumber(purchaseMileage)}</span> miles</>
          ) : ''}
          {purchaseDate ? (
            <> on <span className="text-slate-500 font-medium">{formatDate(purchaseDate)}</span>.</>
          ) : '.'}
          {' '}Today you're at <span className="font-bold text-white bg-blue-900/20 px-1.5 py-0.5 rounded">{formatNumber(currentMileage)}</span> {unit}.
        </div>

        {/* Three big-number summary cards */}
        <div className="flex gap-2 mt-3">
          <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/5 p-2 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Purchased</div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-white">
              {purchaseMileage != null ? formatNumber(purchaseMileage) : '—'}
              <span className="text-sm font-semibold text-slate-400 ml-0.5">{unit}</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0">{purchaseDate ? formatDateShort(purchaseDate) : ''}</div>
          </div>
          <div className="flex-1 rounded-xl bg-blue-900/10 border border-blue-900/20 p-2 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Current</div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-blue-400">
              {formatNumber(currentMileage)}
              <span className="text-sm font-semibold text-slate-400 ml-0.5">{unit}</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0">Today</div>
          </div>
          <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/5 p-2 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">So Far</div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-white">
              {drivenMileage != null ? formatNumber(drivenMileage) : '—'}
              <span className="text-sm font-semibold text-slate-400 ml-0.5">{unit}</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0">driven</div>
          </div>
          <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/5 p-2 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Avg. Monthly</div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-white">
              {avgMonthlyMileage != null ? formatNumber(avgMonthlyMileage) : '—'}
              <span className="text-sm font-semibold text-slate-400 ml-0.5">{unit}</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0">{avgMonthlyMileage != null ? 'per month' : ''}</div>
          </div>
          <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/5 p-2 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Avg. Yearly</div>
            <div className="text-base sm:text-lg font-bold tracking-tight text-white">
              {avgYearlyMileage != null ? formatNumber(avgYearlyMileage) : '—'}
              <span className="text-sm font-semibold text-slate-400 ml-0.5">{unit}</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0">{avgYearlyMileage != null ? 'per year' : ''}</div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          PROJECTED OUTCOME — Premium only
          ════════════════════════════════════════ */}
      {isPremium && projection && (
        <div className="rounded-xl bg-blue-900/10 border border-blue-900/20 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-900/20 flex items-center justify-center shrink-0 text-xl">
            🔮
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 mb-0.5">Projected</div>
            <div className="text-lg sm:text-xl font-bold tracking-tight text-white">
              {formatNumber(projection.projectedMileage)} <span className="text-sm font-semibold text-[#666]">{unit}</span>
            </div>
            <div className="text-xs text-[#777] mt-0.5">
              by {formatMonthYear(projection.projectedDate)} • at your current pace
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
