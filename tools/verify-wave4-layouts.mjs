#!/usr/bin/env bun
/* Wave 4 fuse-layout verifier — Honda (accord, pilot, odyssey, ridgeline, hr-v).
 *
 * Wave 4 researched fuse-box.info diagrams for every in-scope Honda panel and found
 * that the app's position sets (a shared generic template) do NOT match the physical
 * numbering on ANY source diagram (worst-case agreement 0-3/30 positions). Per the
 * wave-3 rule ("never invent slot positions; leave mismatched panels unmapped"),
 * NO layout blocks were added — all 8 in-scope panels are documented honest gaps.
 * This verifier locks in that gap state and confirms prior-wave layouts still resolve.
 *
 * Run: bun tools/verify-wave4-layouts.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData } from '../src/components/FuseBox.jsx';

let fail = 0, ok = 0, total = 0;
const check = (c, m) => { total++; if (c) ok++; else { fail++; console.log('FAIL:', m); } };

// ── In-scope Honda panels must stay WITHOUT a layout (honest gaps) ─────────────
// [model, sampleYears, panelNames...]
const gapPanels = [
  ['accord',    [2020, 2024], ['Under-Hood Fuse Box', 'Interior Fuse Box']],
  ['pilot',     [2020, 2025], ['Under-Hood Fuse Box', 'Interior Fuse Box']],
  ['odyssey',   [2020, 2024], ['Under-Hood Fuse Box', 'Interior Fuse Box']],
  ['ridgeline', [2018, 2024], ['Under-Hood Fuse Box', 'Interior Fuse Box']],
];
for (const [model, years, panels] of gapPanels) {
  for (const yr of years) {
    const d = findFuseData('Honda', model, yr);
    check(d && d.panels, `gap lookup Honda ${model} ${yr}`);
    if (!d || !d.panels) continue;
    for (const pn of panels) {
      const p = d.panels.find(p => p.name === pn);
      check(p, `gap panel ${model} ${yr} ${pn} exists`);
      check(p && !p.layout, `${model} ${yr} ${pn} has NO layout (honest gap — source numbering mismatch)`);
    }
  }
}

// ── hr-v has no fuse data at all (nothing to attach a layout to) ──────────────
for (const yr of [2018, 2024]) {
  const d = findFuseData('Honda', 'hr-v', yr);
  check(d === null, `hr-v ${yr}: no fuse data in app (documented gap)`);
}
check(!fuseBoxData.honda || !fuseBoxData.honda['hr-v'], 'hr-v absent from fuseBoxData.honda');

// ── Prior-wave (1-2) layouts must still resolve ───────────────────────────────
// [make, model, year, panelName]
const priorLayouts = [
  ['Toyota', 'camry', 2020, 'Engine Compartment Fuse Box'],
  ['Toyota', 'rav4', 2020, 'Engine Compartment Fuse Box (Type A)'],
  ['Toyota', 'rav4', 2020, 'Interior Fuse Box'],
  ['Ford', 'f-150', 2022, 'Power Distribution Box'],
  ['Ford', 'f-150', 2022, 'Passenger Compartment Fuse Panel'],
  ['Honda', 'civic', 2023, 'Under-Hood Fuse Box'],
  ['Honda', 'civic', 2023, 'Interior Fuse Box'],
  ['Honda', 'cr-v', 2024, 'Under-Hood Fuse Box'],
  ['Honda', 'cr-v', 2024, 'Interior Fuse Box'],
  ['Chevrolet', 'silverado1500', 2020, 'Engine Compartment Fuse Block'],
  ['Chevrolet', 'silverado1500', 2020, 'Instrument Panel Fuse Block (Left)'],
  ['Chevrolet', 'silverado1500', 2020, 'Instrument Panel Fuse Block (Right) - Front'],
  ['Subaru', 'outback', 2022, 'Main Fuse Box (Engine Compartment)'],
  ['Subaru', 'outback', 2022, 'Fuse Panel (Interior)'],
  ['Jeep', 'gladiator', 2022, 'Power Distribution Center (PDC)'],
  ['Jeep', 'wrangler', 2021, 'Power Distribution Center (PDC)'],
  ['Lexus', 'nx', 2018, 'Passenger Compartment Fuse Box'],
  ['Lexus', 'nx', 2018, 'Engine Compartment Fuse Box №1 (NX 200t)'],
  ['Lexus', 'rx', 2018, 'Passenger Compartment Fuse Box'],
  ['Lexus', 'rx', 2018, 'Engine Compartment Fuse Box'],
];
for (const [make, model, yr, pn] of priorLayouts) {
  const d = findFuseData(make, model, yr);
  check(d && d.panels, `prior lookup ${make} ${model} ${yr}`);
  if (!d || !d.panels) continue;
  const p = d.panels.find(p => p.name === pn);
  check(p && p.layout, `${make} ${model} ${yr} ${pn} still has layout`);
  if (p && p.layout) {
    check(Number(p.layout.cols) >= 1 && Number(p.layout.rows) >= 1, `${make} ${model} ${pn} grid dims`);
    const keys = Object.keys(p.layout.cells || {});
    check(keys.length >= 1, `${make} ${model} ${pn} has cells`);
    const valid = new Set([...(p.fuses || []).map(f => f.pos), ...(p.relays || []).map(r => r.pos)]);
    const bad = keys.filter(k => !valid.has(k));
    check(bad.length === 0, `${make} ${model} ${pn} orphan cells: ${bad.join(',')}`);
  }
}

console.log(`TOTAL: ${total}  OK: ${ok}  FAIL: ${fail}`);
process.exit(fail ? 1 : 0);
