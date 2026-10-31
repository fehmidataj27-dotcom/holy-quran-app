/**
 * Per-Ayah Audio Helper using EveryAyah.com CDN (100% Reliable 200 OK)
 * URL pattern: https://everyayah.com/data/{folder}/{surahPad3}{ayahPad3}.mp3
 * Example: https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/001001.mp3
 */

const EVERYAYAH_RECITER_MAP: Record<string, string> = {
  abdul_rahman_sudais:   'Abdurrahmaan_As-Sudais_192kbps',
  yasser_dossary:        'Yasser_Ad-Dussary_128kbps',
  saud_shuraim:          'Saood_ash-Shuraym_128kbps',
  maher_almuaiqly:       'MaherAlMuaiqly128kbps',
  bandar_baleela:        'MaherAlMuaiqly128kbps', // fallback to Haramain
  mishary_alafasy:       'Alafasy_128kbps',
  abu_bakr_shatri:       'Abu_Bakr_Ash-Shaatree_128kbps',
  saad_alghamdi:         'Ghamadi_40kbps',
  hani_rifai:            'Hani_Rifai_192kbps',
  muhammad_siddiq:       'Minshawy_Murattal_128kbps',
  mahmoud_khalil_husary: 'Husary_128kbps',
  minshawi:              'Minshawy_Murattal_128kbps',
  tablawi:               'Mohammad_al_Tablaway_128kbps',
  muhammad_ayyub:        'Muhammad_Ayyoub_128kbps',
  ibrahim_akhdar:        'Ibrahim_Akhdar_32kbps',
  khalid_jalil:          'Alafasy_128kbps', // fallback
  fares_abbad:           'Fares_Abbad_64kbps',
  ahmad_saber:           'Alafasy_128kbps', // fallback
  omar_ziauddin:         'Alafasy_128kbps', // fallback
  waheed_zafar_qasmi:    'Alafasy_128kbps', // fallback
  shakir_qasmi:          'Alafasy_128kbps', // fallback
  hassan_saleh:          'Alafasy_128kbps', // fallback
  sadaqat_ali:           'Alafasy_128kbps', // fallback
};

export function getAyahAudioUrl(
  reciterId: string,
  surahNumber: number,
  ayahNumberInSurah: number
): string {
  const folder = EVERYAYAH_RECITER_MAP[reciterId] || 'Abdurrahmaan_As-Sudais_192kbps';
  const sStr = String(surahNumber).padStart(3, '0');
  const aStr = String(ayahNumberInSurah).padStart(3, '0');
  return `https://everyayah.com/data/${folder}/${sStr}${aStr}.mp3`;
}
