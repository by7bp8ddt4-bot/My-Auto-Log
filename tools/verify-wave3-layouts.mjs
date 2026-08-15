#!/usr/bin/env bun
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData } from '../src/components/FuseBox.jsx';
let fail = 0, ok = 0, total = 0;
const check = (c, m) => { total++; if (c) ok++; else { fail++; console.log('FAIL:', m); } };
// Layouts must resolve for the covered panels
for (const [model, yr, panelName, cols, rows, nCells] of [
  ['corolla', 2020, 'Interior Fuse Box', 2, 20, 35],
  ['corolla', 2024, 'Interior Fuse Box', 2, 20, 35],
  ['highlander', 2021, 'Interior Fuse Box', 2, 21, 38],
  ['highlander', 2025, 'Interior Fuse Box', 2, 21, 38],
]) {
  const d = findFuseData('Toyota', model, yr);
  check(d && d.panels, `lookup ${model} ${yr}`);
  const p = d.panels.find(p => p.name === panelName);
  check(p && p.layout, `${model} ${yr} ${panelName} has layout`);
  if (p && p.layout) {
    check(Number(p.layout.cols) === cols, `${model} cols`);
    check(Number(p.layout.rows) === rows, `${model} rows`);
    const keys = Object.keys(p.layout.cells || {});
    check(keys.length === nCells, `${model} cells=${keys.length} expected ${nCells}`);
    // every cell key must exist in the panel's fuses or relays
    const valid = new Set([...(p.fuses||[]).map(f=>f.pos), ...(p.relays||[]).map(r=>r.pos)]);
    const bad = keys.filter(k => !valid.has(k));
    check(bad.length === 0, `${model} orphan cells: ${bad.join(',')}`);
  }
}
// panels without layouts must NOT have one (honest gaps)
for (const [model, yr, panelName] of [
  ['corolla', 2020, 'Engine Compartment Fuse Box'],
  ['highlander', 2021, 'Engine Compartment Fuse Box (Type A)'],
  ['tacoma', 2020, 'Engine Compartment Fuse Box (Type A)'],
  ['tundra', 2023, 'Engine Compartment Fuse Box'],
  ['4runner', 2020, 'Engine Compartment Fuse Box'],
  ['sienna', 2022, 'Engine Compartment Fuse Box'],
  ['gr86', 2023, 'Engine Compartment Fuse Box'],
  ['bz4x', 2024, 'Engine Compartment Fuse Box'],
]) {
  const d = findFuseData('Toyota', model, yr);
  check(d && d.panels, `lookup gap ${model} ${yr}`);
  const p = d.panels.find(p => p.name === panelName);
  check(p && !p.layout, `${model} ${yr} ${panelName} has NO layout (honest gap)`);
}
// prior waves still resolve
for (const [model, yr] of [['camry',2020],['rav4',2020],['civic',2020],['cr-v',2020],['outback',2020],['gladiator',2020],['rx',2020],['nx',2020]]) {
  const d = findFuseData('Toyota', model, yr) || findFuseData('Honda', model, yr) || findFuseData('Subaru', model, yr) || findFuseData('Jeep', model, yr) || findFuseData('Lexus', model, yr);
  check(d && d.panels.length >= 1, `prior-wave lookup ${model} ${yr}`);
}
console.log(`TOTAL: ${total}  OK: ${ok}  FAIL: ${fail}`);
process.exit(fail ? 1 : 0);
