/**
 * Owner's Manual Highlights Reel Sorter
 *
 * Pure, dependency-free, rule-based scanner that turns extracted manual text
 * (an array of { page, text } entries from pdfjs-dist) into a curated,
 * swipe-able "highlights reel": plain-English cards grouped by category.
 *
 * Categories (order matters — it is the display order):
 *   fluids, tires, bulbs, fuses, obd, maintenance, warnings
 *
 * Rules are pragmatic keyword/heading matches with plain-English card titles.
 * No AI, no network, no services — just local text scanning.
 *
 * Card shape: { id, category, title, page, snippet }
 *   - id:       stable key (`${category}-${ruleIndex}-${page}`)
 *   - snippet:  a cleaned excerpt of the manual text around the first match
 */

export const MANUAL_CATEGORIES = [
  { id: 'fluids', label: 'Fluids & Capacities' },
  { id: 'tires', label: 'Tires' },
  { id: 'bulbs', label: 'Bulbs' },
  { id: 'fuses', label: 'Fuse Box' },
  { id: 'obd', label: 'OBD-II' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'warnings', label: 'Warning Lights' },
];

/**
 * Rule table: each rule scans pages in order and produces at most one card
 * from the first page whose text matches any of its patterns. Pattern lists
 * are ordered so the strongest signal wins for snippet selection.
 */
const RULES = [
  // ── Fluids & Capacities ─────────────────────────────────────────────
  {
    category: 'fluids',
    title: 'Engine Oil & Viscosity',
    patterns: [
      /\bengine oil\b/i,
      /\boil viscosity\b/i,
      /\brecommended oil\b/i,
      /\b(0w-20|0w-30|0w-40|5w-20|5w-30|5w-40|10w-30|10w-40)\b/i,
    ],
  },
  {
    category: 'fluids',
    title: 'Coolant / Antifreeze',
    patterns: [/\bcoolant\b/i, /\bantifreeze\b/i],
  },
  {
    category: 'fluids',
    title: 'Transmission Fluid',
    patterns: [/\btransmission fluid\b/i, /\batf\b/i, /\bgear oil\b/i, /\bdifferential fluid\b/i],
  },
  {
    category: 'fluids',
    title: 'Brake Fluid',
    patterns: [/\bbrake fluid\b/i],
  },
  {
    category: 'fluids',
    title: 'A/C Refrigerant',
    patterns: [/\brefrigerant\b/i, /\b(r-1234yf|r-134a|r134a)\b/i],
  },
  {
    category: 'fluids',
    title: 'Windshield Washer Fluid',
    patterns: [/\bwasher fluid\b/i, /\bwindshield fluid\b/i],
  },
  // ── Tires ────────────────────────────────────────────────────────────
  {
    category: 'tires',
    title: 'Tire Pressure & Sizes',
    patterns: [/\btire pressure\b/i, /\btire sizes?\b/i, /\binflation pressure\b/i, /\bpsi\b/i],
  },
  {
    category: 'tires',
    title: 'Wheel & Tire Specs',
    patterns: [/\bwheel size\b/i, /\btorque\b.*\b(ft-lb|ft\.-lb|nm)\b/i, /\blug nut\b/i],
  },
  // ── Bulbs ────────────────────────────────────────────────────────────
  {
    category: 'bulbs',
    title: 'Light Bulb Types',
    patterns: [
      /\bbulb\b/i,
      /\bheadlight\b/i,
      /\bhead lamp\b/i,
      /\b(high beam|low beam)\b/i,
      /\bturn signal\b/i,
    ],
  },
  // ── Fuse Box ─────────────────────────────────────────────────────────
  {
    category: 'fuses',
    title: 'Fuse Box Locations & Circuits',
    patterns: [/\bfuse box\b/i, /\bfuse panel\b/i, /\bfuse\b/i, /\brelay\b/i],
  },
  // ── OBD-II ───────────────────────────────────────────────────────────
  {
    category: 'obd',
    title: 'Diagnostic Port (OBD-II) Location',
    patterns: [
      /\bobd-?ii\b/i,
      /\bon-board diagnostics\b/i,
      /\bonboard diagnostics\b/i,
      /\bdiagnostic connector\b/i,
      /\bdata link connector\b/i,
      /\bdlc\b/i,
    ],
  },
  // ── Maintenance ──────────────────────────────────────────────────────
  {
    category: 'maintenance',
    title: 'Maintenance Schedule & Intervals',
    patterns: [
      /\bmaintenance schedule\b/i,
      /\bmaintenance intervals?\b/i,
      /\brecommended maintenance\b/i,
      /\bscheduled maintenance\b/i,
      /\bservice intervals?\b/i,
    ],
  },
  // ── Warning Lights ───────────────────────────────────────────────────
  {
    category: 'warnings',
    title: 'Warning & Indicator Lights',
    patterns: [
      /\bwarning light\b/i,
      /\bindicator light\b/i,
      /\bcheck engine\b/i,
      /\bmalfunction indicator\b/i,
      /\bdashboard warning\b/i,
    ],
  },
];

/** Build a cleaned excerpt around the first keyword hit in a page's text. */
function buildSnippet(text, matchIndex, radius = 120) {
  const start = Math.max(0, matchIndex - radius);
  const end = Math.min(text.length, matchIndex + radius);
  const snippet = text.slice(start, end).replace(/\s+/g, ' ').trim();
  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';
  return `${prefix}${snippet}${suffix}`;
}

/** Find the earliest match position of any pattern in a page's text. */
function findFirstMatch(text, patterns) {
  let best = null;
  for (const re of patterns) {
    const m = re.exec(text);
    if (m && (best === null || m.index < best.index)) {
      best = m;
    }
  }
  return best;
}

/**
 * Scan extracted manual pages and produce the highlights reel.
 *
 * @param {Array<{page:number, text:string}>} pages
 * @param {Object} [options]
 * @param {number} [options.maxCardsPerRule=1]   cards per rule (first page wins)
 * @param {number} [options.maxCards=14]         total card cap
 * @returns {{ categories: Array<{id:string,label:string,cards:Array}> , total: number, scannedPages: number }}
 */
export function sortManualHighlights(pages, options = {}) {
  const maxCardsPerRule = options.maxCardsPerRule ?? 1;
  const maxCards = options.maxCards ?? 14;

  const pageList = Array.isArray(pages) ? pages : [];
  const scannedPages = pageList.length;

  const cards = [];
  const seenRules = new Set();

  for (const rule of RULES) {
    if (cards.length >= maxCards) break;
    let hits = 0;
    for (const entry of pageList) {
      if (hits >= maxCardsPerRule) break;
      if (!entry || typeof entry.text !== 'string' || !entry.text.trim()) continue;
      const match = findFirstMatch(entry.text, rule.patterns);
      if (!match) continue;
      const key = `${rule.category}:${rule.title}`;
      if (seenRules.has(key)) continue;
      seenRules.add(key);
      cards.push({
        id: `${rule.category}-${rule.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-p${entry.page}`,
        category: rule.category,
        title: rule.title,
        page: entry.page,
        snippet: buildSnippet(entry.text, match.index),
      });
      hits += 1;
    }
  }

  // Group by category in display order; only categories with cards appear.
  const categories = MANUAL_CATEGORIES
    .map((cat) => ({
      id: cat.id,
      label: cat.label,
      cards: cards.filter((c) => c.category === cat.id),
    }))
    .filter((cat) => cat.cards.length > 0);

  return { categories, total: cards.length, scannedPages };
}

/**
 * Filter a reel by a free-text search query (used by the search box).
 * Matches card title + snippet, case-insensitive.
 */
export function filterManualHighlights(reel, query) {
  if (!query || !query.trim()) return reel;
  const q = query.trim().toLowerCase();
  const categories = (reel?.categories || [])
    .map((cat) => ({
      ...cat,
      cards: cat.cards.filter(
        (c) => c.title.toLowerCase().includes(q) || c.snippet.toLowerCase().includes(q)
      ),
    }))
    .filter((cat) => cat.cards.length > 0);
  return { ...reel, categories, total: categories.reduce((n, c) => n + c.cards.length, 0) };
}
