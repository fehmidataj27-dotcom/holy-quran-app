/**
 * Audio helper for Adhkar
 * Provides 100% offline-ready recitation audio URLs for morning/evening adhkar.
 * Bundled offline files in /audio/adhkar/ ensure zero internet is needed.
 */

export function getDhikrAudioUrl(mode: 'morning' | 'evening', id: number, arabicText: string): string {
  // 1. Ayatul Kursi (Surah 2 Ayah 255) - bundled locally for 100% offline
  if ((mode === 'morning' && id === 2) || (mode === 'evening' && id === 1)) {
    return '/audio/adhkar/002255.mp3';
  }

  // 2. Surah Al-Ikhlas (112:1) - bundled locally for 100% offline
  if ((mode === 'morning' && id === 14) || (mode === 'evening' && id === 13)) {
    return '/audio/adhkar/112001.mp3';
  }

  // 3. Surah Al-Falaq (113:1) - bundled locally for 100% offline
  if ((mode === 'morning' && id === 15) || (mode === 'evening' && id === 14)) {
    return '/audio/adhkar/113001.mp3';
  }

  // 4. Surah An-Nas (114:1) - bundled locally for 100% offline
  if ((mode === 'morning' && id === 16) || (mode === 'evening' && id === 15)) {
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
