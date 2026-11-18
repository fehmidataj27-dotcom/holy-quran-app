import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Bookmark, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MushafPageViewProps {
  initialPage?: number;
  initialSurahName?: string;
  initialJuzNumber?: number;
  onBack: () => void;
  onBookmarkPage?: (page: number) => void;
}

export const MushafPageView: React.FC<MushafPageViewProps> = ({
  initialPage = 1,
  initialSurahName = 'الفاتحة',
  initialJuzNumber = 1,
  onBack,
  onBookmarkPage,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  // Sync when initialPage changes
  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  // Check bookmark status
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quran_page_bookmarks');
      if (saved) {
        const pages: number[] = JSON.parse(saved);
        setIsBookmarked(pages.includes(currentPage));
      }
    } catch {}
  }, [currentPage]);

  const toggleBookmark = () => {
    try {
      const saved = localStorage.getItem('quran_page_bookmarks');
      let pages: number[] = saved ? JSON.parse(saved) : [];
      if (pages.includes(currentPage)) {
        pages = pages.filter((p) => p !== currentPage);
        setIsBookmarked(false);
      } else {
        pages.push(currentPage);
        setIsBookmarked(true);
      }
      localStorage.setItem('quran_page_bookmarks', JSON.stringify(pages));
      if (onBookmarkPage) onBookmarkPage(currentPage);
    } catch {}
  };

  const handleNextPage = () => {
    if (currentPage < 604) {
      setCurrentPage((p) => p + 1);
      setIsLoading(true);
      setHasError(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
      setIsLoading(true);
      setHasError(false);
    }
  };

  // Multiple high quality CDN sources for 16-line / tajweed color mushaf pages
  const paddedPage = currentPage.toString().padStart(3, '0');
  const imageUrl = `https://everyayah.com/data/quranpngs/1280_${paddedPage}.png`;
  const fallbackUrl = `https://www.searchtruth.org/quran/images2/large/page-${paddedPage}.png`;

  return (
    <div className="min-h-screen bg-[#111c16] text-white flex flex-col justify-between animate-fadeIn select-none">
      {/* Top Mushaf Header */}
      <header className="bg-gradient-to-r from-[#0d3827] via-[#124e35] to-[#0a2c1e] border-b border-[#d4af37]/40 px-3 md:px-6 py-2.5 flex items-center justify-between shadow-lg sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 bg-[#1b7a4b] hover:bg-[#14603b] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow transition-all active:scale-95"
          >
            ← مینو
          </button>
          <div className="text-right">
            <span className="text-xs text-[#ffd700] font-bold">
              صفحہ {currentPage} • 16 سطری تجویدی مصحف
            </span>
          </div>
        </div>

        {/* Zoom & Bookmark Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setScale((s) => Math.max(0.85, s - 0.1))}
            className="w-8 h-8 rounded-lg bg-black/25 hover:bg-black/40 flex items-center justify-center text-xs"
            title="چھوٹا کریں"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale(1)}
            className="w-8 h-8 rounded-lg bg-black/25 hover:bg-black/40 flex items-center justify-center text-xs"
            title="اصل سائز"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale((s) => Math.min(1.4, s + 0.1))}
            className="w-8 h-8 rounded-lg bg-black/25 hover:bg-black/40 flex items-center justify-center text-xs"
            title="بڑا کریں"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleBookmark}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${
              isBookmarked
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-black/25 text-gray-300 hover:text-white'
            }`}
            title="صفحہ محفوظ کریں"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Page Area */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-auto bg-[#0a1510] relative min-h-[75vh]">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1510]/80 z-20 space-y-3">
            <div className="w-10 h-10 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-amber-200">صفحہ لوڈ ہو رہا ہے...</p>
          </div>
        )}

        {/* 16-Line Authentic Quran Page */}
        <div
          className="relative max-w-2xl w-full bg-[#fcfbf7] rounded-2xl shadow-2xl overflow-hidden border-4 border-[#d4af37]/60 transition-transform duration-200"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        >
          <img
            src={hasError ? fallbackUrl : imageUrl}
            alt={`قرآن پاک صفحہ نمبر ${currentPage}`}
            className="w-full h-auto block filter contrast-105"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              if (!hasError) setHasError(true);
              else setIsLoading(false);
            }}
          />
        </div>
      </div>

      {/* Bottom Page Navigation Bar */}
      <footer className="bg-gradient-to-r from-[#0d3827] via-[#124e35] to-[#0a2c1e] border-t border-[#d4af37]/40 p-3 px-4 flex items-center justify-between sticky bottom-0 z-30 shadow-2xl">
        {/* Right side in Arabic Mushaf is Next Page (Left-to-Right reading for mushaf turn) */}
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
            currentPage <= 1
              ? 'bg-white/5 text-gray-500 cursor-not-allowed'
              : 'bg-[#ffd700] hover:bg-yellow-400 text-black active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>پچھلا صفحہ</span>
        </button>

        <div className="text-center font-bold text-xs text-emerald-100">
          <span className="text-[#ffd700] text-sm">{currentPage}</span> / 604
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= 604}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
            currentPage >= 604
              ? 'bg-white/5 text-gray-500 cursor-not-allowed'
              : 'bg-[#ffd700] hover:bg-yellow-400 text-black active:scale-95'
          }`}
        >
          <span>اگلا صفحہ</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
