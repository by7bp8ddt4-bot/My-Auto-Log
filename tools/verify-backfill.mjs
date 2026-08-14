/**
 * Backfill coverage check — every model added in this wave must resolve
 * through the SAME lookup FuseBox.jsx uses. Run: node /tmp/verify-backfill.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData, matchModelKey } from '../src/components/FuseBox.jsx';

// (make, canonical model key, [sample years]) — years chosen from the ranges
const NEW_MODELS = [
  ['Chevrolet', 'blazer', [2019, 2026]],
  ['Chevrolet', 'corvette', [2014, 2025]],
  ['Chevrolet', 'impala', [2000, 2020]],
  ['Chevrolet', 'express', [2003, 2026]],
  ['Ford', 'focus', [2008, 2018]],
  ['Ford', 'f-350', [2008, 2026]],
  ['Ford', 'e-series', [2002, 2025]],
  ['Dodge', 'grand caravan', [2011, 2020]],
  ['Dodge', 'journey', [2011, 2020]],
  ['Jeep', 'compass', [2011, 2026]],
  ['Jeep', 'patriot', [2007, 2017]],
  ['Jeep', 'wagoneer', [2022, 2026]],
  ['Jeep', 'grand wagoneer', [2022, 2026]],
  ['Infiniti', 'qx50', [2013, 2022]],
  ['Infiniti', 'qx80', [2010, 2017]],
  ['Lexus', 'is', [2006, 2024]],
  ['Lincoln', 'nautilus', [2019, 2026]],
  ['Lincoln', 'aviator', [2020, 2026]],
  ['GMC', 'yukon', [2007, 2026]],
  ['Mazda', '626', [2000, 2002]],
  ['Mazda', 'protege', [2000, 2003]],
  ['Mazda', 'millenia', [2000, 2002]],
  ['Mazda', 'rx-8', [2004, 2011]],
  ['Mazda', 'b-series', [2002, 2006]],
  ['Mazda', 'cx-50', [2023, 2024]],
  ['Buick', 'envision', [2016, 2024]],
  ['Buick', 'lacrosse', [2010, 2019]],
  ['Ram', '3500', [2009, 2026]],
];

let fail = 0, ok = 0, total = 0;
for (const [make, key, years] of NEW_MODELS) {
  const makeData = fuseBoxData[make.toLowerCase()];
  if (!makeData || !makeData[key]) {
    console.log(`FAIL structure: ${make} / ${key} missing in fuseBoxData`);
    fail++; continue;
  }
  for (const yr of years) {
    total++;
    const data = findFuseData(make, key, yr);
    if (data && data.panels && data.panels.length >= 1) {
      ok++;
    } else {
      fail++;
      console.log(`FAIL lookup: ${make} / ${key} / ${yr} -> ${data ? 'panels:' + data.panels.length : 'NO DATA'}`);
    }
  }
}

// VPIC-style / human-typed name resolution (separator-insensitive)
const ALIASES = [
  ['Ford', 'F350', 2020], ['Ford', 'F-350 Super Duty', 2020], ['Ford', 'E-Series', 2020], ['Ford', 'Focus', 2016],
  ['Dodge', 'Grand Caravan SXT', 2015], ['Dodge', 'Journey', 2015],
  ['Jeep', 'Grand Wagoneer', 2023], ['Jeep', 'Wagoneer', 2023], ['Jeep', 'Compass', 2015],
  ['Infiniti', 'QX 50', 2015], ['Infiniti', 'QX80', 2015],
  ['Lexus', 'IS 300', 2015], ['Lexus', 'IS', 2015],
  ['Lincoln', 'Nautilus', 2020], ['Lincoln', 'Aviator', 2020],
  ['GMC', 'Yukon', 2015], ['GMC', 'Yukon Denali', 2015],
  ['Mazda', '626', 2001], ['Mazda', 'Protege', 2001], ['Mazda', 'Millenia', 2001],
  ['Mazda', 'RX-8', 2008], ['Mazda', 'B-Series', 2005], ['Mazda', 'CX-50', 2023],
  ['Buick', 'Envision', 2020], ['Buick', 'LaCrosse', 2015],
  ['Ram', '3500', 2020], ['Chevrolet', 'Blazer', 2020], ['Chevrolet', 'Impala', 2015],
];
for (const [make, model, yr] of ALIASES) {
  total++;
  const data = findFuseData(make, model, yr);
  if (data && data.panels && data.panels.length >= 1) ok++;
  else { fail++; console.log(`FAIL alias: ${make} / ${model} / ${yr}`); }
}

// collision guards: 'is' must stay under lexus; qx50 vs q50/qx60 distinct;
// yukon vs yukon-xl distinct; wagoneer vs grand wagoneer distinct
const COLLISIONS = [
  ['Lexus', 'IS', 'lexus is'], ['Infiniti', 'QX50', 'infiniti qx50'],
  ['Infiniti', 'Q50', 'infiniti q50'], ['GMC', 'Yukon XL', 'gmc yukon-xl'],
  ['Jeep', 'Wagoneer', 'jeep wagoneer'], ['Jeep', 'Grand Wagoneer', 'jeep grand wagoneer'],
];
for (const [make, model, expectedKey] of COLLISIONS) {
  total++;
  const matched = matchModelKey(fuseBoxData[make.toLowerCase()], model);
  if (matched === expectedKey.split(' ').slice(1).join(' ')) ok++;
  else { fail++; console.log(`FAIL collision: ${make} ${model} -> ${matched}`); }
}

console.log(`TOTAL checks: ${total}  OK: ${ok}  FAIL: ${fail}`);
process.exit(fail ? 1 : 0);
