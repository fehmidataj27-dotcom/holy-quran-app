import React, { useEffect, useState, useRef } from 'react';

const LS_CACHE_DONE = 'quran_full_cache_done_v4';

interface QuranCacheManagerProps {
  onCacheDone?: () => void;
}

export const QuranCacheManager: React.FC<QuranCacheManagerProps> = ({ onCacheDone }) => {
  const [cached, setCached] = useState(0);
  const [total, setTotal] = useState(548);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    // Already done before?
    if (localStorage.getItem(LS_CACHE_DONE) === 'true') {
      onCacheDone?.();
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CACHE_PROGRESS') {
        const { cached: c, total: t, done: d } = event.data;
        setCached(c);
        setTotal(t || 548);
        setDone(d);
        setVisible(true);
        if (d) {
          localStorage.setItem(LS_CACHE_DONE, 'true');
          onCacheDone?.();
          setTimeout(() => setVisible(false), 4000);
        }
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);

    // Trigger caching after just 1 second
    const timer = setTimeout(() => {
      if (startedRef.current) return;
      startedRef.current = true;
      setVisible(true);
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CACHE_ALL_PAGES' });
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, [onCacheDone]);

  if (!visible || dismissed || done && cached === 0) return null;

  const pct = total > 0 ? Math.round((cached / total) * 100) : 0;
  const isDone = done || pct >= 100;

  return (
    <div
      className="fixed bottom-16 left-2 right-2 z-50 flex justify-center pointer-events-none"
      style={{ direction: 'ltr' }}
    >
      <div
        className="bg-[#0a1f18] border border-[#2d5a45] rounded-2xl shadow-2xl px-4 py-2.5 w-full max-w-sm pointer-events-auto"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-base flex-shrink-0">{isDone ? '✅' : '📥'}</span>
            <div className="min-w-0 flex-1">
              {isDone ? (
                <>
                  <div className="text-xs font-bold text-emerald-300 truncate">Quran Cached! Instant reading ready ⚡</div>
                  <div className="text-[10px] text-emerald-500 font-arabic">پورا قرآن محفوظ — اب فوری کھلے گا</div>
                </>
              ) : (
                <>
                  <div className="text-xs font-bold text-[#e8c872]">
                    Saving Quran… {cached}/{total} pages ({pct}%)
                  </div>
                  <div className="text-[10px] text-emerald-400 font-arabic">قرآن save ہو رہا ہے — ایک بار پھر فوری</div>
                </>
              )}
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-500 hover:text-white text-xs ml-2 p-1 rounded hover:bg-white/10 flex-shrink-0"
          >✕</button>
        </div>

        <div className="w-full h-2 bg-[#1b3d30] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.max(pct, 2)}%`,
              background: isDone
                ? 'linear-gradient(90deg,#4ade80,#22c55e)'
                : 'linear-gradient(90deg,#e8c872,#f5da8e)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
