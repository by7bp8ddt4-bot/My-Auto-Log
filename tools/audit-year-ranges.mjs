/**
 * audit-year-ranges.mjs
 * 
 * Audits all year ranges in reference-specs.js to find models whose
 * earliest covered year is >= 2015 (meaning they need backfill to 2010).
 * 
 * Run: node --experimental-vm-modules tools/audit-year-ranges.mjs
 * Output: /home/team/shared/qa/15-year-backfill-scope.json
 */

import { referenceSpecs } from '../src/data/reference-specs.js';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Vehicle type classification by make ──────────────────────────────────
const MAKE_TYPE_MAP = {
  // Automotive
  toyota: 'auto', honda: 'auto', ford: 'auto', chevrolet: 'auto',
  bmw: 'auto', mercedes: 'auto', hyundai: 'auto', kia: 'auto',
  nissan: 'auto', subaru: 'auto', jeep: 'auto', ram: 'auto',
  tesla: 'auto', volkswagen: 'auto', gmc: 'auto', mazda: 'auto',
  audi: 'auto', volvo: 'auto', lexus: 'auto', acura: 'auto',
  dodge: 'auto', chrysler: 'auto', lincoln: 'auto', infiniti: 'auto',
  buick: 'auto', pontiac: 'auto', plymouth: 'auto', oldsmobile: 'auto',
  amc: 'auto', mitsubishi: 'auto', mg: 'auto', indian: 'auto',

  // Powersports / PWC
  'sea-doo': 'pwc', kawasaki: 'pwc', polaris: 'powersports',

  // Marine — outboards
  mercury: 'marine-outboard',

  // Marine — diesel
  cummins: 'marine-diesel',

  // Agriculture
  kubota: 'ag', 'yanmar tractor': 'ag', 'john deere': 'ag',

  // Forklift
  hyster: 'forklift', 'hyster electric': 'forklift',

  // Semi-trucks
  international: 'semi', 'volvo trucks': 'semi', 'western star': 'semi',

  // RVs
  winnebago: 'rv', thor: 'rv', airstream: 'rv',

  // Yamaha is dual-use — PWC models and outboard models; classify by model prefix
  yamaha: 'dual',
};

// Yamaha models that are outboards (not PWC)
const YAMAHA_OUTBOARD_MODELS = new Set([
  'f25', 'f70', 'f115', 'f150', 'f200', 'f250', 'f300',
]);

// Yamaha models that are motorcycles (not PWC)
const YAMAHA_MOTORCYCLE_MODELS = new Set([
  'mt-07', 'mt-09', 'fz-07', 'fz-09', 'yzf-r6', 'yzf-r1',
]);

/**
 * Parse a yearRange string like "2018-2024" or "1960-1999" and return the
 * earliest (start) year as a number.
 * Returns null for unparseable ranges.
 */
function parseEarliestYear(yearRange) {
  const match = String(yearRange).match(/^(\d{4})/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Classify a (make, model) pair into a vehicle type.
 */
function classifyType(make, model) {
  const mapped = MAKE_TYPE_MAP[make];
  if (mapped && mapped !== 'dual') return mapped;
  
  // Handle dual-use makes
  if (make === 'yamaha') {
    if (YAMAHA_OUTBOARD_MODELS.has(model)) return 'marine-outboard';
    if (YAMAHA_MOTORCYCLE_MODELS.has(model)) return 'auto'; // motorcycles grouped as auto for backfill purposes
    return 'pwc';
  }
  
  return 'unknown';
}

// ── Main audit ───────────────────────────────────────────────────────────
const results = {
  totalModels: 0,
  modelsNeedingBackfill: 0,
  byType: {},
  worstOffenders: [],
};

for (const [make, models] of Object.entries(referenceSpecs)) {
  for (const [model, yearRanges] of Object.entries(models)) {
    if (typeof yearRanges !== 'object' || yearRanges === null) continue;
    
    let earliestYear = Infinity;
    const yearRangeKeys = Object.keys(yearRanges).filter(k => /^\d{4}/.test(k));
    
    for (const yrKey of yearRangeKeys) {
      const startYear = parseEarliestYear(yrKey);
      if (startYear !== null && startYear < earliestYear) {
        earliestYear = startYear;
      }
    }
    
    if (earliestYear === Infinity) continue; // no parseable year ranges
    
    const type = classifyType(make, model);
    const label = `${make} ${model}`;
    
    results.totalModels++;
    
    // Initialize type bucket
    if (!results.byType[type]) {
      results.byType[type] = { total: 0, needsBackfill: 0, examples: [] };
    }
    results.byType[type].total++;
    
    // Backfill threshold: earliest year >= 2015 means gap to 2010
    if (earliestYear >= 2015) {
      results.modelsNeedingBackfill++;
      results.byType[type].needsBackfill++;
      
      const example = `${model} (${earliestYear})`;
      if (results.byType[type].examples.length < 10) {
        results.byType[type].examples.push(example);
      }
      
      results.worstOffenders.push({
        make,
        model,
        earliestYear,
      });
    }
  }
}

// Sort worst offenders by earliest year (newest first = worst first)
results.worstOffenders.sort((a, b) => b.earliestYear - a.earliestYear);
results.worstOffenders = results.worstOffenders.slice(0, 50);

// Clean up type buckets — keep only max 10 examples
for (const type of Object.keys(results.byType)) {
  results.byType[type].examples = results.byType[type].examples.slice(0, 10);
}

// ── Output ───────────────────────────────────────────────────────────────
const outputPath = '/home/team/shared/qa/15-year-backfill-scope.json';
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(results, null, 2));

console.log(`✅ Audit complete.`);
console.log(`   Total models: ${results.totalModels}`);
console.log(`   Models needing backfill (earliest >= 2015): ${results.modelsNeedingBackfill}`);
console.log(`   Output: ${outputPath}`);

// Print per-type summary
console.log('\n── By Type ──');
for (const [type, data] of Object.entries(results.byType).sort()) {
  console.log(`   ${type}: ${data.needsBackfill}/${data.total} need backfill`);
}
