#!/usr/bin/env bun
/* Wave 10 fuse-layout verifier — Hyundai + Kia (16 models).
 *
 * Wave 10 researched fuse-box.info pages for every Hyundai/Kia model in scope
 * (30 source pages saved: every generation from 2007 through 2026, incl. the
 * LM/TL/NX4 Tucson, MD/AD/CN7 Elantra, YF/LF/DN8 Sonata, DM/TM/MX5 Santa Fe,
 * OS/SX2 Kona, QX Venue, LX2 Palisade, NE Ioniq 5, CE Ioniq 6, SK3 Soul,
 * MQ4/UM/XM Sorento, NQ5/QL/SL Sportage, ON Telluride, BD Forte, DL3 K5,
 * Santa Cruz). Two structural findings:
 *
 * 1. Hash-check (pos,circuit) sets across all 16 models: the Interior Fuse
 *    Panel is ONE identical 42-entry dataset shared by ALL 16 models
 *    (hash a06dd099); the Engine Compartment Fuse Panel is 4 shared datasets
 *    (61-entry group: elantra/sonata/soul/forte/k5; 63-entry group:
 *    tucson/santa fe/santa cruz/kona/venue/sportage/sorento; 67-entry group:
 *    palisade/telluride; 60-entry EV group: ioniq 5/ioniq 6). One dataset
 *    serving a 2007-2026 model-year range cannot be a real physical panel.
 *
 * 2. fuse-box.info Hyundai/Kia pages carry NO position column in any table
 *    (unlike Ford/Nissan pages); positions exist only in diagram photos.
 *    Name-overlap with any page is high (0.85-0.92 — common Hyundai fuse
 *    names) but per-table SEQUENCE alignment (app pos i vs source row i)
 *    tops out at 0.29 (2/7 on a relay table) — the app data order matches NO
 *    generation's physical table. App entries (FOG LP RH/LH, H/LP RH/LH,
 *    P/WDW LH/RH/LH RR/RH RR, SMART KEY, BCM + relay block P/WDW 1/2, START,
 *    FOG LP, H/LP HI/LO...) appear in none of the 30 source pages.
 *
 * Per the owner's honest-gap rule, ALL 32 Hyundai/Kia panels (16 models × 2)
 * stay WITHOUT layout — list-only fallback, documented gaps. This is the same
 * outcome as Wave 4 (Honda template data). A future table-cleanup wave should
 * re-derive Hyundai/Kia fuse tables per model generation (like W4's Honda
 * recommendation) before any layout work.
 *
 * Run: bun tools/verify-wave10-layouts.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData } from '../src/components/FuseBox.jsx';
let fail = 0, ok = 0, total = 0;
const check = (c, m) => { total++; if (c) ok++; else { fail++; console.log('FAIL:', m); } };
// ── 1. All in-scope Hyundai/Kia panels must stay WITHOUT a layout ────────────
// [model, sampleYears, panelNames...] — sample years inside each model's block.
const gapPanels = [
  // Hyundai
  ['elantra',   [2020, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  ['sonata',    [2020, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  ['tucson',    [2020, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  ['santa fe',  [2020, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  ['palisade',  [2022, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  ['ioniq 5',   [2023, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  ['santa cruz',[2023, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  ['kona',      [2020, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  ['ioniq 6',   [2024, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  ['venue',     [2021, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  // Kia
  ['soul',      [2020, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  ['sportage',  [2020, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  ['sorento',   [2020, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  ['telluride', [2022, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  ['forte',     [2020, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
  ['k5',        [2022, 2025], ['Engine Compartment Fuse Panel', 'Interior Fuse Panel']],
];
for (const [model, years, panels] of gapPanels) {
  for (const yr of years) {
    const d = findFuseData('Hyundai', model, yr) || findFuseData('Kia', model, yr);
    check(d && d.panels, `gap lookup ${model} ${yr}`);
    if (!d || !d.panels) continue;
    for (const pn of panels) {
      const p = d.panels.find(p => p.name === pn);
      check(p, `gap panel ${model} ${yr} ${pn} exists`);
      check(p && !p.layout, `${model} ${yr} ${pn} has NO layout (honest gap — app template data does not match any source diagram numbering)`);
    }
  }
}
// no OTHER hyundai/kia model may carry a layout either (gaps must stay clean)
for (const [make, models] of Object.entries(fuseBoxData)) {
  if (make !== 'hyundai' && make !== 'kia') continue;
  for (const [model, ranges] of Object.entries(models || {})) {
    const n = Object.values(ranges || {}).reduce((a, d) =>
      a + (d.panels || []).filter(p => p.layout).length, 0);
    check(n === 0, `${make} ${model}: no layouts expected (found ${n})`);
  }
}
// ── 2. Prior-wave layouts must still resolve ─────────────────────────────────
// [make, model, year, panelName]
const priorLayouts = [
  ['Toyota', 'camry', 2020, 'Engine Compartment Fuse Box'],
  ['Toyota', 'corolla', 2020, 'Interior Fuse Box'],
  ['Ford', 'fusion', 2018, 'Passenger Compartment Fuse Box'],
  ['Chevrolet', 'equinox', 2020, 'Engine Compartment Fuse Block'],
  ['Honda', 'civic', 2023, 'Under-Hood Fuse Box'],
  ['BMW', '3 series', 2015, 'Front Power Distribution Box'],
  ['Mercedes', 'c-class', 2018, 'Engine Compartment Fuse Box'],
  ['Nissan', 'altima', 2021, 'Interior Fuse Panel'],
  ['Infiniti', 'q50', 2018, 'Passenger Compartment Fuse Box (J/B)'],
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
    check(valid.size >= 1, `${make} ${model} ${pn} has fuses or relays (relays-only rule)`);
    const bad = keys.filter(k => !valid.has(k));
    check(bad.length === 0, `${make} ${model} ${pn} orphan cells: ${bad.join(',')}`);
  }
}
console.log(`TOTAL: ${total}  OK: ${ok}  FAIL: ${fail}`);
console.log(`GAP PANELS: 32 Hyundai+Kia panels asserted WITHOUT layout`);
if (fail) process.exit(1);
console.log('PASS: Wave 10 Hyundai+Kia — 0 layouts (all 32 panels honest gaps), prior-wave layouts still resolve');
