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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c3924] via-[#092b1b] to-[#04160d] text-white p-5 shadow-xl border border-[#d4af37]/35 transition-all">
      {/* Decorative Islamic Background Ornament Accents */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#25d366]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-2 left-4 text-4xl opacity-10 select-none font-serif">﷽</div>

      {/* Top Header Row: Badge & Date Tag */}
      <div className="relative z-10 flex items-center justify-between mb-3.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd700] text-[11px] font-bold shadow-sm">
          <span>✨</span>
          <span>آج کا پیغام • Divine Message</span>
        </div>

        <span className="text-[10px] text-emerald-200/80 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
          {ayah.badge}
        </span>
      </div>

      {/* Arabic Ayah Text */}
      <div className="relative z-10 my-3 text-center px-1">
        <p className="font-arabic text-xl sm:text-2xl leading-[2.1] text-amber-100 drop-shadow-sm font-semibold select-all" dir="rtl">
          {ayah.arabic}
        </p>
      </div>

      {/* Urdu Translation Text */}
      <div className="relative z-10 my-2.5 text-center px-2">
        <p className="text-xs sm:text-sm text-emerald-100 font-urdu leading-relaxed select-all" dir="rtl">
          {ayah.translationUrdu}
        </p>
      </div>

      {/* Divider */}
      <div className="relative z-10 my-3.5 border-t border-white/10 flex items-center justify-center">
        <span className="bg-[#092b1b] px-3 -mt-2 text-xs text-[#ffd700]">⚜️</span>
      </div>

      {/* Footer Info: Surah Name, Ayah #, and Share Action */}
      <div className="relative z-10 flex items-center justify-between pt-0.5 text-xs">
        <div className="text-right">
          <div className="font-bold text-[#ffd700] flex items-center gap-1">
            <span>📖</span>
            <span>{ayah.surahName}</span>
          </div>
          <div className="text-[10px] text-emerald-200/70">
            آیت {ayah.ayahNumber} • پارہ {ayah.juzNumber}
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 bg-[#25d366]/20 hover:bg-[#25d366]/30 active:scale-95 text-[#25d366] border border-[#25d366]/40 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm"
          title="واٹس ایپ یا دوستوں کے ساتھ شیئر کریں"
        >
          <span>{copied ? '✓' : '📤'}</span>
          <span>{copied ? 'کاپی ہو گیا!' : 'شیئر کریں'}</span>
        </button>
      </div>
    </div>
  );
};
