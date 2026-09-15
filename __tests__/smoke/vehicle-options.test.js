/**
 * Smoke Test: Vehicle Options (src/data/vehicle-options.js)
 *
 * The add-vehicle form's Engine Size / Transmission / Fuel Type dropdowns are
 * powered by this module: for a known make → model → year range, only the real
 * options that vehicle actually offered are shown.
 *
 * Verifies:
 *   - toyota/camry/'2018-2026' (Wave-1 vehicle) resolves to non-empty
 *     engines / transmissions / fuelTypes arrays of strings.
 *   - All make/model keys are lowercase (matching inventory.js convention).
 *   - FALLBACK_VEHICLE_OPTIONS carries all four generic lists
 *     (engines, transmissions, fuelTypes, bodyClasses).
 *   - A vehicle with no authored data yet (subaru/outback — Wave 2+ make)
 *     resolves to null so the UI falls back to the generic lists.
 *   - Every (make, model, yearRange) in the inventory for the five Wave-1
 *     makes (toyota, honda, ford, chevrolet, nissan) has authored options —
 *     the inventory is the checklist the data must cover.
 */
import { describe, it, expect } from 'vitest';
import {
  vehicleOptions,
  FALLBACK_VEHICLE_OPTIONS,
  getVehicleOptions,
  getEnginesForVehicle,
  getTransmissionsForVehicle,
  getFuelTypesForVehicle,
} from '../../src/data/vehicle-options.js';
import { getInventoryMakesForType, default as inventory } from '../../src/data/inventory.js';

const WAVE1_MAKES = ['toyota', 'honda', 'ford', 'chevrolet', 'nissan'];

describe('vehicle options — engine/transmission/fuel dropdown data', () => {
  it('resolves toyota/camry/2018-2026 to non-empty string arrays', () => {
    const opts = getVehicleOptions('toyota', 'camry', '2018-2026');
    expect(opts).toBeTruthy();
    for (const key of ['engines', 'transmissions', 'fuelTypes']) {
      expect(Array.isArray(opts[key])).toBe(true);
      expect(opts[key].length).toBeGreaterThan(0);
      for (const label of opts[key]) {
        expect(typeof label).toBe('string');
        expect(label.length).toBeGreaterThan(0);
      }
    }
    // Sanity: the Camry 2018-2026 really offered a 3.5L V6 and hybrid.
    expect(opts.engines).toContain('3.5L V6');
    expect(opts.engines).toContain('2.5L Hybrid');
    expect(opts.transmissions).toContain('eCVT (Hybrid)');
    expect(opts.fuelTypes).toContain('Hybrid');
  });

  it('all make and model keys are lowercase', () => {
    const keyRe = /[A-Z]/;
    for (const [makeKey, models] of Object.entries(vehicleOptions)) {
      expect(makeKey).not.toMatch(keyRe);
      for (const modelKey of Object.keys(models)) {
        expect(modelKey).not.toMatch(keyRe);
      }
    }
  });

  it('FALLBACK_VEHICLE_OPTIONS has all four generic lists', () => {
    for (const key of ['engines', 'transmissions', 'fuelTypes', 'bodyClasses']) {
      expect(Array.isArray(FALLBACK_VEHICLE_OPTIONS[key])).toBe(true);
      expect(FALLBACK_VEHICLE_OPTIONS[key].length).toBeGreaterThan(0);
    }
  });

  it('returns null for a vehicle with no authored data yet (subaru/outback)', () => {
    expect(getVehicleOptions('subaru', 'outback', '2010-2024')).toBeNull();
    expect(getEnginesForVehicle('subaru', 'outback', '2010-2024')).toBeNull();
    expect(getTransmissionsForVehicle('subaru', 'outback', '2010-2024')).toBeNull();
    expect(getFuelTypesForVehicle('subaru', 'outback', '2010-2024')).toBeNull();
    expect(getVehicleOptions('toyota', 'camry', '2099-2100')).toBeNull();
  });

  it('covers every inventory model/yearRange for all five Wave-1 makes', () => {
    const makes = getInventoryMakesForType('car').map((m) => m.key);
    const missing = [];
    let combos = 0;
    for (const makeKey of WAVE1_MAKES) {
      expect(makes).toContain(makeKey);
      // Walk the inventory model tree directly so we use the exact keys/ranges.
      const models = inventory.car[makeKey]?.models ?? {};
      for (const [modelKey, model] of Object.entries(models)) {
        for (const range of model.ranges) {
          combos += 1;
          if (!getVehicleOptions(makeKey, modelKey, range)) {
            missing.push(`${makeKey}/${modelKey}/${range}`);
          }
        }
      }
    }
    expect(combos).toBeGreaterThan(100);
    expect(missing).toEqual([]);
  });
});
