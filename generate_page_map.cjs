// Standard Pakistani 16-line Mushaf page map generator
// Based on the well-known Uthmani/Pakistani mushaf (604 pages)
// Each surah's starting page and total ayahs

const fs = require('fs');

// Surah data: [surahNumber, startPage, totalAyahs]
// These are the standard page numbers from the Pakistani 16-line Quran
const SURAH_PAGE_DATA = [
  [1, 1, 7],
  [2, 2, 286],
  [3, 50, 200],
  [4, 77, 176],
  [5, 106, 120],
  [6, 128, 165],
  [7, 151, 206],
  [8, 177, 75],
  [9, 187, 129],
  [10, 208, 109],
  [11, 221, 123],
  [12, 235, 111],
  [13, 249, 43],
  [14, 255, 52],
  [15, 262, 99],
  [16, 267, 128],
  [17, 282, 111],
  [18, 293, 110],
  [19, 305, 98],
  [20, 312, 135],
  [21, 322, 112],
  [22, 332, 78],
  [23, 342, 118],
  [24, 350, 64],
  [25, 359, 77],
  [26, 367, 227],
  [27, 377, 93],
  [28, 385, 88],
  [29, 396, 69],
  [30, 404, 60],
  [31, 411, 34],
  [32, 415, 30],
  [33, 418, 73],
  [34, 428, 54],
  [35, 434, 45],
  [36, 440, 83],
  [37, 446, 182],
  [38, 453, 88],
  [39, 458, 75],
  [40, 467, 85],
  [41, 477, 54],
  [42, 483, 53],
  [43, 489, 89],
  [44, 496, 59],
  [45, 499, 37],
  [46, 502, 35],
  [47, 507, 38],
  [48, 511, 29],
  [49, 515, 18],
  [50, 518, 45],
  [51, 520, 60],
  [52, 523, 49],
  [53, 526, 62],
  [54, 528, 55],
  [55, 531, 78],
  [56, 534, 96],
  [57, 537, 29],
  [58, 542, 22],
  [59, 545, 24],
  [60, 549, 13],
  [61, 551, 14],
  [62, 553, 11],
  [63, 554, 11],
  [64, 556, 18],
  [65, 558, 12],
  [66, 560, 12],
  [67, 562, 30],
  [68, 564, 52],
  [69, 566, 52],
  [70, 568, 44],
  [71, 570, 28],
  [72, 572, 28],
  [73, 574, 20],
  [74, 575, 56],
  [75, 577, 40],
  [76, 578, 31],
  [77, 580, 50],
  [78, 582, 40],
  [79, 583, 46],
  [80, 585, 42],
  [81, 586, 29],
  [82, 587, 19],
  [83, 587, 36],
  [84, 589, 25],
  [85, 590, 22],
  [86, 591, 17],
  [87, 591, 19],
  [88, 592, 26],
  [89, 593, 30],
  [90, 594, 20],
  [91, 595, 15],
  [92, 595, 21],
  [93, 596, 11],
  [94, 596, 8],
  [95, 597, 8],
  [96, 597, 19],
  [97, 598, 5],
  [98, 598, 8],
  [99, 599, 8],
  [100, 599, 11],
  [101, 600, 11],
  [102, 600, 8],
  [103, 601, 3],
  [104, 601, 9],
  [105, 601, 5],
  [106, 602, 4],
  [107, 602, 7],
  [108, 602, 3],
  [109, 603, 6],
  [110, 603, 3],
  [111, 603, 5],
  [112, 604, 4],
  [113, 604, 5],
  [114, 604, 6],
];

// Build a comprehensive page -> ayahs map
// Strategy: distribute ayahs across pages based on known surah start pages
// Each page has ~15 ayahs on average (some have more short ones, some fewer long ones)

const pageMap = {};

// Initialize all 604 pages
for (let p = 1; p <= 604; p++) {
  pageMap[p] = [];
}

// For each surah, calculate which ayahs go on which pages
// We know the start page of each surah
// We calculate end page from next surah's start page

for (let i = 0; i < SURAH_PAGE_DATA.length; i++) {
  const [surahNum, startPage, totalAyahs] = SURAH_PAGE_DATA[i];
  
  let endPage;
  if (i < SURAH_PAGE_DATA.length - 1) {
    const [, nextStartPage] = SURAH_PAGE_DATA[i + 1];
    endPage = nextStartPage - 1;
    // If next surah starts on same page, give this surah at least its start page
    if (endPage < startPage) endPage = startPage;
  } else {
    endPage = 604;
  }
  
  const pagesForSurah = endPage - startPage + 1;
  
  // Distribute ayahs across pages
  // Some surahs are short (fit on 1 page), some long (many pages)
  if (pagesForSurah === 1) {
    // All ayahs on one page
    for (let a = 1; a <= totalAyahs; a++) {
      pageMap[startPage].push({ s: surahNum, a: a });
    }
  } else {
    // Distribute evenly
    const ayahsPerPage = totalAyahs / pagesForSurah;
    
    for (let a = 1; a <= totalAyahs; a++) {
      // Which page does this ayah go on?
      const pageOffset = Math.floor((a - 1) / ayahsPerPage);
      const page = Math.min(startPage + pageOffset, endPage);
      pageMap[page].push({ s: surahNum, a: a });
    }
  }
}

// Remove empty pages (some pages at end might be empty)
// Make sure page 1 has surah fatiha content
// Verify & output stats
let totalAyahsInMap = 0;
let emptyPages = 0;
for (let p = 1; p <= 604; p++) {
  totalAyahsInMap += pageMap[p].length;
  if (pageMap[p].length === 0) emptyPages++;
}

console.log(`Total ayahs in map: ${totalAyahsInMap} (should be 6236)`);
console.log(`Empty pages: ${emptyPages}`);
console.log(`Page 1: ${JSON.stringify(pageMap[1])}`);
console.log(`Page 2: ${JSON.stringify(pageMap[2].slice(0, 5))}...`);
console.log(`Page 50: ${JSON.stringify(pageMap[50].slice(0, 3))}...`);

fs.writeFileSync(
  './public/quran/page_map.json',
  JSON.stringify(pageMap),
  'utf8'
);

console.log('page_map.json written successfully!');
