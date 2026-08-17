/**
 * Smoke Test: Owner's Manual Index Lookup
 *
 * Verifies src/data/manual-lookup.js:
 *   - Known models resolve to the right manual-index entry with a year range.
 *   - Year-range gating works (in-range vs out-of-range).
 *   - Normalization matches the app's conventions (CR-V, F-150, Santa Fe,
 *     make-stripped names, Mercedes-Benz alias).
 *   - Missing makes/models resolve honestly to null with a reason.
 *   - resolveManualUrl substitutes the vehicle year into per-year patterns
 *     and leaves hub URLs unchanged.
 *   - isAllowedManualUrl allowlists indexed URLs + year-substituted variants
 *     and rejects arbitrary URLs.
 */
import { describe, it, expect } from 'vitest';
import {
  findManualEntry,
  matchManualModelKey,
  resolveManualUrl,
  isAllowedManualUrl,
} from '../../src/data/manual-lookup.js';
import { manualIndex } from '../../src/data/manual-index.js';

describe('manual lookup — known models resolve', () => {
  it('2020 Toyota Camry resolves (2018-2026 range)', () => {
    const result = findManualEntry('Toyota', 'Camry', 2020);
    expect(result.reason).toBe('matched');
    expect(result.entry).toBeTruthy();
    expect(result.entry.fetchable).toBe(true);
    expect(result.entry.url).toContain('toyota.com');
  });

  it('2024 Honda CR-V resolves (2017-2026 range)', () => {
    const result = findManualEntry('Honda', 'CR-V', 2024);
    expect(result.reason).toBe('matched');
    expect(result.entry.url).toContain('owners.honda.com');
  });

  it('2020 Ford F-150 resolves to an honest upload-only entry', () => {
    const result = findManualEntry('Ford', 'F-150', 2020);
    expect(result.reason).toBe('matched');
    expect(result.entry).toBeTruthy();
    expect(result.entry.fetchable).toBe(false);
    expect(result.entry.url).toBeNull();
  });

  it('2019 Kia Telluride resolves (2020-2026 starts after 2019)', () => {
    // Telluride range is 2020-2026 — a 2019 model year is out of range
    const result = findManualEntry('Kia', 'Telluride', 2019);
    expect(result.reason).toBe('year_out_of_range');
    expect(findManualEntry('Kia', 'Telluride', 2021).reason).toBe('matched');
  });

  it('Wave 2: Nissan hub entries resolve (Manuals & Guides)', () => {
    const result = findManualEntry('Nissan', 'Altima', 2024);
    expect(result.reason).toBe('matched');
    expect(result.entry.fetchable).toBe(true);
    expect(result.entry.url).toContain('nissanusa.com/owners/manuals-guides.html');
  });

  it('Wave 2: Volkswagen entries resolve (owners-manuals page)', () => {
    const result = findManualEntry('Volkswagen', 'ID.4', 2023);
    expect(result.reason).toBe('matched');
    expect(result.entry.fetchable).toBe(true);
    expect(result.entry.url).toContain('vw.com/en/owners-and-services/about-my-vehicle/owners-manuals.html');
  });

  it('Wave 2: honest upload fallbacks resolve for probed-and-blocked makes', () => {
    const result = findManualEntry('Chevrolet', 'Silverado', 2023);
    expect(result.reason).toBe('matched');
    expect(result.entry.fetchable).toBe(false);
    expect(result.entry.url).toBeNull();
  });
});

describe('manual lookup — normalization matches app conventions', () => {
  it('separator-insensitive model names resolve (CR-V, F-150, Santa Fe)', () => {
    expect(findManualEntry('Honda', 'CRV', 2020).reason).toBe('matched');
    expect(findManualEntry('Honda', 'CR-V', 2020).reason).toBe('matched');
    expect(findManualEntry('Ford', 'F150', 2020).reason).toBe('matched');
    expect(findManualEntry('Ford', 'F-150', 2020).reason).toBe('matched');
    expect(findManualEntry('Hyundai', 'Santa Fe', 2020).reason).toBe('matched');
    expect(findManualEntry('Hyundai', 'Santa-Fe', 2020).reason).toBe('matched');
  });

  it('make-stripped names resolve (Toyota Camry → camry)', () => {
    expect(findManualEntry('Toyota', 'Toyota Camry', 2020).reason).toBe('matched');
  });

  it('make alias: NHTSA "Mercedes-Benz" style names reach canonical keys', () => {
    // Wave 2 added a mercedes make; the alias map must still route
    // "Mercedes-Benz" → 'mercedes' so canonical model names resolve.
    expect(findManualEntry('Mercedes-Benz', 'C-Class', 2020).reason).toBe('matched');
    // NHTSA-style "C 300" is not a canonical key — honest gap, never guessed.
    const result = findManualEntry('Mercedes-Benz', 'C 300', 2020);
    expect(result.reason).toBe('model_not_in_index');
    expect(result.entry).toBeNull();
  });

  it('leading-token refinement: "Santa Fe Hybrid" refines to santa fe', () => {
    expect(matchManualModelKey(manualIndex.hyundai, 'Santa Fe Hybrid')).toBe('santa fe');
  });

  it('shorter prefix never matches a longer key (Civic ≠ Civic Si)', () => {
    expect(matchManualModelKey({ 'civic si': {} }, 'civic')).toBeNull();
  });
});

describe('manual lookup — honest no-match states', () => {
  it('Tesla (excluded by owner direction) → make_not_in_index, never a broken fetch', () => {
    const result = findManualEntry('Tesla', 'Model 3', 2022);
    expect(result.reason).toBe('make_not_in_index');
    expect(result.entry).toBeNull();
  });

  it('unmapped model within a mapped make → model_not_in_index', () => {
    const result = findManualEntry('Toyota', 'Avalon', 2020);
    expect(result.reason).toBe('model_not_in_index');
    expect(result.entry).toBeNull();
  });

  it('year outside the entry range → year_out_of_range', () => {
    const result = findManualEntry('Toyota', 'Camry', 2010); // range starts 2018
    expect(result.reason).toBe('year_out_of_range');
    expect(result.entry).toBeNull();
  });

  it('empty inputs never throw and return not-found', () => {
    expect(findManualEntry('', '', '').reason).toBe('make_not_in_index');
    expect(findManualEntry(null, null, null).reason).toBe('make_not_in_index');
  });
});

describe('resolveManualUrl — year substitution + hubs', () => {
  it('substitutes the vehicle year into per-year Toyota patterns', () => {
    const entry = findManualEntry('Toyota', 'Camry', 2020).entry;
    expect(resolveManualUrl(entry, 2020)).toBe(
      'https://www.toyota.com/owners/warranty-owners-manuals/digital/camry/2020/'
    );
  });

  it('substitutes the vehicle year into per-year Honda routes (no trailing slash added)', () => {
    const entry = findManualEntry('Honda', 'Civic', 2024).entry;
    expect(resolveManualUrl(entry, 2024)).toBe(
      'https://owners.honda.com/vehicle-information/manuals/civic/2024'
    );
    expect(resolveManualUrl(entry, 2020)).toBe(
      'https://owners.honda.com/vehicle-information/manuals/civic/2020'
    );
  });

  it('returns null for upload-only entries (Ford F-150)', () => {
    const entry = findManualEntry('Ford', 'F-150', 2020).entry;
    expect(resolveManualUrl(entry, 2020)).toBeNull();
  });
});

describe('isAllowedManualUrl — proxy allowlist', () => {
  it('accepts indexed URLs exactly', () => {
    expect(isAllowedManualUrl('https://owners.honda.com/vehicle-information/manuals/civic/2024')).toBe(true);
    expect(isAllowedManualUrl('https://owners.kia.com/us/en/manuals.html')).toBe(true);
  });

  it('accepts year-substituted variants of per-year patterns', () => {
    expect(isAllowedManualUrl('https://www.toyota.com/owners/warranty-owners-manuals/digital/camry/2020/')).toBe(true);
    expect(isAllowedManualUrl('https://www.toyota.com/owners/warranty-owners-manuals/digital/camry/2026/')).toBe(true);
  });

  it('rejects arbitrary URLs, other hosts, and non-URLs', () => {
    expect(isAllowedManualUrl('https://evil.example.com/steal.pdf')).toBe(false);
    expect(isAllowedManualUrl('https://www.toyota.com/owners/warranty-owners-manuals/digital/camry/2020/../../evil')).toBe(false);
    expect(isAllowedManualUrl('ftp://owners.honda.com/manual.pdf')).toBe(false);
    expect(isAllowedManualUrl('not a url')).toBe(false);
    expect(isAllowedManualUrl('')).toBe(false);
    expect(isAllowedManualUrl(null)).toBe(false);
    expect(isAllowedManualUrl(undefined)).toBe(false);
  });
});
