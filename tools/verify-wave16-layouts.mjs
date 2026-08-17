#!/usr/bin/env bun
/* Wave 16 fuse-layout verifier — Mitsubishi eclipse/lancer/montero gaps
 * (3 models / 5 year-blocks / 11 panels / 10 layouts) + honest-gap wave
 * completion (galant/3000gt/kicks/cx-90/mx-6/rx-7/q60/gnx/olds 98/442/toronado
 * all documented no-source or photos-only gaps — nothing to map).
 *
 * Sources: /home/team/shared/vehicle-data/fuse-layout/wave16/pages/ +
 * source-tables.json + gen_wave16.py (the generator's block() emit; the
 * committed JS was hand-spliced into src/data/fuse-boxes.js, then this session
 * FIXED two latent defects found by the wave-16 integrity check:
 *   (a) montero amps/circuit SWAPPED (source col order was №|Description|
 *       Capacity, generator assumed №|Amps|Load) — rebuilt from source tables;
 *   (b) three duplicate `eclipse:` model keys (1995-1999 / 2000-2002 /
 *       2003-2005 emitted as separate top-level blocks) — JS object-literal
 *       last-key-wins silently dropped the first two at runtime; merged into
 *       ONE eclipse model key with three year ranges.
 * Every fuse row now traces to a source-table cell (verified cell-by-cell in
 * the wave-16 check script before commit).
 *
 * Run: bun tools/verify-wave16-layouts.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData } from '../src/components/FuseBox.jsx';
let fail = 0, ok = 0, total = 0;
const check = (c, m) => { total++; if (c) ok++; else { fail++; console.log('FAIL:', m); } };
// ── 1. The 10 new layouts resolve for sample in-range years ──────────────────
// [make, model, year, panelName, expectsLayout]
const mapped = [
  ['Mitsubishi', 'eclipse', 1997, 'Passenger Compartment Fuse Box', true],
  ['Mitsubishi', 'eclipse', 1997, 'Engine Compartment Fuse Box', true],
  ['Mitsubishi', 'eclipse', 2001, 'Passenger Compartment Fuse Box', true],
  ['Mitsubishi', 'eclipse', 2001, 'Engine Compartment Fuse Box', true],
  ['Mitsubishi', 'eclipse', 2004, 'Instrument Panel Fuse Box', true],
  ['Mitsubishi', 'eclipse', 2004, 'Engine Compartment Fuse Box', true],
  ['Mitsubishi', 'lancer', 2005, 'Passenger Compartment Fuse Box', false],
  ['Mitsubishi', 'lancer', 2005, 'Engine Compartment Fuse Box', true],
  ['Mitsubishi', 'lancer', 2005, 'Passenger Compartment Relay Box', true],
  ['Mitsubishi', 'montero', 2004, 'Instrument Panel Fuse Box', true],
  ['Mitsubishi', 'montero', 2004, 'Engine Compartment Fuse Box', true],
];
for (const [make, model, yr, pn, expectLayout] of mapped) {
  const d = findFuseData(make, model, yr);
  check(d && d.panels, `lookup ${make} ${model} ${yr}`);
  if (!d || !d.panels) continue;
  const p = d.panels.find(p => p.name === pn);
  check(p, `panel ${make} ${model} ${yr} ${pn} exists`);
  if (!p) continue;
  check(expectLayout ? !!p.layout : !p.layout,
    `${make} ${model} ${yr} ${pn} ${expectLayout ? 'has layout' : 'stays list-only (position collision, honest gap)'}`);
  if (expectLayout && p.layout) {
    check(Number(p.layout.cols) >= 1 && Number(p.layout.rows) >= 1, `${make} ${model} ${pn} grid dims`);
    const keys = Object.keys(p.layout.cells || {});
    check(keys.length >= 1, `${make} ${model} ${pn} has cells`);
    const valid = new Set([...(p.fuses || []).map(f => f.pos), ...(p.relays || []).map(r => r.pos)]);
    check(valid.size >= 1, `${make} ${model} ${pn} has fuses or relays (relays-only rule)`);
    const bad = keys.filter(k => !valid.has(k));
    check(bad.length === 0, `${make} ${model} ${pn} orphan cells: ${bad.join(',')}`);
  }
}
// ── 2. Every wave-16 panel is populated; every fuse row is honest ────────────
// amps must look like amperage (number, 'NA', 'N A', dual '10A/15A', or '—'),
// NOT a circuit description — this is the exact check that caught the
// montero swap in the committed data.
const AMP_RE = /^\d+(\.\d+)?A?(\/\d+(\.\d+)?A?)?$|^\d+\s*A$|^—$/;
for (const [model, ranges] of Object.entries(fuseBoxData.mitsubishi)) {
  if (!['eclipse', 'lancer', 'montero'].includes(model)) continue;
  for (const [yr, data] of Object.entries(ranges)) {
    check((data.panels || []).length >= 1, `${model} ${yr} has panels`);
    for (const p of data.panels || []) {
      const nf = (p.fuses || []).length, nr = (p.relays || []).length;
      check(nf > 0 || nr > 0, `${model} ${yr} ${p.name}: populated (${nf} fuses, ${nr} relays)`);
      for (const f of p.fuses || []) {
        check(f.pos && f.circuit, `${model} ${yr}: fuse pos ${f.pos} has circuit`);
        check(f.amps !== undefined && AMP_RE.test(String(f.amps).trim()),
          `${model} ${yr}: fuse pos ${f.pos} amps='${f.amps}' is amperage`);
      }
      for (const r of p.relays || []) {
        check(r.pos && r.circuit, `${model} ${yr}: relay pos ${r.pos} has circuit`);
      }
      if (p.layout) {
        const keys = Object.keys(p.layout.cells || {});
        const valid = new Set([...(p.fuses || []).map(f => f.pos), ...(p.relays || []).map(r => r.pos)]);
        check(keys.filter(k => !valid.has(k)).length === 0, `${model} ${yr} ${p.name}: no orphan cells`);
      }
    }
  }
}
// ── 3. Whole-make scan + grand totals ────────────────────────────────────────
// mitsubishi had 0 layouts on main; wave 16 adds exactly 10 (eclipse 6,
// lancer 2, montero 2). Grand total: main 466 + 10 = 476.
{
  let m = 0;
  for (const [model, ranges] of Object.entries(fuseBoxData.mitsubishi)) {
    for (const [yr, d] of Object.entries(ranges)) {
      m += (d.panels || []).filter(p => p.layout).length;
    }
  }
  check(m === 10, `mitsubishi: expected 10 layouts total, found ${m}`);
  let grand = 0;
  for (const [make, models] of Object.entries(fuseBoxData)) {
    for (const [model, ranges] of Object.entries(models)) {
      for (const [yr, d] of Object.entries(ranges)) {
        grand += (d.panels || []).filter(p => p.layout).length;
      }
    }
  }
  check(grand === 476, `total layout blocks across all makes: expected 476, found ${grand}`);
}
// ── 4. Prior-wave layouts must still resolve (regression) ────────────────────
const priorLayouts = [
  // Wave 1-9 core samples
  ['Toyota', 'camry', 2020, 'Engine Compartment Fuse Box', true],
  ['Toyota', 'corolla', 2020, 'Interior Fuse Box', true],
  ['Ford', 'fusion', 2018, 'Passenger Compartment Fuse Box', true],
  ['Chevrolet', 'equinox', 2020, 'Engine Compartment Fuse Block', true],
  ['Honda', 'civic', 2023, 'Under-Hood Fuse Box', true],
  ['BMW', '3 series', 2015, 'Front Power Distribution Box', true],
  ['Mercedes', 'c-class', 2018, 'Engine Compartment Fuse Box', true],
  ['Nissan', 'altima', 2021, 'Interior Fuse Panel', true],
  ['Infiniti', 'q50', 2018, 'Passenger Compartment Fuse Box (J/B)', true],
  // Wave 11 regression: VW golf + Audi a4
  ['Volkswagen', 'golf', 2020, 'Fuse Panel on Left Side of Dashboard', true],
  ['Audi', 'a4', 2018, 'Dashboard Fuse Panel', true],
  // Wave 12 regression: GMC Sierra + Dodge Charger
  ['GMC', 'sierra', 2015, 'Engine Compartment Fuse Block', true],
  ['Dodge', 'charger', 2020, 'Engine Compartment (Front Power Distribution Center)', true],
  // Wave 13 regression: Mazda 3 + Lincoln Navigator
  ['Mazda', '3', 2017, 'Engine Compartment Fuse Block', true],
  ['Lincoln', 'navigator', 2022, 'Engine Compartment Fuse Box', true],
  // Wave 14 regression: Acura MDX + Subaru + Lexus
  ['Acura', 'mdx', 2023, 'Engine Compartment Fuse Box', true],
  ['Jeep', 'wrangler', 2020, 'Power Distribution Center (PDC)', true],
  ['Subaru', 'outback', 2023, 'Main Fuse Box (Engine Compartment)', true],
  ['Lexus', 'rx', 2018, 'Passenger Compartment Fuse Box', true],
  // Wave 15 regression: Pontiac + Oldsmobile + MG
  ['Pontiac', 'aztek', 2003, 'Passenger Compartment Fuse Box', true],
  ['Oldsmobile', 'aurora', 1998, 'Engine Compartment Fuse Box', true],
  ['MG', 'mg6', 2015, 'Auxiliary Fuse Box', true],
  // Wave 10 regression: Hyundai/Kia stay layout-free
  ['Hyundai', 'elantra', 2020, 'Engine Compartment Fuse Panel', false],
  ['Kia', 'sportage', 2020, 'Engine Compartment Fuse Panel', false],
];
for (const [make, model, yr, pn, expectLayout] of priorLayouts) {
  const d = findFuseData(make, model, yr);
  check(d && d.panels, `prior lookup ${make} ${model} ${yr}`);
  if (!d || !d.panels) continue;
  const p = d.panels.find(p => p.name === pn);
  check(p, `prior panel ${make} ${model} ${yr} ${pn} exists`);
  if (!p) continue;
  check(expectLayout ? !!p.layout : !p.layout,
    `${make} ${model} ${yr} ${pn} ${expectLayout ? 'still has layout' : 'has NO layout (W10 honest gap)'}`);
}
// ── 5. All panels populated repo-wide (0 empty panels, 0 consult) ────────────
{
  let empties = 0, consults = 0;
  for (const [make, models] of Object.entries(fuseBoxData)) {
    for (const [model, ranges] of Object.entries(models)) {
      for (const [yr, d] of Object.entries(ranges)) {
        for (const p of d.panels || []) {
          if ((p.fuses || []).length === 0 && (p.relays || []).length === 0) empties++;
          const allText = JSON.stringify(p).toLowerCase();
          if (/consult (your|the|a|an|dealer|owner)/.test(allText)) consults++;
        }
      }
    }
  }
  check(empties === 0, `no truly empty panels repo-wide (found ${empties})`);
  check(consults === 0, `no 'consult' placeholders repo-wide (found ${consults})`);
}
console.log(`TOTAL: ${total}  OK: ${ok}  FAIL: ${fail}`);
console.log('MAPPED: 10 layouts (eclipse 6, lancer 2, montero 2) + 1 list-only lancer passenger panel (honest gap)');
console.log('FIXES: montero amps/circuit swap rebuilt; eclipse 3 duplicate keys merged into 1 model key');
console.log('HONEST GAPS (documented, no source on fuse-box.info): galant/eclipse-4g/lancer-X photos-only; 3000gt, kicks, cx-90, mx-6, rx-7, q60, gnx, olds 98/442/toronado no page');
if (fail) process.exit(1);
console.log('PASS: Wave 16 Mitsubishi — 10 layouts, honest gaps clean, prior-wave layouts still resolve');
