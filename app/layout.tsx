import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JainAI - Mobile App for JainVerse",
  description: "Mobile app for JainVerse - Your AI-powered companion for learning and practicing Jain philosophy, ethics, and rituals.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#F5B041",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-ivory-50">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
