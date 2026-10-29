# 📖 القرآن الكريم - Tajweed & Audio Studio
## Vercel Deployment & Play Store Guide

### 🚀 مرحلہ 1: Vercel پر لائیو کرنا (Vercel Deployment)

پروجیکٹ کی لوکل ڈائریکٹری:
`C:\Users\HP 650 G8\.gemini\antigravity\scratch\holy-quran-app`

#### آسان طریقہ (GitHub کے ذریعے):
1. اپنے [GitHub.com](https://github.com) اکاؤنٹ پر جائیں اور ایک نیو ریپوزٹری بنائیں، مثلاً: `holy-quran-app`۔
2. اپنے کمپیوٹر میں ٹرمینل کھول کر اس فولڈر میں یہ دو کمانڈز چلائیں (اپنی ریپو کا لنک ڈالیں):
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/holy-quran-app.git
   git branch -M main
   git push -u origin main
   ```
3. اب [Vercel.com](https://vercel.com) پر جائیں:
   - **Add New Project** پر کلک کریں۔
   - GitHub سے `holy-quran-app` کو امپورٹ کریں۔
   - **Deploy** پر کلک کریں۔
   - 1 منٹ کے اندر آپ کو لائیو مفت لنک مل جائے گا (جیسے `https://holy-quran-app.vercel.app`)۔

---

### 📱 مرحلہ 2: بغیر Flutter کے Play Store پر APK/AAB ڈالنا

آپ کو فلٹر کی ضرورت نہیں ہے! جدید ویب ایپس (PWA / TWA) کو براہ راست گوگل پلے اسٹور پر اپلوڈ کیا جاتا ہے:

#### طریقہ: PWABuilder (آفیشل مائیکروسافٹ اور گوگل ٹول)
1. جب آپ کی ایپ Vercel پر لائیو ہو جائے، تو اس کا لنک کاپی کریں۔
2. [PWABuilder.com](https://www.pwabuilder.com) کھولیں۔
3. اپنا Vercel والا لنک درج کریں اور **Start** پر کلک کریں۔
4. **Android Package** سلیکٹ کر کے **Generate APK / AAB** پر کلک کریں۔
5. یہ آپ کو گوگل پلے اسٹور کے لیے تیار **`.aab` (Android App Bundle)** فائل ڈاؤنلوڈ کر کے دے دے گا!
6. [Google Play Console](https://play.google.com/console) میں جا کر وہ بنڈل اپلوڈ کر دیں اور ارننگ کے لیے Google AdMob کے اشتہارات منسلک کر دیں۔
