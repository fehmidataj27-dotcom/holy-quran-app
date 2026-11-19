const CACHE_NAME = 'quran-app-v8';
const IMAGE_CACHE = 'quran-mushaf-images-v4';

const MIN_PAGE = 2;
const MAX_PAGE = 549;

function getImageUrl(page) {
  const fileName = String(page).padStart(3, '0') + '.webp';
  return `https://cdn.jsdelivr.net/gh/malikusmanhaider/quran-16-line-images@master/images/${fileName}`;
}

// --- Install: skip waiting immediately ---
self.addEventListener('install', (event) => {
  self.skipWaiting();
  // Start background caching right away (don't block install)
  event.waitUntil(Promise.resolve());
});

// --- Activate: clean old caches, then start full background cache ---
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
        // Start caching ALL pages immediately in background (non-blocking)
        startBackgroundCaching();
      })
  );
});

// --- Fetch: Cache-First for Mushaf images ---
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

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
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse; // Instant from cache!
          }
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);
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

// --- Manual trigger from app ---
self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'CACHE_ALL_PAGES') {
    startBackgroundCaching();
  }
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    const status = await getCacheStatus();
    self.clients.matchAll().then(clients => {
      clients.forEach(c => c.postMessage({ type: 'CACHE_STATUS', ...status }));
    });
  }
});

async function getCacheStatus() {
  const cache = await caches.open(IMAGE_CACHE);
  let cached = 0;
  const total = MAX_PAGE - MIN_PAGE + 1;
  for (let page = MIN_PAGE; page <= MAX_PAGE; page++) {
    const existing = await cache.match(getImageUrl(page));
    if (existing) cached++;
  }
  return { cached, total, done: cached >= total };
}

// Background caching — aggressive: 8 pages per batch, 150ms delay
async function startBackgroundCaching() {
  const cache = await caches.open(IMAGE_CACHE);
  const BATCH = 8;
  const DELAY = 150;

  let totalCached = 0;

  // Count already cached
  for (let page = MIN_PAGE; page <= MAX_PAGE; page++) {
    const existing = await cache.match(getImageUrl(page));
    if (existing) totalCached++;
  }

  const total = MAX_PAGE - MIN_PAGE + 1;

  if (totalCached >= total) {
    broadcast({ type: 'CACHE_PROGRESS', cached: total, total, done: true });
    return;
  }

  let cached = totalCached;

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
                cached++;
              }
            })
            .catch(() => { cached++; })
        );
      } else {
        cached++;
      }
    }
    await Promise.all(batch);
    broadcast({ type: 'CACHE_PROGRESS', cached, total, done: cached >= total });

    if (page + BATCH <= MAX_PAGE) {
      await sleep(DELAY);
    }
  }

  broadcast({ type: 'CACHE_PROGRESS', cached: total, total, done: true });
}

function broadcast(msg) {
  self.clients.matchAll().then(clients => {
    clients.forEach(c => c.postMessage(msg));
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}
