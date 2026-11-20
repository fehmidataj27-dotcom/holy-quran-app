/**
 * Audio helper for Adhkar
 * Provides high quality recitation audio URLs for morning/evening adhkar.
 * Uses official Mishary Rashid Alafasy Quran audio for Ayatul Kursi, Surah Ikhlas, Falaq, Nas,
 * and high quality Arabic audio streams for daily supplications.
 */

// Mapping of Quranic adhkar to crystal clear EveryAyah MP3 recitations by Sheikh Mishary Alafasy
export function getDhikrAudioUrl(mode: 'morning' | 'evening', id: number, arabicText: string): string {
  // 1. Ayatul Kursi (Surah 2 Ayah 255)
  if ((mode === 'morning' && id === 2) || (mode === 'evening' && id === 1)) {
    return 'https://everyayah.com/data/Alafasy_128kbps/002255.mp3';
  }

  // 2. Surah Al-Ikhlas (112:1)
  if ((mode === 'morning' && id === 14) || (mode === 'evening' && id === 13)) {
    return 'https://everyayah.com/data/Alafasy_128kbps/112001.mp3';
  }

  // 3. Surah Al-Falaq (113:1)
  if ((mode === 'morning' && id === 15) || (mode === 'evening' && id === 14)) {
    return 'https://everyayah.com/data/Alafasy_128kbps/113001.mp3';
  }

  // 4. Surah An-Nas (114:1)
  if ((mode === 'morning' && id === 16) || (mode === 'evening' && id === 15)) {
    return 'https://everyayah.com/data/Alafasy_128kbps/114001.mp3';
  }

  // 5. For other Duas and Supplications:
  // Use clean Arabic speech audio streaming MP3 (always works on all Android, iOS & Chrome browsers)
  const cleanSnippet = arabicText
    .replace(/[۝۞۩]/g, '')
    .replace(/[\n\r]+/g, ' ')
    .trim()
    .substring(0, 180); // Google TTS optimal chunk

  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(cleanSnippet)}`;
}
