import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Bookmark, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { formatTajweed } from '../utils/tajweed';
import { SURAH_LIST } from '../data/surahs';

interface MushafPageViewProps {
  initialPage?: number;
  initialSurahName?: string;
  initialSurahNumber?: number;
  onBack: () => void;
}

interface PageAyah {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
}

export const MushafPageView: React.FC<MushafPageViewProps> = ({
  initialPage = 1,
  initialSurahName = 'الفاتحة',
  initialSurahNumber = 1,
  onBack,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [currentSurahNum, setCurrentSurahNum] = useState<number>(initialSurahNumber);
  const [surahAyahs, setSurahAyahs] = useState<PageAyah[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSurahNum(initialSurahNumber);
  }, [initialSurahNumber]);

  // Load verses of the selected surah
  useEffect(() => {
    setIsLoading(true);
    fetch(`/quran/${currentSurahNum}.json`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.verse) {
          const list: PageAyah[] = [];
          const sName = SURAH_LIST.find((s) => s.number === currentSurahNum)?.name || 'القرآن';
          Object.keys(data.verse).forEach((key) => {
            const num = parseInt(key.replace('verse_', ''));
            list.push({
              surahNumber: currentSurahNum,
              surahName: sName,
              ayahNumber: num,
              text: data.verse[key],
            });
          });
          setSurahAyahs(list);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error loading surah verses', err);
        setIsLoading(false);
      });
  }, [currentSurahNum]);

  // Bookmark check
  useEffect(() => {
    try {
      const saved = localStorage.getItem('quran_page_bookmarks');
      if (saved) {
        const pages: number[] = JSON.parse(saved);
        setIsBookmarked(pages.includes(currentSurahNum));
      }
    } catch {}
  }, [currentSurahNum]);

  const toggleBookmark = () => {
    try {
      const saved = localStorage.getItem('quran_page_bookmarks');
      let pages: number[] = saved ? JSON.parse(saved) : [];
      if (pages.includes(currentSurahNum)) {
        pages = pages.filter((p) => p !== currentSurahNum);
        setIsBookmarked(false);
      } else {
        pages.push(currentSurahNum);
        setIsBookmarked(true);
      }
      localStorage.setItem('quran_page_bookmarks', JSON.stringify(pages));
    } catch {}
  };

  const handleNextSurah = () => {
    if (currentSurahNum < 114) {
      setCurrentSurahNum((n) => n + 1);
    }
  };

  const handlePrevSurah = () => {
    if (currentSurahNum > 1) {
      setCurrentSurahNum((n) => n - 1);
    }
  };

  const currentSurah = SURAH_LIST.find((s) => s.number === currentSurahNum) || SURAH_LIST[0];

  return (
    <div className="min-h-screen bg-[#07130c] text-white flex flex-col justify-between animate-fadeIn select-none">
      {/* Top Mushaf Header */}
      <header className="bg-gradient-to-r from-[#0d3827] via-[#124e35] to-[#0a2c1e] border-b border-[#d4af37]/40 px-3 md:px-6 py-2.5 flex items-center justify-between shadow-lg sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1 bg-[#1b7a4b] hover:bg-[#14603b] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow transition-all active:scale-95"
          >
            ← ہوم مینو
          </button>
          <div className="text-right">
            <span className="text-xs text-[#ffd700] font-bold">
              سورۃ {currentSurah.name} • 16 سطری تجویدی مصحف
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
            onClick={() => setScale((s) => Math.min(1.3, s + 0.1))}
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
            title="سورت محفوظ کریں"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Mushaf Page Container */}
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-auto bg-[#050e09] min-h-[78vh]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-10 h-10 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-amber-200">تجویدی آیات لوڈ ہو رہی ہیں...</p>
          </div>
        ) : (
          <div
            className="max-w-2xl w-full bg-[#fdfbf4] text-[#111] rounded-2xl shadow-2xl p-4 sm:p-6 border-[6px] border-[#d4af37]/80 relative transition-transform duration-200"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
            dir="rtl"
          >
            {/* Top Ornamental Mushaf Header */}
            <div className="border-2 border-[#1b7a4b] rounded-xl p-3 mb-4 bg-gradient-to-r from-[#eef7f2] via-[#ffffff] to-[#eef7f2] text-center shadow-inner">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#1b7a4b] px-2 mb-1">
                <span>الجزء {Math.ceil(currentSurah.number / 4)}</span>
                <span className="text-sm font-arabic font-extrabold text-[#d4af37]">
                  سُوْرَةُ {currentSurah.name}
                </span>
                <span>{currentSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
              </div>
              <div className="text-xs text-gray-500 border-t border-emerald-900/10 pt-1">
                آیاتها {currentSurah.numberOfAyahs}
              </div>
            </div>

            {/* Bismillah Header (Except Surah At-Tawbah #9) */}
            {currentSurah.number !== 9 && (
              <div className="text-center py-2 mb-4 bg-[#fbf5e6] rounded-xl border border-[#d4af37]/30">
                <span className="font-arabic text-2xl sm:text-3xl text-[#1b7a4b] font-bold">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
              </div>
            )}

            {/* Continuous 16-Line Authentic Tajweed Mushaf Text */}
            <div className="text-justify font-arabic leading-[2.6] sm:leading-[2.8] text-2xl sm:text-3xl text-gray-900 font-bold tracking-wide space-x-1 space-x-reverse">
              {surahAyahs.map((ayah) => {
                let ayahText = ayah.text;
                // Strip bismillah if already at start of surah 2-114
                if (currentSurah.number !== 1 && currentSurah.number !== 9 && ayah.ayahNumber === 1) {
                  ayahText = ayahText
                    .replace(/^بِسْمِ\s+اللَّهِ\s+الرَّحْمَٰنِ\s+الرَّحِيمِ\s*/, '')
                    .replace(/^بِسْمِ\s+ٱللَّهِ\s+ٱلرَّحْمَٰنِ\s+ٱلرَّحِيمِ\s*/, '');
                }

                return (
                  <span key={ayah.ayahNumber} className="inline">
                    <span
                      dangerouslySetInnerHTML={{ __html: formatTajweed(ayahText) }}
                    />
                    {/* Arabic End of Ayah Ornamental Number Circle */}
                    <span className="inline-flex items-center justify-center mx-1.5 w-7 h-7 rounded-full border border-[#d4af37] bg-[#fbf5e6] text-[#b8860b] text-xs font-sans font-bold shadow-sm select-none">
                      {ayah.ayahNumber}
                    </span>
                  </span>
                );
              })}
            </div>

            {/* Bottom Mushaf Page Footer */}
            <div className="mt-6 pt-3 border-t-2 border-[#1b7a4b]/30 flex items-center justify-between text-xs text-gray-500 font-bold px-2">
              <span>سورۃ نمبر {currentSurah.number}</span>
              <span className="text-[#1b7a4b]">صوت القرآن • تجویدی مصحف</span>
              <span>114 / {currentSurah.number}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Surah Navigation Bar */}
      <footer className="bg-gradient-to-r from-[#0d3827] via-[#124e35] to-[#0a2c1e] border-t border-[#d4af37]/40 p-3 px-4 flex items-center justify-between sticky bottom-0 z-30 shadow-2xl">
        <button
          onClick={handlePrevSurah}
          disabled={currentSurahNum <= 1}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
            currentSurahNum <= 1
              ? 'bg-white/5 text-gray-500 cursor-not-allowed'
              : 'bg-[#ffd700] hover:bg-yellow-400 text-black active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>پچھلی سورۃ</span>
        </button>

        <div className="text-center font-bold text-xs text-emerald-100">
          سورۃ <span className="text-[#ffd700] text-sm">{currentSurah.name}</span> ({currentSurahNum}/114)
        </div>

        <button
          onClick={handleNextSurah}
          disabled={currentSurahNum >= 114}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
            currentSurahNum >= 114
              ? 'bg-white/5 text-gray-500 cursor-not-allowed'
              : 'bg-[#ffd700] hover:bg-yellow-400 text-black active:scale-95'
          }`}
        >
          <span>اگلی سورۃ</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
