import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ADSENSE, PRISMIC, CANONICAL_SITE_URL } from "@/config/endpoints";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Root layout metadata — provides sensible defaults.
 * Each page overrides these via its own `generateMetadata` / `metadata` export.
 */
export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_SITE_URL),
  title: {
    default: "AP Test Practice — Free AP Exam Prep | APScore5",
    template: "%s | APScore5",
  },
  description:
    "Free AP practice questions for AP Biology, AP Human Geography, and AP CSP. Study 5 minutes a day and score a 5. No signup required.",
  // Google AdSense ownership verification — goes into <head> automatically
  other: {
    "google-adsense-account": ADSENSE.publisherId,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        {/* Google AdSense script — loaded after page is interactive */}
        <Script
          async
          src={ADSENSE.scriptSrc}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Prismic Toolbar — for preview / CMS link resolution */}
        <Script
          async
          defer
          src={PRISMIC.toolbarSrc}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
