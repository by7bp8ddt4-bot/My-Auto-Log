// Wave 6 — Chevrolet fuse layout verifier (module-based; imports the real
// data + lookup, no regex parsing of the source file).
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData } from '../src/components/FuseBox.jsx';

let fail = 0, ok = 0, total = 0;
const check = (c, m) => { total++; if (c) ok++; else { fail++; console.log('FAIL:', m); } };
let cellsChecked = 0;
let layoutsChecked = 0;

function verifyPanelLayout(model, range, panel) {
  layoutsChecked++;
  const positions = new Set([
    ...(panel.fuses || []).map(f => f.pos),
    ...(panel.relays || []).map(r => r.pos),
  ]);
  const tag = `${model} ${range} ${panel.name}`;
  check(Number.isInteger(panel.layout.cols) && panel.layout.cols >= 1, `${tag}: layout.cols positive int (got ${panel.layout.cols})`);
  check(Number.isInteger(panel.layout.rows) && panel.layout.rows >= 1, `${tag}: layout.rows positive int (got ${panel.layout.rows})`);
  const cells = panel.layout.cells || {};
  const cellKeys = Object.keys(cells);
  check(cellKeys.length >= 1, `${tag}: layout has cells`);
  for (const [pos, cell] of Object.entries(cells)) {
    cellsChecked++;
    check(positions.has(pos), `${tag}: layout cell '${pos}' not in panel fuses/relays`);
    check(Number.isInteger(cell.col) && cell.col >= 1, `${tag}: cell '${pos}' col positive int (got ${cell.col})`);
    check(Number.isInteger(cell.row) && cell.row >= 1, `${tag}: cell '${pos}' row positive int (got ${cell.row})`);
    check(Number.isInteger(cell.w) && cell.w >= 1, `${tag}: cell '${pos}' w positive int (got ${cell.w})`);
    check(Number.isInteger(cell.h) && cell.h >= 1, `${tag}: cell '${pos}' h positive int (got ${cell.h})`);
    check(cell.col <= panel.layout.cols, `${tag}: cell '${pos}' col ${cell.col} within cols ${panel.layout.cols}`);
    check(cell.row <= panel.layout.rows, `${tag}: cell '${pos}' row ${cell.row} within rows ${panel.layout.rows}`);
  }
}

// ── Wave 6 mapped panels: [model, range, sampleYear, [panel names]] ────────
// sampleYear resolves UNIQUELY to the intended range (findFuseData first-match).
const mappedPanels = [
  ['equinox', '2018-2024', 2020, ['Instrument Panel Fuse Block', 'Engine Compartment Fuse Block', 'Luggage Compartment Fuse Block']],
  ['equinox', '2025-2026', 2025, ['Engine Compartment Fuse Box', 'Passenger Compartment Fuse Box']],
  ['traverse', '2018-2023', 2020, ['Instrument Panel Fuse Box', 'Engine Compartment Fuse Block', 'Rear Compartment Fuse Block']],
  ['traverse', '2024-2026', 2025, ['Engine Compartment Fuse Box', 'Passenger Compartment Fuse Box', 'Rear Compartment Fuse Box']],
  ['malibu', '2016-2018', 2017, ['Instrument Panel Fuse Box', 'Engine Compartment Fuse Box']],
  ['malibu', '2019-2025', 2021, ['Instrument Panel Fuse Box', 'Engine Compartment Fuse Box']],
  ['camaro', '2016-2018', 2017, ['Engine Compartment Fuse Block', 'Luggage Compartment Fuse Block']],
  ['camaro', '2019-2024', 2021, ['Engine Compartment Fuse Block', 'Luggage Compartment Fuse Block']],
  ['colorado', '2015-2016', 2015, ['Instrument Panel Fuse Block', 'Engine Compartment Fuse Block']],
  ['colorado', '2017-2017', 2017, ['Instrument Panel Fuse Block', 'Engine Compartment Fuse Block']],
  ['colorado', '2018-2018', 2018, ['Instrument Panel Fuse Block', 'Engine Compartment Fuse Block']],
  ['colorado', '2019-2021', 2020, ['Instrument Panel Fuse Block', 'Engine Compartment Fuse Block']],
  ['colorado', '2022-2022', 2022, ['Instrument Panel Fuse Block', 'Engine Compartment Fuse Block']],
  ['colorado', '2023-2026', 2023, ['Engine Compartment Fuse Box', 'Accessory Fuse Block', 'Passenger Compartment Fuse Box']],
  ['trax', '2013-2017', 2015, ['Instrument Panel Fuse Box', 'Engine Compartment Fuse Box', 'Auxiliary Relay Block', 'Rear Compartment Fuse Box']],
  ['trax', '2018-2022', 2020, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box', 'Auxiliary Relay Block']],
  ['trax', '2024-2026', 2025, ['Engine Compartment Fuse Box', 'Passenger Compartment Fuse Box']],
  ['tahoe', '2015-2020', 2017, ["Instrument Panel Fuse Block No.1 (Driver's Side)", "Instrument Panel Fuse Block No.2 (Passenger's Side)", 'Engine Compartment Fuse Block', 'Luggage Compartment Fuse Block']],
  ['tahoe', '2021-2024', 2022, ['Instrument Panel Fuse Block', 'Engine Compartment Fuse Block', 'Rear Compartment Fuse Block']],
  ['tahoe', '2025-2026', 2025, ['Instrument Panel Fuse Block', 'Engine Compartment Fuse Block', 'Rear Compartment Fuse Block']],
  ['suburban', '2015-2020', 2017, ["Instrument Panel Fuse Block No.1 (Driver's Side)", "Instrument Panel Fuse Block No.2 (Passenger's Side)", 'Engine Compartment Fuse Block', 'Luggage Compartment Fuse Block']],
  ['suburban', '2021-2024', 2022, ['Instrument Panel Fuse Block', 'Engine Compartment Fuse Block', 'Rear Compartment Fuse Block']],
  ['suburban', '2025-2026', 2025, ['Instrument Panel Fuse Block', 'Engine Compartment Fuse Block', 'Rear Compartment Fuse Block']],
  ['bolt', '2016-2023', 2019, ['Instrument Panel Fuse Box', 'Engine Compartment Fuse Box']],
];

// ── Honest gaps: panel exists but must have NO layout ─────────────────────
const gapPanels = [
  ['trax', '2018-2022', 2020, 'Rear Compartment Fuse Box'],
];

// ── 1. Mapped panels ───────────────────────────────────────────────────────
for (const [model, range, sampleYear, panelNames] of mappedPanels) {
  const d = findFuseData('Chevrolet', model, sampleYear);
  check(d && Array.isArray(d.panels), `findFuseData('Chevrolet','${model}',${sampleYear}) resolves (${range})`);
  if (!d || !Array.isArray(d.panels)) continue;
  for (const pn of panelNames) {
    const p = d.panels.find(p => p.name === pn);
    check(Boolean(p), `${model} ${range}: panel "${pn}" exists`);
    check(p && p.layout, `${model} ${range}: "${pn}" has layout (Wave 6)`);
    if (p && p.layout) verifyPanelLayout(model, range, p);
  }
}

// ── 2. Honest gaps ─────────────────────────────────────────────────────────
for (const [model, range, sampleYear, pn] of gapPanels) {
  const d = findFuseData('Chevrolet', model, sampleYear);
  check(d && Array.isArray(d.panels), `gap lookup ${model} ${range}`);
  if (!d || !Array.isArray(d.panels)) continue;
  const p = d.panels.find(p => p.name === pn);
  check(Boolean(p), `gap panel ${model} ${range} "${pn}" exists`);
  check(p && !p.layout, `${model} ${range} "${pn}" has NO layout (honest gap — app data numbering does not match source diagram)`);
}

// ── 3. sonic / bolt euv: absent models (documented gaps) ───────────────────
check(!fuseBoxData.chevrolet || !fuseBoxData.chevrolet['sonic'], 'sonic absent from fuseBoxData.chevrolet (documented gap)');
check(findFuseData('Chevrolet', 'sonic', 2016) === null, 'findFuseData(Chevrolet, sonic, 2016) returns null');
const be = fuseBoxData.chevrolet['bolt euv'] || {};
check(Object.keys(be).length >= 1, 'bolt euv present in data');
check(Object.values(be).flatMap(r => (r.panels || []).filter(p => p.layout)).length === 0, 'bolt euv has NO layouts (out of scope, untouched)');

// ── 4. Per-model layout count guard ────────────────────────────────────────
const expectedLayouts = {
  equinox: 5, traverse: 6, malibu: 4, camaro: 4, colorado: 13,
  trax: 9, tahoe: 10, suburban: 10, bolt: 2,
};
const walkCounts = {};
for (const [model, ranges] of Object.entries(fuseBoxData.chevrolet)) {
  for (const data of Object.values(ranges || {})) {
    for (const p of data.panels || []) {
      if (p.layout) walkCounts[model] = (walkCounts[model] || 0) + 1;
    }
  }
}
for (const [model, expected] of Object.entries(expectedLayouts)) {
  const actual = walkCounts[model] || 0;
  check(actual === expected, `${model}: exactly ${expected} layout(s) in data (found ${actual})`);
}
const totalWave6 = Object.values(expectedLayouts).reduce((a, b) => a + b, 0);
check(totalWave6 === 63, `Wave 6 scope totals 63 layouts (found ${totalWave6} expected)`);

// ── 5. Prior-wave layouts must still resolve ───────────────────────────────
const priorSamples = [
  ['silverado1500', 2021, 2],   // Wave 1 (2019-2024; 2014-2018 range carries no layouts)
  ['silverado1500', 2021, 2],   // Wave 1 (2019-2024)
  ['corolla', 2020, 1],         // Wave 3
  ['fusion', 2018, 3],          // Wave 5 (2018-2020)
];
for (const [model, sampleYear, minLayouts] of priorSamples) {
  const d = findFuseData('Chevrolet', model, sampleYear) ||
            findFuseData('Toyota', model, sampleYear) ||
            findFuseData('Ford', model, sampleYear);
  check(d && Array.isArray(d.panels), `prior lookup ${model} ${sampleYear}`);
  if (!d || !Array.isArray(d.panels)) continue;
  let n = 0;
  for (const p of d.panels) {
    if (p.layout) { n++; verifyPanelLayout(model, String(sampleYear), p); }
  }
  check(n >= minLayouts, `${model} ${sampleYear}: at least ${minLayouts} prior layout(s) still resolve (found ${n})`);
}

console.log(`TOTAL: ${total}  OK: ${ok}  FAIL: ${fail}`);
console.log(`LAYOUTS: ${layoutsChecked} checked  CELLS: ${cellsChecked} checked`);
if (fail) process.exit(1);
console.log(`PASS: Wave 6 Chevrolet — ${layoutsChecked} layouts / ${cellsChecked} cells verified (0 failures)`);
