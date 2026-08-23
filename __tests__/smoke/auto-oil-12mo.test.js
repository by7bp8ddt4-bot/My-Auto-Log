/**
 * Smoke Test: Universal 12-month "whichever comes first" oil clause (automotive only)
 *
 * Owner product rule (data PR): EVERY automotive vehicle's engine-oil entry carries a
 * 12-month "whichever comes first" TIME component, while PRESERVING each model's existing
 * MILEAGE figure (5k/7.5k/10k/oil-life systems vary by make/model — never reset to 7,500).
 *
 * Applies to AUTOMOTIVE vehicle types ONLY. Non-automotive types (motorcycle, marine/PWC,
 * marine diesel, ag, forklift, semi, RV, powersports) must be UNTOUCHED.
 *
 * In the data model an oil entry is { service, intervalMiles, intervalMonths, ... }; the
 * "12 months, whichever comes first" TIME component is `intervalMonths: 12`.
 */
import { describe, it, expect } from 'vitest';
import { MAINTENANCE_SCHEDULES } from '../../src/data/maintenance-schedules.js';

// Automotive makes in the data (the ~30 passenger/light-vehicle makes). Tesla is automotive
// but EV — it has no engine-oil entries, so it contributes nothing here.
const AUTO_MAKES = new Set([
  'toyota', 'honda', 'ford', 'chevrolet', 'bmw', 'mercedes', 'mitsubishi',
  'hyundai', 'kia', 'nissan', 'subaru', 'jeep', 'ram', 'volkswagen',
  'gmc', 'mazda', 'audi', 'volvo', 'lexus', 'acura', 'dodge', 'chrysler',
  'lincoln', 'infiniti', 'buick', 'mg', 'pontiac', 'plymouth', 'oldsmobile', 'amc',
]);

// Engine-oil service names. Excludes non-engine oil rows (Differential Oil, Gear Oil,
// Gearbox Oil, Reduction Gear Oil, Primary Chaincase Oil, Transmission Oil, etc.).
const OIL_SERVICES = new Set([
  'Oil & Filter Change',
  'Oil & Filter',
  'Oil & Filter Change (Oil Life System)',
  'Service A (Oil/Filter)',
]);

// Resolve a model entry to an array, following string references (''ref', 'make.model'),
// chasing chains until an actual array is found.
function resolveSchedule(make, model) {
  const d = MAINTENANCE_SCHEDULES[make];
  if (!d) return null;
  let ms = d.models[model];
  for (let i = 0; i < 8 && typeof ms === 'string'; i++) {
    if (ms.includes('.')) {
      const [rm, rmo] = ms.split('.');
      const target = MAINTENANCE_SCHEDULES[rm]?.models?.[rmo];
      if (target === undefined) return null;
      ms = target;
    } else {
      ms = d.models[ms];
    }
  }
  return Array.isArray(ms) ? ms : null;
}

// Collect every engine-oil entry (as {make, model, miles, months}) across a set of makes.
function oilEntries(makes) {
  const out = [];
  for (const make of makes) {
    const d = MAINTENANCE_SCHEDULES[make];
    if (!d || !d.models) continue;
    for (const model of Object.keys(d.models)) {
      const sched = resolveSchedule(make, model);
      if (!sched) continue;
      for (const svc of sched) {
        if (OIL_SERVICES.has(svc.service)) {
          out.push({
            make, model,
            miles: svc.intervalMiles,
            months: svc.intervalMonths,
            svc: svc.service,
          });
        }
      }
    }
  }
  return out;
}

describe('Universal 12-month oil clause — automotive only', () => {
  it('every automotive engine-oil entry has a 12-month "whichever comes first" time', () => {
    const auto = oilEntries(AUTO_MAKES);
    expect(auto.length).toBeGreaterThan(0);
    for (const e of auto) {
      expect(e.months, `${e.make} ${e.model} oil months`).toBe(12);
    }
  });

  it('represents a spread of automotive makes with preserved mileage', () => {
    // Each value is that model's OWN mileage — preserved, none reset to 7,500.
    const cases = [
      ['toyota', 'camry', 10000],
      ['honda', 'civic', 7500],
      ['ford', 'f-150', 7500],
      ['chevrolet', 'tahoe', 7500],
      ['subaru', 'outback', 6000],
      ['nissan', 'altima', 5000],
      ['mazda', 'mazda3', 5000],
      ['bmw', '3 series', 10000],
      ['hyundai', 'elantra', 7500],
      ['audi', 'a4', 10000],
      // Chevy's fixed-figure alternative schedule (the 2017 Silverado correction target):
      ['chevrolet', 'silverado-shared', 7500],
    ];
    for (const [make, model, miles] of cases) {
      const sched = resolveSchedule(make, model);
      const oil = sched.find(s => OIL_SERVICES.has(s.service));
      expect(oil, `${make} ${model} oil entry`).toBeTruthy();
      expect(oil.intervalMonths, `${make} ${model} months`).toBe(12);
      expect(oil.intervalMiles, `${make} ${model} miles`).toBe(miles);
    }
  });

  it('oil-life-system entry keeps its mileage while gaining the 12-month floor', () => {
    // 'Oil & Filter Change (Oil Life System)' entries: mileage unchanged, time = 12.
    const auto = oilEntries(AUTO_MAKES);
    const ols = auto.filter(e => e.svc === 'Oil & Filter Change (Oil Life System)');
    for (const e of ols) {
      expect(e.months).toBe(12);
    }
    // The Chevrolet Silverado (incl. HD 2500/3500 via reference) uses the official
    // GM oil-life monitor: 0 fixed miles, 12-month annual floor. Mileage preserved.
    const sched = resolveSchedule('chevrolet', 'silverado');
    const oil = sched.find(s => s.service === 'Oil & Filter Change (Oil Life System)');
    expect(oil).toBeTruthy();
    expect(oil.intervalMiles).toBe(0);
    expect(oil.intervalMonths).toBe(12);
  });

  it('non-automotive vehicles are NOT forced to a 12-month time', () => {
    // Non-auto values are exactly as they predate this change (untouched):
    const cases = [
      ['freightliner', 'cascadia', 25000, 6],   // semi
      ['yamaha-mc', 'r1', 4000, 6],             // motorcycle
      ['cat', 'c7', 0, 0],                      // marine diesel (hours-based)
      ['winnebago', 'vista', 5000, 6],          // RV
      ['polaris', 'rzr', 0, 6],                 // powersports
      ['harley-davidson', 'sportster', 5000, 6],// motorcycle
    ];
    for (const [make, model, miles, months] of cases) {
      const sched = resolveSchedule(make, model);
      const oil = sched.find(s => OIL_SERVICES.has(s.service));
      expect(oil, `${make} ${model} oil entry`).toBeTruthy();
      expect(oil.intervalMonths, `${make} ${model} months`).toBe(months);
      expect(oil.intervalMiles, `${make} ${model} miles`).toBe(miles);
    }
  });
});
