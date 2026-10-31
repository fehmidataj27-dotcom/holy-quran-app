import { TajweedRule } from '../types/quran';

/**
 * دقیق کلر کوڈنگ برائے 16 سطری / روایتی پاکستانی و برصغیر مصحف تجوید
 * 1. سبز (Green #10b981): حروف مستعلیہ / پر پڑھے جانے والے حروف (خص ضغط قظ) + راء پر
 * 2. سرخ (Red #ef4444): غنہ مشدد (نّ، مّ) + ادغام مع الغنہ
 * 3. گلابی (Magenta/Pink #ec4899): اخفاء / اقلاب (باریک غنہ)
 * 4. نیلا (Cyan/Blue #0ea5e9): قلقلہ (قطب جد) + ساکن جھٹکا
 * 5. گہرا سرخ / جامنی (Crimson/Madd #dc2626): مد لازم، متصل، منفصل (کھینچنے والے حروف)
 */
export const TAJWEED_RULES: TajweedRule[] = [
  {
    class: 'tafkheem',
    title: 'Tafkheem (پر پڑھے جانے والے حروف)',
    titleUrdu: 'حروف مستعلیہ (سبز رنگ - Green)',
    color: '#10b981', // سبز
    description: 'خ، ص، ض، ط، ظ، غ، ق اور زبر/پیش والی راء کو پُر (موٹا) پڑھنا۔'
  },
  {
    class: 'ghunnah',
    title: 'Ghunnah Musaddad (غنہ مشدد)',
    titleUrdu: 'غنہ مشدد (سرخ رنگ - Red)',
    color: '#ef4444', // سرخ
    description: 'نون مشدد (نّ) اور میم مشدد (مّ) پر واضح 2 حرکات کا غنہ۔'
  },
  {
    class: 'ikhfa',
    title: 'Ikhfa & Iqlab (باریک غنہ و اخفاء)',
    titleUrdu: 'اخفاء و اقلاب (گلابی رنگ - Pink)',
    color: '#ec4899', // گلابی
    description: 'نون ساکن و تنوین کا اخفاء اور اقلاب (میم میں بدلنا) ناک میں باریک آواز۔'
  },
  {
    class: 'qalqalah',
    title: 'Qalqalah (قلقلہ)',
    titleUrdu: 'قلقلہ (آسمانی نیلا - Cyan/Blue)',
    color: '#0ea5e9', // نیلا
    description: 'ق، ط، ب، ج، د ساکن پر گونج اور جھٹکے کی آواز۔'
  },
  {
    class: 'madd',
    title: 'Madd (مد - طویل کھینچنا)',
    titleUrdu: 'مدود (طویل کھینچنا)',
    color: '#dc2626', // گہرا سرخ
    description: 'مد متصل، مد منفصل اور مد لازم پر 3 تا 5 الف کھینچ کر پڑھنا۔'
  }
];

// مخلتف اعراب کی رینج
const DIACRITICS = '[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED]';

export function formatTajweed(text: string): string {
  if (!text) return '';

  let html = text;

  // 1. مد (Madd): علامتِ مد (ۤ یا ~) والے تمام حروف -> گہرا سرخ / پروقار مد
  html = html.replace(
    /([^\s<]{1,4}[ۤ~][^\s>]{0,3})/g,
    '<span class="tajweed-madd" title="مد">$1</span>'
  );

  // 2. غنہ مشدد (Ghunnah): نّ اور مّ (شد والے) -> RED سرخ رنگ
  html = html.replace(
    /([نم]ّ[ًٌٍَُِۢۡۜ۟۠]*)/g,
    '<span class="tajweed-ghunnah" title="غنہ مشدد">$1</span>'
  );

  // 3. ادغام مع الغنہ اور اخفاء و اقلاب (Pink گلابی رنگ):
  // ن یا تنوین کے بعد حروف اخفاء / اقلاب یا ادغام بغنہ
  html = html.replace(
    /([نۨ][ۢۡ]?|[ًٌٍ])(\s*)([تثجدذزسشصضطظفقك]|مّ|یّ|وّ)/g,
    '<span class="tajweed-ikhfa" title="اخفاء / ادغام">$1$2$3</span>'
  );

  // چھوٹا میم اقلاب (ۢ)
  html = html.replace(
    /([^\s<]{1,3}ۢ)/g,
    '<span class="tajweed-ikhfa" title="اقلاب">$1</span>'
  );

  // 4. قلقلہ (Qalqalah - Cyan/Blue نیلا رنگ): ق، ط، ب، ج، د جب ساکن ہوں (جزم یا بغیر حرکت وقف)
  html = html.replace(
    /([قطبجد][ْۡ])/g,
    '<span class="tajweed-qalqalah" title="قلقلہ">$1</span>'
  );

  // 5. حروفِ پر (Tafkheem - Green سبز رنگ):
  // حروف مستعلیہ: خ، ص، ض، ط، ظ، غ، ق
  html = html.replace(
    /([خصضطظغق][ًٌَُٰۡ]?)/g,
    (match) => {
      // اگر پہلے ہی کسی اسپین میں لپٹا ہوا ہے تو دوبارہ نہ لپٹیں
      if (match.includes('<span') || match.includes('</span>')) return match;
      return `<span class="tajweed-tafkheem" title="حرفِ پر (مستعلیہ)">${match}</span>`;
    }
  );

  // راء پر (زبر یا پیش والی راء) -> سبز
  html = html.replace(
    /(ر[ًٌَُٰ])/g,
    '<span class="tajweed-tafkheem" title="راء پر">$1</span>'
  );

  // لفظ اللہ کا لام پر (اگر ماقبل زبر یا پیش ہو)
  html = html.replace(
    /(ٱللَّهِ|ٱللَّهُ|ٱللَّهَ)/g,
    '<span class="tajweed-tafkheem" title="اسم جلالت پر">$1</span>'
  );

  return html;
}
