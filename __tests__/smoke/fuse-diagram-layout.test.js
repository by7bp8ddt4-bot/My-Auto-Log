/**
 * Smoke Test: Fuse Box Diagram Layout Math (feature/fuse-box-diagram)
 *
 * Verifies the layout-driven SVG grid resolver in src/components/FuseBox.jsx:
 *   - Cells from panel.layout land at their (col,row) with w/h spans, clamped
 *     to grid bounds (span overflow never escapes the grid).
 *   - Cells are keyed by the exact `pos` string (numeric pos 1 matches cell key '1').
 *   - Items whose pos is NOT in layout.cells auto-place into free slots in
 *     reading order without overlapping; panels with NO layout fall back to a
 *     reading-order grid for everything (matched === false).
 *   - Crash-proofing on hostile pos/amps formats: '20A', '*K16', 'S/B01',
 *     '7.5/30', '—' never throw and produce sane tiers.
 *   - notes pass through from the layout block.
 */
import { describe, it, expect } from 'vitest';
import {
  computePanelLayout,
  parseAmps,
  ampTier,
  itemMatches,
} from '../../src/components/FuseBox.jsx';

/* ── tiny fixtures ─────────────────────────────────────────────────── */

function panel(overrides = {}) {
  return {
    name: 'Test Panel',
    location: 'Somewhere',
    fuses: [
      { pos: 1, amps: 10, circuit: 'FOG FR', desc: 'Fog lights' },
      { pos: '7', amps: 30, circuit: 'WIPER', desc: 'Wipers' },
    ],
    relays: [{ pos: 'R1', circuit: 'HORN', desc: 'Horn relay' }],
    ...overrides,
  };
}

const sampleLayout = {
  cols: 12,
  rows: 6,
  cells: {
    '1':  { col: 1, row: 1, w: 1, h: 1 },
    '7':  { col: 2, row: 1, w: 1, h: 2 }, // taller fuse slot
    'R1': { col: 10, row: 5, w: 2, h: 1 }, // relay block
  },
  notes: ['Layout matches 2021-2024 gas trims; hybrid adds 2 fuses near position 20.'],
};

/* ── tests ─────────────────────────────────────────────────────────── */

describe('computePanelLayout — explicit layout', () => {
  it('places layout cells at their (col,row) with spans, bound-checked', () => {
    const { matched, cols, rows, cells } = computePanelLayout(panel({ layout: sampleLayout }));
    expect(matched).toBe(true);
    expect(cols).toBe(12);
    expect(rows).toBe(6);
    const byKey = Object.fromEntries(cells.map(c => [c.key, c]));
    expect(byKey['1']).toMatchObject({ col: 1, row: 1, w: 1, h: 1 });
    expect(byKey['7']).toMatchObject({ col: 2, row: 1, w: 1, h: 2 });
    expect(byKey['R1']).toMatchObject({ col: 10, row: 5, w: 2, h: 1 });
  });

  it('every placed cell stays within cols × rows bounds', () => {
    const { cols, rows, cells } = computePanelLayout(panel({ layout: sampleLayout }));
    for (const c of cells) {
      expect(c.col).toBeGreaterThanOrEqual(1);
      expect(c.row).toBeGreaterThanOrEqual(1);
      expect(c.col + c.w - 1).toBeLessThanOrEqual(cols);
      expect(c.row + c.h - 1).toBeLessThanOrEqual(rows);
    }
  });

  it('clamps span overflow (cell poking past the right/bottom edge)', () => {
    const layout = {
      cols: 4,
      rows: 3,
      cells: {
        'A': { col: 3, row: 1, w: 5, h: 1 }, // w overflows
        'B': { col: 1, row: 3, w: 1, h: 4 }, // h overflows
        'C': { col: 9, row: 9, w: 2, h: 2 }, // fully outside
        'D': { col: 0, row: 0, w: 1, h: 1 }, // below origin
      },
    };
    const { cols, rows, cells } = computePanelLayout(panel({
      fuses: [
        { pos: 'A', amps: 10, circuit: 'X', desc: 'x' },
        { pos: 'B', amps: 10, circuit: 'Y', desc: 'y' },
        { pos: 'C', amps: 10, circuit: 'Z', desc: 'z' },
        { pos: 'D', amps: 10, circuit: 'W', desc: 'w' },
      ],
      layout,
    }));
    const byKey = Object.fromEntries(cells.map(c => [c.key, c]));
    expect(byKey['A']).toMatchObject({ col: 3, row: 1, w: 2 });  // 3+2-1 = 4 = cols
    expect(byKey['B']).toMatchObject({ col: 1, row: 3, h: 1 });  // 3+1-1 = 3 = rows
    expect(byKey['C']).toMatchObject({ col: 4, row: 3, w: 1, h: 1 }); // clamped inside
    expect(byKey['D']).toMatchObject({ col: 1, row: 1, w: 1, h: 1 }); // clamped inside
    for (const c of cells) {
      expect(c.col + c.w - 1).toBeLessThanOrEqual(cols);
      expect(c.row + c.h - 1).toBeLessThanOrEqual(rows);
    }
  });

  it('looks up items by exact pos string (numeric pos 1 ↔ key "1")', () => {
    const { cells } = computePanelLayout(panel({ layout: sampleLayout }));
    const cell = cells.find(c => c.key === '1');
    expect(cell).toBeTruthy();
    expect(cell.item).toMatchObject({ pos: 1, circuit: 'FOG FR' });
  });

  it('renders layout cell keys with no matching item as empty (item null)', () => {
    const layout = {
      cols: 4,
      rows: 2,
      cells: { '1': { col: 1, row: 1, w: 1, h: 1 }, '99': { col: 2, row: 1, w: 1, h: 1 } },
    };
    const { cells } = computePanelLayout(panel({ layout }));
    const empty = cells.find(c => c.key === '99');
    expect(empty).toBeTruthy();
    expect(empty.item).toBeNull();
    expect(empty.placed).toBe('layout');
  });

  it('passes layout.notes through unchanged', () => {
    const { notes } = computePanelLayout(panel({ layout: sampleLayout }));
    expect(notes).toEqual(sampleLayout.notes);
  });
});

describe('computePanelLayout — auto-placement fallback', () => {
  it('auto-places items missing from layout.cells into free slots (no overlap)', () => {
    const layout = {
      cols: 4,
      rows: 3,
      cells: { '1': { col: 1, row: 1, w: 1, h: 1 } },
    };
    const p = panel({
      fuses: [
        { pos: '1', amps: 10, circuit: 'A', desc: 'a' },
        { pos: '2', amps: 10, circuit: 'B', desc: 'b' },
        { pos: '3', amps: 10, circuit: 'C', desc: 'c' },
      ],
      relays: [],
      layout,
    });
    const { matched, cells } = computePanelLayout(p);
    expect(matched).toBe(true);
    // 2 and 3 must land in free slots (never on top of 1)
    const keys = cells.map(c => c.key).sort();
    expect(keys).toEqual(['1', '2', '3']);
    const coords = new Set(cells.map(c => `${c.col},${c.row}`));
    expect(coords.size).toBe(3); // unique positions
  });

  it('panels with NO layout fall back to a reading-order grid for all items (matched false)', () => {
    const p = panel({ relays: [{ pos: 'R1', circuit: 'HORN', desc: 'Horn relay' }] });
    const { matched, cols, rows, cells } = computePanelLayout(p);
    expect(matched).toBe(false);
    expect(cols).toBe(12);
    expect(rows).toBe(1); // 3 items, 12 cols → 1 row
    expect(cells.map(c => c.key)).toEqual(['1', '7', 'R1']); // reading order
    expect(cells[0]).toMatchObject({ col: 1, row: 1 });
    expect(cells[1]).toMatchObject({ col: 2, row: 1 });
    expect(cells[2]).toMatchObject({ col: 3, row: 1 });
    expect(cells.every(c => c.placed === 'auto')).toBe(true);
  });

  it('fallback honors an explicit cols value but still reports unmatched', () => {
    const { cols } = computePanelLayout(panel({ layout: { cols: 6, cells: {} } }));
    expect(cols).toBe(6);
  });

  it('never crashes when the grid is too small for every item', () => {
    const layout = { cols: 1, rows: 1, cells: { '1': { col: 1, row: 1, w: 1, h: 1 } } };
    const p = panel({ layout });
    const { cells } = computePanelLayout(p);
    expect(cells.length).toBeGreaterThanOrEqual(1); // at least the explicit cell
    expect(Array.isArray(cells)).toBe(true);
  });
});

describe('parseAmps / ampTier — hostile formats', () => {
  it('parses plain numbers and numeric strings', () => {
    expect(parseAmps(10)).toBe(10);
    expect(parseAmps(7.5)).toBe(7.5);
    expect(parseAmps('30')).toBe(30);
  });

  it('takes the largest value from compound ratings like 7.5/30', () => {
    expect(parseAmps('7.5/30')).toBe(30);
    expect(parseAmps('20/25')).toBe(25);
  });

  it('returns null for non-numeric amps (—, undefined, null, "A")', () => {
    expect(parseAmps('—')).toBeNull();
    expect(parseAmps(undefined)).toBeNull();
    expect(parseAmps(null)).toBeNull();
    expect(parseAmps('')).toBeNull();
  });

  it('maps tiers exactly as the List view conventions', () => {
    expect(ampTier(30)).toBe('high');    // orange
    expect(ampTier(50)).toBe('high');
    expect(ampTier(20)).toBe('medium');  // amber
    expect(ampTier(25)).toBe('medium');
    expect(ampTier(10)).toBe('low');     // emerald
    expect(ampTier('7.5')).toBe('low');
    expect(ampTier('7.5/30')).toBe('high'); // dual rating → main fuse governs color
    expect(ampTier('—')).toBe('unknown');
    expect(ampTier(undefined)).toBe('unknown');
  });

  it('never throws and renders every cell for weird pos/amps combos', () => {
    const weird = panel({
      fuses: [
        { pos: '20A', amps: '20A', circuit: 'BOGUS POS', desc: 'pos looks like an amperage' },
        { pos: '*K16', amps: 10, circuit: 'K', desc: 'alphanumeric star pos' },
        { pos: 'S/B01', amps: '—', circuit: 'S', desc: 'slash pos' },
        { pos: '84A', amps: '7.5/30', circuit: 'D', desc: 'compound amps' },
        { pos: 'RLY1', amps: undefined, circuit: 'E', desc: 'relay-style pos in fuses array' },
      ],
      relays: [],
    });
    const { cells } = computePanelLayout(weird);
    expect(cells.length).toBe(5);
    for (const c of cells) {
      expect(c.key).toBe(String(c.item.pos));
      expect(ampTier(c.item.amps)).toBeDefined();
    }
    expect(cells.map(c => c.key)).toEqual(['20A', '*K16', 'S/B01', '84A', 'RLY1']);
  });

  it('items with duplicate pos keys still render without crashing', () => {
    const p = panel({
      fuses: [
        { pos: '1', amps: 10, circuit: 'FIRST', desc: 'first' },
        { pos: '1', amps: 20, circuit: 'SECOND', desc: 'second' },
      ],
      relays: [],
    });
    const { cells } = computePanelLayout(p);
    expect(cells.length).toBe(2);
  });
});

describe('itemMatches — shared search logic', () => {
  it('matches circuit, desc, and pos case-insensitively', () => {
    expect(itemMatches({ circuit: 'EFI MAIN NO.2', desc: 'Injection', pos: '13' }, 'efi')).toBe(true);
    expect(itemMatches({ circuit: 'HORN', desc: 'Horn', pos: '14' }, 'horn')).toBe(true);
    expect(itemMatches({ circuit: 'X', desc: 'Y', pos: 'R3' }, 'r3')).toBe(true);
    expect(itemMatches({ circuit: 'X', desc: 'Y', pos: '1' }, 'wipers')).toBe(false);
  });

  it('returns true for empty/blank terms', () => {
    expect(itemMatches({ circuit: 'X', desc: 'Y', pos: '1' }, '')).toBe(true);
    expect(itemMatches({ circuit: 'X', desc: 'Y', pos: '1' }, undefined)).toBe(true);
  });

  it('never throws on missing fields', () => {
    expect(itemMatches({}, 'anything')).toBe(false);
    expect(itemMatches(null, 'x')).toBe(false);
  });
});
