/**
 * Service matching utilities extracted from useMaintenanceSchedule.js.
 * These are pure utility functions with NO dependency on maintenance-schedules.js,
 * so importing them does NOT pull the 192KB data file into the bundle.
 *
 * Extracted as part of code-splitting: feat/code-split-data-files
 */

/**
 * Check if two service names refer to the same service.
 * Uses word-level matching to handle "Oil Change" vs "Oil & Filter Change".
 */
export function isSameService(scheduleName, logServiceType) {
  const a = scheduleName.toLowerCase().trim();
  const b = logServiceType.toLowerCase().trim();
  
  // Exact match
  if (a === b) return true;
  
  // One contains the other at word boundaries
  if (a.includes(b) || b.includes(a)) return true;
  
  // Simple singularization: strip trailing 's' for word normalization
  // e.g. "plugs" → "plug", "tires" → "tire"
  const normalize = w => w.replace(/s$/, '');
  
  // Word overlap: check if significant words from one appear in the other
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', '&', '-', '/', 'of', 'for', 'in', 'on']);
  const wordsA = a.split(/[\s,&\-()\/]+/).filter(w => w.length > 1 && !stopWords.has(w)).map(normalize);
  const wordsB = b.split(/[\s,&\-()\/]+/).filter(w => w.length > 1 && !stopWords.has(w)).map(normalize);
  
  // Check word overlap between the two lists
  const shorter = wordsA.length <= wordsB.length ? wordsA : wordsB;
  const longer = wordsA.length > wordsB.length ? wordsA : wordsB;
  
  if (shorter.length === 0) return false;
  const matchCount = shorter.filter(w => longer.includes(w)).length;
  const threshold = Math.ceil(shorter.length / 2);
  
  if (matchCount >= threshold) {
    // If only 1 word matched in a multi-word shorter list,
    // reject if it's just the last/generic word (e.g., "flush", "service")
    // This prevents "Brake Fluid Flush" vs "Coolant Flush" matching on "flush" alone
    if (matchCount === 1 && shorter.length >= 2) {
      const matchedWord = shorter.find(w => longer.includes(w));
      if (matchedWord === shorter[shorter.length - 1]) return false;
    }
    return true;
  }
  return false;
}

/**
 * Get all service types from a log entry.
 * Handles both old single-type (serviceType string) and new multi-type (serviceTypes array).
 */
export function getLogServiceTypes(log) {
  if (Array.isArray(log.serviceTypes) && log.serviceTypes.length > 0) return log.serviceTypes;
  if (log.serviceType) return [log.serviceType];
  return ['Other'];
}
