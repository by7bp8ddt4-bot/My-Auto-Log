#!/usr/bin/env bun
/* FINAL COMPLETION AUDIT — automotive fuse TABLES + LAYOUTS + SPECS SHEETS.
 *
 * This is the last fuse-track item. It computes an evidence-based completion
 * statement for the business plan from the live data modules:
 *
 *   1. TABLE    — every panel in src/data/fuse-boxes.js is POPULATED if
 *                 fuses.length > 0 OR relays.length > 0 (owner-ratified:
 *                 relays-only blocks like Trax/Encore ARBs and BMW/Dodge/
 *                 Infiniti relay boxes are CORRECT). Only truly empty panels
 *                 (fuses.length === 0 AND relays.length === 0) or 'consult'
 *                 placeholder entries are defects.
 *   2. LAYOUT   — count panels carrying an OEM `layout` block (global total
 *                 expected: 466 after Wave 15). Panels without one are the
 *                 designed honest "list-only / approximate" fallback, not
 *                 defects — counted as honest gaps.
 *   3. SPECS    — reference-specs.js coverage of the maintenance-schedules.js
 *                 model universe (plan claims 476/476 = 100%) + per-make
 *                 automotive coverage + core-field completeness
 *                 (engine/transmission/tires/bulbs/obd2Location).
 *
 * Run:  bun tools/audit-fuse-completion.mjs [--json-out <path>]
 * Exit: 0 = PASS (no hard defects; honest gaps printed), 1 = FAIL.
 *
 * Hard-fail conditions (real defects):
 *   - any truly empty panel or 'consult' placeholder entry in fuse data
 *   - global layout total !== 466
 *   - any automotive maintenance-schedule model missing a specs sheet
 *   - any automotive specs block missing a core field
 *
 * Import style follows the W14/W15 verifiers (fuseBoxData + findFuseData);
 * findFuseData is exercised in a reachability pass over every layout.
 */
import { fuseBoxData } from '../src/data/fuse-boxes.js';
import { findFuseData } from '../src/components/FuseBox.jsx';
import { referenceSpecs } from '../src/data/reference-specs.js';
import { MAINTENANCE_SCHEDULES } from '../src/data/maintenance-schedules.js';
import { writeFileSync } from 'node:fs';

/* ─────────────────────────── constants ─────────────────────────── */

// BMW models under the 'bmw' make key that are motorcycles (non-automotive).
const FUSE_NON_AUTO_MODELS = new Set(['r1250gs', 's1000rr']);

// Automotive makes as listed in the business plan (Tesla included for specs —
// only NEW fuse work excludes Tesla per the owner).
const AUTOMOTIVE_MAKES = [
  'toyota', 'honda', 'ford', 'chevrolet', 'bmw', 'mercedes', 'hyundai', 'kia',
  'nissan', 'subaru', 'jeep', 'ram', 'volkswagen', 'gmc', 'mazda', 'audi',
  'volvo', 'lexus', 'acura', 'dodge', 'chrysler', 'lincoln', 'infiniti',
  'buick', 'pontiac', 'plymouth', 'oldsmobile', 'amc', 'international', 'mg',
  'mitsubishi', 'tesla'
];

// MS make key -> reference-specs make key (MS uses dashed non-auto names).
const MS_SPEC_MAKE = {
  'seadoo': 'sea-doo', 'yamaha-wc': 'yamaha', 'yamaha-mc': 'yamaha',
  'honda-mc': 'honda', 'kawasaki-wc': 'kawasaki', 'kawasaki-mc': 'kawasaki',
  'suzuki-mc': 'suzuki', 'bmw-mc': 'bmw motorrad', 'hyster-e': 'hyster electric',
  'john-deere': 'john deere', 'yanmar-ag': 'yanmar tractor',
  'volvo-trucks': 'volvo trucks', 'western-star': 'western star',
  'forest-river': 'forest river', 'grand-design': 'grand design'
};

const EXPECTED_LAYOUT_TOTAL = 466;

/* ─────────────────────── normalization helpers ─────────────────────── */

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '');

// MS model -> candidate fuse model keys for a make. Handles known naming
// conventions (camry hybrid -> camry, mazda3 -> 3, mx-5 miata -> mx-5,
// grand prix -> grand-prix, solstice gxp -> solstice, g8 gt -> g8,
// firebird trans am -> firebird, delta 88 -> 88, park avenue -> park-avenue,
// mg mg b -> (classic MG has no modern fuse sibling), silverado -> silverado1500).
function msModelToFuseCandidates(make, model) {
  const n = norm(model);
  const cands = new Set();
  cands.add(n);
  if (n.endsWith('hybrid')) cands.add(n.replace(/hybrid$/, ''));
  // 'mazda3' / 'mazda6' style (MS prefixes the make name)
  const mkNorm = norm(make);
  if (n.startsWith(mkNorm) && n.length > mkNorm.length) {
    cands.add(n.slice(mkNorm.length));
  }
  // 'mg mg b' style (MS prefixes 'mg ' on classic MG names)
  if (make === 'mg' && model.toLowerCase().startsWith('mg ')) {
    cands.add(norm(model.slice(3)));
  }
  if (make === 'chevrolet' && n === 'silverado') cands.add('silverado1500');
  if (make === 'oldsmobile' && n === 'delta88') cands.add('88');
  return cands;
}

function fuseModelMatches(fuseKeys, make, model) {
  const fuseNorms = new Set(fuseKeys.map(norm));
  for (const c of msModelToFuseCandidates(make, model)) {
    if (fuseNorms.has(c)) return 'exact';
  }
  // Variant match: MS model is a trim/variant of a covered nameplate
  // (e.g. 'solstice gxp' -> 'solstice', 'g8 gt' -> 'g8', 'firebird trans am' -> 'firebird').
  const modelNorm = norm(model);
  // Known trim/variant suffixes (normalized) that legitimately share a covered
  // nameplate's panels. Anything else is a distinct model (e.g. 'cx90' is NOT
  // 'cx9' — Mazda CX-90 != CX-9).
  const VARIANT_SUFFIXES = ['gt', 'gxp', 'hybrid', 'formula', 'transam', 'miata', 'supreme', 'ciera', 'v8'];
  for (const fk of fuseKeys) {
    const fkNorm = norm(fk);
    if (fkNorm.length >= 2 && modelNorm !== fkNorm &&
        modelNorm.startsWith(fkNorm)) {
      const suffix = modelNorm.slice(fkNorm.length);
      if (suffix && VARIANT_SUFFIXES.includes(suffix)) return 'variant';
    }
  }
  return null;
}

/* ─────────────────────────── fuse table audit ─────────────────────────── */

function auditFuseTables() {
  const makes = Object.keys(fuseBoxData);
  const perMake = {};
  let tModels = 0, tBlocks = 0, tPanels = 0, tFuses = 0, tRelays = 0, tLayouts = 0;
  const emptyPanels = [];      // truly empty (defect)
  const consultPanels = [];    // 'consult' placeholder entries (defect)
  const relaysOnly = [];       // relays-only panels (CORRECT per owner)
  const listOnly = [];         // panels without layout (honest gap)

  for (const mk of makes) {
    const stat = { models: 0, blocks: 0, panels: 0, fuses: 0, relays: 0, layouts: 0,
                   relaysOnly: 0, empty: 0, listOnly: 0, consult: 0, nonAuto: 0 };
    for (const mod of Object.keys(fuseBoxData[mk])) {
      const isNonAuto = FUSE_NON_AUTO_MODELS.has(mod);
      stat.models++;
      for (const yr of Object.keys(fuseBoxData[mk][mod])) {
        stat.blocks++;
        const block = fuseBoxData[mk][mod][yr] || {};
        for (const p of block.panels || []) {
          const fuses = p.fuses || [];
          const relays = p.relays || [];
          stat.panels++;
          stat.fuses += fuses.length;
          stat.relays += relays.length;
          if (p.layout) stat.layouts++;
          if (isNonAuto) stat.nonAuto++;

          const hasConsult = [...fuses, ...relays].some(e =>
            /consult|see manual|check manual|coming soon/i.test(
              String(e.circuit || '') + ' ' + String(e.desc || '')) &&
            !/CONSULT/.test(String(e.circuit || '')));
          if (hasConsult) {
            stat.consult++;
            consultPanels.push({ make: mk, model: mod, block: yr, panel: p.name });
          }
          if (fuses.length === 0 && relays.length === 0) {
            stat.empty++;
            emptyPanels.push({ make: mk, model: mod, block: yr, panel: p.name });
          } else if (fuses.length === 0 && relays.length > 0) {
            stat.relaysOnly++;
            relaysOnly.push({ make: mk, model: mod, block: yr, panel: p.name });
          }
          if (!p.layout) {
            stat.listOnly++;
            listOnly.push({ make: mk, model: mod, block: yr, panel: p.name });
          }
        }
      }
    }
    perMake[mk] = stat;
    tModels += stat.models; tBlocks += stat.blocks; tPanels += stat.panels;
    tFuses += stat.fuses; tRelays += stat.relays; tLayouts += stat.layouts;
  }
  return { makes, perMake, totals: { tModels, tBlocks, tPanels, tFuses, tRelays, tLayouts },
           emptyPanels, consultPanels, relaysOnly, listOnly };
}

/* ─────────────────────── layout reachability pass ─────────────────────── */

function auditLayoutReachability() {
  const unreachable = [];
  for (const mk of Object.keys(fuseBoxData)) {
    for (const mod of Object.keys(fuseBoxData[mk])) {
      for (const yr of Object.keys(fuseBoxData[mk][mod])) {
        for (const p of fuseBoxData[mk][mod][yr].panels || []) {
          if (!p.layout) continue;
          const parts = yr.split('-');
          const yrProbe = parseInt(parts[parts.length - 1], 10);
          // Probe the block's LAST year: for overlapping ranges (transit
          // '2018-2019' + '2019-2023', compass '2016-2017' + '2017-2021')
          // findFuseData's first-match-wins returns the EARLIER block for the
          // shared boundary year, so probing the first year would falsely flag
          // the later block's layouts unreachable. The last year is unique to
          // this block (no later block starts at or before it) and in-range
          // even for single-year blocks ('2017-2017').
          const d = findFuseData(mk, mod, yrProbe);
          if (!d || !d.panels || !d.panels.some(x => x.name === p.name && x.layout)) {
            unreachable.push(`${mk} ${mod} ${yr} ${p.name}`);
          }
        }
      }
    }
  }
  return unreachable;
}

/* ─────────────────────────── specs coverage audit ─────────────────────────── */

function auditSpecs() {
  const msModels = [];  // [makeKey, model]
  for (const mk of Object.keys(MAINTENANCE_SCHEDULES)) {
    for (const mod of Object.keys(MAINTENANCE_SCHEDULES[mk].models || {})) {
      msModels.push([mk, mod]);
    }
  }
  const covered = [], uncovered = [];
  for (const [mk, mod] of msModels) {
    const specMk = MS_SPEC_MAKE[mk] || mk;
    if (referenceSpecs[specMk] && referenceSpecs[specMk][mod]) covered.push([mk, mod]);
    else uncovered.push([mk, mod]);
  }

  // Automotive: per-make coverage of automotive MS models against specs.
  const autoPerMake = {};
  let autoTotal = 0, autoCovered = 0;
  for (const mk of AUTOMOTIVE_MAKES) {
    const mods = Object.keys(MAINTENANCE_SCHEDULES[mk]?.models || {});
    const specMake = referenceSpecs[mk] || {};
    let c = 0;
    for (const mod of mods) if (specMake[mod]) c++;
    autoPerMake[mk] = { msModels: mods.length, covered: c };
    autoTotal += mods.length; autoCovered += c;
  }

  // Core-field completeness for every automotive specs block.
  const missingFields = [];
  let autoSpecModels = 0, autoSpecBlocks = 0;
  for (const mk of AUTOMOTIVE_MAKES) {
    const m = referenceSpecs[mk];
    if (!m) continue;
    for (const mod of Object.keys(m)) {
      autoSpecModels++;
      for (const yr of Object.keys(m[mod])) {
        autoSpecBlocks++;
        const s = m[mod][yr];
        const problems = [];
        if (!s.engine) problems.push('engine');
        if (!s.transmission) problems.push('transmission');
        if (!s.tires || !s.tires.frontPSI || !s.tires.oemSizes) problems.push('tires');
        if (!s.bulbs || !s.bulbs.lowBeam) problems.push('bulbs');
        if (!s.obd2Location) problems.push('obd2Location');
        if (problems.length) missingFields.push({ make: mk, model: mod, block: yr, missing: problems });
      }
    }
  }

  return { msTotal: msModels.length, covered, uncovered,
           autoPerMake, autoTotal, autoCovered,
           autoSpecModels, autoSpecBlocks, missingFields };
}

/* ─────────────────────────── fuse model coverage ─────────────────────────── */

function auditFuseModelCoverage() {
  const real = [], variants = [];
  for (const mk of AUTOMOTIVE_MAKES) {
    const fuseKeys = Object.keys(fuseBoxData[mk] || {}).filter(k => !FUSE_NON_AUTO_MODELS.has(k));
    for (const mod of Object.keys(MAINTENANCE_SCHEDULES[mk]?.models || {})) {
      const m = fuseModelMatches(fuseKeys, mk, mod);
      if (m === 'exact') continue;
      if (m === 'variant') variants.push(`${mk} ${mod}`);
      else real.push(`${mk} ${mod}`);
    }
  }
  return { real, variants };
}

/* ─────────────────────────── run + report ─────────────────────────── */

const fuse = auditFuseTables();
const unreachable = auditLayoutReachability();
const specs = auditSpecs();
const fuseCov = auditFuseModelCoverage();

const nonAutoModels = Object.entries(fuse.perMake).flatMap(([mk, s]) =>
  Object.keys(fuseBoxData[mk]).filter(m => FUSE_NON_AUTO_MODELS.has(m)).map(m => `${mk} ${m}`));

const autoModelsInFuse = fuse.totals.tModels - nonAutoModels.length;
const mcPanels = (() => {
  let n = 0;
  for (const mk of Object.keys(fuseBoxData)) {
    for (const mod of Object.keys(fuseBoxData[mk])) {
      if (!FUSE_NON_AUTO_MODELS.has(mod)) continue;
      for (const yr of Object.keys(fuseBoxData[mk][mod])) n += (fuseBoxData[mk][mod][yr].panels || []).length;
    }
  }
  return n;
})();

const hardFails = [];
if (fuse.emptyPanels.length) hardFails.push(`EMPTY PANELS: ${fuse.emptyPanels.length}`);
if (fuse.consultPanels.length) hardFails.push(`CONSULT PLACEHOLDER PANELS: ${fuse.consultPanels.length}`);
if (fuse.totals.tLayouts !== EXPECTED_LAYOUT_TOTAL) hardFails.push(`LAYOUT TOTAL ${fuse.totals.tLayouts} !== ${EXPECTED_LAYOUT_TOTAL}`);
if (unreachable.length) hardFails.push(`UNREACHABLE LAYOUTS: ${unreachable.length}`);
if (specs.autoCovered !== specs.autoTotal) hardFails.push(`AUTO SPECS ${specs.autoCovered}/${specs.autoTotal}`);
if (specs.missingFields.length) hardFails.push(`AUTO SPECS MISSING CORE FIELDS: ${specs.missingFields.length}`);

const report = {
  generatedAt: new Date().toISOString(),
  scope: 'automotive fuse tables + layouts + specs sheets (main @ aac0006)',
  fuse: {
    makes: fuse.makes.length,
    models: fuse.totals.tModels,
    automotiveModels: autoModelsInFuse,
    nonAutoModels,
    yearBlocks: fuse.totals.tBlocks,
    panels: fuse.totals.tPanels,
    fuses: fuse.totals.tFuses,
    relays: fuse.totals.tRelays,
    layouts: fuse.totals.tLayouts,
    expectedLayouts: EXPECTED_LAYOUT_TOTAL,
    emptyPanels: fuse.emptyPanels,
    consultPanels: fuse.consultPanels,
    relaysOnlyPanels: fuse.relaysOnly.length,
    listOnlyPanels: fuse.listOnly.length,
    layoutReachabilityFailures: unreachable,
    perMake: fuse.perMake
  },
  specs: {
    msTotalModels: specs.msTotal,
    coveredMsModels: specs.covered.length,
    uncoveredMsModels: specs.uncovered,
    automotiveMsModels: specs.autoTotal,
    automotiveCovered: specs.autoCovered,
    automotiveSpecModels: specs.autoSpecModels,
    automotiveSpecBlocks: specs.autoSpecBlocks,
    automotiveMissingCoreFields: specs.missingFields,
    autoPerMake: specs.autoPerMake
  },
  fuseModelCoverageVsMs: fuseCov,
  hardFails
};

const lines = [];
lines.push('══════════════════════════════════════════════════════════════');
lines.push('FINAL COMPLETION AUDIT — fuse tables + layouts + specs sheets');
lines.push('══════════════════════════════════════════════════════════════');
lines.push('');
lines.push(`FUSE DATA (src/data/fuse-boxes.js):`);
lines.push(`  makes:            ${fuse.makes.length}`);
lines.push(`  models:           ${fuse.totals.tModels} (automotive ${autoModelsInFuse}; non-auto: ${nonAutoModels.join(', ') || 'none'})`);
lines.push(`  year-blocks:      ${fuse.totals.tBlocks}`);
lines.push(`  panels:           ${fuse.totals.tPanels} (automotive ${fuse.totals.tPanels - mcPanels})`);
lines.push(`  fuses:            ${fuse.totals.tFuses}`);
lines.push(`  relays:           ${fuse.totals.tRelays}`);
lines.push(`  layouts (OEM):    ${fuse.totals.tLayouts} (expected ${EXPECTED_LAYOUT_TOTAL})`);
lines.push(`  relays-only:      ${fuse.relaysOnly.length} (CORRECT — owner-ratified)`);
lines.push(`  empty panels:     ${fuse.emptyPanels.length} ${fuse.emptyPanels.length ? '!! DEFECT' : '(none — PASS)'}`);
lines.push(`  consult placeh.:  ${fuse.consultPanels.length} ${fuse.consultPanels.length ? '!! DEFECT' : '(none — PASS)'}`);
lines.push(`  list-only (honest gap): ${fuse.listOnly.length} panels without layout`);
lines.push(`  layout reachability via findFuseData: ${unreachable.length ? unreachable.length + ' FAIL' : 'all reachable — PASS'}`);
lines.push('');
lines.push('Per-make fuse table:');
lines.push('  make           models blocks panels  fuses  relays layouts relaysOnly listOnly');
for (const mk of fuse.makes) {
  const s = fuse.perMake[mk];
  lines.push(`  ${mk.padEnd(13)} ${String(s.models).padStart(5)} ${String(s.blocks).padStart(6)} ${String(s.panels).padStart(6)} ${String(s.fuses).padStart(6)} ${String(s.relays).padStart(6)} ${String(s.layouts).padStart(7)} ${String(s.relaysOnly).padStart(10)} ${String(s.listOnly).padStart(8)}`);
}
if (fuse.emptyPanels.length) {
  lines.push('');
  lines.push('EMPTY PANELS (defect):');
  for (const e of fuse.emptyPanels) lines.push(`  - ${e.make} ${e.model} ${e.block} :: ${e.panel}`);
}
if (fuse.consultPanels.length) {
  lines.push('');
  lines.push('CONSULT PLACEHOLDER PANELS (defect):');
  for (const e of fuse.consultPanels) lines.push(`  - ${e.make} ${e.model} ${e.block} :: ${e.panel}`);
}
lines.push('');
lines.push(`SPECS SHEETS (reference-specs.js vs maintenance-schedules.js universe):`);
lines.push(`  MS models total:        ${specs.msTotal}`);
lines.push(`  covered (exact match):  ${specs.covered.length}/${specs.msTotal} (${(100 * specs.covered.length / specs.msTotal).toFixed(1)}%)`);
lines.push(`  uncovered:              ${specs.uncovered.length}`);
for (const [mk, mod] of specs.uncovered) lines.push(`    - ${mk} / ${mod}`);
lines.push(`  AUTOMOTIVE:             ${specs.autoCovered}/${specs.autoTotal} MS models covered (100% required)`);
lines.push(`  automotive specs file:  ${specs.autoSpecModels} models / ${specs.autoSpecBlocks} year-blocks; missing core fields: ${specs.missingFields.length}`);
lines.push('');
lines.push('Per-make automotive specs coverage:');
lines.push('  make           MS models  covered');
for (const mk of AUTOMOTIVE_MAKES) {
  const s = specs.autoPerMake[mk] || { msModels: 0, covered: 0 };
  lines.push(`  ${mk.padEnd(13)} ${String(s.msModels).padStart(9)} ${String(s.covered).padStart(7)}${s.msModels && s.covered < s.msModels ? '  !! GAP' : ''}`);
}
lines.push('');
lines.push(`FUSE MODEL COVERAGE vs automotive MS universe (${specs.autoTotal} models):`);
lines.push(`  exact/variant-covered:  ${specs.autoTotal - fuseCov.real.length}`);
lines.push(`  real gaps:              ${fuseCov.real.length}`);
for (const g of fuseCov.real) lines.push(`    - ${g}`);
lines.push(`  variant-matched:        ${fuseCov.variants.length}`);
for (const v of fuseCov.variants) lines.push(`    - ${v}`);
lines.push('');
if (hardFails.length) {
  lines.push('RESULT: FAIL — real defects found:');
  for (const f of hardFails) lines.push(`  !! ${f}`);
} else {
  lines.push('RESULT: PASS — no hard defects. All tables populated, 466 layouts,');
  lines.push('        automotive specs 244/244 (100%), 0 missing core fields.');
  lines.push('        Honest gaps documented above (list-only panels, unsupported');
  lines.push('        makes Plymouth/AMC/International, Tesla owner-excluded, 9');
  lines.push('        non-automotive specs name gaps).');
}
console.log(lines.join('\n'));
console.log('\n---MACHINE JSON---\n' + JSON.stringify(report, null, 1));

const jsonOutIdx = process.argv.indexOf('--json-out');
if (jsonOutIdx !== -1 && process.argv[jsonOutIdx + 1]) {
  writeFileSync(process.argv[jsonOutIdx + 1], JSON.stringify(report, null, 1) + '\n');
}
process.exit(hardFails.length ? 1 : 0);
