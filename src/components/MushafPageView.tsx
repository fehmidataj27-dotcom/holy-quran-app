import React, { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
import { ChevronRight, ChevronLeft, Bookmark, ZoomIn, ZoomOut, RotateCcw, ArrowLeft } from 'lucide-react';
import { formatTajweed } from '../utils/tajweed';
import { SURAH_LIST } from '../data/surahs';

interface MushafPageViewProps {
  initialPage?: number;
  onBack: () => void;
}

interface PageAyahRef {
  s: number; // surah number
  a: number; // ayah number
}

interface RenderedAyah {
  surahNumber: number;
  surahName: string;
  surahNameEn: string;
  surahType: string;
  ayahNumber: number;
  text: string;
  isFirstOfSurah: boolean;
  totalAyahs: number;
}

const LS_MUSHAF_PAGE = 'quran_mushaf_last_page';
const LS_MUSHAF_BOOKMARKS = 'quran_mushaf_page_bookmarks';

// Cache for loaded surah data
const surahCache: Record<number, Record<string, string>> = {};

async function loadSurahVerses(surahNum: number): Promise<Record<string, string>> {
  if (surahCache[surahNum]) return surahCache[surahNum];
  const res = await fetch(`/quran/${surahNum}.json`);
  const data = await res.json();
  surahCache[surahNum] = data.verse || {};
  return surahCache[surahNum];
}

// Convert to Eastern Arabic numerals
function toArabicNumerals(n: number): string {
  return n.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
}

// Approximate juz for a surah
function getJuzForSurah(surahNum: number): number {
  const juzMap: Record<number, number> = {
    1:1,2:1,3:3,4:4,5:6,6:7,7:8,8:10,9:10,10:11,
    11:12,12:12,13:13,14:13,15:14,16:14,17:15,18:15,
    19:16,20:16,21:17,22:17,23:18,24:18,25:18,26:19,
    27:19,28:20,29:20,30:21,31:21,32:21,33:21,34:22,
    35:22,36:22,37:23,38:23,39:23,40:24,41:24,42:25,
    43:25,44:25,45:25,46:26,47:26,48:26,49:26,50:26,
    51:26,52:27,53:27,54:27,55:27,56:27,57:27,58:28,
    59:28,60:28,61:28,62:28,63:28,64:28,65:28,66:28,
    67:29,68:29,69:29,70:29,71:29,72:29,73:29,74:29,
    75:29,76:29,77:29,78:30,79:30,80:30,81:30,82:30,
    83:30,84:30,85:30,86:30,87:30,88:30,89:30,90:30,
    91:30,92:30,93:30,94:30,95:30,96:30,97:30,98:30,
    99:30,100:30,101:30,102:30,103:30,104:30,105:30,
    106:30,107:30,108:30,109:30,110:30,111:30,112:30,
    113:30,114:30,
  };
  return juzMap[surahNum] || 1;
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

  const [pageMap, setPageMap] = useState<Record<string, PageAyahRef[]> | null>(null);
  const [pageAyahs, setPageAyahs] = useState<RenderedAyah[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [gotoInput, setGotoInput] = useState<string>('');
  const [showGoto, setShowGoto] = useState<boolean>(false);

  // Swipe state
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);
  const pageRef = useRef<HTMLDivElement>(null);

  // Load page_map.json once
  useEffect(() => {
    fetch('/quran/page_map.json')
      .then(r => r.json())
      .then(data => setPageMap(data))
      .catch(err => console.error('page_map load error', err));
  }, []);

  // Update page when prop changes
  useEffect(() => {
    if (initialPage >= 1 && initialPage <= 604) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  // Load ayahs for current page
  useEffect(() => {
    if (!pageMap) return;

    setIsLoading(true);
    const refs: PageAyahRef[] = pageMap[String(currentPage)] || [];

    if (refs.length === 0) {
      setPageAyahs([]);
      setIsLoading(false);
      return;
    }

    const surahNums = [...new Set(refs.map(r => r.s))];

    Promise.all(surahNums.map(loadSurahVerses))
      .then(results => {
        const versesByS: Record<number, Record<string, string>> = {};
        surahNums.forEach((s, i) => { versesByS[s] = results[i]; });

        const rendered: RenderedAyah[] = refs.map((ref, idx) => {
          const surahInfo = SURAH_LIST.find(s => s.number === ref.s);
          const prevRef = refs[idx - 1];
          const isFirstOfSurah = !prevRef || prevRef.s !== ref.s;

          return {
            surahNumber: ref.s,
            surahName: surahInfo?.name || `سورة ${ref.s}`,
            surahNameEn: surahInfo?.englishName || '',
            surahType: surahInfo?.revelationType || 'Meccan',
            ayahNumber: ref.a,
            text: versesByS[ref.s]?.[`verse_${ref.a}`] || '',
            isFirstOfSurah,
            totalAyahs: surahInfo?.numberOfAyahs || 0,
          };
        });

        setPageAyahs(rendered);
        setIsLoading(false);

        try { localStorage.setItem(LS_MUSHAF_PAGE, String(currentPage)); } catch {}

        try {
          const bm = localStorage.getItem(LS_MUSHAF_BOOKMARKS);
          const pages: number[] = bm ? JSON.parse(bm) : [];
          setIsBookmarked(pages.includes(currentPage));
        } catch {}

        // Scroll page content to top
        pageRef.current?.scrollTo({ top: 0 });
      })
      .catch(() => setIsLoading(false));
  }, [currentPage, pageMap]);

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
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // If horizontal swipe is dominant, mark as swiping
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (!isSwiping.current) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    // RTL: swipe right = previous page, swipe left = next page
    if (Math.abs(dx) > 50) {
      if (dx > 0) {
        // Swipe right → previous page (in RTL context)
        goToPage(currentPage - 1);
      } else {
        // Swipe left → next page
        goToPage(currentPage + 1);
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

  // Figure out juz for top header
  const topJuz = pageAyahs.length > 0 ? getJuzForSurah(pageAyahs[0].surahNumber) : 1;
  const bottomJuz = pageAyahs.length > 0 ? getJuzForSurah(pageAyahs[pageAyahs.length - 1].surahNumber) : 1;

  // Top surah names for header
  const topSurahName = pageAyahs.length > 0 ? pageAyahs[pageAyahs.length - 1].surahName : '';
  const topSurahNum = pageAyahs.length > 0 ? pageAyahs[pageAyahs.length - 1].surahNumber : 1;

  return (
    <div
      className="flex flex-col h-screen bg-[#2c1810] text-white select-none"
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
          <p className="text-[#d4af37] text-xs font-bold">{topSurahName}</p>
          <p className="text-slate-400 text-[9px]">16 سطری تجویدی مصحف</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={() => setScale(s => Math.max(0.75, +(s - 0.1).toFixed(1)))} className="p-1 text-slate-400 hover:text-[#d4af37]">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={() => setScale(1)} className="p-1 text-slate-400 hover:text-[#d4af37]">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setScale(s => Math.min(1.5, +(s + 0.1).toFixed(1)))} className="p-1 text-slate-400 hover:text-[#d4af37]">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={toggleBookmark} className={`p-1 ${isBookmarked ? 'text-[#d4af37]' : 'text-slate-400 hover:text-[#d4af37]'}`}>
            <Bookmark className="w-4 h-4" fill={isBookmarked ? '#d4af37' : 'none'} />
          </button>
        </div>
      </div>

      {/* Mushaf Page Content */}
      <div
        ref={pageRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
      >
        {isLoading || !pageMap ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-8 h-8 border-4 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">صفحہ لوڈ ہو رہا ہے...</p>
          </div>
        ) : (
          <div
            className="mx-2 my-2"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
          >
            {/* Mushaf Page - Cream paper style */}
            <div
              className="bg-[#fdf6e3] rounded-lg shadow-2xl overflow-hidden"
              style={{
                border: '2px solid #8B6914',
                boxShadow: '0 0 0 1px #d4af37, 0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              {/* Page top info bar */}
              <div
                className="flex items-center justify-between px-3 py-1"
                style={{ borderBottom: '1px solid #c9a84c', background: 'linear-gradient(to bottom, #f5e6c0, #f0dba0)' }}
              >
                <span className="text-[#5C3317] text-[10px] font-bold" style={{ fontFamily: 'serif' }}>
                  {topJuz !== bottomJuz
                    ? `${toArabicNumerals(topJuz)} جزء`
                    : `الجزء ${toArabicNumerals(topJuz)}`}
                </span>
                <span className="text-[#5C3317] text-[10px] font-bold" style={{ fontFamily: 'serif' }}>
                  {topSurahName}
                </span>
              </div>

              {/* Actual Quran Text Area */}
              <div className="px-3 pt-3 pb-2">
                {/* Render as continuous inline text — real mushaf style */}
                <div
                  className="text-right leading-[2.6]"
                  dir="rtl"
                  style={{
                    fontFamily: '"PDMS_Saleem_QuranFont", "Scheherazade New", "me_quran", "Noto Naskh Arabic", serif',
                    fontSize: `${1.18 * scale}rem`,
                    color: '#1a0a00',
                    wordSpacing: '0.05em',
                  }}
                >
                  {pageAyahs.map((ayah, idx) => (
                    <React.Fragment key={`${ayah.surahNumber}-${ayah.ayahNumber}`}>

                      {/* Surah header — only when this page starts with the first ayah of a new surah */}
                      {ayah.isFirstOfSurah && ayah.ayahNumber === 1 && (
                        <div className="block mb-2 mt-1" style={{ direction: 'rtl' }}>
                          {/* Surah name box */}
                          <div
                            className="text-center py-1.5 mx-2 rounded"
                            style={{
                              border: '1.5px solid #8B6914',
                              background: 'linear-gradient(to bottom, #fdf0c0, #f5e090)',
                            }}
                          >
                            <div className="flex items-center justify-between px-3 text-[9px] text-[#5C3317]">
                              <span>{ayah.surahType === 'Meccan' ? 'مکیہ' : 'مدنیہ'}</span>
                              <span>آیات {toArabicNumerals(ayah.totalAyahs)}</span>
                            </div>
                            <p
                              className="text-[#2c0a00] font-bold"
                              style={{ fontSize: '1rem', fontFamily: 'serif' }}
                            >
                              سُوْرَةُ {ayah.surahName}
                            </p>
                          </div>

                          {/* Bismillah — only at start of surah, not surah 9 */}
                          {ayah.surahNumber !== 9 && (
                            <div
                              className="text-center py-2 mt-1.5 mx-1 rounded"
                              style={{
                                border: '1px solid #c9a84c',
                                background: '#fdf8f0',
                              }}
                            >
                              <span
                                style={{
                                  fontFamily: '"PDMS_Saleem_QuranFont", "Scheherazade New", serif',
                                  fontSize: '1.15rem',
                                  color: '#2c0a00',
                                }}
                              >
                                بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Inline ayah text + number circle */}
                      <span
                        dangerouslySetInnerHTML={{ __html: formatTajweed(ayah.text) }}
                        style={{ display: 'inline' }}
                      />
                      {/* Ayah number circle - inline */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '1.4em',
                          height: '1.4em',
                          borderRadius: '50%',
                          border: '1.5px solid #8B6914',
                          background: 'rgba(212,175,55,0.15)',
                          color: '#5C3317',
                          fontSize: '0.55em',
                          fontWeight: 'bold',
                          margin: '0 0.15em',
                          verticalAlign: 'middle',
                          fontFamily: 'serif',
                          lineHeight: 1,
                        }}
                      >
                        {toArabicNumerals(ayah.ayahNumber)}
                      </span>
                      {' '}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Page bottom bar */}
              <div
                className="flex items-center justify-between px-3 py-1"
                style={{ borderTop: '1px solid #c9a84c', background: 'linear-gradient(to top, #f5e6c0, #f0dba0)' }}
              >
                <span className="text-[#5C3317] text-[10px] font-bold">
                  {currentPage % 2 === 0 ? `${currentPage}` : ''}
                </span>
                <span className="text-[#5C3317] text-[10px]" style={{ fontFamily: 'serif' }}>
                  {pageAyahs.length > 0 && pageAyahs[pageAyahs.length - 1].ayahNumber < pageAyahs[pageAyahs.length - 1].totalAyahs
                    ? `منزل ${toArabicNumerals(Math.ceil(pageAyahs[0].surahNumber / 16))}`
                    : ''}
                </span>
                <span className="text-[#5C3317] text-[10px] font-bold">
                  {currentPage % 2 !== 0 ? `${currentPage}` : ''}
                </span>
              </div>
            </div>

            {/* Swipe hint */}
            <p className="text-center text-slate-500 text-[9px] mt-1 mb-1">
              ← انگلی سے سوائپ کریں یا نیچے کے بٹن دبائیں →
            </p>
          </div>
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
              placeholder="صفحہ نمبر (1-604)"
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
          {/* اگلا صفحہ — Next */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= 604}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#d4af37] text-[#1a3a2a] rounded-xl font-bold text-sm disabled:opacity-40 hover:bg-[#c09a2f] transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            اگلا صفحہ
          </button>

          {/* Page number - tap to go to page */}
          <button
            onClick={() => setShowGoto(v => !v)}
            className="flex-1 py-2 bg-[#0d1117]/60 rounded-xl border border-[#d4af37]/20 text-center hover:border-[#d4af37]/50 transition-all"
          >
            <span className="text-[#d4af37] font-bold text-sm">
              {currentPage} / 604
            </span>
          </button>

          {/* پچھلا صفحہ — Previous */}
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
