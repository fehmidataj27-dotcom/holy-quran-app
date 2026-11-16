const CACHE_NAME = 'quran-app-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Let browser fetch normally, with network-first or fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
