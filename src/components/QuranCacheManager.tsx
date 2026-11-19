import React, { useEffect, useRef } from 'react';

const LS_CACHE_DONE = 'quran_full_cache_done_v4';

interface QuranCacheManagerProps {
  onCacheDone?: () => void;
}

/**
 * Silently caches all 548 Mushaf pages via Service Worker in the background.
 * NO UI shown to the user — completely invisible.
 */
export const QuranCacheManager: React.FC<QuranCacheManagerProps> = ({ onCacheDone }) => {
  const startedRef = useRef(false);

  useEffect(() => {
    // Already done before — skip silently
    if (localStorage.getItem(LS_CACHE_DONE) === 'true') {
      onCacheDone?.();
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CACHE_PROGRESS' && event.data?.done) {
        localStorage.setItem(LS_CACHE_DONE, 'true');
        onCacheDone?.();
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);

    // Silently start background caching after 2 seconds (let app load first)
    const timer = setTimeout(() => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CACHE_ALL_PAGES' });
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, [onCacheDone]);

  // Render NOTHING — invisible to the user
  return null;
};
