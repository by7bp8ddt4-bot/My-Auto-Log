import { MAINTENANCE_SCHEDULES } from '../src/data/maintenance-schedules.js';
import { referenceSpecs } from '../src/data/reference-specs.js';

const MS = MAINTENANCE_SCHEDULES;
const RS = referenceSpecs;

// Namespace map from VehicleSpecs KEY_MAP, plus local aliases for makes whose
// reference-specs data lives under human-readable keys (john-deere → 'john
// deere' wave7/14, hyster-e → 'hyster electric' wave7) — mirrors how the app
// resolves typed makes like "John Deere" / "Hyster".
const KEY_MAP = {
  'yamaha-wc': 'yamaha', 'kawasaki-wc': 'kawasaki', 'yanmar-ag': 'yanmar tractor',
  'volvo-trucks': 'volvo trucks', 'western-star': 'western star',
  'forest-river': 'forest river', 'grand-design': 'grand design',
  'john-deere': 'john deere', 'hyster-e': 'hyster electric'
};

const issues = { critical: [], high: [], medium: [], low: [] };
const clean = [];

// Check each make in maintenance schedules
for (const [msKey, msData] of Object.entries(MS)) {
  if (!msData.models || msKey === 'default') continue;
  
  const rsKey = KEY_MAP[msKey] || msKey;
  const rsModels = RS[rsKey] || {};
  const msModels = Object.keys(msData.models);
  let makeIssues = 0;
  
  // Check real models (Array entries, not aliases)
  const realModels = msModels.filter(m => Array.isArray(msData.models[m]));
  
  for (const model of realModels) {
    if (!rsModels[model]) {
      issues.critical.push(`MISSING: ${msKey} / ${model} — no reference-specs entry`);
      makeIssues++;
      continue;
    }
    
    // Check year ranges
    const yearRanges = Object.keys(rsModels[model]);
    for (const yr of yearRanges) {
      if (!/^\d{4}-\d{4}$/.test(yr)) {
        issues.high.push(`BAD YEAR FORMAT: ${msKey}/${model} — "${yr}" not XXXX-XXXX`);
      }
    }
    
    // Check critical fields exist
    const spec = Object.values(rsModels[model])[0];
    if (spec) {
      if (!spec.engine || !spec.engine.oilViscosity) {
        issues.high.push(`MISSING ENGINE SPEC: ${msKey}/${model}`);
      }
      if (!spec.transmission || !spec.transmission.fluidType) {
        issues.high.push(`MISSING TRANSMISSION SPEC: ${msKey}/${model}`);
      }
      if (!spec.brakeFluid) {
        issues.medium.push(`MISSING BRAKE FLUID: ${msKey}/${model}`);
      }
      if (!spec.tires || !spec.tires.frontPSI) {
        issues.medium.push(`MISSING TIRE SPEC: ${msKey}/${model}`);
      }
      // Check serviceUnit for hrs-appropriate types
      const hrsTypes = ['cat','cummins','hyster','hyster electric','john deere','kubota','yanmar tractor','yanmar-ag'];
      if (hrsTypes.includes(msKey) && spec.serviceUnit !== 'hrs') {
        issues.high.push(`WRONG serviceUnit: ${msKey}/${model} — should be 'hrs', got '${spec.serviceUnit}'`);
      }
    }
  }
  
  if (makeIssues === 0 && realModels.length > 0) {
    clean.push(`${msKey} (${realModels.length} models)`);
  }
}

// Summary
console.log('=== FINAL AUDIT RESULTS ===\n');
console.log(`CRITICAL (${issues.critical.length}):`);
issues.critical.forEach(i => console.log('  ' + i));
console.log(`\nHIGH (${issues.high.length}):`);
issues.high.forEach(i => console.log('  ' + i));
console.log(`\nMEDIUM (${issues.medium.length}):`);
issues.medium.forEach(i => console.log('  ' + i));
console.log(`\nCLEAN makes (${clean.length}):`);
clean.forEach(c => console.log('  ' + c));
console.log(`\n=== TOTAL: ${issues.critical.length} critical, ${issues.high.length} high, ${issues.medium.length} medium ===`);
