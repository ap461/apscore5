import type { Metadata } from "next";
import type { HomepageDocument } from "@/types/prismic";
import { CANONICAL_SITE_URL, IMAGE_URLS } from "@/config/endpoints";

const SITE_NAME = "APScore5";

/**
 * Builds the full Next.js Metadata object from the Prismic homepage document.
 * Falls back to sensible defaults if CMS fields are empty.
 */
export function generateHomeMetadata(homepage: HomepageDocument): Metadata {
  const data = homepage.data;

  const title =
    data.meta_title ?? `AP Test Practice — Free AP Exam Prep | ${SITE_NAME}`;
  const description =
    data.meta_description ??
    "Free AP practice questions for AP Biology, AP Human Geography, and AP CSP. Study 5 minutes a day, find your blind spots, and score a 5. No signup required.";

  const ogImageUrl =
    (data.og_image?.url as string | undefined) ?? IMAGE_URLS.ogBanner;

  return {
    metadataBase: new URL(CANONICAL_SITE_URL),
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description,
      type: "website",
      url: "/",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [{ url: ogImageUrl, width: 1200, height: 628, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
