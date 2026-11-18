import React, { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
import { ChevronRight, ChevronLeft, Bookmark, ZoomIn, ZoomOut, RotateCcw, Loader2 } from 'lucide-react';
import { SURAH_LIST } from '../data/surahs';

interface MushafPageViewProps {
  initialPage?: number;
  onBack: () => void;
}

const LS_MUSHAF_PAGE = 'quran_mushaf_last_page';
const LS_MUSHAF_BOOKMARKS = 'quran_mushaf_page_bookmarks';

// Quran page image CDN — authentic 16-line tajweed mushaf (604 pages)
// Primary: Islamic Network high-resolution images
// Fallback: alternate CDN
const getPageImageUrl = (page: number): string => {
  return `https://cdn.islamic.network/quran/images/high-resolution/${page}.png`;
};

const getFallbackImageUrl = (page: number): string => {
  // Alternate source
  return `https://www.searchtruth.com/quran/images/quran-page-${page}.jpg`;
};

// Surah name for a given page number (approximate lookup)
const SURAH_PAGE_STARTS: Array<{ surah: number; page: number; name: string }> = [
  { surah: 1, page: 1, name: 'الفاتحة' },
  { surah: 2, page: 2, name: 'البقرة' },
  { surah: 3, page: 50, name: 'آل عمران' },
  { surah: 4, page: 77, name: 'النساء' },
  { surah: 5, page: 106, name: 'المائدة' },
  { surah: 6, page: 128, name: 'الأنعام' },
  { surah: 7, page: 151, name: 'الأعراف' },
  { surah: 8, page: 177, name: 'الأنفال' },
  { surah: 9, page: 187, name: 'التوبة' },
  { surah: 10, page: 208, name: 'يونس' },
  { surah: 11, page: 221, name: 'هود' },
  { surah: 12, page: 235, name: 'يوسف' },
  { surah: 13, page: 249, name: 'الرعد' },
  { surah: 14, page: 255, name: 'إبراهيم' },
  { surah: 15, page: 262, name: 'الحجر' },
  { surah: 16, page: 267, name: 'النحل' },
  { surah: 17, page: 282, name: 'الإسراء' },
  { surah: 18, page: 293, name: 'الكهف' },
  { surah: 19, page: 305, name: 'مريم' },
  { surah: 20, page: 312, name: 'طه' },
  { surah: 21, page: 322, name: 'الأنبياء' },
  { surah: 22, page: 332, name: 'الحج' },
  { surah: 23, page: 342, name: 'المؤمنون' },
  { surah: 24, page: 350, name: 'النور' },
  { surah: 25, page: 359, name: 'الفرقان' },
  { surah: 26, page: 367, name: 'الشعراء' },
  { surah: 27, page: 377, name: 'النمل' },
  { surah: 28, page: 385, name: 'القصص' },
  { surah: 29, page: 396, name: 'العنكبوت' },
  { surah: 30, page: 404, name: 'الروم' },
  { surah: 31, page: 411, name: 'لقمان' },
  { surah: 32, page: 415, name: 'السجدة' },
  { surah: 33, page: 418, name: 'الأحزاب' },
  { surah: 34, page: 428, name: 'سبإ' },
  { surah: 35, page: 434, name: 'فاطر' },
  { surah: 36, page: 440, name: 'يس' },
  { surah: 37, page: 446, name: 'الصافات' },
  { surah: 38, page: 453, name: 'ص' },
  { surah: 39, page: 458, name: 'الزمر' },
  { surah: 40, page: 467, name: 'غافر' },
  { surah: 41, page: 477, name: 'فصلت' },
  { surah: 42, page: 483, name: 'الشورى' },
  { surah: 43, page: 489, name: 'الزخرف' },
  { surah: 44, page: 496, name: 'الدخان' },
  { surah: 45, page: 499, name: 'الجاثية' },
  { surah: 46, page: 502, name: 'الأحقاف' },
  { surah: 47, page: 507, name: 'محمد' },
  { surah: 48, page: 511, name: 'الفتح' },
  { surah: 49, page: 515, name: 'الحجرات' },
  { surah: 50, page: 518, name: 'ق' },
  { surah: 51, page: 520, name: 'الذاريات' },
  { surah: 52, page: 523, name: 'الطور' },
  { surah: 53, page: 526, name: 'النجم' },
  { surah: 54, page: 528, name: 'القمر' },
  { surah: 55, page: 531, name: 'الرحمن' },
  { surah: 56, page: 534, name: 'الواقعة' },
  { surah: 57, page: 537, name: 'الحديد' },
  { surah: 58, page: 542, name: 'المجادلة' },
  { surah: 59, page: 545, name: 'الحشر' },
  { surah: 60, page: 549, name: 'الممتحنة' },
  { surah: 61, page: 551, name: 'الصف' },
  { surah: 62, page: 553, name: 'الجمعة' },
  { surah: 63, page: 554, name: 'المنافقون' },
  { surah: 64, page: 556, name: 'التغابن' },
  { surah: 65, page: 558, name: 'الطلاق' },
  { surah: 66, page: 560, name: 'التحريم' },
  { surah: 67, page: 562, name: 'الملك' },
  { surah: 68, page: 564, name: 'القلم' },
  { surah: 69, page: 566, name: 'الحاقة' },
  { surah: 70, page: 568, name: 'المعارج' },
  { surah: 71, page: 570, name: 'نوح' },
  { surah: 72, page: 572, name: 'الجن' },
  { surah: 73, page: 574, name: 'المزمل' },
  { surah: 74, page: 575, name: 'المدثر' },
  { surah: 75, page: 577, name: 'القيامة' },
  { surah: 76, page: 578, name: 'الإنسان' },
  { surah: 77, page: 580, name: 'المرسلات' },
  { surah: 78, page: 582, name: 'النبأ' },
  { surah: 79, page: 583, name: 'النازعات' },
  { surah: 80, page: 585, name: 'عبس' },
  { surah: 81, page: 586, name: 'التكوير' },
  { surah: 82, page: 587, name: 'الانفطار' },
  { surah: 83, page: 587, name: 'المطففين' },
  { surah: 84, page: 589, name: 'الانشقاق' },
  { surah: 85, page: 590, name: 'البروج' },
  { surah: 86, page: 591, name: 'الطارق' },
  { surah: 87, page: 591, name: 'الأعلى' },
  { surah: 88, page: 592, name: 'الغاشية' },
  { surah: 89, page: 593, name: 'الفجر' },
  { surah: 90, page: 594, name: 'البلد' },
  { surah: 91, page: 595, name: 'الشمس' },
  { surah: 92, page: 595, name: 'الليل' },
  { surah: 93, page: 596, name: 'الضحى' },
  { surah: 94, page: 596, name: 'الشرح' },
  { surah: 95, page: 597, name: 'التين' },
  { surah: 96, page: 597, name: 'العلق' },
  { surah: 97, page: 598, name: 'القدر' },
  { surah: 98, page: 598, name: 'البينة' },
  { surah: 99, page: 599, name: 'الزلزلة' },
  { surah: 100, page: 599, name: 'العاديات' },
  { surah: 101, page: 600, name: 'القارعة' },
  { surah: 102, page: 600, name: 'التكاثر' },
  { surah: 103, page: 601, name: 'العصر' },
  { surah: 104, page: 601, name: 'الهمزة' },
  { surah: 105, page: 601, name: 'الفيل' },
  { surah: 106, page: 602, name: 'قريش' },
  { surah: 107, page: 602, name: 'الماعون' },
  { surah: 108, page: 602, name: 'الكوثر' },
  { surah: 109, page: 603, name: 'الكافرون' },
  { surah: 110, page: 603, name: 'النصر' },
  { surah: 111, page: 603, name: 'المسد' },
  { surah: 112, page: 604, name: 'الإخلاص' },
  { surah: 113, page: 604, name: 'الفلق' },
  { surah: 114, page: 604, name: 'الناس' },
];

function getSurahForPage(page: number): string {
  let name = 'القرآن الكريم';
  for (let i = 0; i < SURAH_PAGE_STARTS.length; i++) {
    if (SURAH_PAGE_STARTS[i].page <= page) {
      name = SURAH_PAGE_STARTS[i].name;
    } else {
      break;
    }
  }
  return name;
}

function getJuzForPage(page: number): number {
  // Each juz is roughly 20 pages
  return Math.min(30, Math.max(1, Math.ceil(page / 20)));
}

function toArabicNumerals(n: number): string {
  return n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
}

export const MushafPageView: React.FC<MushafPageViewProps> = ({
  initialPage = 1,
  onBack,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (initialPage > 1) return initialPage;
    try {
      const saved = Number(localStorage.getItem(LS_MUSHAF_PAGE));
      if (saved >= 1 && saved <= 604) return saved;
    } catch {}
    return initialPage;
  });

  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const [imgError, setImgError] = useState<boolean>(false);
  const [useFallback, setUseFallback] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [showGoto, setShowGoto] = useState<boolean>(false);
  const [gotoInput, setGotoInput] = useState<string>('');

  // Swipe / touch state
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  // Preload next & prev pages for smooth navigation
  const preloadRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    if (initialPage >= 1 && initialPage <= 604) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  // Reset image state on page change
  useEffect(() => {
    setImgLoading(true);
    setImgError(false);
    setUseFallback(false);

    // Save last page
    try { localStorage.setItem(LS_MUSHAF_PAGE, String(currentPage)); } catch {}

    // Check bookmark
    try {
      const bm = localStorage.getItem(LS_MUSHAF_BOOKMARKS);
      const pages: number[] = bm ? JSON.parse(bm) : [];
      setIsBookmarked(pages.includes(currentPage));
    } catch {}

    // Preload adjacent pages
    preloadRef.current = [];
    [-1, 1, 2].forEach(offset => {
      const p = currentPage + offset;
      if (p >= 1 && p <= 604) {
        const img = new Image();
        img.src = getPageImageUrl(p);
        preloadRef.current.push(img);
      }
    });
  }, [currentPage]);

  const goToPage = useCallback((page: number) => {
    const p = Math.max(1, Math.min(604, page));
    setCurrentPage(p);
  }, []);

  // Touch swipe handlers
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (dx > dy && dx > 15) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (!isSwiping.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 60) {
      // RTL: swipe right → previous page, swipe left → next page
      if (dx > 0) {
        goToPage(currentPage - 1); // swipe right = prev (پچھلا)
      } else {
        goToPage(currentPage + 1); // swipe left = next (اگلا)
      }
    }
    isSwiping.current = false;
  };

  const toggleBookmark = () => {
    try {
      const bm = localStorage.getItem(LS_MUSHAF_BOOKMARKS);
      let pages: number[] = bm ? JSON.parse(bm) : [];
      if (pages.includes(currentPage)) {
        pages = pages.filter(p => p !== currentPage);
        setIsBookmarked(false);
      } else {
        pages = [currentPage, ...pages];
        setIsBookmarked(true);
      }
      localStorage.setItem(LS_MUSHAF_BOOKMARKS, JSON.stringify(pages));
    } catch {}
  };

  const handleGotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseInt(gotoInput);
    if (n >= 1 && n <= 604) {
      goToPage(n);
      setShowGoto(false);
      setGotoInput('');
    }
  };

  const handleImgError = () => {
    if (!useFallback) {
      setUseFallback(true);
      setImgLoading(true);
    } else {
      setImgError(true);
      setImgLoading(false);
    }
  };

  const currentImageUrl = useFallback
    ? getFallbackImageUrl(currentPage)
    : getPageImageUrl(currentPage);

  const surahName = getSurahForPage(currentPage);
  const juzNum = getJuzForPage(currentPage);

  return (
    <div
      className="flex flex-col h-screen bg-[#0d1117] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar */}
      <div className="flex-shrink-0 bg-[#1a3a2a] px-3 py-1.5 flex items-center justify-between border-b border-[#d4af37]/30">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[#d4af37] text-sm px-2 py-1 rounded-lg hover:bg-[#d4af37]/10 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
          <span>مینو</span>
        </button>

        <div className="text-center">
          <p className="text-[#d4af37] text-xs font-bold" dir="rtl">{surahName}</p>
          <p className="text-slate-400 text-[9px]">الجزء {toArabicNumerals(juzNum)} • صفحہ {toArabicNumerals(currentPage)}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleBookmark}
            className={`p-1.5 transition-colors ${isBookmarked ? 'text-[#d4af37]' : 'text-slate-400 hover:text-[#d4af37]'}`}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? '#d4af37' : 'none'} />
          </button>
        </div>
      </div>

      {/* Page Image Area */}
      <div className="flex-1 overflow-hidden relative bg-[#1a1a1a] flex items-center justify-center">
        {imgLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
            <p className="text-slate-400 text-sm">صفحہ لوڈ ہو رہا ہے...</p>
          </div>
        )}

        {imgError ? (
          /* Fallback text rendering if images not available */
          <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a3a2a] flex items-center justify-center">
              <span className="text-2xl">📖</span>
            </div>
            <p className="text-slate-300 text-sm">
              صفحہ {currentPage} لوڈ نہ ہو سکا
            </p>
            <p className="text-slate-500 text-xs">انٹرنیٹ کنیکشن چیک کریں</p>
            <button
              onClick={() => { setImgError(false); setImgLoading(true); setUseFallback(false); }}
              className="px-4 py-2 bg-[#d4af37] text-[#1a3a2a] rounded-lg text-sm font-bold"
            >
              دوبارہ کوشش کریں
            </button>
          </div>
        ) : (
          <img
            key={`${currentPage}-${useFallback}`}
            src={currentImageUrl}
            alt={`صفحہ ${currentPage}`}
            className="max-w-full max-h-full object-contain"
            style={{
              display: imgLoading ? 'none' : 'block',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            onLoad={() => setImgLoading(false)}
            onError={handleImgError}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex-shrink-0 bg-[#1a3a2a] border-t border-[#d4af37]/30 px-3 py-2">
        {showGoto && (
          <form onSubmit={handleGotoSubmit} className="flex gap-2 mb-2">
            <input
              type="number"
              min={1}
              max={604}
              value={gotoInput}
              onChange={e => setGotoInput(e.target.value)}
              placeholder="صفحہ نمبر 1-604"
              className="flex-1 bg-[#0d1117] border border-[#d4af37]/40 rounded-lg px-3 py-1.5 text-white text-sm text-right placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
              autoFocus
              dir="rtl"
            />
            <button type="submit" className="px-4 py-1.5 bg-[#d4af37] text-[#1a3a2a] rounded-lg text-sm font-bold hover:bg-[#c09a2f]">
              جائیں
            </button>
            <button type="button" onClick={() => setShowGoto(false)} className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-sm">
              ✕
            </button>
          </form>
        )}

        <div className="flex items-center justify-between gap-2">
          {/* اگلا صفحہ */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= 604}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#d4af37] text-[#1a3a2a] rounded-xl font-bold text-sm disabled:opacity-40 hover:bg-[#c09a2f] transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            اگلا صفحہ
          </button>

          {/* Page counter */}
          <button
            onClick={() => setShowGoto(v => !v)}
            className="flex-1 py-2 bg-[#0d1117]/60 rounded-xl border border-[#d4af37]/20 text-center hover:border-[#d4af37]/50 transition-all"
          >
            <span className="text-[#d4af37] font-bold text-sm">
              {currentPage} / 604
            </span>
          </button>

          {/* پچھلا صفحہ */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1a3a2a] text-[#d4af37] rounded-xl font-bold text-sm border border-[#d4af37]/30 disabled:opacity-40 hover:bg-[#243d2f] transition-all active:scale-95"
          >
            پچھلا صفحہ
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MushafPageView;
