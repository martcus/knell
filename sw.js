// ─────────────────────────────────────────────────────────────
// KNELL — Service Worker
// ⚠️  Keep CACHE_VERSION in sync with APP_VERSION in index.html
//     Change this string on every deploy to bust the old cache.
// ─────────────────────────────────────────────────────────────
const CACHE_VERSION = 'knell-v1.3.1';

const ASSETS = [
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install: cache assets and activate immediately
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: delete every stale cache
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: network-first for HTML (always fresh), cache-first for assets
self.addEventListener('fetch', e => {
  const url   = new URL(e.request.url);
  const isHTML = e.request.destination === 'document' || url.pathname.endsWith('.html');

  if (isHTML) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res && res.status === 200) {
            caches.open(CACHE_VERSION).then(c => c.put(e.request, res.clone()));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200 && res.type !== 'opaque') {
            caches.open(CACHE_VERSION).then(c => c.put(e.request, res.clone()));
          }
          return res;
        }).catch(() => caches.match(e.request));
      })
    );
  }
});
