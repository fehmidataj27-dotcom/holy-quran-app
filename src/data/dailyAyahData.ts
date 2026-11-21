export interface DailyAyah {
  id: number;
  arabic: string;
  translationUrdu: string;
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
  juzNumber: number;
  theme: string; // e.g. "مشکل میں تسلی", "رحمت و مغفرت", "صبر اور دعا", "امید", "تسکینِ قلب"
  badge: string;
}

export const DAILY_AYAHS: DailyAyah[] = [
  {
    id: 1,
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا • إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translationUrdu: "پس یقیناً تنگی کے ساتھ آسانی ہے۔ بے شک تنگی کے ساتھ آسانی ہے۔",
    surahName: "سورة الشرح",
    surahNumber: 94,
    ayahNumber: 5,
    juzNumber: 30,
    theme: "مشکل میں تسلی و امید",
    badge: "تسکینِ قلب 🌸"
  },
  {
    id: 2,
    arabic: "لَا تُكَلِّفُ نَفْسًا إِلَّا وُسْعَهَا",
    translationUrdu: "اللہ کسی جان پر اس کی طاقت سے زیادہ بوجھ نہیں ڈالتا۔",
    surahName: "سورة البقرة",
    surahNumber: 2,
    ayahNumber: 286,
    juzNumber: 3,
    theme: "تسکین و حوصلہ",
    badge: "حوصلہ و راحت 🌿"
  },
  {
    id: 3,
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    translationUrdu: "اور جب میرے بندے آپ سے میرے بارے میں پوچھیں تو کہہ دیجیے کہ میں بہت قریب ہوں، پکارنے والے کی دعا قبول کرتا ہوں جب وہ مجھے پکارے۔",
    surahName: "سورة البقرة",
    surahNumber: 2,
    ayahNumber: 186,
    juzNumber: 2,
    theme: "دعا اور قربِ الٰہی",
    badge: "قبولیتِ دعا 🤲"
  },
  {
    id: 4,
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translationUrdu: "سن لو! اللہ کے ذکر سے ہی دلوں کو اطمینان نصیب ہوتا ہے۔",
    surahName: "سورة الرعد",
    surahNumber: 13,
    ayahNumber: 28,
    juzNumber: 13,
    theme: "ذکر و سکونِ قلب",
    badge: "اطمینانِ قلب 🤍"
  },
  {
    id: 5,
    arabic: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    translationUrdu: "اور جو اللہ پر بھروسہ کرتا ہے تو وہ اس کے لیے کافی ہو جاتا ہے۔",
    surahName: "سورة الطلاق",
    surahNumber: 65,
    ayahNumber: 3,
    juzNumber: 28,
    theme: "توکل اور کفالت",
    badge: "توکل علی اللہ 🛡️"
  },
  {
    id: 6,
    arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    translationUrdu: "فرما دیجیے: اے میرے وہ بندو جنہوں نے اپنی جانوں پر زیادتی کی! اللہ کی رحمت سے مایوس نہ ہو، یقیناً اللہ سارے گناہ معاف فرما دیتا ہے۔",
    surahName: "سورة الزمر",
    surahNumber: 39,
    ayahNumber: 53,
    juzNumber: 24,
    theme: "رحمت و مغفرت",
    badge: "رحمتِ الٰہی 🕊️"
  },
  {
    id: 7,
    arabic: "وَاصْبِرْ لِحُكْمِ رَبِّكَ فَإِنَّكَ بِأَعْيُنِنَا",
    translationUrdu: "اور آپ اپنے رب کے حکم پر صبر کیجیے، کیونکہ یقیناً آپ ہماری آنکھوں کے سامنے (ہماری حفاظت میں) ہیں۔",
    surahName: "سورة الطور",
    surahNumber: 52,
    ayahNumber: 48,
    juzNumber: 27,
    theme: "حفاظت و محبتِ الٰہی",
    badge: "حفاظتِ الٰہی ✨"
  },
  {
    id: 8,
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً",
    translationUrdu: "اے ہمارے رب! ہمارے دلوں کو ہدایت دینے کے بعد ٹیڑھا نہ کر اور ہمیں اپنی خاص رحمت سے نواز۔",
    surahName: "سورة آل عمران",
    surahNumber: 3,
    ayahNumber: 8,
    juzNumber: 3,
    theme: "ہدایت و ثابت قدمی",
    badge: "مسنون دعا 🤲"
  },
  {
    id: 9,
    arabic: "وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ وَسَبِّحْ بِحَمْدِهِ",
    translationUrdu: "اور اس ہمیشہ زندہ رہنے والی ذات پر بھروسہ رکھو جسے کبھی موت نہیں آنی اور اس کی حمد کے ساتھ تسبیح کرو۔",
    surahName: "سورة الفرقان",
    surahNumber: 25,
    ayahNumber: 58,
    juzNumber: 19,
    theme: "توکل و تسبیح",
    badge: "ذکر و توکل 💫"
  },
  {
    id: 10,
    arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
    translationUrdu: "اور تمہارے رب نے فرمایا: تم مجھ سے دعا کرو، میں تمہاری دعا قبول کروں گا۔",
    surahName: "سورة غافر",
    surahNumber: 40,
    ayahNumber: 60,
    juzNumber: 24,
    theme: "قبولیتِ دعا",
    badge: "فرمانِ الٰہی 🌟"
  },
  {
    id: 11,
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translationUrdu: "بے شک اللہ صبر کرنے والوں کے ساتھ ہے۔",
    surahName: "سورة البقرة",
    surahNumber: 2,
    ayahNumber: 153,
    juzNumber: 2,
    theme: "صبر و ساتھِ الٰہی",
    badge: "صبر کا انعام 💎"
  },
  {
    id: 12,
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    translationUrdu: "ہمیں اللہ کافی ہے اور وہ بہترین کارساز ہے۔",
    surahName: "سورة آل عمران",
    surahNumber: 3,
    ayahNumber: 173,
    juzNumber: 4,
    theme: "کفایتِ الٰہی",
    badge: "بہترین کارساز 🛡️"
  },
  {
    id: 13,
    arabic: "وَإِن يَمْسَسْكَ اللَّهُ بِضُرٍّ فَلَا كَاشِفَ لَهُ إِلَّا هُوَ",
    translationUrdu: "اور اگر اللہ تجھے کوئی تکلیف پہنچائے تو اس کے سوا کوئی اسے دور کرنے والا نہیں ہے۔",
    surahName: "سورة الأنعام",
    surahNumber: 6,
    ayahNumber: 17,
    juzNumber: 7,
    theme: "مشکل کشائی",
    badge: "امید و شفا 🩹"
  },
  {
    id: 14,
    arabic: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ ۚ وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ",
    translationUrdu: "اور وہ تمہارے ساتھ ہے جہاں کہیں بھی تم ہو، اور اللہ تمہارے تمام اعمال کو خوب دیکھ رہا ہے۔",
    surahName: "سورة الحديد",
    surahNumber: 57,
    ayahNumber: 4,
    juzNumber: 27,
    theme: "معیتِ الٰہی",
    badge: "قربِ خاص 💫"
  },
  {
    id: 15,
    arabic: "لَا تَدْرِي لَعَلَّ اللَّهَ يُحْدِثُ بَعْدَ ذَٰلِكَ أَمْرًا",
    translationUrdu: "تم نہیں جانتے شاید اللہ اس کے بعد کوئی نیا راستہ اور بہتری پیدا فرما دے۔",
    surahName: "سورة الطلاق",
    surahNumber: 65,
    ayahNumber: 1,
    juzNumber: 28,
    theme: "امید اور نیا راستہ",
    badge: "امیدِ سحر 🌅"
  }
];

/**
 * Returns today's Ayah deterministically based on date (day of the year)
 */
export function getDailyAyah(): DailyAyah {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = Math.abs(dayOfYear) % DAILY_AYAHS.length;
  return DAILY_AYAHS[index];
}
