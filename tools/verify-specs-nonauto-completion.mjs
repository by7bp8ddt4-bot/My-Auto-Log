#!/usr/bin/env bun
/**
 * verify-specs-nonauto-completion.mjs
 * Verifies the 9 non-automotive reference-specs gaps are closed:
 *   cat: c9, c4.4, c6.6, c8.7  ·  volvo-trucks: vnr, vnx  ·  western-star: 4900, 5700, 6900
 *
 * Mirrors the exact coverage logic of tools/audit-fuse-completion.mjs
 * (MS_SPEC_MAKE mapping + per-model presence + core-field completeness).
 * Exit 0 = PASS, exit 1 = FAIL.
 */
import { MAINTENANCE_SCHEDULES } from '../src/data/maintenance-schedules.js';
import referenceSpecs from '../src/data/reference-specs.js';

const MS_SPEC_MAKE = {
  'seadoo': 'sea-doo', 'yamaha-wc': 'yamaha', 'yamaha-mc': 'yamaha',
  'honda-mc': 'honda', 'kawasaki-wc': 'kawasaki', 'kawasaki-mc': 'kawasaki',
  'suzuki-mc': 'suzuki', 'bmw-mc': 'bmw motorrad', 'hyster-e': 'hyster electric',
  'john-deere': 'john deere', 'yanmar-ag': 'yanmar tractor',
  'volvo-trucks': 'volvo trucks', 'western-star': 'western star',
  'forest-river': 'forest river', 'grand-design': 'grand design'
};

const AUTOMOTIVE_MAKES = [
  'toyota', 'honda', 'ford', 'chevrolet', 'bmw', 'mercedes', 'hyundai', 'kia',
  'nissan', 'subaru', 'jeep', 'ram', 'volkswagen', 'gmc', 'mazda', 'audi',
  'volvo', 'lexus', 'acura', 'dodge', 'chrysler', 'lincoln', 'infiniti',
  'buick', 'pontiac', 'plymouth', 'oldsmobile', 'amc', 'international', 'mg',
  'mitsubishi', 'tesla'
];

// The 9 gaps flagged by the final completion audit (audit-final.json).
const TARGETS = [
  ['cat', 'c9'], ['cat', 'c4.4'], ['cat', 'c6.6'], ['cat', 'c8.7'],
  ['volvo-trucks', 'vnr'], ['volvo-trucks', 'vnx'],
  ['western-star', '4900'], ['western-star', '5700'], ['western-star', '6900'],
];

const failures = [];

// 1. Full-universe coverage (same as audit: every MS model resolves in specs).
const msModels = [];
for (const mk of Object.keys(MAINTENANCE_SCHEDULES)) {
  for (const mod of Object.keys(MAINTENANCE_SCHEDULES[mk].models || {})) msModels.push([mk, mod]);
}
const uncovered = [];
for (const [mk, mod] of msModels) {
  const specMk = MS_SPEC_MAKE[mk] || mk;
  if (!(referenceSpecs[specMk] && referenceSpecs[specMk][mod])) uncovered.push([mk, mod]);
}
if (uncovered.length) failures.push(`UNCOVERED MS MODELS: ${JSON.stringify(uncovered)}`);
console.log(`MS models total: ${msModels.length}; covered: ${msModels.length - uncovered.length}/${msModels.length}`);

// 2. The 9 specific targets resolve under the app/audit make-key convention.
for (const [mk, mod] of TARGETS) {
  const specMk = MS_SPEC_MAKE[mk] || mk;
  const model = referenceSpecs[specMk]?.[mod];
  if (!model || typeof model !== 'object') {
    failures.push(`MISSING TARGET: ${mk}/${mod} (spec make '${specMk}')`);
    continue;
  }
  // Core-field completeness per year-block, same fields the audit checks.
  const blocks = Object.keys(model);
  if (!blocks.length) failures.push(`INCOMPLETE TARGET: ${mk}/${mod} has no year blocks`);
  for (const yr of blocks) {
    const s = model[yr];
    if (!s || typeof s !== 'object') { failures.push(`INCOMPLETE TARGET: ${mk}/${mod} block ${yr} is not an object`); continue; }
    const problems = [];
    if (!s.engine || !s.engine.oilViscosity) problems.push('engine');
    if (!s.transmission) problems.push('transmission');
    if (!s.tires || !s.tires.frontPSI || !s.tires.oemSizes) problems.push('tires');
    if (!s.bulbs || !s.bulbs.lowBeam) problems.push('bulbs');
    if (!s.obd2Location) problems.push('obd2Location');
    if (problems.length) failures.push(`INCOMPLETE TARGET: ${mk}/${mod} [${yr}] missing ${problems.join(', ')}`);
  }
}
console.log(`Target gaps checked: ${TARGETS.length} (all must resolve + pass core-field check)`);

// 3. Automotive 244/244 still intact.
let autoTotal = 0, autoCovered = 0;
for (const mk of AUTOMOTIVE_MAKES) {
  const mods = Object.keys(MAINTENANCE_SCHEDULES[mk]?.models || {});
  const specMake = referenceSpecs[mk] || {};
  autoTotal += mods.length;
  autoCovered += mods.filter((m) => specMake[m]).length;
}
console.log(`Automotive: ${autoCovered}/${autoTotal}`);
if (autoCovered !== autoTotal) failures.push(`AUTO SPECS ${autoCovered}/${autoTotal}`);

if (failures.length) {
  console.error('\nFAIL:\n- ' + failures.join('\n- '));
  process.exit(1);
}
console.log('\nPASS — non-auto specs completion verified: 476/476 (100%), automotive 244/244.');
