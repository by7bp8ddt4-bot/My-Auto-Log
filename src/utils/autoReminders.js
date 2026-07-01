/**
 * Auto-Reminder Generator — creates manufacturer-scheduled reminders from a vehicle's VIN decode.
 *
 * When a user adds a vehicle with a decoded VIN, this looks up the manufacturer's
 * maintenance schedule and creates a reminder for each service item.
 */

import { getScheduleForVehicle, isEV } from '../data/maintenance-schedules';
import { generateId } from './helpers';

/**
 * Check if a reminder already exists for a given service title + vehicle.
 * Prevents duplicate auto-creation.
 */
function hasExistingReminder(reminders, vehicleId, serviceTitle) {
  return reminders.some(
    r => r.vehicleId === vehicleId && 
    r.title?.toLowerCase().trim() === serviceTitle.toLowerCase().trim()
  );
}

/**
 * Known service types that don't apply to electric vehicles.
 */
const EV_EXCLUDED_SERVICES = [
  'oil', 'filter change', 'spark plug', 'transmission fluid',
  'transmission service', 'differential fluid', 'coolant exchange',
  'coolant flush', 'timing belt', 'drive belt', 'serpentine belt',
  'fuel filter', 'exhaust',
];

/**
 * Check if a service name is EV-irrelevant.
 */
function isEvIrrelevant(serviceName) {
  const name = serviceName.toLowerCase();
  return EV_EXCLUDED_SERVICES.some(excluded => name.includes(excluded));
}

/**
 * Generate auto-reminders for a vehicle based on its manufacturer schedule.
 *
 * @param {Object} vehicle - The vehicle object (must have make, model, id, mileage)
 * @param {Array} existingReminders - Current reminders array (to check for duplicates)
 * @returns {Array} Array of reminder objects ready to be added
 */
export function generateAutoReminders(vehicle, existingReminders = []) {
  if (!vehicle?.make || !vehicle?.id) return [];

  const make = vehicle.make;
  const model = vehicle.model || '';
  const isElectric = isEV(make, model);
  
  // Get the manufacturer schedule for this specific vehicle
  const schedule = getScheduleForVehicle(make, model);
  
  if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
    return []; // No schedule found for this vehicle
  }

  const currentMileage = vehicle.mileage || 0;
  const newReminders = [];

  for (const item of schedule) {
    // Skip EV-irrelevant services for electric vehicles
    if (isElectric && isEvIrrelevant(item.service)) {
      continue;
    }

    // Skip if a reminder for this service already exists
    if (hasExistingReminder(existingReminders, vehicle.id, item.service)) {
      continue;
    }

    // Convert intervalMonths to intervalDays (30-day months)
    const intervalDays = (item.intervalMonths || 6) * 30;
    const intervalMiles = item.intervalMiles || 5000;

    // Calculate due mileage: first service at manufacturer-recommended interval
    const dueMileage = intervalMiles;
    
    // Calculate due date: first service at the interval from now
    const dueDate = new Date(Date.now() + intervalDays * 86400000);

    newReminders.push({
      id: generateId(),
      vehicleId: vehicle.id,
      title: item.service,
      description: item.description || `${item.service} — recommended by ${make} every ${intervalMiles?.toLocaleString() || '?'} miles / ${item.intervalMonths || '?'} months`,
      intervalMiles,
      intervalDays,
      lastCompletedMileage: 0,
      lastCompletedDate: '',
      dueMileage,
      dueDate: dueDate.toISOString(),
      enabled: true,
      autoCreated: true, // Flag so we can identify auto-created reminders
      severity: item.severity || 'medium',
    });
  }

  return newReminders;
}

/**
 * Generate a human-readable summary of what reminders were created.
 */
export function summarizeAutoReminders(reminders) {
  if (reminders.length === 0) return 'No auto-reminders generated.';
  const groups = { high: [], medium: [], low: [] };
  reminders.forEach(r => {
    groups[r.severity || 'medium']?.push(r.title);
  });
  const parts = [];
  if (groups.high.length) parts.push(`${groups.high.length} critical`);
  if (groups.medium.length) parts.push(`${groups.medium.length} standard`);
  if (groups.low.length) parts.push(`${groups.low.length} routine`);
  return `Created ${reminders.length} reminders: ${parts.join(', ')}`;
}
