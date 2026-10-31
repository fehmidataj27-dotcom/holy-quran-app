import { Reciter } from '../types/quran';

/**
 * ALL SERVER URLS ARE VERIFIED WORKING (3-digit 001.mp3 pattern or custom mapping)
 * Reciters are prioritized so that FULL 114-SURAH reciters appear first!
 */
export const RECITERS_LIST: Reciter[] = [

  // ════════════════════════════════════════════════════════════════
  // 🕋 حرمین شریفین و ائمہ کبار (FULL 114 SURAHS) — اولویت اول
  // ════════════════════════════════════════════════════════════════
  {
    id: 'abdul_rahman_sudais',
    name: 'Sheikh Abdul Rahman Al-Sudais',
    arabicName: 'الشيخ عبد الرحمن السديس',
    style: 'حفص عن عاصم - مرتّل مكة النقي',
    category: 'Haramain',
    serverUrl: 'https://download.quranicaudio.com/qdc/abdurrahmaan_as_sudais/murattal/',
    qdcReciterId: 3,
    bitrate: '128 kbps',
    description: 'إمام وخطيب المسجد الحرام ورئيس الشؤون الدينية',
    hasFullQuran: true
  },
  {
    id: 'yasser_dossary',
    name: 'Sheikh Yasser Al-Dossari',
    arabicName: 'الشيخ ياسر الدوسري',
    style: 'حفص عن عاصم - ترتيل خاشع',
    category: 'Haramain',
    serverUrl: 'https://cdn.mp3quran.net/audio/yasser-dosari/r1/',
    qdcReciterId: 97,
    bitrate: '128 kbps',
    description: 'إمام الحرم المكي الشريف، تلاوة مؤثرة تأسر القلوب',
    hasFullQuran: true
  },
  {
    id: 'saud_shuraim',
    name: 'Sheikh Saud Al-Shuraim',
    arabicName: 'الشيخ سعود الشريم',
    style: 'حفص عن عاصم - مرتّل',
    category: 'Haramain',
    serverUrl: 'https://server7.mp3quran.net/shur/',
    qdcReciterId: 10,
    bitrate: '128 kbps',
    description: 'إمام المسجد الحرام السابق، صوت شجی وقراءة متقنة',
    hasFullQuran: true
  },
  {
    id: 'maher_almuaiqly',
    name: 'Sheikh Maher Al-Muaiqly',
    arabicName: 'الشيخ ماهر المعيقلي',
    style: 'حفص عن عاصم - مرتّل',
    category: 'Haramain',
    serverUrl: 'https://server12.mp3quran.net/maher/',
    bitrate: '128 kbps',
    description: 'إمام وخطيب المسجد الحرام بمكة المكرمة',
    hasFullQuran: true
  },
  {
    id: 'bandar_baleela',
    name: 'Sheikh Bandar Baleela',
    arabicName: 'الشيخ بندر بليلة',
    style: 'حفص عن عاصم - مرتّل',
    category: 'Haramain',
    serverUrl: 'https://server6.mp3quran.net/balilah/',
    bitrate: '128 kbps',
    description: 'إمام المسجد الحرام وعضو هيئة كبار العلماء',
    hasFullQuran: true
  },
  {
    id: 'ali_jaber',
    name: 'Sheikh Ali Abdullah Jaber',
    arabicName: 'الشيخ علي عبد الله جابر',
    style: 'حفص عن عاصم - مرتّل',
    category: 'Haramain',
    serverUrl: 'https://server11.mp3quran.net/a_jbr/',
    bitrate: '128 kbps',
    description: 'إمام المسجد الحرام الأسطوری ذو التلاوة النورانية',
    hasFullQuran: true
  },
  {
    id: 'ali_alhudhaify',
    name: 'Sheikh Ali Al-Hudhaify',
    arabicName: 'الشيخ علي بن عبد الرحمن الحذيفي',
    style: 'حفص عن عاصم - تدوير وتجويد محکم',
    category: 'Haramain',
    serverUrl: 'https://server9.mp3quran.net/hthfi/',
    bitrate: '128 kbps',
    description: 'إمام المسجد النبوی الشريف',
    hasFullQuran: true
  },
  {
    id: 'abdullah_aljuhany',
    name: 'Sheikh Abdullah Awad Al-Juhany',
    arabicName: 'الشيخ عبد الله عواد الجهني',
    style: 'حفص عن عاصم - مرتّل',
    category: 'Haramain',
    serverUrl: 'https://server13.mp3quran.net/jhn/',
    bitrate: '128 kbps',
    description: 'إمام المسجد الحرام، صوت ندِيّ وأسلوب فريد',
    hasFullQuran: true
  },
  {
    id: 'mohammed_ayyoub',
    name: 'Sheikh Mohammed Ayyub',
    arabicName: 'الشيخ محمد أيوب',
    style: 'حفص عن عاصم - الحجازي العريق',
    category: 'Haramain',
    serverUrl: 'https://server8.mp3quran.net/ayyub/',
    bitrate: '128 kbps',
    description: 'إمام المسجد النبوی الشريف، رائد النغم الحجازي الأصيل',
    hasFullQuran: true
  },

  // ════════════════════════════════════════════════════════════════
  // 🇵🇰 قراء پاکستان (FULL 114 SURAHS)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'qari_waheed_zafar_qasmi',
    name: 'Qari Waheed Zafar Qasmi',
    arabicName: 'قاری وحید ظفر قاسمی',
    style: 'تجوید و ترتیل لحنیہ عذبہ',
    category: 'Pakistan',
    serverUrl: 'https://archive.org/download/AlQuranWithUrduTranslation_Recitation_By_QariWaheedZafarQasmi_Translation_By_Mau/',
    bitrate: '128 kbps',
    description: 'تمغہ امتیاز یافتہ، پاکستان کی تاریخ کے سب سے پیارے اور دلکش لحن والے قاری (اردو ترجمہ کے ساتھ)',
    hasFullQuran: true
  },
  {
    id: 'qari_sadaqat_ali',
    name: 'Qari Syed Sadaqat Ali',
    arabicName: 'قاری سید صداقت علی',
    style: 'تجوید و لہجہ مصریہ و پاکستانی',
    category: 'Pakistan',
    serverUrl: 'https://download.quranicaudio.com/quran/sadaqat_ali/',
    bitrate: '128 kbps',
    description: 'پاکستان کے بین الاقوامی شہرت یافتہ قاری، پرائم ٹی وی اور پی ٹی وی کے معروف استاد القراء',
    hasFullQuran: true
  },
  {
    id: 'qari_shakir_qasmi',
    name: 'Qari Shakir Qasmi',
    arabicName: 'قاری شاکر قاسمی',
    style: 'تجوید محکم و صوت شجی',
    category: 'Pakistan',
    serverUrl: 'https://archive.org/download/quran-shakir-qasmi/',
    bitrate: '128 kbps',
    description: 'ریڈیو پاکستان اور بین الاقوامی محافل کے روح رواں اور پاکستان کے مایہ ناز قاری',
    hasFullQuran: true
  },

  // ════════════════════════════════════════════════════════════════
  // 🇸🇦 کبار قراء الجزيرة (FULL 114 SURAHS)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'mishary_alafasy',
    name: 'Sheikh Mishary Rashid Alafasy',
    arabicName: 'الشيخ مشاري راشد العفاسي',
    style: 'حفص عن عاصم - مرتّل ومتقن',
    category: 'Saudi',
    serverUrl: 'https://server8.mp3quran.net/afs/',
    qdcReciterId: 7,
    bitrate: '128 kbps',
    description: 'القارئ الكويتي الشهير عالمياً بحسن الصوت والإتقان',
    hasFullQuran: true
  },
  {
    id: 'nasser_alqatami',
    name: 'Sheikh Nasser Al-Qatami',
    arabicName: 'الشيخ ناصر القطامي',
    style: 'حفص عن عاصم - خاشع',
    category: 'Saudi',
    serverUrl: 'https://server6.mp3quran.net/qtm/',
    bitrate: '128 kbps',
    description: 'قارئ سعودي بارز، تلاوة خاشعة حزينة',
    hasFullQuran: true
  },
  {
    id: 'saad_alghamdi',
    name: 'Sheikh Saad Al-Ghamdi',
    arabicName: 'الشيخ سعد الغامدي',
    style: 'حفص عن عاصم - مرتّل',
    category: 'Saudi',
    serverUrl: 'https://server7.mp3quran.net/s_gmd/',
    bitrate: '128 kbps',
    description: 'من أشهر القراء في العالم الإسلامي بصوت هادئ ونقی',
    hasFullQuran: true
  },
  {
    id: 'idrees_abkar',
    name: 'Sheikh Idrees Abkar',
    arabicName: 'الشيخ إدریس أبكر',
    style: 'حفص عن عاصم - خاشع وباكٍ',
    category: 'Saudi',
    serverUrl: 'https://server6.mp3quran.net/abkr/',
    bitrate: '128 kbps',
    description: 'إمام جامع الشيخ زايد الكبير بأبوظبی',
    hasFullQuran: true
  },
  {
    id: 'khalid_aljalil',
    name: 'Sheikh Khalid Al-Jaleel',
    arabicName: 'الشيخ خالد الجليل',
    style: 'حفص عن عاصم - خاشع حزين',
    category: 'Saudi',
    serverUrl: 'https://server10.mp3quran.net/jleel/',
    bitrate: '128 kbps',
    description: 'إمام جامع الملك خالد بالرياض، تلاوات تهز المشاعر',
    hasFullQuran: true
  },

  // ════════════════════════════════════════════════════════════════
  // 🇪🇬 عمالقة مصر والعصر الذهبی (FULL 114 SURAHS)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'abdulbasit_mujawwad',
    name: 'Sheikh Abdul Basit Abdul Samad (Mujawwad)',
    arabicName: 'الشيخ عبد الباسط عبد الصمد (مجوّد)',
    style: 'حفص عن عاصم - تجويد ومقامات',
    category: 'Egypt',
    serverUrl: 'https://server13.mp3quran.net/basit_mjwd/',
    bitrate: '128 kbps',
    description: 'صوت مكة وكروان القراء، أعظم صوت تلاوة في القرن العشرين',
    hasFullQuran: true
  },
  {
    id: 'abdulbasit_murattal',
    name: 'Sheikh Abdul Basit Abdul Samad (Murattal)',
    arabicName: 'الشيخ عبد الباسط عبد الصمد (مرتّل)',
    style: 'حفص عن عاصم - المصحف المرتل',
    category: 'Egypt',
    serverUrl: 'https://server7.mp3quran.net/basit/',
    qdcReciterId: 2,
    bitrate: '128 kbps',
    description: 'المصحف المرتل الكامل برواية حفص عن عاصم',
    hasFullQuran: true
  },
  {
    id: 'mahmoud_khalil_alhusary',
    name: 'Sheikh Mahmoud Khalil Al-Husary',
    arabicName: 'الشيخ محمود خلیل الحصري',
    style: 'حفص عن عاصم - المرجع الأول في التجويد',
    category: 'Egypt',
    serverUrl: 'https://server13.mp3quran.net/husr/',
    qdcReciterId: 6,
    bitrate: '128 kbps',
    description: 'شیخ عموم المقارئ المصرية، أدق قراءة متقنة للقرآن',
    hasFullQuran: true
  },
  {
    id: 'mohammed_siddiq_minshawi',
    name: 'Sheikh Mohamed Siddiq Al-Minshawi',
    arabicName: 'الشيخ محمد صديق المنشاوي (مرتّل)',
    style: 'حفص عن عاصم - الصوت الباكي الخاشع',
    category: 'Egypt',
    serverUrl: 'https://server10.mp3quran.net/minsh/',
    qdcReciterId: 9,
    bitrate: '128 kbps',
    description: 'الصوت الباكي، صاحب النبرة الحزينة الصادقة',
    hasFullQuran: true
  },
  {
    id: 'mustafa_ismail',
    name: 'Sheikh Mustafa Ismail',
    arabicName: 'الشيخ مصطفى إسماعيل',
    style: 'حفص عن عاصم - إمام المقامات والتصوير القرآنی',
    category: 'Egypt',
    serverUrl: 'https://cdn.mp3quran.net/audio/mustafa-ismail/r1/',
    bitrate: '128 kbps',
    description: 'قارئ الملوك والرؤساء، رائد تصوير المعانی بالصوت',
    hasFullQuran: true
  },
  {
    id: 'hasan_saleh',
    name: 'Sheikh Hasan Saleh',
    arabicName: 'الشيخ حسن صالح',
    style: 'حفص عن عاصم - صوت شجي يريح القلوب',
    category: 'Egypt',
    serverUrl: 'https://cdn.mp3quran.net/audio/hassan-saleh/r1/',
    bitrate: '128 kbps',
    description: 'صاحب الصوت الشجي الخاشع، من أشهر وأعذب أصوات مصر والعالم الإسلامي',
    hasFullQuran: true
  },
    {
      id: 'alaa_aql',
      name: 'Qari Alaa Aql',
      arabicName: 'القارئ علاء عقل',
      style: 'حفص عن عاصم - تلاوة هادئة خاشعة تأسر القلوب',
      category: 'Contemporary',
      serverUrl: 'https://archive.org/download/AlaaAql/',
      bitrate: '128 kbps',
      description: 'القارئ علاء عقل، صاحب الصوت الهادئ والتلاوات الخاشعة المؤثرة (المصحف كاملاً 114 سورة)',
      hasFullQuran: true
    },

  // ════════════════════════════════════════════════════════════════
  // 🌍 عالمی قراء (FULL 114 SURAHS)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'al_zain_mohamed',
    name: 'Sheikh Al-Zain Mohamed Ahmad',
    arabicName: 'الشيخ الزين محمد أحمد',
    style: 'حفص عن عاصم - النبرة السودانية الشجية',
    category: 'Global',
    serverUrl: 'https://server9.mp3quran.net/alzain/',
    bitrate: '128 kbps',
    description: 'القارئ السوداني الأشهر، تلاوة روحانية تأخذ بمجامع القلوب',
    hasFullQuran: true
  },
  {
    id: 'wadih_al_yamani',
    name: 'Sheikh Wadih Al-Yamani',
    arabicName: 'الشيخ وديع اليمني',
    style: 'حفص عن عاصم - عذب وندِيّ',
    category: 'Global',
    serverUrl: 'https://cdn.mp3quran.net/audio/wadee-yamani/r1/',
    bitrate: '128 kbps',
    description: 'صوت ملائکی عذب وإتقان رفيع',
    hasFullQuran: true
  },

  // ════════════════════════════════════════════════════════════════
  // ⭐ وائرل اور منتخب قراء (مخصوص ریکارڈ شدہ سورتیں)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'omar_bin_ziauddin',
    name: 'Qari Omar Bin Ziauddin',
    arabicName: 'القارئ عمر بن ضياء الدين',
    style: 'تلاوة هادئة خاشعة بدون مؤثرات تريح الأعصاب',
    category: 'Egypt',
    serverUrl: 'SPECIAL_ONLY',
    bitrate: '128 kbps',
    description: 'قارئ مصري صاحب تلاوة هادئة سكينة بدون مؤثرات — 30 سورتیں دستیاب ہیں',
    hasFullQuran: false,
    availableSurahs: [2, 8, 12, 14, 18, 19, 20, 25, 29, 31, 32, 33, 34, 35, 36, 37, 38, 41, 44, 46, 47, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 66, 67, 68, 69, 70, 71, 73, 78]
  },
  {
    id: 'qari_umair_shamim',
    name: 'Qari Sheikh Umair Shamim',
    arabicName: 'القارئ الشيخ عمير شميم',
    style: 'تلاوة حجازية شجية تأسر القلوب',
    category: 'Global',
    serverUrl: 'https://ia800404.us.archive.org/11/items/amir-shamim/',
    bitrate: '128 kbps',
    description: 'صاحب النغمة الحجازية النادرة — سور ۱ تا ۴۸ دستیاب ہیں',
    hasFullQuran: false,
    availableSurahs: Array.from({ length: 48 }, (_, i) => i + 1)
  },
  {
    id: 'abdul_rahman_mossad',
    name: 'Qari Abdul Rahman Mossad',
    arabicName: 'القارئ عبد الرحمن مسعد',
    style: 'تلاوة هادئة خاشعة تريح القلوب',
    category: 'Global',
    serverUrl: 'SPECIAL_ONLY',
    bitrate: '128 kbps',
    description: 'صاحب الصوت الملائكي الخاشع — صرف مخصوص ریکارڈ شدہ سورتیں دستیاب ہیں',
    hasFullQuran: false,
    availableSurahs: [1, 2, 10, 25, 27, 32, 49, 67, 73, 78, 87, 88, 100, 107]
  },
  {
    id: 'ridjal_ahmad',
    name: 'Ridjaal Ahmed',
    arabicName: 'ريجال أحمد',
    style: 'تلاوة روحانية هادئة للنوم والتأمل',
    category: 'Global',
    serverUrl: 'SPECIAL_ONLY',
    bitrate: '128 kbps',
    description: 'القارئ الإندونيسي الفيروسي، صوت ملائكي هادئ',
    hasFullQuran: false,
    availableSurahs: []
  }
];
