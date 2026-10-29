export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  style: string;
  category: 'Pakistan' | 'Haramain' | 'Egypt' | 'Saudi' | 'Global' | 'Classic';
  serverUrl: string; // Base URL from mp3quran or quranicaudio
  subfolder?: string;
  bitrate: string;
  photo?: string;
  description: string;
  qdcReciterId?: number; // Quran.com official CDN reciter ID for 100% exact timing
  hasFullQuran?: boolean; // True if all 114 Surahs available
  availableSurahs?: number[]; // List of available surah numbers if partial
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  tajweedText?: string;
  translationUrdu?: string;
  translationEn?: string;
  audio?: string;
  juz: number;
  page: number;
}

export interface TajweedRule {
  class: string;
  title: string;
  titleUrdu: string;
  color: string;
  description: string;
}
