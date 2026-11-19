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
            <div>
              <h1 className="text-lg font-bold leading-tight">Bookmarks</h1>
              <p className="text-xs text-emerald-200 font-arabic">محفوظ شدہ علامات</p>
            </div>
          </div>
        </div>

        {/* Tabs: Pages (Mushaf) vs Ayahs */}
        <div className="flex bg-black/20 p-1 rounded-xl gap-1">
          <button
            onClick={() => setTab('pages')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'pages'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            <div>📖 Mushaf Pages ({pageBookmarks.length})</div>
            <div className="text-[10px] opacity-75 font-arabic">مصحف صفحات</div>
          </button>
          <button
            onClick={() => setTab('ayahs')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'ayahs'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-emerald-100 hover:text-white'
            }`}
          >
            <div>🔖 Ayah Bookmarks ({ayahBookmarks.length})</div>
            <div className="text-[10px] opacity-75 font-arabic">آیات مبارکہ</div>
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-3">
        {/* Pages Tab */}
        {tab === 'pages' && (
          <>
            {pageBookmarks.length === 0 ? (
              <div className="bg-white dark:bg-[#0e271c] rounded-3xl p-8 text-center border border-emerald-900/10 dark:border-emerald-700/20 shadow-sm space-y-2">
                <div className="text-4xl text-emerald-400">📖</div>
                <div className="text-base font-bold text-gray-800 dark:text-white">No pages bookmarked yet</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">کوئی صفحہ محفوظ نہیں کیا گیا</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Tap the bookmark icon while reading Mushaf to save a page here.
                  <br />
                  <span className="font-arabic">مصحف پڑھتے وقت بک مارک آئیکن دبائیں</span>
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
                          Page #{page} — Mushaf
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-arabic">
                          مصحف صفحہ نمبر {page}
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                          16-Line Indo-Pak Quran • Tap to open
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => onRemovePageBookmark(page)}
                      className="text-gray-400 hover:text-red-500 p-2 text-sm transition-colors"
                      title="Delete • حذف کریں"
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
              <div className="bg-white dark:bg-[#0e271c] rounded-3xl p-8 text-center border border-emerald-900/10 dark:border-emerald-700/20 shadow-sm space-y-2">
                <div className="text-4xl text-emerald-400">🔖</div>
                <div className="text-base font-bold text-gray-800 dark:text-white">No Ayahs bookmarked yet</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">کوئی آیت محفوظ نہیں کی گئی</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Tap the bookmark icon on any Ayah to save it here.
                  <br />
                  <span className="font-arabic">کسی بھی آیت کے بک مارک آئیکن پر کلک کریں</span>
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
                          Surah {b.surahName} • Ayah {b.ayahNumber}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-arabic">
                          {b.surahName} • آیت نمبر {b.ayahNumber}
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {b.timestamp}
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => onRemoveAyahBookmark(b.id)}
                      className="text-gray-400 hover:text-red-500 p-2 text-sm transition-colors"
                      title="Delete • حذف کریں"
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
