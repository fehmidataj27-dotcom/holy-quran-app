/**
 * Cache and Offline Storage helper for Quran Audios
 * Uses browser CacheStorage (Cache API) to download and store MP3 files offline forever.
 */
const CACHE_NAME = 'quran-audio-cache-v1';

export async function isAudioCached(url: string): Promise<boolean> {
  if (!('caches' in window)) return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(url);
    return !!match;
  } catch (e) {
    return false;
  }
}

export async function cacheAudioOffline(url: string): Promise<boolean> {
  if (!('caches' in window)) return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await fetch(url);
    if (response.ok) {
      await cache.put(url, response);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to cache audio:', e);
    return false;
  }
}

export async function getCachedAudioUrl(url: string): Promise<string> {
  if (!('caches' in window)) return url;
  try {
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(url);
    if (match) {
      const blob = await match.blob();
      return URL.createObjectURL(blob);
    }
  } catch (e) {
    console.error('Error fetching from cache:', e);
  }
  return url;
}
