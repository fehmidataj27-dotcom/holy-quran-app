import React, { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
import { ChevronRight, ChevronLeft, Bookmark, ZoomIn, ZoomOut, RotateCcw, Loader2 } from 'lucide-react';

interface MushafPageViewProps {
  initialPage?: number;
  onBack: () => void;
}

const LS_MUSHAF_PAGE = 'quran_mushaf_last_page';
const LS_MUSHAF_BOOKMARKS = 'quran_mushaf_page_bookmarks';

// Format page number with leading zeros (e.g. 1 -> "001", 50 -> "050", 604 -> "604")
function getPaddedPage(page: number): string {
  return String(page).padStart(3, '0');
}

// CDNs providing real Mushaf page images (604 pages)
const getCdnUrl = (page: number, sourceIndex: number): string => {
  const padded = getPaddedPage(page);
  switch (sourceIndex) {
    case 0:
      // High-res Maknoon Mushaf transparent vector PNG
      return `https://raw.githubusercontent.com/maknon/Quran/main/pages-hafs/${padded}.png`;
    case 1:
      // GovarJabbar Quran-PNG
      return `https://raw.githubusercontent.com/GovarJabbar/Quran-PNG/master/${padded}.png`;
    case 2:
      // King Saud University Quran pages
      return `https://quran.ksu.edu.sa/ayat/safahat1/${page}.png`;
    default:
      return `https://raw.githubusercontent.com/maknon/Quran/main/pages-hafs/${padded}.png`;
  }
};

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
  { surah: 108, page: 602, name: 'الکوثر' },
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

  const [cdnIndex, setCdnIndex] = useState<number>(0);
  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const [imgError, setImgError] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [showGoto, setShowGoto] = useState<boolean>(false);
  const [gotoInput, setGotoInput] = useState<string>('');
  const [scale, setScale] = useState<number>(1);

  // Touch/swipe handling
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  // Preload adjacent pages
  const preloadedImgs = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    if (initialPage >= 1 && initialPage <= 604) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  useEffect(() => {
    setImgLoading(true);
    setImgError(false);
    setCdnIndex(0);

    // Save last page
    try { localStorage.setItem(LS_MUSHAF_PAGE, String(currentPage)); } catch {}

    // Check bookmark
    try {
      const bm = localStorage.getItem(LS_MUSHAF_BOOKMARKS);
      const pages: number[] = bm ? JSON.parse(bm) : [];
      setIsBookmarked(pages.includes(currentPage));
    } catch {}

    // Preload next and previous pages for instantaneous swipe
    preloadedImgs.current = [];
    [-1, 1].forEach(offset => {
      const p = currentPage + offset;
      if (p >= 1 && p <= 604) {
        const img = new Image();
        img.src = getCdnUrl(p, 0);
        preloadedImgs.current.push(img);
      }
    });
  }, [currentPage]);

  const goToPage = useCallback((page: number) => {
    const p = Math.max(1, Math.min(604, page));
    setCurrentPage(p);
  }, []);

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
    if (Math.abs(dx) > 50) {
      // In RTL Arabic reading:
      // Swipe Right (moves finger left to right) -> Previous Page (پچھلا صفحہ)
      // Swipe Left (moves finger right to left) -> Next Page (اگلا صفحہ)
      if (dx > 0) {
        goToPage(currentPage - 1);
      } else {
        goToPage(currentPage + 1);
      }
    }
    isSwiping.current = false;
  };

  const handleImageError = () => {
    // If primary CDN fails, try fallback CDN
    if (cdnIndex < 2) {
      setCdnIndex(prev => prev + 1);
      setImgLoading(true);
    } else {
      setImgError(true);
      setImgLoading(false);
    }
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

  const surahName = getSurahForPage(currentPage);
  const juzNum = getJuzForPage(currentPage);
  const currentImageUrl = getCdnUrl(currentPage, cdnIndex);

  return (
    <div
      className="flex flex-col h-screen bg-[#111827] overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header */}
      <div className="flex-shrink-0 bg-[#0f2a1d] px-3 py-2 flex items-center justify-between border-b border-[#d4af37]/30 shadow-md">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[#d4af37] text-sm px-2.5 py-1 rounded-lg bg-black/20 hover:bg-[#d4af37]/15 border border-[#d4af37]/20 transition-all"
        >
          <ChevronRight className="w-4 h-4" />
          <span>مینو</span>
        </button>

        <div className="text-center">
          <p className="text-[#d4af37] text-sm font-bold tracking-wide" dir="rtl">{surahName}</p>
          <p className="text-emerald-300/80 text-[10px]">
            الجزء {toArabicNumerals(juzNum)} • صفحہ {toArabicNumerals(currentPage)}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale(s => Math.max(0.8, +(s - 0.1).toFixed(1)))}
            className="p-1.5 text-slate-400 hover:text-[#d4af37] transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale(1)}
            className="p-1.5 text-slate-400 hover:text-[#d4af37] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale(s => Math.min(1.4, +(s + 0.1).toFixed(1)))}
            className="p-1.5 text-slate-400 hover:text-[#d4af37] transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={toggleBookmark}
            className={`p-1.5 transition-colors ${isBookmarked ? 'text-[#d4af37]' : 'text-slate-400 hover:text-[#d4af37]'}`}
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? '#d4af37' : 'none'} />
          </button>
        </div>
      </div>

      {/* Main Mushaf Page Display with Authentic Parchment Canvas */}
      <div className="flex-1 overflow-auto relative bg-[#1c1917] flex items-center justify-center p-1 md:p-3">
        {imgLoading && !imgError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20 bg-[#1c1917]/70 backdrop-blur-sm">
            <Loader2 className="w-9 h-9 animate-spin text-[#d4af37]" />
            <p className="text-[#d4af37] text-xs font-medium">مصحف صفحہ {currentPage} لوڈ ہو رہا ہے...</p>
          </div>
        )}

        {imgError ? (
          <div className="flex flex-col items-center justify-center gap-3 p-6 text-center z-10">
            <div className="w-16 h-16 rounded-full bg-[#0f2a1d] flex items-center justify-center border border-[#d4af37]/40 shadow-lg">
              <span className="text-2xl">📖</span>
            </div>
            <p className="text-slate-200 text-sm font-semibold">صفحہ {currentPage} لوڈ نہ ہو سکا</p>
            <p className="text-slate-400 text-xs">براہ کرم انٹرنیٹ کنکشن چیک کریں</p>
            <button
              onClick={() => { setCdnIndex(0); setImgError(false); setImgLoading(true); }}
              className="mt-2 px-5 py-2 bg-[#d4af37] text-[#0f2a1d] rounded-xl text-xs font-bold hover:bg-[#c59f2e] transition-all shadow-md"
            >
              دوبارہ کوشش کریں
            </button>
          </div>
        ) : (
          <div
            className="relative w-full h-full flex items-center justify-center transition-transform duration-150"
            style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
          >
            {/* Real Quran Page Frame - Classic Cream Islamic Background */}
            <div
              className="relative max-h-full max-w-full flex items-center justify-center rounded-lg shadow-2xl p-1 sm:p-2.5"
              style={{
                backgroundColor: '#fffdf5',
                boxShadow: '0 10px 40px rgba(0,0,0,0.8), inset 0 0 10px rgba(180,140,60,0.15)',
              }}
            >
              <img
                key={`${currentPage}-${cdnIndex}`}
                src={currentImageUrl}
                alt={`مصحف صفحہ ${currentPage}`}
                className="max-h-[82vh] w-auto max-w-full object-contain rounded"
                style={{
                  display: imgLoading ? 'none' : 'block',
                  filter: 'contrast(1.03)',
                }}
                onLoad={() => {
                  setImgLoading(false);
                  setImgError(false);
                }}
                onError={handleImageError}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Bar & Navigation */}
      <div className="flex-shrink-0 bg-[#0f2a1d] border-t border-[#d4af37]/30 px-3 py-2 shadow-lg">
        {showGoto && (
          <form onSubmit={handleGotoSubmit} className="flex gap-2 mb-2 max-w-md mx-auto">
            <input
              type="number"
              min={1}
              max={604}
              value={gotoInput}
              onChange={e => setGotoInput(e.target.value)}
              placeholder="صفحہ نمبر درج کریں (1-604)"
              className="flex-1 bg-black/40 border border-[#d4af37]/40 rounded-xl px-3 py-1.5 text-white text-sm text-right placeholder-slate-400 focus:outline-none focus:border-[#d4af37]"
              autoFocus
              dir="rtl"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#d4af37] text-[#0f2a1d] rounded-xl text-xs font-bold hover:bg-[#c59f2e] transition-all"
            >
              کھولیں
            </button>
            <button
              type="button"
              onClick={() => setShowGoto(false)}
              className="px-3 py-1.5 bg-slate-700/80 text-slate-300 rounded-xl text-xs hover:bg-slate-700"
            >
              ✕
            </button>
          </form>
        )}

        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          {/* اگلا صفحہ (Next Page) */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= 604}
            className="flex items-center gap-1 px-4 py-2 bg-[#d4af37] text-[#0f2a1d] rounded-xl font-bold text-xs disabled:opacity-30 disabled:pointer-events-none hover:bg-[#c59f2e] transition-all active:scale-95 shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>اگلا صفحہ</span>
          </button>

          {/* Quick Page Picker Button */}
          <button
            onClick={() => setShowGoto(v => !v)}
            className="flex-1 py-1.5 bg-black/30 hover:bg-black/40 rounded-xl border border-[#d4af37]/30 text-center transition-all shadow-inner"
          >
            <span className="text-[#d4af37] font-bold text-xs block">
              {currentPage} / 604
            </span>
            <span className="text-emerald-300/60 text-[9px] block">
              صفحہ بدلنے کے لیے دبائیں
            </span>
          </button>

          {/* پچھلا صفحہ (Previous Page) */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-4 py-2 bg-[#1b4332] text-[#d4af37] rounded-xl font-bold text-xs border border-[#d4af37]/40 disabled:opacity-30 disabled:pointer-events-none hover:bg-[#245943] transition-all active:scale-95 shadow-md"
          >
            <span>پچھلا صفحہ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MushafPageView;
