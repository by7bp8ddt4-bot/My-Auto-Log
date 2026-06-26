/**
 * Calculate reminder status based on current mileage and due mileage.
 * Returns { status, milesUntilDue, daysUntilDue, percentComplete }
 */
export function calculateReminderStatus(reminder, vehicleCurrentMileage, vehicleId) {
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
 * Format date for display
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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