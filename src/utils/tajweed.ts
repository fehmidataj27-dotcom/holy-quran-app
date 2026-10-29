import { TajweedRule } from '../types/quran';

export const TAJWEED_RULES: TajweedRule[] = [
  {
    class: 'ghunnah',
    title: 'Ghunnah / Ikhfaa',
    titleUrdu: 'غنہ (سرخ رنگ - Red)',
    color: '#ef4444', // Red (مطلوبہ سرخ رنگ)
    description: 'نون اور میم مشدد اور اخفاء کے مقامات پر 2 حرکات کی ناک سے آواز۔'
  },
  {
    class: 'idgham',
    title: 'Idgham (Merging)',
    titleUrdu: 'ادغام (گلابی رنگ - Pink)',
    color: '#ec4899', // Pink (مطلوبہ گلابی رنگ)
    description: 'یرملون (ی، ر، م، ل، و، ن) کے حروف میں ملا کر پڑھنا۔'
  },
  {
    class: 'madd_obligatory',
    title: 'Madd Lazim / Muttasil (4-6 Harakat)',
    titleUrdu: 'مد لازم و متصل (طویل کھینچنا)',
    color: '#f59e0b', // Amber / Gold
    description: 'حروفِ مد کے بعد ہمزہ یا سکون آنے پر طویل کھینچنا۔'
  },
  {
    class: 'qalqalah',
    title: 'Qalqalah (Echo sound)',
    titleUrdu: 'قلقلہ (نیلا رنگ)',
    color: '#0ea5e9', // Sky Blue
    description: 'ق، ط، ب، ج، د پر سکون ہونے کی صورت میں گونج پیدا کرنا۔'
  },
  {
    class: 'tafkheem',
    title: 'Tafkheem (Heavy Letters)',
    titleUrdu: 'تفخیم (حروف مستعلیہ - سبز رنگ)',
    color: '#10b981', // Green
    description: 'ص، ض، ط، ظ، ق، غ، خ کو پُر اور موٹا پڑھنا۔'
  }
];

/**
 * Transforms plain Uthmanic text into colored Tajweed HTML
 * - Ghunnah: RED (#ef4444)
 * - Idgham: PINK (#ec4899)
 * - Madd: GOLD / AMBER (#f59e0b)
 * - Qalqalah: SKY BLUE (#0ea5e9)
 * - Tafkheem: GREEN (#10b981)
 */
export function formatTajweed(text: string): string {
  if (!text) return '';

  let html = text;

  // 1. غنہ (Ghunnah): نّ اور مّ (شد والے) -> RED
  html = html.replace(/([نم]ّ[ًٌٍَُِ]?)/g, '<span class="tajweed-ghunnah" title="غنہ">$1</span>');

  // 2. ادغام (Idgham): ن یا تنوین کے بعد یرملون حروف یا مشدد ادغامی حروف -> PINK
  html = html.replace(/([یرملون]ّ[ًٌٍَُِ]?)/g, '<span class="tajweed-idgham" title="ادغام">$1</span>');

  // 3. مد لازم و متصل (Madd): علامت مد ~ یا ۤ -> GOLD/AMBER
  html = html.replace(/([^\s]{1,4}[ۤ~][^\s]{0,2})/g, '<span class="tajweed-madd-lazim" title="مد لازم">$1</span>');

  // 4. قلقلہ (Qalqalah): حروف قطب جد پر جزم -> BLUE
  html = html.replace(/([قطبجد]ْ)/g, '<span class="tajweed-qalqalah" title="قلقلہ">$1</span>');

  // 5. تفخیم (Tafkheem): حروف مستعلیہ [ص ض ط ظ ق غ خ] -> GREEN
  html = html.replace(/([صضطظقغخ][ًٌَُ])/g, '<span class="tajweed-tafkheem" title="تفخیم">$1</span>');

  return html;
}
