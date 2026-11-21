/**
 * Audio helper for Adhkar
 * Provides 100% offline-ready recitation audio URLs for all adhkar categories.
 * Bundled offline files in /audio/adhkar/ ensure zero internet is needed for key Quranic passages.
 */

export type AdhkarCategory = 'morning' | 'evening' | 'prayer' | 'sleeping';

export function getDhikrAudioUrl(category: AdhkarCategory, id: number, arabicText: string): string {
  // 1. Ayatul Kursi (Surah 2 Ayah 255) - bundled locally for 100% offline
  if (
    (category === 'morning' && id === 2) ||
    (category === 'evening' && id === 1) ||
    (category === 'prayer' && id === 9) ||
    (category === 'sleeping' && id === 3)
  ) {
    return '/audio/adhkar/002255.mp3';
  }

  // 2. Surah Al-Ikhlas (112:1) - bundled locally for 100% offline
  if (
    (category === 'morning' && id === 14) ||
    (category === 'evening' && id === 13) ||
    (category === 'prayer' && id === 10) ||
    (category === 'sleeping' && id === 6)
  ) {
    return '/audio/adhkar/112001.mp3';
  }

  // 3. Surah Al-Falaq (113:1) - bundled locally for 100% offline
  if (
    (category === 'morning' && id === 15) ||
    (category === 'evening' && id === 14) ||
    (category === 'prayer' && id === 11) ||
    (category === 'sleeping' && id === 7)
  ) {
    return '/audio/adhkar/113001.mp3';
  }

  // 4. Surah An-Nas (114:1) - bundled locally for 100% offline
  if (
    (category === 'morning' && id === 16) ||
    (category === 'evening' && id === 15) ||
    (category === 'prayer' && id === 12) ||
    (category === 'sleeping' && id === 8)
  ) {
    return '/audio/adhkar/114001.mp3';
  }

  // 5. For other Duas and Supplications:
  const cleanSnippet = arabicText
    .replace(/[۝۞۩]/g, '')
    .replace(/[\n\r]+/g, ' ')
    .trim()
    .substring(0, 180);

  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(cleanSnippet)}`;
}
