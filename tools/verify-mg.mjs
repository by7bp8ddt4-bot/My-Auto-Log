#!/usr/bin/env bun
/**
 * MG backfill coverage check — every model added in this wave must
 * resolve through the SAME lookup FuseBox.jsx uses. Run from repo root:
 *   bun tools/verify-mg.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData, matchModelKey } from '../src/components/FuseBox.jsx';

// (make, display-name as typed/VPIC, canonical model key, [sample years in-range])
const MODELS = [
  ['MG', 'GS',          'gs',       [2015, 2017, 2019]],
  ['MG', 'HS',          'hs',       [2019, 2021, 2023]],
  ['MG', 'HS PHEV',     'hs-phev',  [2020, 2021, 2023]],
  ['MG', 'eHS',         'hs-phev',  [2020, 2022]],          // page title name for the HS PHEV
  ['MG', 'MG3',         'mg3',      [2013, 2016, 2018, 2019, 2021, 2023]],
  ['MG', 'MG4 EV',      'mg4',      [2022, 2023, 2024]],
  ['MG', 'MG5 EV',      'mg5',      [2020, 2022, 2024]],
  ['MG', 'MG6',         'mg6',      [2014, 2015, 2016]],
  ['MG', 'ZR',          'zr',       [2001, 2003, 2005]],
  ['MG', 'ZS',          'zs',       [2017, 2019, 2020, 2021, 2023]],
  ['MG', 'ZS EV',       'zs-ev',    [2019, 2020, 2021, 2022, 2024]],
];
// classic MG + out-of-range — must NOT resolve (honest gaps)
const GAPS = [
  ['MG', 'MGB', 1975], ['MG', 'Midget', 1970], ['MG', 'MGA', 1960],
  ['MG', 'TD', 1950],  ['MG', 'TF', 1955],
  ['MG', 'ZR', 2000],  ['MG', 'ZS', 2016],     ['MG', 'ZS EV', 2018],
  ['MG', 'MG4', 2021], ['MG', 'MG5', 2019],    ['MG', 'MG6', 2013],
  ['MG', 'GS', 2014],  ['MG', 'HS', 2018],     ['MG', 'MG3', 2012],
  ['MG', 'ZS EV', 2025], ['MG', 'ZS', 2024],
];
// trim-level / VPIC refinements (leading-token refinement must resolve)
const REFINED = [
  ['MG', 'GS 1.5T', 2018],
  ['MG', 'HS Trophy', 2021],
  ['MG', 'HS PHEV Exclusive', 2022],
  ['MG', 'MG3 Style', 2017],
  ['MG', 'MG4 EV Long Range', 2023],
  ['MG', 'MG5 EV Trophy', 2021],
  ['MG', 'ZS Excite', 2018],
  ['MG', 'ZS EV Long Range', 2023],
  ['MG', 'ZR 105', 2004],
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
// 2. make-stripped model ("MG ZS EV" as the model field, e.g. from free-text)
for (const [modelStr, yr] of [['mg zs', 2019], ['mg zs ev', 2021], ['mg mg4', 2023], ['mg gs', 2016]]) {
  const data = findFuseData('MG', modelStr, yr);
  check(data && data.panels.length >= 1, `make-strip: MG / "${modelStr}" / ${yr} -> NO DATA`);
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
  ['Toyota', 'MG4', 2023],
  ['Mazda',  'MG5', 2021],
  ['Honda',  'ZS',  2020],
  ['MG',     'Corolla', 2020],
  ['MG',     'Camry',   2020],
  ['MG',     'Elantra', 2020],
]) {
  const data = findFuseData(make, model, yr);
  check(data === null || data === undefined, `cross-make: ${make} / ${model} / ${yr} should be null, got panels`);
}
// 6. prior-wave regression — Oldsmobile (last merged wave) + Pontiac + earlier must still resolve
const REGRESSION = [
  ['Oldsmobile', '88', 1996],
  ['Oldsmobile', 'Delta 88', 1997],
  ['Oldsmobile', 'eighty eight', 1995],
  ['Oldsmobile', 'Alero', 2002],
  ['Oldsmobile', 'Aurora', 2002],
  ['Oldsmobile', 'Silhouette', 2003],
  ['Oldsmobile', 'Bravada', 2003],
  ['Pontiac', 'Grand Prix', 2005],
  ['Pontiac', 'Grand Am GT', 2003],
  ['Pontiac', 'Firebird Trans Am', 1999],
  ['Pontiac', 'Vibe GT', 2005],
  ['Pontiac', 'G6', 2008],
  ['Buick', 'LaCrosse', 2012],
  ['Buick', 'LeSabre', 2003],
  ['Mazda', '3', 2015],
  ['Mazda', '6', 2018],
  ['Mazda', 'MX-5 Miata', 2016],
  ['Chevrolet', 'Silverado 1500', 2020],
  ['Toyota', 'Camry', 2020],
  ['Lexus', 'ES', 2020],
  ['Honda', 'CR-V', 2020],
];
for (const [make, model, yr] of REGRESSION) {
  const data = findFuseData(make, model, yr);
  check(data && data.panels && data.panels.length >= 1,
    `regression: ${make} / ${model} / ${yr} -> ${data ? 'panels:' + data.panels.length : 'NO DATA'}`);
}
// 7. panel counts per year block (spot sanity)
const EXPECT_PANELS = [
  ['MG', 'GS', 2017, 3],
  ['MG', 'HS', 2021, 2],
  ['MG', 'HS PHEV', 2021, 3],
  ['MG', 'MG3', 2015, 2],
  ['MG', 'MG3', 2021, 2],
  ['MG', 'MG4 EV', 2023, 2],
  ['MG', 'MG5 EV', 2022, 2],
  ['MG', 'MG6', 2015, 4],
  ['MG', 'ZR', 2003, 2],
  ['MG', 'ZS', 2018, 2],
  ['MG', 'ZS', 2022, 2],
  ['MG', 'ZS EV', 2020, 2],
  ['MG', 'ZS EV', 2023, 2],
];
for (const [make, model, yr, want] of EXPECT_PANELS) {
  const data = findFuseData(make, model, yr);
  check(data && data.panels.length === want, `panel-count: ${make} / ${model} / ${yr} -> ${data ? data.panels.length : 'NO DATA'} (expected ${want})`);
}
// 8. total MG coverage summary
const om = fuseBoxData.mg || {};
let models = 0, panels = 0, fuses = 0, empties = 0;
for (const mk of Object.keys(om)) {
  models++;
  for (const yr of Object.keys(om[mk])) {
    for (const p of om[mk][yr].panels) {
      panels++;
      for (const f of p.fuses || []) {
        fuses++;
        if (f.amps === '—' && f.circuit === '—') empties++;
      }
      fuses += (p.relays ? p.relays.length : 0);
    }
  }
}
console.log(`MG coverage: ${models} model keys / ${panels} panels / ${fuses} fuse+relay entries (${empties} empty-slot rows kept)`);
console.log(`TOTAL checks: ${total}  OK: ${ok}  FAIL: ${fail}`);
process.exit(fail ? 1 : 0);
