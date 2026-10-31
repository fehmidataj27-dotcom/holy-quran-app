import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Surah, Ayah, Reciter } from './types/quran';
import { SURAH_LIST } from './data/surahs';
import { RECITERS_LIST } from './data/reciters';
import { AyahCard, AyahPlayState } from './components/AyahCard';
import { AudioStudioPlayer } from './components/AudioStudioPlayer';
import { ReciterModal } from './components/ReciterModal';
import { SurahSidebar } from './components/SurahSidebar';
import { TajweedGuide } from './components/TajweedGuide';
import { getAyahAudioUrl } from './utils/ayahAudioHelper';
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
  return RECITERS_LIST.find(r => r.hasFullQuran) || RECITERS_LIST[0];
}

function getSavedSurah(): Surah {
  try {
    const n = Number(localStorage.getItem(LS_SURAH));
    if (n >= 1 && n <= 114) return SURAH_LIST[n - 1];
  } catch {}
  return SURAH_LIST[0];
}

export const App: React.FC = () => {
  const [selectedSurah,   setSelectedSurah]   = useState<Surah>(getSavedSurah);
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(getSavedReciter);

  const [ayahs,          setAyahs]          = useState<Ayah[]>([]);
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(true);
  const urduDictRef = useRef<Record<string, string>>({});
  const [urduLoaded, setUrduLoaded]         = useState<boolean>(false);

  // Bottom Surah Player State
  const [isPlaying,          setIsPlaying]          = useState<boolean>(false);
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<Ayah | null>(null);

  // Per-Ayah Audio Player State
  const [activeAyahNum,    setActiveAyahNum]    = useState<number | null>(null);
  const [ayahAudioMode,    setAyahAudioMode]    = useState<'loop' | 'seq'>('loop');
  const [ayahAudioLoading, setAyahAudioLoading] = useState<boolean>(false);
  const ayahAudioRef = useRef<HTMLAudioElement | null>(null);

  // Verse Timings for Surah Player Auto-Scroll
  const [verseTimings, setVerseTimings] = useState<VerseTiming[]>([]);
  const lastScrolledAyahRef = useRef<number | null>(null);

  // UI Prefs
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

  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});

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

  // Load verse timings whenever reciter or surah changes
  useEffect(() => {
    let cancelled = false;
    setVerseTimings([]);
    lastScrolledAyahRef.current = null;

    if (selectedReciter.qdcReciterId) {
      fetchSurahTimings(selectedReciter.qdcReciterId, selectedSurah.number).then(timings => {
        if (!cancelled && timings && timings.length > 0) {
          setVerseTimings(timings);
        }
      });
    }

    return () => { cancelled = true; };
  }, [selectedReciter.qdcReciterId, selectedSurah.number]);

  // Load Urdu translation
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

  // Stop per-ayah audio
  const stopAyahAudio = useCallback(() => {
    if (ayahAudioRef.current) {
      ayahAudioRef.current.pause();
      ayahAudioRef.current.src = '';
      ayahAudioRef.current = null;
    }
    setActiveAyahNum(null);
    setAyahAudioLoading(false);
  }, []);

  // Load Surah Ayahs
  useEffect(() => {
    let cancelled = false;
    setIsLoadingAyahs(true);
    setCurrentPlayingAyah(null);
    lastScrolledAyahRef.current = null;
    stopAyahAudio();
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
  }, [selectedSurah.number, urduLoaded, stopAyahAudio]);

  // Play per-ayah audio handler
  const playAyahAudioAt = useCallback((ayahNum: number, mode: 'loop' | 'seq') => {
    // Pause full surah player
    setIsPlaying(false);
    setCurrentPlayingAyah(null);

    if (ayahAudioRef.current) {
      ayahAudioRef.current.pause();
      ayahAudioRef.current = null;
    }

    const url = getAyahAudioUrl(selectedReciter.id, selectedSurah.number, ayahNum);
    const audio = new Audio(url);
    ayahAudioRef.current = audio;
    setActiveAyahNum(ayahNum);
    setAyahAudioMode(mode);
    setAyahAudioLoading(true);

    // Scroll to the playing ayah smoothly
    const el = ayahRefs.current[ayahNum];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    audio.oncanplay = () => {
      setAyahAudioLoading(false);
    };

    audio.onended = () => {
      if (mode === 'loop') {
        // Repeat the same ayah
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        // Sequential mode: only when the last word of this ayah finishes, advance to the next ayah!
        if (ayahNum < selectedSurah.numberOfAyahs) {
          playAyahAudioAt(ayahNum + 1, 'seq');
        } else {
          stopAyahAudio();
        }
      }
    };

    audio.onerror = () => {
      setAyahAudioLoading(false);
      stopAyahAudio();
    };

    audio.play().catch(err => {
      console.error('Audio playback failed:', err);
      setAyahAudioLoading(false);
      stopAyahAudio();
    });
  }, [selectedReciter.id, selectedSurah.number, selectedSurah.numberOfAyahs, stopAyahAudio]);

  // User click on individual AyahCard play button
  const handlePlayAyah = useCallback((ayah: Ayah) => {
    if (activeAyahNum === ayah.numberInSurah) {
      if (ayahAudioMode === 'loop') {
        // Switch to sequential mode
        playAyahAudioAt(ayah.numberInSurah, 'seq');
      } else {
        // Stop
        stopAyahAudio();
      }
    } else {
      // First click: loop this ayah
      playAyahAudioAt(ayah.numberInSurah, 'loop');
    }
  }, [activeAyahNum, ayahAudioMode, playAyahAudioAt, stopAyahAudio]);

  // Auto-scroll handler during full surah playback
  // Only transitions to the next ayah when timestampTo of previous ayah is actually reached!
  const handleSurahTimeUpdate = useCallback((currentTimeSec: number, durationSec: number) => {
    if (!isPlaying || activeAyahNum !== null) return;
    const currentMs = currentTimeSec * 1000;

    let activeNum: number | null = null;

    if (verseTimings.length > 0) {
      // Exact millisecond timing check
      const currentVt = verseTimings.find(
        vt => currentMs >= vt.timestampFrom && currentMs < vt.timestampTo
      );
      if (currentVt) {
        activeNum = currentVt.verseNumber;
      }
    } else if (durationSec > 0 && ayahs.length > 0) {
      // Proportional fallback
      const idx = Math.min(
        Math.floor((currentTimeSec / durationSec) * ayahs.length),
        ayahs.length - 1
      );
      activeNum = ayahs[idx].numberInSurah;
    }

    if (activeNum && activeNum !== lastScrolledAyahRef.current) {
      lastScrolledAyahRef.current = activeNum;
      const foundAyah = ayahs.find(a => a.numberInSurah === activeNum) || null;
      setCurrentPlayingAyah(foundAyah);

      // Smooth scroll only when the new ayah starts
      const el = ayahRefs.current[activeNum];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isPlaying, activeAyahNum, verseTimings, ayahs]);

  // Bottom player controls
  const handleTogglePlay = useCallback(() => {
    if (!isPlaying) {
      stopAyahAudio();
    }
    setIsPlaying(p => !p);
  }, [isPlaying, stopAyahAudio]);

  const handleNextSurah = useCallback(() => {
    stopAyahAudio();
    const nextIdx = selectedSurah.number % 114;
    setSelectedSurah(SURAH_LIST[nextIdx]);
    setIsPlaying(true);
  }, [selectedSurah.number, stopAyahAudio]);

  const handlePrevSurah = useCallback(() => {
    stopAyahAudio();
    const prevIdx = selectedSurah.number - 2 < 0 ? 113 : selectedSurah.number - 2;
    setSelectedSurah(SURAH_LIST[prevIdx]);
    setIsPlaying(true);
  }, [selectedSurah.number, stopAyahAudio]);

  const handleToggleBookmark = useCallback((ayah: Ayah) => {
    setBookmarks(prev =>
      prev.includes(ayah.number)
        ? prev.filter(n => n !== ayah.number)
        : [...prev, ayah.number]
    );
  }, []);

  const handleSelectSurah = useCallback((surah: Surah) => {
    stopAyahAudio();
    setSelectedSurah(surah);
    setIsPlaying(false);
    setCurrentPlayingAyah(null);
    lastScrolledAyahRef.current = null;
    setIsSidebarOpen(false);
  }, [stopAyahAudio]);

  const handleSelectReciter = useCallback((reciter: Reciter) => {
    stopAyahAudio();
    setSelectedReciter(reciter);
    setIsReciterModalOpen(false);
    setIsPlaying(true);
  }, [stopAyahAudio]);

  return (
    <div className="min-h-screen bg-[#070d17] text-slate-100 flex pb-32">
      {/* 114 Surahs Sidebar */}
      <SurahSidebar
        selectedSurah={selectedSurah}
        onSelectSurah={handleSelectSurah}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
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

        {/* Surah Content */}
        <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
          {/* Tajweed Guide */}
          <TajweedGuide isOpen={isTajweedGuideOpen} onToggle={() => setIsTajweedGuideOpen(false)} />

          {/* Surah Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl p-8 mb-8 border border-[#d4af37]/30 bg-gradient-to-br from-[#0e192c] via-[#102035] to-[#0b1424] text-center shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-[#d4af37]/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <span className="inline-block text-xs uppercase tracking-widest text-[#d4af37] font-semibold mb-2">
                سورۃ {selectedSurah.name} • {selectedSurah.revelationType === 'Meccan' ? 'مکیہ' : 'مدنیہ'}
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
              <p className="text-sm text-slate-400">آیات مبارکہ لوڈ ہو رہی ہیں...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ayahs.map(ayah => {
                let playState: AyahPlayState = 'idle';
                
                // If per-ayah player is active on this ayah
                if (activeAyahNum === ayah.numberInSurah) {
                  if (ayahAudioLoading) playState = 'loading';
                  else if (ayahAudioMode === 'loop') playState = 'playing_loop';
                  else if (ayahAudioMode === 'seq') playState = 'playing_seq';
                } else if (isPlaying && currentPlayingAyah?.numberInSurah === ayah.numberInSurah) {
                  // If full surah audio player is playing this exact ayah
                  playState = 'playing_seq';
                }

                return (
                  <div
                    key={ayah.number}
                    ref={el => { ayahRefs.current[ayah.number] = el; }}
                  >
                    <AyahCard
                      ayah={ayah}
                      playState={playState}
                      isBookmarked={bookmarks.includes(ayah.number)}
                      tajweedEnabled={tajweedEnabled}
                      fontSize={fontSize}
                      showTranslation={showTranslation}
                      onPlay={handlePlayAyah}
                      onToggleBookmark={handleToggleBookmark}
                    />
                  </div>
                );
              })}
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

      {/* Reciter Modal */}
      <ReciterModal
        isOpen={isReciterModalOpen}
        onClose={() => setIsReciterModalOpen(false)}
        selectedReciter={selectedReciter}
        onSelectReciter={handleSelectReciter}
        onSelectSurah={handleSelectSurah}
      />

      {/* Persistent Audio Player for Full Surah */}
      <AudioStudioPlayer
        currentReciter={selectedReciter}
        currentSurah={selectedSurah}
        currentAyah={currentPlayingAyah}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNextSurah={handleNextSurah}
        onPrevSurah={handlePrevSurah}
        onSelectReciterModal={() => setIsReciterModalOpen(true)}
        onTimeUpdate={handleSurahTimeUpdate}
      />
    </div>
  );
};

export default App;
