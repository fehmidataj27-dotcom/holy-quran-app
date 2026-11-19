import React from 'react';
import { JUZ_LIST, JuzInfo } from '../data/juz';

interface JuzIndexViewProps {
  onSelectJuz: (juz: JuzInfo) => void;
  onBack: () => void;
}

function getPageFileName(page: number): string {
  return String(page).padStart(3, '0') + '.webp';
}

function preloadJuzPage(page: number) {
  const fileName = getPageFileName(page);
  const img = new Image();
  img.src = `https://cdn.jsdelivr.net/gh/malikusmanhaider/quran-16-line-images@master/images/${fileName}`;
}

export const JuzIndexView: React.FC<JuzIndexViewProps> = ({ onSelectJuz, onBack }) => {
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
          <h1 className="text-xl font-bold font-sans">Juzz Index • پارہ انڈیکس</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-2">
        <div className="bg-white dark:bg-[#0e271c] rounded-3xl p-2 shadow-sm border border-emerald-900/10 dark:border-emerald-700/20 divide-y divide-emerald-50 dark:divide-emerald-900/40">
          {JUZ_LIST.map((juz) => (
            <button
              key={juz.number}
              onClick={() => onSelectJuz(juz)}
              onMouseEnter={() => preloadJuzPage(juz.page)}
              onTouchStart={() => preloadJuzPage(juz.page)}
              className="w-full flex items-center justify-between p-3.5 hover:bg-emerald-50 dark:hover:bg-white/5 rounded-2xl transition-all text-left active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                  {juz.number}
                </span>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {juz.number}. {juz.nameTranslit}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Page #{juz.page}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-arabic font-bold text-xl text-emerald-700 dark:text-emerald-300">
                  {juz.nameArabic}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
