/**
 * Owner's Manual — flagship paid-tier feature
 *
 * For the selected vehicle, resolves the curated manual-index entry, fetches
 * the manual PDF through the serverless proxy (api/manual-proxy.js — avoids
 * browser CORS / bot protection), parses it client-side with pdfjs-dist, and
 * shows a swipe-able, searchable "highlights reel" of plain-English cards
 * (fluids, tires, bulbs, fuses, OBD, maintenance, warning lights).
 *
 * Fallbacks, all graceful (never a white screen):
 *   - No index entry / fetchable:false / Tesla  → upload-fallback prompt
 *   - Proxy error / timeout / oversized PDF    → clear message + upload prompt
 *   - Hub page (HTML, not a PDF)               → note + upload prompt
 *   - PDF with no extractable text (scanned)   → note + upload prompt
 *
 * Premium-gated: free users see the locked state (matching the app's
 * premium-lock pattern, e.g. MileageTracker); Family AND Fleet unlock it.
 */
import { useMemo, useRef, useState, useCallback } from 'react';
import {
  BookOpen, Search, Lock, ChevronLeft, ChevronRight, Upload, FileText,
  AlertTriangle, Loader2, X, ExternalLink, Car,
} from 'lucide-react';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { findManualEntry, resolveManualUrl } from '../data/manual-lookup.js';
import { sortManualHighlights, filterManualHighlights } from '../utils/manualReelSorter.js';
import { supabase } from '../lib/supabase.js';

const MAX_PARSE_PAGES = 300; // cap parse work on very long manuals

/* ── pdfjs parse (client-side, on-device) ─────────────────────────── */
async function parsePdfBytes(bytes) {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  try {
    const pages = [];
    const pageCount = Math.min(pdf.numPages, MAX_PARSE_PAGES);
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item) => (item && item.str) || '').join(' ');
      pages.push({ page: i, text });
    }
    return { pages, truncated: pdf.numPages > MAX_PARSE_PAGES, totalPages: pdf.numPages };
  } finally {
    try { await loadingTask.destroy(); } catch { /* noop */ }
  }
}

function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

const CATEGORY_EMOJI = {
  fluids: '💧', tires: '🛞', bulbs: '💡', fuses: '🔌', obd: '🔧', maintenance: '📅', warnings: '⚠️',
};

export default function OwnersManual({ vehicles, selectedVehicleId, isPremium, onNavigate, userId }) {
  const [view, setView] = useState('pick'); // 'pick' | 'busy' | 'reel' | 'error'
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [reel, setReel] = useState(null);
  const [source, setSource] = useState(null); // { type: 'auto' | 'upload', label, isHub? }
  const [search, setSearch] = useState('');
  const [cardIndex, setCardIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [localVehicleId, setLocalVehicleId] = useState(null);
  const fileInputRef = useRef(null);

  const effectiveVehicleId = localVehicleId || selectedVehicleId;
  const vehicle = vehicles.find((v) => v.id === effectiveVehicleId) || vehicles[0] || null;

  // Resolve the manual-index entry for the selected vehicle.
  const lookup = useMemo(() => {
    if (!vehicle) return null;
    return findManualEntry(vehicle.make, vehicle.model, vehicle.year);
  }, [vehicle]);

  const flatCards = useMemo(() => {
    if (!reel) return [];
    return reel.categories.flatMap((cat) => cat.cards);
  }, [reel]);

  const searchableReel = useMemo(
    () => filterManualHighlights(reel, search),
    [reel, search]
  );

  const runParse = useCallback(async (bytes, sourceInfo) => {
    setView('busy');
    setError(null);
    setInfo(null);
    try {
      const parsed = await parsePdfBytes(bytes);
      const totalText = parsed.pages.reduce((n, p) => n + p.text.length, 0);
      if (parsed.pages.length === 0 || totalText < 40) {
        setInfo('The manual was read, but it looks like a scanned/image-only PDF — no searchable text found.');
        setSource({ ...sourceInfo, noText: true });
        setView('reel');
        setReel({ categories: [], total: 0, scannedPages: parsed.pages.length });
        return;
      }
      const result = sortManualHighlights(parsed.pages);
      if (result.total === 0) {
        setInfo('We scanned the manual but could not find the usual reference sections (fluids, tires, bulbs…). The full manual is still available below.');
      }
      setSource({ ...sourceInfo, truncated: parsed.truncated });
      setReel(result);
      setCardIndex(0);
      setView('reel');
    } catch (err) {
      console.error('[OwnersManual] Parse failed:', err);
      setError('We couldn’t read that manual file. It may be corrupted or password-protected. Try uploading your manual PDF instead.');
      setView('error');
    }
  }, []);

  // Auto-fetch path: POST the allowlisted URL to the serverless proxy.
  const handleAutoFetch = useCallback(async () => {
    if (!vehicle || !lookup || !lookup.entry) return;
    const url = resolveManualUrl(lookup.entry, vehicle.year);
    if (!url) {
      // fetchable:false (e.g. Ford) → honest upload fallback
      setInfo('We don’t have a direct link for this model yet — upload your manual PDF and we’ll build the same highlights from it.');
      setView('reel');
      setReel({ categories: [], total: 0, scannedPages: 0 });
      setSource({ type: 'upload-hint' });
      return;
    }
    setView('busy');
    setError(null);
    setInfo(null);
    try {
      const response = await fetch('/api/manual-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        const msg = (result && result.error) || 'The manual source did not respond.';
        setError(`${msg} You can upload the PDF directly instead.`);
        setView('error');
        return;
      }
      if (!result.isPdf) {
        // Hub page / interactive manual — not a directly parseable PDF.
        setInfo('This manufacturer serves the manual as an interactive web page, not a downloadable PDF — upload your own PDF copy and we’ll build the same highlights from it.');
        setView('reel');
        setReel({ categories: [], total: 0, scannedPages: 0 });
        setSource({ type: 'auto', label: url, isHub: true });
        return;
      }
      await runParse(base64ToUint8Array(result.base64), {
        type: 'auto',
        label: url,
      });
    } catch (err) {
      console.error('[OwnersManual] Proxy fetch failed:', err);
      setError('We couldn’t reach the manual source right now. Upload your manual PDF instead — same highlights, no network dependency.');
      setView('error');
    }
  }, [vehicle, lookup, runParse]);

  // Upload path: parse the local file directly (works offline), and persist
  // a copy to Supabase Storage following the existing document pattern.
  const handleFile = useCallback(async (file) => {
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      setView('error');
      return;
    }
    setUploading(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      await runParse(bytes, { type: 'upload', label: file.name });
      // Best-effort cloud copy (user uploads persist per existing doc pattern).
      if (userId) {
        try {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const path = `${userId}/manuals/${Date.now()}-${safeName}`;
          await supabase.storage.from('documents').upload(path, file, { cacheControl: '3600', upsert: false });
        } catch (e) {
          console.warn('[OwnersManual] Cloud copy of uploaded manual failed (reel still works):', e);
        }
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [runParse, userId]);

  const pickVehicle = (id) => {
    setLocalVehicleId(id);
    setCardIndex(0);
    setSearch('');
    setView('pick');
    setError(null);
    setInfo(null);
    setReel(null);
    setSource(null);
  };

  const cards = searchableReel ? searchableReel.categories.flatMap((cat) => cat.cards) : [];
  const currentCard = cards[Math.min(cardIndex, Math.max(0, cards.length - 1))] || null;

  /* ── Premium lock (free users) ─────────────────────────────────── */
  if (!isPremium) {
    return (
      <div className="max-w-4xl mx-auto relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Owner's Manual</h2>
            <p className="text-sm text-slate-400 mt-0.5">Your Owner's Manual, Simplified</p>
          </div>
        </div>
        <div className="relative rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
          <div className="p-8 sm:p-12 opacity-40 pointer-events-none">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-center text-slate-500 text-sm max-w-md mx-auto">
              Fluids, tire pressures, bulbs, fuses, OBD port, maintenance intervals and warning lights —
              pulled straight from your owner's manual into one searchable reel.
            </p>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-[2px] z-10">
            <Lock className="w-7 h-7 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-white mb-1">Owner's Manual highlights</p>
            <p className="text-xs text-slate-400 mb-3">Premium feature — included with Family and Fleet.</p>
            <button
              onClick={() => onNavigate?.('premium')}
              className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30"
            >
              Upgrade to Premium →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── No vehicles ───────────────────────────────────────────────── */
  if (!vehicle) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
        <Car className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Vehicle Selected</h3>
        <p className="text-sm text-slate-400">Add a vehicle to your garage to unlock its owner's manual highlights.</p>
      </div>
    );
  }

  /* ── Vehicle picker + header (always visible) ──────────────────── */
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" /> Owner's Manual
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </p>
        </div>
        {vehicles.length > 1 && (
          <select
            value={vehicle.id}
            onChange={(e) => pickVehicle(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500/50"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>
            ))}
          </select>
        )}
      </div>

      {/* ── Initial state: matched entry → auto-fetch card ─────────── */}
      {view === 'pick' && (
        <div className="space-y-4">
          {lookup && lookup.reason === 'matched' && lookup.entry && (
            <div className="rounded-2xl border border-blue-900/30 bg-blue-900/10 p-6">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white">We found a manual source for your {vehicle.year} {vehicle.make} {vehicle.model}</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-lg">
                    {lookup.entry.notes || 'Fetching the manual so we can pull out the highlights for you.'}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {lookup.entry.lookupUrl && (
                      <a
                        href={lookup.entry.lookupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30"
                      >
                        <ExternalLink className="w-4 h-4" /> Open OEM Manual Lookup
                      </a>
                    )}
                    {(!lookup.entry.lookupUrl || (lookup.entry.url && lookup.entry.fetchable)) && (
                      <>
                        <button
                          onClick={handleAutoFetch}
                          className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30"
                        >
                          Fetch Manual &amp; Build Highlights
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-5 py-2.5 rounded-full bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 border border-slate-700 transition-all"
                        >
                          Upload My Own PDF Instead
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {(view === 'pick' && (!lookup || lookup.reason !== 'matched' || !lookup.entry)) && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
              <div className="flex items-start gap-3">
                <Upload className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white">
                    {!lookup || lookup.reason === 'make_not_in_index'
                      ? 'No automatic manual link for this make yet'
                      : 'No automatic manual link for this model yet'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-lg">
                    {lookup && lookup.reason === 'make_not_in_index'
                      ? 'We’re adding manufacturers over time. Upload your own owner’s manual PDF and we’ll build the same highlights reel from it.'
                      : lookup && lookup.reason === 'year_out_of_range'
                        ? 'The index covers other model years for this vehicle. Upload your manual PDF and we’ll build the highlights from it.'
                        : 'Upload your owner’s manual PDF and we’ll build the same highlights reel from it.'}
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-5 py-2.5 rounded-full bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 border border-slate-700 transition-all"
                  >
                    Upload Your Manual PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Busy ──────────────────────────────────────────────────── */}
      {view === 'busy' && (
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
          <Loader2 className="w-10 h-10 text-blue-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-white mb-1">{uploading ? 'Reading your manual…' : 'Fetching & reading the manual…'}</h3>
          <p className="text-sm text-slate-400">Scanning for fluids, tires, bulbs, fuses and more. This can take a minute.</p>
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────── */}
      {view === 'error' && (
        <div className="rounded-2xl border border-red-900/30 bg-red-900/10 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white">We couldn’t load the manual automatically</h3>
              <p className="text-sm text-slate-400 mt-1">{error}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30"
                >
                  Upload Your Manual PDF
                </button>
                <button
                  onClick={() => { setError(null); setView('pick'); }}
                  className="px-5 py-2.5 rounded-full bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 border border-slate-700 transition-all"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reel ──────────────────────────────────────────────────── */}
      {view === 'reel' && (
        <div className="space-y-4">
          {/* Source line */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            {source && source.type === 'upload' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                <FileText className="w-3.5 h-3.5" /> From your upload: {source.label}
              </span>
            )}
            {source && source.type === 'auto' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300">
                <BookOpen className="w-3.5 h-3.5" /> Fetched from {source.label}
              </span>
            )}
            {source && source.isHub && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5" /> Manufacturer serves an interactive page — upload your PDF for full highlights
              </span>
            )}
            {source && source.truncated && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-700/40 text-slate-300">
                First {MAX_PARSE_PAGES} pages scanned
              </span>
            )}
          </div>

          {info && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300/90 leading-relaxed">{info}</p>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCardIndex(0); }}
              placeholder="Search highlights (e.g. oil, psi, H11, OBD)…"
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cards / reel */}
          {cards.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white mb-1">
                {search ? 'No highlights match your search' : 'No highlights found yet'}
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                {search
                  ? 'Try a different word, or clear the search.'
                  : 'Upload a PDF manual for this vehicle and we’ll scan it for the key reference sections.'}
              </p>
              {!search && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all"
                >
                  Upload Your Manual PDF
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
              {/* Category dots */}
              <div className="flex flex-wrap gap-1.5 px-4 pt-4">
                {searchableReel.categories.map((cat) => (
                  <span key={cat.id} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {CATEGORY_EMOJI[cat.id] || '•'} {cat.label}
                  </span>
                ))}
              </div>

              {/* Pager card */}
              {currentCard && (
                <div className="px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold mb-1">
                        {currentCard.category} · p.{currentCard.page}
                      </p>
                      <h3 className="text-lg font-bold text-white leading-tight">{currentCard.title}</h3>
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">
                      {Math.min(cardIndex + 1, cards.length)} / {cards.length}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{currentCard.snippet}</p>

                  {/* Prev / Next */}
                  <div className="flex items-center justify-between mt-5">
                    <button
                      onClick={() => setCardIndex((i) => Math.max(0, i - 1))}
                      disabled={cardIndex === 0}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <div className="flex gap-1.5">
                      {cards.map((c, i) => (
                        <button
                          key={c.id}
                          onClick={() => setCardIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === Math.min(cardIndex, cards.length - 1) ? 'bg-blue-400 w-5' : 'bg-slate-700 hover:bg-slate-600'}`}
                          aria-label={`Highlight ${i + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setCardIndex((i) => Math.min(cards.length - 1, i + 1))}
                      disabled={cardIndex >= cards.length - 1}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Re-fetch / upload actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 border border-slate-700 transition-all"
            >
              <Upload className="w-3.5 h-3.5" /> Upload a different PDF
            </button>
            {lookup && lookup.reason === 'matched' && lookup.entry && !(source && source.type === 'auto') && (
              <button
                onClick={handleAutoFetch}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 border border-slate-700 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Try auto-fetch again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
