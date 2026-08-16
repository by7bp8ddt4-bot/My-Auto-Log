// Wave 7 — BMW fuse layout verifier (module-based; imports the real data +
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
// ── Wave 7 mapped panels: [model, range, sampleYear, [panel names]] ────────
// sampleYear resolves UNIQUELY to the intended range (findFuseData first-match).
// NOTE: overlapping BMW ranges (e.g. '3 series' 2006-2018 then 2019-2024) —
// sample years chosen strictly inside each target range.
const mappedPanels = [
  ['3 series', '2006-2018', 2015, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['4 series', '2014-2026', 2017, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['328i', '2007-2018', 2014, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['330i', '2001-2024', 2017, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['335i', '2007-2015', 2013, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['340i', '2016-2024', 2018, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['330e', '2016-2024', 2018, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['m3', '2008-2024', 2016, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
];
// ── Honest gaps: panels exist but must have NO layout ─────────────────────
// App data for these blocks is an F30-era copy applied to vehicles with no
// F30/F32/F80-era production — mapping the F30 layout would mislead.
const gapModels = [
  ['3 series', '2019-2024', 2021, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['5 series', '2005-2016', 2010, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['5 series', '2017-2024', 2020, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['528i', '2005-2016', 2010, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['530i', '2006-2024', 2010, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['535i', '2005-2016', 2010, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['540i', '1997-2024', 2005, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['530e', '2017-2024', 2020, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['m5', '2005-2024', 2010, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)', 'Glovebox Fuse Panel']],
  ['x3', '2006-2010', 2008, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)']],
  ['x3', '2011-2024', 2015, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)']],
  ['x5', '2006-2013', 2010, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)']],
  ['x5', '2014-2024', 2017, ['Front Power Distribution Box', 'Rear Power Distribution Box (Trunk)']],
];
// ── 1. Mapped panels ───────────────────────────────────────────────────────
for (const [model, range, sampleYear, panelNames] of mappedPanels) {
  const d = findFuseData('BMW', model, sampleYear);
  check(d && Array.isArray(d.panels), `findFuseData('BMW','${model}',${sampleYear}) resolves (${range})`);
  if (!d || !Array.isArray(d.panels)) continue;
  for (const pn of panelNames) {
    const p = d.panels.find(p => p.name === pn);
    check(Boolean(p), `${model} ${range}: panel "${pn}" exists`);
    check(p && p.layout, `${model} ${range}: "${pn}" has layout (Wave 7)`);
    if (p && p.layout) verifyPanelLayout(model, range, p);
  }
}
// ── 2. Honest gaps ─────────────────────────────────────────────────────────
for (const [model, range, sampleYear, panelNames] of gapModels) {
  const d = findFuseData('BMW', model, sampleYear);
  check(d && Array.isArray(d.panels), `gap lookup ${model} ${range}`);
  if (!d || !Array.isArray(d.panels)) continue;
  for (const pn of panelNames) {
    const p = d.panels.find(p => p.name === pn);
    check(Boolean(p), `gap panel ${model} ${range} "${pn}" exists`);
    check(p && !p.layout, `${model} ${range} "${pn}" has NO layout (honest gap — app data is an F30-era copy, no F30-era production in range)`);
  }
}
// ── 3. Per-model layout count guard ────────────────────────────────────────
const expectedLayouts = {
  '3 series': 3, '4 series': 3, '328i': 3, '330i': 3,
  '335i': 3, '340i': 3, '330e': 3, 'm3': 3,
};
const walkCounts = {};
for (const [model, ranges] of Object.entries(fuseBoxData.bmw)) {
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
const totalWave7 = Object.values(expectedLayouts).reduce((a, b) => a + b, 0);
check(totalWave7 === 24, `Wave 7 scope totals 24 layouts (found ${totalWave7} expected)`);
// ── 4. Prior-wave layouts must still resolve ───────────────────────────────
const priorSamples = [
  ['silverado1500', 2021, 2],   // Wave 1 (2019-2024)
  ['corolla', 2020, 1],         // Wave 3
  ['fusion', 2018, 3],          // Wave 5 (2018-2020)
  ['equinox', 2020, 3],         // Wave 6
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
console.log(`PASS: Wave 7 BMW — ${layoutsChecked} layouts / ${cellsChecked} cells verified (0 failures)`);
