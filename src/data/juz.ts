export interface JuzInfo {
  number: number;
  nameUrdu: string;
  nameArabic: string;
  nameTranslit: string;
  startSurah: number;
  startAyah: number;
  page: number;
}

export const JUZ_LIST: JuzInfo[] = [
  { number: 1, nameArabic: 'الم', nameUrdu: 'الم', nameTranslit: 'Alif Lam Meem', startSurah: 1, startAyah: 1, page: 1 },
  { number: 2, nameArabic: 'سَيَقُولُ', nameUrdu: 'سیقول', nameTranslit: 'Sayaqool', startSurah: 2, startAyah: 142, page: 22 },
  { number: 3, nameArabic: 'تِلْكَ الرُّسُلُ', nameUrdu: 'تلک الرسل', nameTranslit: 'Tilkal Rusull', startSurah: 2, startAyah: 253, page: 42 },
  { number: 4, nameArabic: 'لَنْ تَنَالُوا', nameUrdu: 'لن تنالوا', nameTranslit: 'Lan Tana Loo', startSurah: 3, startAyah: 93, page: 62 },
  { number: 5, nameArabic: 'وَالْمُحْصَنَاتُ', nameUrdu: 'والمحصنت', nameTranslit: 'Wal Mohsanat', startSurah: 4, startAyah: 24, page: 82 },
  { number: 6, nameArabic: 'لَا يُحِبُّ اللَّهُ', nameUrdu: 'لا یحب اللہ', nameTranslit: 'La Yuhibbullah', startSurah: 4, startAyah: 148, page: 102 },
  { number: 7, nameArabic: 'وَإِذَا سَمِعُوا', nameUrdu: 'واذا سمعوا', nameTranslit: 'Wa Iza Samiu', startSurah: 5, startAyah: 82, page: 121 },
  { number: 8, nameArabic: 'وَلَوْ أَنَّنَا', nameUrdu: 'ولو اننا', nameTranslit: 'Wa Lau Annana', startSurah: 6, startAyah: 111, page: 142 },
  { number: 9, nameArabic: 'قَالَ الْمَلَأُ', nameUrdu: 'قال الملاء', nameTranslit: 'Qalal Malao', startSurah: 7, startAyah: 88, page: 162 },
  { number: 10, nameArabic: 'وَاعْلَمُوا', nameUrdu: 'واعلموا', nameTranslit: 'Wa A\'lamu', startSurah: 8, startAyah: 41, page: 182 },
  { number: 11, nameArabic: 'يَعْتَذِرُونَ', nameUrdu: 'یعتذرون', nameTranslit: 'Ya\'taziroon', startSurah: 9, startAyah: 93, page: 201 },
  { number: 12, nameArabic: 'وَمَا مِنْ دَابَّةٍ', nameUrdu: 'وما من دابة', nameTranslit: 'Wa Mamin Da\'abat', startSurah: 11, startAyah: 6, page: 222 },
  { number: 13, nameArabic: 'وَمَا أُبَرِّئُ', nameUrdu: 'وما ابریء', nameTranslit: 'Wa Ma Ubrioo', startSurah: 12, startAyah: 53, page: 242 },
  { number: 14, nameArabic: 'رُبَمَا', nameUrdu: 'ربما', nameTranslit: 'Rubama', startSurah: 15, startAyah: 1, page: 262 },
  { number: 15, nameArabic: 'سُبْحَانَ الَّذِي', nameUrdu: 'سبحان الذی', nameTranslit: 'Subhanallazi', startSurah: 17, startAyah: 1, page: 282 },
  { number: 16, nameArabic: 'قَالَ أَلَمْ', nameUrdu: 'قال الم', nameTranslit: 'Qal Alam', startSurah: 18, startAyah: 75, page: 302 },
  { number: 17, nameArabic: 'اقْتَرَبَ لِلنَّاسِ', nameUrdu: 'اقترب للناس', nameTranslit: 'Aqtarabo', startSurah: 21, startAyah: 1, page: 322 },
  { number: 18, nameArabic: 'قَدْ أَفْلَحَ', nameUrdu: 'قد افلح', nameTranslit: 'Qadd Aflaha', startSurah: 23, startAyah: 1, page: 342 },
  { number: 19, nameArabic: 'وَقَالَ الَّذِينَ', nameUrdu: 'وقال الذین', nameTranslit: 'Wa Qalallazina', startSurah: 25, startAyah: 21, page: 362 },
  { number: 20, nameArabic: 'أَمَّنْ خَلَقَ', nameUrdu: 'امن خلق', nameTranslit: 'A\'man Khalaqa', startSurah: 27, startAyah: 56, page: 382 },
  { number: 21, nameArabic: 'اتْلُ مَا أُوحِيَ', nameUrdu: 'اتل ما اوحی', nameTranslit: 'Utlu Ma Oohi', startSurah: 29, startAyah: 46, page: 402 },
  { number: 22, nameArabic: 'وَمَنْ يَقْنُتْ', nameUrdu: 'ومن یقنت', nameTranslit: 'Wa Manyaqnut', startSurah: 33, startAyah: 31, page: 422 },
  { number: 23, nameArabic: 'وَمَا لِيَ', nameUrdu: 'وما لی', nameTranslit: 'Wa Mali', startSurah: 36, startAyah: 28, page: 442 },
  { number: 24, nameArabic: 'فَمَنْ أَظْلَمُ', nameUrdu: 'فمن اظلم', nameTranslit: 'Faman Azlamu', startSurah: 39, startAyah: 32, page: 462 },
  { number: 25, nameArabic: 'إِلَيْهِ يُرَدُّ', nameUrdu: 'الیہ یرد', nameTranslit: 'Elahe Yuruddo', startSurah: 41, startAyah: 47, page: 482 },
  { number: 26, nameArabic: 'حم', nameUrdu: 'حم', nameTranslit: 'Ha\'a Meem', startSurah: 46, startAyah: 1, page: 502 },
  { number: 27, nameArabic: 'قَالَ فَمَا خَطْبُكُمْ', nameUrdu: 'قال فما خطبکم', nameTranslit: 'Qala Fama Khatbukum', startSurah: 51, startAyah: 31, page: 522 },
  { number: 28, nameArabic: 'قَدْ سَمِعَ اللَّهُ', nameUrdu: 'قد سمع اللہ', nameTranslit: 'Qadd Sami Allah', startSurah: 58, startAyah: 1, page: 542 },
  { number: 29, nameArabic: 'تَبَارَكَ الَّذِي', nameUrdu: 'تبارک الذی', nameTranslit: 'Tabarakallazi', startSurah: 67, startAyah: 1, page: 562 },
  { number: 30, nameArabic: 'عَمَّ يَتَسَاءَلُونَ', nameUrdu: 'عم یتساءلون', nameTranslit: 'Amma Yatasa\'aloon', startSurah: 78, startAyah: 1, page: 582 }
];
