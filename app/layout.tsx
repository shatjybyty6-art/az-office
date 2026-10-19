import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AZ OFFICE | مكتبة ألعاب PlayStation",
  description: "تصفح مكتبة ألعاب PS4 وPS5 من مكتب أحمد الزاملي.",
  applicationName: "AZ OFFICE"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
