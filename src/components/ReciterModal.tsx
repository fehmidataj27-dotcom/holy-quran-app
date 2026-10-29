import React, { useState } from 'react';
import { Reciter } from '../types/quran';
import { RECITERS_LIST } from '../data/reciters';
import { Search, X, Check, Volume2, Sparkles, DownloadCloud } from 'lucide-react';

interface ReciterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedReciter: Reciter;
  onSelectReciter: (reciter: Reciter) => void;
}

export const ReciterModal: React.FC<ReciterModalProps> = ({
  isOpen,
  onClose,
  selectedReciter,
  onSelectReciter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Pakistan' | 'Haramain' | 'Saudi' | 'Egypt' | 'Global'>('All');

  if (!isOpen) return null;

  const filteredReciters = RECITERS_LIST.filter(reciter => {
    const matchesSearch =
      reciter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reciter.arabicName.includes(searchTerm) ||
      reciter.description.includes(searchTerm);

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
              <span>منتخب قراء و مشائخ عظام (پاکستان و عالم اسلام)</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              پاکستان کے مایہ ناز قراء، حرمین شریفین، سعودیہ، مصر اور دنیا بھر کے معروف قراء
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
              placeholder="قاری تلاش کریں (مثلاً: وحید ظفر قاسمی، صداقت علی، یاسر الدوسری، سدیس)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#131e30] border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {(['All', 'Pakistan', 'Haramain', 'Saudi', 'Egypt', 'Global'] as const).map(tab => {
              const labelMap = {
                All: 'تمام قراء',
                Pakistan: '🇵🇰 پاکستان کے قراء',
                Haramain: '🕋 حرمین شریفین',
                Saudi: '🇸🇦 سعودیہ و خلیج',
                Egypt: '🇪🇬 مصر (عمالقة التلاوة)',
                Global: '🌍 عالمی قراء'
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
              return (
                <div
                  key={reciter.id}
                  onClick={() => {
                    onSelectReciter(reciter);
                    onClose();
                  }}
                  className={`pt-3 first:pt-0 cursor-pointer flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#17273f] to-[#1a2c47] border border-[#d4af37]/60'
                      : 'hover:bg-[#121c2e]'
                  }`}
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
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white text-sm md:text-base">
                          {reciter.arabicName}
                        </span>
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
                    <span className="text-[11px] text-slate-500 hidden sm:inline-block">
                      {reciter.style}
                    </span>
                    {isSelected && (
                      <div className="w-7 h-7 rounded-full bg-[#d4af37] text-black flex items-center justify-center">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a101b] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-6">
          <span>✨ تمام آڈیو فائلز آف لائن سنیں یا ون-کلک پر کیشے/ڈاؤنلوڈ کریں۔</span>
          <span className="text-[#d4af37] font-semibold">100% Free & Legal</span>
        </div>
      </div>
    </div>
  );
};
