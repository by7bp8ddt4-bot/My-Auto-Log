#!/usr/bin/env bun
/* Wave 13 fuse-layout verifier — Mazda + Lincoln (73 layouts).
 *
 * Wave 13 researched 29 fuse-box.info generation pages across 4 makes
 * (saved in /home/team/shared/vehicle-data/fuse-layout/wave13/pages/,
 * parsed to source-pages.json; match13b.py = position-aware matcher;
 * match13b.out = full run — every mapped panel shows the source table at
 * cov>=0.94 AND posAgree>=0.94 AND popCover=1.00; insert_wave13.py MAP +
 * insert13.log = the splice record; hashcheck.out = dataset-hash audit).
 *
 * Mapping decision (documented in insert_wave13.py MAP): a layout was added
 * ONLY where the app dataset matched a physical source table 1:1 with
 * cov>=0.94 AND posAgree>=0.94 AND popCover=1.00 — 73 layouts:
 *   - Mazda 61: 3 ×20 (BK/BL/BM-BN year blocks, engine + passenger),
 *     6 ×16 (GG1/GH1/GJ), CX-5 ×6, CX-30 ×2, CX-9 ×4, MX-5 ×13
 *     (NA engine+trunk, NB engine, NC engine, ND engine+passenger)
 *   - Lincoln 12: Navigator ×4 (2018-19 passenger, 2022-24 engine,
 *     2025-26 engine+passenger), Nautilus ×4 (2019-23 + 2024-26
 *     engine+passenger), Aviator ×4 (2020-24 + 2025-26 engine+passenger)
 *
 * Honest gaps (all stay list-only; the whole-make scan below asserts the
 * exact per-make layout totals mazda=61 mitsubishi=0 lincoln=12 volvo=0 so
 * no panel outside the 73 can silently carry a layout):
 *   - Volvo: ALL panels (s60/xc60/xc90/xc40, 3 panels each × 4 models) —
 *     the 4 researched pages are the SAME template dataset (hash-check:
 *     3 unique source hashes reused across n=4 pages) and the matcher tops
 *     out at cov 0.33-0.36 / posAgree 8-13 of 33-36 — not 1:1; list-only.
 *   - Mitsubishi: ALL panels (outlander 2014-16/2017-21, mirage
 *     2014/2015-16/2017-24) — the researched pages contain 0 parseable
 *     tables (photos only); no source to transcribe; list-only.
 *   - Mazda below-cutoff: 3 2019-2024 (BP — matcher below 0.94),
 *     CX-50 2023-2024 (page downloaded, below cutoff), MX-5
 *     'Instrument Panel Fuse Block' (NA) and 'Passenger Compartment
 *     Fuse Block' (NB/NC years) — no table matched at threshold;
 *     626/protege/millenia/rx-8/b-series were not researched this wave.
 *   - Lincoln Corsair 2020-2026: best match cov 0.31-0.34 — list-only.
 *
 * Run: bun tools/verify-wave13-layouts.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData } from '../src/components/FuseBox.jsx';
let fail = 0, ok = 0, total = 0;
const check = (c, m) => { total++; if (c) ok++; else { fail++; console.log('FAIL:', m); } };

// ── 1. The 73 mapped layouts resolve for sample in-range years ───────────────
// [make, model, year(s), panelName] — years inside the exact year block
// (findFuseData first-match caveat: sample years hit the exact block).
const mapped = [
  // ---- Mazda 3 (20) ----
  ['Mazda', '3', [2004], 'Engine Compartment Fuse Block'],
  ['Mazda', '3', [2004], 'Passenger Compartment Fuse Block'],
  ['Mazda', '3', [2006], 'Engine Compartment Fuse Block'],
  ['Mazda', '3', [2006], 'Passenger Compartment Fuse Block'],
  ['Mazda', '3', [2007], 'Engine Compartment Fuse Block'],
  ['Mazda', '3', [2007], 'Passenger Compartment Fuse Block'],
  ['Mazda', '3', [2009], 'Engine Compartment Fuse Block'],
  ['Mazda', '3', [2009], 'Passenger Compartment Fuse Block'],
  ['Mazda', '3', [2010], 'Engine Compartment Fuse Block'],
  ['Mazda', '3', [2010], 'Passenger Compartment Fuse Block'],
  ['Mazda', '3', [2011], 'Engine Compartment Fuse Block'],
  ['Mazda', '3', [2011], 'Passenger Compartment Fuse Block'],
  ['Mazda', '3', [2012], 'Engine Compartment Fuse Block'],
  ['Mazda', '3', [2012], 'Passenger Compartment Fuse Block'],
  ['Mazda', '3', [2014], 'Engine Compartment Fuse Block'],
  ['Mazda', '3', [2014], 'Passenger Compartment Fuse Block'],
  ['Mazda', '3', [2015], 'Engine Compartment Fuse Block'],
  ['Mazda', '3', [2015], 'Passenger Compartment Fuse Block'],
  ['Mazda', '3', [2017], 'Engine Compartment Fuse Block'],
  ['Mazda', '3', [2017], 'Passenger Compartment Fuse Block'],
  // ---- Mazda 6 (16) ----
  ['Mazda', '6', [2003], 'Engine Compartment Fuse Block'],
  ['Mazda', '6', [2005], 'Engine Compartment Fuse Block'],
  ['Mazda', '6', [2006], 'Engine Compartment Fuse Block'],
  ['Mazda', '6', [2006], 'Passenger Compartment Fuse Block'],
  ['Mazda', '6', [2009], 'Engine Compartment Fuse Block'],
  ['Mazda', '6', [2009], 'Passenger Compartment Fuse Block'],
  ['Mazda', '6', [2011], 'Engine Compartment Fuse Block'],
  ['Mazda', '6', [2011], 'Passenger Compartment Fuse Block'],
  ['Mazda', '6', [2013], 'Engine Compartment Fuse Block'],
  ['Mazda', '6', [2013], 'Passenger Compartment Fuse Block'],
  ['Mazda', '6', [2016], 'Engine Compartment Fuse Block'],
  ['Mazda', '6', [2016], 'Passenger Compartment Fuse Block'],
  ['Mazda', '6', [2017], 'Engine Compartment Fuse Block'],
  ['Mazda', '6', [2017], 'Passenger Compartment Fuse Block'],
  ['Mazda', '6', [2018], 'Engine Compartment Fuse Block'],
  ['Mazda', '6', [2018], 'Passenger Compartment Fuse Block'],
  // ---- Mazda CX-5 (6) ----
  ['Mazda', 'cx-5', [2017], 'Engine Compartment Fuse Block'],
  ['Mazda', 'cx-5', [2017], 'Passenger Compartment Fuse Block'],
  ['Mazda', 'cx-5', [2018], 'Engine Compartment Fuse Block'],
  ['Mazda', 'cx-5', [2018], 'Passenger Compartment Fuse Block'],
  ['Mazda', 'cx-5', [2022], 'Engine Compartment Fuse Block'],
  ['Mazda', 'cx-5', [2022], 'Passenger Compartment Fuse Block'],
  // ---- Mazda CX-30 (2) ----
  ['Mazda', 'cx-30', [2020], 'Passenger Compartment Fuse Box'],
  ['Mazda', 'cx-30', [2020], 'Engine Compartment Fuse Box'],
  // ---- Mazda CX-9 (4) ----
  ['Mazda', 'cx-9', [2016], 'Engine Compartment Fuse Block'],
  ['Mazda', 'cx-9', [2016], 'Passenger Compartment Fuse Panel'],
  ['Mazda', 'cx-9', [2018], 'Engine Compartment Fuse Block'],
  ['Mazda', 'cx-9', [2018], 'Passenger Compartment Fuse Panel'],
  // ---- Mazda MX-5 (13) ----
  ['Mazda', 'mx-5', [1990], 'Engine Compartment Fuse Block'],
  ['Mazda', 'mx-5', [1990], 'Trunk Fuse Block'],
  ['Mazda', 'mx-5', [2002], 'Engine Compartment Fuse Block'],
  ['Mazda', 'mx-5', [2004], 'Engine Compartment Fuse Block'],
  ['Mazda', 'mx-5', [2006], 'Engine Compartment Fuse Block'],
  ['Mazda', 'mx-5', [2008], 'Engine Compartment Fuse Block'],
  ['Mazda', 'mx-5', [2012], 'Engine Compartment Fuse Block'],
  ['Mazda', 'mx-5', [2016], 'Engine Compartment Fuse Block'],
  ['Mazda', 'mx-5', [2016], 'Passenger Compartment Fuse Panel'],
  ['Mazda', 'mx-5', [2017], 'Engine Compartment Fuse Block'],
  ['Mazda', 'mx-5', [2017], 'Passenger Compartment Fuse Panel'],
  ['Mazda', 'mx-5', [2018], 'Engine Compartment Fuse Block'],
  ['Mazda', 'mx-5', [2018], 'Passenger Compartment Fuse Panel'],
  // ---- Lincoln Navigator (4) ----
  ['Lincoln', 'navigator', [2018], 'Passenger Compartment Fuse Panel'],
  ['Lincoln', 'navigator', [2022], 'Engine Compartment Fuse Box'],
  ['Lincoln', 'navigator', [2025], 'Engine Compartment Fuse Box'],
  ['Lincoln', 'navigator', [2025], 'Passenger Compartment Fuse Box'],
  // ---- Lincoln Nautilus (4) ----
  ['Lincoln', 'nautilus', [2019], 'Engine Compartment Fuse Box (Power Distribution Box)'],
  ['Lincoln', 'nautilus', [2019], 'Passenger Compartment Fuse Panel'],
  ['Lincoln', 'nautilus', [2024], 'Engine Compartment Fuse Box (Power Distribution Box)'],
  ['Lincoln', 'nautilus', [2024], 'Passenger Compartment Fuse Panel'],
  // ---- Lincoln Aviator (4) ----
  ['Lincoln', 'aviator', [2020], 'Passenger Compartment Fuse Panel'],
  ['Lincoln', 'aviator', [2020], 'Engine Compartment Fuse Box (Power Distribution Box)'],
  ['Lincoln', 'aviator', [2025], 'Engine Compartment Fuse Box (Power Distribution Box)'],
  ['Lincoln', 'aviator', [2025], 'Passenger Compartment Fuse Panel'],
];
for (const [make, model, years, pn] of mapped) {
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
      check(Number.isInteger(cols) && cols >= 1, `${make} ${model} ${pn} cols=${cols}`);
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
// layout-free (covers Volvo ALL, Mitsubishi ALL, Mazda below-cutoff models,
// Lincoln Corsair).
const gapBlocks = [
  // Volvo — ALL panels honest gaps (template dataset, matcher cov<=0.36)
  ['Volvo', 's60', 2005, 2010, 2020],
  ['Volvo', 'xc60', 2010, 2020],
  ['Volvo', 'xc90', 2008, 2020],
  ['Volvo', 'xc40', 2020],
  // Mitsubishi — ALL panels honest gaps (photos-only pages, 0 tables)
  ['Mitsubishi', 'outlander', 2014, 2019],
  ['Mitsubishi', 'mirage', 2016, 2020],
  // Mazda below-cutoff / un-researched blocks
  ['Mazda', '3', 2020, 2023],
  ['Mazda', 'cx-50', 2023],
  ['Mazda', '626', 2001],
  ['Mazda', 'protege', 2001],
  ['Mazda', 'millenia', 2001],
  ['Mazda', 'rx-8', 2006, 2010],
  ['Mazda', 'b-series', 2004],
  // Lincoln Corsair — below cutoff (cov 0.31-0.34)
  ['Lincoln', 'corsair', 2020, 2023],
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
// panel-level gaps inside blocks that DO carry other layouts (MX-5)
const panelGaps = [
  ['Mazda', 'mx-5', 1994, 'Instrument Panel Fuse Block'],
  ['Mazda', 'mx-5', 2003, 'Passenger Compartment Fuse Block'],
  ['Mazda', 'mx-5', 2006, 'Passenger Compartment Fuse Block'],
  ['Mazda', 'mx-5', 2008, 'Passenger Compartment Fuse Block'],
  ['Mazda', 'mx-5', 2012, 'Passenger Compartment Fuse Block'],
];
for (const [make, model, yr, pn] of panelGaps) {
  const d = findFuseData(make, model, yr);
  check(d && d.panels, `panel-gap lookup ${make} ${model} ${yr}`);
  if (!d || !d.panels) continue;
  const p = d.panels.find(p => p.name === pn);
  check(p, `panel-gap panel ${make} ${model} ${yr} ${pn} exists`);
  if (p) check(!p.layout, `${make} ${model} ${yr} ${pn} must stay list-only (honest gap)`);
}
// whole-make scan: exact per-make layout totals (no panel outside the 73 may
// carry a layout anywhere in these 4 makes)
const expectedPerMake = { mazda: 61, mitsubishi: 0, lincoln: 12, volvo: 0 };
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
  // Wave 11 regression: VW golf + Audi a4 layouts still resolve
  ['Volkswagen', 'golf', 2020, 'Fuse Panel on Left Side of Dashboard', true],
  ['Audi', 'a4', 2018, 'Dashboard Fuse Panel', true],
  // Wave 12 regression: GMC Sierra + Dodge Charger layouts still resolve
  ['GMC', 'sierra', 2015, 'Engine Compartment Fuse Block', true],
  ['Dodge', 'charger', 2020, 'Engine Compartment (Front Power Distribution Center)', true],
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
console.log('MAPPED: 73 layouts (mazda 61, lincoln 12)');
console.log('GAP BLOCKS: ' + gapBlocks.reduce((a, g) => a + g.length - 2, 0) + ' sample lookups asserted layout-free (Volvo ALL + Mitsubishi ALL + Mazda/Lincoln below-cutoff)');
console.log('PANEL-LEVEL GAPS: ' + panelGaps.length + ' (MX-5 non-mapped panels)');
console.log('WHOLE-MAKE SCAN: mazda=61 mitsubishi=0 lincoln=12 volvo=0 asserted');
if (fail) process.exit(1);
console.log('PASS: Wave 13 Mazda+Lincoln — 73 layouts, honest gaps clean, prior-wave layouts still resolve');
