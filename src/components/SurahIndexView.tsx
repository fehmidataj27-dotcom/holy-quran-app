import React, { useState } from 'react';
import { Surah } from '../types';
import { Reciter } from '../data/reciters';

interface SurahIndexViewProps {
  surahs: Surah[];
  selectedReciter: Reciter;
  onSelectSurah: (surah: Surah, mode: 'read' | 'play') => void;
  onChangeReciter: () => void;
  onBack: () => void;
}

export const SurahIndexView: React.FC<SurahIndexViewProps> = ({
  surahs,
  selectedReciter,
  onSelectSurah,
  onChangeReciter,
  onBack,
}) => {
  const [search, setSearch] = useState('');

  const filteredSurahs = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search) ||
      s.number.toString().includes(search)
  );

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#071710] pb-24 text-gray-800 dark:text-gray-100 animate-fadeIn">
      {/* Top Bar */}
      <div className="bg-[#1b7a4b] text-white p-4 shadow-md sticky top-0 z-30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              ←
            </button>
            <h1 className="text-xl font-bold font-sans">Surah Index • سورت انڈیکس</h1>
          </div>
        </div>

        {/* Selected Reciter Pill Button */}
        <button
          onClick={onChangeReciter}
          className="w-full flex items-center justify-between bg-black/20 hover:bg-black/30 p-2.5 px-3.5 rounded-2xl border border-white/15 transition-all text-left"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎙️</span>
            <div>
              <div className="text-[10px] text-emerald-200 uppercase tracking-wider">Reciter • قاری</div>
              <div className="text-sm font-bold text-white">{selectedReciter.name}</div>
            </div>
          </div>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-lg text-emerald-100">تبدیل کریں ▾</span>
        </button>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search surah name or number..."
            className="w-full bg-white/15 focus:bg-white/25 placeholder-emerald-100/70 text-white p-2.5 px-4 rounded-xl outline-none border border-white/20 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-xs text-white/70 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Surah List */}
      <div className="max-w-md mx-auto p-4 space-y-2">
        <div className="bg-white dark:bg-[#0e271c] rounded-3xl p-2 shadow-sm border border-emerald-900/10 dark:border-emerald-700/20 divide-y divide-emerald-50 dark:divide-emerald-900/40">
          {filteredSurahs.map((surah) => (
            <div
              key={surah.number}
              className="flex items-center justify-between p-3.5 hover:bg-emerald-50/60 dark:hover:bg-white/5 rounded-2xl transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                  {surah.number}
                </span>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {surah.number}. {surah.englishName}
                  </div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-400 font-arabic font-bold">
                    {surah.name}
                  </div>
                </div>
              </div>

              {/* Action Buttons: PLAY & READ */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectSurah(surah, 'play')}
                  className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/40 dark:hover:bg-emerald-800/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700/50 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                  title="سورت سنیں"
                >
                  <span>▶</span>
                  <span>PLAY</span>
                </button>
                <button
                  onClick={() => onSelectSurah(surah, 'read')}
                  className="flex items-center gap-1 bg-[#1b7a4b] hover:bg-[#15603b] text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                  title="سورت پڑھیں"
                >
                  <span>📖</span>
                  <span>READ</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
