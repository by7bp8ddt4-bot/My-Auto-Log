/**
 * Shared VIN-aware schedule enrichment logic.
 * Adds drivetrain-specific services (differentials, transfer case, clutch)
 * based on VIN-decoded drivetrain data.
 *
 * Used by both useMaintenanceSchedule hook and RemindersPage.
 */

/**
 * Enrich a maintenance schedule with VIN-aware drivetrain services.
 * @param {Array} schedule - The base maintenance schedule to enrich (mutated in place).
 * @param {Object} vinData - The VIN-decoded data from the vehicle (vehicle.vinDecoded).
 * @returns {Array} The enriched schedule (same reference).
 */
export function enrichScheduleWithVinData(schedule, vinData) {
  if (!schedule || !vinData) return schedule;

  // --- AWD / 4WD: Add differential and transfer case services ---
  if (vinData.driveType) {
    const dt = vinData.driveType.toLowerCase();
    const is4wd = dt.includes('4wd') || dt.includes('4-wheel') || dt.includes('4x4') || dt.includes('all-wheel') || dt.includes('awd');

    if (is4wd) {
      const hasDifferential = schedule.some(s => s.service.toLowerCase().includes('differential'));
      if (!hasDifferential) {
        schedule.push(
          { service: 'Front Differential Fluid', intervalMiles: 50000, intervalMonths: 48, severity: 'medium', description: 'Protects front differential gears.' },
          { service: 'Rear Differential Fluid', intervalMiles: 50000, intervalMonths: 48, severity: 'medium', description: 'Fresh fluid prevents rear axle gear wear.' },
        );
      }

      // Transfer case for ALL AWD and 4WD vehicles
      // (Subaru, Audi, Honda CR-V, Toyota RAV4 all have transfer cases/center diffs)
      const hasTransferCase = schedule.some(s => s.service.toLowerCase().includes('transfer case'));
      if (!hasTransferCase) {
        schedule.push(
          { service: 'Transfer Case Fluid', intervalMiles: 50000, intervalMonths: 48, severity: 'medium', description: 'Keeps transfer case operating smoothly.' },
        );
      }
    }
  }

  // --- Manual Transmission: Add clutch inspection ---
  if (vinData.transmission && vinData.transmission.toLowerCase().includes('manual')) {
    const hasClutch = schedule.some(s => s.service.toLowerCase().includes('clutch'));
    if (!hasClutch) {
      schedule.push(
        { service: 'Clutch Inspection', intervalMiles: 60000, intervalMonths: 60, severity: 'medium', description: 'Check clutch wear and adjustment for manual transmission.' },
      );
    }
  }

  return schedule;
}
