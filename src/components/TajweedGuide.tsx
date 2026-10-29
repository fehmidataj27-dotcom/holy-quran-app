import React from 'react';
import { TAJWEED_RULES } from '../utils/tajweed';
import { Sparkles, HelpCircle } from 'lucide-react';

interface TajweedGuideProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const TajweedGuide: React.FC<TajweedGuideProps> = ({ isOpen, onToggle }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-[#0e1726] border border-[#d4af37]/30 rounded-2xl p-5 mb-6 shadow-xl animate-in fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#d4af37]" />
          <h3 className="text-base font-bold text-white">
            قواعدِ تجوید گائیڈ (رنگین تجوید کے اصول)
          </h3>
        </div>
        <button
          onClick={onToggle}
          className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
        >
          بند کریں
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {TAJWEED_RULES.map((rule, idx) => (
          <div
            key={idx}
            className="flex items-start space-x-3 p-2.5 rounded-xl bg-[#142033] border border-slate-800"
          >
            <div
              className="w-4 h-4 rounded-full mt-1 shrink-0 shadow-sm"
              style={{ backgroundColor: rule.color }}
            />
            <div>
              <p className="text-xs font-semibold text-white">{rule.titleUrdu}</p>
              <p className="text-[10px] text-[#d4af37] font-medium">{rule.title}</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                {rule.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
