#!/usr/bin/env bun
/* Wave 14 fuse-layout verifier — Acura + Lexus + Subaru + Jeep (49 layouts).
 *
 * Wave 14 researched fuse-box.info generation pages across 4 makes (saved in
 * /home/team/shared/vehicle-data/fuse-layout/wave14/pages/, parsed to
 * source-pages.json; match14.py = position-aware matcher; match14.out = full
 * run — every mapped panel shows the source table at cov>=0.94 AND
 * posAgree>=0.94 AND popCover=1.00; insert_wave14.py MAP + insert14.log = the
 * splice record; hashcheck.out = dataset-hash audit).
 *
 * Mapping decision (documented in insert_wave14.py MAP): a layout was added
 * ONLY where the app dataset matched a physical source table 1:1 with
 * cov>=0.94 AND posAgree>=0.94 AND popCover=1.00 — 49 layouts:
 *   - Acura 23: MDX 2022-26 (5), MDX 2014-20 (6), RDX 2019-26 (4),
 *     TLX 2021-26 (5), TLX 2015-20 (3)
 *   - Lexus 8: ES 2019-24 passenger (1), GX 2010-17 (2), IS 2006-13 (3),
 *     IS 2014-24 (2)
 *   - Jeep 18: Cherokee KL interior (1), Renegade trailer (1),
 *     Compass MK IPM (5) + MP PDU/4x4/luggage (3) + 2022-26 engine (1),
 *     Patriot MK IPM (7)
 *
 * Honest gaps (all stay list-only; the whole-make scan below asserts the exact
 * per-make layout totals acura=23 lexus=12 subaru=2 jeep=20 so no panel
 * outside the 49 new + 8 prior layouts can silently carry one):
 *   - Subaru: ALL 8 panels of the 4 scope models (crosstrek/forester/impreza/
 *     legacy 2020-26, Main + Interior each) — the app dataset is a 5-model
 *     shared template (hash 94fc2b42 n=5 Main / 77df239f n=5 Interior,
 *     identical incl. amps) and the matcher tops out at cov 0.73 /
 *     posAgree 1/22 — not 1:1 (W13-Volvo precedent); list-only.
 *   - Acura: integra 2023-26 (no source page exists — block gap), MDX 2022-26
 *     passenger (0.87), RDX engine main + passenger main (letter positions),
 *     TLX 2015-20 interior (0.85).
 *   - Lexus: ES engine №1 both variants (popCover 0.93/0.95 — positionless
 *     rows), ES engine №2 (0.83), IS XE20 engine №1 (0.93), IS 2014-24
 *     passenger (0.91).
 *   - Jeep: GC TIPM + WL interior/front/rear (0.50-0.90), Cherokee PDC
 *     (0.42), Renegade engine/dash/luggage (0.60-0.90), Compass MP passenger
 *     (0.80), Compass 2022-26 passenger/rear (0.81/0.80).
 *
 * Run: bun tools/verify-wave14-layouts.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData } from '../src/components/FuseBox.jsx';
let fail = 0, ok = 0, total = 0;
const check = (c, m) => { total++; if (c) ok++; else { fail++; console.log('FAIL:', m); } };

// ── 1. The 49 mapped layouts resolve for sample in-range years ───────────────
// [make, model, year(s), panelName, expectedCols] — years inside the exact
// year block (findFuseData first-match caveat: sample years hit the exact
// block; wave-14 blocks do not overlap so any in-range year resolves).
const mapped = [
  // ---- Acura MDX 2022-2026 (5) ----
  ['Acura', 'mdx', [2023], 'Engine Compartment Fuse Box', 10],
  ['Acura', 'mdx', [2023], 'Engine Compartment Main Fuses', 4],
  ['Acura', 'mdx', [2023], 'Passenger Compartment Sub Fuses', 5],
  ['Acura', 'mdx', [2023], 'Luggage Compartment Fuse Box', 10],
  ['Acura', 'mdx', [2023], 'Luggage Compartment Main Fuses', 5],
  // ---- Acura MDX 2014-2020 (6) ----
  ['Acura', 'mdx', [2017], 'Engine Compartment Fuse Box No. 1', 10],
  ['Acura', 'mdx', [2017], 'Engine Compartment Fuse Box No. 2', 6],
  ['Acura', 'mdx', [2017], 'Passenger Compartment Fuse Box', 6],
  ['Acura', 'mdx', [2017], 'Passenger\u2019s Side Interior Fuse Box', 5],
  ['Acura', 'mdx', [2017], 'Rear Fuse Box', 8],
  ['Acura', 'mdx', [2017], 'Trunk Fuse Box', 6],
  // ---- Acura RDX 2019-2026 (4) ----
  ['Acura', 'rdx', [2021], 'Engine Compartment Fuse Box No. 1', 10],
  ['Acura', 'rdx', [2021], 'Engine Compartment Fuse Box No. 2', 10],
  ['Acura', 'rdx', [2021], 'Passenger Compartment Fuse Box', 6],
  ['Acura', 'rdx', [2021], 'Passenger Compartment Sub Fuses', 2],
  // ---- Acura TLX 2021-2026 (5) ----
  ['Acura', 'tlx', [2023], 'Passenger Compartment Fuse Box', 6],
  ['Acura', 'tlx', [2023], 'Engine Compartment Fuse Box', 10],
  ['Acura', 'tlx', [2023], 'Engine Compartment Main Fuses', 4],
  ['Acura', 'tlx', [2023], 'Rear Fuse Box', 6],
  ['Acura', 'tlx', [2023], 'Trunk Room Fuse Box', 5],
  // ---- Acura TLX 2015-2020 (3) ----
  ['Acura', 'tlx', [2017], 'Under-Hood Fuse Box', 10],
  ['Acura', 'tlx', [2017], 'Headlight Low Beam Fuse Box', 4],
  ['Acura', 'tlx', [2017], 'P-AWS Fuse Box', 3],
  // ---- Lexus ES 2019-2024 (1) ----
  ['Lexus', 'es', [2021], 'Passenger Compartment Fuse Box', 6],
  // ---- Lexus GX 2010-2017 (2) ----
  ['Lexus', 'gx', [2014], 'Passenger Compartment Fuse Box', 6],
  ['Lexus', 'gx', [2014], 'Engine Compartment Fuse Box', 10],
  // ---- Lexus IS 2006-2013 (3) ----
  ['Lexus', 'is', [2009], 'Passenger Compartment Fuse Box No.1', 5],
  ['Lexus', 'is', [2009], 'Passenger Compartment Fuse Box No.2', 5],
  ['Lexus', 'is', [2009], 'Engine Compartment Fuse Box No.2', 10],
  // ---- Lexus IS 2014-2024 (2) ----
  ['Lexus', 'is', [2018], 'Engine Compartment Fuse Box No.1', 10],
  ['Lexus', 'is', [2018], 'Engine Compartment Fuse Box No.2', 10],
  // ---- Jeep Cherokee KL (1) ----
  ['Jeep', 'cherokee', [2021], 'Interior Fuse Panel', 5],
  // ---- Jeep Renegade (1) ----
  ['Jeep', 'renegade', [2021], 'Trailer Lighting Controller Fuses', 3],
  // ---- Jeep Compass MK IPM (5) ----
  ['Jeep', 'compass', [2011], 'Integrated Power Module (IPM)', 8],
  ['Jeep', 'compass', [2012], 'Integrated Power Module (IPM)', 8],
  ['Jeep', 'compass', [2013], 'Integrated Power Module (IPM)', 8],
  ['Jeep', 'compass', [2014], 'Integrated Power Module (IPM)', 8],
  ['Jeep', 'compass', [2016], 'Integrated Power Module (IPM)', 8],
  // ---- Jeep Compass MP (3) ----
  ['Jeep', 'compass', [2019], 'Engine Compartment Fuse Box (Power Distribution Unit)', 10],
  ['Jeep', 'compass', [2019], 'Engine Compartment Fuse Box (4x4/AWD)', 3],
  ['Jeep', 'compass', [2019], 'Luggage Compartment Fuse Box', 4],
  // ---- Jeep Compass 2022-2026 (1) ----
  ['Jeep', 'compass', [2024], 'Engine Compartment Fuse Box', 10],
  // ---- Jeep Patriot MK IPM (7) ----
  ['Jeep', 'patriot', [2008], 'Integrated Power Module (IPM)', 8],
  ['Jeep', 'patriot', [2009], 'Integrated Power Module (IPM)', 8],
  ['Jeep', 'patriot', [2011], 'Integrated Power Module (IPM)', 8],
  ['Jeep', 'patriot', [2012], 'Integrated Power Module (IPM)', 8],
  ['Jeep', 'patriot', [2013], 'Integrated Power Module (IPM)', 8],
  ['Jeep', 'patriot', [2015], 'Integrated Power Module (IPM)', 8],
  ['Jeep', 'patriot', [2017], 'Integrated Power Module (IPM)', 8],
];
for (const [make, model, years, pn, expCols] of mapped) {
  for (const yr of years) {
    const d = findFuseData(make, model, yr);
    check(d && d.panels, `mapped lookup ${make} ${model} ${yr}`);
    if (!d || !d.panels) continue;
    const p = d.panels.find(p => p.name === pn);
    check(p, `mapped panel ${make} ${model} ${yr} ${pn} exists`);
    if (!p) continue;
    check(p && p.layout, `${make} ${model} ${yr} ${pn} has layout`);
    if (p && p.layout) {
      const { cols, rows, cells } = p.layout;
      check(Number.isInteger(cols) && cols === expCols, `${make} ${model} ${pn} cols=${cols} (expected ${expCols})`);
      check(Number.isInteger(rows) && rows >= 1, `${make} ${model} ${pn} rows=${rows}`);
      check(cells && Object.keys(cells).length >= 1, `${make} ${model} ${pn} has cells`);
      const valid = new Set([...(p.fuses || []).map(f => f.pos), ...(p.relays || []).map(r => r.pos)]);
      check(valid.size >= 1, `${make} ${model} ${pn} has fuses or relays (relays-only rule)`);
      const orphan = Object.keys(cells || {}).filter(k => !valid.has(k));
      check(orphan.length === 0, `${make} ${model} ${pn} orphan cells: ${orphan.join(',')}`);
      const bad = Object.entries(cells || {}).filter(([k, c]) =>
        !Number.isInteger(c.col) || c.col < 1 || c.col > cols ||
        !Number.isInteger(c.row) || c.row < 1 || c.row > rows ||
        !Number.isInteger(c.w) || c.w < 1 ||
        !Number.isInteger(c.h) || c.h < 1 ||
        c.col + c.w - 1 > cols || c.row + c.h - 1 > rows);
      check(bad.length === 0, `${make} ${model} ${pn} out-of-bounds cells: ${bad.map(([k]) => k).join(',')}`);
    }
  }
}

// ── 2. Gap year-blocks must stay WITHOUT any layout ───────────────────────────
// [make, model, sampleYears...] — EVERY panel in the resolved block asserted
// layout-free (covers Subaru ALL scope panels, Acura Integra — no source page,
// Jeep Grand Cherokee TIPM/WL).
const gapBlocks = [
  // Subaru — ALL 8 panels honest gaps (shared 5-model template dataset)
  ['Subaru', 'crosstrek', 2021, 2024],
  ['Subaru', 'forester', 2021, 2024],
  ['Subaru', 'impreza', 2021, 2024],
  ['Subaru', 'legacy', 2021, 2024],
  // Acura Integra — no source page exists for this model
  ['Acura', 'integra', 2023, 2025],
  // Jeep Grand Cherokee — TIPM (2020-21) + WL (2022-26) all below cutoff
  ['Jeep', 'grand cherokee', 2020, 2023],
];
for (const [make, model, ...years] of gapBlocks) {
  for (const yr of years) {
    const d = findFuseData(make, model, yr);
    check(d && d.panels, `gap lookup ${make} ${model} ${yr}`);
    if (!d || !d.panels) continue;
    const withLayout = (d.panels || []).filter(p => p.layout);
    check(withLayout.length === 0,
      `${make} ${model} ${yr}: ${withLayout.length} panel(s) have layout — must stay list-only (honest gap): ${withLayout.map(p => p.name).join(' | ')}`);
  }
}
// panel-level gaps inside blocks that DO carry other layouts
const panelGaps = [
  // Acura (letter-pos / sub-cutoff panels)
  ['Acura', 'mdx', 2023, 'Passenger Compartment Fuse Box'],
  ['Acura', 'rdx', 2021, 'Engine Compartment Main Fuses'],
  ['Acura', 'rdx', 2021, 'Passenger Compartment Main Fuses'],
  ['Acura', 'tlx', 2017, 'Interior Fuse Box'],
  // Lexus (positionless source rows / below cutoff)
  ['Lexus', 'es', 2021, 'Engine Compartment Fuse Box \u21161 (2GR-FKS / A25A-FKS)'],
  ['Lexus', 'es', 2021, 'Engine Compartment Fuse Box \u21161 (A25A-FXS)'],
  ['Lexus', 'es', 2021, 'Engine Compartment Fuse Box \u21162'],
  ['Lexus', 'is', 2009, 'Engine Compartment Fuse Box No.1'],
  ['Lexus', 'is', 2018, 'Passenger Compartment Fuse Box'],
  // Jeep (below cutoff)
  ['Jeep', 'cherokee', 2021, 'Underhood Power Distribution Center (PDC)'],
  ['Jeep', 'renegade', 2021, 'Engine Compartment Fuse Box'],
  ['Jeep', 'renegade', 2021, 'Dashboard Fuse Box'],
  ['Jeep', 'renegade', 2021, 'Luggage Compartment Fuse Box'],
  ['Jeep', 'compass', 2019, 'Passenger Compartment Fuse Box'],
  ['Jeep', 'compass', 2024, 'Passenger Compartment Fuse Box'],
  ['Jeep', 'compass', 2024, 'Rear Compartment Fuse Box'],
  // Jeep Wrangler 2022-26 — prior-wave honest gap must stay list-only
  ['Jeep', 'wrangler', 2023, 'Power Distribution Center (PDC)'],
];
for (const [make, model, yr, pn] of panelGaps) {
  const d = findFuseData(make, model, yr);
  check(d && d.panels, `panel-gap lookup ${make} ${model} ${yr}`);
  if (!d || !d.panels) continue;
  const p = d.panels.find(p => p.name === pn);
  check(p, `panel-gap panel ${make} ${model} ${yr} ${pn} exists`);
  if (p) check(!p.layout, `${make} ${model} ${yr} ${pn} must stay list-only (honest gap)`);
}
// whole-make scan: exact per-make layout totals — wave-14 NEW counts are
// acura=23 lexus=8 subaru=0 jeep=18; totals include prior-wave layouts from
// main (lexus nx/rx = 4, subaru outback = 2, jeep wrangler/gladiator = 2).
const expectedPerMake = { acura: 23, lexus: 12, subaru: 2, jeep: 20 };
for (const [make, models] of Object.entries(fuseBoxData)) {
  if (!(make in expectedPerMake)) continue;
  let n = 0;
  for (const [model, ranges] of Object.entries(models || {})) {
    for (const [yr, d] of Object.entries(ranges || {})) {
      n += (d.panels || []).filter(p => p.layout).length;
    }
  }
  check(n === expectedPerMake[make], `${make}: expected ${expectedPerMake[make]} layouts total, found ${n} (whole-make scan)`);
}
// wave-14 NEW counts must be exactly 49 (23+8+0+18) — i.e. 49 more than main
// (0+4+2+2 = 8 prior): assert branch totals - prior = the 49 mapped above.
{
  let grand = 0;
  for (const [make, models] of Object.entries(fuseBoxData)) {
    for (const [model, ranges] of Object.entries(models || {})) {
      for (const [yr, d] of Object.entries(ranges || {})) {
        grand += (d.panels || []).filter(p => p.layout).length;
      }
    }
  }
  check(grand === 430, `total layout blocks across all makes: expected 430, found ${grand}`);
}

// ── 3. Prior-wave layouts must still resolve (regression) ────────────────────
// [make, model, year, panelName, expectsLayout]
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
  // Wave 9-ish prior layouts in wave-14 makes (must be untouched)
  ['Jeep', 'wrangler', 2020, 'Power Distribution Center (PDC)', true],
  ['Jeep', 'gladiator', 2021, 'Power Distribution Center (PDC)', true],
  ['Subaru', 'outback', 2023, 'Main Fuse Box (Engine Compartment)', true],
  ['Subaru', 'outback', 2023, 'Fuse Panel (Interior)', true],
  ['Lexus', 'rx', 2018, 'Passenger Compartment Fuse Box', true],
  ['Lexus', 'rx', 2018, 'Engine Compartment Fuse Box', true],
  ['Lexus', 'nx', 2018, 'Passenger Compartment Fuse Box', true],
  ['Lexus', 'nx', 2018, 'Engine Compartment Fuse Box \u21161 (NX 200t)', true],
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

console.log(`TOTAL: ${total}  OK: ${ok}  FAIL: ${fail}`);
console.log('MAPPED: 49 layouts (acura 23, lexus 8, jeep 18; subaru 0)');
console.log('GAP BLOCKS: ' + gapBlocks.reduce((a, g) => a + g.length - 2, 0) + ' sample lookups asserted layout-free (Subaru ALL 4 scope models + Acura Integra + Jeep Grand Cherokee)');
console.log('PANEL-LEVEL GAPS: ' + panelGaps.length + ' (Acura/Lexus/Jeep sub-cutoff + Wrangler 2022-26)');
console.log('WHOLE-MAKE SCAN: acura=23 lexus=12 subaru=2 jeep=20 asserted; grand total 430');
if (fail) process.exit(1);
console.log('PASS: Wave 14 Acura+Lexus+Subaru+Jeep — 49 layouts, honest gaps clean, prior-wave layouts still resolve');
