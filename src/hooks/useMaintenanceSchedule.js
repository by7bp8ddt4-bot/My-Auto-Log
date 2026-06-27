import { useMemo } from 'react';
import { getScheduleForVehicle } from '../data/maintenance-schedules';

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
          log.serviceType?.toLowerCase().includes(item.service.toLowerCase()) || 
          item.service.toLowerCase().includes(log.serviceType?.toLowerCase()) ||
          log.description?.toLowerCase().includes(item.service.toLowerCase())
        )
        .sort((a, b) => (b.mileage || 0) - (a.mileage || 0))[0];

      const lastMileage = lastService ? lastService.mileage : 0;
      const lastDate = lastService ? new Date(lastService.date) : new Date(vehicle.createdAt || Date.now());
      
      const dueMileage = lastMileage + item.intervalMiles;
      const dueDate = new Date(lastDate.getTime() + (item.intervalMonths * 30 * 24 * 60 * 60 * 1000));
      
      const milesUntilDue = dueMileage - vehicle.mileage;
      const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      
      let status = 'upcoming';
      if (milesUntilDue <= 0 || daysUntilDue <= 0) {
        status = 'overdue';
      } else if (milesUntilDue < item.intervalMiles * 0.2 || daysUntilDue < item.intervalMonths * 6) {
        // Due soon if within 20% of interval or ~20% of time (rough month estimate)
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
      const order = { overdue: 0, 'due-soon': 1, upcoming: 2 };
      if (order[a.status] !== order[b.status]) {
        return order[a.status] - order[b.status];
      }
      return a.milesUntilDue - b.milesUntilDue;
    });
  }, [vehicle, logs]);
}
