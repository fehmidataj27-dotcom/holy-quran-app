import React, { useState } from 'react';

export interface AyahBookmarkItem {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  timestamp: string;
}

export interface PageBookmarkItem {
  pageNumber: number;
  timestamp: string;
}

interface BookmarksViewProps {
  ayahBookmarks: AyahBookmarkItem[];
  pageBookmarks: number[];
  onSelectAyahBookmark: (surahNumber: number, ayahNumber: number) => void;
  onSelectPageBookmark: (pageNumber: number) => void;
  onRemoveAyahBookmark: (id: string) => void;
  onRemovePageBookmark: (pageNumber: number) => void;
  onBack: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  ayahBookmarks,
  pageBookmarks,
  onSelectAyahBookmark,
  onSelectPageBookmark,
  onRemoveAyahBookmark,
  onRemovePageBookmark,
  onBack,
}) => {
  const [tab, setTab] = useState<'pages' | 'ayahs'>('pages');

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
            <h1 className="text-xl font-bold font-sans">Bookmarks • محفوظ شدہ علامات</h1>
          </div>
        </div>

        {/* Tabs: Pages (Mushaf) vs Ayahs */}
        <div className="flex bg-black/20 p-1 rounded-xl gap-1">
          <button
            onClick={() => setTab('pages')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tab === 'pages'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            📖 مصحف صفحات ({pageBookmarks.length})
          </button>
          <button
            onClick={() => setTab('ayahs')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tab === 'ayahs'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            🔖 آیات مبارکہ ({ayahBookmarks.length})
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-3">
        {/* Pages Tab */}
        {tab === 'pages' && (
          <>
            {pageBookmarks.length === 0 ? (
              <div className="bg-white dark:bg-[#0e271c] rounded-3xl p-8 text-center border border-emerald-900/10 dark:border-emerald-700/20 shadow-sm space-y-3">
                <div className="text-4xl text-emerald-400">📖</div>
                <div className="text-base font-bold text-gray-800 dark:text-white">کوئی صفحہ بک مارک نہیں کیا گیا</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  مصحف میں پڑھتے وقت اوپر بک مارک آئیکن دبائیں تاکہ وہ صفحہ یہاں محفوظ ہو جائے اور بعد میں وہیں سے جاری رکھ سکیں۔
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#0e271c] rounded-3xl p-2 shadow-sm border border-emerald-900/10 dark:border-emerald-700/20 divide-y divide-emerald-50 dark:divide-emerald-900/40">
                {pageBookmarks.map((page) => (
                  <div
                    key={page}
                    className="flex items-center justify-between p-3.5 hover:bg-emerald-50 dark:hover:bg-white/5 rounded-2xl transition-all"
                  >
                    <button
                      onClick={() => onSelectPageBookmark(page)}
                      className="flex items-center gap-3.5 text-left flex-1"
                    >
                      <span className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center justify-center text-sm font-bold shadow-sm">
                        {page}
                      </span>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm">
                          مصحف صفحہ نمبر {page}
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400">
                          16 سطری تجویدی مصحف • صفحہ کھولیں
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => onRemovePageBookmark(page)}
                      className="text-gray-400 hover:text-red-500 p-2 text-sm transition-colors"
                      title="حذف کریں"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Ayahs Tab */}
        {tab === 'ayahs' && (
          <>
            {ayahBookmarks.length === 0 ? (
              <div className="bg-white dark:bg-[#0e271c] rounded-3xl p-8 text-center border border-emerald-900/10 dark:border-emerald-700/20 shadow-sm space-y-3">
                <div className="text-4xl text-emerald-400">🔖</div>
                <div className="text-base font-bold text-gray-800 dark:text-white">کوئی آیت محفوظ نہیں ہے</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  قرآن سنتے یا پڑھتے وقت کسی بھی آیت کے بک مارک آئیکن پر کلک کریں تاکہ وہ یہاں محفوظ ہو جائے۔
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#0e271c] rounded-3xl p-2 shadow-sm border border-emerald-900/10 dark:border-emerald-700/20 divide-y divide-emerald-50 dark:divide-emerald-900/40">
                {ayahBookmarks.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3.5 hover:bg-emerald-50 dark:hover:bg-white/5 rounded-2xl transition-all"
                  >
                    <button
                      onClick={() => onSelectAyahBookmark(b.surahNumber, b.ayahNumber)}
                      className="flex items-center gap-3.5 text-left flex-1"
                    >
                      <span className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-lg shadow-sm">
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
                      onClick={() => onRemoveAyahBookmark(b.id)}
                      className="text-gray-400 hover:text-red-500 p-2 text-sm transition-colors"
                      title="حذف کریں"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
