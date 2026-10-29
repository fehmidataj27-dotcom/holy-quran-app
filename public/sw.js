const CACHE_NAME = 'quran-app-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let browser fetch normally, with network-first or fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
