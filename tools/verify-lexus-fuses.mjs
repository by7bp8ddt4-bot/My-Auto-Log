/**
 * Wave 9 coverage check — every Lexus model in reference-specs.js must
 * resolve in fuse-boxes.js via the same lookup logic FuseBox.jsx uses.
 * Also asserts expected panel/fuse counts for the 4 researched models.
 * Run from repo root: node tools/verify-lexus-fuses.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { referenceSpecs } from '../src/data/reference-specs.js';

const TARGET_MAKES = ['lexus'];
// Wave 9 researched models (IS has specs but was not part of this fuse wave)
const RESEARCHED = ['es', 'nx', 'gx', 'rx'];

function findFuseData(make, model, year) {
  const makeLower = make.toLowerCase();
  const modelLower = model.toLowerCase();
  const makeData = fuseBoxData[makeLower];
  if (!makeData) return null;
  let modelData = makeData[modelLower];
  if (!modelData) {
    const modelKeys = Object.keys(makeData);
    const matchedKey = modelKeys.find(k => modelLower.startsWith(k) || k.startsWith(modelLower));
    if (matchedKey) modelData = makeData[matchedKey];
  }
  if (!modelData) return null;
  const numYear = parseInt(year);
  for (const [range, data] of Object.entries(modelData)) {
    const [start, end] = range.split('-').map(Number);
    if (numYear >= start && numYear <= end) return data;
  }
  return null;
}

let total = 0, ok = 0, fail = 0;
const failures = [];
for (const make of TARGET_MAKES) {
  const ref = referenceSpecs[make];
  if (!ref) { console.log(`!! reference-specs has no make '${make}'`); continue; }
  for (const [model, ranges] of Object.entries(ref)) {
    if (!RESEARCHED.includes(model)) {
      console.log(`  (info) ${make} / ${model} — not in wave 9 scope, skipping`);
      continue;
    }
    total++;
    const years = ranges ? Object.keys(ranges) : [];
    // Use the LATEST year range start — matches modern researched gens
    const yr = years.length ? Number(years[years.length - 1].split('-')[0]) : 2020;
    const data = findFuseData(make, model, yr);
    if (data && data.panels && data.panels.length >= 1) {
      ok++;
      if (data.panels.length < 2) console.log(`  (info) ${make} / ${model} has 1 panel`);
    } else {
      fail++;
      failures.push(`${make} / ${model} (year ${yr}) -> ${data ? 'panels:' + data.panels.length : 'NO DATA'}`);
    }
  }
}
console.log(`\nTOTAL models checked: ${total}`);
console.log(`OK: ${ok}  FAIL: ${fail}`);
if (failures.length) {
  console.log('\nFAILURES:');
  failures.forEach(f => console.log('  -', f));
  process.exit(1);
}

// Detailed spot checks for the 4 researched models
const spot = [
  ['Lexus', 'ES 350', '2022', 4],        // passenger + 3 engine boxes
  ['Lexus', 'ES 300h', '2024', 4],
  ['Lexus', 'NX 300', '2018', 4],        // passenger + 3 engine boxes
  ['Lexus', 'NX 200t', '2016', 4],
  ['Lexus', 'GX 460', '2015', 2],        // passenger + engine
  ['Lexus', 'RX 350', '2018', 2],        // 2016-2022 gen
  ['Lexus', 'RX 350', '2024', 3],        // 2023-2025 gen
  ['Lexus', 'RX 450h', '2021', 2],
  ['Lexus', 'RX 450h+', '2024', 3],
  ['Lexus', 'RX 500h', '2025', 3],
];
let spotPass = 0;
for (const [m, mo, y, expectPanels] of spot) {
  const d = findFuseData(m, mo, y);
  const got = d ? d.panels.length : 0;
  const pass = got === expectPanels;
  if (pass) spotPass++;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${m} ${mo} ${y} -> panels=${got} (expect ${expectPanels})`);
}
console.log(`\nSPOT: ${spotPass}/${spot.length} pass`);

const makeData = fuseBoxData.lexus;
const models = Object.keys(makeData);
console.log(`\nlexus model keys: ${models.join(', ')}`);
let totalFuses = 0;
for (const mdl of models) {
  for (const [yr, data] of Object.entries(makeData[mdl])) {
    const n = data.panels.reduce((a, p) => a + (p.fuses?.length || 0), 0);
    totalFuses += n;
    console.log(`  ${mdl} ${yr}: ${data.panels.length} panels, ${n} fuses`);
  }
}
console.log(`TOTAL LEXUS FUSES: ${totalFuses}`);
if (spotPass !== spot.length) process.exit(1);
console.log('ALL GOOD');
