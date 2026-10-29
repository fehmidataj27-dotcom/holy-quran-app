import React, { useEffect } from 'react';

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = '1234567890', // گوگل ایڈموب یا ایڈسینس سلاٹ آئی ڈی
  format = 'auto'
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Offline or adblocker silently handled
    }
  }, []);

  return (
    <div className="w-full my-4 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#0b1422] border border-slate-800/80 p-2 min-h-[90px] text-center">
      <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
        Sponsored / اشتہار
      </span>
      {/* Real AdSense / AdMob unit container */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-app-pub-XXXXXXXXXXXXXXXX" // یوزر کا پبلشر آئی ڈی
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};
