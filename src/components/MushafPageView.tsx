import React, { useState, useEffect, useCallback, useRef, TouchEvent } from 'react';
import { ChevronRight, ChevronLeft, Bookmark, ZoomIn, ZoomOut, RotateCcw, Loader2 } from 'lucide-react';
import { formatTajweed } from '../utils/tajweed';
import { SURAH_LIST } from '../data/surahs';
import { getPageMeta } from '../data/pageMeta';

interface MushafPageViewProps {
  initialPage?: number;
  onBack: () => void;
  onPageChange?: (page: number) => void;
}

interface PageAyahRef {
  s: number; // surah number
  a: number; // ayah number
}

interface RenderedAyah {
  surahNumber: number;
  surahName: string;
  surahType: string;
  ayahNumber: number;
  text: string;
  isFirstOfSurah: boolean;
  totalAyahs: number;
}

const LS_MUSHAF_PAGE = 'quran_mushaf_last_page';
const LS_MUSHAF_BOOKMARKS = 'quran_mushaf_page_bookmarks';

// Cache for loaded local surah files
const localSurahCache: Record<number, Record<string, string>> = {};

async function fetchLocalSurah(surahNum: number): Promise<Record<string, string>> {
  if (localSurahCache[surahNum]) return localSurahCache[surahNum];
  try {
    const res = await fetch(`/quran/${surahNum}.json`);
    const data = await res.json();
    localSurahCache[surahNum] = data.verse || {};
    return localSurahCache[surahNum];
  } catch (err) {
    console.error('Error loading surah JSON:', err);
    return {};
  }
}

// Convert numbers to Arabic-Indic numerals
function toArabicNumerals(n: number): string {
  return n.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
}

export const MushafPageView: React.FC<MushafPageViewProps> = ({
  initialPage = 1,
  onBack,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(() => {
    if (initialPage >= 1 && initialPage <= 604) return initialPage;
    try {
      const saved = Number(localStorage.getItem(LS_MUSHAF_PAGE));
      if (saved >= 1 && saved <= 604) return saved;
    } catch {}
    return 1;
  });

  const [pageMap, setPageMap] = useState<Record<string, PageAyahRef[]> | null>(null);
  const [pageAyahs, setPageAyahs] = useState<RenderedAyah[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [showGoto, setShowGoto] = useState<boolean>(false);
  const [gotoInput, setGotoInput] = useState<string>('');

  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const isSwiping = useRef<boolean>(false);

  // Load page_map.json once
  useEffect(() => {
    fetch('/quran/page_map.json')
      .then(res => res.json())
      .then(data => setPageMap(data))
      .catch(err => console.error('Failed to load page_map.json:', err));
  }, []);

  // Update currentPage if initialPage prop changes
  useEffect(() => {
    if (initialPage >= 1 && initialPage <= 604) {
      setCurrentPage(initialPage);
    }
  }, [initialPage]);

  // Load verses whenever currentPage or pageMap changes
  useEffect(() => {
    if (!pageMap) return;

    setIsLoading(true);
    const refs: PageAyahRef[] = pageMap[String(currentPage)] || [];

    if (refs.length === 0) {
      setPageAyahs([]);
      setIsLoading(false);
      return;
    }

    const uniqueSurahs = Array.from(new Set(refs.map(r => r.s)));

    Promise.all(uniqueSurahs.map(fetchLocalSurah))
      .then(results => {
        const versesMap: Record<number, Record<string, string>> = {};
        uniqueSurahs.forEach((s, idx) => {
          versesMap[s] = results[idx];
        });

        const list: RenderedAyah[] = refs.map((ref, idx) => {
          const surahInfo = SURAH_LIST.find(s => s.number === ref.s);
          const prevRef = refs[idx - 1];
          const isFirstOfSurah = !prevRef || prevRef.s !== ref.s;

          return {
            surahNumber: ref.s,
            surahName: surahInfo?.name || `سورة ${ref.s}`,
            surahType: surahInfo?.revelationType || 'Meccan',
            ayahNumber: ref.a,
            text: versesMap[ref.s]?.[`verse_${ref.a}`] || '',
            isFirstOfSurah,
            totalAyahs: surahInfo?.numberOfAyahs || 0,
          };
        });

        setPageAyahs(list);
        setIsLoading(false);

        try {
          localStorage.setItem(LS_MUSHAF_PAGE, String(currentPage));
        } catch {}

        if (onPageChange) {
          onPageChange(currentPage);
        }

        try {
          const bm = localStorage.getItem(LS_MUSHAF_BOOKMARKS);
          const pages: number[] = bm ? JSON.parse(bm) : [];
          setIsBookmarked(pages.includes(currentPage));
        } catch {}

        // Scroll page to top on page change
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
      })
      .catch(err => {
        console.error('Error rendering page:', err);
        setIsLoading(false);
      });
  }, [currentPage, pageMap, onPageChange]);

  const goToPage = useCallback((page: number) => {
    const p = Math.max(1, Math.min(604, page));
    setCurrentPage(p);
  }, []);

  // Swipe gesture detection (left/right only)
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
    if (Math.abs(dx) > 40) {
      if (dx > 0) {
        // Finger swiped right -> Previous page
        goToPage(currentPage - 1);
      } else {
        // Finger swiped left -> Next page
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

  const meta = getPageMeta(currentPage);
  const activeSurahInfo = SURAH_LIST.find(s => s.number === meta.surahNumber) || SURAH_LIST[0];
  const headerSurah = activeSurahInfo.name;
  const currentJuz = meta.juzNumber;

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
          <p className="text-[#d4af37] text-sm font-bold tracking-wide" dir="rtl">
            سورة {headerSurah}
          </p>
          <p className="text-emerald-300/80 text-[10px]">
            الجزء {toArabicNumerals(currentJuz)} • صفحہ {toArabicNumerals(currentPage)}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale(s => Math.max(0.85, +(s - 0.1).toFixed(2)))}
            className="p-1.5 text-slate-400 hover:text-[#d4af37] transition-colors"
            title="چھوٹا کریں"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setScale(1)}
            className="p-1.5 text-slate-400 hover:text-[#d4af37] transition-colors"
            title="ری سیٹ"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale(s => Math.min(1.4, +(s + 0.1).toFixed(2)))}
            className="p-1.5 text-slate-400 hover:text-[#d4af37] transition-colors"
            title="بڑا کریں"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={toggleBookmark}
            className={`p-1.5 transition-colors ${isBookmarked ? 'text-[#d4af37]' : 'text-slate-400 hover:text-[#d4af37]'}`}
            title="بک مارک"
          >
            <Bookmark className="w-4 h-4" fill={isBookmarked ? '#d4af37' : 'none'} />
          </button>
        </div>
      </div>

      {/* Main Mushaf Page Canvas */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 flex justify-center items-start sm:items-center bg-[#181310]"
      >
        {isLoading || !pageMap ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
            <Loader2 className="w-9 h-9 animate-spin text-[#d4af37]" />
            <p className="text-[#d4af37] text-xs">صفحہ {currentPage} لوڈ ہو رہا ہے...</p>
          </div>
        ) : (
          <div
            className="w-full max-w-[620px] transition-transform duration-150 my-auto"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
          >
            {/* Authentic Mushaf Page Border & Texture */}
            <div
              className="bg-[#fefbf3] text-[#1a0f00] rounded-xl shadow-2xl overflow-hidden"
              style={{
                border: '3px solid #8B6914',
                boxShadow: '0 10px 40px rgba(0,0,0,0.7), inset 0 0 15px rgba(212,175,55,0.1)',
              }}
            >
              {/* Header inside Mushaf page (Surah name & Juz) */}
              <div
                className="flex items-center justify-between px-4 py-1.5 border-b border-[#8B6914]/40"
                style={{ background: 'linear-gradient(to bottom, #f7ebd0, #f0dfb8)' }}
              >
                <span className="text-[#5C3317] text-xs font-bold font-serif" dir="rtl">
                  الجزء {toArabicNumerals(currentJuz)}
                </span>
                <span className="text-[#8B6914] text-[11px] font-bold">
                  {toArabicNumerals(currentPage)}
                </span>
                <span className="text-[#5C3317] text-xs font-bold font-serif" dir="rtl">
                  سورة {headerSurah}
                </span>
              </div>

              {/* Text Body - Justified Continuous 16-Line Style Arabic */}
              <div className="px-4 py-3 sm:px-6 sm:py-5 min-h-[68vh] flex flex-col justify-between">
                <div
                  className="text-justify leading-[2.5] sm:leading-[2.7]"
                  dir="rtl"
                  style={{
                    fontFamily: '"Amiri Quran", "PDMS_Saleem_QuranFont", "Scheherazade New", serif',
                    fontSize: `${1.25 * scale}rem`,
                    wordSpacing: '0.04em',
                    textJustify: 'inter-word',
                  }}
                >
                  {pageAyahs.map((ayah) => (
                    <React.Fragment key={`${ayah.surahNumber}-${ayah.ayahNumber}`}>
                      {/* Surah Banner: ONLY if a new surah starts on this page at Ayah 1 */}
                      {ayah.isFirstOfSurah && ayah.ayahNumber === 1 && (
                        <div className="block my-3 text-center" dir="rtl">
                          <div
                            className="py-2 px-4 rounded-lg border-2 border-[#8B6914] shadow-sm mb-2"
                            style={{
                              background: 'linear-gradient(135deg, #f7ebd0 0%, #e8d39e 100%)',
                            }}
                          >
                            <div className="flex items-center justify-between text-[10px] text-[#5C3317] mb-0.5">
                              <span>{ayah.surahType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                              <span>آياتها {toArabicNumerals(ayah.totalAyahs)}</span>
                            </div>
                            <h2 className="text-[#2c0e02] text-lg font-bold font-serif">
                              سُوْرَةُ {ayah.surahName}
                            </h2>
                          </div>

                          {/* Bismillah: except Surah 9 (At-Tawbah) */}
                          {ayah.surahNumber !== 9 && (
                            <div className="py-1.5 text-center">
                              <span
                                className="text-[#1a0f00] text-xl block"
                                style={{ fontFamily: '"Amiri Quran", "Scheherazade New", serif' }}
                              >
                                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Continuous Inline Ayah Text with Colors */}
                      <span
                        dangerouslySetInnerHTML={{ __html: formatTajweed(ayah.text) }}
                        style={{ display: 'inline' }}
                      />

                      {/* Quran Ayah End Symbol with Arabic Numerals */}
                      <span
                        className="inline-flex items-center justify-center align-middle mx-1 font-bold text-[#8B6914]"
                        style={{
                          width: '1.4em',
                          height: '1.4em',
                          borderRadius: '50%',
                          border: '1.5px solid #8B6914',
                          background: 'rgba(212,175,55,0.15)',
                          fontSize: '0.55em',
                          lineHeight: 1,
                          display: 'inline-flex',
                          verticalAlign: 'middle',
                        }}
                      >
                        {toArabicNumerals(ayah.ayahNumber)}
                      </span>
                      {' '}
                    </React.Fragment>
                  ))}
                </div>

                {/* Bottom Page Number Badge */}
                <div
                  className="mt-4 pt-2 border-t border-[#8B6914]/30 flex items-center justify-between text-[11px] text-[#5C3317] font-serif"
                >
                  <span>{currentPage % 2 === 0 ? `صفحہ ${toArabicNumerals(currentPage)}` : ''}</span>
                  <span className="text-[#8B6914] font-bold">۩ مصحف تجوید ۩</span>
                  <span>{currentPage % 2 !== 0 ? `صفحہ ${toArabicNumerals(currentPage)}` : ''}</span>
                </div>
              </div>
            </div>

            {/* Swipe Helper Hint */}
            <p className="text-center text-slate-400/70 text-[10px] mt-2 mb-1" dir="rtl">
              ← انگلی سے دائیں یا بائیں سوائپ کریں →
            </p>
          </div>
        )}
      </div>

      {/* Bottom Floating Bar */}
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
          {/* اگلا صفحہ */}
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

          {/* پچھلا صفحہ */}
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
