#!/usr/bin/env bun
/* Wave 11 fuse-layout verifier — Volkswagen + Audi.
 *
 * Wave 11 researched 39 fuse-box.info pages covering every VW/Audi generation
 * in scope (Golf Mk5-Mk8, Jetta A6/A7, Tiguan 1/2, Atlas 1/2, Taos, Passat
 * B6/B7/B8/NA, ID.4; A4 B7/B8/B9, A5 8W6, Q5 8R/FY, Q7 4L/4M, A6 C6/C7/C8,
 * Q3 8U/F3, A3 8P/8V/8Y, Q8). Findings:
 *
 * 1. Hash-check first (W7-W10 lesson): ALL 7 VW models share ONE dashboard
 *    dataset (hash ee5d1754, 43 fuses + 4 relays) and ONE E-Box dataset
 *    (33ecce25, 27+6) — the Golf Mk7 (MQB) SC-panel data (ID.4's E-Box is the
 *    only variant: 83546525 EV scheme). ALL 9 Audi models share the SAME
 *    E-Box (ad9e0e7a, 50 fuses), Dashboard (f07c17df, 12) and Trunk
 *    (1d9b7f49, 25) datasets — the A4-B9/MLB-evo-generation data (A3 is the
 *    odd one: it carries the VW-style datasets).
 *
 * 2. Unlike Hyundai/Kia (no position column), every VW/Audi page carries a
 *    position column (SC1-SC53 / 1-54 / A2-B16 / F1-F39 numbering). The app
 *    datasets genuinely match specific generations:
 *    - VW dashboard + E-Box = Golf VII Mk7 (2013-2020) SC panel + E-Box
 *      (1:1 pos+circuit+amp vs the wave5-era page; current Mk7 page confirms
 *      the same panel).
 *    - Audi E-Box = Q5 FY (2018-2020) / A5 8W6 (2017-2020) "Fuse panel A
 *      (brown)" at 0.94/0.97 (33-34/35); Dashboard = Q5 FY / A4 B9 at 12/12;
 *      Trunk = Q5 FY "Fuse panel A (black)" at 17/17.
 *
 * 3. Honest-gap decisions (owner rule: no layout when the app dataset is not
 *    the model's physical box):
 *    - VW jetta (A7 SC1 = defogger relay, not ADBLUE; app = Golf 7 data),
 *      passat (US B6/NMS — NMS panel is SC1 = steering column lock, not
 *      ADBLUE; B8 which matches was never in the US range), tiguan (Tiguan 2
 *      swaps SC11/SC13 vs the app data), atlas (SC1/SC13 = Not Used; 2023+
 *      renumbered F-panel), id.4 (MEB EV — app EV E-Box matches nothing:
 *      best 0.14).
 *    - Audi a6/s6 (C8 E-Box 0.54, trunk 0.65 — different box), q7/sq7 (4M
 *      E-Box 0.57, B1-B8 all differ), a3 (app = VW MQB datasets; A3 8V page
 *      best 0.26/0.36).
 *    - Backlog models NOT in the app data tree (nothing to map): VW Taos,
 *      Audi A5, Q3, Q8, TT.
 *
 * Run: bun tools/verify-wave11-layouts.mjs
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData } from '../src/components/FuseBox.jsx';
let fail = 0, ok = 0, total = 0;
const check = (c, m) => { total++; if (c) ok++; else { fail++; console.log('FAIL:', m); } };

// ── 1. The 16 mapped layouts resolve for in-range sample years ───────────────
// [make, model, year(s), panelName] — years inside the exact year block
// (findFuseData first-match caveat: sample years hit the exact block).
const mapped = [
  ['Volkswagen', 'golf', [2020], 'Fuse Panel on Left Side of Dashboard'],
  ['Volkswagen', 'golf', [2020], 'Engine Compartment Fuse Box (E-Box)'],
  ['Volkswagen', 'gti', [2018], 'Fuse Panel on Left Side of Dashboard'],
  ['Volkswagen', 'gti', [2018], 'Engine Compartment Fuse Box (E-Box)'],
  ['Audi', 'a4', [2018, 2020], 'Engine Compartment Fuse Box (E-Box)'],
  ['Audi', 'a4', [2018, 2020], 'Dashboard Fuse Panel'],
  ['Audi', 'a4', [2018, 2020], 'Trunk Fuse Panel'],
  ['Audi', 's4', [2020], 'Engine Compartment Fuse Box (E-Box)'],
  ['Audi', 's4', [2020], 'Dashboard Fuse Panel'],
  ['Audi', 's4', [2020], 'Trunk Fuse Panel'],
  ['Audi', 'q5', [2019, 2022], 'Engine Compartment Fuse Box (E-Box)'],
  ['Audi', 'q5', [2019, 2022], 'Dashboard Fuse Panel'],
  ['Audi', 'q5', [2019, 2022], 'Trunk Fuse Panel'],
  ['Audi', 'sq5', [2021], 'Engine Compartment Fuse Box (E-Box)'],
  ['Audi', 'sq5', [2021], 'Dashboard Fuse Panel'],
  ['Audi', 'sq5', [2021], 'Trunk Fuse Panel'],
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

// ── 2. All in-scope gap panels must stay WITHOUT a layout ─────────────────────
// [make, model, sampleYears, panelNames...]
const gapPanels = [
  // VW — app dataset is the Golf-7/Mk7 SC+E-Box data; these models' ranges
  // never produced a car with that exact panel (or the panel differs).
  ['Volkswagen', 'jetta',  [2020, 2023], ['Fuse Panel on Left Side of Dashboard', 'Engine Compartment Fuse Box (E-Box)']],
  ['Volkswagen', 'passat', [2015, 2020], ['Fuse Panel on Left Side of Dashboard', 'Engine Compartment Fuse Box (E-Box)']],
  ['Volkswagen', 'tiguan', [2019, 2022], ['Fuse Panel on Left Side of Dashboard', 'Engine Compartment Fuse Box (E-Box)']],
  ['Volkswagen', 'atlas',  [2019, 2022], ['Fuse Panel on Left Side of Dashboard', 'Engine Compartment Fuse Box (E-Box)']],
  ['Volkswagen', 'id.4',   [2022, 2024], ['Fuse Panel on Left Side of Dashboard', 'Engine Compartment Fuse Box (E-Box)']],
  // Audi — app dataset is the B9/MLB-evo generation data; these models' ranges
  // never produced a car with that exact box (C8 E-Box 0.54, 4M E-Box 0.57,
  // A3 8V uses a different MQB population).
  ['Audi', 'a6', [2016, 2021], ['Engine Compartment Fuse Box (E-Box)', 'Dashboard Fuse Panel', 'Trunk Fuse Panel']],
  ['Audi', 's6', [2016, 2021], ['Engine Compartment Fuse Box (E-Box)', 'Dashboard Fuse Panel', 'Trunk Fuse Panel']],
  ['Audi', 'q7', [2016, 2022], ['Engine Compartment Fuse Box (E-Box)', 'Dashboard Fuse Panel', 'Trunk Fuse Panel']],
  ['Audi', 'sq7',[2016, 2022], ['Engine Compartment Fuse Box (E-Box)', 'Dashboard Fuse Panel', 'Trunk Fuse Panel']],
  ['Audi', 'a3', [2015, 2021], ['Fuse Panel on Left Side of Dashboard', 'Engine Compartment Fuse Box (E-Box)']],
];
for (const [make, model, years, panels] of gapPanels) {
  for (const yr of years) {
    const d = findFuseData(make, model, yr);
    check(d && d.panels, `gap lookup ${make} ${model} ${yr}`);
    if (!d || !d.panels) continue;
    for (const pn of panels) {
      const p = d.panels.find(p => p.name === pn);
      check(p, `gap panel ${make} ${model} ${yr} ${pn} exists`);
      check(p && !p.layout, `${make} ${model} ${yr} ${pn} has NO layout (honest gap — app dataset does not match this model's physical box)`);
    }
  }
}
// no OTHER VW/Audi panel may carry a layout (gaps must stay clean)
for (const [make, models] of Object.entries(fuseBoxData)) {
  if (make !== 'volkswagen' && make !== 'audi') continue;
  for (const [model, ranges] of Object.entries(models || {})) {
    for (const [yr, d] of Object.entries(ranges || {})) {
      const n = (d.panels || []).filter(p => p.layout).length;
      const expected = mapped.filter(([mk, m]) => mk.toLowerCase() === make && m === model).length;
      check(n === expected, `${make} ${model} ${yr}: expected ${expected} layouts, found ${n}`);
    }
  }
}

// ── 3. Prior-wave layouts must still resolve (regression) ────────────────────
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
  // Wave 10 regression: Hyundai/Kia stay layout-free
  ['Hyundai', 'elantra', 2020, 'Engine Compartment Fuse Panel'],
  ['Hyundai', 'elantra', 2020, 'Interior Fuse Panel'],
  ['Kia', 'sportage', 2020, 'Engine Compartment Fuse Panel'],
  ['Kia', 'sportage', 2020, 'Interior Fuse Panel'],
];
for (const [make, model, yr, pn] of priorLayouts) {
  const d = findFuseData(make, model, yr);
  check(d && d.panels, `prior lookup ${make} ${model} ${yr}`);
  if (!d || !d.panels) continue;
  const p = d.panels.find(p => p.name === pn);
  check(p, `prior panel ${make} ${model} ${yr} ${pn} exists`);
  if (!p) continue;
  const isPriorLayout = !['Hyundai', 'Kia'].includes(make);
  check(isPriorLayout ? !!p.layout : !p.layout, `${make} ${model} ${yr} ${pn} ${isPriorLayout ? 'still has layout' : 'has NO layout (W10 honest gap)'}`);
  if (isPriorLayout) {
    check(p.layout, `${make} ${model} ${yr} ${pn} still has layout`);
    if (p.layout) {
      check(Number(p.layout.cols) >= 1 && Number(p.layout.rows) >= 1, `${make} ${model} ${pn} grid dims`);
      const keys = Object.keys(p.layout.cells || {});
      check(keys.length >= 1, `${make} ${model} ${pn} has cells`);
      const valid = new Set([...(p.fuses || []).map(f => f.pos), ...(p.relays || []).map(r => r.pos)]);
      check(valid.size >= 1, `${make} ${model} ${pn} has fuses or relays (relays-only rule)`);
      const bad = keys.filter(k => !valid.has(k));
      check(bad.length === 0, `${make} ${model} ${pn} orphan cells: ${bad.join(',')}`);
    }
  }
}

console.log(`TOTAL: ${total}  OK: ${ok}  FAIL: ${fail}`);
console.log('MAPPED: 16 VW/Audi layouts (golf/gti x2, a4/s4/q5/sq5 x3)');
console.log('GAP PANELS: 30 (jetta/passat/tiguan/atlas/id.4 x2, a6/s6/q7/sq7 x3, a3 x2) asserted WITHOUT layout');
if (fail) process.exit(1);
console.log('PASS: Wave 11 VW+Audi — 16 layouts, honest gaps clean, prior-wave layouts still resolve');
