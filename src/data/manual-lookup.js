/**
 * Owner's Manual Index Lookup
 *
 * Resolves a vehicle (make, model, year) to its entry in the curated
 * manual-index.js data module. Normalization mirrors the app's existing
 * conventions (see src/components/FuseBox.jsx `matchModelKey` and
 * `findFuseData`): make names are lowercased + alias-mapped, model names are
 * matched separator-insensitively with leading-token refinement, and the
 * vehicle year is checked against the entry's year range.
 *
 * This module is intentionally dependency-free (only imports manual-index.js)
 * so the serverless proxy (api/manual-proxy.js) can use the same URL
 * allowlist logic without pulling in React/lucide.
 */

import { manualIndex } from './manual-index.js';

/**
 * Make-name aliases: map common external spellings (e.g. NHTSA VPIC returns
 * "Mercedes-Benz") to canonical manual-index.js keys. Keep in sync with the
 * alias map in src/components/FuseBox.jsx.
 */
const MAKE_ALIASES = {
  'mercedes-benz': 'mercedes',
  'sea-doo': 'seadoo',
  'sea doo': 'seadoo',
};

/**
 * Normalize a model name for comparison.
 * Returns { raw, tokens, squashed } — same shape as FuseBox.normalizeModel.
 */
function normalizeModel(model) {
  const raw = String(model || '').toLowerCase().trim();
  const withAnd = raw.replace(/&/g, ' and ');
  const tokens = withAnd.split(/[^a-z0-9]+/).filter(Boolean);
  return { raw, tokens, squashed: tokens.join('') };
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Find the best matching model key within a make's manual-index entries.
 * Same priority as FuseBox.matchModelKey:
 *   1. Exact whole-model match (separator-insensitive) — "CR-V" matches 'cr-v'.
 *   2. Leading-token refinement — "Santa Fe Hybrid" refines to 'santa fe'.
 * Deliberately NOT matched: a query that is a shorter prefix of a longer key
 * ("Civic" must NOT match 'civic si').
 */
export function matchManualModelKey(makeData, model) {
  const q = normalizeModel(model);
  if (!q.tokens.length) return null;

  const keys = Object.keys(makeData);
  const keyNorm = {};
  for (const key of keys) keyNorm[key] = normalizeModel(key);

  // 1. Exact whole-model match (separator-insensitive)
  for (const key of keys) {
    if (keyNorm[key].squashed === q.squashed) return key;
  }

  // 2. Leading-token refinement (query is a more specific variant of a shorter key)
  let bestKey = null;
  let bestTokens = -1;
  for (const key of keys) {
    const n = keyNorm[key];
    if (n.tokens.length >= q.tokens.length) continue; // key must be strictly shorter
    const isLeading = n.tokens.every((t, i) => t === q.tokens[i]);
    if (isLeading && n.tokens.length > bestTokens) {
      bestKey = key;
      bestTokens = n.tokens.length;
    }
  }
  return bestKey;
}

/**
 * Resolve a vehicle to its manual-index entry.
 *
 * @param {string} make  e.g. "Toyota", "Mercedes-Benz"
 * @param {string} model e.g. "Camry", "CR-V", "Santa Fe"
 * @param {number|string} year
 * @returns {{ entry: object|null, make: string, modelKey: string|null, reason: string }}
 *   reason: 'matched' | 'make_not_in_index' | 'model_not_in_index' | 'year_out_of_range'
 */
export function findManualEntry(make, model, year) {
  const makeLower = String(make || '').toLowerCase().trim();
  const canonicalMake = MAKE_ALIASES[makeLower] || makeLower;

  const makeData = manualIndex[canonicalMake];
  if (!makeData) {
    return { entry: null, make: canonicalMake, modelKey: null, reason: 'make_not_in_index' };
  }

  // Match the model directly, then with the make name stripped from the front
  // (e.g. "Toyota Camry" → "camry").
  let matchedKey = matchManualModelKey(makeData, model);
  if (!matchedKey) {
    const modelLower = String(model || '').toLowerCase();
    const strippedModel = modelLower
      .replace(new RegExp('^' + escapeRegExp(canonicalMake) + '\\s*'), '')
      .trim();
    if (strippedModel && strippedModel !== modelLower) {
      matchedKey = matchManualModelKey(makeData, strippedModel);
    }
  }
  if (!matchedKey) {
    return { entry: null, make: canonicalMake, modelKey: null, reason: 'model_not_in_index' };
  }

  const modelData = makeData[matchedKey];

  // Find matching year range
  const numYear = parseInt(year);
  if (!Number.isFinite(numYear)) {
    return { entry: null, make: canonicalMake, modelKey: matchedKey, reason: 'year_out_of_range' };
  }
  for (const [range, entry] of Object.entries(modelData)) {
    const [start, end] = range.split('-').map(Number);
    if (numYear >= start && numYear <= end) {
      return { entry, make: canonicalMake, modelKey: matchedKey, reason: 'matched' };
    }
  }

  return { entry: null, make: canonicalMake, modelKey: matchedKey, reason: 'year_out_of_range' };
}

/**
 * Resolve an index entry's URL to the concrete URL for a specific vehicle year.
 *
 * Some index URLs are per-year patterns (e.g. Toyota's
 * .../digital/camry/2024/ — validated for 2020 and 2024). When the URL ends
 * in a 4-digit year segment, that segment is substituted with the vehicle's
 * year. Hub URLs (Honda/Kia/Subaru/Hyundai) carry no year and are returned
 * unchanged.
 *
 * @returns {string|null} null when the entry has no URL (fetchable: false)
 */
export function resolveManualUrl(entry, year) {
  if (!entry || !entry.url) return null;
  const m = entry.url.match(/^(.*)\/(\d{4})(\/?)$/);
  if (m) {
    const numYear = parseInt(year);
    const replacement = Number.isFinite(numYear) ? String(numYear) : m[2];
    // Preserve the original trailing-slash shape (m[3] is '' or '/').
    return `${m[1]}/${replacement}${m[3]}`;
  }
  return entry.url;
}

/**
 * Allowlist check for the manual proxy (api/manual-proxy.js).
 *
 * A URL is allowed only when it is (or is a year-substituted variant of) one
 * of the URLs listed in manual-index.js. Any 4-digit year run in an indexed
 * URL is treated as a wildcard (per-year patterns), so a 2020 Camry's
 * .../camry/2020/ URL is accepted against the indexed .../camry/2024/ entry.
 * Arbitrary user-supplied URLs are never allowed through the proxy — user
 * uploads go through the upload path instead.
 *
 * @param {string} url
 * @returns {boolean}
 */
export function isAllowedManualUrl(url) {
  if (!url || typeof url !== 'string') return false;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;

  // Collect every non-null URL in the index into anchored regexes.
  const patterns = [];
  const collect = (node) => {
    if (!node || typeof node !== 'object') return;
    if (typeof node.url === 'string' && node.url) {
      // Escape regex specials, then treat any 4-digit run (year) as a wildcard.
      const escaped = node.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const withYearWildcard = escaped.replace(/\d{4}/g, '\\d{4}');
      patterns.push(new RegExp(`^${withYearWildcard}$`));
      return;
    }
    for (const value of Object.values(node)) collect(value);
  };
  collect(manualIndex);

  return patterns.some((re) => re.test(url));
}
