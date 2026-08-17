#!/usr/bin/env bun
/* Wave 15 fuse-layout verifier — Pontiac + Oldsmobile + MG (36 layouts).
 *
 * Wave 15 researched fuse-box.info pages across 3 makes (saved in
 * /home/team/shared/vehicle-data/fuse-layout/wave15/pages/, parsed to
 * source-pages.json; match15.py = position-aware matcher; match15.out = full
 * run — every mapped panel shows the source table at cov>=0.94 AND
 * posAgree>=0.94 AND popCover=1.00; insert_wave15.py MAP + insert15.log = the
 * splice record; verify15-detail.txt = side-by-side app-vs-source evidence).
 *
 * Mapping decision (documented in insert_wave15.py MAP): a layout was added
 * ONLY where the app dataset matched a physical source table 1:1 with
 * cov>=0.94 AND posAgree>=0.94 AND popCover=1.00 — 36 layouts:
 *   - Pontiac 20: aztek (2), bonneville (2), firebird 1996-97 IPB (1),
 *     g5 pass (1), g6 eng+luggage (2), g8 (3), grand-prix 97-03 eng (1),
 *     grand-prix 04-08 eng 3.8L (1), montana 2001 pass (1), montana-sv6
 *     pass (1), pursuit pass (1), solstice (2), torrent 07-09 eng (1),
 *     vibe 09-10 eng (1)
 *   - Oldsmobile 12: 88 driver (1), alero 99-00 eng (1), aurora 97-99
 *     eng+IPB+rear-left (3), aurora 01-03 eng+pass (2), bravada 99-01 IPB (1),
 *     bravada 02-04 eng+pass (2), cutlass eng (1), intrigue eng (1)
 *   - MG 4: mg6 auxiliary (1), zr eng+pass (2), zs-ev 22-24 pass (1)
 *
 * Honest gaps (all stay list-only; the whole-make scan below asserts the exact
 * per-make layout totals pontiac=20 oldsmobile=12 mg=4 so no panel outside
 * the 36 new + prior layouts can silently carry one):
 *   - Pontiac: g3 (name-only source tables, no positions), gto (name-only),
 *     grand-am (mixed name-only + pos tables below cutoff), sunfire (all 8
 *     tables name-only — no position column at all), trans-sport (0.9x mixed),
 *     vibe 2003-08 (name-only source), firebird 92-95 / 98-02 (0.65-0.90),
 *     montana engine all blocks (0.85 shared dataset), montana pass 98-99/
 *     2000/02-04 (positionless app rows), montana-sv6 eng (0.93), pursuit eng
 *     (0.57), torrent 05-06 (0.38) + 07-09 pass, g5 eng (0.48), g6 pass
 *     (0.29), grand-prix pass both gens (0.25/0.29) + 04-08 eng 5.3L V8
 *     (0.76 — name-based app rows), vibe 09-10 pass (0.93)
 *   - Oldsmobile: 88 passenger side (0.92), achieva (mixed name-only),
 *     alero IPB #1/#2 + 01-04 eng (0.90), aurora 97-99 rear right (0.89 —
 *     range positions '1 2' etc), bravada 99-01 eng (name-only source),
 *     cutlass IPB left/right (name-based app rows), intrigue IPB (0.42),
 *     silhouette (mixed name-only)
 *   - MG: gs (0.68-0.83), hs (0.51-0.83), hs-phev (0.64-0.85), mg3 both gens
 *     (0.74-0.93 — engine 13-18 at 0.93 just under floor), mg4 (0.68/0.69),
 *     mg5 (0.70-0.76), mg6 pass/eng/battery (0.86-0.93), zs both gens
 *     (0.66-0.91), zs-ev 19-21 (0.64-0.90), zs-ev 22-24 front (0.64) —
 *     MG source tables are position-complete, but the app dataset merges
 *     adjacent fuses into range rows ('F6 F7', 'F37 41') so posAgree drops
 *     below the 1:1 floor (W13-Volvo precedent keeps these list-only).
 *
 * Run: bun tools/verify-wave15-layouts.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData } from '../src/components/FuseBox.jsx';
let fail = 0, ok = 0, total = 0;
const check = (c, m) => { total++; if (c) ok++; else { fail++; console.log('FAIL:', m); } };

// ── 1. The 36 mapped layouts resolve for sample in-range years ───────────────
// [make, model, year(s), panelName, expectedCols]
const mapped = [
  // ---- MG (4) ----
  ['MG', 'mg6', [2015], 'Auxiliary Fuse Box', 3],
  ['MG', 'zr', [2003], 'Engine Compartment Fuse Box', 10],
  ['MG', 'zr', [2003], 'Passenger Compartment Fuse Box', 6],
  ['MG', 'zs-ev', [2023], 'Passenger Compartment Fuse Box', 6],
  // ---- Oldsmobile (12) ----
  ['Oldsmobile', '88', [1996], 'Driver Side Fuse Box', 6],
  ['Oldsmobile', 'alero', [2000], 'Engine Compartment Fuse Box (1999-2000)', 10],
  ['Oldsmobile', 'aurora', [1998], 'Engine Compartment Fuse Box', 5],
  ['Oldsmobile', 'aurora', [1998], 'Instrument Panel Fuse Box', 6],
  ['Oldsmobile', 'aurora', [1998], 'Rear Compartment Fuse Box (Left)', 4],
  ['Oldsmobile', 'aurora', [2002], 'Engine Compartment Fuse Box', 10],
  ['Oldsmobile', 'aurora', [2002], 'Passenger Compartment Fuse Box', 10],
  ['Oldsmobile', 'bravada', [2000], 'Instrument Panel Fuse Box', 6],
  ['Oldsmobile', 'bravada', [2003], 'Engine Compartment Fuse Box', 10],
  ['Oldsmobile', 'bravada', [2003], 'Passenger Compartment Fuse Box', 6],
  ['Oldsmobile', 'cutlass', [1998], 'Engine Compartment Fuse Box', 10],
  ['Oldsmobile', 'intrigue', [2001], 'Engine Compartment Fuse Box', 10],
  // ---- Pontiac (20) ----
  ['Pontiac', 'aztek', [2002], 'Engine Compartment Fuse Box', 10],
  ['Pontiac', 'aztek', [2002], 'Passenger Compartment Fuse Box', 6],
  ['Pontiac', 'bonneville', [2002], 'Engine Compartment Fuse Box', 10],
  ['Pontiac', 'bonneville', [2002], 'Rear Underseat Fuse Box', 10],
  ['Pontiac', 'firebird', [1997], 'Instrument Panel Fuse Box', 6],
  ['Pontiac', 'g5', [2008], 'Passenger Compartment Fuse Box', 6],
  ['Pontiac', 'g6', [2007], 'Engine Compartment Fuse Box', 10],
  ['Pontiac', 'g6', [2007], 'Luggage Compartment Fuse Box', 6],
  ['Pontiac', 'g8', [2009], 'Engine Compartment Fuse Box', 10],
  ['Pontiac', 'g8', [2009], 'Luggage Compartment Fuse Box', 4],
  ['Pontiac', 'g8', [2009], 'Passenger Compartment Fuse Box', 6],
  ['Pontiac', 'grand-prix', [2000], 'Engine Compartment Fuse Box', 10],
  ['Pontiac', 'grand-prix', [2006], 'Engine Compartment Fuse Box (3.8L V6)', 10],
  ['Pontiac', 'montana', [2001], 'Passenger Compartment Fuse Box (2001 diagram)', 6],
  ['Pontiac', 'montana-sv6', [2007], 'Passenger Compartment Fuse Box', 6],
  ['Pontiac', 'pursuit', [2006], 'Passenger Compartment Fuse Box', 6],
  ['Pontiac', 'solstice', [2008], 'Engine Compartment Fuse Box', 10],
  ['Pontiac', 'solstice', [2008], 'Passenger Compartment Fuse Box', 6],
  ['Pontiac', 'torrent', [2008], 'Engine Compartment Fuse Box (2007-2009)', 10],
  ['Pontiac', 'vibe', [2010], 'Engine Compartment Fuse Box', 10],
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
// layout-free.
const gapBlocks = [
  // Pontiac — no source positions (name-only tables) or sub-cutoff
  ['Pontiac', 'g3', 2009, 2010],
  ['Pontiac', 'grand-am', 2001, 2004],
  ['Pontiac', 'gto', 2005],
  ['Pontiac', 'sunfire', 1997, 2002],
  ['Pontiac', 'trans-sport', 1998],
  ['Pontiac', 'vibe', 2005],           // 2003-2008 block (name-only source)
  ['Pontiac', 'firebird', 1994],       // 1992-1995 block
  ['Pontiac', 'firebird', 2000],       // 1998-2002 block
  ['Pontiac', 'montana', 1999, 2000, 2003], // 98-99 / 2000 / 02-04 blocks (engine 0.85, pass name-only)
  // Oldsmobile
  ['Oldsmobile', 'achieva', 1994, 1997],
  ['Oldsmobile', 'silhouette', 2000, 2002],
  ['Oldsmobile', 'alero', 2002],       // 2001-2004 block (engine 0.90, IPB #-tables)
  // MG — range-position datasets below the 1:1 floor
  ['MG', 'gs', 2017],
  ['MG', 'hs', 2021],
  ['MG', 'hs-phev', 2022],
  ['MG', 'mg3', 2015],                 // 2013-2018 block (engine 0.93 just under floor)
  ['MG', 'mg3', 2021],                 // 2019-2023 block
  ['MG', 'mg4', 2023],
  ['MG', 'mg5', 2022],
  ['MG', 'zs', 2018, 2022],
  ['MG', 'zs-ev', 2020],               // 2019-2021 block
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
  // MG mg6 (auxiliary mapped only)
  ['MG', 'mg6', 2015, 'Passenger Compartment Fuse Box'],
  ['MG', 'mg6', 2015, 'Engine Compartment Fuse Box'],
  ['MG', 'mg6', 2015, 'Battery Top Fuse Box'],
  ['MG', 'zs-ev', 2023, 'Front Compartment Fuse Box'],
  // Oldsmobile 88 (driver mapped only)
  ['Oldsmobile', '88', 1996, 'Passenger Side Fuse Box'],
  // Oldsmobile alero 99-00 (engine mapped only)
  ['Oldsmobile', 'alero', 2000, 'Instrument Panel Fuse Box #1 (1999-2000)'],
  ['Oldsmobile', 'alero', 2000, 'Instrument Panel Fuse Box #2 (1999-2000)'],
  // Oldsmobile aurora 97-99 (right rear below cutoff; eng/IPB/left mapped)
  ['Oldsmobile', 'aurora', 1998, 'Rear Compartment Fuse Box (Right)'],
  // Oldsmobile bravada 99-01 (engine source is name-only)
  ['Oldsmobile', 'bravada', 2000, 'Engine Compartment Fuse Box'],
  // Oldsmobile cutlass (engine mapped only)
  ['Oldsmobile', 'cutlass', 1998, 'Instrument Panel Fuse Box (Left)'],
  ['Oldsmobile', 'cutlass', 1998, 'Instrument Panel Fuse Box (Right)'],
  // Oldsmobile intrigue (engine mapped only)
  ['Oldsmobile', 'intrigue', 2001, 'Instrument Panel Fuse Box'],
  // Pontiac firebird 96-97 (IPB mapped only)
  ['Pontiac', 'firebird', 1997, 'Engine Compartment Fuse Box'],
  // Pontiac g5 (pass mapped only)
  ['Pontiac', 'g5', 2008, 'Engine Compartment Fuse Box'],
  // Pontiac g6 (eng+luggage mapped)
  ['Pontiac', 'g6', 2007, 'Passenger Compartment Fuse Box'],
  // Pontiac grand-prix (engine mapped only)
  ['Pontiac', 'grand-prix', 2000, 'Passenger Compartment Fuse Box'],
  ['Pontiac', 'grand-prix', 2006, 'Passenger Compartment Fuse Box'],
  ['Pontiac', 'grand-prix', 2006, 'Engine Compartment Fuse Box (5.3L V8)'],
  // Pontiac montana — shared engine dataset stays list-only in ALL blocks
  ['Pontiac', 'montana', 2001, 'Engine Compartment Fuse Box'],
  // Pontiac montana-sv6 (pass mapped only)
  ['Pontiac', 'montana-sv6', 2007, 'Engine Compartment Fuse Box'],
  // Pontiac pursuit (pass mapped only)
  ['Pontiac', 'pursuit', 2006, 'Engine Compartment Fuse Box'],
  // Pontiac torrent (07-09 eng mapped only)
  ['Pontiac', 'torrent', 2006, 'Passenger Compartment Fuse Box (2005-2006)'],
  ['Pontiac', 'torrent', 2006, 'Engine Compartment Fuse Box (2005-2006)'],
  ['Pontiac', 'torrent', 2008, 'Passenger Compartment Fuse Box (2007-2009)'],
  // Pontiac vibe 09-10 (eng mapped only)
  ['Pontiac', 'vibe', 2010, 'Passenger Compartment Fuse Box'],
];
for (const [make, model, yr, pn] of panelGaps) {
  const d = findFuseData(make, model, yr);
  check(d && d.panels, `panel-gap lookup ${make} ${model} ${yr}`);
  if (!d || !d.panels) continue;
  const p = d.panels.find(p => p.name === pn);
  check(p, `panel-gap panel ${make} ${model} ${yr} ${pn} exists`);
  if (p) check(!p.layout, `${make} ${model} ${yr} ${pn} must stay list-only (honest gap)`);
}
// whole-make scan: exact per-make layout totals for the wave-15 makes
// (pontiac=20 oldsmobile=12 mg=4 — all NEW this wave; no prior layouts exist
// in these makes).
const expectedPerMake = { pontiac: 20, oldsmobile: 12, mg: 4 };
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
// grand total across all makes: main had 430 (W14 verifier) + 36 new = 466
{
  let grand = 0;
  for (const [make, models] of Object.entries(fuseBoxData)) {
    for (const [model, ranges] of Object.entries(models || {})) {
      for (const [yr, d] of Object.entries(ranges || {})) {
        grand += (d.panels || []).filter(p => p.layout).length;
      }
    }
  }
  check(grand === 466, `total layout blocks across all makes: expected 466, found ${grand}`);
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
  // Wave 14 regression: Acura MDX + prior layouts in those makes
  ['Acura', 'mdx', 2023, 'Engine Compartment Fuse Box', true],
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
console.log('MAPPED: 36 layouts (pontiac 20, oldsmobile 12, mg 4)');
console.log('GAP BLOCKS: ' + gapBlocks.reduce((a, g) => a + g.length - 2, 0) + ' sample lookups asserted layout-free');
console.log('PANEL-LEVEL GAPS: ' + panelGaps.length);
console.log('WHOLE-MAKE SCAN: pontiac=20 oldsmobile=12 mg=4 asserted; grand total 466');
if (fail) process.exit(1);
console.log('PASS: Wave 15 Pontiac+Oldsmobile+MG — 36 layouts, honest gaps clean, prior-wave layouts still resolve');
