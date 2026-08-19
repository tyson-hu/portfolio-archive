import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { PORTFOLIO } from "@/data/portfolio";

import "./globals.css";
import "./portfolio.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

const title = "Tianzhe Hu — Software Engineer";

export const metadata: Metadata = {
  metadataBase: new URL(PORTFOLIO.identity.url),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description: PORTFOLIO.hero.introduction,
  openGraph: {
    title,
    description: PORTFOLIO.hero.introduction,
    url: PORTFOLIO.identity.url,
    siteName: title,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title,
    description: PORTFOLIO.hero.introduction,
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${geist.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
