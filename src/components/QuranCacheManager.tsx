import React, { useEffect, useState, useRef } from 'react';

const LS_CACHE_DONE = 'quran_full_cache_done';

interface CacheProgress {
  cached: number;
  total: number;
  done: boolean;
}

interface QuranCacheManagerProps {
  /** Called when full cache is confirmed done */
  onCacheDone?: () => void;
}

/**
 * Background caches all 548 Mushaf pages via Service Worker.
 * Shows a small floating progress bar at the bottom.
 * Once done, it disappears and never runs again (localStorage flag).
 */
export const QuranCacheManager: React.FC<QuranCacheManagerProps> = ({ onCacheDone }) => {
  const [progress, setProgress] = useState<CacheProgress | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    // If already fully cached before, skip
    if (localStorage.getItem(LS_CACHE_DONE) === 'true') {
      onCacheDone?.();
      return;
    }

    // Listen for SW progress messages
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CACHE_PROGRESS') {
        const { cached, total, done } = event.data;
        setProgress({ cached, total, done });
        setVisible(true);
        if (done) {
          localStorage.setItem(LS_CACHE_DONE, 'true');
          onCacheDone?.();
          setTimeout(() => setVisible(false), 3000);
        }
      }
    };
    navigator.serviceWorker?.addEventListener('message', handleMessage);

    // Start caching after 5 seconds (let app fully load first)
    const timer = setTimeout(() => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CACHE_ALL_PAGES' });
        setVisible(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, [onCacheDone]);

  if (!visible || dismissed || !progress) return null;

  const pct = Math.round((progress.cached / (progress.total || 548)) * 100);
  const isDone = progress.done || pct >= 100;

  return (
    <div
      className="fixed bottom-16 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
      style={{ direction: 'ltr' }}
    >
      <div
        className="bg-[#0e2a22] border border-[#2d5a45] rounded-2xl shadow-2xl px-4 py-2.5 w-full max-w-sm pointer-events-auto"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            {isDone ? (
              <span className="text-base">✅</span>
            ) : (
              <span className="text-sm animate-spin inline-block">⏳</span>
            )}
            <div>
              {isDone ? (
                <>
                  <div className="text-xs font-bold text-emerald-300">Full Quran Cached! — Ready for instant reading</div>
                  <div className="text-[10px] text-emerald-500 font-arabic">پورا قرآن محفوظ — اب ہر صفحہ فوری کھلے گا ✨</div>
                </>
              ) : (
                <>
                  <div className="text-xs font-bold text-[#e8c872]">Caching Quran in background… {pct}%</div>
                  <div className="text-[10px] text-emerald-400 font-arabic">قرآن background میں save ہو رہا ہے ({progress.cached}/{progress.total})</div>
                </>
              )}
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-500 hover:text-white text-xs ml-2 px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors"
            title="Dismiss"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#1b3d30] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: isDone
                ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                : 'linear-gradient(90deg, #e8c872, #f5da8e)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
