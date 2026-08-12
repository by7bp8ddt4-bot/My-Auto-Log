/**
 * Smoke Test: Fuse Box Model Lookup (collision audit / fix regression)
 *
 * Verifies the model-name resolution in src/components/FuseBox.jsx:
 *   - Exact whole-model matches win over prefix matches (CX-50 must NOT resolve to
 *     cx-5; Civic must NOT resolve to Civic Si; GLE must NOT resolve to GLE 350).
 *   - Spaced / hyphenated / no-space forms normalize correctly
 *     ("Silverado 1500" → silverado1500, "Yukon XL" → yukon-xl, "F150" → f-150,
 *     "CRV" → cr-v, "ID4" → id.4, "C300" → c 300).
 *   - VPIC-style names resolve ("Bolt EV" → bolt, "Sierra 1500" → sierra,
 *     "Civic Si" → civic fallback, "Mazda3" → 3 via make-strip).
 *   - Regression: every previously-working model key still resolves via its
 *     canonical NHTSA VPIC-style name.
 */
import { describe, it, expect } from 'vitest';
import { findFuseData, matchModelKey } from '../../src/components/FuseBox.jsx';
import { fuseBoxData } from '../../src/data/fuse-boxes.js';

describe('fuse lookup — flagged collision bugs', () => {
  it('CX-50 does not resolve to cx-5 (no data → null)', () => {
    // No cx-5/cx-50 keys exist on main yet — must be null, never wrong data
    expect(findFuseData('Mazda', 'CX-50', 2023)).toBeNull();
  });

  it('CX-50 never matches a cx-5 key, but matches a real cx-50 key', () => {
    expect(matchModelKey({ 'cx-5': {}, '3': {} }, 'cx-50')).toBeNull();
    expect(matchModelKey({ 'cx-5': {}, 'cx-50': {} }, 'cx-50')).toBe('cx-50');
  });

  it('Civic resolves to civic, never to civic si (prefix trap)', () => {
    expect(matchModelKey({ 'civic': {}, 'civic si': {} }, 'civic')).toBe('civic');
    expect(matchModelKey({ 'civic': {}, 'civic si': {} }, 'civic si')).toBe('civic si');
    expect(matchModelKey({ 'civic': {}, 'civic si': {} }, 'civic si type r')).toBe('civic si');
  });

  it('GLE / GLC resolve to their exact keys, not the bare line', () => {
    expect(matchModelKey({ 'gle': {}, 'gle 350': {}, 'gle 53': {} }, 'gle')).toBe('gle');
    expect(matchModelKey({ 'gle': {}, 'gle 350': {}, 'gle 53': {} }, 'gle 350')).toBe('gle 350');
    expect(matchModelKey({ 'gle': {}, 'gle 350': {}, 'gle 53': {} }, 'gle 350 4matic')).toBe('gle 350');
    expect(matchModelKey({ 'glc': {}, 'glc 300': {} }, 'glc')).toBe('glc');
  });

  it('Bronco vs Bronco Sport stay distinct', () => {
    expect(matchModelKey({ 'bronco': {}, 'bronco sport': {} }, 'bronco')).toBe('bronco');
    expect(matchModelKey({ 'bronco': {}, 'bronco sport': {} }, 'bronco sport')).toBe('bronco sport');
  });

  it('Bolt / Bolt EV / Bolt EUV resolve correctly', () => {
    expect(findFuseData('Chevrolet', 'Bolt', 2020)).not.toBeNull();
    expect(findFuseData('Chevrolet', 'Bolt EV', 2020)).not.toBeNull();
    expect(findFuseData('Chevrolet', 'Bolt EUV', 2022)).not.toBeNull();
    expect(matchModelKey({ 'bolt': {}, 'bolt euv': {} }, 'bolt ev')).toBe('bolt');
    expect(matchModelKey({ 'bolt': {}, 'bolt euv': {} }, 'bolt euv')).toBe('bolt euv');
  });
});

describe('fuse lookup — spaced / hyphenated / no-space normalization', () => {
  it('Silverado 1500 (NHTSA spaced form) matches silverado1500', () => {
    expect(findFuseData('Chevrolet', 'Silverado 1500', 2016)).not.toBeNull();
  });

  it('Yukon XL matches yukon-xl; Yukon XL 1500 refines to it', () => {
    expect(findFuseData('GMC', 'Yukon XL', 2020)).not.toBeNull();
    expect(findFuseData('GMC', 'Yukon XL 1500', 2020)).not.toBeNull();
  });

  it('separator-insensitive variants resolve', () => {
    expect(findFuseData('Ford', 'F150', 2020)).not.toBeNull();
    expect(findFuseData('Ford', 'F-150', 2020)).not.toBeNull();
    expect(findFuseData('Honda', 'CRV', 2020)).not.toBeNull();
    expect(findFuseData('Honda', 'CR-V', 2020)).not.toBeNull();
    expect(findFuseData('Volkswagen', 'ID4', 2023)).not.toBeNull();
    expect(findFuseData('Volkswagen', 'ID.4', 2023)).not.toBeNull();
    expect(findFuseData('Toyota', '4 Runner', 2020)).not.toBeNull();
    expect(findFuseData('Toyota', '4Runner', 2020)).not.toBeNull();
    expect(findFuseData('Mercedes', 'C300', 2020)).not.toBeNull();
    expect(findFuseData('Mercedes', 'C 300', 2020)).not.toBeNull();
    expect(findFuseData('BMW', '3-Series', 2020)).not.toBeNull();
    expect(findFuseData('BMW', '3 Series', 2020)).not.toBeNull();
  });

  it('make-name stripping still works (mazda3 → 3, toyota camry → camry)', () => {
    expect(findFuseData('Mazda', 'Mazda3', 2020)).not.toBeNull();
    expect(findFuseData('Mazda', 'Mazda 3', 2020)).not.toBeNull();
    expect(findFuseData('Toyota', 'Toyota Camry', 2020)).not.toBeNull();
    expect(findFuseData('Ram', 'Ram 1500', 2020)).not.toBeNull();
  });

  it('make alias: NHTSA "Mercedes-Benz" reaches the mercedes data', () => {
    expect(findFuseData('Mercedes-Benz', 'C 300', 2020)).not.toBeNull();
  });

  it('more specific variants refine to the closest key; wrong variants stay null', () => {
    expect(findFuseData('GMC', 'Sierra 1500', 2020)).not.toBeNull();
    expect(matchModelKey({ 'sierra': {}, 'terrain': {} }, 'sierra 1500')).toBe('sierra');
    expect(matchModelKey({ 'silverado1500': {} }, 'silverado 2500hd')).toBeNull();
    expect(findFuseData('Mazda', 'CX-5', 2020)).toBeNull();
  });
});

describe('fuse lookup — regression across makes (VPIC-style names)', () => {
  const REGRESSION = [
    ['Toyota', 'Camry', 'camry'],
    ['Toyota', 'RAV4', 'rav4'],
    ['Toyota', 'Tacoma', 'tacoma'],
    ['Toyota', '4Runner', '4runner'],
    ['Ford', 'Explorer', 'explorer'],
    ['Ford', 'Bronco Sport', 'bronco sport'],
    ['Ford', 'Mustang', 'mustang'],
    ['Ford', 'F-150', 'f-150'],
    ['Honda', 'Accord', 'accord'],
    ['Honda', 'Pilot', 'pilot'],
    ['Honda', 'CR-V', 'cr-v'],
    ['Honda', 'Odyssey', 'odyssey'],
    ['Chevrolet', 'Equinox', 'equinox'],
    ['Chevrolet', 'Tahoe', 'tahoe'],
    ['Chevrolet', 'Camaro', 'camaro'],
    ['Chevrolet', 'Colorado', 'colorado'],
    ['GMC', 'Terrain', 'terrain'],
    ['GMC', 'Acadia', 'acadia'],
    ['GMC', 'Canyon', 'canyon'],
    ['Nissan', 'Altima', 'altima'],
    ['Nissan', 'Rogue', 'rogue'],
    ['Nissan', 'Pathfinder', 'pathfinder'],
    ['Hyundai', 'Elantra', 'elantra'],
    ['Hyundai', 'Santa Fe', 'santa fe'],
    ['Hyundai', 'Kona', 'kona'],
    ['Kia', 'Sportage', 'sportage'],
    ['Kia', 'Telluride', 'telluride'],
    ['Jeep', 'Grand Cherokee', 'grand cherokee'],
    ['Jeep', 'Wrangler', 'wrangler'],
    ['Subaru', 'Outback', 'outback'],
    ['Subaru', 'Crosstrek', 'crosstrek'],
    ['BMW', '330i', '330i'],
    ['BMW', '3 Series', '3 series'],
    ['BMW', 'X5', 'x5'],
    ['Mercedes', 'GLE 350', 'gle 350'],
    ['Mercedes', 'C-Class', 'c-class'],
    ['Mercedes', 'GLC 300', 'glc 300'],
    ['Audi', 'Q5', 'q5'],
    ['Audi', 'A4', 'a4'],
    ['Lexus', 'RX', 'rx'],
    ['Lexus', 'NX', 'nx'],
    ['Volvo', 'XC90', 'xc90'],
    ['Volvo', 'S60', 's60'],
    ['Ram', '1500', '1500'],
    ['Mazda', 'Mazda3', '3'],
    ['Volkswagen', 'ID.4', 'id.4'],
    ['Volkswagen', 'GTI', 'gti'],
    ['Chrysler', '300', '300'],
    ['Dodge', 'Charger', 'charger'],
    ['Dodge', 'Durango', 'durango'],
    ['Buick', 'Enclave', 'enclave'],
    ['Acura', 'MDX', 'mdx'],
    ['Mitsubishi', 'Outlander', 'outlander'],
  ];

  it.each(REGRESSION)('%s %s resolves to %s', (make, model, key) => {
    // Use the first year of the key's first range so the year gate can't fail
    const ranges = Object.keys(fuseBoxData[make.toLowerCase()][key]);
    const year = parseInt(ranges[0].split('-')[0], 10);
    const data = findFuseData(make, model, year);
    expect(data).not.toBeNull();
    expect(Array.isArray(data.panels) && data.panels.length > 0).toBe(true);
  });
});
