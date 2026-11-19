import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Surah, Ayah, Reciter } from './types/quran';
import { SURAH_LIST } from './data/surahs';
import { RECITERS_LIST } from './data/reciters';
import { AyahCard, AyahPlayState } from './components/AyahCard';
import { AudioStudioPlayer } from './components/AudioStudioPlayer';
import { ReciterModal } from './components/ReciterModal';
import { SurahSidebar } from './components/SurahSidebar';
import { TajweedGuide } from './components/TajweedGuide';
import { HomeDashboard } from './components/HomeDashboard';
import { AdmissionModal } from './components/AdmissionModal';
import { PrayerTimesView } from './components/PrayerTimesView';
import { JuzIndexView } from './components/JuzIndexView';
import { SurahIndexView } from './components/SurahIndexView';
import { GotoPageModal } from './components/GotoPageModal';
import { BookmarksView, AyahBookmarkItem } from './components/BookmarksView';
import { MushafPageView } from './components/MushafPageView';
import { getPrayerTimes, getHijriDate } from './utils/prayerTimes';
import { JUZ_LIST, JuzInfo } from './data/juz';
import { getSurahStartPage } from './data/surahPages';
import { getPageMeta } from './data/pageMeta';
import { Home } from 'lucide-react';
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
  Info,
  Play,
  Pause,
  RotateCcw
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
    const lastPage = Number(localStorage.getItem('quran_mushaf_last_page'));
    if (lastPage >= 1 && lastPage <= 604) {
      const meta = getPageMeta(lastPage);
      const s = SURAH_LIST.find(item => item.number === meta.surahNumber);
      if (s) return s;
    }
    const n = Number(localStorage.getItem(LS_SURAH));
    if (n >= 1 && n <= 114) return SURAH_LIST[n - 1];
  } catch {}
  return SURAH_LIST[0];
}

export const App: React.FC = () => {
  // Navigation View State: 'home' | 'quran' | 'prayer_times' | 'juz_index' | 'surah_index' | 'bookmarks'
  const [currentView, setCurrentView] = useState<'home' | 'quran' | 'prayer_times' | 'juz_index' | 'surah_index' | 'bookmarks' | 'mushaf_page'>('home');
  const [currentMushafPage, setCurrentMushafPage] = useState<number>(1);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('admission_modal_dismissed');
    } catch {
      return false;
    }
  });
  const [isGotoPageOpen, setIsGotoPageOpen] = useState<boolean>(false);
  const [savedBookmarks, setSavedBookmarks] = useState<AyahBookmarkItem[]>(() => {
    try {
      const data = localStorage.getItem('quran_saved_bookmarks_v2');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  });
  const [pageBookmarks, setPageBookmarks] = useState<number[]>(() => {
    try {
      const data = localStorage.getItem('quran_mushaf_page_bookmarks');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  });

  const prayerTimes = getPrayerTimes();
  const hijriDate = getHijriDate();

  const handleToggleSavedBookmark = (ayahNumber: number) => {
    const existingIndex = savedBookmarks.findIndex(b => b.surahNumber === selectedSurah.number && b.ayahNumber === ayahNumber);
    let updated: AyahBookmarkItem[];
    if (existingIndex >= 0) {
      updated = savedBookmarks.filter((_, idx) => idx !== existingIndex);
    } else {
      const newBm: AyahBookmarkItem = {
        id: `${selectedSurah.number}_${ayahNumber}_${Date.now()}`,
        surahNumber: selectedSurah.number,
        surahName: selectedSurah.name,
        ayahNumber: ayahNumber,
        timestamp: new Date().toLocaleDateString('ur-PK', { month: 'short', day: 'numeric' })
      };
      updated = [newBm, ...savedBookmarks];
    }
    setSavedBookmarks(updated);
    try {
      localStorage.setItem('quran_saved_bookmarks_v2', JSON.stringify(updated));
    } catch {}
  };

  const handleSelectJuz = (juz: JuzInfo) => {
    setCurrentMushafPage(juz.page);
    setCurrentView('mushaf_page');
  };

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

  // Ta'awwuz & Tasmiyah Intro Player State
  const [introAudioType, setIntroAudioType] = useState<'taawuz' | 'tasmiyah' | null>(null);
  const [isIntroPlaying, setIsIntroPlaying] = useState<boolean>(false);
  const introAudioRef = useRef<HTMLAudioElement | null>(null);

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

  // Stop intro audio (Taawwuz / Tasmiyah)
  const stopIntroAudio = useCallback(() => {
    if (introAudioRef.current) {
      introAudioRef.current.pause();
      introAudioRef.current.src = '';
      introAudioRef.current = null;
    }
    setIntroAudioType(null);
    setIsIntroPlaying(false);
  }, []);

  // Play Ta'awwuz or Tasmiyah for kids / repetition
  const handlePlayIntro = useCallback((type: 'taawuz' | 'tasmiyah') => {
    // If currently playing the same type -> stop it
    if (isIntroPlaying && introAudioType === type) {
      stopIntroAudio();
      return;
    }

    // Stop other audio streams
    stopIntroAudio();
    stopAyahAudio();
    setIsPlaying(false);
    setCurrentPlayingAyah(null);

    const audioUrl = type === 'tasmiyah' ? '/audio/tasmiyah.mp3' : '/audio/taawuz.mp3';
    const audio = new Audio(audioUrl);
    introAudioRef.current = audio;
    setIntroAudioType(type);
    setIsIntroPlaying(true);

    audio.onended = () => {
      setIntroAudioType(null);
      setIsIntroPlaying(false);
    };

    audio.onerror = () => {
      setIntroAudioType(null);
      setIsIntroPlaying(false);
    };

    audio.play().catch(err => {
      console.warn('Intro playback error:', err);
      setIntroAudioType(null);
      setIsIntroPlaying(false);
    });
  }, [isIntroPlaying, introAudioType, stopIntroAudio, stopAyahAudio]);

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
        const res  = await fetch(`/quran/${selectedSurah.number}.json?v=2`);
        const data = await res.json();
        if (cancelled) return;

        const parsed: Ayah[] = [];
        const count = data.count || selectedSurah.numberOfAyahs;

        for (let i = 1; i <= count; i++) {
          let arabic = data.verse?.[`verse_${i}`] || '';
          const urdu   = urduDictRef.current[`${selectedSurah.number}:${i}`] || '';
          
          // Surah 1 (Al-Fatihah) mein Bismillah aayat #1 ka hissa hai
          // Baqi surahs (Surah 2-114) mein aayat #1 se pehle lagi Bismillah hata di jaye
          if (selectedSurah.number !== 1 && i === 1) {
            arabic = arabic.replace(/^بِسْمِ\s*ٱللَّهِ\s*ٱلرَّحْمَٰنِ\s*ٱلرَّحِيمِ\s*/, '');
          }

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
    // Per-ayah audio not available for this reciter → abort silently
    if (!url) {
      setAyahAudioLoading(false);
      return;
    }
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
      // Intelligent text-length weighted sync for reciters without timing API
      let totalLen = 0;
      const cumulativeLengths = ayahs.map(a => {
        // Strip tashkeel and spaces for accurate pronunciation weight
        const pureLen = (a.text || '').replace(/[\s\u064B-\u065F\u0670]/g, '').length || 15;
        totalLen += pureLen;
        return totalLen;
      });

      const target = (currentTimeSec / durationSec) * totalLen;
      let matchedIdx = cumulativeLengths.findIndex(cum => cum >= target);
      if (matchedIdx === -1) matchedIdx = ayahs.length - 1;
      activeNum = ayahs[matchedIdx].numberInSurah;
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

  
  
  // Render 16-Line Authentic Tajweed Mushaf Page View
  if (currentView === 'mushaf_page') {
    return (
      <MushafPageView
        initialPage={currentMushafPage}
        onBack={() => setCurrentView('home')}
        onPageChange={(page) => {
          setCurrentMushafPage(page);
          const meta = getPageMeta(page);
          const s = SURAH_LIST.find(item => item.number === meta.surahNumber);
          if (s && s.number !== selectedSurah.number) {
            setSelectedSurah(s);
          }
        }}
      />
    );
  }

  // Render Prayer Times View
  if (currentView === 'prayer_times') {
    return (
      <PrayerTimesView
        prayerTimes={prayerTimes}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  // Render Juz Index View
  if (currentView === 'juz_index') {
    return (
      <JuzIndexView
        onSelectJuz={handleSelectJuz}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  // Render Surah Index View
  if (currentView === 'surah_index') {
    return (
      <>
        <SurahIndexView
          surahs={SURAH_LIST}
          selectedReciter={selectedReciter}
          onSelectSurah={(surah, mode) => {
            handleSelectSurah(surah);
            if (mode === 'read') {
              const startPage = getSurahStartPage(surah.number);
              setCurrentMushafPage(startPage);
              setCurrentView('mushaf_page');
            } else {
              setCurrentView('quran');
              setTimeout(() => {
                setIsPlaying(true);
              }, 300);
            }
          }}
          onChangeReciter={() => setIsReciterModalOpen(true)}
          onBack={() => setCurrentView('home')}
        />
        <ReciterModal
          isOpen={isReciterModalOpen}
          onClose={() => setIsReciterModalOpen(false)}
          selectedReciter={selectedReciter}
          onSelectReciter={handleSelectReciter}
          onSelectSurah={handleSelectSurah}
        />
      </>
    );
  }

  // Render Bookmarks View
  if (currentView === 'bookmarks') {
    return (
      <BookmarksView
        ayahBookmarks={savedBookmarks}
        pageBookmarks={pageBookmarks}
        onSelectAyahBookmark={(surahNum, ayahNum) => {
          const s = SURAH_LIST.find(item => item.number === surahNum);
          if (s) setSelectedSurah(s);
          setCurrentView('quran');
          setTimeout(() => {
            const el = ayahRefs.current[ayahNum];
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 400);
        }}
        onSelectPageBookmark={(page) => {
          setCurrentMushafPage(page);
          setCurrentView('mushaf_page');
        }}
        onRemoveAyahBookmark={(id) => {
          const updated = savedBookmarks.filter(b => b.id !== id);
          setSavedBookmarks(updated);
          localStorage.setItem('quran_saved_bookmarks_v2', JSON.stringify(updated));
        }}
        onRemovePageBookmark={(page) => {
          const updated = pageBookmarks.filter(p => p !== page);
          setPageBookmarks(updated);
          localStorage.setItem('quran_mushaf_page_bookmarks', JSON.stringify(updated));
        }}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  // Render Home Dashboard View
  if (currentView === 'home') {
    return (
      <>
        <HomeDashboard
          hijriDate={hijriDate}
          prayerTimes={prayerTimes}
          lastReadSurah={selectedSurah}
          lastReadJuz={(() => {
            try {
              const saved = Number(localStorage.getItem('quran_mushaf_last_page')) || 1;
              return getPageMeta(saved).juzNumber;
            } catch {
              return 1;
            }
          })()}
          onResumeReading={() => {
            try {
              const saved = Number(localStorage.getItem('quran_mushaf_last_page'));
              if (saved >= 1 && saved <= 604) {
                setCurrentMushafPage(saved);
                const meta = getPageMeta(saved);
                const s = SURAH_LIST.find(item => item.number === meta.surahNumber);
                if (s) setSelectedSurah(s);
              } else {
                setCurrentMushafPage(1);
              }
            } catch {
              setCurrentMushafPage(1);
            }
            setCurrentView('mushaf_page');
          }}
          onOpenJuzIndex={() => setCurrentView('juz_index')}
          onOpenSurahIndex={() => setCurrentView('surah_index')}
          onOpenGotoPage={() => setIsGotoPageOpen(true)}
          onOpenBookmarks={() => {
            try {
              const data = localStorage.getItem('quran_mushaf_page_bookmarks');
              if (data) setPageBookmarks(JSON.parse(data));
            } catch {}
            setCurrentView('bookmarks');
          }}
          onOpenPrayerTimes={() => setCurrentView('prayer_times')}
          onOpenAdmissionModal={() => setIsAdmissionModalOpen(true)}
        />

        {/* Admission Popup on App Launch */}
        <AdmissionModal
          isOpen={isAdmissionModalOpen}
          onClose={() => {
            setIsAdmissionModalOpen(false);
            try { sessionStorage.setItem('admission_modal_dismissed', '1'); } catch {}
          }}
        />

        {/* Goto Page Modal */}
        <GotoPageModal
          isOpen={isGotoPageOpen}
          onClose={() => setIsGotoPageOpen(false)}
          onGoToPage={(pageNum, surahNum) => {
            const s = SURAH_LIST.find(item => item.number === surahNum) || SURAH_LIST[0];
            setSelectedSurah(s);
            setCurrentMushafPage(pageNum);
            setCurrentView('mushaf_page');
          }}
        />

        {/* Audio Player in Background if already playing */}
        {isPlaying && (
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
        )}

        {/* Reciter Modal Accessible from Home if player opened it */}
        <ReciterModal
          isOpen={isReciterModalOpen}
          onClose={() => setIsReciterModalOpen(false)}
          selectedReciter={selectedReciter}
          onSelectReciter={handleSelectReciter}
          onSelectSurah={handleSelectSurah}
        />
      </>
    );
  }

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
        <header className="sticky top-0 z-20 bg-[#0a121e]/95 backdrop-blur-xl border-b border-slate-800/80 px-3 md:px-8 py-3 flex items-center justify-between shadow-lg">
          {/* Back to Home Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-1.5 bg-[#1b7a4b] hover:bg-[#14603b] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
              title="مین مینو پر جائیں"
            >
              <Home className="w-4 h-4" />
              <span>ہوم مینو</span>
            </button>
          </div>
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
              {/* Ta'awwuz & Tasmiyah Interactive Player for Kids / Repetition */}
              <div className="mt-8 pt-6 border-t border-slate-700/60 flex flex-col items-center gap-5 w-full">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">قبلِ تلاوت</p>

                {/* Ta'awwuz (A'udhu billah) */}
                <div className="relative w-full max-w-lg group">
                  {/* Number badge */}
                  <span className="absolute -top-3 right-4 w-7 h-7 rounded-full bg-[#1a2d4a] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] text-sm font-bold z-10">١</span>
                  <div className={`flex flex-row-reverse items-center justify-between gap-4 rounded-2xl px-5 py-4 border transition-all duration-300 ${
                    isIntroPlaying && introAudioType === 'taawuz'
                      ? 'bg-[#0d1f33] border-rose-500/60 shadow-lg shadow-rose-500/10'
                      : 'bg-[#0a1726] border-slate-600/50 hover:border-[#d4af37]/50 hover:shadow-lg hover:shadow-[#d4af37]/5'
                  }`}>
                    <button
                      type="button"
                      onClick={() => handlePlayIntro('taawuz')}
                      className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                        isIntroPlaying && introAudioType === 'taawuz'
                          ? 'bg-rose-500 text-white animate-pulse scale-105'
                          : 'bg-[#d4af37] text-black hover:bg-yellow-400 hover:scale-110'
                      }`}
                      title={isIntroPlaying && introAudioType === 'taawuz' ? 'روکیں' : 'تعوذ سنیں'}
                    >
                      {isIntroPlaying && introAudioType === 'taawuz' ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1 text-right">
                      <p className="arabic-quran-text text-2xl md:text-3xl text-slate-100 leading-loose tracking-wide">
                        أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 font-medium">
                        میں اللہ کی پناہ مانگتا ہوں شیطان مردود سے &nbsp;—&nbsp; <span className="text-[#d4af37]/80">تعوذ</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tasmiyah (Bismillah) */}
                {selectedSurah.number !== 9 && (
                  <div className="relative w-full max-w-lg group">
                    <span className="absolute -top-3 right-4 w-7 h-7 rounded-full bg-[#1a2d4a] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] text-sm font-bold z-10">٢</span>
                    <div className={`flex flex-row-reverse items-center justify-between gap-4 rounded-2xl px-5 py-4 border transition-all duration-300 ${
                      isIntroPlaying && introAudioType === 'tasmiyah'
                        ? 'bg-[#0d1f33] border-rose-500/60 shadow-lg shadow-rose-500/10'
                        : 'bg-[#0a1726] border-slate-600/50 hover:border-[#d4af37]/50 hover:shadow-lg hover:shadow-[#d4af37]/5'
                    }`}>
                      <button
                        type="button"
                        onClick={() => handlePlayIntro('tasmiyah')}
                        className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                          isIntroPlaying && introAudioType === 'tasmiyah'
                            ? 'bg-rose-500 text-white animate-pulse scale-105'
                            : 'bg-[#d4af37] text-black hover:bg-yellow-400 hover:scale-110'
                        }`}
                        title={isIntroPlaying && introAudioType === 'tasmiyah' ? 'روکیں' : 'تسمیہ سنیں'}
                      >
                        {isIntroPlaying && introAudioType === 'tasmiyah' ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1 text-right">
                        <p className="arabic-quran-text text-2xl md:text-3xl text-[#d4af37] leading-loose tracking-wide">
                          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium">
                          اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے &nbsp;—&nbsp; <span className="text-[#d4af37]/80">تسمیہ</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                    ref={el => { ayahRefs.current[ayah.numberInSurah] = el; }}
                  >
                    <AyahCard
                      ayah={ayah}
                      playState={playState}
                      isBookmarked={bookmarks.includes(ayah.number)}
                      tajweedEnabled={tajweedEnabled}
                      fontSize={fontSize}
                      showTranslation={showTranslation}
                      hasPerAyahAudio={!!getAyahAudioUrl(selectedReciter.id, selectedSurah.number, 1)}
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
