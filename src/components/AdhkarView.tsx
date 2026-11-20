import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, List, RotateCcw, Share2, Star, Check, Play, Pause, Loader2 } from 'lucide-react';
import { MORNING_ADHKAR, EVENING_ADHKAR, DhikrItem } from '../data/adhkarData';
import { getDhikrAudioUrl } from '../utils/adhkarAudioHelper';

interface AdhkarViewProps {
  onBack: () => void;
}

export const AdhkarView: React.FC<AdhkarViewProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'morning' | 'evening'>('morning');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Track read count for each dhikr (starts from 0 -> 1 -> 2 -> ... -> target)
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isListViewOpen, setIsListViewOpen] = useState<boolean>(false);
  const [completedAnimation, setCompletedAnimation] = useState<boolean>(false);

  // Audio Playback State via real HTML5 Audio Element
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentList: DhikrItem[] = mode === 'morning' ? MORNING_ADHKAR : EVENING_ADHKAR;
  const currentDhikr = currentList[currentIndex] || currentList[0];
  const itemKey = `${mode}_${currentDhikr.id}`;

  // Current count starting from 0
  const currentCount = counts[itemKey] || 0;
  const target = currentDhikr.repeatCount;
  const isCompleted = currentCount >= target;

  // Stop audio and SpeechSynthesis whenever changing dhikr or mode
  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.removeAttribute('src');
    }
    setIsPlayingAudio(false);
    setIsLoadingAudio(false);
  };

  // Play text via local built-in SpeechSynthesis (100% offline on Android & browser)
  const speakTextOffline = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsLoadingAudio(false);
      setIsPlayingAudio(false);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const clean = text
        .replace(/[۝۞۩•]/g, '')
        .replace(/[\n\r]+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'ar-SA'; // Arabic
      utterance.rate = 0.88; // Slightly calm and melodious recitation pace

      // Try finding Arabic voice if available
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onstart = () => {
        setIsLoadingAudio(false);
        setIsPlayingAudio(true);
      };

      utterance.onend = () => {
        setIsPlayingAudio(false);
        setIsLoadingAudio(false);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setIsLoadingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
      setIsPlayingAudio(false);
      setIsLoadingAudio(false);
    }
  };

  useEffect(() => {
    stopAudio();
  }, [currentIndex, mode]);

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Audio toggle handler using 100% reliable HTML5 Audio MP3
  const handleTogglePlay = () => {
    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    const audioUrl = getDhikrAudioUrl(mode, currentDhikr.id, currentDhikr.arabic);
    if (!audioUrl) return;

    stopAudio();
    setIsLoadingAudio(true);

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.oncanplay = () => {
      setIsLoadingAudio(false);
    };

    audio.onended = () => {
      setIsPlayingAudio(false);
      setIsLoadingAudio(false);
    };

    audio.onerror = () => {
      console.warn('Audio stream error/offline, falling back to local SpeechSynthesis');
      // If network audio fails (e.g. offline with no connection), fallback to offline SpeechSynthesis
      speakTextOffline(currentDhikr.arabic);
    };

    audio.play()
      .then(() => {
        setIsPlayingAudio(true);
        setIsLoadingAudio(false);
      })
      .catch((err) => {
        console.warn('Audio play error, using offline TTS fallback:', err);
        speakTextOffline(currentDhikr.arabic);
      });
  };

  // Load saved counts & favorites
  useEffect(() => {
    try {
      const saved = localStorage.getItem('adhkar_upwards_counts');
      if (saved) setCounts(JSON.parse(saved));
      const favs = localStorage.getItem('adhkar_favorites');
      if (favs) setFavorites(JSON.parse(favs));
    } catch {}
  }, []);

  // Save on count change
  const saveCounts = (updated: Record<string, number>) => {
    setCounts(updated);
    try {
      localStorage.setItem('adhkar_upwards_counts', JSON.stringify(updated));
    } catch {}
  };

  // Handle tap on the counter button: 0 -> 1 -> 2 -> ... -> target
  const handleCountTap = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(40);
    }

    if (currentCount < target) {
      const nextCount = currentCount + 1;
      const updated = { ...counts, [itemKey]: nextCount };
      saveCounts(updated);

      if (nextCount >= target) {
        // Target reached!
        setCompletedAnimation(true);
        setTimeout(() => {
          setCompletedAnimation(false);
          // Auto advance to next dhikr
          if (currentIndex < currentList.length - 1) {
            setCurrentIndex(prev => prev + 1);
          }
        }, 600);
      }
    }
  };

  // Reset current dhikr count back to 0
  const handleResetCurrent = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...counts, [itemKey]: 0 };
    saveCounts(updated);
  };

  // Toggle favorite
  const toggleFavorite = () => {
    let updated: number[];
    if (favorites.includes(currentDhikr.id)) {
      updated = favorites.filter(id => id !== currentDhikr.id);
    } else {
      updated = [...favorites, currentDhikr.id];
    }
    setFavorites(updated);
    try {
      localStorage.setItem('adhkar_favorites', JSON.stringify(updated));
    } catch {}
  };

  // Share dhikr
  const handleShare = async () => {
    const text = `${currentDhikr.arabic}\n\nترجمہ: ${currentDhikr.urduTranslation}\n\n(حوالہ: ${currentDhikr.reference || ''})\n\n"صوت القرآن" ایپ سے شیئر کیا گیا`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'صبح و شام کے اذکار', text });
      } catch {}
    } else {
      navigator.clipboard.writeText(text);
      alert('ذکر کاپی ہو گیا ہے!');
    }
  };

  // Circular progress (fills up from 0% to 100%)
  const progressRatio = target > 0 ? Math.min(1, currentCount / target) : 0;
  const circleRadius = 40;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="min-h-screen bg-[#f8fbfa] dark:bg-[#07130e] text-[#1b382b] dark:text-[#e1eee6] flex flex-col font-sans select-none pb-28">
      {/* ─── Top Header (Matching user's screenshot) ─── */}
      <header className="sticky top-0 z-30 bg-[#f8fbfa] dark:bg-[#07130e] border-b border-[#009688]/20 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-200"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Title & Mode Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setMode('morning'); setCurrentIndex(0); }}
            className={`text-base font-bold font-arabic px-3 py-1 rounded-full transition-all ${
              mode === 'morning'
                ? 'bg-[#009688] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
            }`}
          >
            صبح کے اذکار
          </button>
          <button
            onClick={() => { setMode('evening'); setCurrentIndex(0); }}
            className={`text-base font-bold font-arabic px-3 py-1 rounded-full transition-all ${
              mode === 'evening'
                ? 'bg-[#009688] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
            }`}
          >
            شام کے اذکار
          </button>
        </div>

        {/* Action icons on top right */}
        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200">
          <button
            onClick={() => setIsListViewOpen(prev => !prev)}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title="فہرست دیکھیں"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ─── Main Content Container ─── */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-between overflow-y-auto">
        <div className="w-full flex flex-col items-center text-center space-y-6 pt-2">
          
          {/* 1. Main Arabic Text & Target Count like (100x) */}
          <div className="space-y-3 w-full">
            <h2
              className="text-2xl sm:text-3xl font-bold font-arabic leading-relaxed text-[#102a20] dark:text-[#f0fdf4] px-2 select-text"
              style={{ lineHeight: 2.1 }}
            >
              {currentDhikr.arabic}
            </h2>

            <div className="text-xl sm:text-2xl font-bold text-[#009688] tracking-wider font-sans">
              ({currentDhikr.repeatCount}x)
            </div>
          </div>

          {/* 2. Three Floral Decorative Stars (✿ ✿ ✿) */}
          <div className="flex items-center justify-center gap-2 text-[#009688] py-2">
            <span className="text-xl">✿</span>
            <span className="text-2xl">✿</span>
            <span className="text-xl">✿</span>
          </div>

          {/* 3. Urdu Translation */}
          <div className="w-full px-2 text-right">
            <p
              className="text-base sm:text-lg font-arabic text-gray-800 dark:text-gray-200 leading-loose select-text"
              style={{ lineHeight: 2.0 }}
            >
              {currentDhikr.urduTranslation}
            </p>
          </div>

          {/* 4. References & Virtues Section (حوالہ جات) */}
          <div className="w-full pt-4 border-t border-[#009688]/15 text-center space-y-2">
            <h4 className="text-sm font-bold text-[#009688] tracking-wide font-sans">
              حوالہ جات
            </h4>
            {currentDhikr.note && (
              <p className="text-xs sm:text-sm font-arabic text-amber-600 dark:text-amber-400 font-semibold px-4">
                📜 {currentDhikr.note}
              </p>
            )}
            {currentDhikr.reference && (
              <p className="text-xs font-semibold text-[#00796b] dark:text-[#4db6ac] font-arabic">
                ({currentDhikr.reference})
              </p>
            )}
          </div>
        </div>
      </main>

      {/* ─── Interactive Floating Bottom Counter & Controls ─── */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#f8fbfa]/95 dark:bg-[#07130e]/95 backdrop-blur-md border-t border-[#009688]/20 px-4 py-3 flex items-center justify-between max-w-xl mx-auto">
        
        {/* Left: Progress index (e.g. 20/22) and Audio Play button */}
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300 font-sans">
            {currentIndex + 1}/{currentList.length}
          </span>

          {/* 🎧 Play / Pause Button exactly like in screenshot */}
          <button
            onClick={handleTogglePlay}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isPlayingAudio
                ? 'bg-[#009688] text-white animate-pulse shadow-md ring-2 ring-[#009688]/40'
                : 'bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-[#009688] hover:text-white'
            }`}
            title={isPlayingAudio ? 'آڈیو روکیں' : 'ذکر سنیں'}
          >
            {isLoadingAudio ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#009688]" />
            ) : isPlayingAudio ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => {
              if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
            }}
            disabled={currentIndex === 0}
            className="p-1 rounded-full text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-30"
            title="پچھلا ذکر"
          >
            ❮
          </button>
        </div>

        {/* Center: The Signature Circular Touch Counter (0 -> 1 -> 2 -> ... -> target) */}
        <div className="relative -top-4 flex flex-col items-center">
          <button
            onClick={handleCountTap}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 relative ${
              isCompleted
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/50'
                : 'bg-white dark:bg-[#0e271c] text-[#009688] border-2 border-[#009688]/30 hover:border-[#009688]'
            } ${completedAnimation ? 'animate-bounce' : ''}`}
            aria-label="Tap to count from 0 upwards"
          >
            {/* SVG Circular Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 90 90">
              <circle
                cx="45"
                cy="45"
                r={circleRadius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3.5"
                className="text-[#009688]/15"
              />
              <circle
                cx="45"
                cy="45"
                r={circleRadius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-[#009688] transition-all duration-150"
              />
            </svg>

            {/* Inner Number: 0, 1, 2, ... or Checkmark on completion */}
            {isCompleted ? (
              <div className="flex flex-col items-center">
                <Check className="w-8 h-8 stroke-[3]" />
                <span className="text-[10px] font-bold font-sans">{target}/{target}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black font-sans tracking-tight">
                  {currentCount}
                </span>
                <span className="text-[9px] text-[#009688]/80 dark:text-[#4db6ac] font-bold font-sans">
                  / {target}
                </span>
              </div>
            )}
          </button>

          {/* Reset button under counter */}
          <button
            onClick={handleResetCurrent}
            className="mt-1 text-[11px] text-gray-400 hover:text-[#009688] flex items-center gap-0.5 transition-colors"
            title="دوبارہ 0 سے شروع کریں"
          >
            <RotateCcw className="w-3 h-3" />
            <span>ری سیٹ (0)</span>
          </button>
        </div>

        {/* Right: Next button, Star & Share */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentIndex < currentList.length - 1) setCurrentIndex(prev => prev + 1);
            }}
            disabled={currentIndex === currentList.length - 1}
            className="p-1 rounded-full text-gray-500 hover:text-black dark:hover:text-white disabled:opacity-30"
            title="اگلا ذکر"
          >
            ❯
          </button>

          <button
            onClick={toggleFavorite}
            className={`p-1.5 rounded-full transition-colors ${
              favorites.includes(currentDhikr.id)
                ? 'text-amber-500 fill-amber-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="محفوظ کریں"
          >
            <Star className={`w-5 h-5 ${favorites.includes(currentDhikr.id) ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-1.5 rounded-full text-gray-400 hover:text-[#009688] transition-colors"
            title="شیئر کریں"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* ─── Drawer Modal: All Adhkar List ─── */}
      {isListViewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-[#f8fbfa] dark:bg-[#07130e] h-full shadow-2xl flex flex-col p-4 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#009688]/20">
              <h3 className="font-bold font-arabic text-lg text-[#009688]">
                {mode === 'morning' ? 'صبح کے تمام اذکار' : 'شام کے تمام اذکار'} ({currentList.length})
              </h3>
              <button
                onClick={() => setIsListViewOpen(false)}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 py-3">
              {currentList.map((item, idx) => {
                const k = `${mode}_${item.id}`;
                const c = counts[k] || 0;
                const done = c >= item.repeatCount;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsListViewOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl flex items-center justify-between text-right border transition-all ${
                      idx === currentIndex
                        ? 'bg-[#009688]/15 border-[#009688] text-[#009688]'
                        : 'bg-white dark:bg-[#0e271c] border-black/5 dark:border-white/5 hover:border-[#009688]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        done
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#009688]/10 text-[#009688]'
                      }`}>
                        {done ? '✓' : `${c}/${item.repeatCount}`}
                      </span>
                    </div>

                    <div className="flex-1 pr-3">
                      <p className="font-arabic font-bold text-sm text-gray-800 dark:text-gray-200 line-clamp-1">
                        {item.arabic}
                      </p>
                      <p className="text-[11px] text-gray-500 font-sans mt-0.5">
                        ہدف: {item.repeatCount} مرتبہ • {item.reference || ''}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
