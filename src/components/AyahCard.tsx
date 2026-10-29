import React from 'react';
import { Ayah } from '../types/quran';
import { Play, Pause, Bookmark, Copy } from 'lucide-react';
import { formatTajweed } from '../utils/tajweed';

interface AyahCardProps {
  ayah: Ayah;
  isPlaying: boolean;           // this specific ayah is active
  isBookmarked: boolean;
  tajweedEnabled: boolean;
  fontSize: number;
  showTranslation: boolean;
  onPlay: (ayah: Ayah) => void;
  onToggleBookmark: (ayah: Ayah) => void;
}

export const AyahCard: React.FC<AyahCardProps> = React.memo(({
  ayah,
  isPlaying,
  isBookmarked,
  tajweedEnabled,
  fontSize,
  showTranslation,
  onPlay,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const txt = `${ayah.text}\n${ayah.translationUrdu ? `ترجمہ: ${ayah.translationUrdu}` : ''}\n(آیت ${ayah.numberInSurah})`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`group relative rounded-2xl p-6 transition-all duration-300 border ${
        isPlaying
          ? 'bg-gradient-to-br from-[#122238] to-[#0d1828] border-[#d4af37]/80 shadow-xl shadow-[#d4af37]/15 ring-2 ring-[#d4af37]/40'
          : 'bg-[#0f1726]/80 hover:bg-[#121c2e] border-slate-800/80 hover:border-slate-700'
      }`}
    >
      {/* Top Bar: Ayah Number + Actions */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-5">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm transition-all ${
              isPlaying
                ? 'bg-[#d4af37] text-black border-[#d4af37] shadow-md shadow-[#d4af37]/30 scale-105'
                : 'bg-[#172336] border-[#d4af37]/30 text-[#d4af37]'
            }`}
          >
            {ayah.numberInSurah}
          </div>
          <div className="text-xs text-slate-400">
            <span className="text-slate-500">پارہ:</span> {ayah.juz}
            <span className="mx-1">•</span>
            <span className="text-slate-500">صفحہ:</span> {ayah.page}
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Play / Pause this ayah */}
          <button
            onClick={() => onPlay(ayah)}
            aria-label="Play / Pause"
            className={`p-2.5 rounded-xl transition-all ${
              isPlaying
                ? 'bg-[#d4af37] text-black font-semibold shadow-md shadow-[#d4af37]/25'
                : 'bg-[#182337] text-slate-300 hover:text-white hover:bg-[#202f48]'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4" />}
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
            title={copied ? 'کاپی ہو گیا!' : 'کاپی کریں'}
            className="p-2.5 rounded-xl bg-[#182337] text-slate-400 hover:text-white hover:bg-[#202f48] transition-all"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Arabic Text with Complete Tajweed ── */}
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

      {/* ── Urdu Translation ── */}
      {showTranslation && ayah.translationUrdu && (
        <div className="mt-5 pt-4 border-t border-slate-800/60 text-right" dir="rtl">
          <p className="urdu-translation-text text-base md:text-lg text-emerald-100/90 leading-relaxed font-normal">
            {ayah.translationUrdu}
          </p>
        </div>
      )}
    </div>
  );
});

AyahCard.displayName = 'AyahCard';
