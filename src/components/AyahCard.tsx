import React from 'react';
import { Ayah } from '../types/quran';
import { Play, Pause, Bookmark, Copy, Repeat, SkipForward, Loader2 } from 'lucide-react';
import { formatTajweed } from '../utils/tajweed';

export type AyahPlayState = 'idle' | 'loading' | 'playing_loop' | 'playing_seq';

interface AyahCardProps {
  ayah: Ayah;
  playState: AyahPlayState;          // idle | loading | playing_loop | playing_seq
  isBookmarked: boolean;
  tajweedEnabled: boolean;
  fontSize: number;
  showTranslation: boolean;
  onPlay: (ayah: Ayah) => void;       // first press → play this ayah in loop mode
  onToggleBookmark: (ayah: Ayah) => void;
}

export const AyahCard: React.FC<AyahCardProps> = React.memo(({
  ayah,
  playState,
  isBookmarked,
  tajweedEnabled,
  fontSize,
  showTranslation,
  onPlay,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = React.useState(false);

  const isActive = playState !== 'idle';

  const handleCopy = () => {
    const txt = `${ayah.text}\n${ayah.translationUrdu ? `ترجمہ: ${ayah.translationUrdu}` : ''}\n(آیت ${ayah.numberInSurah})`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Icon inside the play button based on state
  const PlayIcon = () => {
    if (playState === 'loading')    return <Loader2 className="w-4 h-4 animate-spin" />;
    if (playState === 'playing_loop') return <Repeat className="w-4 h-4 fill-current" />;
    if (playState === 'playing_seq')  return <SkipForward className="w-4 h-4 fill-current" />;
    return <Play className="w-4 h-4" />;
  };

  // Tooltip
  const playTitle =
    playState === 'playing_loop' ? 'لوپ چل رہی ہے — دوبارہ دبائیں آگے جانے کے لیے'
    : playState === 'playing_seq' ? 'آگے چل رہی ہے — دوبارہ دبائیں روکنے کے لیے'
    : playState === 'loading'     ? 'لوڈ ہو رہا ہے…'
    : 'آیت چلائیں';

  return (
    <div
      className={`group relative rounded-2xl p-6 transition-all duration-300 border ${
        isActive
          ? 'bg-gradient-to-br from-[#122238] to-[#0d1828] border-[#d4af37]/80 shadow-xl shadow-[#d4af37]/15 ring-2 ring-[#d4af37]/40'
          : 'bg-[#0f1726]/80 hover:bg-[#121c2e] border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Top Bar: Ayah Number + Actions */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-5">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm transition-all ${
              isActive
                ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-md shadow-[#d4af37]/30 scale-105'
                : 'bg-[#172336] border-[#d4af37]/30 text-[#d4af37]'
            }`}
          >
            {ayah.numberInSurah}
          </div>
          <div className="text-xs text-slate-400">
            <span className="text-slate-500">جز:</span> {ayah.juz}
            <span className="mx-1">•</span>
            <span className="text-slate-500">صفحہ:</span> {ayah.page}
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Play / Pause this ayah */}
          <button
            onClick={() => onPlay(ayah)}
            title={playTitle}
            aria-label={playTitle}
            className={`p-2.5 rounded-xl transition-all ${
              isActive
                ? 'bg-[#d4af37] text-black font-semibold shadow-md shadow-[#d4af37]/25'
                : 'bg-[#182337] text-slate-300 hover:text-white hover:bg-[#202f48]'
            }`}
          >
            <PlayIcon />
          </button>

          {/* Bookmark */}
          <button
            onClick={() => onToggleBookmark(ayah)}
            aria-label="Bookmark"
            className={`p-2.5 rounded-xl transition-all ${
              isBookmarked
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-[#182337] text-slate-400 hover:text-white hover:bg-[#202f48]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            title={copied ? 'کاپی ہو گئی!' : 'کاپی کریں'}
            className="p-2.5 rounded-xl bg-[#182337] text-slate-400 hover:text-white hover:bg-[#202f48] transition-all"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 🌟 Arabic Text with Complete Tajweed 🌟 */}
      <div className="text-right py-3" dir="rtl">
        {tajweedEnabled ? (
          <p
            className="arabic-quran-text leading-loose transition-all duration-200"
            style={{ fontSize: `${fontSize}px`, lineHeight: '2.3' }}
            dangerouslySetInnerHTML={{
              __html:
                formatTajweed(ayah.text) +
                ` <span class="inline-block text-[#d4af37] font-sans text-xl mr-2">﴿${ayah.numberInSurah}﴾</span>`
            }}
          />
        ) : (
          <p
            className="arabic-quran-text text-slate-100 leading-loose transition-all duration-200"
            style={{ fontSize: `${fontSize}px`, lineHeight: '2.3' }}
          >
            {ayah.text}{' '}
            <span className="inline-block text-[#d4af37] font-sans text-xl mr-2">
              ﴿{ayah.numberInSurah}﴾
            </span>
          </p>
        )}
      </div>

      {/* 🌟 Urdu Translation 🌟 */}
      {showTranslation && ayah.translationUrdu && (
        <div className="mt-5 pt-4 border-t border-slate-800/60 text-right" dir="rtl">
          <p className="urdu-translation-text text-base md:text-lg text-emerald-100/90 leading-relaxed font-normal">
            {ayah.translationUrdu}
          </p>
        </div>
      )}

      {/* Small status label when active */}
      {isActive && (
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            playState === 'playing_loop'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : playState === 'playing_seq'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
          }`}>
            {playState === 'playing_loop' ? '🔁 لوپ'
             : playState === 'playing_seq' ? '▶ آگے'
             : '⏳'}
          </span>
        </div>
      )}
    </div>
  );
});

AyahCard.displayName = 'AyahCard';
