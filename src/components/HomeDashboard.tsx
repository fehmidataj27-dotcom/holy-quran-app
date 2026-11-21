import { AdBanner } from './AdBanner';
import React from 'react';
import { Surah } from '../types';
import { PrayerTimes } from '../utils/prayerTimes';

interface HomeDashboardProps {
  hijriDate: { hijri: string; gregorian: string };
  prayerTimes: PrayerTimes;
  lastReadSurah: Surah | null;
  lastReadJuz: number;
  onResumeReading: () => void;
  onOpenJuzIndex: () => void;
  onOpenSurahIndex: () => void;
  onOpenGotoPage: () => void;
  onOpenBookmarks: () => void;
  onOpenPrayerTimes: () => void;
  onOpenAdhkar: () => void;
  onOpenAdmissionModal: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  hijriDate,
  prayerTimes,
  lastReadSurah,
  lastReadJuz,
  onResumeReading,
  onOpenJuzIndex,
  onOpenSurahIndex,
  onOpenGotoPage,
  onOpenBookmarks,
  onOpenPrayerTimes,
  onOpenAdhkar,
  onOpenAdmissionModal,
}) => {
  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#071710] pb-24 text-gray-800 dark:text-gray-100 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-[#1b7a4b] text-white p-4 pt-5 pb-8 shadow-md rounded-b-[32px] relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <span className="text-xl font-black tracking-wide font-sans">Al Quran • القرآن</span>
          </div>

          {/* Jamia Admission Button */}
          <button
            onClick={onOpenAdmissionModal}
            className="flex items-center gap-1.5 bg-[#ffd700] hover:bg-[#f5cf00] text-gray-900 px-3 py-1.5 rounded-full font-bold text-xs shadow-md transition-all transform hover:scale-105"
          >
            <span>🎓</span>
            <span>داخلہ آن لائن</span>
          </button>
        </div>

        {/* Hijri Date & Prayer Times Widget */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-4 text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
            <div>
              <div className="font-bold text-base text-[#ffd700] font-sans">{hijriDate.hijri}</div>
              <div className="text-xs text-emerald-100">{hijriDate.gregorian}</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-emerald-200">Next Prayer</div>
              <div className="text-xl font-black text-white font-sans">{prayerTimes.nextPrayer.name}</div>
              <div className="text-xs text-emerald-300 font-mono font-bold">In {prayerTimes.nextPrayer.timeRemaining}</div>
            </div>
          </div>

          <button
            onClick={onOpenPrayerTimes}
            className="w-full flex items-center justify-between text-xs font-semibold text-emerald-100 hover:text-white pt-0.5 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <span>🕒</span>
              <span>تمام نمازوں کے اوقات • Prayer Times</span>
            </span>
            <span>›</span>
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 -mt-4 space-y-4">
        {/* Resume Reading Gold Card */}
        {lastReadSurah && (
          <div className="bg-gradient-to-r from-[#d4af37] via-[#c99e28] to-[#b3861b] rounded-3xl p-4 text-white shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
                📖
              </div>
              <div>
                <div className="text-xs text-amber-100 font-medium">آخری تلاوت • Last Read</div>
                <div className="text-lg font-bold font-arabic">{lastReadSurah.name}</div>
                <div className="text-[11px] text-amber-100">Juzz - {lastReadJuz} • {lastReadSurah.englishName}</div>
              </div>
            </div>

            <button
              onClick={onResumeReading}
              className="bg-white text-gray-900 hover:bg-amber-50 px-4 py-2 rounded-2xl font-bold text-xs shadow-md transition-all transform active:scale-95"
            >
              Resume Reading
            </button>
          </div>
        )}

        {/* Adhkar - Morning, Evening, After Prayer & Sleeping Adhkar Banner */}
        <div 
          onClick={onOpenAdhkar}
          className="cursor-pointer bg-gradient-to-r from-[#00695c] to-[#004d40] border border-[#4db6ac]/40 rounded-3xl p-4 shadow-md flex items-center justify-between text-white transition-all transform hover:scale-[1.01] active:scale-95"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              📿
            </div>
            <div>
              <div className="font-bold text-sm text-[#e0f2f1] font-arabic flex items-center gap-2">
                <span>مسنون اذکار و تسبیحات</span>
                <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded-full font-sans font-bold">4 اقسام</span>
              </div>
              <div className="text-xs text-teal-100 font-sans mt-0.5">
                صبح و شام • نماز کے بعد • سونے کے اذکار (بشمول کاؤنٹر و آڈیو)
              </div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-base">
            ›
          </div>
        </div>

        {/* 4 Main Action Cards Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Juz Index Card */}
          <button
            onClick={onOpenJuzIndex}
            className="bg-white dark:bg-[#0e271c] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 p-5 rounded-3xl border border-emerald-900/10 dark:border-emerald-700/20 shadow-sm flex flex-col items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            <div className="text-3xl text-amber-500">📖</div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">Juzz Index</div>
            <div className="text-[11px] text-gray-400">30 پارے</div>
          </button>

          {/* Surah Index Card */}
          <button
            onClick={onOpenSurahIndex}
            className="bg-white dark:bg-[#0e271c] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 p-5 rounded-3xl border border-emerald-900/10 dark:border-emerald-700/20 shadow-sm flex flex-col items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            <div className="text-3xl text-emerald-600">🕌</div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">Surah Index</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Play Audio & Read</div>
          </button>

          {/* Goto Page Card */}
          <button
            onClick={onOpenGotoPage}
            className="bg-white dark:bg-[#0e271c] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 p-5 rounded-3xl border border-emerald-900/10 dark:border-emerald-700/20 shadow-sm flex flex-col items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            <div className="text-3xl text-amber-600">📑</div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">Goto Page</div>
            <div className="text-[11px] text-gray-400">صفحہ نمبر پر جائیں</div>
          </button>

          {/* Bookmarks Card */}
          <button
            onClick={onOpenBookmarks}
            className="bg-white dark:bg-[#0e271c] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 p-5 rounded-3xl border border-emerald-900/10 dark:border-emerald-700/20 shadow-sm flex flex-col items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            <div className="text-3xl text-amber-500">🔖</div>
            <div className="font-bold text-sm text-gray-900 dark:text-white">Bookmarks</div>
            <div className="text-[11px] text-gray-400">محفوظ آیات</div>
          </button>
        </div>

        {/* Jamia Saut-ul-Quran Banner Card */}
        <div 
          onClick={onOpenAdmissionModal}
          className="cursor-pointer bg-gradient-to-r from-[#0d3827] to-[#072418] border border-[#d4af37]/40 rounded-3xl p-4 shadow-md flex items-center justify-between text-white transition-all transform hover:scale-[1.01]"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#ffd700]/20 border border-[#ffd700]/40 flex items-center justify-center text-xl">
              🎓
            </div>
            <div>
              <div className="font-bold text-sm text-[#ffd700]">جامعہ صوت القرآن آن لائن اکیڈمی</div>
              <div className="text-xs text-emerald-200">آن لائن تجوید، حفظ اور تفسیر داخلہ جاری ہے</div>
            </div>
          </div>
          <span className="text-xs bg-[#25d366] text-white px-3 py-1.5 rounded-full font-bold shadow">
            رابطہ کریں
          </span>
        </div>

        {/* Halal Google AdMob Banner Container */}
        <AdBanner slotId="2482490729" />
      </div>
    </div>
  );
};
