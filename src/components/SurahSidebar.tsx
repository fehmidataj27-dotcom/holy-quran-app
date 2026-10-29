import React, { useState } from 'react';
import { Surah } from '../types/quran';
import { SURAH_LIST } from '../data/surahs';
import { Search, BookOpen, Compass, Sparkles } from 'lucide-react';

interface SurahSidebarProps {
  selectedSurah: Surah;
  onSelectSurah: (surah: Surah) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SurahSidebar: React.FC<SurahSidebarProps> = ({
  selectedSurah,
  onSelectSurah,
  isOpen,
  onClose
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Meccan' | 'Medinan'>('All');

  const filteredSurahs = SURAH_LIST.filter(surah => {
    const matchesSearch =
      surah.name.includes(searchTerm) ||
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(surah.number).includes(searchTerm);

    const matchesFilter = filterType === 'All' ? true : surah.revelationType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 w-80 bg-[#0a121e] border-r border-[#d4af37]/20 z-40 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* App Title / Header */}
        <div className="p-5 border-b border-slate-800/80 bg-gradient-to-b from-[#0f1b2d] to-[#0a121e]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37] flex items-center justify-center text-black font-bold shadow-md shadow-[#d4af37]/20">
              <BookOpen className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-wide">القرآن الکریم</h1>
              <p className="text-[11px] text-[#d4af37] font-medium">Tajweed & Audio Studio</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="سورۃ تلاش کریں (نام یا نمبر)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#131d2e] border border-slate-700/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center justify-between mt-3 text-xs bg-[#131d2e] p-1 rounded-xl">
            <button
              onClick={() => setFilterType('All')}
              className={`flex-1 py-1 rounded-lg transition-all ${
                filterType === 'All' ? 'bg-[#d4af37] text-black font-semibold' : 'text-slate-400'
              }`}
            >
              تمام (114)
            </button>
            <button
              onClick={() => setFilterType('Meccan')}
              className={`flex-1 py-1 rounded-lg transition-all ${
                filterType === 'Meccan' ? 'bg-[#d4af37] text-black font-semibold' : 'text-slate-400'
              }`}
            >
              مکی
            </button>
            <button
              onClick={() => setFilterType('Medinan')}
              className={`flex-1 py-1 rounded-lg transition-all ${
                filterType === 'Medinan' ? 'bg-[#d4af37] text-black font-semibold' : 'text-slate-400'
              }`}
            >
              مدنی
            </button>
          </div>
        </div>

        {/* Surahs List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredSurahs.map(surah => {
            const isSelected = selectedSurah.number === surah.number;
            return (
              <div
                key={surah.number}
                onClick={() => {
                  onSelectSurah(surah);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#172842] to-[#121f33] border border-[#d4af37]/60 text-white shadow-md'
                    : 'text-slate-300 hover:bg-[#121c2c] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                      isSelected
                        ? 'bg-[#d4af37] text-black font-bold'
                        : 'bg-[#152132] text-slate-400'
                    }`}
                  >
                    {surah.number}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{surah.englishName}</p>
                    <p className="text-[11px] text-slate-400">
                      {surah.numberOfAyahs} آیات • {surah.revelationType === 'Meccan' ? 'مکی' : 'مدنی'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-bold text-[#d4af37] font-serif">
                    {surah.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};
