export interface VerseTiming {
  verseNumber: number; // e.g. 1, 2, 3
  timestampFrom: number; // in milliseconds
  timestampTo: number; // in milliseconds
  duration: number;
}

// In-memory cache for loaded surah timings: `${reciterId}_${surahNumber}` -> VerseTiming[]
const timingCache: Record<string, VerseTiming[]> = {};

/**
 * Fetch official verified millisecond verse timings from Quran.com CDN
 */
export async function fetchSurahTimings(
  qdcReciterId: number,
  surahNumber: number
): Promise<VerseTiming[]> {
  const cacheKey = `${qdcReciterId}_${surahNumber}`;
  if (timingCache[cacheKey]) {
    return timingCache[cacheKey];
  }

  try {
    const url = `https://api.qurancdn.com/api/qdc/audio/reciters/${qdcReciterId}/audio_files?chapter=${surahNumber}&segments=true`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    const audioFile = data.audio_files?.[0];
    if (!audioFile?.verse_timings) return [];

    const timings: VerseTiming[] = audioFile.verse_timings.map((vt: any) => {
      // verse_key is e.g. "24:1" -> extract ayah number
      const verseNum = parseInt(vt.verse_key.split(':')[1], 10);
      return {
        verseNumber: verseNum,
        timestampFrom: vt.timestamp_from,
        timestampTo: vt.timestamp_to,
        duration: vt.duration
      };
    });

    timingCache[cacheKey] = timings;
    return timings;
  } catch (err) {
    console.warn('Could not fetch exact verse timings:', err);
    return [];
  }
}
