const CACHE_NAME = 'quran-app-core-v9';
const IMAGE_CACHE = 'quran-mushaf-images-v4';

const MIN_PAGE = 2;
const MAX_PAGE = 549;

// Essential app shell files to cache on install for full offline app operation
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

// --- Install: cache core assets immediately & skip waiting ---
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('Some core assets failed to cache:', err);
      });
    })
  );
});

// --- Activate: clean old versions, claim clients, start background Quran caching ---
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
        // Auto-cache the entire Quran in background
        startBackgroundCaching();
      })
  );
});

// --- Fetch Strategy ---
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Quran Mushaf page images (Cache-First)
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
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);
        });
      })
    );
    return;
  }

  // 2. Navigation requests (HTML) -> Stale While Revalidate / Cache-Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(request);
          if (cached) return cached;
          return cache.match('/') || cache.match('/index.html');
        })
    );
    return;
  }

  // 3. Static Assets (JS, CSS, fonts, audio, icons) -> Cache First, fallback to network
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) {
        // Fetch in background to update cache silently
        fetch(request).then((netRes) => {
          if (netRes && netRes.status === 200) {
            cache.put(request, netRes.clone());
          }
        }).catch(() => {});
        return cached;
      }

      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && request.method === 'GET') {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {
        // Return cached root if available as ultimate fallback
        return cache.match('/');
      });
    })
  );
});

// --- Background Quran Caching (548 pages) ---
async function startBackgroundCaching() {
  const cache = await caches.open(IMAGE_CACHE);
  const BATCH = 8;
  const DELAY = 150;

  let totalCached = 0;
  for (let page = MIN_PAGE; page <= MAX_PAGE; page++) {
    const existing = await cache.match(getImageUrl(page));
    if (existing) totalCached++;
  }

  const total = MAX_PAGE - MIN_PAGE + 1;
  if (totalCached >= total) return;

  for (let page = MIN_PAGE; page <= MAX_PAGE; page += BATCH) {
    const batch = [];
    for (let p = page; p < Math.min(page + BATCH, MAX_PAGE + 1); p++) {
      const url = getImageUrl(p);
      const existing = await cache.match(url);
      if (!existing) {
        batch.push(
          fetch(url, { priority: 'low' })
            .then((res) => {
              if (res && res.status === 200) {
                cache.put(url, res.clone());
              }
            })
            .catch(() => {})
        );
      }
    }
    await Promise.all(batch);
    if (page + BATCH <= MAX_PAGE) {
      await new Promise(r => setTimeout(r, DELAY));
    }
  }
}
