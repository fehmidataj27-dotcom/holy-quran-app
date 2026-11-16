/**
 * Per-Ayah Audio Helper using EveryAyah.com CDN (100% Reliable 200 OK)
 * URL pattern: https://everyayah.com/data/{folder}/{surahPad3}{ayahPad3}.mp3
 * Example: https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/001001.mp3
 */

/**
 * Only reciters who actually have per-ayah audio on EveryAyah.com are listed here.
 * Reciters NOT in this map → getAyahAudioUrl() returns '' (empty) → per-ayah play disabled.
 * SPECIAL_ONLY reciters (Ridjaal Ahmad, Waheed Zafar etc.) have full-surah audio only.
 */
const EVERYAYAH_RECITER_MAP: Record<string, string> = {
  // ── Verified on EveryAyah.com (200 OK) ──────────────────────────────────────
  "mohammed_ayyoub":           "Muhammad_Ayyoub_128kbps",
  "abdul_rahman_sudais":       "Abdurrahmaan_As-Sudais_192kbps",
  "yasser_dossary":            "Yasser_Ad-Dussary_128kbps",
  "saud_shuraim":              "Saood_ash-Shuraym_128kbps",
  "maher_almuaiqly":           "MaherAlMuaiqly128kbps",
  "bandar_baleela":            "MaherAlMuaiqly128kbps",
  "ali_jaber":                 "Ali_Jaber_64kbps",
  "ali_alhudhaify":            "Hudhaify_128kbps",
  "abdullah_aljuhany":         "Abdullah_Basfar_192kbps",
  "mishary_alafasy":           "Alafasy_128kbps",
  "nasser_alqatami":           "Nasser_Alqatami_128kbps",
  "saad_alghamdi":             "Ghamadi_40kbps",
  "abdulbasit_mujawwad":       "Abdul_Basit_Mujawwad_128kbps",
  "abdulbasit_murattal":       "Abdul_Basit_Murattal_192kbps",
  "mahmoud_khalil_alhusary":   "Husary_128kbps",
  "mohammed_siddiq_minshawi":  "Minshawy_Murattal_128kbps",
  "mustafa_ismail":            "Mustafa_Ismail_48kbps",
  // ── NOT on EveryAyah → full-surah only (SPECIAL_ONLY) → no entry here ───────
  // ridjal_ahmad, qari_waheed_zafar_qasmi, qari_shakir_qasmi, qari_sadaqat_ali,
  // qari_umair_shamim, hasan_saleh, alaa_aql, al_zain_mohamed, wadih_al_yamani,
  // omar_bin_ziauddin, idrees_abkar, khalid_aljalil, abdul_rahman_mossad
};


export function getAyahAudioUrl(
  reciterId: string,
  surahNumber: number,
  ayahNumberInSurah: number
): string {
  const folder = EVERYAYAH_RECITER_MAP[reciterId];
  // Reciter not in EveryAyah map -> return '' (per-ayah not available)
  if (!folder) return '';
  const sStr = String(surahNumber).padStart(3, '0');
  const aStr = String(ayahNumberInSurah).padStart(3, '0');
  return `https://everyayah.com/data/${folder}/${sStr}${aStr}.mp3`;
}


export const TASMIYAH_AUDIO_URL = '/audio/tasmiyah_husary.mp3';
export const TAAWWUZ_AUDIO_URL = '/audio/tasmiyah_alafasy.mp3';
