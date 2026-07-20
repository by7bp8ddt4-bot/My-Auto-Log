const CACHE_NAME = 'mtxtrkr-v3';
const BUILD_VERSION = '2026-07-20';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icon-1024.png',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/assets/logo.png',
  '/assets/hero-marketing.png',
];

// Install event: cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Some assets failed to cache:', err);
      });
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event: cache-first for versioned assets, network-first for HTML
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip browser extension requests
  if (!url.protocol.startsWith('http')) return;

  // Network-first for API-like requests (future-proofing)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || new Response('Offline', { status: 503 });
          });
        })
    );
    return;
  }

  // Network-first for HTML navigation requests (root / and /index.html)
  // This ensures users always get the latest HTML which references the
  // latest JS/CSS bundle hashes. Falls back to cache if offline.
  if (url.pathname === '/' || url.pathname === '/index.html' || request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline — fall back to cached HTML
          return caches.match(request).then((cached) => {
            return cached || caches.match('/') || new Response('Offline', { status: 503 });
          });
        })
    );
    return;
  }

  // Cache-first for versioned assets (JS, CSS, images, fonts with hashes)
  // These are immutable — safe to cache aggressively.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Return cached, update in background
        fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, clone);
              });
            }
          })
          .catch(() => {});
        return cached;
      }

      // Not in cache, fetch from network
      return fetch(request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      }).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});