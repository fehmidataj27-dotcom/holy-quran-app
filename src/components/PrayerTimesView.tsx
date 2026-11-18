import React from 'react';
import { PrayerTimes } from '../utils/prayerTimes';

interface PrayerTimesViewProps {
  prayerTimes: PrayerTimes;
  onBack: () => void;
}

export const PrayerTimesView: React.FC<PrayerTimesViewProps> = ({ prayerTimes, onBack }) => {
  const prayers = [
    { nameEn: 'Tahajjud', nameUr: 'تہجد', time: prayerTimes.tahajjud, icon: '🌙' },
    { nameEn: 'Fajr', nameUr: 'فجر', time: prayerTimes.fajr, icon: '🌄' },
    { nameEn: 'Sunrise', nameUr: 'طلوع آفتاب', time: prayerTimes.sunrise, icon: '☀️' },
    { nameEn: 'Dhuhr', nameUr: 'ظہر', time: prayerTimes.dhuhr, icon: '☀️' },
    { nameEn: 'Asr', nameUr: 'عصر', time: prayerTimes.asr, icon: '🌤️' },
    { nameEn: 'Maghrib', nameUr: 'مغرب', time: prayerTimes.maghrib, icon: '🌅' },
    { nameEn: 'Isha', nameUr: 'عشاء', time: prayerTimes.isha, icon: '🌌' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#071710] pb-24 text-gray-800 dark:text-gray-100 animate-fadeIn">
      {/* Top Bar */}
      <div className="bg-[#1b7a4b] text-white p-4 shadow-md flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            ←
          </button>
          <h1 className="text-xl font-bold font-sans">نماز کے اوقات • Prayer Times</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Next Prayer Countdown Card */}
        <div className="bg-gradient-to-r from-[#1b7a4b] to-[#125835] rounded-3xl p-5 text-white shadow-xl flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-200">Next Prayer</div>
            <div className="text-2xl font-black mt-1 font-sans">{prayerTimes.nextPrayer.name}</div>
            <div className="text-xs text-emerald-100 mt-1">Based on solar calculation</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-emerald-200">باقی وقت • In</div>
            <div className="text-3xl font-mono font-bold text-[#ffd700]">{prayerTimes.nextPrayer.timeRemaining}</div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="bg-white dark:bg-[#0e271c] rounded-3xl p-3 shadow-sm border border-emerald-900/10 dark:border-emerald-700/20 divide-y divide-emerald-50 dark:divide-emerald-900/40">
          {prayers.map((p, idx) => {
            const isNext = prayerTimes.nextPrayer.name.toLowerCase() === p.nameEn.toLowerCase();
            return (
              <div 
                key={idx} 
                className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                  isNext 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-400/40 font-bold' 
                    : 'hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <div className="text-base text-gray-900 dark:text-white font-medium">{p.nameEn}</div>
                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-urdu">{p.nameUr}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-base font-mono font-semibold ${isNext ? 'text-emerald-700 dark:text-[#ffd700]' : 'text-gray-700 dark:text-gray-300'}`}>
                    {p.time}
                  </div>
                  {isNext && (
                    <span className="inline-block text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full mt-0.5">
                      Next
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Location & calculation footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 p-2">
          📍 اوقاتِ نماز خودکار فلکیاتی حسابی اصول (Muslim World League) کے مطابق ہیں۔
        </div>
      </div>
    </div>
  );
};
