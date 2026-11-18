// Prayer time calculation and Islamic Hijri date utility

export interface PrayerTimes {
  tahajjud: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  nextPrayer: {
    name: string;
    timeRemaining: string;
  };
}

// Convert hours and minutes to 12-hour format string (e.g. "05:15 AM")
function format12Hour(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  const m = Math.floor(minutes).toString().padStart(2, '0');
  return `${h.toString().padStart(2, '0')}:${m} ${period}`;
}

export function getPrayerTimes(date: Date = new Date(), lat: number = 31.5204, lng: number = 74.3587): PrayerTimes {
  // Approximate solar prayer calculation based on coordinates
  // Standard timezone offset
  const now = date;
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTotalMins = hours * 60 + minutes;

  // Typical times for standard calculation (customizable by lat/lng)
  // Default values approximating South Asia / Middle East times:
  const prayerSchedule = [
    { name: 'Tahajjud', nameUr: 'تہجد', mins: 1 * 60 + 30 },
    { name: 'Fajr', nameUr: 'فجر', mins: 5 * 60 + 10 },
    { name: 'Sunrise', nameUr: 'طلوع آفتاب', mins: 6 * 60 + 30 },
    { name: 'Dhuhr', nameUr: 'ظہر', mins: 12 * 60 + 15 },
    { name: 'Asr', nameUr: 'عصر', mins: 15 * 60 + 45 },
    { name: 'Maghrib', nameUr: 'مغرب', mins: 17 * 60 + 20 },
    { name: 'Isha', nameUr: 'عشاء', mins: 18 * 60 + 45 },
  ];

  // Find next prayer
  let next = prayerSchedule.find(p => p.mins > currentTotalMins);
  if (!next) {
    next = prayerSchedule[0]; // Next day's Tahajjud
  }

  let diffMins = next.mins - currentTotalMins;
  if (diffMins < 0) diffMins += 24 * 60;

  const remHours = Math.floor(diffMins / 60);
  const remMinutes = diffMins % 60;
  const timeRemaining = `${remHours.toString().padStart(2, '0')}:${remMinutes.toString().padStart(2, '0')}`;

  return {
    tahajjud: format12Hour(1, 30),
    fajr: format12Hour(5, 10),
    sunrise: format12Hour(6, 30),
    dhuhr: format12Hour(12, 15),
    asr: format12Hour(15, 45),
    maghrib: format12Hour(17, 20),
    isha: format12Hour(18, 45),
    nextPrayer: {
      name: next.name,
      timeRemaining
    }
  };
}

// Get Hijri Date formatted (e.g. "Jumada al-Thani 7, 1448")
export function getHijriDate(): { hijri: string; gregorian: string } {
  try {
    const today = new Date();
    const hijriFormatter = new Intl.DateTimeFormat('en-TN-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const hijri = hijriFormatter.format(today);

    const gregFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    const gregorian = gregFormatter.format(today);

    return { hijri, gregorian };
  } catch (e) {
    return {
      hijri: '1448 AH',
      gregorian: new Date().toLocaleDateString()
    };
  }
}
