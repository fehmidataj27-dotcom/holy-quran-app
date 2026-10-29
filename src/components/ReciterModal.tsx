import React, { useState } from 'react';
import { Reciter, Surah } from '../types/quran';
import { RECITERS_LIST } from '../data/reciters';
import { SURAH_LIST } from '../data/surahs';
import { Search, X, Check, Volume2, Sparkles, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface ReciterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
  onSelectSurah?: (surah: Surah) => void;
}

export const ReciterModal: React.FC<ReciterModalProps> = ({
  isOpen,
  onClose,
  selectedReciter,
  onSelectReciter,
  onSelectSurah
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Full' | 'Pakistan' | 'Haramain' | 'Saudi' | 'Egypt' | 'Global'>('All');
  const [expandedReciterId, setExpandedReciterId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredReciters = RECITERS_LIST.filter(reciter => {
    const matchesSearch =
      reciter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reciter.arabicName.includes(searchTerm) ||
      reciter.description.includes(searchTerm);

    if (activeTab === 'Full') {
      return matchesSearch && reciter.hasFullQuran;
    }

    const matchesCategory =
      activeTab === 'All' ? true : reciter.category === activeTab;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b1320] border border-[#d4af37]/40 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 bg-[#0e192b] flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
              <span className="text-[#d4af37]">🎙️</span>
              <span>منتخب قراء و مشائخ عظام</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              مکمل 114 سورتیں ریکارڈ شدہ قراء اور منتخب تلاوتیں
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-5 border-b border-slate-800/60 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="قاری تلاش کریں (مثلاً: سدیس، عمر بن ضیاء الدین، وحید ظفر قاسمی)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#131e30] border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {(['All', 'Full', 'Haramain', 'Pakistan', 'Saudi', 'Egypt', 'Global'] as const).map(tab => {
              const labelMap = {
                All: 'تمام قراء',
                Full: '✨ مکمل 114 سورتیں',
                Haramain: '🕋 حرمین شریفین',
                Pakistan: '🇵🇰 پاکستان کے قراء',
                Saudi: '🇸🇦 سعودیہ و خلیج',
                Egypt: '🇪🇬 مصر',
                Global: '🌍 عالمی'
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'bg-[#d4af37] text-black font-semibold shadow-md'
                      : 'bg-[#142032] text-slate-300 hover:bg-[#1a2b44]'
                  }`}
                >
                  {labelMap[tab]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reciters List */}
        <div className="overflow-y-auto p-5 space-y-3 divide-y divide-slate-800/40">
          {filteredReciters.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              کوئی قاری دستیاب نہیں ملا۔ براہ کرم کوئی دوسرا نام تلاش کریں۔
            </div>
          ) : (
            filteredReciters.map((reciter) => {
              const isSelected = selectedReciter.id === reciter.id;
              const isExpanded = expandedReciterId === reciter.id;

              return (
                <div
                  key={reciter.id}
                  className={`pt-3 first:pt-0 rounded-2xl transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#17273f] to-[#1a2c47] border border-[#d4af37]/60'
                      : 'hover:bg-[#121c2e]'
                  }`}
                >
                  <div
                    onClick={() => {
                      onSelectReciter(reciter);
                      // If partial reciter, toggle surah list expansion for quick choice
                      if (!reciter.hasFullQuran) {
                        setExpandedReciterId(isExpanded ? null : reciter.id);
                      } else {
                        onClose();
                      }
                    }}
                    className="cursor-pointer flex items-center justify-between p-3.5"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${
                          isSelected
                            ? 'bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/30'
                            : 'bg-[#182337] text-slate-300 border border-slate-700/60'
                        }`}
                      >
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-1">
                          <span className="font-semibold text-white text-sm md:text-base">
                            {reciter.arabicName}
                          </span>

                          {/* Full Quran Badge or Partial Badge */}
                          {reciter.hasFullQuran ? (
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-semibold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              مکمل قرآن ریکارڈ (114 سورتیں)
                            </span>
                          ) : (
                            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                              مخصوص سورتیں دستیاب ({reciter.availableSurahs?.length || 0} سورتیں)
                            </span>
                          )}

                          {reciter.category === 'Pakistan' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/30">
                              🇵🇰 قاریِ پاکستان
                            </span>
                          )}
                          {reciter.category === 'Haramain' && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              🕋 امام الحرم
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#d4af37] font-medium">{reciter.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{reciter.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {!reciter.hasFullQuran && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedReciterId(isExpanded ? null : reciter.id);
                          }}
                          className="text-xs px-2.5 py-1 rounded-lg bg-[#152338] text-amber-300 hover:bg-[#1b2d49] border border-amber-500/30 flex items-center gap-1"
                        >
                          <span>سورتیں دیکھیں</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      {isSelected && (
                        <div className="w-7 h-7 rounded-full bg-[#d4af37] text-black flex items-center justify-center">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Partial Reciter Available Surahs Direct Chips */}
                  {(!reciter.hasFullQuran && isExpanded && reciter.availableSurahs && reciter.availableSurahs.length > 0) && (
                    <div className="px-4 pb-4 pt-1 bg-[#0d1624]/70 border-t border-slate-800/80 rounded-b-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-amber-300 font-semibold">
                          📌 دستیاب سورتیں (براہِ راست کسی بھی سورۃ پر کلک کریں):
                        </p>
                        <span className="text-[10px] text-slate-400">
                          کل {reciter.availableSurahs.length} سورتیں
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1">
                        {reciter.availableSurahs.map((surahNum) => {
                          const surahObj = SURAH_LIST[surahNum - 1];
                          if (!surahObj) return null;
                          return (
                            <button
                              key={surahNum}
                              type="button"
                              onClick={() => {
                                onSelectReciter(reciter);
                                if (onSelectSurah) onSelectSurah(surahObj);
                                onClose();
                              }}
                              className="px-2.5 py-1 text-xs rounded-lg bg-[#142338] text-slate-200 border border-slate-700/80 hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all font-medium flex items-center gap-1"
                            >
                              <span className="text-[10px] opacity-75 font-mono">{surahNum}.</span>
                              <span>{surahObj.name}</span>
                              <span className="text-[10px] opacity-60 hidden sm:inline">({surahObj.englishName})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a101b] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-6">
          <span>✨ مکمل قرآن کے قراء سب سے اوپر رکھے گئے ہیں تاکہ آسانی سے تمام سورتیں سنی جا سکیں۔</span>
          <span className="text-[#d4af37] font-semibold">100% Free & Fast</span>
        </div>
      </div>
    </div>
  );
};
