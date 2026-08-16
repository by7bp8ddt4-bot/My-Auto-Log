// Wave 9 verifier — Nissan + Infiniti fuse layout diagrams.
// Module-based (imports fuseBoxData + findFuseData — no regex parsing of the
// source file). Checks: every layout cell pos resolves to a real fuses/relays
// entry; col/row/w/h positive ints within bounds; honest-gap panels assert NO
// layout; per-model layout counts exact; prior-wave regressions still resolve.
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
  // relays-only panels rule: if a layout exists, relays count as populated.
  const populated = positions.size >= 1;
  check(populated, `${tag}: panel has at least one fuse or relay`);
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
// ── Wave 9 mapped panels: [model, range, sampleYear, [panel names]] ────────
// Source generations (fuse-box.info): altima L34 2019-2025, frontier D41
// 2022-2025, sentra B18 2020-2025, maxima A36, versa N18, armada Y62, titan
// A61, leaf 2010-2017, q50 V37 (2013-2015 page, same V37 box through 2023),
// qx60/JX35 L50 2012-2017 page (same L50 box through 2021), qx50 EX 2013-2017
// + J55 2019-2022, qx80/Y62 2010-2017.
const mappedPanels = [
  ['altima',   '2019-2026', 2021, ['Interior Fuse Panel', 'Engine Compartment Fuse Box (IPDM E/R)', 'Engine Compartment Fuse Box (Additional)']],
  ['frontier', '2022-2026', 2023, ['Interior Fuse Panel', 'Engine Compartment Fuse Box (IPDM E/R)', 'Engine Compartment Fuse Box (Additional)']],
  ['sentra',   '2020-2026', 2022, ['Interior Fuse Panel', 'Engine Compartment Fuse Box (IPDM E/R)', 'Engine Compartment Fuse Box (Additional)']],
  ['maxima',   '2015-2023', 2019, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box №1', 'Engine Compartment Fuse Box №2']],
  ['versa',    '2020-2025', 2022, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box №1', 'Engine Compartment Fuse Box №2']],
  ['armada',   '2017-2024', 2020, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box №1', 'Engine Compartment Fuse Box №2', 'Engine Compartment Relay Box №1', 'Engine Compartment Relay Box №2']],
  ['titan',    '2016-2024', 2019, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box №1', 'Engine Compartment Fuse Box №2']],
  ['leaf',     '2010-2017', 2014, ['Instrument Panel Fuse Box', 'Front Compartment Fuse Box №1', 'Front Compartment Fuse Box №2', 'Front Compartment Fuse Box №3', 'Front Compartment Relay Box', 'Fusible Link Block (Battery)']],
  ['q50',      '2013-2023', 2018, ['Passenger Compartment Fuse Box (J/B)', 'Engine Compartment Fuse Box #1', 'Engine Compartment Fuse Box #2', 'Fusible Link Block']],
  ['qx60',     '2012-2021', 2017, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box #1', 'Engine Compartment Fuse Box #2', 'Relay Box #1', 'Relay Box #2', 'Fusible Link Block']],
  ['qx50',     '2013-2017', 2015, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box No.1', 'Engine Compartment Fuse Box No.2', 'Engine Compartment Fuse Box No.3', 'Fusible Link Block']],
  ['qx50',     '2019-2022', 2020, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box No.1', 'Engine Compartment Fuse Box No.2']],
  ['qx80',     '2010-2017', 2014, ['Passenger Compartment Fuse Box', 'Engine Compartment Fuse Box No.1', 'Engine Compartment Fuse Box No.2', 'Additional Fuse Holder', 'Relay Box No.1', 'Relay Box No.2', 'Fusible Link Block']],
];
// ── Honest gaps: panels exist but must have NO layout ─────────────────────
const gapPanels = [
  // pathfinder 2022-2026 (R53): no fuse-box.info page exists for the R53 at
  // all — app data is R53-era, nothing to match against.
  ['pathfinder', '2022-2026', 2024, ['Interior Fuse Panel', 'Engine Compartment Fuse Box (IPDM E/R)']],
  // rogue 2014-2024 (T32/T33): app data uses the T32-Rogue manual letter
  // scheme (E-N fusible links + 31-49 + 100/120 mega fuses); the only
  // Rogue-family page (X-Trail T32) numbers every slot 1-49 + A/N. Best
  // match 0.095/0.156 — physical slot numbering does not match.
  ['rogue',    '2014-2024', 2020, ['Engine Compartment Fuse Box (IPDM E/R)', 'Interior Fuse Panel (Cabin Fuse Box)']],
  // murano 2015-2024 (Z52): app data is a Rogue-T32-style copy (40/44 IPDM
  // pos+circuit overlap with rogue), NOT the real Z52 box (1-56 + F-M).
  // Best match 0.114/0.219.
  ['murano',   '2015-2024', 2019, ['Engine Compartment Fuse Box (IPDM E/R)', 'Interior Fuse Panel (Cabin Fuse Box)']],
  // frontier Relay Block (VTC CONT 1/2, INVERTER, H/SEAT at 1,2,3,5): matches
  // no source page (best 2/4 = 0.5 vs altima L34 by coincidence).
  ['frontier', '2022-2026', 2025, ['Engine Compartment Fuse Box (Relay Block)']],
];
// ── 1. Mapped panels ───────────────────────────────────────────────────────
for (const [model, range, sampleYear, panelNames] of mappedPanels) {
  const d = findFuseData('Nissan', model, sampleYear) || findFuseData('Infiniti', model, sampleYear);
  check(d && Array.isArray(d.panels), `findFuseData('${model}',${sampleYear}) resolves (${range})`);
  if (!d || !Array.isArray(d.panels)) continue;
  for (const pn of panelNames) {
    const p = d.panels.find(p => p.name === pn);
    check(Boolean(p), `${model} ${range}: panel "${pn}" exists`);
    check(p && p.layout, `${model} ${range}: "${pn}" has layout (Wave 9)`);
    if (p && p.layout) verifyPanelLayout(model, range, p);
  }
}
// ── 2. Honest gaps ─────────────────────────────────────────────────────────
for (const [model, range, sampleYear, panelNames] of gapPanels) {
  const d = findFuseData('Nissan', model, sampleYear) || findFuseData('Infiniti', model, sampleYear);
  check(d && Array.isArray(d.panels), `gap lookup ${model} ${range}`);
  if (!d || !Array.isArray(d.panels)) continue;
  for (const pn of panelNames) {
    const p = d.panels.find(p => p.name === pn);
    check(Boolean(p), `gap panel ${model} ${range} "${pn}" exists`);
    check(p && !p.layout, `${model} ${range} "${pn}" has NO layout (honest gap — app data does not match any source diagram's slot numbering)`);
  }
}
// ── 3. Per-model layout count guard ────────────────────────────────────────
// Wave 9 expected per-model totals (qx50 spans two year-blocks: 5 + 3).
const expectedLayouts = {
  'altima': 3, 'frontier': 3, 'sentra': 3, 'maxima': 3, 'versa': 3,
  'armada': 5, 'titan': 3, 'leaf': 6, 'q50': 4, 'qx60': 6, 'qx50': 8, 'qx80': 7,
};
const walkCounts = {};
for (const [make, models] of Object.entries(fuseBoxData)) {
  if (make !== 'nissan' && make !== 'infiniti') continue;
  for (const [model, ranges] of Object.entries(models || {})) {
    for (const data of Object.values(ranges || {})) {
      for (const p of data.panels || []) {
        if (p.layout) walkCounts[model] = (walkCounts[model] || 0) + 1;
      }
    }
  }
}
for (const [model, expected] of Object.entries(expectedLayouts)) {
  const actual = walkCounts[model] || 0;
  check(actual === expected, `${model}: exactly ${expected} layout(s) in data (found ${actual})`);
}
// no OTHER nissan/infiniti model may carry a layout (gaps must stay clean)
for (const [make, models] of Object.entries(fuseBoxData)) {
  if (make !== 'nissan' && make !== 'infiniti') continue;
  for (const [model, ranges] of Object.entries(models || {})) {
    if (expectedLayouts[model]) continue;
    const n = Object.values(ranges || {}).reduce((a, d) =>
      a + (d.panels || []).filter(p => p.layout).length, 0);
    check(n === 0, `${model}: no layouts expected (found ${n})`);
  }
}
const totalWave9 = Object.values(expectedLayouts).reduce((a, b) => a + b, 0);
check(totalWave9 === 54, `Wave 9 scope totals 54 layouts (found ${totalWave9} expected)`);
// ── 4. Prior-wave layouts must still resolve ───────────────────────────────
const priorSamples = [
  ['silverado1500', 2021, 2],   // Wave 1 (2019-2024)
  ['corolla', 2020, 1],         // Wave 3
  ['fusion', 2018, 3],          // Wave 5 (2018-2020)
  ['equinox', 2020, 3],         // Wave 6
  ['3 series', 2015, 3],        // Wave 7 (2006-2018 F30-era block)
  ['c-class', 2018, 4],         // Wave 8 (W205-era block)
];
for (const [model, sampleYear, minLayouts] of priorSamples) {
  const d = findFuseData('Chevrolet', model, sampleYear) ||
            findFuseData('Toyota', model, sampleYear) ||
            findFuseData('Ford', model, sampleYear) ||
            findFuseData('BMW', model, sampleYear) ||
            findFuseData('Mercedes', model, sampleYear);
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
console.log(`PASS: Wave 9 Nissan+Infiniti — ${layoutsChecked} layouts / ${cellsChecked} cells verified (0 failures)`);
