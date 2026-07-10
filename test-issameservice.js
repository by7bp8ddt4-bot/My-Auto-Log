// Test for isSameService - extracted from useMaintenanceSchedule.js
function isSameService(scheduleName, logServiceType) {
  const a = scheduleName.toLowerCase().trim();
  const b = logServiceType.toLowerCase().trim();
  
  // Exact match
  if (a === b) return true;
  
  // One contains the other at word boundaries
  if (a.includes(b) || b.includes(a)) return true;
  
  // Simple singularization: strip trailing 's' for word normalization
  const normalize = w => w.replace(/s$/, '');
  
  // Common stop words to ignore
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', '&', '-', '/', 'of', 'for', 'in', 'on']);
  
  // Split on spaces, commas, ampersands, hyphens, parentheses, slashes
  const wordsA = a.split(/[\s,&\-()\/]+/).filter(w => w.length > 1 && !stopWords.has(w)).map(normalize);
  const wordsB = b.split(/[\s,&\-()\/]+/).filter(w => w.length > 1 && !stopWords.has(w)).map(normalize);
  
  // Use shorter as the comparison baseline
  const shorter = wordsA.length <= wordsB.length ? wordsA : wordsB;
  const longer = wordsA.length > wordsB.length ? wordsA : wordsB;
  
  if (shorter.length === 0) return false;
  
  const matchCount = shorter.filter(w => longer.includes(w)).length;
  const threshold = Math.ceil(shorter.length / 2);
  
  console.log(`  wordsA=[${wordsA.join(',')}] wordsB=[${wordsB.join(',')}] shorter=[${shorter.join(',')}] longer=[${longer.join(',')}] matchCount=${matchCount} threshold=${threshold}`);
  
  if (matchCount >= threshold) {
    // Edge case: if only 1 word matched and the shorter array has >= 2 words,
    // the single match MUST NOT be the last word (usually "fluid" or "service")
    if (matchCount === 1 && shorter.length >= 2) {
      const matchedWord = shorter.find(w => longer.includes(w));
      if (matchedWord === shorter[shorter.length - 1]) return false;
    }
    return true;
  }
  return false;
}

console.log('=== isSameService TESTS ===');
console.log('');

console.log('Test 1: Transfer Case Fluid vs Transfer Case Service');
console.log('Result:', isSameService('Transfer Case Fluid', 'Transfer Case Service'));
console.log('');

console.log('Test 2: Front Differential Fluid vs Front Differential Service');
console.log('Result:', isSameService('Front Differential Fluid', 'Front Differential Service'));
console.log('');

console.log('Test 3: Transfer Case Service vs Transfer Case Fluid (reversed)');
console.log('Result:', isSameService('Transfer Case Service', 'Transfer Case Fluid'));
console.log('');

console.log('Test 4: Rear Differential Fluid vs Rear Differential Service');
console.log('Result:', isSameService('Rear Differential Fluid', 'Rear Differential Service'));
console.log('');

console.log('Test 5: Transfer Case Fluid vs Transfer Case Fluid (exact match)');
console.log('Result:', isSameService('Transfer Case Fluid', 'Transfer Case Fluid'));
console.log('');

console.log('Test 6: Oil & Filter Change vs Oil Change');
console.log('Result:', isSameService('Oil & Filter Change', 'Oil Change'));
console.log('');

console.log('Test 7: Brake Fluid Flush vs Brake Service');
console.log('Result:', isSameService('Brake Fluid Flush', 'Brake Service'));
console.log('');

console.log('Test 8: Tire Rotation vs Tire Rotation Service');
console.log('Result:', isSameService('Tire Rotation', 'Tire Rotation Service'));