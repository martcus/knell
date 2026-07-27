// ─────────────────────────────────────────────────────────────
// KNELL — Service Worker
// ⚠️  Bump CACHE_VERSION on every deploy to force cache refresh
// ─────────────────────────────────────────────────────────────
const CACHE_VERSION = 'knell-v1.1';
const ASSETS = [
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install: cache all assets, activate immediately
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())  // don't wait for old SW to die
  );
});

// Activate: delete every cache that isn't the current version
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())  // take control of all open tabs
  );
});

// Fetch: network-first for HTML (always fresh), cache-first for everything else
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isHTML = e.request.destination === 'document' || url.pathname.endsWith('.html');

  if (isHTML) {
    // Network-first for HTML: always try to get the latest version
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => caches.match(e.request)) // offline fallback
    );
  } else {
    // Cache-first for all other assets (fonts, icons, etc.)
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200 && res.type !== 'opaque') {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(e.request, copy));
          }
          return res;
        }).catch(() => caches.match(e.request));
      })
    );
  }
});
