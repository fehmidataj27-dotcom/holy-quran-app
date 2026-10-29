import { SHAKIR_QASMI_MAP } from '../data/shakirQasmiMap';
import { WAHEED_ZAFAR_MAP } from '../data/waheedZafarMap';

/**
 * SPECIAL_RECITER_SURAHS
 * For reciters whose audio is NOT available as a full 114-surah folder.
 * Each entry maps: surahNumber → direct verified MP3 URL
 *
 * Reciters with serverUrl = 'SPECIAL_ONLY' MUST be listed here.
 * Any surah NOT in the map → returns '' → player shows "not available" message.
 */
export const SPECIAL_RECITER_SURAHS: Record<string, Record<number, string>> = {

  // ─── Qari Abdul Rahman Mossad ──────────────────────────────────────────────
  // Has specific surahs scattered across archive.org items (not a full collection)
  abdul_rahman_mossad: {
    1:   'https://ia601600.us.archive.org/9/items/1_20250825_202508/1.mp3',
    2:   'https://ia800109.us.archive.org/31/items/a2025112aaaaa5/%D8%AA%D9%84%D8%A7%D9%88%D8%A9%20%D9%85%D9%86%20%D8%B3%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D8%A8%D9%82%D8%B1%D8%A9%20%20%D8%B9%D8%A8%D8%AF%20%D8%A7%D9%84%D8%B1%D8%AD%D9%85%D9%86%20%D9%85%D8%B3%D8%B9%D8%AF%20%202024.mp3',
    10:  'https://ia800109.us.archive.org/31/items/a2025112aaaaa5/%D8%AA%D9%84%D8%A7%D9%88%D8%A9%20%D9%85%D9%86%20%D8%B3%D9%88%D8%B1%D8%A9%20%D9%8A%D9%88%D9%86%D8%B3%20%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B1%D8%AD%D9%85%D9%86%20%D9%85%D8%B3%D8%B9%D8%AF%20%202023.mp3',
    25:  'https://ia800109.us.archive.org/31/items/a2025112aaaaa5/%D8%AA%D9%84%D8%A7%D9%88%D8%A9%20%D9%85%D9%86%20%D8%B3%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D9%81%D8%B1%D9%82%D8%A7%D9%86%20%20%D8%B9%D8%A8%D8%AF%20%D8%A7%D9%84%D8%B1%D8%AD%D9%85%D9%86%20%D9%85%D8%B3%D8%B9%D8%AF%20%202024.mp3',
    27:  'https://ia800109.us.archive.org/31/items/a2025112aaaaa5/%D8%AA%D9%84%D8%A7%D9%88%D8%A9%20%D9%85%D9%86%20%D8%B3%D9%88%D8%B1%D8%A9%20%D8%A7%D9%84%D9%86%D9%85%D9%84%20%20%D8%B9%D8%A8%D8%AF%20%D8%A7%D9%84%D8%B1%D8%AD%D9%85%D9%86%20%D9%85%D8%B3%D8%B9%D8%AF%20%202023.mp3',
    32:  'https://ia800109.us.archive.org/31/items/a2025112aaaaa5/032%20-%20%D8%A7%D9%84%D8%B3%D8%AC%D8%AF%D8%A9.mp3',
    49:  'https://ia800109.us.archive.org/31/items/a2025112aaaaa5/049%20-%20%D8%A7%D9%84%D8%AD%D8%AC%D8%B1%D8%A7%D8%AA.mp3',
    67:  'https://ia801908.us.archive.org/33/items/a2025112aaaaa5/067%20-%20%D8%A7%D9%84%D9%85%D9%84%D9%83.mp3',
    73:  'https://ia800109.us.archive.org/31/items/a2025112aaaaa5/073%20-%20%D8%A7%D9%84%D9%85%D8%B2%D9%85%D9%84.mp3',
    78:  'https://ia800109.us.archive.org/31/items/a2025112aaaaa5/078%20-%20%D8%A7%D9%84%D9%86%D8%A8%D8%A3.mp3',
    87:  'https://ia800109.us.archive.org/31/items/a2025112aaaaa5/087%20-%20%D8%A7%D9%84%D8%A3%D8%B9%D9%84%D9%89.mp3',
    88:  'https://ia800109.us.archive.org/31/items/a2025112aaaaa5/088%20-%20%D8%A7%D9%84%D8%BA%D8%A7%D8%B4%D9%8A%D8%A9.mp3',
    100: 'https://ia800109.us.archive.org/31/items/a2025112aaaaa5/100%20-%20%D8%A7%D9%84%D8%B9%D8%A7%D8%AF%D9%8A%D8%A7%D8%AA.mp3',
    107: 'https://ia800109.us.archive.org/31/items/a2025112aaaaa5/107%20-%20%D8%A7%D9%84%D9%85%D8%A7%D8%B9%D9%88%D9%86.mp3',
  },

  // ─── Ridjaal Ahmed ─────────────────────────────────────────────────────────
  // Independent Indonesian reciter — no public full-Quran CDN folder.
  // NOTE: URLs below are placeholders. When 404, the error handler auto-shows
  // "not available". Add real verified URLs as they become available.
  ridjal_ahmad: {
    // Currently no verified free CDN links for full surahs.
    // Add links here when found, e.g.:
    // 1: 'https://example.com/ridjal/001.mp3',
  },
};

/**
 * Returns the exact playable URL for a given reciter + surah.
 * Returns '' (empty string) when the surah is not available for this reciter.
 *
 * Logic:
 *  1. If reciter has SPECIAL_ONLY serverUrl → only return mapped surahs
 *  2. If reciter has a special override for this surah → return that
 *  3. Otherwise → standard 3-digit folder pattern: serverUrl + '001.mp3'
 */
export function getReciterSurahUrl(
  reciterId: string,
  serverUrl: string,
  surahNumber: number
): string {
  const specialMap = SPECIAL_RECITER_SURAHS[reciterId];

  // Case 1: SPECIAL_ONLY reciters — return mapped URL or '' (not available)
  if (serverUrl === 'SPECIAL_ONLY') {
    return specialMap?.[surahNumber] ?? '';
  }

  // Case 2: Has a special override for this specific surah → use it
  if (specialMap?.[surahNumber]) {
    return specialMap[surahNumber];
  }

  // Case 2b: Qari Shakir Qasmi archive.org mapping
  if (reciterId === 'qari_shakir_qasmi') {
    const filename = SHAKIR_QASMI_MAP[surahNumber];
    if (filename) {
      return `https://archive.org/download/quran-shakir-qasmi/${encodeURIComponent(filename)}`;
    }
  }

  // Case 2c: Qari Waheed Zafar Qasmi archive.org mapping
  if (reciterId === 'qari_waheed_zafar_qasmi') {
    const filename = WAHEED_ZAFAR_MAP[surahNumber];
    if (filename) {
      return `https://archive.org/download/AlQuranWithUrduTranslation_Recitation_By_QariWaheedZafarQasmi_Translation_By_Mau/${encodeURIComponent(filename)}`;
    }
  }

  // Case 3: Standard folder-based pattern
  const base = serverUrl.endsWith('/') ? serverUrl : `${serverUrl}/`;

  // Quran.com CDN (qdc) paths use unpadded numbers like 1.mp3, 25.mp3
  if (base.includes('/qdc/')) {
    return `${base}${surahNumber}.mp3`;
  }

  // Standard 3-digit padded surah numbering (001.mp3, 025.mp3)
  const surahPadded = String(surahNumber).padStart(3, '0');
  return `${base}${surahPadded}.mp3`;
}
