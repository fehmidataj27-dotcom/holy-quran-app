import React, { useState } from 'react';
import { Surah } from '../types';

interface GotoPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToSurah: (surahNumber: number) => void;
  surahs: Surah[];
}

export const GotoPageModal: React.FC<GotoPageModalProps> = ({
  isOpen,
  onClose,
  onGoToSurah,
}) => {
  const [pageInput, setPageInput] = useState('');

  if (!isOpen) return null;

  // Approximate page to surah converter (standard 16 line / 15 line mushaf: 604 pages)
  const handleGo = () => {
    const pageNum = parseInt(pageInput);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > 604) {
      alert('براہِ کرم 1 سے 604 کے درمیان صفحہ نمبر درج کریں۔');
      return;
    }

    // Map 604 pages roughly to 114 surahs
    // Approximate surah mapping based on standard mushaf
    let targetSurah = 1;
    if (pageNum <= 1) targetSurah = 1;
    else if (pageNum <= 49) targetSurah = 2;
    else if (pageNum <= 76) targetSurah = 3;
    else if (pageNum <= 106) targetSurah = 4;
    else if (pageNum <= 127) targetSurah = 5;
    else if (pageNum <= 150) targetSurah = 6;
    else if (pageNum <= 176) targetSurah = 7;
    else if (pageNum <= 186) targetSurah = 8;
    else if (pageNum <= 207) targetSurah = 9;
    else if (pageNum <= 221) targetSurah = 10;
    else if (pageNum <= 235) targetSurah = 11;
    else if (pageNum <= 248) targetSurah = 12;
    else if (pageNum <= 255) targetSurah = 13;
    else if (pageNum <= 261) targetSurah = 14;
    else if (pageNum <= 267) targetSurah = 15;
    else if (pageNum <= 281) targetSurah = 16;
    else if (pageNum <= 293) targetSurah = 17;
    else if (pageNum <= 304) targetSurah = 18;
    else if (pageNum <= 312) targetSurah = 19;
    else if (pageNum <= 321) targetSurah = 20;
    else if (pageNum <= 331) targetSurah = 21;
    else if (pageNum <= 341) targetSurah = 22;
    else if (pageNum <= 350) targetSurah = 23;
    else if (pageNum <= 359) targetSurah = 24;
    else if (pageNum <= 366) targetSurah = 25;
    else if (pageNum <= 376) targetSurah = 26;
    else if (pageNum <= 385) targetSurah = 27;
    else if (pageNum <= 396) targetSurah = 28;
    else if (pageNum <= 404) targetSurah = 29;
    else if (pageNum <= 410) targetSurah = 30;
    else if (pageNum <= 414) targetSurah = 31;
    else if (pageNum <= 417) targetSurah = 32;
    else if (pageNum <= 427) targetSurah = 33;
    else if (pageNum <= 434) targetSurah = 34;
    else if (pageNum <= 440) targetSurah = 35;
    else if (pageNum <= 445) targetSurah = 36;
    else if (pageNum <= 452) targetSurah = 37;
    else if (pageNum <= 458) targetSurah = 38;
    else if (pageNum <= 467) targetSurah = 39;
    else if (pageNum <= 476) targetSurah = 40;
    else if (pageNum <= 482) targetSurah = 41;
    else if (pageNum <= 489) targetSurah = 42;
    else if (pageNum <= 495) targetSurah = 43;
    else if (pageNum <= 498) targetSurah = 44;
    else if (pageNum <= 502) targetSurah = 45;
    else if (pageNum <= 506) targetSurah = 46;
    else if (pageNum <= 510) targetSurah = 47;
    else if (pageNum <= 515) targetSurah = 48;
    else if (pageNum <= 517) targetSurah = 49;
    else if (pageNum <= 520) targetSurah = 50;
    else if (pageNum <= 525) targetSurah = 53;
    else if (pageNum <= 534) targetSurah = 55;
    else if (pageNum <= 541) targetSurah = 57;
    else if (pageNum <= 552) targetSurah = 60;
    else if (pageNum <= 561) targetSurah = 66;
    else if (pageNum <= 571) targetSurah = 71;
    else if (pageNum <= 581) targetSurah = 77;
    else targetSurah = Math.min(114, 78 + Math.floor((pageNum - 582) * (36 / 22)));

    onGoToSurah(targetSurah);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-[#0e271c] border border-emerald-500/20 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-scaleUp">
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-2xl">
          📖
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          صفحہ نمبر پر جائیں • Goto Page
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          مصحف کا صفحہ نمبر (1 تا 604) درج کریں
        </p>

        <input
          type="number"
          min="1"
          max="604"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          placeholder="مثلاً: 250"
          className="w-full text-center text-2xl font-bold p-3 border-2 border-emerald-500/30 rounded-2xl outline-none focus:border-emerald-600 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white"
        />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-700 dark:text-gray-200 font-semibold text-sm transition-all"
          >
            منسوخ کریں
          </button>
          <button
            onClick={handleGo}
            className="flex-1 py-3 rounded-xl bg-[#1b7a4b] hover:bg-[#145d39] text-white font-bold text-sm shadow-md transition-all"
          >
            جائیں (Go)
          </button>
        </div>
      </div>
    </div>
  );
};
