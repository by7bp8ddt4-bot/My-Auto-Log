#!/usr/bin/env bun
/**
 * Wave 5 fuse-layout verifier — Ford (fusion, edge, expedition, bronco, ranger,
 * mustang, explorer, maverick, transit). 76 OEM-matched layout blocks.
 *
 * Follows the Wave 4 verifier pattern: loads the REAL data modules
 * (`fuseBoxData` from src/data/fuse-boxes.js, `findFuseData` from
 * src/components/FuseBox.jsx) instead of regex-parsing the source text — the
 * old regex scanner bled panels across model boundaries and invented panels
 * under unrelated makes (586 false failures).
 *
 * Checks per in-scope panel:
 *   1. Every layout cell `pos` resolves to an actual entry in that panel's
 *      `fuses`/`relays` arrays (exact string match on `pos`).
 *   2. Each cell's col/row/w/h are sane positive integers, and the grid
 *      cols/rows dims are sane positive integers.
 *   3. Panels documented as honest gaps (no source diagram, or synthetic app
 *      data that would mislead) have NO layout block — honest-gap rule.
 *   4. taurus is absent from fuse-boxes.js (documented gap — no app entry to
 *      attach a layout to).
 *   5. A full-walk count guard: the number of layout-bearing panels found in
 *      the data for each Wave-5 model must match the expected per-model count
 *      exactly (catches stray/extra layouts placed anywhere in the model).
 *   6. Prior-wave Ford layouts (f-150, Wave 1) still resolve — a real data
 *      regression would fail this check; never weaken it to make it pass.
 *
 * Run: bun tools/verify-wave5-layouts.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData } from '../src/components/FuseBox.jsx';

let fail = 0, ok = 0, total = 0;
const check = (c, m) => { total++; if (c) ok++; else { fail++; console.log('FAIL:', m); } };

let cellsChecked = 0;
let layoutsChecked = 0;

/** Verify one panel's layout block: cell pos resolution + sane dims. */
function verifyPanelLayout(model, range, panel) {
  layoutsChecked++;
  const positions = new Set([
    ...(panel.fuses || []).map(f => f.pos),
    ...(panel.relays || []).map(r => r.pos),
  ]);
  const tag = `${model} ${range} ${panel.name}`;
  check(Number.isInteger(panel.layout.cols) && panel.layout.cols >= 1, `${tag}: layout.cols must be a positive integer (got ${panel.layout.cols})`);
  check(Number.isInteger(panel.layout.rows) && panel.layout.rows >= 1, `${tag}: layout.rows must be a positive integer (got ${panel.layout.rows})`);
  const cells = panel.layout.cells || {};
  const cellKeys = Object.keys(cells);
  check(cellKeys.length >= 1, `${tag}: layout has no cells`);
  for (const [pos, cell] of Object.entries(cells)) {
    cellsChecked++;
    check(positions.has(pos), `${tag}: layout cell '${pos}' not in panel fuses/relays`);
    check(Number.isInteger(cell.col) && cell.col >= 1, `${tag}: cell '${pos}' col must be a positive integer (got ${cell.col})`);
    check(Number.isInteger(cell.row) && cell.row >= 1, `${tag}: cell '${pos}' row must be a positive integer (got ${cell.row})`);
    check(Number.isInteger(cell.w) && cell.w >= 1, `${tag}: cell '${pos}' w must be a positive integer (got ${cell.w})`);
    check(Number.isInteger(cell.h) && cell.h >= 1, `${tag}: cell '${pos}' h must be a positive integer (got ${cell.h})`);
  }
}

// ── Expected mapped panels: [model, yearRange, sampleYear, [panelNames w/ layout]] ──
// Source of truth: wave5/NOTES.md coverage section (76 layouts) + data walk.
// sampleYear must resolve UNIQUELY to the intended range via findFuseData:
// transit 2019-2023 uses 2022 because 2019 also falls in the earlier
// '2018-2019' range (first matching range wins in findFuseData).
const mappedPanels = [
  ['fusion', '2017-2017', 2017, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box', 'Engine Compartment Fuse Box (Bottom)']],
  ['fusion', '2018-2020', 2018, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box', 'Engine Compartment Fuse Box (Bottom)']],
  ['edge', '2015-2015', 2015, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box', 'Engine Compartment Fuse Box (Bottom)']],
  ['edge', '2016-2017', 2016, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box', 'Engine Compartment Fuse Box (Bottom)']],
  ['edge', '2018-2020', 2018, ['Passenger Compartment Fuse Box']],
  ['edge', '2021-2024', 2021, ['Passenger Compartment Fuse Box']],
  ['expedition', '2018-2019', 2018, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box']],
  ['expedition', '2020-2021', 2020, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box']],
  ['expedition', '2025-2026', 2025, ['Engine Compartment Fuse Box', 'Passenger Compartment Fuse Box']],
  ['bronco', '2021-2026', 2021, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box']],
  ['ranger', '2019-2023', 2019, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box', 'Engine Compartment Fuse Box (Bottom)', 'Battery Mounted Fuse Box (Fusible Links)', 'Battery Mounted Fuse Box']],
  ['ranger', '2024-2026', 2024, ['Engine Compartment Fuse Box', 'Passenger Compartment Fuse Box']],
  ['mustang', '2015-2015', 2015, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box']],
  ['mustang', '2016-2016', 2016, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box']],
  ['mustang', '2017-2017', 2017, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box']],
  ['mustang', '2018-2018', 2018, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box']],
  ['mustang', '2019-2019', 2019, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box']],
  ['mustang', '2020-2023', 2020, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box']],
  ['mustang', '2024-2024', 2024, ['Engine Compartment Fuse Box', 'Passenger Compartment Fuse Box']],
  ['mustang', '2025-2026', 2025, ['Engine Compartment Fuse Box', 'Passenger Compartment Fuse Box']],
  ['explorer', '2020-2026', 2020, ['Interior Fuse Panel']],
  ['maverick', '2022-2024', 2022, ['Body Control Module Fuse Box', 'Engine Compartment Fuse Block']],
  ['maverick', '2025-2026', 2025, ['Body Control Module Fuse Box', 'Engine Compartment Fuse Block']],
  ['transit', '2015-2015', 2015, ['Passenger Compartment Fuse Panel', 'Pre-Fuse Box', 'Body Control Module Fuse Box', 'Engine Compartment Fuse Box']],
  ['transit', '2016-2016', 2016, ['Passenger Compartment Fuse Panel', 'Pre-Fuse Box', 'Body Control Module Fuse Box', 'Engine Compartment Fuse Box']],
  ['transit', '2017-2017', 2017, ['Passenger Compartment Fuse Panel', 'Pre-Fuse Box', 'Body Control Module Fuse Box', 'Engine Compartment Fuse Box']],
  ['transit', '2018-2019', 2018, ['Passenger Compartment Fuse Panel', 'Body Control Module Fuse Box', 'Engine Compartment Fuse Box']],
  ['transit', '2019-2023', 2022, ['Pre-Fuse Box', 'Driver Side Fuse Box', 'Passenger Side Fuse Box', 'Body Control Module']],
  ['transit', '2024-2025', 2024, ['Pre-Fuse Box', 'Driver Side Fuse Box', 'Passenger Side Fuse Box', 'Body Control Module']],
  ['transit', '2026-2026', 2026, ['Pre-Fuse Box', 'Interior Fuse Box', 'Engine Compartment Fuse Box']],
];

// ── Honest gaps: [model, yearRange, sampleYear, panelName] — must have NO layout ──
// Documented in wave5/NOTES.md (no source diagram, or synthetic app data with
// <0.75 position match — a layout would mislead).
const gapPanels = [
  ['escape', '2020-2024', 2020, 'Engine Compartment Fuse Box'],
  ['escape', '2020-2024', 2020, 'Body Control Module (BCM) / Interior Fuse Panel'],
  ['explorer', '2020-2026', 2020, 'Under-Hood Fuse Box'],
  ['edge', '2018-2020', 2018, 'Engine Compartment Fuse Box'],
  ['edge', '2018-2020', 2018, 'Engine Compartment Fuse Box (Bottom)'],
  ['edge', '2021-2024', 2021, 'Engine Compartment Fuse Box'],
  ['edge', '2021-2024', 2021, 'Engine Compartment Fuse Box (Bottom)'],
  ['transit', '2019-2023', 2022, 'Engine Compartment Fuse Box'],
  ['transit', '2024-2025', 2024, 'Engine Compartment Fuse Box'],
];

// ── 1. Mapped panels: resolve via findFuseData, require layout, verify cells ──
for (const [model, range, sampleYear, panelNames] of mappedPanels) {
  const d = findFuseData('Ford', model, sampleYear);
  check(d && Array.isArray(d.panels), `findFuseData('Ford', '${model}', ${sampleYear}) resolves (${range})`);
  if (!d || !Array.isArray(d.panels)) continue;
  for (const pn of panelNames) {
    const p = d.panels.find(p => p.name === pn);
    check(Boolean(p), `${model} ${range}: panel "${pn}" exists`);
    check(p && p.layout, `${model} ${range}: "${pn}" has layout (mapped in Wave 5)`);
    if (p && p.layout) verifyPanelLayout(model, range, p);
  }
}

// ── 2. Honest gaps: panel exists but must have NO layout ─────────────────────
for (const [model, range, sampleYear, pn] of gapPanels) {
  const d = findFuseData('Ford', model, sampleYear);
  check(d && Array.isArray(d.panels), `gap lookup Ford ${model} ${range}`);
  if (!d || !Array.isArray(d.panels)) continue;
  const p = d.panels.find(p => p.name === pn);
  check(Boolean(p), `gap panel ${model} ${range} "${pn}" exists`);
  check(p && !p.layout, `${model} ${range} "${pn}" has NO layout (honest gap — no matching source diagram)`);
}

// ── 3. taurus: absent from fuse-boxes.js (documented gap) ────────────────────
check(!fuseBoxData.ford || !fuseBoxData.ford['taurus'], 'taurus absent from fuseBoxData.ford (documented gap)');
check(findFuseData('Ford', 'taurus', 2016) === null, 'findFuseData(Ford, taurus, 2016) returns null');

// ── 4. Full-walk count guard: per-model layout counts must match exactly ──────
const expectedLayouts = {
  fusion: 6, edge: 8, expedition: 6, bronco: 2, ranger: 7,
  mustang: 16, explorer: 1, maverick: 4, transit: 26,
};
const walkCounts = {};
for (const [model, ranges] of Object.entries(fuseBoxData.ford)) {
  for (const data of Object.values(ranges)) {
    for (const p of data.panels || []) {
      if (p.layout) walkCounts[model] = (walkCounts[model] || 0) + 1;
    }
  }
}
for (const [model, expected] of Object.entries(expectedLayouts)) {
  const actual = walkCounts[model] || 0;
  check(actual === expected, `${model}: exactly ${expected} layout(s) in data (found ${actual})`);
}
const totalWave5 = Object.values(expectedLayouts).reduce((a, b) => a + b, 0);
check(totalWave5 === 76, `Wave 5 scope totals 76 layouts (found ${totalWave5} expected)`);

// ── 5. Prior-wave Ford layouts (f-150, Wave 1) must still resolve ────────────
for (const [model, range, panelNames] of [
  ['f-150', '2022-2023', ['Power Distribution Box', 'Passenger Compartment Fuse Panel']],
]) {
  const d = findFuseData('Ford', model, parseInt(range));
  check(d && Array.isArray(d.panels), `prior lookup Ford ${model} ${range}`);
  if (!d || !Array.isArray(d.panels)) continue;
  for (const pn of panelNames) {
    const p = d.panels.find(p => p.name === pn);
    check(p && p.layout, `${model} ${range} "${pn}" still has layout (prior wave)`);
    if (p && p.layout) verifyPanelLayout(model, range, p);
  }
}

console.log(`TOTAL: ${total}  OK: ${ok}  FAIL: ${fail}`);
console.log(`LAYOUTS: ${layoutsChecked} checked  CELLS: ${cellsChecked} checked`);
if (fail) process.exit(1);
console.log(`PASS: Wave 5 Ford — ${layoutsChecked} layouts / ${cellsChecked} cells verified (0 failures)`);
