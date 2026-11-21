import React, { useState } from 'react';
import { DailyAyah } from '../data/dailyAyahData';

interface DailyAyahCardProps {
  ayah: DailyAyah;
}

export const DailyAyahCard: React.FC<DailyAyahCardProps> = ({ ayah }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = `📖 *آج کا قرآنی پیغام* 📖\n\n"${ayah.arabic}"\n\n📌 *ترجمہ:* ${ayah.translationUrdu}\n\n📍 *حوالہ:* ${ayah.surahName} (آیت: ${ayah.ayahNumber}، پارہ: ${ayah.juzNumber})\n✨ *موضوع:* ${ayah.theme}\n\n📱 *صوت القرآن ایپ* سے ڈاؤنلوڈ کریں۔`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'آج کا قرآنی پیغام',
          text: text,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Ignored
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c3924] via-[#092b1b] to-[#04160d] text-white p-3.5 shadow-md border border-[#d4af37]/35 transition-all">
      {/* Decorative Islamic Background Ornament Accents */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-[#d4af37]/10 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#25d366]/10 rounded-full blur-xl pointer-events-none" />

      {/* Top Header Row: Badge & Date Tag */}
      <div className="relative z-10 flex items-center justify-between mb-2">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd700] text-[10px] font-bold">
          <span>✨</span>
          <span>آج کا پیغام</span>
        </div>

        <span className="text-[10px] text-emerald-200/90 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
          {ayah.badge}
        </span>
      </div>

      {/* Arabic Ayah Text */}
      <div className="relative z-10 my-1 text-center px-1">
        <p className="font-arabic text-lg sm:text-xl leading-relaxed text-amber-100 drop-shadow-sm font-semibold select-all" dir="rtl">
          {ayah.arabic}
        </p>
      </div>

      {/* Urdu Translation Text */}
      <div className="relative z-10 my-1 text-center px-1">
        <p className="text-xs text-emerald-100 font-urdu leading-normal select-all" dir="rtl">
          {ayah.translationUrdu}
        </p>
      </div>

      {/* Footer Info: Surah Name, Ayah #, and Share Action */}
      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 mt-2 text-xs">
        <div className="text-right">
          <span className="font-bold text-[#ffd700] text-xs">
            📖 {ayah.surahName}
          </span>
          <span className="text-[10px] text-emerald-200/70 mr-2">
            آیت {ayah.ayahNumber} • پارہ {ayah.juzNumber}
          </span>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1 bg-[#25d366]/20 hover:bg-[#25d366]/30 active:scale-95 text-[#25d366] border border-[#25d366]/40 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shadow-sm"
          title="واٹس ایپ یا دوستوں کے ساتھ شیئر کریں"
        >
          <span>{copied ? '✓' : '📤'}</span>
          <span>{copied ? 'کاپی ہوا' : 'شیئر'}</span>
        </button>
      </div>
    </div>
  );
};
