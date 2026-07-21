/**
 * Mileage Prediction Utility
 *
 * Pure function that predicts future mileage using linear regression on fuel log data.
 * Shared by Dashboard (AI prediction card) and MileageTracker (chart projection).
 *
 * @param {Array}  fuelLogs  - Array of fuel log entries: { vehicleId, date, mileage, gallons, ... }
 * @param {Object} vehicle   - Vehicle object: { id, mileage, purchaseDate, purchaseMileage, ... }
 * @returns {Object|null}    - { predicted, weeklyAvg, confidence, dailyRate, rSquared, dataPoints }
 *                             or null if insufficient data
 */

/**
 * Days between two dates (fractional, UTC-safe).
 */
function daysBetween(a, b) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return ms / (1000 * 60 * 60 * 24);
}

/**
 * Parse a date string safely. Handles YYYY-MM-DD and ISO formats.
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  // Try YYYY-MM-DD format first (local timezone)
  const parts = String(dateStr).split('T')[0].split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export function predictMileage(fuelLogs, vehicle) {
  if (!vehicle || !vehicle.id) return null;
  if (!fuelLogs || fuelLogs.length === 0) return null;

  // Filter fuel logs for this vehicle, sort by date ascending
  const vehicleLogs = fuelLogs
    .filter(f => f.vehicleId === vehicle.id && f.date && f.mileage != null)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (vehicleLogs.length === 0) return null;

  // Build (days from origin, odometer) data points
  const points = [];

  // Prepend purchase point if available
  let originDate = null;
  if (vehicle.purchaseDate && vehicle.purchaseMileage != null) {
    const purchaseDate = parseDate(vehicle.purchaseDate);
    if (purchaseDate) {
      originDate = purchaseDate;
      points.push({ days: 0, odometer: Number(vehicle.purchaseMileage) });
    }
  }

  // Add fuel log points
  vehicleLogs.forEach(log => {
    const logDate = parseDate(log.date);
    if (!logDate) return;
    if (!originDate) originDate = logDate;

    const days = daysBetween(originDate, logDate);
    if (days < 0) return; // skip logs before origin

    // Deduplicate by rounded day — keep highest odometer
    const dayKey = Math.round(days);
    const existing = points.find(p => Math.round(p.days) === dayKey && !p.isCurrent);
    if (existing) {
      existing.odometer = Math.max(existing.odometer, Number(log.mileage));
    } else {
      points.push({ days: Math.max(0, days), odometer: Number(log.mileage) });
    }
  });

  // Append current state
  const today = new Date();
  if (vehicle.mileage != null && vehicle.mileage > 0) {
    if (!originDate) originDate = today;
    const days = Math.max(0, daysBetween(originDate, today));
    const dayKey = Math.round(days);
    const existing = points.find(p => Math.round(p.days) === dayKey && !p.isPurchase);
    if (existing) {
      existing.odometer = Math.max(existing.odometer, Number(vehicle.mileage));
    } else {
      points.push({ days, odometer: Number(vehicle.mileage), isCurrent: true });
    }
  }

  // Sort by days
  points.sort((a, b) => a.days - b.days);

  // Need at least 2 points for regression
  if (points.length < 2) return null;

  const n = points.length;

  // Linear regression: odometer = slope * days + intercept
  const sumX = points.reduce((s, p) => s + p.days, 0);
  const sumY = points.reduce((s, p) => s + p.odometer, 0);
  const sumXY = points.reduce((s, p) => s + p.days * p.odometer, 0);
  const sumXX = points.reduce((s, p) => s + p.days * p.days, 0);

  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) return null;

  const slope = (n * sumXY - sumX * sumY) / denominator; // daily rate (miles per day)
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R²
  const meanY = sumY / n;
  const ssRes = points.reduce((s, p) => {
    const predicted = slope * p.days + intercept;
    return s + (p.odometer - predicted) ** 2;
  }, 0);
  const ssTot = points.reduce((s, p) => s + (p.odometer - meanY) ** 2, 0);
  const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;

  // Clamp slope to 0 (negative mileage doesn't make sense)
  const effectiveSlope = Math.max(0, slope);
  const hasNegativeSlope = slope < 0;

  // Compute confidence score (0-100)
  let confidence;
  if (n === 2) {
    // Bare minimum: cap at 45
    confidence = Math.round(Math.min(rSquared * 100, 45));
  } else if (n < 4) {
    // Few points: deduct confidence
    confidence = Math.round(Math.min(rSquared * 100, 70));
  } else if (n < 6) {
    confidence = Math.round(Math.min(rSquared * 100, 85));
  } else {
    confidence = Math.round(Math.min(rSquared * 100, 98));
  }

  // Further deduction for negative slope
  if (hasNegativeSlope) {
    confidence = Math.max(5, confidence - 30);
  }

  // Deduction if no purchase point (less reliable baseline)
  if (!vehicle.purchaseDate || vehicle.purchaseMileage == null) {
    confidence = Math.max(5, confidence - 10);
  }

  // Weekly average
  const weeklyAvg = Math.round(effectiveSlope * 7);

  // Predicted mileage 1 year from today
  const daysToProject = 365;
  const lastOdometer = points[points.length - 1].odometer;
  const predicted = Math.round(lastOdometer + effectiveSlope * daysToProject);

  return {
    predicted,
    weeklyAvg,
    confidence,
    dailyRate: Math.round(effectiveSlope * 10) / 10,
    rSquared: Math.round(rSquared * 1000) / 1000,
    dataPoints: points,
    hasNegativeSlope,
  };
}
