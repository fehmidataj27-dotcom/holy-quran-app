const CACHE_NAME = 'quran-app-v6';
const IMAGE_CACHE = 'quran-mushaf-images-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== IMAGE_CACHE) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cache Quran Mushaf page images (Cache-First) across any CDN/domain for instant offline & subsequent loads
  const isMushafImage = (
    url.pathname.includes('/images/') || 
    url.hostname.includes('jsdelivr.net') || 
    url.hostname.includes('githubusercontent.com')
  ) && (
    url.pathname.endsWith('.webp') || 
    url.pathname.endsWith('.jpg') || 
    url.pathname.endsWith('.png')
  );

  if (isMushafImage) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Network first with cache fallback for app assets
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
