/**
 * Per-Ayah Audio Helper using EveryAyah.com CDN (100% Reliable 200 OK)
 * URL pattern: https://everyayah.com/data/{folder}/{surahPad3}{ayahPad3}.mp3
 * Example: https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/001001.mp3
 */

const EVERYAYAH_RECITER_MAP: Record<string, string> = {
  abdul_rahman_sudais:      'Abdurrahmaan_As-Sudais_192kbps',
  yasser_dossary:           'Yasser_Ad-Dussary_128kbps',
  saud_shuraim:             'Saood_ash-Shuraym_128kbps',
  maher_almuaiqly:          'MaherAlMuaiqly128kbps',
  bandar_baleela:           'MaherAlMuaiqly128kbps',
  ali_jaber:                'Ali_Jaber_64kbps',
  ali_alhudhaify:           'Hudhaify_128kbps',
  abdullah_aljuhany:        'Alafasy_128kbps',
  mohammed_ayyoub:          'Muhammad_Ayyoub_128kbps',
  muhammad_ayyub:           'Muhammad_Ayyoub_128kbps',
  mishary_alafasy:          'Alafasy_128kbps',
  nasser_alqatami:          'Nasser_Alqatami_128kbps',
  saad_alghamdi:            'Ghamadi_40kbps',
  idrees_abkar:             'Alafasy_128kbps',
  khalid_aljalil:           'Alafasy_128kbps',
  abdulbasit_mujawwad:      'Abdul_Basit_Mujawwad_128kbps',
  abdulbasit_murattal:      'Abdul_Basit_Murattal_64kbps',
  mahmoud_khalil_alhusary:  'Husary_128kbps',
  mahmoud_khalil_husary:    'Husary_128kbps',
  mohammed_siddiq_minshawi: 'Minshawy_Murattal_128kbps',
  minshawi:                 'Minshawy_Murattal_128kbps',
  abu_bakr_shatri:          'Abu_Bakr_Ash-Shaatree_128kbps',
  hani_rifai:               'Hani_Rifai_192kbps',
  ibrahim_akhdar:           'Ibrahim_Akhdar_32kbps',
  fares_abbad:              'Fares_Abbad_64kbps',
  hasan_saleh:              'Alafasy_128kbps',
  alaa_aql:                 'Alafasy_128kbps',
  al_zain_mohamed:          'Alafasy_128kbps',
  wadih_al_yamani:          'Alafasy_128kbps',
  omar_bin_ziauddin:        'Alafasy_128kbps',
  qari_waheed_zafar_qasmi:  'Alafasy_128kbps',
  qari_shakir_qasmi:        'Alafasy_128kbps',
  qari_sadaqat_ali:         'Alafasy_128kbps',
  qari_umair_shamim:        'Alafasy_128kbps',
  abdul_rahman_mossad:      'Alafasy_128kbps',
  ridjal_ahmad:             'Alafasy_128kbps',
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
