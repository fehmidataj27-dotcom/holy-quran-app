import React, { useState, useEffect } from 'react';
import {
  NotificationSettings,
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  sendNotification,
} from '../utils/notificationHelper';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings());
  const [permissionGranted, setPermissionGranted] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSettings(getNotificationSettings());
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setPermissionGranted(Notification.permission === 'granted');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionGranted(granted);
    if (granted) {
      const updated = { ...settings, enabled: true };
      setSettings(updated);
      saveNotificationSettings(updated);
      showToast('نوٹیفکیشن کی اجازت مل گئی ہے! 🌸');
    } else {
      showToast('براہ کرم براؤزر / موبائل سیٹنگز سے نوٹیفکیشن کی اجازت دیں۔');
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleTestNotification = () => {
    if (!permissionGranted) {
      handleRequestPermission();
      return;
    }
    sendNotification(
      '📖 صوت القرآن • ٹیسٹ نوٹیفکیشن',
      'ماشاءاللہ! نوٹیفکیشن سروس بالکل درست کام کر رہی ہے۔'
    );
    showToast('ٹیسٹ نوٹیفکیشن بھیج دیا گیا ہے! ✅');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0c2419] rounded-3xl shadow-2xl border border-emerald-800/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1b7a4b] text-white p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all"
          >
            ✕
          </button>

          <div className="text-3xl mb-1">🔔</div>
          <h2 className="text-lg font-bold">اسلامی یاد دہانی و نوٹیفکیشن</h2>
          <p className="text-xs text-emerald-100 mt-1">
            روزانہ کی آیت، اذکار اور نماز کے اہم اوقات کے پیغامات
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Permission Status Banner */}
          {!permissionGranted ? (
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 rounded-2xl p-4 text-center">
              <div className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">
                نوٹیفکیشن کی اجازت درکار ہے
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300/80 mb-3 leading-relaxed">
                وقت پر آیت اور اذکار کی یاد دہانی حاصل کرنے کے لیے بٹن دبائیں۔
              </p>
              <button
                onClick={handleRequestPermission}
                className="w-full bg-[#1b7a4b] hover:bg-[#15603a] active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>🔔</span>
                <span>نوٹیفکیشن آن کریں</span>
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/50 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-200">
              <span className="flex items-center gap-1.5 font-bold">
                <span>✓</span>
                <span>نوٹیفکیشن کی اجازت فعال ہے</span>
              </span>
              <button
                onClick={handleTestNotification}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all"
              >
                ٹیسٹ بھیجیں
              </button>
            </div>
          )}

          {/* Individual Switches */}
          <div className="space-y-2.5">
            {/* Daily Ayah */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/20 border border-gray-100 dark:border-emerald-900/30">
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <span>📖</span>
                  <span>روزانہ کی آیت (Daily Ayah)</span>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                  دن میں ایک بار تسکینِ قلب و رہنمائی کا پیغام
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.dailyAyah}
                onChange={() => handleToggle('dailyAyah')}
                className="w-5 h-5 accent-[#1b7a4b] rounded cursor-pointer"
              />
            </div>

            {/* Morning Adhkar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/20 border border-gray-100 dark:border-emerald-900/30">
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <span>🌅</span>
                  <span>صبح کے اذکار</span>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                  صبح 6 سے 8 بجے کے درمیان یاد دہانی
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.morningAdhkar}
                onChange={() => handleToggle('morningAdhkar')}
                className="w-5 h-5 accent-[#1b7a4b] rounded cursor-pointer"
              />
            </div>

            {/* Evening Adhkar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/20 border border-gray-100 dark:border-emerald-900/30">
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <span>🌆</span>
                  <span>شام کے اذکار</span>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                  عصر اور مغرب کے وقت مسنون اذکار
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.eveningAdhkar}
                onChange={() => handleToggle('eveningAdhkar')}
                className="w-5 h-5 accent-[#1b7a4b] rounded cursor-pointer"
              />
            </div>

            {/* Sleeping Adhkar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/20 border border-gray-100 dark:border-emerald-900/30">
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <span>🌙</span>
                  <span>سونے سے پہلے کے اذکار</span>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                  رات 9:30 سے 11 بجے پرسکون نیند کی مسنون دعائیں
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.sleepingAdhkar}
                onChange={() => handleToggle('sleepingAdhkar')}
                className="w-5 h-5 accent-[#1b7a4b] rounded cursor-pointer"
              />
            </div>

            {/* Prayer Times */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-emerald-950/20 border border-gray-100 dark:border-emerald-900/30">
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <span>🕌</span>
                  <span>نماز کے اوقات کی یاد دہانی</span>
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                  نماز کا وقت داخل ہوتے ہی الرٹ
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.prayerTimes}
                onChange={() => handleToggle('prayerTimes')}
                className="w-5 h-5 accent-[#1b7a4b] rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-[#071911] border-t border-gray-100 dark:border-emerald-900/30 flex items-center justify-between">
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            سیٹنگز خودکار محفوظ ہو جاتی ہیں
          </span>
          <button
            onClick={onClose}
            className="bg-[#1b7a4b] hover:bg-[#15603a] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all"
          >
            ٹھیک ہے
          </button>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-white/20 animate-bounce">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};
