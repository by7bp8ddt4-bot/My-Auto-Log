#!/usr/bin/env bun
/* Wave 12 fuse-layout verifier — GMC + Buick + Dodge + Chrysler + RAM.
 *
 * Wave 12 researched 32 fuse-box.info generation pages across the 5 makes
 * (saved in /home/team/shared/vehicle-data/fuse-layout/wave12/pages/, parsed
 * to source-pages.json; match4.py = position-aware matcher; match4.out =
 * full run). Hash-check found ALL 153 app panels unique datasets (no
 * Hyundai/Kia-style templates, no VW/Audi-style shared sets) — real
 * per-model data throughout. Every page carries a position column, so
 * positions ARE mappable.
 *
 * Mapping decision (documented in insert_wave12.py MAP + NOTES.md): a layout
 * was added ONLY where the app dataset matched a physical source table 1:1
 * (cov=1.00 AND posAgree=N/N AND posCover=1.00) AND was in the verified
 * manifest — 21 layouts:
 *   - GMC Sierra mk4 (K2XX) 2014-2017: Engine (72/72) + IP Left (37/37) +
 *     IP Right (28/28) — gmc_sierra_mk4 s2t0/s2t1/s2t2
 *   - GMC Sierra 2018: Engine (79/79) + IP Left (38/38) + IP Right (28/28) —
 *     gmc_sierra_mk4 s2t3/s2t4/s2t5
 *   - GMC Yukon 2015-2016 (K2XX SUV, platform twin of Tahoe): Engine (76/76)
 *     + IP Left (56/56) + IP Right (56/56) — gmc_yukon_1518 s2t0/s2t1/s2t2
 *   - Dodge Charger 2020-2021: Front PDC (41/41) + Trunk Rear PDC (63/63) —
 *     do_charger_1118 s2t10/s2t11
 *   - Dodge Challenger 2020-2021: Front PDC (41/41) + Luggage Rear PDC
 *     (63/63) — do_challenger_1518 s2t6/s2t7
 *   - Chrysler 300 2018-2023 (same LX-platform box): Front PDC (41/41) +
 *     Rear PDC (63/63) — do_charger_1118 s2t10/s2t13
 *   - Dodge Grand Caravan RT 2017-2020 IPM (59/59) — do_gcaravan_1118 s2t3
 *   - Dodge Journey 2011-2020: Interior (31/31) + Underhood PDC (46/46) —
 *     do_journey_1118 s1t0/s2t0
 *   - RAM 1500 DT 2025-2026 External PDC (98/98) — ram_1500_dt s2t5
 *   - RAM 3500 DS 2009-2010 IPM (54/54) + 2011-2012 IPM (49/49) —
 *     ram_ds_0918 s2t0/s2t1
 *
 * Honest gaps (all other panels across the 5 makes stay list-only):
 *   - Buick: ALL panels (encore/enclave/envision/lacrosse/lesabre/
 *     park-avenue/riviera/rendezvous) — matcher tops out at cov 0.26-1.00 but
 *     posAgree < 1.00 (e.g. encore 2013-16 Engine 42/55, lacrosse 2010-12
 *     Engine 63/63 but Passenger 26/26 posCover 0.90; lesabre/park-avenue/
 *     riviera 0.27-0.36) — app position numbering does not line up 1:1 with
 *     any source table; left list-only.
 *   - GMC Sierra mk5 2019-2026: engine/IP blocks match tables at cov
 *     0.96-1.00 but posCover 0.28-0.93 and/or SPARE-row gaps (e.g. 2019-20
 *     IP Right 51/52 posCover 0.93; 2023-26 IP Right 30/31 posCover 0.56) —
 *     not 1:1; list-only.
 *   - GMC Terrain 2018-2024 (0.95-0.98, posAgree gaps), Terrain 2025-2026,
 *     Acadia 2017-2023 + 2024-2026 (0.89-1.00 but posAgree < 1.00 on some),
 *     Canyon 2015-2018/2023-2026, Yukon 2007-2014 (posAgree 0/0 — app
 *     numbering differs), Yukon 2017-2020 (0.41-0.62), Yukon 2021-2026
 *     (0.60-0.84), Yukon XL — list-only.
 *   - Dodge Charger 2022-2023/2024-2025/2026 (renamed F/R PDC tables),
 *     Challenger 2022-2023, Durango 2020-2026 (0.99 match on a NEW box but
 *     app dataset is the older PDC — not 1:1), Grand Caravan 2011-2016.
 *   - Chrysler Pacifica 2020 + 2021-2024 (0.74-0.75 — power distribution
 *     center layout differs).
 *   - RAM 1500 2020-2021/2022-2024 (Internal PDC tables 0.93-0.94 but
 *     posAgree 61-64/64-69), RAM 2500 2020-2026 (0.84-0.93 posAgree
 *     63-87/92-95), RAM 3500 2013-2018 (0.90-0.99 but cov < 1.00) +
 *     2019-2026 (0.90, posAgree 99/103) — list-only.
 *
 * The whole-make scan below asserts the exact per-make layout totals
 * (gmc=9, buick=0, dodge=7, chrysler=2, ram=3) so no panel outside the 21
 * can silently carry a layout, and every gap sample block is asserted
 * layout-free by construction.
 *
 * Run: bun tools/verify-wave12-layouts.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData } from '../src/components/FuseBox.jsx';
let fail = 0, ok = 0, total = 0;
const check = (c, m) => { total++; if (c) ok++; else { fail++; console.log('FAIL:', m); } };

// ── 1. The 21 mapped layouts resolve for sample in-range years ───────────────
// [make, model, year(s), panelName] — years inside the exact year block
// (findFuseData first-match caveat: sample years hit the exact block).
const mapped = [
  // GMC Sierra mk4 K2XX 2014-2017 (3)
  ['GMC', 'sierra', [2015, 2017], 'Engine Compartment Fuse Block'],
  ['GMC', 'sierra', [2015, 2017], 'Instrument Panel Fuse Block (Left)'],
  ['GMC', 'sierra', [2015, 2017], 'Instrument Panel Fuse Block (Right)'],
  // GMC Sierra 2018 (3)
  ['GMC', 'sierra', [2018], 'Engine Compartment Fuse Block'],
  ['GMC', 'sierra', [2018], 'Instrument Panel Fuse Block (Left)'],
  ['GMC', 'sierra', [2018], 'Instrument Panel Fuse Block (Right)'],
  // GMC Yukon 2015-2016 K2XX (3)
  ['GMC', 'yukon', [2016], 'Engine Compartment Fuse Block'],
  ['GMC', 'yukon', [2016], 'Instrument Panel Fuse Block (Left)'],
  ['GMC', 'yukon', [2016], 'Instrument Panel Fuse Block (Right)'],
  // Dodge Charger LD 2020-2021 (2)
  ['Dodge', 'charger', [2020], 'Engine Compartment (Front Power Distribution Center)'],
  ['Dodge', 'charger', [2020], 'Trunk (Rear Power Distribution Center)'],
  // Dodge Challenger 2020-2021 (2)
  ['Dodge', 'challenger', [2021], 'Engine Compartment (Front Power Distribution Center)'],
  ['Dodge', 'challenger', [2021], 'Luggage Compartment (Rear Power Distribution Center)'],
  // Chrysler 300 LD 2018-2023 (2)
  ['Chrysler', '300', [2020], 'Front Power Distribution Center'],
  ['Chrysler', '300', [2020], 'Rear Power Distribution Center'],
  // Dodge Grand Caravan RT 2017-2020 (1)
  ['Dodge', 'grand caravan', [2019], 'Integrated Power Module (IPM)'],
  // Dodge Journey 2011-2020 (2)
  ['Dodge', 'journey', [2015], 'Interior Fuse Box'],
  ['Dodge', 'journey', [2015], 'Underhood Fuse Box (Power Distribution Center)'],
  // RAM 1500 DT 2025-2026 (1)
  ['RAM', '1500', [2025], 'External Power Distribution Center (PDC)'],
  // RAM 3500 DS (2)
  ['RAM', '3500', [2009], 'Integrated Power Module (IPM)'],
  ['RAM', '3500', [2011], 'Integrated Power Module (IPM)'],
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
// layout-free (covers the documented gaps incl. all of Buick).
const gapBlocks = [
  // GMC Sierra mk5 2019-2026
  ['GMC', 'sierra', 2019, 2020, 2021, 2024],
  // GMC Terrain
  ['GMC', 'terrain', 2020, 2023, 2025],
  // GMC Acadia
  ['GMC', 'acadia', 2018, 2021, 2025],
  // GMC Canyon
  ['GMC', 'canyon', 2016, 2020, 2024],
  // GMC Yukon (all non-2015-2016 blocks)
  ['GMC', 'yukon', 2007, 2012, 2019, 2022, 2025],
  // GMC Yukon XL
  ['GMC', 'yukon-xl', 2020],
  // Buick — ALL panels honest gaps
  ['Buick', 'encore', 2015, 2020],
  ['Buick', 'enclave', 2020, 2025],
  ['Buick', 'envision', 2018, 2022, 2025],
  ['Buick', 'lacrosse', 2011, 2015, 2018, 2008],
  ['Buick', 'lesabre', 2003],
  ['Buick', 'park-avenue', 2002],
  ['Buick', 'riviera', 1997],
  ['Buick', 'rendezvous', 2004, 2006],
  // Dodge
  ['Dodge', 'charger', 2022, 2024, 2026],
  ['Dodge', 'challenger', 2022],
  ['Dodge', 'durango', 2023],
  ['Dodge', 'grand caravan', 2011, 2014],
  // Chrysler
  ['Chrysler', 'pacifica', 2020, 2022],
  // RAM
  ['RAM', '1500', 2020, 2023],
  ['RAM', '2500', 2020, 2023, 2025],
  ['RAM', '3500', 2013, 2015, 2016, 2018, 2022],
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
// whole-make scan: exact per-make layout totals (no panel outside the 21 may
// carry a layout anywhere in these 5 makes)
const expectedPerMake = { gmc: 9, buick: 0, dodge: 7, chrysler: 2, ram: 3 };
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
console.log('MAPPED: 21 layouts (gmc 9, dodge 7, chrysler 2, ram 3)');
console.log('GAP BLOCKS: ' + gapBlocks.reduce((a, g) => a + g.length - 2, 0) + ' sample lookups asserted layout-free (incl. ALL Buick panels)');
console.log('WHOLE-MAKE SCAN: gmc=9 buick=0 dodge=7 chrysler=2 ram=3 asserted');
if (fail) process.exit(1);
console.log('PASS: Wave 12 GMC+Buick+Dodge+Chrysler+RAM — 21 layouts, honest gaps clean, prior-wave layouts still resolve');
