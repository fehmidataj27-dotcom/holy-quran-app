import { getDailyAyah } from '../data/dailyAyahData';
import { PrayerTimes } from './prayerTimes';

export interface NotificationSettings {
  enabled: boolean;
  dailyAyah: boolean;
  morningAdhkar: boolean;
  eveningAdhkar: boolean;
  sleepingAdhkar: boolean;
  prayerTimes: boolean;
}

const SETTINGS_KEY = 'quran_app_notification_settings_v1';
const LAST_NOTIF_KEY = 'quran_app_last_notifications_v1';

export function getNotificationSettings(): NotificationSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // fallback
  }
  return {
    enabled: false,
    dailyAyah: true,
    morningAdhkar: true,
    eveningAdhkar: true,
    sleepingAdhkar: true,
    prayerTimes: true,
  };
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    // ignore
  }
}

/**
 * Request system notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    const settings = getNotificationSettings();
    settings.enabled = true;
    saveNotificationSettings(settings);
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const settings = getNotificationSettings();
      settings.enabled = true;
      saveNotificationSettings(settings);
      
      // Welcome Notification
      sendNotification(
        'صوت القرآن • نوٹیفکیشن آن ہو گئے',
        'ماشاءاللہ! اب آپ کو روزانہ کی آیت، اذکار اور نماز کے اہم اوقات کی یاد دہانی ملے گی 🌸'
      );
      return true;
    }
  }

  return false;
}

/**
 * Dispatch system notification
 */
export function sendNotification(title: string, body: string, tag: string = 'general'): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: '/playstore_assets/app_icon_512x512.png',
          badge: '/icons/icon-192x192.png',
          tag,
          vibrate: [200, 100, 200] as any,
          data: { url: '/' },
        } as any);
      }).catch(() => {
        new Notification(title, {
          body,
          icon: '/playstore_assets/app_icon_512x512.png',
          tag,
        });
      });
    } else {
      new Notification(title, {
        body,
        icon: '/playstore_assets/app_icon_512x512.png',
        tag,
      });
    }
  } catch (e) {
    // fallback or silent fail
  }
}

/**
 * Run Periodic Scheduler for reminders (Adhkar, Daily Ayah, Prayers)
 */
export function checkAndTriggerReminders(prayerTimes?: PrayerTimes): void {
  const settings = getNotificationSettings();
  if (!settings.enabled || Notification.permission !== 'granted') {
    return;
  }

  const now = new Date();
  const todayDateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const hours = now.getHours();
  const minutes = now.getMinutes();

  let sentLog: Record<string, string> = {};
  try {
    const raw = localStorage.getItem(LAST_NOTIF_KEY);
    if (raw) sentLog = JSON.parse(raw);
  } catch (e) {
    //
  }

  // Helper to test if already sent today
  const wasSentToday = (key: string) => sentLog[key] === todayDateStr;
  const markSentToday = (key: string) => {
    sentLog[key] = todayDateStr;
    try {
      localStorage.setItem(LAST_NOTIF_KEY, JSON.stringify(sentLog));
    } catch (e) {
      //
    }
  };

  // 1. Morning Adhkar Reminder (6:00 AM - 9:00 AM)
  if (settings.morningAdhkar && hours >= 6 && hours < 9 && !wasSentToday('morning_adhkar')) {
    sendNotification(
      '🌅 صبح کے اذکار کا وقت ہے',
      'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ... اپنے دن کا آغاز مسنون اذکار سے کیجیے۔',
      'morning-adhkar'
    );
    markSentToday('morning_adhkar');
  }

  // 2. Daily Ayah Reminder (10:00 AM - 1:00 PM)
  if (settings.dailyAyah && hours >= 10 && hours < 13 && !wasSentToday('daily_ayah')) {
    const ayah = getDailyAyah();
    sendNotification(
      `📖 آج کا قرآنی پیغام (${ayah.surahName})`,
      `"${ayah.translationUrdu}" • دلی سکون کے لیے تلاوت فرمائیں۔`,
      'daily-ayah'
    );
    markSentToday('daily_ayah');
  }

  // 3. Evening Adhkar Reminder (4:30 PM - 7:00 PM)
  if (settings.eveningAdhkar && hours >= 16 && hours < 19 && !wasSentToday('evening_adhkar')) {
    sendNotification(
      '🌆 شام کے اذکار کا وقت ہے',
      'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ... شام کے مسنون اذکار پڑھ کر اپنی حفاظت فرمائیں۔',
      'evening-adhkar'
    );
    markSentToday('evening_adhkar');
  }

  // 4. Sleeping Adhkar Reminder (9:30 PM - 11:59 PM)
  if (settings.sleepingAdhkar && (hours >= 21 || hours === 0) && !wasSentToday('sleeping_adhkar')) {
    sendNotification(
      '🌙 سونے سے پہلے کے اذکار',
      'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي... پرسکون نیند اور حفاظت کے مسنون اذکار پڑھ لیجیے۔',
      'sleeping-adhkar'
    );
    markSentToday('sleeping_adhkar');
  }

  // 5. Prayer Times Reminders (Check if prayer is in next 10 mins or current)
  if (settings.prayerTimes && prayerTimes?.nextPrayer) {
    const prayerName = prayerTimes.nextPrayer.name;
    const timeRem = prayerTimes.nextPrayer.timeRemaining.toLowerCase();
    
    // If less than 10 mins remaining
    if ((timeRem.includes('min') || timeRem.includes('m')) && !wasSentToday(`prayer_${prayerName}`)) {
      const minsNum = parseInt(timeRem, 10);
      if (!isNaN(minsNum) && minsNum <= 10) {
        sendNotification(
          `🕌 نماز کا وقت قریب ہے: ${prayerName}`,
          `${prayerName} کی نماز کی تیاری فرمائیں۔ وقت برکت کا باعث ہے۔`,
          `prayer-${prayerName}`
        );
        markSentToday(`prayer_${prayerName}`);
      }
    }
  }
}
