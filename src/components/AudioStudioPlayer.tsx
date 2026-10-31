import React, { useRef, useState, useEffect } from 'react';
import { Reciter, Surah, Ayah } from '../types/quran';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Download,
  Loader2,
  Sparkles,
  WifiOff,
  AlertCircle
} from 'lucide-react';
import { getAyahAudioUrl } from '../utils/ayahAudioHelper';

interface AudioStudioPlayerProps {
  currentReciter: Reciter;
  currentSurah: Surah;
  currentAyah: Ayah | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextSurah: () => void;
  onPrevSurah: () => void;
  onSelectReciterModal: () => void;
  currentAyahIndex: number; // 1-based (1 to currentSurah.numberOfAyahs)
  onAyahChange: (ayahNum: number) => void;
}

export const AudioStudioPlayer: React.FC<AudioStudioPlayerProps> = ({
  currentReciter,
  currentSurah,
  currentAyah,
  isPlaying,
  onTogglePlay,
  onNextSurah,
  onPrevSurah,
  onSelectReciterModal,
  currentAyahIndex,
  onAyahChange
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(false); // loop current ayah or surah
  const [audioError, setAudioError] = useState<boolean>(false);

  // Compute exact URL for this specific ayah of this reciter
  const ayahSrc = getAyahAudioUrl(
    currentReciter.id,
    currentSurah.number,
    currentAyahIndex || 1
  );

  // Reload audio element whenever ayahSrc changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setAudioError(false);
    setCurrentTime(0);
    setDuration(0);

    audio.src = ayahSrc;
    audio.load();

    if (isPlaying) {
      setIsLoadingAudio(true);
      audio.play()
        .then(() => setIsLoadingAudio(false))
        .catch(() => setIsLoadingAudio(false));
    }
  }, [ayahSrc]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Play / Pause toggle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      setIsLoadingAudio(true);
      audio.play()
        .then(() => setIsLoadingAudio(false))
        .catch(() => setIsLoadingAudio(false));
    } else {
      audio.pause();
      setIsLoadingAudio(false);
    }
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  // CRITICAL: When the current ayah finishes, advance to the NEXT ayah!
  // This guarantees 100% exact sync - ayah only changes when the reciter finishes its last word!
  const handleAyahEnded = () => {
    if (isLooping) {
      // Loop same ayah
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
      return;
    }

    if (currentAyahIndex < currentSurah.numberOfAyahs) {
      onAyahChange(currentAyahIndex + 1);
    } else {
      // End of surah -> advance to next surah
      onNextSurah();
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setIsLoadingAudio(false);
    }
  };

  const handleCanPlay = () => {
    setIsLoadingAudio(false);
    setAudioError(false);
  };

  const handleError = () => {
    setIsLoadingAudio(false);
    setAudioError(true);
  };

  const handleWaiting = () => setIsLoadingAudio(true);

  // Controls
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetAyah = parseInt(e.target.value, 10);
    if (targetAyah >= 1 && targetAyah <= currentSurah.numberOfAyahs) {
      onAyahChange(targetAyah);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    setIsMuted(v === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5];
    const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    setPlaybackSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a111c]/95 backdrop-blur-xl border-t border-[#d4af37]/25 shadow-2xl px-4 py-3 md:py-4 transition-all">
      {/* Audio element for continuous ayah-by-ayah streaming */}
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onError={handleError}
        onEnded={handleAyahEnded}
      />

      {audioError && (
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 mb-2 px-4 py-2 bg-amber-950/70 border border-amber-500/50 rounded-xl text-amber-200 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>آیت نمبر {currentAyahIndex} کی آڈیو لوڈ کرنے میں دشواری پیش آئی۔ اگلی آیت پر منتقل ہو رہے ہیں...</span>
          </div>
          <button
            onClick={() => onAyahChange(currentAyahIndex + 1)}
            className="px-3 py-1 bg-[#d4af37] text-black font-semibold rounded-lg hover:bg-[#e5c158] transition-all shrink-0"
          >
            اگلی آیت چلائیں
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* LEFT: Reciter & Surah Info */}
        <div className="flex items-center space-x-3 w-full md:w-1/3 justify-between md:justify-start">
          <div
            onClick={onSelectReciterModal}
            className="cursor-pointer group flex items-center space-x-3 p-1.5 rounded-xl hover:bg-[#152238] transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#996515] to-[#d4af37] p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0d1624] rounded-[10px] flex items-center justify-center group-hover:bg-transparent transition-all">
                <Sparkles className="w-5 h-5 text-[#d4af37] group-hover:text-black transition-colors" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm text-white hover:text-[#d4af37] transition-colors truncate max-w-[140px] sm:max-w-[180px]">
                  {currentReciter.arabicName || currentReciter.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#d4af37]/20 text-[#d4af37] rounded-full border border-[#d4af37]/30 shrink-0">
                  آیت {currentAyahIndex} از {currentSurah.numberOfAyahs}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                سورۃ {currentSurah.name} — {currentSurah.englishName}
              </p>
            </div>
          </div>

          <a
            href={ayahSrc}
            download={`Surah_${currentSurah.number}_Ayah_${currentAyahIndex}.mp3`}
            target="_blank"
            rel="noreferrer"
            title="ڈاؤنلوڈ MP3"
            className="md:hidden p-2 rounded-lg bg-[#142032] text-slate-300 hover:text-white"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>

        {/* CENTER: Controls & Verse Timeline Slider */}
        <div className="flex flex-col items-center w-full md:w-2/5">
          <div className="flex items-center space-x-4 mb-1">
            {/* Speed */}
            <button
              onClick={cycleSpeed}
              className="text-xs font-semibold px-2 py-1 rounded bg-[#162236] text-slate-300 hover:text-[#d4af37] border border-slate-700/50"
              title="رفتار تبدیل کریں"
            >
              {playbackSpeed}x
            </button>

            {/* Prev Ayah / Prev Surah */}
            <button
              onClick={() => {
                if (currentAyahIndex > 1) {
                  onAyahChange(currentAyahIndex - 1);
                } else {
                  onPrevSurah();
                }
              }}
              className="p-2 text-slate-300 hover:text-white hover:scale-110 transition-all"
              title="پچھلی آیت"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={onTogglePlay}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg bg-gradient-to-tr from-[#b8860b] via-[#d4af37] to-[#f5d77f] text-black shadow-[#d4af37]/25 hover:scale-105 active:scale-95"
            >
              {isLoadingAudio ? (
                <Loader2 className="w-6 h-6 animate-spin text-black" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 fill-black" />
              ) : (
                <Play className="w-6 h-6 fill-black ml-0.5" />
              )}
            </button>

            {/* Next Ayah / Next Surah */}
            <button
              onClick={() => {
                if (currentAyahIndex < currentSurah.numberOfAyahs) {
                  onAyahChange(currentAyahIndex + 1);
                } else {
                  onNextSurah();
                }
              }}
              className="p-2 text-slate-300 hover:text-white hover:scale-110 transition-all"
              title="اگلی آیت"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Loop Ayah */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-2 transition-all ${
                isLooping ? 'text-[#d4af37] scale-110' : 'text-slate-400 hover:text-slate-200'
              }`}
              title={isLooping ? 'لوپ بند کریں' : 'اسی آیت کو بار بار دہرائیں (Loop Ayah)'}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Verses Scrubber Bar: 1 to numberOfAyahs */}
          <div className="w-full flex items-center space-x-3 text-xs text-slate-400">
            <span className="w-12 text-right font-mono text-[11px] text-[#d4af37]">
              آیت {currentAyahIndex}
            </span>
            <input
              type="range"
              min={1}
              max={currentSurah.numberOfAyahs}
              value={currentAyahIndex}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
            />
            <span className="w-12 text-left font-mono text-[11px] text-slate-400">
              {currentSurah.numberOfAyahs} کل
            </span>
          </div>
        </div>

        {/* RIGHT: Volume & Download */}
        <div className="hidden md:flex items-center justify-end space-x-3 w-1/3">
          <button onClick={toggleMute} className="text-slate-400 hover:text-white transition-colors">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 lg:w-28 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
          />
          <a
            href={ayahSrc}
            download={`Surah_${currentSurah.number}_Ayah_${currentAyahIndex}.mp3`}
            target="_blank"
            rel="noreferrer"
            title="آیت MP3 ڈاؤنلوڈ کریں"
            className="p-2 rounded-xl bg-[#142032] border border-slate-700/60 text-slate-300 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-all flex items-center space-x-1"
          >
            <Download className="w-4 h-4" />
            <span className="text-xs">MP3</span>
          </a>
        </div>
      </div>
    </div>
  );
};
