/**
 * Smoke Test: Vehicle Inventory (src/data/inventory.js)
 *
 * The inventory drives manual (non-VIN) add-vehicle entry with STRICT dropdowns:
 *   type → make → model → year range (no free-text fallback for make/model/year).
 *
 * Verifies:
 *   - Every one of the 10 vehicle types returns at least one make.
 *   - All make & model keys are lowercase (no uppercase anywhere) and match the
 *     app's existing lookup normalization (separator-sensitive lowercased keys,
 *     spaced keys quoted).
 *   - Makes for a type and models for a make are sorted by label ascending.
 *   - A sample lookup resolves year ranges: car → toyota → camry.
 *   - A known multi-type make (yamaha) appears under the correct multiple types
 *     via its type-scoped keys: outboard 'yamaha', motorcycle 'yamaha-mc',
 *     watercraft 'yamaha-wc'.
 *   - Type-scoped keys emitted for the multi-type makes still resolve through
 *     the manual-lookup alias layer (manual-lookup.js MAKE_ALIASES).
 */
import { describe, it, expect } from 'vitest';
import {
  VEHICLE_TYPES,
  getInventoryMakesForType,
  getInventoryModelsForMake,
  getInventoryYearRangesForModel,
} from '../../src/data/inventory.js';
import { findManualEntry } from '../../src/data/manual-lookup.js';

const EXPECTED_TYPES = [
  'car', 'motorcycle', 'atv', 'semi-truck', 'rv', 'ag-equipment',
  'forklift', 'watercraft', 'outboard', 'marine-diesel',
];

describe('vehicle inventory — type → make → model → year', () => {
  it('exposes exactly the 10 vehicle-type ids', () => {
    expect([...VEHICLE_TYPES].sort()).toEqual([...EXPECTED_TYPES].sort());
  });

  it('every vehicle type returns at least one make', () => {
    for (const t of EXPECTED_TYPES) {
      const makes = getInventoryMakesForType(t);
      expect(makes.length, `type ${t} has no makes`).toBeGreaterThan(0);
    }
  });

  it('all make and model keys are lowercase with no uppercase anywhere', () => {
    for (const t of EXPECTED_TYPES) {
      for (const make of getInventoryMakesForType(t)) {
        expect(make.key).toBe(make.key.toLowerCase());
        expect(make.key).not.toMatch(/[A-Z]/);
        const models = getInventoryModelsForMake(make.key);
        expect(models.length).toBeGreaterThan(0);
        for (const model of models) {
          expect(model.key).toBe(model.key.toLowerCase());
          expect(model.key).not.toMatch(/[A-Z]/);
        }
      }
    }
  });

  it('makes per type are sorted by label ascending', () => {
    for (const t of EXPECTED_TYPES) {
      const labels = getInventoryMakesForType(t).map((m) => m.label);
      const sorted = [...labels].sort((a, b) => a.localeCompare(b));
      expect(labels).toEqual(sorted);
    }
  });

  it('models per make are sorted by label ascending', () => {
    for (const t of EXPECTED_TYPES) {
      for (const make of getInventoryMakesForType(t)) {
        const labels = getInventoryModelsForMake(make.key).map((m) => m.label);
        const sorted = [...labels].sort((a, b) => a.localeCompare(b));
        expect(labels).toEqual(sorted);
      }
    }
  });

  it('car → toyota → camry returns a non-empty, well-formed year-range list', () => {
    const ranges = getInventoryYearRangesForModel('toyota', 'camry');
    expect(ranges.length).toBeGreaterThan(0);
    for (const r of ranges) {
      expect(r.range).toMatch(/^\d{4}-\d{4}$/);
      expect(r.label).toMatch(/^\d{4}–\d{4}$/); // en dash
    }
    // ascending by start year
    const starts = ranges.map((r) => parseInt(r.range, 10));
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });

  it('yamaha appears under the correct multiple types (type-scoped keys)', () => {
    const outboard = getInventoryMakesForType('outboard').map((m) => m.key);
    const motorcycle = getInventoryMakesForType('motorcycle').map((m) => m.key);
    const watercraft = getInventoryMakesForType('watercraft').map((m) => m.key);
    expect(outboard).toContain('yamaha');
    expect(motorcycle).toContain('yamaha-mc');
    expect(watercraft).toContain('yamaha-wc');
    // outboard 'yamaha' yields outboard models; watercraft 'yamaha-wc' yields PWC models
    expect(getInventoryModelsForMake('yamaha').some((m) => m.key === 'f150')).toBe(true);
    expect(getInventoryModelsForMake('yamaha-wc').some((m) => m.key === 'vx')).toBe(true);
    expect(getInventoryModelsForMake('yamaha-mc').some((m) => m.key === 'mt-07')).toBe(true);
  });

  it('type-scoped make keys still resolve through the manual-lookup alias layer', () => {
    // These must NOT return make_not_in_index — the aliases fold them to base keys.
    for (const [mk, base] of [
      ['yamaha-mc', 'yamaha'],
      ['yamaha-wc', 'yamaha'],
      ['honda-mc', 'honda'],
      ['bmw-mc', 'bmw'],
      ['suzuki-mc', 'suzuki'],
      ['kawasaki-mc', 'kawasaki'],
      ['kawasaki-wc', 'kawasaki'],
      ['yanmar-ag', 'yanmar'],
      ['hyster-e', 'hyster'],
    ]) {
      const res = findManualEntry(mk, 'anything', 2020);
      expect(res.reason, `${mk} should resolve to make ${base}`).not.toBe('make_not_in_index');
      expect(res.make).toBe(base);
    }
  });
});
