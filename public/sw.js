const CACHE_NAME = 'quran-app-core-v10';
const IMAGE_CACHE = 'quran-mushaf-images-v5';

const MIN_PAGE = 2;
const MAX_PAGE = 549;

// All essential shell files
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/playstore_assets/app_icon_512x512.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/.well-known/assetlinks.json'
];

function getImageUrl(page) {
  const fileName = String(page).padStart(3, '0') + '.webp';
  return `https://cdn.jsdelivr.net/gh/malikusmanhaider/quran-16-line-images@master/images/${fileName}`;
}

// 1. Install Event: Cache Core App Files
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        await cache.addAll(CORE_ASSETS);
      } catch (err) {
        console.warn('Install caching fallback:', err);
      }
    })
  );
});

// 2. Activate Event: Clean Old Caches & Launch Fast Background Caching
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
      .then(() => {
        startFastBackgroundCaching();
      })
  );
});

// 3. Fetch Event: Reliable Offline Interception
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Mushaf scanned page images (CDN) -> Cache First
  const isMushafImage = (
    url.hostname.includes('jsdelivr.net') ||
    url.hostname.includes('githubusercontent.com')
  ) && (
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.png')
  );

  if (isMushafImage) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // If offline and image not yet cached, return empty or retryable
          return cached || new Response('', { status: 408, statusText: 'Offline' });
        }
      })
    );
    return;
  }

  // App navigation (HTML requests) -> Stale-While-Revalidate with root fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(request);
          if (cached) return cached;
          return (await cache.match('/')) || (await cache.match('/index.html'));
        })
    );
    return;
  }

  // Google Fonts or static assets (JS, CSS, images) -> Cache-First
  const isStatic = (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.json')
  );

  if (isStatic) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) {
          // background sync
          fetch(request).then((netRes) => {
            if (netRes && netRes.status === 200) cache.put(request, netRes.clone());
          }).catch(() => {});
          return cached;
        }

        try {
          const netRes = await fetch(request);
          if (netRes && netRes.status === 200 && request.method === 'GET') {
            cache.put(request, netRes.clone());
          }
          return netRes;
        } catch (e) {
          return cached;
        }
      })
    );
    return;
  }

  // General fallback
  event.respondWith(
    fetch(request).catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      return cache.match(request);
    })
  );
});

// Fast, silent background caching for all 548 Mushaf pages
async function startFastBackgroundCaching() {
  const cache = await caches.open(IMAGE_CACHE);
  const BATCH_SIZE = 10;
  const DELAY_MS = 100;

  for (let page = MIN_PAGE; page <= MAX_PAGE; page += BATCH_SIZE) {
    const promises = [];
    for (let p = page; p < Math.min(page + BATCH_SIZE, MAX_PAGE + 1); p++) {
      const imgUrl = getImageUrl(p);
      promises.push(
        cache.match(imgUrl).then((exists) => {
          if (!exists) {
            return fetch(imgUrl, { priority: 'low' })
              .then((res) => {
                if (res && res.status === 200) {
                  return cache.put(imgUrl, res.clone());
                }
              })
              .catch(() => {});
          }
        })
      );
    }
    await Promise.all(promises);
    if (page + BATCH_SIZE <= MAX_PAGE) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }
}
