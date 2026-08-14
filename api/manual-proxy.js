/**
 * Owner's Manual Proxy — Vercel Serverless Function
 *
 * Fetches an owner's manual URL SERVER-SIDE so the browser never hits
 * upstream CORS / bot-protection issues, and returns the PDF bytes as base64
 * JSON (or a clear error JSON). Runs from Vercel IPs — this is where
 * bot-blocked brands get their real retry; entries the index marks
 * `fetchable: false` simply have no URL to fetch, and the client shows the
 * honest upload-fallback path.
 *
 * SECURITY:
 *   - Only URLs from the curated manual-index.js allowlist are accepted
 *     (see src/data/manual-lookup.js `isAllowedManualUrl`). Year-substituted
 *     variants of per-year patterns are allowed; arbitrary user URLs are
 *     NEVER fetched through this proxy — user uploads use the upload path.
 *   - Response size is capped (Vercel serverless response limits) so an
 *     oversized manual returns a clear error instead of a truncated payload.
 *
 * No vercel.json change needed — the existing api/* rewrite already routes
 * this function.
 */
import { isAllowedManualUrl } from '../src/data/manual-lookup.js';

/** Hard cap on the manual bytes returned (keeps base64 JSON under Vercel's
 * serverless response payload limit). Larger manuals → upload fallback. */
const MAX_BYTES = 3 * 1024 * 1024; // 3 MB
const TIMEOUT_MS = 25000;

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Accept: 'application/pdf,text/html,application/xhtml+xml,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

function send(res, status, payload) {
  res.status(status).json(payload);
}

export default async function handler(req, res) {
  // Only POST with a JSON body
  if (req.method !== 'POST') {
    return send(res, 405, { error: 'Method not allowed' });
  }

  let url;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    url = typeof body.url === 'string' ? body.url.trim() : '';
  } catch {
    return send(res, 400, { error: 'Invalid JSON body' });
  }

  if (!url) {
    return send(res, 400, { error: 'Missing url' });
  }

  // Allowlist gate — the core security boundary of this proxy.
  if (!isAllowedManualUrl(url)) {
    return send(res, 400, {
      error: 'URL is not in the approved owner’s manual index',
      hint: 'Upload your manual PDF instead.',
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = await fetch(url, {
      headers: BROWSER_HEADERS,
      redirect: 'follow',
      signal: controller.signal,
    });

    if (!upstream.ok) {
      return send(res, 502, {
        error: `Manual source responded with HTTP ${upstream.status}`,
        status: upstream.status,
      });
    }

    const contentType = (upstream.headers.get('content-type') || '').toLowerCase();
    const buffer = Buffer.from(await upstream.arrayBuffer());

    if (buffer.length === 0) {
      return send(res, 502, { error: 'Manual source returned an empty response' });
    }

    if (buffer.length > MAX_BYTES) {
      return send(res, 413, {
        error: 'Manual is too large to process automatically',
        size: buffer.length,
        hint: 'Upload the PDF directly instead — same highlights, no size limit.',
      });
    }

    return send(res, 200, {
      ok: true,
      base64: buffer.toString('base64'),
      bytes: buffer.length,
      contentType,
      isPdf: contentType.includes('pdf'),
    });
  } catch (err) {
    if (err && err.name === 'AbortError') {
      return send(res, 504, { error: 'Manual source timed out', hint: 'Upload the PDF directly instead.' });
    }
    console.error('[manual-proxy] Fetch failed:', err && err.message);
    return send(res, 502, {
      error: `Could not fetch the manual: ${(err && err.message) || 'unknown error'}`,
      hint: 'Upload the PDF directly instead.',
    });
  } finally {
    clearTimeout(timer);
  }
}
