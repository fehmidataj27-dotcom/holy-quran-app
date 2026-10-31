import { TajweedRule } from '../types/quran';

/**
 * دقیق کلر کوڈنگ برائے 16 سطری / روایتی پاکستانی و برصغیر مصحف تجوید
 * 1. سبز (Green #10b981): حروف مستعلیہ / پر پڑھے جانے والے حروف (خص ضغط قظ) + راء پر
 * 2. سرخ (Red #ef4444): غنہ مشدد (نّ، مّ)
 * 3. گلابی (Pink #ec4899): اخفاء، ادغام، اقلاب
 * 4. نیلا (Cyan/Blue #0ea5e9): قلقلہ (قطب جد ساکن)
 * 5. گہرا سرخ (Crimson #dc2626): مدود (طویل کھینچنا)
 */
export const TAJWEED_RULES: TajweedRule[] = [
  {
    class: 'tafkheem',
    title: 'Tafkheem',
    titleUrdu: 'حروف مستعلیہ (سبز رنگ - Green)',
    color: '#10b981',
    description: 'خ، ص، ض، ط، ظ، غ، ق اور زبر/پیش والی راء کو پُر (موٹا) پڑھنا۔'
  },
  {
    class: 'ghunnah',
    title: 'Ghunnah Musaddad',
    titleUrdu: 'غنہ مشدد (سرخ رنگ - Red)',
    color: '#ef4444',
    description: 'نون مشدد (نّ) اور میم مشدد (مّ) پر واضح 2 حرکات کا غنہ۔'
  },
  {
    class: 'ikhfa',
    title: 'Ikhfa & Idgham',
    titleUrdu: 'اخفاء و ادغام (گلابی رنگ - Pink)',
    color: '#ec4899',
    description: 'نون ساکن و تنوین کا اخفاء اور ادغام، ناک میں باریک آواز۔'
  },
  {
    class: 'qalqalah',
    title: 'Qalqalah',
    titleUrdu: 'قلقلہ (آسمانی نیلا - Cyan/Blue)',
    color: '#0ea5e9',
    description: 'ق، ط، ب، ج، د ساکن پر گونج اور جھٹکے کی آواز۔'
  },
  {
    class: 'madd',
    title: 'Madd',
    titleUrdu: 'مدود (طویل کھینچنا)',
    color: '#dc2626',
    description: 'مد متصل، مد منفصل اور مد لازم پر 3 تا 5 الف کھینچ کر پڑھنا۔'
  }
];

export function formatTajweed(text: string): string {
  if (!text) return '';

  let html = text;

  // 1. مد (Madd): علامتِ مد (ۤ یا ~) والے تمام حروف -> گہرا سرخ (Crimson)
  html = html.replace(
    /([^\s<]{1,4}[ۤ~][^\s>]{0,3})/g,
    '<span class="tajweed-madd">$1</span>'
  );

  // 2. غنہ مشدد (Ghunnah): نّ اور مّ (شد والے) -> سرخ رنگ (Red)
  html = html.replace(
    /([نم]ّ[ًٌٍَُِۢۡۜ۟۠]*)/g,
    '<span class="tajweed-ghunnah">$1</span>'
  );

  // 3. ادغام و اخفاء و اقلاب -> گلابی رنگ (Pink)
  html = html.replace(
    /([نۨ][ۢۡ]?|[ًٌٍ])(\s*)([تثجدذزسشصضطظفقك]|مّ|یّ|وّ)/g,
    '<span class="tajweed-ikhfa">$1$2$3</span>'
  );

  // چھوٹا میم اقلاب (ۢ)
  html = html.replace(
    /([^\s<]{1,3}ۢ)/g,
    '<span class="tajweed-ikhfa">$1</span>'
  );

  // 4. قلقلہ (Qalqalah - Cyan/Blue): ق، ط، ب، ج، د جب ساکن ہوں
  html = html.replace(
    /([قطبجد][ْۡ])/g,
    '<span class="tajweed-qalqalah">$1</span>'
  );

  // 5. حروفِ پر (Tafkheem - Green سبز رنگ): خ، ص، ض، ط، ظ، غ، ق
  // صرف وہی میچ کریں جو ایچ ٹی ایم ایل ٹیگز (<span...>) کے اندر نہ ہوں
  html = html.replace(
    /(<span[^>]*>.*?<\/span>)|([خصضطظغق][ًٌَُٰۡ]?)/g,
    (match, p1, p2) => {
      if (p1) return p1; // پہلے سے موجود ٹیگ کو مت چھیڑیں
      return `<span class="tajweed-tafkheem">${p2}</span>`;
    }
  );

  // راء پر (زبر یا پیش والی راء) -> سبز
  html = html.replace(
    /(<span[^>]*>.*?<\/span>)|(ر[ًٌَُٰ])/g,
    (match, p1, p2) => {
      if (p1) return p1;
      return `<span class="tajweed-tafkheem">${p2}</span>`;
    }
  );

  // لفظ اللہ کا لام پر -> سبز
  html = html.replace(
    /(<span[^>]*>.*?<\/span>)|(ٱللَّهِ|ٱللَّهُ|ٱللَّهَ)/g,
    (match, p1, p2) => {
      if (p1) return p1;
      return `<span class="tajweed-tafkheem">${p2}</span>`;
    }
  );

  return html;
}
