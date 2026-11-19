const CACHE_NAME = 'quran-app-v7';
const IMAGE_CACHE = 'quran-mushaf-images-v3';

const MIN_PAGE = 2;
const MAX_PAGE = 549;

function getImageUrl(page) {
  const fileName = String(page).padStart(3, '0') + '.webp';
  return `https://cdn.jsdelivr.net/gh/malikusmanhaider/quran-16-line-images@master/images/${fileName}`;
}

// --- Install: skip waiting immediately ---
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// --- Activate: clean old caches ---
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
            return cachedResponse;
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

// --- Background caching: triggered by app via postMessage ---
self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'CACHE_ALL_PAGES') {
    cacheAllPages(event.source);
  }
  if (event.data && event.data.type === 'CACHE_RANGE') {
    const { start, end } = event.data;
    cachePageRange(start, end, event.source);
  }
});

async function cacheAllPages(client) {
  const cache = await caches.open(IMAGE_CACHE);
  const total = MAX_PAGE - MIN_PAGE + 1; // 548 pages
  let cached = 0;
  let alreadyCached = 0;

  // Check how many already cached
  for (let page = MIN_PAGE; page <= MAX_PAGE; page++) {
    const url = getImageUrl(page);
    const existing = await cache.match(url);
    if (existing) alreadyCached++;
  }

  // If all cached, notify done
  if (alreadyCached === total) {
    sendProgress(client, total, total, true);
    return;
  }

  cached = alreadyCached;

  // Cache in batches of 4 with small delay to avoid overloading network
  const BATCH = 4;
  const DELAY = 300; // ms between batches

  for (let page = MIN_PAGE; page <= MAX_PAGE; page += BATCH) {
    const batch = [];
    for (let p = page; p < Math.min(page + BATCH, MAX_PAGE + 1); p++) {
      const url = getImageUrl(p);
      const existing = await cache.match(url);
      if (!existing) {
        batch.push(
          fetch(url)
            .then((res) => {
              if (res && res.status === 200) {
                cache.put(url, res.clone());
                cached++;
                sendProgress(client, cached, total, false);
              }
            })
            .catch(() => { cached++; })
        );
      } else {
        cached++;
      }
    }
    await Promise.all(batch);
    sendProgress(client, cached, total, cached >= total);
    if (page + BATCH <= MAX_PAGE) {
      await new Promise(r => setTimeout(r, DELAY));
    }
  }

  sendProgress(client, total, total, true);
}

async function cachePageRange(start, end, client) {
  const cache = await caches.open(IMAGE_CACHE);
  for (let page = start; page <= end; page++) {
    const url = getImageUrl(page);
    const existing = await cache.match(url);
    if (!existing) {
      fetch(url).then((res) => {
        if (res && res.status === 200) cache.put(url, res.clone());
      }).catch(() => {});
    }
  }
}

function sendProgress(client, cached, total, done) {
  if (client && client.postMessage) {
    client.postMessage({ type: 'CACHE_PROGRESS', cached, total, done });
  }
  // Also broadcast to all clients
  self.clients.matchAll().then(clients => {
    clients.forEach(c => c.postMessage({ type: 'CACHE_PROGRESS', cached, total, done }));
  });
}
