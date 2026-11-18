import React from 'react';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const whatsappUrl = `https://wa.me/923067125195?text=${encodeURIComponent(
    'السلام علیکم، میں جامعہ صوت القرآن میں داخلہ کی معلومات لینا چاہتا ہوں'
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-gradient-to-b from-[#0e3b29] to-[#072418] border border-[#d4af37] rounded-3xl shadow-2xl overflow-hidden text-white relative animate-scaleUp"
        dir="rtl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white text-sm transition-colors"
          title="بند کریں"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#124e35] to-[#0a2f20] px-5 pt-6 pb-4 text-center border-b border-[#d4af37]/30">
          <div className="font-amiri text-lg text-[#e6ca65] mb-2">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>

          {/* Clean Logo Box */}
          <div className="flex justify-center items-center my-2">
            <div className="bg-[#082216]/80 border border-[#d4af37]/40 rounded-2xl p-2 px-4 shadow-lg inline-flex items-center justify-center">
              <img
                src="/jamia_logo.png"
                alt="جامعہ صوت القرآن"
                className="w-56 h-auto object-contain rounded-lg"
              />
            </div>
          </div>

          <div className="inline-block mt-1 bg-[#d4af37]/15 border border-[#d4af37]/40 px-3 py-0.5 rounded-full text-xs text-[#fceea7]">
            زیرِ نگرانی: ہیڈ استادہ حافظہ وجیہہ صاحبہ
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">
          <div className="flex items-center gap-2 border-b border-[#d4af37]/20 pb-2 text-[#e6ca65] font-bold text-sm">
            <span>📖</span>
            <span>داخلہ جاری ہے • Courses Offered</span>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-2 gap-2 text-right">
            <div className="bg-white/5 hover:bg-[#d4af37]/10 border border-white/10 hover:border-[#d4af37]/50 rounded-xl p-2.5 transition-all">
              <div className="text-sm">📜</div>
              <div className="font-bold text-xs text-white mt-1">حفظ القرآن الکریم</div>
              <div className="text-[10px] text-emerald-300">Quran Hifz Series</div>
            </div>

            <div className="bg-white/5 hover:bg-[#d4af37]/10 border border-white/10 hover:border-[#d4af37]/50 rounded-xl p-2.5 transition-all">
              <div className="text-sm">🎙️</div>
              <div className="font-bold text-xs text-white mt-1">تجوید و ترتیل کورس</div>
              <div className="text-[10px] text-emerald-300">Tajweed & Tarteel</div>
            </div>

            <div className="bg-white/5 hover:bg-[#d4af37]/10 border border-white/10 hover:border-[#d4af37]/50 rounded-xl p-2.5 transition-all">
              <div className="text-sm">📖</div>
              <div className="font-bold text-xs text-white mt-1">ترجمہ و تفسیر کورس</div>
              <div className="text-[10px] text-emerald-300">Tafseer-ul-Quran</div>
            </div>

            <div className="bg-white/5 hover:bg-[#d4af37]/10 border border-white/10 hover:border-[#d4af37]/50 rounded-xl p-2.5 transition-all">
              <div className="text-sm">🌱</div>
              <div className="font-bold text-xs text-white mt-1">یسّرنا القرآن (ناظرہ)</div>
              <div className="text-[10px] text-emerald-300">Foundations / Nazra</div>
            </div>

            <div className="bg-white/5 hover:bg-[#d4af37]/10 border border-white/10 hover:border-[#d4af37]/50 rounded-xl p-2.5 transition-all">
              <div className="text-sm">🕌</div>
              <div className="font-bold text-xs text-white mt-1">نماز و مسنون دعائیں</div>
              <div className="text-[10px] text-emerald-300">Namaz & Duas Course</div>
            </div>

            <div className="bg-white/5 hover:bg-[#d4af37]/10 border border-white/10 hover:border-[#d4af37]/50 rounded-xl p-2.5 transition-all">
              <div className="text-sm">🕋</div>
              <div className="font-bold text-xs text-white mt-1">حدیث و عمرہ گائیڈ</div>
              <div className="text-[10px] text-emerald-300">Hadith & Umrah Guide</div>
            </div>
          </div>

          {/* Key Features */}
          <div className="bg-black/30 rounded-xl p-3 text-xs space-y-1.5 text-emerald-100">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✔</span>
              <span>روزانہ زوم (Zoom) پر لائیو کلاسز + ریکارڈنگ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✔</span>
              <span>خواتین، بچوں اور بچیوں کے لیے پرسکون اسلامی ماحول</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✔</span>
              <span>روز کا سبق روز سننا اور انفرادی توجہ</span>
            </div>
          </div>

          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#25d366] to-[#128c7e] hover:from-[#20ba5a] hover:to-[#0e7467] text-white py-3 px-4 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/>
            </svg>
            <span>داخلہ کے لیے رابطہ کریں (WhatsApp)</span>
          </a>

          {/* Skip Button */}
          <button
            onClick={onClose}
            className="w-full text-center text-xs text-emerald-300/80 hover:text-white py-1 underline transition-colors"
          >
            تلاوت شروع کریں • Continue to Quran
          </button>
        </div>
      </div>
    </div>
  );
};
