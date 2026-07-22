import { useMemo } from 'react';
import { getScheduleForVehicle } from '../data/maintenance-schedules';
import { enrichScheduleWithVinData } from '../utils/scheduleEnrichment';

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
export function isSameService(scheduleName, logServiceType) {
  const a = scheduleName.toLowerCase().trim();
  const b = logServiceType.toLowerCase().trim();
  
  // Exact match
  if (a === b) return true;
  
  // One contains the other at word boundaries
  if (a.includes(b) || b.includes(a)) return true;
  
  // Simple singularization: strip trailing 's' for word normalization
  // e.g. "plugs" → "plug", "tires" → "tire"
  const normalize = w => w.replace(/s$/, '');
  
  // Word overlap: check if significant words from one appear in the other
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', '&', '-', '/', 'of', 'for', 'in', 'on']);
  const wordsA = a.split(/[\s,&\-()\/]+/).filter(w => w.length > 1 && !stopWords.has(w)).map(normalize);
  const wordsB = b.split(/[\s,&\-()\/]+/).filter(w => w.length > 1 && !stopWords.has(w)).map(normalize);
  
  // Check word overlap between the two lists
  const shorter = wordsA.length <= wordsB.length ? wordsA : wordsB;
  const longer = wordsA.length > wordsB.length ? wordsA : wordsB;
  
  if (shorter.length === 0) return false;
  const matchCount = shorter.filter(w => longer.includes(w)).length;
  const threshold = Math.ceil(shorter.length / 2);
  
  if (matchCount >= threshold) {
    // If only 1 word matched in a multi-word shorter list,
    // reject if it's just the last/generic word (e.g., "flush", "service")
    // This prevents "Brake Fluid Flush" vs "Coolant Flush" matching on "flush" alone
    if (matchCount === 1 && shorter.length >= 2) {
      const matchedWord = shorter.find(w => longer.includes(w));
      if (matchedWord === shorter[shorter.length - 1]) return false;
    }
    return true;
  }
  return false;
}

/**
 * Get all service types from a log entry.
 * Handles both old single-type (serviceType string) and new multi-type (serviceTypes array).
 */
export function getLogServiceTypes(log) {
  if (Array.isArray(log.serviceTypes) && log.serviceTypes.length > 0) return log.serviceTypes;
  if (log.serviceType) return [log.serviceType];
  return ['Other'];
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

    const baseSchedule = getScheduleForVehicle(vehicle.make, vehicle.model);
    const vehicleLogs = logs.filter(log => log.vehicleId === vehicle.id);

    // Build a dynamic schedule enriched by VIN-decoded drivetrain data
    const vinData = vehicle.vinDecoded;
    const schedule = enrichScheduleWithVinData([...baseSchedule], vinData);

    return schedule.map(item => {
      // Find the last time this specific service was performed
      // We look for logs that contain the service name in their serviceType, serviceTypes, or description
      const lastService = vehicleLogs
        .filter(log => {
          const serviceTypes = getLogServiceTypes(log);
          const match = serviceTypes.some(type => {
            return isSameService(item.service, type);
          }) || log.description?.toLowerCase().includes(item.service.toLowerCase());
          return match;
        })
        .sort((a, b) => (b.mileage || 0) - (a.mileage || 0))[0];

      const lastMileage = lastService ? lastService.mileage : 0;
      const lastDate = lastService ? parseLocalDate(lastService.date) : parseLocalDate(vehicle.createdAt);
      
      const dueMileage = lastMileage + item.intervalMiles;
      const dueDate = new Date(lastDate.getTime() + (item.intervalMonths * 30 * 24 * 60 * 60 * 1000));
      
      const milesUntilDue = dueMileage - vehicle.mileage;
      const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      
      // Calculate progress percentage
      const mileageProgress = ((vehicle.mileage - lastMileage) / item.intervalMiles) * 100;
      const timeProgress = ((Date.now() - lastDate.getTime()) / (dueDate.getTime() - lastDate.getTime())) * 100;
      const percentComplete = Math.min(100, Math.max(0, Math.max(mileageProgress, timeProgress)));
      const percentRemaining = 100 - percentComplete;

      let status = 'upcoming';
      if (milesUntilDue <= 0 || daysUntilDue <= 0) {
        status = 'overdue';
      } else if (daysUntilDue <= 30) {
        status = 'critical';
      } else if (daysUntilDue <= 90) {
        status = 'due-soon';
      } else if (percentComplete < 50 && lastMileage > 0) {
        // Only show 'good' if a service has actually been logged before
        status = 'good';
      }

      return {
        ...item,
        lastMileage,
        lastDate: lastService ? lastService.date : null,
        dueMileage,
        dueDate: dueDate.toISOString(),
        milesUntilDue,
        daysUntilDue,
        status,
        percentComplete,
        percentRemaining
      };
    }).sort((a, b) => {
      // Sort by urgency: overdue first, then due-soon, then upcoming, then good
      const order = { overdue: 0, critical: 1, 'due-soon': 2, upcoming: 3, good: 4 };
      if (order[a.status] !== order[b.status]) {
        return order[a.status] - order[b.status];
      }
      return a.milesUntilDue - b.milesUntilDue;
    });
  }, [vehicle, logs]);
}
