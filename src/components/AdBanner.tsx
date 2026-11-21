import React, { useEffect } from 'react';

interface AdBannerProps {
  slotId?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = '2482490729' // Google AdMob Bottom Banner Unit ID
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
    <div className="w-full mt-4 mb-2 flex flex-col items-center justify-center overflow-hidden rounded-3xl bg-white dark:bg-[#081f15] border border-emerald-900/10 dark:border-emerald-700/20 p-3 text-center shadow-sm">
      <div className="flex items-center justify-between w-full px-2 mb-1.5 text-[10px] text-gray-400 font-sans">
        <span className="uppercase tracking-wider">حلال اشتہار • Sponsor</span>
        <span>Ad</span>
      </div>

      {/* Google AdMob / AdSense Banner Container */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '60px', width: '100%' }}
        data-ad-client="ca-app-pub-3599693785760579"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
