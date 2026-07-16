/**
 * Jargon Translator — maps mechanic terminology to plain English.
 * Data sourced from the Vehicle Data Specialist.
 */
import jargonData from './jargon-translator.json';

const terms = jargonData.terms;

/**
 * Look up a mechanic term and return its plain English translation.
 * Supports exact match, case-insensitive match, and substring search.
 */
export function translateJargon(term) {
  const lower = term.toLowerCase().trim();
  if (!lower) return null;

  // Try exact key match
  if (terms[term]) return terms[term];

  // Case-insensitive key lookup
  const match = Object.entries(terms).find(
    ([key]) => key.toLowerCase() === lower
  );
  if (match) return match[1];

  // Substring search in term name, standsFor, or plainEnglish
  const results = Object.values(terms).filter(
    t =>
      t.term.toLowerCase().includes(lower) ||
      (t.standsFor && t.standsFor.toLowerCase().includes(lower)) ||
      t.plainEnglish.toLowerCase().includes(lower)
  );

  return results.length > 0 ? results : null;
}

/**
 * Get a list of all jargon terms (for browsing/autocomplete).
 */
export function getAllTerms() {
  return Object.values(terms).map(t => ({
    term: t.term,
    standsFor: t.standsFor || null,
    plainEnglish: t.plainEnglish,
  }));
}

/**
 * Extract jargon terms from a text string and return translations for each found.
 */
export function extractJargon(text) {
  const lower = text.toLowerCase();
  const found = [];

  for (const [key, value] of Object.entries(terms)) {
    // Check if the term or its acronym appears in the text
    const searchKeys = [key.toLowerCase()];
    if (value.standsFor) {
      searchKeys.push(value.standsFor.toLowerCase());
      // Also add acronym itself
      const acronym = value.standsFor.split(' ').map(w => w[0]).join('').toLowerCase();
      if (acronym.length >= 2) searchKeys.push(acronym);
    }

    if (searchKeys.some(k => lower.includes(k))) {
      found.push(value);
    }
  }

  return found;
}

export { terms };
