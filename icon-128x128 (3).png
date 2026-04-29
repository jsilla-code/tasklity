const CACHE_NAME = 'mis-vacaciones-v1';
const STATIC_ASSETS = [
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE_NAME).then(ca => ca.put(e.request, c)); return r; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached => {
    if (cached) return cached;
    return fetch(e.request).then(r => {
      if (!r || r.status !== 200) return r;
      const c = r.clone();
      caches.open(CACHE_NAME).then(ca => { try { ca.put(e.request, c); } catch(err) {} });
      return r;
    }).catch(() => { if (e.request.destination === 'document') return caches.match('./index.html'); });
  }));
});
