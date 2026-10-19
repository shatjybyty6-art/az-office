# مشروع AZ OFFICE — مكتبة ألعاب PS4 وPS5

موقع عربي باتجاه RTL، بواجهة داكنة، وبحث وفلاتر، وتفاصيل اللعبة، ولوحة إدارة مرتبطة بـ Supabase.

## المتطلبات
- Windows 10 أو 11
- Node.js إصدار LTS: https://nodejs.org/
- محرر VS Code: https://code.visualstudio.com/
- حساب مجاني في Supabase: https://supabase.com/
- حساب GitHub وVercel للنشر لاحقاً

## 1) فك الضغط
فك ملف ZIP في مجلد سهل مثل:
`C:\AZ-OFFICE`

افتح المجلد في VS Code عبر File > Open Folder.

## 2) تشغيل الموقع محلياً
من VS Code افتح Terminal > New Terminal، ثم نفّذ:

```bash
npm install
npm run dev
```

افتح في المتصفح:
`http://localhost:3000`

يمكنك معاينة الموقع مباشرة ببيانات تجريبية حتى لو لم تضبط Supabase بعد.

## 3) إعداد قاعدة البيانات ولوحة الإدارة
1. أنشئ مشروعاً في Supabase.
2. من SQL Editor افتح ملف `supabase/schema.sql` وانسخ محتواه ونفّذه.
3. من Project Settings > API (أو API Keys) انسخ Project URL والمفتاح العام publishable/anon. لا تستخدم `service_role` أو أي secret key داخل الموقع.
4. انسخ `.env.example` إلى ملف جديد اسمه `.env.local` في جذر المشروع.
5. أدخل البيانات في `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_KEY
NEXT_PUBLIC_WHATSAPP_NUMBER=9647835073512
NEXT_PUBLIC_SITE_NAME=AZ OFFICE
```

6. من Supabase > Authentication > Users أنشئ مستخدم المسؤول بنفسك، ثم سجّل الدخول من `http://localhost:3000/admin`.
7. أوقف الخادم بـ Ctrl+C ثم شغله مجدداً بـ `npm run dev`.

### ملاحظة أمنية مهمة
السياسات في ملف SQL تسمح لأي مستخدم موثّق في مشروع Supabase بالتعديل. قبل فتح التسجيل العام أو مشاركة مشروع Supabase، اجعل حساب المسؤول فقط قادراً على الدخول أو عدّل السياسات لتقييد التعديل إلى بريد/مستخدم المسؤول. لا تضع مفاتيح service_role أو كلمات المرور في ملفات الواجهة أو GitHub.

## 4) الصور
في لوحة الإدارة ألصق رابط صورة عام يبدأ بـ `https://`. يمكنك استخدام روابط الصور التي تملك حق استخدامها. لتحميل الصور مباشرة إلى الموقع بدلاً من روابط خارجية، يمكن إضافة Supabase Storage في خطوة لاحقة.

## 5) بناء نسخة الإنتاج
```bash
npm run build
npm run start
```

## 6) النشر المجاني على Vercel
1. ارفع مجلد المشروع إلى مستودع GitHub جديد.
2. افتح https://vercel.com/ واختر Add New > Project ثم استورد المستودع.
3. أضف متغيرات البيئة نفسها الموجودة في `.env.local` ضمن إعدادات المشروع في Vercel.
4. انشر المشروع.
5. من إعدادات Vercel > Domains أضف `az-lab.shop` واتبع تعليمات DNS التي تظهر لك حرفياً.
6. في Supabase > Authentication > URL Configuration أضف رابط موقعك المنشور إلى Site URL وRedirect URLs إذا طلبت ذلك.

## ملاحظات
- الألعاب التجريبية تظهر عندما لا تكون قاعدة البيانات جاهزة. بعد ضبط Supabase، تظهر الألعاب التي أضفتها إلى جدول `games`.
- هذا مشروع بداية قابل للتطوير؛ لا يتضمن رفع ملفات الصور مباشرة، أو صفحة مستقلة لكل لعبة، أو لوحة إحصائيات.
- استخدم صوراً ونصوصاً تملك حقوق نشرها أو لديك إذن باستخدامها.
