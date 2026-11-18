import React, { useState } from 'react';

interface GotoPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToPage: (pageNumber: number, surahNumber: number) => void;
}

export const GotoPageModal: React.FC<GotoPageModalProps> = ({
  isOpen,
  onClose,
  onGoToPage,
}) => {
  const [pageInput, setPageInput] = useState('');

  if (!isOpen) return null;

  // Accurate Mushaf Page (1-604) to Surah Number Mapping
  const getSurahForPage = (pageNum: number): number => {
    if (pageNum <= 1) return 1;       // Al-Fatihah
    if (pageNum <= 49) return 2;      // Al-Baqarah (Pages 2-49)
    if (pageNum <= 76) return 3;      // Aal-e-Imran (Pages 50-76)
    if (pageNum <= 106) return 4;     // An-Nisa (Pages 77-106)
    if (pageNum <= 127) return 5;     // Al-Maidah (Pages 106-127)
    if (pageNum <= 150) return 6;     // Al-An'am (Pages 128-150)
    if (pageNum <= 176) return 7;     // Al-A'raf (Pages 151-176)
    if (pageNum <= 186) return 8;     // Al-Anfal (Pages 177-186)
    if (pageNum <= 207) return 9;     // At-Tawbah (Pages 187-207)
    if (pageNum <= 221) return 10;    // Yunus (Pages 208-221)
    if (pageNum <= 235) return 11;    // Hud (Pages 221-235)
    if (pageNum <= 248) return 12;    // Yusuf (Pages 235-248)
    if (pageNum <= 255) return 13;    // Ar-Ra'd (Pages 249-255)
    if (pageNum <= 261) return 14;    // Ibrahim (Pages 255-261)
    if (pageNum <= 267) return 15;    // Al-Hijr (Pages 262-267)
    if (pageNum <= 281) return 16;    // An-Nahl (Pages 267-281)
    if (pageNum <= 293) return 17;    // Al-Isra (Pages 282-293)
    if (pageNum <= 304) return 18;    // Al-Kahf (Pages 293-304)
    if (pageNum <= 312) return 19;    // Maryam (Pages 305-312)
    if (pageNum <= 321) return 20;    // Ta-Ha (Pages 312-321)
    if (pageNum <= 331) return 21;    // Al-Anbiya (Pages 322-331)
    if (pageNum <= 341) return 22;    // Al-Hajj (Pages 332-341)
    if (pageNum <= 350) return 23;    // Al-Mu'minun (Pages 342-349)
    if (pageNum <= 359) return 24;    // An-Nur (Pages 350-359)
    if (pageNum <= 366) return 25;    // Al-Furqan (Pages 359-366)
    if (pageNum <= 376) return 26;    // Ash-Shu'ara (Pages 367-376)
    if (pageNum <= 385) return 27;    // An-Naml (Pages 377-385)
    if (pageNum <= 396) return 28;    // Al-Qasas (Pages 385-396)
    if (pageNum <= 404) return 29;    // Al-Ankabut (Pages 396-404)
    if (pageNum <= 410) return 30;    // Ar-Rum (Pages 404-410)
    if (pageNum <= 414) return 31;    // Luqman (Pages 411-414)
    if (pageNum <= 417) return 32;    // As-Sajdah (Pages 415-417)
    if (pageNum <= 427) return 33;    // Al-Ahzab (Pages 418-427)
    if (pageNum <= 434) return 34;    // Saba (Pages 428-434)
    if (pageNum <= 440) return 35;    // Fatir (Pages 434-440)
    if (pageNum <= 445) return 36;    // Ya-Sin (Pages 440-445)
    if (pageNum <= 452) return 37;    // As-Saffat (Pages 446-452)
    if (pageNum <= 458) return 38;    // Sad (Pages 453-458)
    if (pageNum <= 467) return 39;    // Az-Zumar (Pages 458-467)
    if (pageNum <= 476) return 40;    // Ghafir (Pages 467-476)
    if (pageNum <= 482) return 41;    // Fussilat (Pages 477-482)
    if (pageNum <= 489) return 42;    // Ash-Shura (Pages 483-489)
    if (pageNum <= 495) return 43;    // Az-Zukhruf (Pages 489-495)
    if (pageNum <= 498) return 44;    // Ad-Dukhan (Pages 496-498)
    if (pageNum <= 502) return 45;    // Al-Jathiyah (Pages 499-502)
    if (pageNum <= 506) return 46;    // Al-Ahqaf (Pages 502-506)
    if (pageNum <= 510) return 47;    // Muhammad (Pages 507-510)
    if (pageNum <= 515) return 48;    // Al-Fath (Pages 511-515)
    if (pageNum <= 517) return 49;    // Al-Hujurat (Pages 515-517)
    if (pageNum <= 520) return 50;    // Qaf (Pages 518-520)
    if (pageNum <= 523) return 51;    // Adh-Dhariyat (Pages 520-523)
    if (pageNum <= 525) return 52;    // At-Tur (Pages 523-525)
    if (pageNum <= 528) return 53;    // An-Najm (Pages 526-528)
    if (pageNum <= 531) return 54;    // Al-Qamar (Pages 528-531)
    if (pageNum <= 534) return 55;    // Ar-Rahman (Pages 531-534)
    if (pageNum <= 537) return 56;    // Al-Waqi'ah (Pages 534-537)
    if (pageNum <= 541) return 57;    // Al-Hadid (Pages 537-541)
    if (pageNum <= 545) return 58;    // Al-Mujadila (Pages 542-545)
    if (pageNum <= 548) return 59;    // Al-Hashr (Pages 545-548)
    if (pageNum <= 551) return 60;    // Al-Mumtahanah (Pages 549-551)
    if (pageNum <= 552) return 61;    // As-Saff (Pages 551-552)
    if (pageNum <= 554) return 62;    // Al-Jumu'ah (Pages 553-554)
    if (pageNum <= 555) return 63;    // Al-Munafiqun (Pages 554-555)
    if (pageNum <= 558) return 64;    // At-Taghabun (Pages 556-558)
    if (pageNum <= 560) return 65;    // At-Talaq (Pages 558-560)
    if (pageNum <= 562) return 66;    // At-Tahrim (Pages 560-562)
    if (pageNum <= 564) return 67;    // Al-Mulk (Pages 562-564)
    if (pageNum <= 566) return 68;    // Al-Qalam (Pages 564-566)
    if (pageNum <= 568) return 69;    // Al-Haqqah (Pages 566-568)
    if (pageNum <= 570) return 70;    // Al-Ma'arij (Pages 568-570)
    if (pageNum <= 571) return 71;    // Nuh (Pages 570-571)
    if (pageNum <= 573) return 72;    // Al-Jinn (Pages 572-573)
    if (pageNum <= 575) return 73;    // Al-Muzzammil (Pages 574-575)
    if (pageNum <= 577) return 74;    // Al-Muddaththir (Pages 575-577)
    if (pageNum <= 578) return 75;    // Al-Qiyamah (Pages 577-578)
    if (pageNum <= 580) return 76;    // Al-Insan (Pages 578-580)
    if (pageNum <= 581) return 77;    // Al-Mursalat (Pages 580-581)
    if (pageNum <= 582) return 78;    // An-Naba (Pages 582-583)
    if (pageNum <= 584) return 79;    // An-Nazi'at
    if (pageNum <= 585) return 80;    // Abasa
    if (pageNum <= 586) return 81;    // At-Takwir
    if (pageNum <= 587) return 82;    // Al-Infitar
    if (pageNum <= 589) return 83;    // Al-Mutaffifin
    if (pageNum <= 590) return 84;    // Al-Inshiqaq
    if (pageNum <= 591) return 85;    // Al-Buruj
    if (pageNum <= 592) return 86;    // At-Tariq
    if (pageNum <= 593) return 87;    // Al-A'la
    if (pageNum <= 594) return 88;    // Al-Ghashiyah
    if (pageNum <= 595) return 89;    // Al-Fajr
    if (pageNum <= 596) return 90;    // Al-Balad
    if (pageNum <= 597) return 91;    // Ash-Shams
    if (pageNum <= 598) return 92;    // Al-Layl
    if (pageNum <= 599) return 93;    // Ad-Duha
    if (pageNum <= 600) return 96;    // Al-Alaq
    if (pageNum <= 601) return 98;    // Al-Bayyinah
    if (pageNum <= 602) return 102;   // At-Takathur
    if (pageNum <= 603) return 108;   // Al-Kawthar
    return 114;                       // An-Nas
  };

  const handleGo = () => {
    const pageNum = parseInt(pageInput);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > 604) {
      alert('براہِ کرم 1 سے 604 کے درمیان صفحہ نمبر درج کریں۔');
      return;
    }

    const surahNum = getSurahForPage(pageNum);
    onGoToPage(pageNum, surahNum);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-[#0e271c] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-scaleUp">
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-2xl">
          📖
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          صفحہ نمبر پر جائیں • Goto Page
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          مصحف کا صفحہ نمبر (1 تا 604) درج کریں
        </p>

        <input
          type="number"
          min="1"
          max="604"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          placeholder="مثلاً: 50"
          className="w-full text-center text-2xl font-bold p-3 border-2 border-emerald-500/40 rounded-2xl outline-none focus:border-emerald-600 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white shadow-inner"
        />

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-700 dark:text-gray-200 font-semibold text-sm transition-all"
          >
            منسوخ کریں
          </button>
          <button
            onClick={handleGo}
            className="flex-1 py-3 rounded-xl bg-[#1b7a4b] hover:bg-[#145d39] text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            جائیں (Go)
          </button>
        </div>
      </div>
    </div>
  );
};
