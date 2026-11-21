import React, { useEffect, useState } from 'react';

interface AdBannerProps {
  slotId?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId = '2482490729'
}) => {
  const [hasAdFilled, setHasAdFilled] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Offline or adblocker silently handled
    }

    // Check if Google AdSense / AdMob has actually rendered an ad (iframe or filled status)
    const timer = setInterval(() => {
      const insEl = document.getElementById(`ad-slot-${slotId}`);
      if (insEl) {
        const status = insEl.getAttribute('data-ad-status');
        const iframe = insEl.querySelector('iframe');
        if (status === 'filled' || iframe) {
          setHasAdFilled(true);
          clearInterval(timer);
        }
      }
    }, 2000);

    const timeout = setTimeout(() => clearInterval(timer), 15000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [slotId]);

  // While ads are unapproved or unfilled, do NOT take up empty white space
  return (
    <div
      className={`w-full transition-all duration-300 ${
        hasAdFilled ? 'mt-4 mb-2 p-3 rounded-2xl bg-white dark:bg-[#081f15] border border-emerald-900/10 shadow-sm' : 'h-0 overflow-hidden m-0 p-0 border-0'
      }`}
    >
      {hasAdFilled && (
        <div className="flex items-center justify-between w-full px-2 mb-1.5 text-[10px] text-gray-400 font-sans">
          <span className="uppercase tracking-wider">حلال اشتہار • Sponsor</span>
          <span>Ad</span>
        </div>
      )}

      {/* Google AdMob / AdSense Banner Container */}
      <ins
        id={`ad-slot-${slotId}`}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: hasAdFilled ? '60px' : '0px', width: '100%' }}
        data-ad-client="ca-app-pub-3599693785760579"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
