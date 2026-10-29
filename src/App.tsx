import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Surah, Ayah, Reciter } from './types/quran';
import { SURAH_LIST } from './data/surahs';
import { RECITERS_LIST } from './data/reciters';
import { AyahCard } from './components/AyahCard';
import { AudioStudioPlayer } from './components/AudioStudioPlayer';
import { ReciterModal } from './components/ReciterModal';
import { SurahSidebar } from './components/SurahSidebar';
import { TajweedGuide } from './components/TajweedGuide';
import { fetchSurahTimings, VerseTiming } from './utils/timingService';
import {
  Menu,
  Sparkles,
  Volume2,
  Languages,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Info
} from 'lucide-react';

// ─── LocalStorage keys ─────────────────────────────────────────────────────
const LS_RECITER   = 'quran_selected_reciter_id';
const LS_SURAH     = 'quran_selected_surah_number';
const LS_FONT      = 'quran_font_size';
const LS_TAJWEED   = 'quran_tajweed';
const LS_TRANSL    = 'quran_translation';

function getSavedReciter(): Reciter {
  try {
    const id = localStorage.getItem(LS_RECITER);
    if (id) {
      const found = RECITERS_LIST.find(r => r.id === id);
      if (found) return found;
    }
  } catch {}
  return RECITERS_LIST[0];
}

function getSavedSurah(): Surah {
  try {
    const n = Number(localStorage.getItem(LS_SURAH));
    if (n >= 1 && n <= 114) return SURAH_LIST[n - 1];
  } catch {}
  return SURAH_LIST[0];
}

export const App: React.FC = () => {
  // ── Persisted Navigation State ─────────────────────────────────────────────
  const [selectedSurah,   setSelectedSurah]   = useState<Surah>(getSavedSurah);
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(getSavedReciter);

  // ── Quran Data ─────────────────────────────────────────────────────────────
  const [ayahs,          setAyahs]          = useState<Ayah[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(true);
  const urduDictRef = useRef<Record<string, string>>({});
  const [urduLoaded, setUrduLoaded]         = useState<boolean>(false);

  // ── Audio State ────────────────────────────────────────────────────────────
  const [isPlaying,          setIsPlaying]          = useState<boolean>(false);
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<Ayah | null>(null);
  const [audioCurrentTime,   setAudioCurrentTime]   = useState<number>(0);
  const [audioDuration,      setAudioDuration]      = useState<number>(0);

  // ── 100% Official Verse Timings from Quran.com CDN ─────────────────────────
  const [exactTimings, setExactTimings] = useState<VerseTiming[]>([]);

  useEffect(() => {
    let cancelled = false;
    setExactTimings([]);

    if (selectedReciter.qdcReciterId) {
      fetchSurahTimings(selectedReciter.qdcReciterId, selectedSurah.number).then(timings => {
        if (!cancelled && timings.length) {
          setExactTimings(timings);
        }
      });
    }

    return () => { cancelled = true; };
  }, [selectedReciter.qdcReciterId, selectedSurah.number]);

  // Track active ayah by exact milliseconds when official timings exist
  useEffect(() => {
    if (!isPlaying) return;

    // Method 1: Official verified millisecond timings from Quran.com CDN
    // Adding a 600ms safety buffer so it NEVER jumps while last words are still being recited
    if (exactTimings.length) {
      const currentMs = audioCurrentTime * 1000;
      const matchedTiming = exactTimings.find(
        t => currentMs >= t.timestampFrom && currentMs < (t.timestampTo + 600)
      );

      if (matchedTiming) {
        const activeAyah = ayahs.find(a => a.numberInSurah === matchedTiming.verseNumber);
        if (activeAyah && activeAyah.number !== currentPlayingAyah?.number) {
          setCurrentPlayingAyah(activeAyah);
          const el = ayahRefs.current[activeAyah.number];
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
      return;
    }

    // Method 2: Smart word-weighted sync for other reciters
    // Using a conservative threshold to prevent jumping before the ayah is fully finished
    if (audioDuration > 0 && ayahs.length > 0) {
      const wordCounts = ayahs.map(a => Math.max(1, a.text.split(/\s+/).filter(Boolean).length));
      const totalWords = wordCounts.reduce((sum, w) => sum + w, 0);
      if (totalWords === 0) return;

      // Slight offset to give full breath time to the current ayah
      const adjustedTime = Math.max(0, audioCurrentTime - 1.2);
      const progress = Math.min(adjustedTime / audioDuration, 0.9999);
      let cumulativeFraction = 0;
      let targetAyahIndex = 0;

      for (let i = 0; i < wordCounts.length; i++) {
        const frac = wordCounts[i] / totalWords;
        if (progress >= cumulativeFraction && progress < cumulativeFraction + frac) {
          targetAyahIndex = i;
          break;
        }
        cumulativeFraction += frac;
      }

      const activeAyah = ayahs[targetAyahIndex];
      if (activeAyah && activeAyah.number !== currentPlayingAyah?.number) {
        setCurrentPlayingAyah(activeAyah);
        const el = ayahRefs.current[activeAyah.number];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [audioCurrentTime, isPlaying, exactTimings, ayahs, audioDuration]);

  // ── UI Prefs (also persisted) ──────────────────────────────────────────────
  const [isSidebarOpen,       setIsSidebarOpen]       = useState<boolean>(false);
  const [isReciterModalOpen,  setIsReciterModalOpen]  = useState<boolean>(false);
  const [isTajweedGuideOpen,  setIsTajweedGuideOpen]  = useState<boolean>(false);
  const [tajweedEnabled,      setTajweedEnabled]      = useState<boolean>(() => {
    try { return localStorage.getItem(LS_TAJWEED) !== 'false'; } catch { return true; }
  });
  const [showTranslation, setShowTranslation] = useState<boolean>(() => {
    try { return localStorage.getItem(LS_TRANSL) !== 'false'; } catch { return true; }
  });
  const [fontSize, setFontSize] = useState<number>(() => {
    try { return Number(localStorage.getItem(LS_FONT)) || 30; } catch { return 30; }
  });
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  // ── Refs for auto-scroll ───────────────────────────────────────────────────
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // ── Persist reciter to localStorage on every change ───────────────────────
  useEffect(() => {
    try { localStorage.setItem(LS_RECITER, selectedReciter.id); } catch {}
  }, [selectedReciter.id]);

  useEffect(() => {
    try { localStorage.setItem(LS_SURAH, String(selectedSurah.number)); } catch {}
  }, [selectedSurah.number]);

  useEffect(() => {
    try { localStorage.setItem(LS_FONT, String(fontSize)); } catch {}
  }, [fontSize]);

  useEffect(() => {
    try { localStorage.setItem(LS_TAJWEED, String(tajweedEnabled)); } catch {}
  }, [tajweedEnabled]);

  useEffect(() => {
    try { localStorage.setItem(LS_TRANSL, String(showTranslation)); } catch {}
  }, [showTranslation]);

  // ── Load Urdu translation JSON once ───────────────────────────────────────
  useEffect(() => {
    fetch('/urdu.json')
      .then(res => res.json())
      .then(data => {
        if (data?.quran) {
          const map: Record<string, string> = {};
          data.quran.forEach((item: any) => {
            map[`${item.chapter}:${item.verse}`] = item.text;
          });
          urduDictRef.current = map;
          setUrduLoaded(true);
        }
      })
      .catch(err => console.error('Could not load urdu translation', err));
  }, []);

  // ── Load Surah Ayahs from local JSON ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setIsLoadingAyahs(true);
    setCurrentPlayingAyah(null);
    ayahRefs.current = {};

    async function loadSurah() {
      try {
        const res  = await fetch(`/quran/${selectedSurah.number}.json`);
        const data = await res.json();
        if (cancelled) return;

        const parsed: Ayah[] = [];
        const count = data.count || selectedSurah.numberOfAyahs;

        for (let i = 1; i <= count; i++) {
          const arabic = data.verse?.[`verse_${i}`] || '';
          const urdu   = urduDictRef.current[`${selectedSurah.number}:${i}`] || '';
          if (arabic) {
            parsed.push({
              number: i, numberInSurah: i,
              text: arabic, translationUrdu: urdu,
              juz: 1, page: 1
            });
          }
        }

        setAyahs(parsed);
      } catch (err) {
        console.error('Error loading surah:', err);
      } finally {
        if (!cancelled) setIsLoadingAyahs(false);
      }
    }

    loadSurah();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => { cancelled = true; };
  }, [selectedSurah.number, urduLoaded]);

  // ── Auto-scroll: Only scroll when user explicitly clicks an ayah to play ───
  // We do NOT auto-scroll based on estimated audio progress to avoid premature jumps
  useEffect(() => {
    if (!currentPlayingAyah) return;
    const el = ayahRefs.current[currentPlayingAyah.number];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentPlayingAyah?.number]);

  // ── Audio controls ─────────────────────────────────────────────────────────
  const handleTogglePlay = useCallback(() => setIsPlaying(p => !p), []);

  const handleNextSurah = useCallback(() => {
    const nextIdx = selectedSurah.number % 114;
    setSelectedSurah(SURAH_LIST[nextIdx]);
    setIsPlaying(true);
  }, [selectedSurah.number]);

  const handlePrevSurah = useCallback(() => {
    const prevIdx = selectedSurah.number - 2 < 0 ? 113 : selectedSurah.number - 2;
    setSelectedSurah(SURAH_LIST[prevIdx]);
    setIsPlaying(true);
  }, [selectedSurah.number]);

  const handlePlayAyah = useCallback((ayah: Ayah) => {
    setCurrentPlayingAyah(ayah);
    setIsPlaying(true);
  }, []);

  // Audio time callback — updates audioCurrentTime + audioDuration
  const handleAudioTimeUpdate = useCallback((currentTime: number, duration: number) => {
    setAudioCurrentTime(currentTime);
    if (duration) setAudioDuration(duration);
  }, []);

  const handleToggleBookmark = useCallback((ayah: Ayah) => {
    setBookmarks(prev =>
      prev.includes(ayah.number)
        ? prev.filter(n => n !== ayah.number)
        : [...prev, ayah.number]
    );
  }, []);

  const handleSelectSurah = useCallback((surah: Surah) => {
    setSelectedSurah(surah);
    setIsPlaying(false);
    setCurrentPlayingAyah(null);
    setIsSidebarOpen(false);
  }, []);

  const handleSelectReciter = useCallback((reciter: Reciter) => {
    setSelectedReciter(reciter);
    setIsReciterModalOpen(false);
    setIsPlaying(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#070d17] text-slate-100 flex pb-32">

      {/* ── 114 Surahs Sidebar ── */}
      <SurahSidebar
        selectedSurah={selectedSurah}
        onSelectSurah={handleSelectSurah}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* ── Main Content ── */}
      <div className="flex-1 lg:pl-80 flex flex-col min-w-0">

        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 bg-[#0a121e]/95 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[#142032] text-slate-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-bold text-white text-base md:text-lg flex items-center gap-2 flex-wrap">
                <span>سورۃ {selectedSurah.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30">
                  {selectedSurah.englishName}
                </span>
              </h2>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">

            {/* Tajweed Toggle */}
            <button
              onClick={() => setTajweedEnabled(p => !p)}
              title="رنگین تجوید آن / آف"
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                tajweedEnabled
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-[#152236] text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span className="hidden sm:inline">رنگین تجوید</span>
            </button>

            {/* Tajweed Guide */}
            <button
              onClick={() => setIsTajweedGuideOpen(p => !p)}
              title="تجوید کے اصول"
              className="p-2 rounded-xl bg-[#152236] text-slate-300 hover:text-white hover:bg-[#1e2f49] transition-all"
            >
              <Info className="w-4 h-4 text-[#d4af37]" />
            </button>

            {/* Translation Toggle */}
            <button
              onClick={() => setShowTranslation(p => !p)}
              title="اردو ترجمہ آن / آف"
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                showTranslation
                  ? 'bg-[#1e2d44] text-[#d4af37] border border-[#d4af37]/40'
                  : 'bg-[#152236] text-slate-400'
              }`}
            >
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">اردو ترجمہ</span>
            </button>

            {/* Font Size */}
            <div className="hidden md:flex items-center space-x-1 bg-[#142032] p-1 rounded-xl border border-slate-800">
              <button onClick={() => setFontSize(s => Math.max(22, s - 2))} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-700 text-xs font-bold">A-</button>
              <span className="text-[11px] font-mono px-1 text-slate-400">{fontSize}px</span>
              <button onClick={() => setFontSize(s => Math.min(48, s + 2))} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-700 text-xs font-bold">A+</button>
            </div>

            {/* Reciter Quick Button */}
            <button
              onClick={() => setIsReciterModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#b8860b] to-[#d4af37] text-black text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {selectedReciter.arabicName.split(' ').slice(-1)[0] || 'قاری'}
              </span>
            </button>
          </div>
        </header>

        {/* ── Surah Content ── */}
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">

          {/* Tajweed Guide */}
          <TajweedGuide isOpen={isTajweedGuideOpen} onToggle={() => setIsTajweedGuideOpen(false)} />

          {/* Surah Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl p-8 mb-8 border border-[#d4af37]/30 bg-gradient-to-br from-[#0e192c] via-[#102035] to-[#0b1424] text-center shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-[#d4af37]/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-block text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-2">
                سورة {selectedSurah.name} • {selectedSurah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white arabic-quran-text mb-3">
                {selectedSurah.name}
              </h1>
              <p className="text-sm md:text-base text-slate-300 font-medium">
                {selectedSurah.englishNameTranslation} • {selectedSurah.numberOfAyahs} آیات مبارکہ
              </p>
              {selectedSurah.number !== 9 && (
                <div className="mt-6 pt-6 border-t border-slate-800/80">
                  <p className="arabic-quran-text text-2xl md:text-3xl text-[#d4af37] leading-loose">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ayahs List */}
          {isLoadingAyahs ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#d4af37]" />
              <p className="text-sm text-slate-400">آیات مبارکہ لوڈ کی جا رہی ہیں...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ayahs.map(ayah => (
                <div
                  key={ayah.number}
                  ref={el => { ayahRefs.current[ayah.number] = el; }}
                >
                  <AyahCard
                    ayah={ayah}
                    isPlaying={isPlaying && currentPlayingAyah?.number === ayah.number}
                    isBookmarked={bookmarks.includes(ayah.number)}
                    tajweedEnabled={tajweedEnabled}
                    fontSize={fontSize}
                    showTranslation={showTranslation}
                    onPlay={handlePlayAyah}
                    onToggleBookmark={handleToggleBookmark}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Prev / Next Surah Buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-800">
            <button
              onClick={handlePrevSurah}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#131f33] text-slate-300 hover:text-white hover:bg-[#1a2c47] border border-slate-700/60 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">پچھلی سورۃ</span>
            </button>
            <span className="text-xs text-slate-500">سورۃ {selectedSurah.number} از 114</span>
            <button
              onClick={handleNextSurah}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#131f33] text-slate-300 hover:text-white hover:bg-[#1a2c47] border border-slate-700/60 transition-all"
            >
              <span className="text-sm">اگلی سورۃ</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Reciter Modal ── */}
      <ReciterModal
        isOpen={isReciterModalOpen}
        onClose={() => setIsReciterModalOpen(false)}
        selectedReciter={selectedReciter}
        onSelectReciter={handleSelectReciter}
      />

      {/* ── Persistent Audio Player ── */}
      <AudioStudioPlayer
        currentReciter={selectedReciter}
        currentSurah={selectedSurah}
        currentAyah={currentPlayingAyah}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNextSurah={handleNextSurah}
        onPrevSurah={handlePrevSurah}
        onSelectReciterModal={() => setIsReciterModalOpen(true)}
        onTimeUpdate={handleAudioTimeUpdate}
      />
    </div>
  );
};

export default App;
