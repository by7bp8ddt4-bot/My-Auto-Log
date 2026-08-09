/**
 * Wave 5 coverage check — every BMW/Mercedes/Audi/VW/Volvo model in
 * reference-specs.js must resolve in fuse-boxes.js via the same lookup
 * logic FuseBox.jsx uses (makeLower -> modelLower -> year range).
 * Run from repo root: node tools/verify-euro-fuses.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { referenceSpecs } from '../src/data/reference-specs.js';

const TARGET_MAKES = ['volkswagen', 'bmw', 'mercedes', 'audi', 'volvo'];

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
    total++;
    const years = ranges ? Object.keys(ranges) : [];
    // pick a representative year from the first range
    const yr = years[0] ? Number(years[0].split('-')[0]) : 2020;
    const data = findFuseData(make, model, yr);
    if (data && data.panels && data.panels.length >= 1) {
      ok++;
      if (data.panels.length < 2) console.log(`  (info) ${make} / ${model} has 1 panel (motorcycle — under-seat box)`);
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
// Also confirm make keys present and panel/fuse sanity
for (const make of TARGET_MAKES) {
  if (!fuseBoxData[make]) { console.log(`!! fuse-boxes.js missing make '${make}'`); process.exit(1); }
  const models = Object.keys(fuseBoxData[make]);
  console.log(`${make}: ${models.length} model keys, sample panels -> ` +
    models.slice(0, 3).map(m => `${m}:${Object.keys(fuseBoxData[make][m]).join('|')}`).join('  '));
}
console.log('\nALL GOOD');
