import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AP Test Practice — Free AP Exam Prep | APScore5",
  description:
    "Free AP practice questions for AP Biology, AP Human Geography, and AP CSP. Study 5 minutes a day and score a 5. No signup required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          async
          defer
          src="https://static.cdn.prismic.io/prismic.js?new=true&repo=apscore5"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
