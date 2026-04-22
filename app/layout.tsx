import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AP Test Practice — Free AP Exam Prep | APScore5",
  description:
    "Free AP practice questions for AP Biology, AP Human Geography, and AP CSP. Study 5 minutes a day and score a 5. No signup required.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Google AdSense Meta Tag */}
        <meta
          name="google-adsense-account"
          content="ca-pub-4424361283304614"
        />

        {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4424361283304614"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Prismic Script */}
        <script
          async
          defer
          src="https://static.cdn.prismic.io/prismic.js?new=true&repo=apscore5"
        />
      </head>

      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
