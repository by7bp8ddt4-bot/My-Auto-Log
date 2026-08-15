import { useState, useMemo } from 'react';
import {
  Search, Zap, AlertTriangle, Info, MapPin, LayoutGrid, List, X,
} from 'lucide-react';
import { fuseBoxData } from '../data/fuse-boxes.js';

/**
 * Make-name aliases: map common external spellings (e.g. NHTSA VPIC returns
 * "Mercedes-Benz", while the data uses "mercedes") to canonical fuse-boxes.js keys.
 */
const MAKE_ALIASES = {
  'mercedes-benz': 'mercedes',
};

/**
 * Model-name aliases: map a normalized (squashed) user/VPIC model string that is
 * ambiguous or wouldn't otherwise resolve to its canonical fuse-boxes.js key.
 * "Squashed" = lowercased with all non-alphanumeric characters removed.
 */
const MODEL_ALIASES = {
  boltev: 'bolt', // Chevrolet "Bolt EV" (NHTSA model name) → 'bolt' key; "Bolt EUV" has its own key
  silverado: 'silverado1500', // bare "Silverado" (older VPIC records / manual entry) → light-duty data
  delta88: '88',     // Oldsmobile "Delta 88" (marketing name for the 88, 1965-1985) → '88' key
  eightyeight: '88', // Oldsmobile "Eighty Eight" (word-spelled model name) → '88' key
};

/**
 * Normalize a model name for comparison.
 * Returns { raw, tokens, squashed }:
 *   - raw:      lowercased original
 *   - tokens:   split on any non-alphanumeric separator (space, hyphen, period, …)
 *   - squashed: tokens joined without separators
 *               e.g. "Silverado 1500" → { tokens: ['silverado','1500'], squashed: 'silverado1500' }
 *                    "Yukon XL"       → { tokens: ['yukon','xl'],     squashed: 'yukonxl' }
 *                    "F-150"          → { tokens: ['f','150'],        squashed: 'f150' }
 *                    "ID.4"           → { tokens: ['id','4'],         squashed: 'id4' }
 */
function normalizeModel(model) {
  const raw = String(model || '').toLowerCase().trim();
  const withAnd = raw.replace(/&/g, ' and ');
  const tokens = withAnd.split(/[^a-z0-9]+/).filter(Boolean);
  return { raw, tokens, squashed: tokens.join('') };
}

/**
 * Find the best matching model key within a make's data.
 *
 * Priority (most → least specific):
 *   1. Exact whole-model match (separator-insensitive) — "Silverado 1500" matches the
 *      'silverado1500' key; "Yukon XL" matches 'yukon-xl'; "C 300" and "C300" both match 'c 300'.
 *   2. Explicit alias map (MODEL_ALIASES).
 *   3. Leading-token refinement: the query is a *more specific* variant of an existing key
 *      (the key's tokens are a complete leading subsequence of the query's tokens and the key
 *      is strictly shorter). E.g. "Sierra 1500" → 'sierra', "Bolt EV" → 'bolt',
 *      "Civic Si" → 'civic'. Among candidates the longest (most specific) key wins.
 *
 * Deliberately NOT matched:
 *   - A query that is merely a partial-string prefix of a key ("CX-50" must NOT match 'cx-5').
 *   - A query that is a shorter prefix of a longer key ("Civic" must NOT match 'civic si',
 *     "GLE" must NOT match 'gle 350', "Bronco" must NOT match 'bronco sport').
 */
export function matchModelKey(makeData, model) {
  const q = normalizeModel(model);
  if (!q.tokens.length) return null;

  const keys = Object.keys(makeData);
  const keyNorm = {};
  for (const key of keys) keyNorm[key] = normalizeModel(key);

  // 1. Exact whole-model match (separator-insensitive)
  for (const key of keys) {
    if (keyNorm[key].squashed === q.squashed) return key;
  }

  // 2. Explicit alias
  const aliasKey = MODEL_ALIASES[q.squashed];
  if (aliasKey && makeData[aliasKey]) return aliasKey;

  // 3. Leading-token refinement (query is a more specific variant of a shorter key)
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

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
/**
 * Matches a vehicle (make, model, year) to the appropriate fuse box data.
 * Traverses make → model → yearRange, checking if the vehicle year falls within the range.
 */
export function findFuseData(make, model, year) {
  if (!make || !model || !year) return null;

  const makeLower = String(make).toLowerCase().trim();
  const canonicalMake = MAKE_ALIASES[makeLower] || makeLower;

  const makeData = fuseBoxData[canonicalMake];
  if (!makeData) return null;

  // Match the model directly, then with the make name stripped from the front
  // (e.g. "mazda3" → "3", "toyota camry" → "camry").
  let matchedKey = matchModelKey(makeData, model);
  if (!matchedKey) {
    const modelLower = model.toLowerCase();
    const strippedModel = modelLower
      .replace(new RegExp('^' + escapeRegExp(canonicalMake) + '\\s*'), '')
      .trim();
    if (strippedModel && strippedModel !== modelLower) {
      matchedKey = matchModelKey(makeData, strippedModel);
    }
  }
  if (!matchedKey) return null;

  const modelData = makeData[matchedKey];

  // Find matching year range
  const numYear = parseInt(year);
  for (const [range, data] of Object.entries(modelData)) {
    const [start, end] = range.split('-').map(Number);
    if (numYear >= start && numYear <= end) {
      return data;
    }
  }

  return null;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Fuse box DIAGRAM layout helpers
 * ─────────────────────────────────────────────────────────────────────────────
 * Panels may carry an optional `layout` object:
 *   { cols, rows, cells: { '<pos>': { col, row, w, h } }, notes: [...] }
 * Cells are keyed by the exact `pos` string (1-based col/row, w/h >= 1).
 * Positions absent from `cells` are empty slots; items whose pos is absent from
 * `cells` fall back to auto-placement into the first free slots in reading order.
 * Panels without a `layout` use a reading-order grid for everything — the caller
 * shows the amber "Approximate layout" banner whenever `matched === false`.
 * Every function below is crash-proof: any pos/amps format renders as an opaque
 * label and never throws.
 */

const DEFAULT_GRID_COLS = 12;
const NUM_RE = /(\d+(?:\.\d+)?)/g;

/**
 * Extract the largest numeric value from an amps value.
 * Handles numbers, '7.5/30' (dual rating → 30, the main fuse), '—', '', null.
 * Returns a number or null when nothing numeric is present.
 */
export function parseAmps(amps) {
  if (typeof amps === 'number') return Number.isFinite(amps) ? amps : null;
  if (typeof amps !== 'string') return null;
  const matches = amps.match(NUM_RE);
  if (!matches) return null;
  return Math.max(...matches.map(Number));
}

/**
 * Color tier for a fuse, mirroring the List view's conventions:
 *   >= 30A → 'high' (orange)   >= 20A → 'medium' (amber)
 *   <  20A → 'low'  (emerald)  unknown/non-numeric → 'unknown' (slate)
 */
export function ampTier(amps) {
  const v = parseAmps(amps);
  if (v === null) return 'unknown';
  if (v >= 30) return 'high';
  if (v >= 20) return 'medium';
  return 'low';
}

/** Case-insensitive match against circuit / desc / pos (single source of truth
 *  for both the List search and the Diagram highlight/dim). */
export function itemMatches(item, term) {
  if (!item) return false;
  if (!term) return true;
  const t = String(term).toLowerCase();
  return (
    (item.circuit != null && String(item.circuit).toLowerCase().includes(t)) ||
    (item.desc != null && String(item.desc).toLowerCase().includes(t)) ||
    (item.pos != null && String(item.pos).toLowerCase().includes(t))
  );
}

/** Find the first free cell (w×h, 1-based) in reading order, or null if none. */
function findFreeCell(cols, rows, occupied, w, h) {
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      let free = true;
      for (let rr = r; rr < r + h && free; rr++) {
        for (let cc = c; cc < c + w; cc++) {
          if (rr > rows || cc > cols || occupied.has(`${cc},${rr}`)) {
            free = false;
            break;
          }
        }
      }
      if (free) return { col: c, row: r };
    }
  }
  return null;
}

/**
 * Resolve a panel into a drawable grid.
 * Returns { matched, cols, rows, cells, notes } where:
 *   - matched: true when panel.layout exists (cells came from layout data)
 *   - cells:   [{ key, item (nullable), col, row, w, h, placed: 'layout'|'auto' }]
 *              item is null for keys present in layout.cells with no matching fuse/relay.
 *              All placements are clamped to grid bounds (span overflow is clipped).
 * Never throws, regardless of pos/amps/layout content.
 */
export function computePanelLayout(panel) {
  const layout = (panel && panel.layout) || null;
  const fuses = (panel && panel.fuses) || [];
  const relays = (panel && panel.relays) || [];
  const all = [
    ...fuses.map(f => ({ ...f, kind: 'fuse' })),
    ...relays.map(r => ({ ...r, kind: 'relay' })),
  ];
  const notes = layout && Array.isArray(layout.notes) ? layout.notes : [];

  const hasLayout =
    layout &&
    Number.isFinite(Number(layout.cols)) &&
    Number.isFinite(Number(layout.rows)) &&
    layout.cells && typeof layout.cells === 'object';

  // No layout at all → reading-order grid for ALL items (Approximate).
  if (!hasLayout) {
    const cols = layout && Number(layout.cols) > 0 ? Math.floor(Number(layout.cols)) : DEFAULT_GRID_COLS;
    const rows = Math.max(1, Math.ceil(all.length / cols));
    const cells = all.map((item, i) => ({
      key: String(item.pos),
      item,
      col: (i % cols) + 1,
      row: Math.floor(i / cols) + 1,
      w: 1,
      h: 1,
      placed: 'auto',
    }));
    return { matched: false, cols, rows, cells, notes };
  }

  const cols = Math.max(1, Math.floor(Number(layout.cols)));
  const rows = Math.max(1, Math.floor(Number(layout.rows)));
  const occupied = new Set();
  const byKey = new Map();
  for (const item of all) {
    const key = String(item.pos);
    if (!byKey.has(key)) byKey.set(key, item); // first wins on duplicate pos keys
  }
  const cells = [];
  const cellsDef = layout.cells;

  // 1. Explicit layout cells — placed at their physical (col,row), clamped to bounds.
  for (const key of Object.keys(cellsDef)) {
    const def = cellsDef[key] || {};
    let col = Number(def.col);
    let row = Number(def.row);
    let w = Number(def.w);
    let h = Number(def.h);
    if (!Number.isFinite(col)) col = 1;
    if (!Number.isFinite(row)) row = 1;
    if (!Number.isFinite(w) || w < 1) w = 1;
    if (!Number.isFinite(h) || h < 1) h = 1;
    col = Math.floor(col);
    row = Math.floor(row);
    w = Math.floor(w);
    h = Math.floor(h);
    // clamp into the grid (span overflow handling)
    col = Math.min(Math.max(col, 1), cols);
    row = Math.min(Math.max(row, 1), rows);
    if (col + w - 1 > cols) w = Math.max(1, cols - col + 1);
    if (row + h - 1 > rows) h = Math.max(1, rows - row + 1);
    for (let r = row; r < row + h; r++) {
      for (let c = col; c < col + w; c++) occupied.add(`${c},${r}`);
    }
    cells.push({ key, item: byKey.get(key) || null, col, row, w, h, placed: 'layout' });
  }

  // 2. Auto-placement fallback — items whose pos is NOT in layout.cells land in
  //    the first free empty slots in reading order (never overlapping).
  const placedKeys = new Set(cells.map(c => c.key));
  const unplaced = all.filter(item => !placedKeys.has(String(item.pos)));
  for (const item of unplaced) {
    const spot = findFreeCell(cols, rows, occupied, 1, 1);
    if (!spot) break; // grid full — silently skip; renderer never crashes
    occupied.add(`${spot.col},${spot.row}`);
    cells.push({ key: String(item.pos), item, col: spot.col, row: spot.row, w: 1, h: 1, placed: 'auto' });
  }

  return { matched: true, cols, rows, cells, notes };
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Diagram rendering
 * ───────────────────────────────────────────────────────────────────────────── */

const CELL = 100; // SVG user units per grid cell
const PAD = 8;    // inner gutter so adjacent cells read as distinct slots

const TIER_STYLE = {
  high:    { fill: '#fb923c', stroke: '#ea580c', text: '#1c1917' }, // orange  ≥30A
  medium:  { fill: '#fbbf24', stroke: '#d97706', text: '#1c1917' }, // amber   20–29A
  low:     { fill: '#34d399', stroke: '#059669', text: '#064e3b' }, // emerald <20A
  unknown: { fill: '#64748b', stroke: '#475569', text: '#f1f5f9' }, // slate   non-numeric
};
const RELAY_STYLE = { fill: '#a855f7', stroke: '#7e22ce', text: '#faf5ff' }; // purple
const EMPTY_STYLE = { fill: '#16233a', stroke: '#2b3c55' };

/** Single tappable cell inside the SVG grid. */
function DiagramCell({ cell, hasSearch, isMatch, dim, onSelect }) {
  const { item, col, row, w, h } = cell;
  const x = (col - 1) * CELL + PAD / 2;
  const y = (row - 1) * CELL + PAD / 2;
  const width = w * CELL - PAD;
  const height = h * CELL - PAD;
  const cx = x + width / 2;
  const cy = y + height / 2;

  const style = item.kind === 'relay' ? RELAY_STYLE : TIER_STYLE[ampTier(item.amps)] || TIER_STYLE.unknown;
  const label = String(item.pos);
  const fontSize = label.length > 3 ? 26 : label.length > 2 ? 30 : 36;

  return (
    <g
      className="cursor-pointer transition-opacity"
      opacity={dim ? 0.22 : 1}
      onClick={() => onSelect(cell)}
      role="button"
      aria-label={`${label}${item.kind === 'relay' ? ' relay' : ` fuse ${item.amps != null ? item.amps : ''}`} — ${item.circuit || ''}`}
    >
      <rect
        x={x} y={y} width={width} height={height} rx={Math.min(10, CELL / 8)}
        fill={style.fill} stroke={isMatch ? '#38bdf8' : style.stroke}
        strokeWidth={isMatch ? 5 : 2.5}
      />
      <text
        x={cx} y={cy} textAnchor="middle" dominantBaseline="central"
        fontSize={fontSize} fontWeight={700} fill={style.text}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      >
        {label}
      </text>
    </g>
  );
}

/** Color legend for the diagram. */
function DiagramLegend() {
  const entries = [
    { label: '30A+', color: TIER_STYLE.high.fill },
    { label: '20–29A', color: TIER_STYLE.medium.fill },
    { label: '<20A', color: TIER_STYLE.low.fill },
    { label: 'Unknown', color: TIER_STYLE.unknown.fill },
    { label: 'Relay', color: RELAY_STYLE.fill },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
      {entries.map(e => (
        <span key={e.label} className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="w-2.5 h-2.5 rounded-[3px] inline-block" style={{ background: e.color }} />
          {e.label}
        </span>
      ))}
    </div>
  );
}

/** Detail popover shown when a cell is tapped. */
function CellPopover({ cell, onClose }) {
  const { item, key: pos } = cell;
  if (!item) return null;
  const isRelay = item.kind === 'relay';
  return (
    <div className="mt-3 rounded-xl border border-slate-700 bg-slate-800/80 p-4 relative">
      <button
        onClick={onClose}
        aria-label="Close fuse details"
        className="absolute right-2.5 top-2.5 p-1 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2 mb-2 pr-8">
        <span
          className={`inline-flex items-center justify-center min-w-8 h-8 px-1.5 rounded-lg font-mono font-bold text-xs ${
            isRelay
              ? 'bg-purple-500/10 border border-purple-500/25 text-purple-300'
              : 'bg-slate-700 text-cyan-300'
          }`}
        >
          {pos}
        </span>
        {!isRelay && (
          <span className="font-mono font-semibold text-sm text-slate-200">
            {typeof item.amps === 'number' ? `${item.amps}A` : (item.amps || '—')}
          </span>
        )}
        {isRelay && <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-400">Relay</span>}
      </div>
      <p className="text-sm font-semibold text-white">{item.circuit || 'Unlabeled circuit'}</p>
      {item.desc && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>}
    </div>
  );
}

/** The Diagram view for one panel: SVG grid + legend + fallback banner + notes. */
function PanelDiagram({ panel, searchTerm }) {
  const { matched, cols, rows, cells, notes } = useMemo(() => computePanelLayout(panel), [panel]);
  const [selected, setSelected] = useState(null);
  const hasSearch = !!String(searchTerm || '').trim();

  const matchKeys = useMemo(() => {
    const s = new Set();
    for (const c of cells) {
      if (c.item && itemMatches(c.item, searchTerm)) s.add(c.key);
    }
    return s;
  }, [cells, searchTerm]);

  const totalMatched = matchKeys.size;

  if (hasSearch && totalMatched === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-xs text-slate-500">No matching fuses or relays in this panel.</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      {!matched && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300/90 leading-relaxed">
            <span className="font-semibold">Approximate layout</span> — this panel is not yet
            matched to the OEM diagram. Position numbers are ground truth; verify against the
            fuse box cover.
          </p>
        </div>
      )}

      <svg
        viewBox={`0 0 ${cols * CELL} ${rows * CELL}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label={`${panel.name} fuse layout diagram`}
      >
        {/* empty slots — subtle placeholders */}
        {Array.from({ length: rows }, (_, r) => {
          const row = r + 1;
          return Array.from({ length: cols }, (_, c) => {
            const col = c + 1;
            return (
              <rect
                key={`slot-${col}-${row}`}
                x={(col - 1) * CELL + PAD / 2}
                y={(row - 1) * CELL + PAD / 2}
                width={CELL - PAD}
                height={CELL - PAD}
                rx={10}
                fill={EMPTY_STYLE.fill}
                stroke={EMPTY_STYLE.stroke}
                strokeWidth={1.5}
                strokeDasharray="5 6"
              />
            );
          });
        })}
        {/* placed cells (drawn on top of the placeholder grid) */}
        {cells.map((cell, i) =>
          cell.item ? (
            <DiagramCell
              key={`${cell.key}-${i}`}
              cell={cell}
              hasSearch={hasSearch}
              isMatch={hasSearch && matchKeys.has(cell.key)}
              dim={hasSearch && !matchKeys.has(cell.key)}
              onSelect={setSelected}
            />
          ) : null
        )}
      </svg>

      <DiagramLegend />

      {hasSearch && (
        <p className="text-[10px] text-slate-500 mt-2">
          {totalMatched} matching position{totalMatched !== 1 ? 's' : ''} highlighted
          {totalMatched < cells.length ? ' — others dimmed' : ''}.
        </p>
      )}

      {notes.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5">
          {notes.map((n, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <p>{n}</p>
            </div>
          ))}
        </div>
      )}

      {selected && <CellPopover cell={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default function FuseBox({ selectedVehicle }) {
  const [search, setSearch] = useState('');
  const [view, setView] = useState('diagram'); // 'diagram' | 'list'
  const [expandedPanels, setExpandedPanels] = useState({});

  const vehicle = selectedVehicle;
  const fuseData = useMemo(() => {
    if (!vehicle) return null;
    return findFuseData(vehicle.make, vehicle.model, vehicle.year);
  }, [vehicle]);

  // Toggle panel expand/collapse
  const togglePanel = (panelIdx) => {
    setExpandedPanels(prev => ({ ...prev, [panelIdx]: !prev[panelIdx] }));
  };

  // If no vehicle selected
  if (!vehicle) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
          <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Vehicle Selected</h3>
          <p className="text-sm text-slate-400">Select a vehicle from the garage to view its fuse box diagrams.</p>
        </div>
      </div>
    );
  }

  // If data not available for this vehicle
  if (!fuseData || !fuseData.panels || fuseData.panels.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Wiring Diagrams</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
          </div>
        </div>
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
          <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Fuse Box Data Coming Soon</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Fuse box data is not yet available for the {vehicle.year} {vehicle.make} {vehicle.model}.
            We're continually expanding our database — check back soon!
          </p>
        </div>
      </div>
    );
  }

  const panels = fuseData.panels;
  const searchTerm = search.trim();

  // Auto-expand first panel if none toggled yet
  // But only do this once — use the fact that expandedPanels starts empty
  const getPanelExpanded = (idx) => {
    if (Object.keys(expandedPanels).length === 0) return true; // all expanded by default
    return expandedPanels[idx] !== false;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Wiring Diagrams</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {vehicle.year} {vehicle.make} {vehicle.model} — {panels.length} fuse panel{panels.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-300/90 leading-relaxed">
          <span className="font-semibold">⚠️ Verify against your vehicle's fuse box cover.</span> Never substitute a higher-rated fuse.
          Fuse assignments may vary by trim level, region, and optional equipment. Always check your owner's manual or fuse box cover label before replacing.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search fuses and relays by circuit name or description..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/60 border border-slate-700 w-fit mb-6">
        <button
          onClick={() => setView('diagram')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            view === 'diagram'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Diagram
        </button>
        <button
          onClick={() => setView('list')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            view === 'list'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          List
        </button>
      </div>

      {/* Panels */}
      <div className="space-y-6">
        {panels.map((panel, panelIdx) => {
          const hasLayout = !!(panel.layout && panel.layout.cells);
          const isExpanded = getPanelExpanded(panelIdx);
          const hasSearch = !!searchTerm;
          const totalAll = (panel.fuses || []).length + (panel.relays || []).length;
          const matchedCount =
            view === 'diagram'
              ? null
              : (() => {
                  let n = 0;
                  for (const f of panel.fuses || []) if (itemMatches(f, searchTerm)) n++;
                  for (const r of panel.relays || []) if (itemMatches(r, searchTerm)) n++;
                  return n;
                })();

          return (
            <div key={panelIdx} className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
              {/* Panel Header */}
              <button
                onClick={() => togglePanel(panelIdx)}
                className="w-full flex items-start gap-4 p-5 text-left hover:bg-slate-800/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white">{panel.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <p className="text-xs text-slate-400 truncate">{panel.location}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                      {panel.fuses?.length || 0} fuses
                    </span>
                    {panel.relays && panel.relays.length > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                        {panel.relays.length} relays
                      </span>
                    )}
                    {hasLayout ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-semibold">
                        OEM-matched
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-semibold">
                        Approximate
                      </span>
                    )}
                    {hasSearch && view === 'list' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">
                        {matchedCount} match{matchedCount !== 1 ? 'es' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 text-slate-500 shrink-0 mt-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Panel Content */}
              {isExpanded && (
                <div className="border-t border-slate-800">
                  {view === 'diagram' ? (
                    <PanelDiagram panel={panel} searchTerm={searchTerm} />
                  ) : (
                    <ListTable panel={panel} searchTerm={searchTerm} hasSearch={hasSearch} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary footer */}
      <div className="mt-6 flex items-center gap-3 text-[10px] text-slate-600 justify-center">
        <Info className="w-3 h-3" />
        <span>Data sourced from manufacturer owner's manuals and NHTSA publications.</span>
      </div>
    </div>
  );
}

/** The original table view — unchanged behavior/markup from the List mode. */
function ListTable({ panel, searchTerm, hasSearch }) {
  const filterItems = (items) => {
    if (!hasSearch) return items;
    return items.filter(item => itemMatches(item, searchTerm));
  };
  const filteredFuses = filterItems(panel.fuses || []);
  const filteredRelays = filterItems(panel.relays || []);
  const totalFiltered = filteredFuses.length + filteredRelays.length;

  if (hasSearch && totalFiltered === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-xs text-slate-500">No matching fuses or relays in this panel.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-slate-800/50">
            <th className="px-4 py-2.5 font-medium text-slate-400 w-16">Position</th>
            <th className="px-4 py-2.5 font-medium text-slate-400 w-16">Amps</th>
            <th className="px-4 py-2.5 font-medium text-slate-400">Circuit</th>
            <th className="px-4 py-2.5 font-medium text-slate-400">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {/* Fuses */}
          {filteredFuses.map((fuse, i) => (
            <tr key={`f-${i}`} className="hover:bg-slate-800/20 transition-colors">
              <td className="px-4 py-2.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 text-cyan-400 font-mono font-bold text-xs">
                  {fuse.pos}
                </span>
              </td>
              <td className="px-4 py-2.5">
                <span className={`font-mono font-semibold ${
                  typeof fuse.amps === 'number'
                    ? fuse.amps >= 30 ? 'text-orange-400' : fuse.amps >= 20 ? 'text-amber-400' : 'text-emerald-400'
                    : 'text-slate-500'
                }`}>
                  {typeof fuse.amps === 'number' ? `${fuse.amps}A` : (fuse.amps || '—')}
                </span>
              </td>
              <td className="px-4 py-2.5 font-medium text-slate-200">{fuse.circuit}</td>
              <td className="px-4 py-2.5 text-slate-400">{fuse.desc}</td>
            </tr>
          ))}

          {/* Relays */}
          {filteredRelays.length > 0 && (
            <>
              {/* Relay sub-header */}
              <tr>
                <td colSpan={4} className="px-4 py-2 bg-slate-800/30">
                  <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">Relays</span>
                </td>
              </tr>
              {filteredRelays.map((relay, i) => (
                <tr key={`r-${i}`} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono font-bold text-xs">
                      {relay.pos}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-slate-600">—</span>
                  </td>
                  <td className="px-4 py-2.5 font-medium text-purple-300/80">{relay.circuit}</td>
                  <td className="px-4 py-2.5 text-slate-400">{relay.desc}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
