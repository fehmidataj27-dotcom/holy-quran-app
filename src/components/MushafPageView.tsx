import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, ChevronLeft, Bookmark, ZoomIn, ZoomOut, RotateCcw, Menu } from 'lucide-react';
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
  juzNumber?: number;
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

export const MushafPageView: React.FC<MushafPageViewProps> = ({
  initialPage = 1,
  onBack,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(() => {
    // Check localStorage for last page, but prefer initialPage if explicitly set > 1
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
  const contentRef = useRef<HTMLDivElement>(null);

  // Load page_map.json once
  useEffect(() => {
    fetch('/quran/page_map.json')
      .then(r => r.json())
      .then(data => setPageMap(data))
      .catch(err => console.error('page_map load error', err));
  }, []);

  // Update page when prop changes (from parent navigation)
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

    // Get unique surahs needed
    const surahNums = [...new Set(refs.map(r => r.s))];

    Promise.all(surahNums.map(loadSurahVerses))
      .then(results => {
        const versesByS: Record<number, Record<string, string>> = {};
        surahNums.forEach((s, i) => { versesByS[s] = results[i]; });

        const rendered: RenderedAyah[] = refs.map(ref => {
          const surahInfo = SURAH_LIST.find(s => s.number === ref.s);
          const prevRef = refs[refs.indexOf(ref) - 1];
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

        // Save last page
        try { localStorage.setItem(LS_MUSHAF_PAGE, String(currentPage)); } catch {}

        // Check bookmark
        try {
          const bm = localStorage.getItem(LS_MUSHAF_BOOKMARKS);
          const pages: number[] = bm ? JSON.parse(bm) : [];
          setIsBookmarked(pages.includes(currentPage));
        } catch {}

        // Scroll to top
        setTimeout(() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 50);
      })
      .catch(err => {
        console.error('Error loading page ayahs', err);
        setIsLoading(false);
      });
  }, [currentPage, pageMap]);

  const goToPage = useCallback((page: number) => {
    const p = Math.max(1, Math.min(604, page));
    setCurrentPage(p);
  }, []);

  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

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

  // Figure out current surah(s) for header display
  const currentSurahName = pageAyahs.length > 0
    ? pageAyahs[pageAyahs.length - 1].surahName
    : '';
  const headerSurahInfo = pageAyahs.length > 0
    ? `${pageAyahs[0].surahName}${pageAyahs[0].surahNumber !== pageAyahs[pageAyahs.length - 1].surahNumber ? ' — ' + pageAyahs[pageAyahs.length - 1].surahName : ''}`
    : '';

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-white overflow-hidden">

      {/* Top Header */}
      <div className="flex-shrink-0 bg-[#1a3a2a] border-b border-[#d4af37]/30 px-3 py-2">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 bg-[#0d1117]/60 px-3 py-1.5 rounded-lg text-[#d4af37] text-sm font-medium border border-[#d4af37]/30 hover:bg-[#d4af37]/10 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
            <span>مینو</span>
          </button>

          {/* Center: Surah info + page info */}
          <div className="text-center flex-1 mx-2">
            <p className="text-[#d4af37] text-xs font-bold leading-tight truncate">
              {headerSurahInfo || `صفحہ ${currentPage}`}
            </p>
            <p className="text-slate-400 text-[10px]">
              16 سطری تجویدی مصحف
            </p>
          </div>

          {/* Right: Action Icons */}
          <div className="flex items-center gap-2">
            <button onClick={() => setScale(s => Math.max(0.8, s - 0.1))} className="p-1.5 text-slate-400 hover:text-[#d4af37] transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button onClick={() => setScale(1)} className="p-1.5 text-slate-400 hover:text-[#d4af37] transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={() => setScale(s => Math.min(1.5, s + 0.1))} className="p-1.5 text-slate-400 hover:text-[#d4af37] transition-colors">
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
      </div>

      {/* Page Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto"
        style={{ direction: 'rtl' }}
      >
        {isLoading || !pageMap ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-10 h-10 border-4 border-[#d4af37]/30 border-t-[#d4af37] rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">صفحہ لوڈ ہو رہا ہے...</p>
          </div>
        ) : (
          <div
            className="min-h-full px-4 py-4"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top right' }}
          >
            {/* Page inner - cream/white mushaf feel */}
            <div className="bg-[#fdf8f0] rounded-2xl shadow-2xl min-h-[70vh] pb-6 overflow-hidden">

              {pageAyahs.map((ayah, idx) => (
                <React.Fragment key={`${ayah.surahNumber}-${ayah.ayahNumber}`}>

                  {/* Surah Header — appears when first ayah of a new surah */}
                  {ayah.isFirstOfSurah && (
                    <div className="mx-3 mt-4 mb-2">
                      {/* Surah Title Box */}
                      <div className="border border-[#8B6914] rounded-lg overflow-hidden">
                        <div className="bg-[#8B6914]/10 px-3 py-2">
                          <div className="flex items-center justify-between text-xs text-[#5C4A1E] mb-1">
                            <span>{ayah.surahType === 'Meccan' ? 'مکیہ' : 'مدنیہ'}</span>
                            <span>الجزء {getJuzForSurah(ayah.surahNumber)}</span>
                          </div>
                          <div className="text-center">
                            <p className="text-[#1a3a2a] font-bold" style={{ fontSize: '1.1rem', fontFamily: 'serif' }}>
                              سُوْرَةُ {ayah.surahName}
                            </p>
                            <p className="text-[#5C4A1E] text-xs mt-0.5">
                              آیات مبارکہ {ayah.totalAyahs}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bismillah (except Surah 9 Tawbah and Surah 1 Fatiha) */}
                      {ayah.surahNumber !== 9 && ayah.surahNumber !== 1 && (
                        <div className="bg-[#fdf8f0] border border-[#d4af37]/30 rounded-lg px-4 py-3 mt-2 text-center">
                          <p
                            className="text-[#1a3a2a] leading-loose"
                            style={{
                              fontSize: '1.3rem',
                              fontFamily: '"PDMS_Saleem_QuranFont", "Scheherazade New", serif',
                              direction: 'rtl',
                            }}
                          >
                            بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ayah Text */}
                  <div className={`px-4 ${idx === 0 || ayah.isFirstOfSurah ? 'pt-2' : 'pt-0'} pb-1`}>
                    <span
                      className="text-[#1a1a1a] leading-[2.4]"
                      style={{
                        fontSize: `${1.25 * scale}rem`,
                        fontFamily: '"PDMS_Saleem_QuranFont", "Scheherazade New", "me_quran", serif',
                        direction: 'rtl',
                        display: 'inline',
                      }}
                      dangerouslySetInnerHTML={{ __html: formatTajweed(ayah.text) }}
                    />
                    {/* Ayah number circle */}
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#8B6914] font-bold mx-1 align-middle"
                      style={{ fontSize: '0.65rem', display: 'inline-flex', verticalAlign: 'middle' }}
                    >
                      {toArabicNumerals(ayah.ayahNumber)}
                    </span>
                    {' '}
                  </div>

                </React.Fragment>
              ))}

              {pageAyahs.length === 0 && !isLoading && (
                <div className="flex items-center justify-center h-40">
                  <p className="text-[#5C4A1E] text-sm">اس صفحے پر کوئی آیات نہیں</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex-shrink-0 bg-[#1a3a2a] border-t border-[#d4af37]/30 px-3 py-2.5">
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
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#d4af37] text-[#1a3a2a] rounded-lg text-sm font-bold hover:bg-[#c09a2f] transition-colors"
            >
              جائیں
            </button>
            <button
              type="button"
              onClick={() => setShowGoto(false)}
              className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600 transition-colors"
            >
              ✕
            </button>
          </form>
        )}

        <div className="flex items-center justify-between gap-2">
          {/* Next page (in RTL, next is on LEFT side visually) */}
          <button
            onClick={handleNext}
            disabled={currentPage >= 604}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#d4af37] text-[#1a3a2a] rounded-xl font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#c09a2f] transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            اگلا صفحہ
          </button>

          {/* Page counter — tappable to go to page */}
          <button
            onClick={() => setShowGoto(v => !v)}
            className="flex-1 text-center py-2 bg-[#0d1117]/60 rounded-xl border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-all"
          >
            <span className="text-[#d4af37] font-bold text-sm">
              {currentPage} / 604
            </span>
          </button>

          {/* Prev page */}
          <button
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1a3a2a] text-[#d4af37] rounded-xl font-bold text-sm border border-[#d4af37]/30 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#243d2f] transition-all active:scale-95"
          >
            پچھلا صفحہ
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Convert to Arabic-Indic numerals
function toArabicNumerals(n: number): string {
  return n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
}

// Approximate juz for a surah (simplified lookup)
function getJuzForSurah(surahNum: number): string {
  const juzMap: Record<number, number> = {
    1: 1, 2: 1, 3: 3, 4: 4, 5: 6, 6: 7, 7: 8, 8: 10, 9: 10, 10: 11,
    11: 12, 12: 12, 13: 13, 14: 13, 15: 14, 16: 14, 17: 15, 18: 15,
    19: 16, 20: 16, 21: 17, 22: 17, 23: 18, 24: 18, 25: 18, 26: 19,
    27: 19, 28: 20, 29: 20, 30: 21, 31: 21, 32: 21, 33: 21, 34: 22,
    35: 22, 36: 22, 37: 23, 38: 23, 39: 23, 40: 24, 41: 24, 42: 25,
    43: 25, 44: 25, 45: 25, 46: 26, 47: 26, 48: 26, 49: 26, 50: 26,
    51: 26, 52: 27, 53: 27, 54: 27, 55: 27, 56: 27, 57: 27, 58: 28,
    59: 28, 60: 28, 61: 28, 62: 28, 63: 28, 64: 28, 65: 28, 66: 28,
    67: 29, 68: 29, 69: 29, 70: 29, 71: 29, 72: 29, 73: 29, 74: 29,
    75: 29, 76: 29, 77: 29, 78: 30, 79: 30, 80: 30, 81: 30, 82: 30,
    83: 30, 84: 30, 85: 30, 86: 30, 87: 30, 88: 30, 89: 30, 90: 30,
    91: 30, 92: 30, 93: 30, 94: 30, 95: 30, 96: 30, 97: 30, 98: 30,
    99: 30, 100: 30, 101: 30, 102: 30, 103: 30, 104: 30, 105: 30,
    106: 30, 107: 30, 108: 30, 109: 30, 110: 30, 111: 30, 112: 30,
    113: 30, 114: 30,
  };
  return toArabicNumerals(juzMap[surahNum] || 1);
}

export default MushafPageView;
