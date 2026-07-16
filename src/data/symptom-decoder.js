/**
 * Symptom Decoder — maps driver-described symptoms to likely causes.
 * Data sourced from the Vehicle Data Specialist.
 */
import symptomData from './symptom-decoder.json';

const symptoms = symptomData.symptoms;

/**
 * Search symptoms by keyword. Returns matching symptoms with their causes.
 */
export function searchSymptoms(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return symptoms
    .filter(s =>
      s.symptom.toLowerCase().includes(q) ||
      s.plainEnglish.toLowerCase().includes(q) ||
      s.likelyCauses.some(c =>
        c.cause.toLowerCase().includes(q) ||
        c.severity.toLowerCase().includes(q)
      )
    )
    .map(s => ({
      ...s,
      matchedCauses: s.likelyCauses.filter(c =>
        c.cause.toLowerCase().includes(q) ||
        c.severity.toLowerCase().includes(q)
      ),
    }));
}

/**
 * Get all symptom names (for suggestions/autocomplete).
 */
export function getAllSymptoms() {
  return symptoms.map(s => ({
    symptom: s.symptom,
    plainEnglish: s.plainEnglish,
  }));
}

/**
 * Look up a symptom by exact name match.
 */
export function getSymptom(name) {
  const lower = name.toLowerCase().trim();
  return symptoms.find(
    s => s.symptom.toLowerCase() === lower
  ) || null;
}

/**
 * Find the best symptom match for a free-text input.
 * Returns { symptom, causes } or null.
 */
export function findBestSymptomMatch(input) {
  const lower = input.toLowerCase().trim();
  if (!lower) return null;

  // Try exact match first
  for (const s of symptoms) {
    if (lower.includes(s.symptom.toLowerCase())) {
      return {
        symptom: s.symptom,
        plainEnglish: s.plainEnglish,
        causes: s.likelyCauses,
        matchType: 'exact',
      };
    }
  }

  // Try keyword overlap scoring
  const words = lower.split(/\s+/);
  let bestScore = 0;
  let bestMatch = null;

  for (const s of symptoms) {
    const target = s.symptom.toLowerCase() + ' ' + s.plainEnglish.toLowerCase();
    const score = words.filter(w => w.length > 2 && target.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = {
        symptom: s.symptom,
        plainEnglish: s.plainEnglish,
        causes: s.likelyCauses,
        matchType: 'fuzzy',
        score,
      };
    }
  }

  return bestMatch;
}

export { symptoms };
