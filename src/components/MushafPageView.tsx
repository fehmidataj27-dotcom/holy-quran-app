import React, { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
import { ChevronRight, ChevronLeft, Bookmark, RotateCcw, BookOpen, AlertCircle } from 'lucide-react';
import { getPageMeta, MIN_PAGE, MAX_PAGE } from '../data/pageMeta';

interface MushafPageViewProps {
  initialPage?: number;
  onBack: () => void;
  onPageChange?: (page: number) => void;
}

const LS_MUSHAF_PAGE = 'quran_mushaf_last_page';
const LS_MUSHAF_BOOKMARKS = 'quran_mushaf_page_bookmarks';

// Format page number to 3-digit string (e.g. 2 -> "002")
function getPageFileName(page: number): string {
  return String(page).padStart(3, '0') + '.webp';
}

// Primary and fallback image URLs (16-line Indo-Pak Mushaf)
function getImageUrl(page: number, sourceIndex = 0): string {
  const fileName = getPageFileName(page);
  const sources = [
    `https://cdn.jsdelivr.net/gh/malikusmanhaider/quran-16-line-images@master/images/${fileName}`,
    `https://raw.githubusercontent.com/malikusmanhaider/quran-16-line-images/master/images/${fileName}`
  ];
  return sources[sourceIndex % sources.length];
}

// Convert numbers to Arabic-Indic numerals
function toArabicNumerals(n: number): string {
  return n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
}

export const MushafPageView: React.FC<MushafPageViewProps> = ({ initialPage, onBack, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (initialPage && initialPage >= MIN_PAGE && initialPage <= MAX_PAGE) {
      return initialPage;
    }
    const saved = localStorage.getItem(LS_MUSHAF_PAGE);
    if (saved) {
      const p = parseInt(saved, 10);
      if (p >= MIN_PAGE && p <= MAX_PAGE) return p;
    }
    return MIN_PAGE;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [imgError, setImgError] = useState<boolean>(false);
  const [sourceIndex, setSourceIndex] = useState<number>(0);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [pageInput, setPageInput] = useState<string>('');
  const [showGotoModal, setShowGotoModal] = useState<boolean>(false);

  // Swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Load bookmarks
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_MUSHAF_BOOKMARKS);
      if (saved) setBookmarks(JSON.parse(saved));
    } catch {}
  }, []);

  // Track loaded images in memory so revisited or preloaded pages display instantly
  const loadedPagesRef = useRef<Set<number>>(new Set());

  // Save current page
  useEffect(() => {
    localStorage.setItem(LS_MUSHAF_PAGE, String(currentPage));
    onPageChange?.(currentPage);
    
    // If already loaded in memory, don't show full loading overlay
    if (!loadedPagesRef.current.has(currentPage)) {
      setLoading(true);
      setImgLoaded(false);
    } else {
      setLoading(false);
      setImgLoaded(true);
    }
    setImgError(false);
    setSourceIndex(0);

    // Smart Preload: pre-cache next 5 pages and previous 3 pages aggressively
    for (let i = 1; i <= 5; i++) {
      if (currentPage + i <= MAX_PAGE) {
        const p = currentPage + i;
        if (!loadedPagesRef.current.has(p)) {
          const img = new Image();
          img.onload = () => loadedPagesRef.current.add(p);
          img.src = getImageUrl(p, 0);
        }
      }
    }
    for (let i = 1; i <= 3; i++) {
      if (currentPage - i >= MIN_PAGE && !loadedPagesRef.current.has(currentPage - i)) {
        const p = currentPage - i;
        const img = new Image();
        img.onload = () => loadedPagesRef.current.add(p);
        img.src = getImageUrl(p, 0);
      }
    }
  }, [currentPage, onPageChange]);

  // When initialPage prop changes from parent
  useEffect(() => {
    if (initialPage && initialPage >= MIN_PAGE && initialPage <= MAX_PAGE) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  // Quranic RTL page navigation:
  // In Arabic/Quran, turning a page forward ("اگلا صفحہ") means flipping from Right to Left, so next page is on the Left!
  // "اگلا صفحہ" = Next page (currentPage + 1)
  // "پچھلا صفحہ" = Previous page (currentPage - 1)
  const goNextPage = useCallback(() => {
    if (currentPage < MAX_PAGE) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage]);

  const goPrevPage = useCallback(() => {
    if (currentPage > MIN_PAGE) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  // Touch swipe & tap handling (Standard RTL Quran Book physics):
  // 1. Swiping Right (dragging right ->): returns to previous page (پچھلا صفحہ) -> goPrevPage()
  // 2. Swiping Left (dragging left <-): advances to next page (اگلا صفحہ) -> goNextPage()
  // 3. Screen Edge Tap: Tapping Right side -> goPrevPage(), Tapping Left side -> goNextPage()
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = touchEndX.current !== null ? touchEndX.current : touchStartX.current;
    const diffX = touchStartX.current - endX;
    const threshold = 35; // 35px swipe distance

    if (diffX < -threshold) {
      // Swiped Right (انگلی دائیں طرف کی) -> پچھلا صفحہ (Previous Page)
      goPrevPage();
    } else if (diffX > threshold) {
      // Swiped Left (انگلی بائیں طرف کی) -> اگلا صفحہ (Next Page)
      goNextPage();
    } else {
      // Quick Tap on screen side areas (Right side = پچھلا صفحہ, Left side = اگلا صفحہ)
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = touchStartX.current - rect.left;
      const width = rect.width;
      if (clickX > width * 0.72) {
        // Tapped right edge -> پچھلا صفحہ
        goPrevPage();
      } else if (clickX < width * 0.28) {
        // Tapped left edge -> اگلا صفحہ
        goNextPage();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation: Left Arrow goes to Next Page in RTL Quran, Right Arrow goes to Previous
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goNextPage();
      else if (e.key === 'ArrowRight') goPrevPage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNextPage, goPrevPage]);

  // Bookmark toggle
  const isBookmarked = bookmarks.includes(currentPage);
  const toggleBookmark = () => {
    let updated: number[];
    if (isBookmarked) {
      updated = bookmarks.filter(p => p !== currentPage);
    } else {
      updated = [...bookmarks, currentPage].sort((a, b) => a - b);
    }
    setBookmarks(updated);
    localStorage.setItem(LS_MUSHAF_BOOKMARKS, JSON.stringify(updated));
  };

  const pageMeta = getPageMeta(currentPage);

  const handleGotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (!isNaN(p) && p >= MIN_PAGE && p <= MAX_PAGE) {
      setCurrentPage(p);
      setShowGotoModal(false);
      setPageInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1f18] text-white select-none">
      {/* Top Header Bar */}
      <header className="flex-none bg-[#0e2a22] border-b border-[#2d5a45] px-4 py-2.5 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-[#4ade80] hover:text-white px-2 py-1 rounded transition-colors text-sm font-semibold"
            aria-label="Back to menu"
          >
            <ChevronRight className="w-5 h-5" />
            <span>فہرست</span>
          </button>
        </div>

        {/* Center: Surah & Juz Info */}
        <div className="text-center flex-1 mx-2">
          <div className="text-base font-bold text-[#e8c872] tracking-wide font-arabic">
            {pageMeta.arabicName} ({pageMeta.surahName})
          </div>
          <div className="text-xs text-emerald-300 font-arabic">
            {pageMeta.juzName} • صفحہ {currentPage}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleBookmark}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked ? 'text-[#e8c872] bg-[#e8c872]/20' : 'text-gray-300 hover:text-white'
            }`}
            title="بک مارک کریں"
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => setShowGotoModal(true)}
            className="p-1.5 text-gray-300 hover:text-white rounded-lg transition-colors"
            title="صفحہ پر جائیں"
          >
            <BookOpen className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Quran Mushaf Image Display Container */}
      <main
        className="flex-1 relative flex items-center justify-center overflow-hidden bg-[#0a1612] p-1 md:p-3 select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          // Allow clicking left/right 25% of screen to turn pages comfortably
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          if (clickX > rect.width * 0.75) {
            goPrevPage(); // Right side = پچھلا صفحہ
          } else if (clickX < rect.width * 0.25) {
            goNextPage(); // Left side = اگلا صفحہ
          }
        }}
      >
        {/* Beautiful Mushaf Skeleton — shown while page image loads */}
        {loading && !imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1612] z-10 p-4">
            {/* Skeleton page frame */}
            <div className="w-full max-w-[420px] rounded-xl overflow-hidden shadow-2xl border border-[#2d5a45]/40"
              style={{ maxHeight: 'calc(100vh - 140px)' }}>
              {/* Top Bismillah area skeleton */}
              <div className="bg-[#0e2a22] px-4 pt-5 pb-3 flex flex-col items-center gap-2">
                <div className="h-5 w-48 rounded-full bg-[#1b4a35] animate-pulse" />
                <div className="h-3 w-32 rounded-full bg-[#163d2b] animate-pulse" />
              </div>
              {/* Lines skeleton — mimics 16-line mushaf */}
              <div className="bg-[#0d2318] px-5 py-4 flex flex-col gap-3">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-3 rounded-full bg-[#1b4a35] animate-pulse"
                    style={{
                      width: `${i % 3 === 0 ? 70 : i % 3 === 1 ? 90 : 80}%`,
                      marginLeft: 'auto',
                      animationDelay: `${i * 60}ms`,
                      opacity: 0.5 + (i % 4) * 0.12,
                    }}
                  />
                ))}
              </div>
              {/* Bottom area skeleton */}
              <div className="bg-[#0e2a22] px-4 py-3 flex justify-between items-center">
                <div className="h-3 w-16 rounded-full bg-[#1b4a35] animate-pulse" />
                <div className="h-3 w-16 rounded-full bg-[#1b4a35] animate-pulse" />
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center gap-1">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#e8c872] animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
              <span className="text-xs text-emerald-400 mt-1 font-arabic">صفحہ {currentPage} لوڈ ہو رہا ہے</span>
            </div>
          </div>
        )}

        {/* Error Fallback */}
        {imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a1612] p-6 text-center z-10">
            <AlertCircle className="w-12 h-12 text-rose-400 mb-3" />
            <p className="text-base text-gray-200 mb-2 font-arabic">صفحہ لوڈ کرنے میں دشواری ہوئی</p>
            <p className="text-xs text-gray-400 mb-4">براہ کرم انٹرنیٹ کنکشن چیک کریں</p>
            <button
              onClick={() => {
                setImgError(false);
                setLoading(true);
                setSourceIndex(prev => prev + 1);
              }}
              className="flex items-center gap-2 bg-[#2d5a45] hover:bg-[#3d7a5d] text-white px-4 py-2 rounded-lg font-arabic text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>دوبارہ کوشش کریں</span>
            </button>
          </div>
        )}

        {/* Real 16-Line Scanned Mushaf Page Image */}
        <div className="w-full h-full max-w-[700px] flex items-center justify-center">
          <img
            key={`${currentPage}-${sourceIndex}`}
            src={getImageUrl(currentPage, sourceIndex)}
            alt={`16-Line Mushaf Page ${currentPage}`}
            className={`max-h-full max-w-full object-contain rounded-md shadow-2xl transition-opacity duration-200 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
            style={{
              maxHeight: 'calc(100vh - 125px)',
              filter: 'contrast(1.03) brightness(1.01)'
            }}
            onLoad={() => {
              loadedPagesRef.current.add(currentPage);
              setLoading(false);
              setImgLoaded(true);
            }}
            onError={() => {
              if (sourceIndex === 0) {
                // Try fallback raw github source
                setSourceIndex(1);
              } else {
                setLoading(false);
                setImgError(true);
              }
            }}
            draggable={false}
          />
        </div>
      </main>

      {/* Bottom Floating Navigation Bar - Authentic RTL Quran layout (Next Page on Left, Previous Page on Right) */}
      <footer className="flex-none bg-[#0e2a22] border-t border-[#2d5a45] px-4 py-2 flex items-center justify-between shadow-lg z-10" dir="ltr">
        {/* Next Page Button (on Left side for RTL Quran reading) */}
        <button
          onClick={goNextPage}
          disabled={currentPage >= MAX_PAGE}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            currentPage >= MAX_PAGE
              ? 'bg-[#1b3d30] text-gray-500 cursor-not-allowed'
              : 'bg-[#e8c872] text-[#0a1f18] hover:bg-[#f5da8e] active:scale-95 shadow'
          }`}
          title="اگلا صفحہ کھولیں"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="font-arabic">اگلا صفحہ</span>
        </button>

        {/* Center Page Indicator (Clickable to Go to Page) */}
        <button
          onClick={() => setShowGotoModal(true)}
          className="flex flex-col items-center px-3 py-0.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <span className="text-sm font-bold text-[#e8c872]">
            {currentPage} / {MAX_PAGE}
          </span>
          <span className="text-[10px] text-emerald-400 font-arabic">
            صفحہ نمبر بدلیں
          </span>
        </button>

        {/* Prev Page Button (on Right side for RTL Quran reading) */}
        <button
          onClick={goPrevPage}
          disabled={currentPage <= MIN_PAGE}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            currentPage <= MIN_PAGE
              ? 'bg-[#1b3d30] text-gray-500 cursor-not-allowed'
              : 'bg-[#2d5a45] text-white hover:bg-[#3b7359] active:scale-95'
          }`}
          title="پچھلا صفحہ کھولیں"
        >
          <span className="font-arabic">پچھلا صفحہ</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>

      {/* Go to Page Modal */}
      {showGotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#0e2a22] border border-[#2d5a45] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-bold text-[#e8c872] text-center mb-4 font-arabic">
              صفحہ نمبر منتخب کریں ({MIN_PAGE} تا {MAX_PAGE})
            </h3>
            <form onSubmit={handleGotoSubmit} className="space-y-4">
              <input
                type="number"
                min={MIN_PAGE}
                max={MAX_PAGE}
                placeholder={`صفحہ نمبر درج کریں (${currentPage})`}
                value={pageInput}
                onChange={e => setPageInput(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 bg-[#0a1f18] border border-[#2d5a45] rounded-xl text-center text-xl text-white font-bold focus:outline-none focus:border-[#e8c872]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowGotoModal(false);
                    setPageInput('');
                  }}
                  className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl font-arabic text-sm text-gray-200 transition-colors"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#e8c872] hover:bg-[#f5da8e] rounded-xl font-arabic font-bold text-sm text-[#0a1f18] transition-colors"
                >
                  صفحہ کھولیں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
