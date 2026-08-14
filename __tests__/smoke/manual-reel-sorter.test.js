/**
 * Smoke Test: Owner's Manual Highlights Reel Sorter
 *
 * Verifies src/utils/manualReelSorter.js:
 *   - Each category is detected from representative manual text.
 *   - Cards carry plain-English titles, page numbers, and snippets.
 *   - Ordering follows the fixed category order (fluids → tires → bulbs →
 *     fuses → obd → maintenance → warnings).
 *   - Filters (search) work and empty input never throws.
 */
import { describe, it, expect } from 'vitest';
import {
  MANUAL_CATEGORIES,
  sortManualHighlights,
  filterManualHighlights,
} from '../../src/utils/manualReelSorter.js';

const SAMPLE_PAGES = [
  {
    page: 1,
    text: 'Welcome to your new vehicle. Engine Oil: use 0W-20 full synthetic, capacity 4.8 quarts.',
  },
  {
    page: 2,
    text: 'Tire Pressure: 33 psi front and 33 psi rear. Tire size P225/60R17.',
  },
  {
    page: 3,
    text: 'Headlight bulb type H11 for low beam, 9005 for high beam.',
  },
  {
    page: 4,
    text: 'The fuse box is located under the dashboard on the driver side.',
  },
  {
    page: 5,
    text: 'The OBD-II data link connector is under the dashboard near the steering column.',
  },
  {
    page: 6,
    text: 'Refer to the maintenance schedule for intervals. Oil changes every 10,000 miles.',
  },
  {
    page: 7,
    text: 'If the check engine warning light comes on, have the vehicle inspected.',
  },
];

describe('sortManualHighlights — category detection', () => {
  const reel = sortManualHighlights(SAMPLE_PAGES);
  const categoryIds = reel.categories.map((c) => c.id);

  it('detects all seven categories from the sample manual', () => {
    expect(categoryIds).toEqual(['fluids', 'tires', 'bulbs', 'fuses', 'obd', 'maintenance', 'warnings']);
  });

  it('keeps the fixed display order', () => {
    const expectedOrder = MANUAL_CATEGORIES.map((c) => c.id);
    for (let i = 0; i < categoryIds.length - 1; i++) {
      expect(expectedOrder.indexOf(categoryIds[i])).toBeLessThan(
        expectedOrder.indexOf(categoryIds[i + 1])
      );
    }
  });

  it('emits plain-English card titles with page numbers and snippets', () => {
    const fluids = reel.categories.find((c) => c.id === 'fluids');
    const oilCard = fluids.cards.find((c) => c.title.includes('Engine Oil'));
    expect(oilCard).toBeTruthy();
    expect(oilCard.page).toBe(1);
    expect(oilCard.snippet).toContain('0W-20');

    const tires = reel.categories.find((c) => c.id === 'tires');
    const tireCard = tires.cards.find((c) => c.title.includes('Tire Pressure'));
    expect(tireCard.page).toBe(2);
    expect(tireCard.snippet).toContain('33 psi');

    const obd = reel.categories.find((c) => c.id === 'obd');
    expect(obd.cards[0].page).toBe(5);
    expect(obd.cards[0].snippet.toLowerCase()).toContain('obd-ii');
  });

  it('does not crash on empty or malformed input', () => {
    expect(sortManualHighlights([]).total).toBe(0);
    expect(sortManualHighlights(null).total).toBe(0);
    expect(sortManualHighlights([{ page: 1 }, { page: 2, text: '' }]).total).toBe(0);
    expect(sortManualHighlights([{ page: 1, text: 'no matches here at all' }]).total).toBe(0);
  });

  it('scannedPages reflects the number of pages given', () => {
    expect(reel.scannedPages).toBe(7);
  });
});

describe('sortManualHighlights — rule pragmatics', () => {
  it('one card per rule from the first matching page (not one per page)', () => {
    const reel = sortManualHighlights([
      { page: 1, text: 'Engine oil 0W-20. Engine oil capacity 4.8 qt. Engine oil again.' },
      { page: 2, text: 'More engine oil discussion.' },
    ]);
    const fluids = reel.categories.find((c) => c.id === 'fluids');
    const oilCards = fluids.cards.filter((c) => c.title.includes('Engine Oil'));
    expect(oilCards.length).toBe(1);
    expect(oilCards[0].page).toBe(1);
  });

  it('caps total cards', () => {
    const pages = SAMPLE_PAGES.slice(0, 4);
    const reel = sortManualHighlights(pages, { maxCards: 2 });
    expect(reel.total).toBeLessThanOrEqual(2);
  });

  it('multi-fluid pages produce several distinct fluid cards', () => {
    const reel = sortManualHighlights([
      {
        page: 8,
        text: 'Brake fluid DOT 3. Coolant: use Toyota Super Long Life. Transmission fluid WS. Refrigerant R-1234yf.',
      },
    ]);
    const fluids = reel.categories.find((c) => c.id === 'fluids');
    const titles = fluids.cards.map((c) => c.title);
    expect(titles).toContain('Brake Fluid');
    expect(titles).toContain('Coolant / Antifreeze');
    expect(titles).toContain('Transmission Fluid');
    expect(titles).toContain('A/C Refrigerant');
  });
});

describe('filterManualHighlights — search', () => {
  const reel = sortManualHighlights(SAMPLE_PAGES);

  it('filters cards by query across title and snippet', () => {
    const filtered = filterManualHighlights(reel, 'psi');
    expect(filtered.total).toBeGreaterThan(0);
    const all = filtered.categories.flatMap((c) => c.cards);
    expect(all.every((c) => c.title.includes('psi') || c.snippet.includes('psi'))).toBe(true);
  });

  it('empty query returns the reel unchanged', () => {
    expect(filterManualHighlights(reel, '')).toBe(reel);
    expect(filterManualHighlights(reel, '   ')).toBe(reel);
  });

  it('no-match query returns an empty reel without crashing', () => {
    const filtered = filterManualHighlights(reel, 'zzzznothing');
    expect(filtered.total).toBe(0);
    expect(filtered.categories.length).toBe(0);
  });
});
