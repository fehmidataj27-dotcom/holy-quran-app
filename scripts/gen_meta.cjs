const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/HP 650 G8/.gemini/antigravity/scratch/holy-quran-app';
const surahs = JSON.parse(fs.readFileSync(path.join(baseDir, 'src/data/indopak_surah_mapping.json'), 'utf8'));
const paras = JSON.parse(fs.readFileSync(path.join(baseDir, 'src/data/indopak_para_mapping.json'), 'utf8'));

const surahStarts = Object.entries(surahs).map(([id, val]) => ({
  id: parseInt(id),
  name: val.name,
  arabicName: val.arabicName,
  page: parseInt(val.page.replace('.webp', ''))
})).sort((a,b) => a.page - b.page);

const paraStarts = Object.entries(paras).map(([id, val]) => ({
  id: parseInt(id),
  name: val.name,
  page: parseInt(val.page.replace('.webp', ''))
})).sort((a,b) => a.page - b.page);

const pageLookup = {};

for (let p = 2; p <= 549; p++) {
  let curSurah = surahStarts[0];
  for (const s of surahStarts) {
    if (s.page <= p) curSurah = s;
    else break;
  }

  let curPara = paraStarts[0];
  for (const pa of paraStarts) {
    if (pa.page <= p) curPara = pa;
    else break;
  }

  pageLookup[p] = {
    surahNumber: curSurah.id,
    surahName: curSurah.name,
    arabicName: curSurah.arabicName,
    juzNumber: curPara.id,
    juzName: curPara.name
  };
}

const fileContent = `export interface PageMeta {
  surahNumber: number;
  surahName: string;
  arabicName: string;
  juzNumber: number;
  juzName: string;
}

export const MIN_PAGE = 2;
export const MAX_PAGE = 549;
export const TOTAL_MUSHAF_PAGES = 548;

export const INDOPAK_PAGE_META: Record<number, PageMeta> = ${JSON.stringify(pageLookup, null, 2)};

export function getPageMeta(page: number): PageMeta {
  const p = Math.max(MIN_PAGE, Math.min(MAX_PAGE, page));
  return INDOPAK_PAGE_META[p] || {
    surahNumber: 1,
    surahName: 'Al-Fatihah',
    arabicName: 'الفاتحة',
    juzNumber: 1,
    juzName: 'Para 1 - Alif Lam Meem'
  };
}
`;

fs.writeFileSync(path.join(baseDir, 'src/data/pageMeta.ts'), fileContent, 'utf8');
console.log('src/data/pageMeta.ts generated successfully!');
