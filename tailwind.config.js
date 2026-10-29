/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quran: {
          gold: '#d4af37',
          goldDark: '#aa8c2c',
          goldLight: '#f3e5ab',
          emerald: '#064e3b',
          emeraldLight: '#047857',
          darkBg: '#0b131e',
          cardBg: '#131e2e',
          border: '#1f2e45'
        }
      },
      fontFamily: {
        amiri: ['"Amiri Quran"', '"Scheherazade New"', 'serif'],
        uthmanic: ['"UthmanicHafs"', '"KFGQPC Uthman Taha Naskh"', '"Amiri Quran"', 'serif'],
        urdu: ['"Noto Nastaliq Urdu"', '"Jameel Noori Nastaleeq"', 'serif']
      }
    },
  },
  plugins: [],
}