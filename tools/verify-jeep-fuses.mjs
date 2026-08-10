/**
 * Wave 7 coverage check — Jeep models in fuse-boxes.js must resolve via the
 * same lookup logic FuseBox.jsx uses (makeLower -> modelLower -> year range).
 * Run from repo root: node tools/verify-jeep-fuses.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';

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

const cases = [
  // [make, model, year, expectedPanels, note]
  ['Jeep', 'Grand Cherokee', 2020, 1, 'WK2 TIPM (single under-hood module)'],
  ['Jeep', 'Grand Cherokee', 2021, 1, 'WK2 TIPM'],
  ['Jeep', 'Grand Cherokee', 2022, 3, 'WL interior + front + rear PDC'],
  ['Jeep', 'Grand Cherokee', 2026, 3, 'WL'],
  ['Jeep', 'Wrangler', 2020, 1, 'JL PDC'],
  ['Jeep', 'Wrangler', 2021, 1, 'JL PDC 2019-21 layout'],
  ['Jeep', 'Wrangler', 2022, 1, 'JL PDC 2024-26 layout'],
  ['Jeep', 'Wrangler', 2026, 1, 'JL PDC'],
  ['Jeep', 'Cherokee', 2020, 2, 'KL interior + underhood'],
  ['Jeep', 'Cherokee', 2023, 2, 'KL'],
  ['Jeep', 'Gladiator', 2020, 1, 'JT PDC'],
  ['Jeep', 'Gladiator', 2026, 1, 'JT PDC'],
  ['Jeep', 'Renegade', 2020, 4, 'BU engine + dash + luggage + trailer'],
  ['Jeep', 'Renegade', 2023, 4, 'BU'],
  // out-of-production / not-yet checks
  ['Jeep', 'Cherokee', 2024, null, 'discontinued after 2023 -> null'],
  ['Jeep', 'Renegade', 2024, null, 'discontinued after 2023 -> null'],
];

let fail = 0;
for (const [make, model, year, expected, note] of cases) {
  const data = findFuseData(make, model, year);
  const got = data ? data.panels.length : null;
  const ok = got === expected;
  if (!ok) fail++;
  console.log(`${ok ? 'OK ' : 'FAIL'} ${make} ${model} ${year}: panels=${got} (expected ${expected}) ${ok ? '' : '— ' + note}`);
}

// per-panel fuse counts for the record
const models = [
  ['Grand Cherokee', 2020], ['Grand Cherokee', 2025], ['Wrangler', 2020],
  ['Wrangler', 2025], ['Cherokee', 2021], ['Gladiator', 2023], ['Renegade', 2021],
];
for (const [m, y] of models) {
  const data = findFuseData('Jeep', m, y);
  if (!data) { console.log('!! no data', m, y); continue; }
  const summary = data.panels.map(p =>
    `${p.name}: ${p.fuses ? p.fuses.length : 0} fuses${p.relays ? ' + ' + p.relays.length + ' relays' : ''}`).join(' | ');
  console.log(`  ${m} ${y} -> ${summary}`);
}

console.log(fail === 0 ? '\nALL CHECKS PASS' : `\n${fail} FAILURES`);
process.exit(fail === 0 ? 0 : 1);
