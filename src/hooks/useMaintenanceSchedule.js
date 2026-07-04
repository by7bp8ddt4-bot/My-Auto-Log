import { useMemo } from 'react';
import { getScheduleForVehicle } from '../data/maintenance-schedules';

/**
 * Parse a date string (YYYY-MM-DD) as local time to avoid UTC shift.
 */
function parseLocalDate(dateStr) {
  if (!dateStr) return new Date();
  const parts = dateStr.split('T')[0].split('-').map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date(dateStr);
}

/**
 * Check if two service names refer to the same service.
 * Uses word-level matching to handle "Oil Change" vs "Oil & Filter Change".
 */
function isSameService(scheduleName, logServiceType) {
  const a = scheduleName.toLowerCase().trim();
  const b = logServiceType.toLowerCase().trim();
  
  // Exact match
  if (a === b) return true;
  
  // One contains the other at word boundaries
  if (a.includes(b) || b.includes(a)) return true;
  
  // Word overlap: check if all significant words from one appear in the other
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', '&', '-', '/', 'of', 'for', 'in', 'on']);
  const wordsA = a.split(/[\s,&\-/]+/).filter(w => w.length > 1 && !stopWords.has(w));
  const wordsB = b.split(/[\s,&\-/]+/).filter(w => w.length > 1 && !stopWords.has(w));
  
  // Check if all words in the shorter list appear in the longer list
  const shorter = wordsA.length <= wordsB.length ? wordsA : wordsB;
  const longer = wordsA.length > wordsB.length ? wordsA : wordsB;
  
  if (shorter.length === 0) return false;
  const matchCount = shorter.filter(w => longer.includes(w)).length;
  
  // At least 50% of shorter words must match (or at least 1 if only 1 word)
  return matchCount >= Math.ceil(shorter.length / 2);
}

/**
 * Hook to compute a manufacturer maintenance schedule for a vehicle
 * based on its mileage and service history.
 * 
 * @param {Object} vehicle The vehicle object (make, model, year, mileage)
 * @param {Array} logs All maintenance logs for this vehicle
 */
export function useMaintenanceSchedule(vehicle, logs = []) {
  return useMemo(() => {
    if (!vehicle) return [];

    const schedule = getScheduleForVehicle(vehicle.make, vehicle.model);
    const vehicleLogs = logs.filter(log => log.vehicleId === vehicle.id);

    return schedule.map(item => {
      // Find the last time this specific service was performed
      // We look for logs that contain the service name in their serviceType or description
      const lastService = vehicleLogs
        .filter(log => 
          isSameService(item.service, log.serviceType) ||
          log.description?.toLowerCase().includes(item.service.toLowerCase())
        )
        .sort((a, b) => (b.mileage || 0) - (a.mileage || 0))[0];

      const lastMileage = lastService ? lastService.mileage : 0;
      const lastDate = lastService ? parseLocalDate(lastService.date) : parseLocalDate(vehicle.createdAt);
      
      const dueMileage = lastMileage + item.intervalMiles;
      const dueDate = new Date(lastDate.getTime() + (item.intervalMonths * 30 * 24 * 60 * 60 * 1000));
      
      const milesUntilDue = dueMileage - vehicle.mileage;
      const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      
      let status = 'upcoming';
      if (milesUntilDue <= 0 || daysUntilDue <= 0) {
        status = 'overdue';
      } else if (daysUntilDue <= 30) {
        status = 'critical';
      } else if (daysUntilDue <= 90) {
        status = 'due-soon';
      }

      // Calculate progress percentage
      const mileageProgress = ((vehicle.mileage - lastMileage) / item.intervalMiles) * 100;
      const timeProgress = ((Date.now() - lastDate.getTime()) / (dueDate.getTime() - lastDate.getTime())) * 100;
      const percentComplete = Math.min(100, Math.max(0, Math.max(mileageProgress, timeProgress)));

      return {
        ...item,
        lastMileage,
        lastDate: lastService ? lastService.date : null,
        dueMileage,
        dueDate: dueDate.toISOString(),
        milesUntilDue,
        daysUntilDue,
        status,
        percentComplete
      };
    }).sort((a, b) => {
      // Sort by urgency: overdue first, then due-soon, then upcoming
      const order = { overdue: 0, critical: 1, 'due-soon': 2, upcoming: 3 };
      if (order[a.status] !== order[b.status]) {
        return order[a.status] - order[b.status];
      }
      return a.milesUntilDue - b.milesUntilDue;
    });
  }, [vehicle, logs]);
}
