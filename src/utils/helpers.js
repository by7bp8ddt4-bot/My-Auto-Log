/**
 * Calculate reminder status based on current mileage and due mileage.
 * Returns { status, milesUntilDue, daysUntilDue, percentComplete }
 */
export function calculateReminderStatus(reminder, vehicleCurrentMileage) {
  const dueMileage = reminder.dueMileage || reminder.lastCompletedMileage + reminder.intervalMiles;
  const dueDate = reminder.dueDate
    ? new Date(reminder.dueDate)
    : new Date(Date.now() + reminder.intervalDays * 86400000);

  const milesUntilDue = dueMileage - vehicleCurrentMileage;
  const daysUntilDue = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
  const percentComplete = reminder.intervalMiles > 0
    ? Math.min(100, Math.max(0, ((vehicleCurrentMileage - (dueMileage - reminder.intervalMiles)) / reminder.intervalMiles) * 100))
    : 0;

  let status;
  if (vehicleCurrentMileage >= dueMileage || new Date() >= dueDate) {
    status = 'overdue';
  } else if (milesUntilDue <= reminder.intervalMiles * 0.1 || daysUntilDue <= Math.ceil(reminder.intervalDays * 0.1)) {
    status = 'due-soon';
  } else {
    status = 'ok';
  }

  return { status, milesUntilDue, daysUntilDue, percentComplete };
}

/**
 * Generate a unique ID
 */
export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format date for display — timezone-safe
 * Parses YYYY-MM-DD as local time to avoid UTC-to-local shift.
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  // Parse YYYY-MM-DD as local date to avoid UTC timezone shift
  const parts = dateStr.split('T')[0].split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  // Fallback for other formats
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format currency
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
}

/**
 * Format number with commas
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num || 0);
}

/**
 * Get today's date as YYYY-MM-DD in LOCAL timezone (not UTC).
 * Use this for date input defaults to avoid timezone off-by-one.
 */
export function getLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
