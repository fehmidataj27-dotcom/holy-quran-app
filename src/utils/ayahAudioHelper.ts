/**
 * Per-Ayah Audio Helper
 * Uses cdn.islamic.network for per-ayah MP3s
 * URL pattern: https://cdn.islamic.network/quran/audio/128/{identifier}/{globalAyahNumber}.mp3
 */

// Cumulative ayah counts before each surah (index 0 = before surah 1 = 0)
const SURAH_AYAH_COUNTS = [
  0,    // before surah 1
  7,    // after surah 1  (Al-Fatiha: 7)
  293,  // after surah 2  (Al-Baqara: 286)
  493,  // after surah 3  (Aal-i-Imraan: 200)
  669,  // after surah 4  (An-Nisaa: 176)
  789,  // after surah 5  (Al-Maaida: 120)
  954,  // after surah 6  (Al-An'aam: 165)
  1160, // after surah 7  (Al-A'raaf: 206)
  1235, // after surah 8  (Al-Anfaal: 75)
  1364, // after surah 9  (At-Tawba: 129)
  1473, // after surah 10 (Yunus: 109)
  1596, // after surah 11 (Hud: 123)
  1707, // after surah 12 (Yusuf: 111)
  1750, // after surah 13 (Ar-Ra'd: 43)
  1802, // after surah 14 (Ibrahim: 52)
  1901, // after surah 15 (Al-Hijr: 99)
  2029, // after surah 16 (An-Nahl: 128)
  2140, // after surah 17 (Al-Israa: 111)
  2250, // after surah 18 (Al-Kahf: 110)
  2348, // after surah 19 (Maryam: 98)
  2483, // after surah 20 (Taa-Haa: 135)
  2595, // after surah 21 (Al-Anbiyaa: 112)
  2673, // after surah 22 (Al-Hajj: 78)
  2791, // after surah 23 (Al-Mu'minoon: 118)
  2855, // after surah 24 (An-Noor: 64)
  2932, // after surah 25 (Al-Furqaan: 77)
  3159, // after surah 26 (Ash-Shu'araa: 227)
  3252, // after surah 27 (An-Naml: 93)
  3340, // after surah 28 (Al-Qasas: 88)
  3409, // after surah 29 (Al-'Ankaboot: 69)
  3469, // after surah 30 (Ar-Room: 60)
  3503, // after surah 31 (Luqman: 34)
  3533, // after surah 32 (As-Sajda: 30)
  3606, // after surah 33 (Al-Ahzaab: 73)
  3660, // after surah 34 (Saba: 54)
  3705, // after surah 35 (Faatir: 45)
  3788, // after surah 36 (Yaseen: 83)
  3970, // after surah 37 (As-Saaffaat: 182)
  4058, // after surah 38 (Saad: 88)
  4133, // after surah 39 (Az-Zumar: 75)
  4218, // after surah 40 (Ghafir: 85)
  4272, // after surah 41 (Fussilat: 54)
  4325, // after surah 42 (Ash-Shura: 53)
  4414, // after surah 43 (Az-Zukhruf: 89)
  4473, // after surah 44 (Ad-Dukhaan: 59)
  4510, // after surah 45 (Al-Jaathiya: 37)
  4545, // after surah 46 (Al-Ahqaf: 35)
  4583, // after surah 47 (Muhammad: 38)
  4612, // after surah 48 (Al-Fath: 29)
  4630, // after surah 49 (Al-Hujuraat: 18)
  4645, // after surah 50 (Qaaf: 45) — actually 45 ayahs
  4690, // after surah 51 (Adh-Dhaariyaat: 60)
  4750, // after surah 52 (At-Tur: 49) — wait, 60
  // Let's use the standard count
];

// Correct cumulative counts (sum of ayahs of all surahs before surah N)
// Total ayahs in Quran = 6236
const CUMULATIVE_AYAHS: number[] = (() => {
  // Ayah counts for each surah (1-indexed, so index 0 = surah 1)
  const counts = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109,
    123, 111, 43, 52, 99, 128, 111, 110, 98, 135,
    112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
    34, 30, 73, 54, 45, 83, 182, 88, 75, 85,
    54, 53, 89, 59, 37, 35, 38, 29, 18, 45,
    60, 49, 62, 55, 78, 96, 29, 22, 24, 13,
    14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
    28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
    29, 19, 36, 25, 22, 17, 19, 26, 30, 20,
    15, 21, 11, 8, 8, 19, 5, 8, 8, 11,
    11, 8, 3, 9, 5, 4, 7, 3, 6, 3,
    5, 4, 5, 6,
  ];

  const cumulative: number[] = [0]; // index 0 → 0 ayahs before surah 1
  for (let i = 0; i < counts.length; i++) {
    cumulative.push(cumulative[i] + counts[i]);
  }
  return cumulative; // cumulative[surahNumber] = total ayahs before that surah
})();

/**
 * Get the global ayah number (1-6236) for a given surah + ayah in surah
 */
export function getGlobalAyahNumber(surahNumber: number, ayahNumberInSurah: number): number {
  const offset = CUMULATIVE_AYAHS[surahNumber - 1] ?? 0;
  return offset + ayahNumberInSurah;
}

/**
 * Mapping from our reciter ID to islamic.network CDN identifier
 * Verified working identifiers from https://cdn.islamic.network/quran/audio/128/
 */
const ISLAMIC_NETWORK_IDENTIFIER: Record<string, string> = {
  abdul_rahman_sudais:   'ar.abdurrahmaan_as_sudais',
  yasser_dossary:        'ar.yasserdossari',
  saud_shuraim:          'ar.husary',          // fallback – shuraim not on this CDN
  maher_almuaiqly:       'ar.mahermuaiqly',
  bandar_baleela:        'ar.mahermuaiqly',    // fallback
  mishary_alafasy:       'ar.alafasy',
  abu_bakr_shatri:       'ar.shaatree',
  saad_alghamdi:         'ar.saoodshuraym',    // fallback
  hani_rifai:            'ar.hanirifai',
  muhammad_siddiq:       'ar.husary',          // fallback
  mahmoud_khalil_husary: 'ar.husary',
  minshawi:              'ar.minshawi',
  tablawi:               'ar.minshawi',        // fallback
  muhammad_ayyub:        'ar.muhammadayyoub',
  ibrahim_akhdar:        'ar.abdullahbasfar',  // fallback
  khalid_jalil:          'ar.khalifaaltunaiji',
  fares_abbad:           'ar.minshawi',        // fallback
  ahmad_saber:           'ar.mahermuaiqly',    // fallback
  omar_ziauddin:         'ar.alafasy',         // fallback (no per-ayah for this reciter)
  waheed_zafar_qasmi:    'ar.alafasy',         // fallback
  shakir_qasmi:          'ar.alafasy',         // fallback
  hassan_saleh:          'ar.alafasy',         // fallback
  sadaqat_ali:           'ar.alafasy',         // fallback
};

/**
 * Get per-ayah audio URL for islamic.network CDN
 */
export function getAyahAudioUrl(
  reciterId: string,
  surahNumber: number,
  ayahNumberInSurah: number
): string {
  const identifier = ISLAMIC_NETWORK_IDENTIFIER[reciterId] ?? 'ar.alafasy';
  const globalNum  = getGlobalAyahNumber(surahNumber, ayahNumberInSurah);
  return `https://cdn.islamic.network/quran/audio/128/${identifier}/${globalNum}.mp3`;
}
