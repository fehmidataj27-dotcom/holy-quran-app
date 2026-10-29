import { Reciter } from '../types/quran';

/**
 * ALL SERVER URLS ARE VERIFIED WORKING (3-digit 001.mp3 pattern)
 * SPECIAL_ONLY = reciter has partial collection — only listed surahs in reciterAudioHelper.ts
 */
export const RECITERS_LIST: Reciter[] = [

  // ════════════════════════════════════════════════════════════════
  // ⭐ VIRAL & MOST REQUESTED (نوجوانوں کے پسندیدہ ترین وائرل قراء)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'ridjal_ahmad',
    name: 'Ridjaal Ahmed',
    arabicName: 'ريجال أحمد',
    style: 'تلاوة روحانية هادئة للنوم والتأمل',
    category: 'Global',
    serverUrl: 'SPECIAL_ONLY',
    bitrate: '128 kbps',
    description: 'القارئ الإندونيسي الفيروسي الأشهر عالمياً، صوت ملائكي هادئ — سور مختارة متاحة'
  },
  {
    id: 'qari_umair_shamim',
    name: 'Qari Sheikh Umair Shamim',
    arabicName: 'القارئ الشيخ عمير شميم',
    style: 'تلاوة حجازية شجية تأسر القلوب',
    category: 'Global',
    // archive.org item has surahs 001–048 named 001.mp3 … 048.mp3
    serverUrl: 'https://ia800404.us.archive.org/11/items/amir-shamim/',
    bitrate: '128 kbps',
    description: 'صاحب النغمة الحجازية النادرة — سور ۱ تا ۴۸ دستیاب ہیں'
  },
  {
    id: 'abdul_rahman_mossad',
    name: 'Qari Abdul Rahman Mossad',
    arabicName: 'القارئ عبد الرحمن مسعد',
    style: 'تلاوة هادئة خاشعة تريح القلوب',
    category: 'Global',
    serverUrl: 'SPECIAL_ONLY',
    bitrate: '128 kbps',
    description: 'صاحب الصوت الملائكي الخاشع — صرف مخصوص ریکارڈ شدہ سورتیں (فاتحہ، بقرہ، یونس، فرقان، نمل، سجدہ، حجرات، ملک، مزمل، نبأ، اعلیٰ، غاشیہ، عادیات، ماعون) دستیاب ہیں'
  },

  // ════════════════════════════════════════════════════════════════
  // 🇵🇰 PAKISTANI RENOWNED QURRA (پاکستان کے مایہ ناز قراء کرام)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'qari_waheed_zafar_qasmi',
    name: 'Qari Waheed Zafar Qasmi',
    arabicName: 'قاری وحید ظفر قاسمی',
    style: 'تجوید و ترتیل لحنیہ عذبہ',
    category: 'Pakistan',
    // verified: https://download.quranicaudio.com/quran/waheed_zafar_qasmi_wbw/001.mp3
    serverUrl: 'https://download.quranicaudio.com/quran/waheed_zafar_qasmi_wbw/',
    bitrate: '128 kbps',
    description: 'تمغہ امتیاز یافتہ، پاکستان کی تاریخ کے سب سے پیارے اور دلکش لحن والے قاری'
  },
  {
    id: 'qari_sadaqat_ali',
    name: 'Qari Syed Sadaqat Ali',
    arabicName: 'قاری سید صداقت علی',
    style: 'تجوید و لہجہ مصریہ و پاکستانی',
    category: 'Pakistan',
    // verified: https://download.quranicaudio.com/quran/sadaqat_ali/001.mp3
    serverUrl: 'https://download.quranicaudio.com/quran/sadaqat_ali/',
    bitrate: '128 kbps',
    description: 'پاکستان کے بین الاقوامی شہرت یافتہ قاری، پرائم ٹی وی اور پی ٹی وی کے معروف استاد القراء'
  },
  {
    id: 'qari_shakir_qasmi',
    name: 'Qari Shakir Qasmi',
    arabicName: 'قاری شاکر قاسمی',
    style: 'تجوید محکم و صوت شجی',
    category: 'Pakistan',
    // verified: https://download.quranicaudio.com/quran/shakir_qasmi/001.mp3
    serverUrl: 'https://download.quranicaudio.com/quran/shakir_qasmi/',
    bitrate: '128 kbps',
    description: 'ریڈیو پاکستان اور بین الاقوامی محافل کے روح رواں اور پاکستان کے مایہ ناز قاری'
  },

  // ════════════════════════════════════════════════════════════════
  // 🕋 HARAMAIN IMAMS (حرمین شریفین کے ائمہ کرام) — FULL 114 SURAHS
  // ════════════════════════════════════════════════════════════════
  {
    id: 'yasser_dossary',
    name: 'Sheikh Yasser Al-Dossari',
    arabicName: 'الشيخ ياسر الدوسري',
    style: 'حفص عن عاصم - ترتيل خاشع',
    category: 'Haramain',
    serverUrl: 'https://cdn.mp3quran.net/audio/yasser-dosari/r1/',
    qdcReciterId: 97,
    bitrate: '128 kbps',
    description: 'إمام الحرم المكي الشريف، تلاوة مؤثرة تأسر القلوب'
  },
  {
    id: 'abdul_rahman_sudais',
    name: 'Sheikh Abdul Rahman Al-Sudais',
    arabicName: 'الشيخ عبد الرحمن السديس',
    style: 'حفص عن عاصم - مرتّل مكة النقي',
    category: 'Haramain',
    serverUrl: 'https://download.quranicaudio.com/quran/abdurrahmaan_as_sudais/',
    qdcReciterId: 3,
    bitrate: '128 kbps',
    description: 'إمام وخطيب المسجد الحرام ورئيس الشؤون الدينية — المصحف المرتل الكامل بصوته الأصلي'
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
    description: 'إمام المسجد الحرام السابق، صوت شجی وقراءة متقنة'
  },
  {
    id: 'maher_almuaiqly',
    name: 'Sheikh Maher Al-Muaiqly',
    arabicName: 'الشيخ ماهر المعيقلي',
    style: 'حفص عن عاصم - مرتّل',
    category: 'Haramain',
    // verified: https://server12.mp3quran.net/maher/001.mp3
    serverUrl: 'https://server12.mp3quran.net/maher/',
    bitrate: '128 kbps',
    description: 'إمام وخطيب المسجد الحرام بمكة المكرمة'
  },
  {
    id: 'bandar_baleela',
    name: 'Sheikh Bandar Baleela',
    arabicName: 'الشيخ بندر بليلة',
    style: 'حفص عن عاصم - مرتّل',
    category: 'Haramain',
    // verified: https://server6.mp3quran.net/balilah/001.mp3
    serverUrl: 'https://server6.mp3quran.net/balilah/',
    bitrate: '128 kbps',
    description: 'إمام المسجد الحرام وعضو هيئة كبار العلماء'
  },
  {
    id: 'ali_jaber',
    name: 'Sheikh Ali Abdullah Jaber',
    arabicName: 'الشيخ علي عبد الله جابر',
    style: 'حفص عن عاصم - مرتّل',
    category: 'Haramain',
    // verified: https://server11.mp3quran.net/a_jbr/001.mp3
    serverUrl: 'https://server11.mp3quran.net/a_jbr/',
    bitrate: '128 kbps',
    description: 'إمام المسجد الحرام الأسطوری ذو التلاوة النورانية'
  },
  {
    id: 'ali_alhudhaify',
    name: 'Sheikh Ali Al-Hudhaify',
    arabicName: 'الشيخ علي بن عبد الرحمن الحذيفي',
    style: 'حفص عن عاصم - تدوير وتجويد محکم',
    category: 'Haramain',
    // verified: https://server9.mp3quran.net/hthfi/001.mp3
    serverUrl: 'https://server9.mp3quran.net/hthfi/',
    bitrate: '128 kbps',
    description: 'إمام المسجد النبوی الشريف'
  },
  {
    id: 'abdullah_aljuhany',
    name: 'Sheikh Abdullah Awad Al-Juhany',
    arabicName: 'الشيخ عبد الله عواد الجهني',
    style: 'حفص عن عاصم - مرتّل',
    category: 'Haramain',
    // verified: https://server13.mp3quran.net/jhn/001.mp3
    serverUrl: 'https://server13.mp3quran.net/jhn/',
    bitrate: '128 kbps',
    description: 'إمام المسجد الحرام، صوت ندِيّ وأسلوب فريد'
  },
  {
    id: 'mohammed_ayyoub',
    name: 'Sheikh Mohammed Ayyub',
    arabicName: 'الشيخ محمد أيوب',
    style: 'حفص عن عاصم - الحجازي العريق',
    category: 'Haramain',
    // verified: https://server8.mp3quran.net/ayyub/001.mp3
    serverUrl: 'https://server8.mp3quran.net/ayyub/',
    bitrate: '128 kbps',
    description: 'إمام المسجد النبوی الشريف، رائد النغم الحجازي الأصيل'
  },

  // ════════════════════════════════════════════════════════════════
  // 🇸🇦 SAUDI & GULF MASTERS (کبار قراء الجزيرة) — FULL 114 SURAHS
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
    description: 'القارئ الكويتي الشهير عالمياً بحسن الصوت والإتقان'
  },
  {
    id: 'nasser_alqatami',
    name: 'Sheikh Nasser Al-Qatami',
    arabicName: 'الشيخ ناصر القطامي',
    style: 'حفص عن عاصم - خاشع',
    category: 'Saudi',
    // verified: https://server6.mp3quran.net/qtm/001.mp3
    serverUrl: 'https://server6.mp3quran.net/qtm/',
    bitrate: '128 kbps',
    description: 'قارئ سعودي بارز، تلاوة خاشعة حزينة'
  },
  {
    id: 'saad_alghamdi',
    name: 'Sheikh Saad Al-Ghamdi',
    arabicName: 'الشيخ سعد الغامدي',
    style: 'حفص عن عاصم - مرتّل',
    category: 'Saudi',
    // verified: https://server7.mp3quran.net/s_gmd/001.mp3
    serverUrl: 'https://server7.mp3quran.net/s_gmd/',
    bitrate: '128 kbps',
    description: 'من أشهر القراء في العالم الإسلامي بصوت هادئ ونقی'
  },
  {
    id: 'idrees_abkar',
    name: 'Sheikh Idrees Abkar',
    arabicName: 'الشيخ إدریس أبكر',
    style: 'حفص عن عاصم - خاشع وباكٍ',
    category: 'Saudi',
    // verified: https://server6.mp3quran.net/abkr/001.mp3
    serverUrl: 'https://server6.mp3quran.net/abkr/',
    bitrate: '128 kbps',
    description: 'إمام جامع الشيخ زايد الكبير بأبوظبی'
  },
  {
    id: 'khalid_aljalil',
    name: 'Sheikh Khalid Al-Jaleel',
    arabicName: 'الشيخ خالد الجليل',
    style: 'حفص عن عاصم - خاشع حزين',
    category: 'Saudi',
    // verified: https://server10.mp3quran.net/jleel/001.mp3
    serverUrl: 'https://server10.mp3quran.net/jleel/',
    bitrate: '128 kbps',
    description: 'إمام جامع الملك خالد بالرياض، تلاوات تهز المشاعر'
  },

  // ════════════════════════════════════════════════════════════════
  // 🇪🇬 EGYPTIAN GOLDEN ERA (عمالقة مصر والعصر الذهبی)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'abdulbasit_mujawwad',
    name: 'Sheikh Abdul Basit Abdul Samad (Mujawwad)',
    arabicName: 'الشيخ عبد الباسط عبد الصمد (مجوّد)',
    style: 'حفص عن عاصم - تجويد ومقامات',
    category: 'Egypt',
    // verified: https://server13.mp3quran.net/basit_mjwd/001.mp3
    serverUrl: 'https://server13.mp3quran.net/basit_mjwd/',
    bitrate: '128 kbps',
    description: 'صوت مكة وكروان القراء، أعظم صوت تلاوة في القرن العشرين'
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
    description: 'المصحف المرتل الكامل برواية حفص عن عاصم'
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
    description: 'شیخ عموم المقارئ المصرية، أدق قراءة متقنة للقرآن'
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
    description: 'الصوت الباكي، صاحب النبرة الحزينة الصادقة'
  },
  {
    id: 'mustafa_ismail',
    name: 'Sheikh Mustafa Ismail',
    arabicName: 'الشيخ مصطفى إسماعيل',
    style: 'حفص عن عاصم - إمام المقامات والتصوير القرآنی',
    category: 'Egypt',
    // verified: https://server8.mp3quran.net/mustfa/001.mp3
    serverUrl: 'https://server8.mp3quran.net/mustfa/',
    bitrate: '128 kbps',
    description: 'قارئ الملوك والرؤساء، رائد تصوير المعانی بالصوت'
  },

  // ════════════════════════════════════════════════════════════════
  // 🌍 GLOBAL (عالمی قراء)
  // ════════════════════════════════════════════════════════════════
  {
    id: 'al_zain_mohamed',
    name: 'Sheikh Al-Zain Mohamed Ahmad',
    arabicName: 'الشيخ الزين محمد أحمد',
    style: 'حفص عن عاصم - النبرة السودانية الشجية',
    category: 'Global',
    // verified: https://server9.mp3quran.net/alzain/001.mp3
    serverUrl: 'https://server9.mp3quran.net/alzain/',
    bitrate: '128 kbps',
    description: 'القارئ السوداني الأشهر، تلاوة روحانية تأخذ بمجامع القلوب'
  },
  {
    id: 'wadih_al_yamani',
    name: 'Sheikh Wadih Al-Yamani',
    arabicName: 'الشيخ وديع اليمني',
    style: 'حفص عن عاصم - عذب وندِيّ',
    category: 'Global',
    // verified: https://server6.mp3quran.net/wdh/001.mp3
    serverUrl: 'https://server6.mp3quran.net/wdh/',
    bitrate: '128 kbps',
    description: 'صوت ملائکی عذب وإتقان رفيع'
  }
];
