#!/usr/bin/env bun
/**
 * Oldsmobile backfill coverage check — every model added in this wave must
 * resolve through the SAME lookup FuseBox.jsx uses. Run from repo root:
 *   bun /home/team/shared/vehicle-data/wave-oldsmobile/verify-oldsmobile.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData, matchModelKey } from '../src/components/FuseBox.jsx';

// (make, display-name as typed/VPIC, canonical model key, [sample years in-range])
const MODELS = [
  ['Oldsmobile', '88',            '88',       [1994, 1996, 1999]],
  ['Oldsmobile', 'eighty eight',  '88',       [1995, 1998]],        // word-spelling of 88
  ['Oldsmobile', 'Delta 88',      '88',       [1994, 1997]],        // marketing name for the 8th-gen
  ['Oldsmobile', 'Achieva',       'achieva',  [1992, 1995, 1998]],
  ['Oldsmobile', 'alero',         'alero',    [1999, 2001, 2004]],
  ['Oldsmobile', 'Aurora',        'aurora',   [1997, 1998, 1999, 2001, 2003]],
  ['Oldsmobile', 'BRAVADA',       'bravada',  [1999, 2001, 2002, 2004]],
  ['Oldsmobile', 'Cutlass',       'cutlass',  [1997, 1998, 1999]],
  ['Oldsmobile', 'intrigue',      'intrigue', [2000, 2001, 2002]],
  ['Oldsmobile', 'Silhouette',    'silhouette', [1999, 2000, 2002, 2004]],
];
// ('Oldsmobile', 'Cutlass Supreme', ...) etc are honest gaps -> must NOT resolve
const GAPS = [
  ['Oldsmobile', '98', 1998],
  ['Oldsmobile', 'ninety eight', 1995],
  ['Oldsmobile', '442', 1970],
  ['Oldsmobile', 'toronado', 1990],
  ['Oldsmobile', 'cutlass supreme', 1995],
  ['Oldsmobile', 'cutlass ciera', 1990],
  ['Oldsmobile', 'custom cruiser', 1992],
  ['Oldsmobile', 'silhouette', 1998],   // pre-1999 Silhouette has no page
  ['Oldsmobile', '88', 1993],           // pre-1994 88 has no page
  ['Oldsmobile', 'alero', 2005],
  ['Oldsmobile', 'achieva', 1991],
  ['Oldsmobile', 'aurora', 1996],
  ['Oldsmobile', 'bravada', 1998],
  ['Oldsmobile', 'cutlass', 1996],
  ['Oldsmobile', 'intrigue', 2003],
  ['Oldsmobile', 'silhouette', 2005],
];
// trim-level / VPIC refinements (leading-token refinement must resolve)
const REFINED = [
  ['Oldsmobile', 'Alero GLS', 2002],
  ['Oldsmobile', 'Aurora 4.0', 2001],
  ['Oldsmobile', 'Bravada AWD', 2003],
  ['Oldsmobile', 'Cutlass GL', 1998],
  ['Oldsmobile', 'Intrigue GLS', 2001],
  ['Oldsmobile', 'Silhouette Premiere', 2001],
  ['Oldsmobile', '88 LS', 1997],
];

let fail = 0, ok = 0, total = 0;
const check = (cond, msg) => {
  total++;
  if (cond) ok++; else { fail++; console.log(`FAIL: ${msg}`); }
};

// 1. structure + in-range lookups (case-insensitive display names)
for (const [make, display, key, years] of MODELS) {
  const makeData = fuseBoxData[make.toLowerCase()];
  check(makeData && makeData[key], `structure: ${make} / ${key} missing in fuseBoxData`);
  const matched = matchModelKey(makeData, display);
  check(matched === key, `keymatch: "${display}" -> ${matched} (expected ${key})`);
  for (const yr of years) {
    const data = findFuseData(make, display, yr);
    check(data && data.panels && data.panels.length >= 1,
      `lookup: ${make} / ${display} / ${yr} -> ${data ? 'panels:' + data.panels.length : 'NO DATA'}`);
  }
}
// 2. make-stripped model ("Oldsmobile 88" as the model field, e.g. from free-text)
for (const [modelStr, yr] of [['oldsmobile 88', 1996], ['oldsmobile alero', 2000]]) {
  const data = findFuseData('Oldsmobile', modelStr, yr);
  check(data && data.panels.length >= 1, `make-strip: Oldsmobile / "${modelStr}" / ${yr} -> NO DATA`);
}
// 3. trim-level / VPIC refinements
for (const [make, model, yr] of REFINED) {
  const data = findFuseData(make, model, yr);
  check(data && data.panels && data.panels.length >= 1,
    `refined: ${make} / ${model} / ${yr} -> ${data ? 'panels:' + data.panels.length : 'NO DATA'}`);
}
// 4. honest gaps + out-of-range negatives must return null
for (const [make, model, yr] of GAPS) {
  const data = findFuseData(make, model, yr);
  check(data === null || data === undefined, `negative: ${make} / ${model} / ${yr} should be null, got panels`);
}
// 5. cross-make negatives (same model name under a different make must NOT resolve)
for (const [make, model, yr] of [
  ['Buick', 'Cutlass', 1998],
  ['Pontiac', 'Alero', 2000],
  ['Chevrolet', 'Silhouette', 2000],
  ['Oldsmobile', 'Grand Prix', 2000],
  ['Oldsmobile', 'Vibe', 2003],
  ['Oldsmobile', 'Aztek', 2001],
]) {
  const data = findFuseData(make, model, yr);
  check(data === null || data === undefined, `cross-make: ${make} / ${model} / ${yr} should be null, got panels`);
}
// 6. prior-wave regression — Pontiac (last merged wave) must still resolve
const REGRESSION = [
  ['Pontiac', 'Grand Prix', 2005],
  ['Pontiac', 'Grand Am GT', 2003],
  ['Pontiac', 'Firebird Trans Am', 1999],
  ['Pontiac', 'Vibe GT', 2005],
  ['Pontiac', 'Montana SV6 AWD', 2007],
  ['Pontiac', 'Sunfire', 1998],
  ['Pontiac', 'G6', 2008],
  ['Buick', 'LaCrosse', 2012],
  ['Buick', 'LeSabre', 2003],
  ['Mazda', '3', 2015],
  ['Mazda', '6', 2018],
  ['Mazda', 'MX-5 Miata', 2016],
  ['Chevrolet', 'Silverado 1500', 2020],
  ['Toyota', 'Camry', 2020],
];
for (const [make, model, yr] of REGRESSION) {
  const data = findFuseData(make, model, yr);
  check(data && data.panels && data.panels.length >= 1,
    `regression: ${make} / ${model} / ${yr} -> ${data ? 'panels:' + data.panels.length : 'NO DATA'}`);
}
// 7. panel counts per year block (spot sanity)
const EXPECT_PANELS = [
  ['Oldsmobile', '88', 1997, 2],
  ['Oldsmobile', 'achieva', 1994, 3],
  ['Oldsmobile', 'alero', 2000, 3],
  ['Oldsmobile', 'alero', 2003, 3],
  ['Oldsmobile', 'aurora', 1998, 4],
  ['Oldsmobile', 'aurora', 2002, 2],
  ['Oldsmobile', 'bravada', 2000, 2],
  ['Oldsmobile', 'bravada', 2003, 2],
  ['Oldsmobile', 'cutlass', 1998, 3],
  ['Oldsmobile', 'intrigue', 2001, 2],
  ['Oldsmobile', 'silhouette', 1999, 2],
  ['Oldsmobile', 'silhouette', 2003, 2],
];
for (const [make, model, yr, want] of EXPECT_PANELS) {
  const data = findFuseData(make, model, yr);
  check(data && data.panels.length === want, `panel-count: ${make} / ${model} / ${yr} -> ${data ? data.panels.length : 'NO DATA'} (expected ${want})`);
}
// 8. total Oldsmobile coverage summary
const om = fuseBoxData.oldsmobile || {};
let models = 0, panels = 0, fuses = 0;
for (const mk of Object.keys(om)) {
  models++;
  for (const yr of Object.keys(om[mk])) {
    for (const p of om[mk][yr].panels) {
      panels++;
      fuses += (p.fuses ? p.fuses.length : 0) + (p.relays ? p.relays.length : 0);
    }
  }
}
console.log(`Oldsmobile coverage: ${models} model keys / ${panels} panels / ${fuses} fuse+relay entries`);
console.log(`TOTAL checks: ${total}  OK: ${ok}  FAIL: ${fail}`);
process.exit(fail ? 1 : 0);
