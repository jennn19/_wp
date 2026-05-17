import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "社群平台",
  description: "簡單的社群軟體",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-TW">
      <body className="font-sans">{children}</body>
    </html>
  );
}