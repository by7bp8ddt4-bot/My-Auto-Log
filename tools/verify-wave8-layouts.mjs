// Wave 8 — Mercedes fuse layout verifier (module-based; imports the real data +
// lookup, no regex parsing of the source file).
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
// ── Wave 8 mapped panels: [model, range, sampleYear, [panel names]] ────────
// Each Mercedes model has exactly ONE year block, so sample years are unique
// per model (no findFuseData first-match overlap). Source generation:
// W205 C-Class 2015-2018 / GLC X253 2015-2019 (MRA platform).
const PANELS = ['Engine Compartment Fuse Box', 'Front SAM Fuse Panel (Driver Side)',
                'Passenger Footwell Fuse Panel', 'Trunk Fuse Panel (Rear SAM)'];
const mappedPanels = [
  ['c-class', '2008-2024', 2018, PANELS],
  ['c 300',   '2008-2024', 2020, PANELS],
  ['c 43',    '2016-2024', 2018, PANELS],
  ['c 63',    '2008-2024', 2016, PANELS],
  ['glc',     '2016-2024', 2017, PANELS],
  ['glc 300', '2016-2024', 2020, PANELS],
  ['glc 43',  '2017-2024', 2019, PANELS],
  ['glc 63',  '2017-2024', 2018, PANELS],
];
// ── Honest gaps: panels exist but must have NO layout ─────────────────────
// App data for these blocks is the W205/X253-era dataset applied to vehicles
// with no W205/X253-era production (E-Class, GLE, ML use different fuse boxes
// in every generation) — mapping the W205 layout would mislead.
const gapModels = [
  ['e-class', '2006-2024', 2018],
  ['e 350',   '2006-2018', 2012],
  ['e 300',   '2017-2024', 2020],
  ['e 450',   '2019-2024', 2020],
  ['e 63',    '2007-2024', 2015],
  ['gle',     '2016-2024', 2018],
  ['gle 350', '2016-2024', 2018],
  ['gle 450', '2016-2024', 2019],
  ['gle 53',  '2020-2024', 2021],
  ['gle 63',  '2016-2024', 2018],
  ['ml 350',  '2006-2015', 2010],
];
// ── 1. Mapped panels ───────────────────────────────────────────────────────
for (const [model, range, sampleYear, panelNames] of mappedPanels) {
  const d = findFuseData('Mercedes', model, sampleYear);
  check(d && Array.isArray(d.panels), `findFuseData('Mercedes','${model}',${sampleYear}) resolves (${range})`);
  if (!d || !Array.isArray(d.panels)) continue;
  for (const pn of panelNames) {
    const p = d.panels.find(p => p.name === pn);
    check(Boolean(p), `${model} ${range}: panel "${pn}" exists`);
    check(p && p.layout, `${model} ${range}: "${pn}" has layout (Wave 8)`);
    if (p && p.layout) verifyPanelLayout(model, range, p);
  }
}
// ── 2. Honest gaps ─────────────────────────────────────────────────────────
for (const [model, range, sampleYear] of gapModels) {
  const d = findFuseData('Mercedes', model, sampleYear);
  check(d && Array.isArray(d.panels), `gap lookup ${model} ${range}`);
  if (!d || !Array.isArray(d.panels)) continue;
  for (const pn of PANELS) {
    const p = d.panels.find(p => p.name === pn);
    check(Boolean(p), `gap panel ${model} ${range} "${pn}" exists`);
    check(p && !p.layout, `${model} ${range} "${pn}" has NO layout (honest gap — app data is a W205/X253-era copy, no W205/X253-era production in range)`);
  }
}
// ── 3. Per-model layout count guard ────────────────────────────────────────
const expectedLayouts = {
  'c-class': 4, 'c 300': 4, 'c 43': 4, 'c 63': 4,
  'glc': 4, 'glc 300': 4, 'glc 43': 4, 'glc 63': 4,
};
const walkCounts = {};
for (const [model, ranges] of Object.entries(fuseBoxData.mercedes)) {
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
// no OTHER mercedes model may carry a layout (gap models must stay clean)
for (const [model, ranges] of Object.entries(fuseBoxData.mercedes)) {
  if (expectedLayouts[model]) continue;
  const n = Object.values(ranges || {}).reduce((a, d) =>
    a + (d.panels || []).filter(p => p.layout).length, 0);
  check(n === 0, `${model}: no layouts expected (found ${n})`);
}
const totalWave8 = Object.values(expectedLayouts).reduce((a, b) => a + b, 0);
check(totalWave8 === 32, `Wave 8 scope totals 32 layouts (found ${totalWave8} expected)`);
// ── 4. Prior-wave layouts must still resolve ───────────────────────────────
const priorSamples = [
  ['silverado1500', 2021, 2],   // Wave 1 (2019-2024)
  ['corolla', 2020, 1],         // Wave 3
  ['fusion', 2018, 3],          // Wave 5 (2018-2020)
  ['equinox', 2020, 3],         // Wave 6
  ['3 series', 2015, 3],        // Wave 7 (2006-2018 F30-era block)
];
for (const [model, sampleYear, minLayouts] of priorSamples) {
  const d = findFuseData('Chevrolet', model, sampleYear) ||
            findFuseData('Toyota', model, sampleYear) ||
            findFuseData('Ford', model, sampleYear) ||
            findFuseData('BMW', model, sampleYear);
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
console.log(`PASS: Wave 8 Mercedes — ${layoutsChecked} layouts / ${cellsChecked} cells verified (0 failures)`);
