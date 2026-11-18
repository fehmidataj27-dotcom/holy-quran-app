import React from 'react';
import { Surah } from '../types';

export interface BookmarkItem {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  timestamp: string;
}

interface BookmarksViewProps {
  bookmarks: BookmarkItem[];
  onSelectBookmark: (surahNumber: number, ayahNumber: number) => void;
  onRemoveBookmark: (id: string) => void;
  onBack: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarks,
  onSelectBookmark,
  onRemoveBookmark,
  onBack,
}) => {
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
          <h1 className="text-xl font-bold font-sans">Bookmarks • محفوظ نشانات</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-3">
        {bookmarks.length === 0 ? (
          <div className="bg-white dark:bg-[#0e271c] rounded-3xl p-8 text-center border border-emerald-900/10 dark:border-emerald-700/20 shadow-sm space-y-3">
            <div className="text-4xl text-emerald-400">🔖</div>
            <div className="text-base font-bold text-gray-800 dark:text-white">کوئی بُک مارک موجود نہیں ہے</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              قرآن پڑھتے وقت کسی بھی آیت کے بُک مارک آئیکن پر کلک کریں تاکہ وہ یہاں محفوظ ہو جائے۔
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#0e271c] rounded-3xl p-2 shadow-sm border border-emerald-900/10 dark:border-emerald-700/20 divide-y divide-emerald-50 dark:divide-emerald-900/40">
            {bookmarks.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3.5 hover:bg-emerald-50 dark:hover:bg-white/5 rounded-2xl transition-all"
              >
                <button
                  onClick={() => onSelectBookmark(b.surahNumber, b.ayahNumber)}
                  className="flex items-center gap-3.5 text-left flex-1"
                >
                  <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center text-lg shadow-sm">
                    🔖
                  </span>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                      {b.surahName}
                    </div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400">
                      آیت نمبر: {b.ayahNumber} • {b.timestamp}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => onRemoveBookmark(b.id)}
                  className="text-gray-400 hover:text-red-500 p-2 text-sm transition-colors"
                  title="حذف کریں"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
