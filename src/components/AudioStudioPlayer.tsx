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
import { isAudioCached, cacheAudioOffline, getCachedAudioUrl } from '../utils/audioCache';
import { getReciterSurahUrl } from '../utils/reciterAudioHelper';

interface AudioStudioPlayerProps {
  currentReciter: Reciter;
  currentSurah: Surah;
  currentAyah: Ayah | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextSurah: () => void;
  onPrevSurah: () => void;
  onSelectReciterModal: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
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
  onTimeUpdate
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [playableSrc, setPlayableSrc] = useState<string>('');
  const [surahNotAvailable, setSurahNotAvailable] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<boolean>(false);

  // ─── Compute the right URL for this reciter + surah ───────────────────────
  const rawAudioUrl = getReciterSurahUrl(
    currentReciter.id,
    currentReciter.serverUrl,
    currentSurah.number
  );

  // ─── Whenever reciter OR surah changes → reset & load new src immediately ─
  useEffect(() => {
    let cancelled = false;

    // Reset all state for new surah
    setSurahNotAvailable(false);
    setAudioError(false);
    setDuration(0);
    setCurrentTime(0);
    setIsLoadingAudio(false);

    // Case 1: URL is empty → this surah is not mapped for this reciter
    if (!rawAudioUrl) {
      setSurahNotAvailable(true);
      setPlayableSrc('');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
        audioRef.current.load();
      }
      return;
    }

    // Case 2: Check cache first (non-blocking — set remote URL immediately)
    setPlayableSrc(rawAudioUrl);

    // Upgrade to cached blob in background
    (async () => {
      try {
        const cached = await isAudioCached(rawAudioUrl);
        if (cancelled) return;
        if (cached) {
          const blobUrl = await getCachedAudioUrl(rawAudioUrl);
          if (!cancelled && blobUrl) setPlayableSrc(blobUrl);
        } else {
          // Cache silently in background
          cacheAudioOffline(rawAudioUrl).catch(() => {});
        }
      } catch {
        // ignore cache errors
      }
    })();

    return () => { cancelled = true; };
  }, [currentReciter.id, currentSurah.number]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── CRITICAL: When playableSrc changes, force the audio element to reload ─
  // This is what prevents the old surah from continuing to play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!playableSrc) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      return;
    }

    // Force reload with new source
    audio.src = playableSrc;
    audio.load(); // ← CRITICAL: without this, old surah keeps playing

    if (isPlaying) {
      setIsLoadingAudio(true);
      audio.play()
        .then(() => setIsLoadingAudio(false))
        .catch(() => setIsLoadingAudio(false));
    }
  }, [playableSrc]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Handle Play/Pause toggle (separate from src change) ──────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playableSrc || surahNotAvailable) return;

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

  // ─── Audio element event handlers ─────────────────────────────────────────
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const t = audioRef.current.currentTime;
      const d = audioRef.current.duration;
      setCurrentTime(t);
      if (onTimeUpdate && d) onTimeUpdate(t, d);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoadingAudio(false);
    }
  };

  const handleCanPlay = () => {
    setIsLoadingAudio(false);
    setAudioError(false);
  };

  const handleError = () => {
    setIsLoadingAudio(false);
    // If audio fails to load (404 / network error) → mark as not available
    if (playableSrc) {
      setAudioError(true);
      setSurahNotAvailable(true);
    }
  };

  const handleWaiting = () => setIsLoadingAudio(true);

  // ─── Controls ─────────────────────────────────────────────────────────────
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time;
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

  const unavailable = surahNotAvailable || audioError;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a111c]/95 backdrop-blur-xl border-t border-[#d4af37]/25 shadow-2xl px-4 py-3 md:py-4 transition-all">
      {/* Hidden audio element — src managed imperatively via useEffect */}
      <audio
        ref={audioRef}
        preload="none"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onError={handleError}
        onEnded={onNextSurah}
        loop={isLooping}
      />

      {/* ── NOT AVAILABLE BANNER ── */}
      {unavailable && (
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 mb-2 px-4 py-2 bg-amber-950/70 border border-amber-500/50 rounded-xl text-amber-200 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              یہ سورۃ ({currentSurah.name}) اس وقت{' '}
              <strong>{currentReciter.arabicName || currentReciter.name}</strong>{' '}
              کی ریکارڈنگ میں دستیاب نہیں۔
            </span>
          </div>
          <button
            onClick={onSelectReciterModal}
            className="px-3 py-1 bg-[#d4af37] text-black font-semibold rounded-lg hover:bg-[#e5c158] transition-all shrink-0"
          >
            دستیاب سورتیں یا مکمل قرآن والے قاری منتخب کریں
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">

        {/* ── LEFT: Reciter & Surah Info ── */}
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
                  تبدیل قاری
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                سورۃ {currentSurah.name} — {currentSurah.englishName}
              </p>
            </div>
          </div>

          <a
            href={(!unavailable && playableSrc) ? playableSrc : '#'}
            download={`Surah_${currentSurah.number}_${currentReciter.name}.mp3`}
            target="_blank"
            rel="noreferrer"
            title="ڈاؤنلوڈ MP3"
            className="md:hidden p-2 rounded-lg bg-[#142032] text-slate-300 hover:text-white"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>

        {/* ── CENTER: Controls & Timeline ── */}
        <div className="flex flex-col items-center w-full md:w-2/5">
          <div className="flex items-center space-x-4 mb-1">

            {/* Speed */}
            <button
              onClick={cycleSpeed}
              className="text-xs font-semibold px-2 py-1 rounded bg-[#162236] text-slate-300 hover:text-[#d4af37] border border-slate-700/50"
              title="سپیڈ تبدیل کریں"
            >
              {playbackSpeed}x
            </button>

            {/* Prev */}
            <button
              onClick={onPrevSurah}
              className="p-2 text-slate-300 hover:text-white hover:scale-110 transition-all"
              title="پچھلی سورۃ"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* ── Play/Pause ── */}
            <button
              onClick={unavailable ? undefined : onTogglePlay}
              disabled={unavailable}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                unavailable
                  ? 'bg-slate-700 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-tr from-[#b8860b] via-[#d4af37] to-[#f5d77f] text-black shadow-[#d4af37]/25 hover:scale-105 active:scale-95'
              }`}
            >
              {unavailable ? (
                <WifiOff className="w-5 h-5 text-slate-400" />
              ) : isLoadingAudio ? (
                <Loader2 className="w-6 h-6 animate-spin text-black" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 fill-black" />
              ) : (
                <Play className="w-6 h-6 fill-black ml-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={onNextSurah}
              className="p-2 text-slate-300 hover:text-white hover:scale-110 transition-all"
              title="اگلی سورۃ"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Loop */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-2 transition-all ${
                isLooping ? 'text-[#d4af37]' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="تکرار (Repeat Surah)"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex items-center space-x-3 text-xs text-slate-400">
            <span className="w-10 text-right font-mono">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              disabled={unavailable}
              className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-[#d4af37] disabled:opacity-30"
            />
            <span className="w-10 text-left font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        {/* ── RIGHT: Volume & Download ── */}
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
            href={(!unavailable && playableSrc) ? playableSrc : '#'}
            download={`Surah_${currentSurah.number}_${currentReciter.name}.mp3`}
            target="_blank"
            rel="noreferrer"
            title="تلاوت ڈاؤنلوڈ کریں (Download MP3)"
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
