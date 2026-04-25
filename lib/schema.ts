import {
  CANONICAL_SITE_URL,
  EXTERNAL_URLS,
  IMAGE_URLS,
} from "@/config/endpoints";
import type { FAQItem } from "@/types/index";

// ─── JSON-LD Types ────────────────────────────────────────────────────────────

interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  potentialAction: {
    "@type": "SearchAction";
    target: { "@type": "EntryPoint"; urlTemplate: string };
    "query-input": string;
  };
}

interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo: string;
  sameAs: string[];
}

interface FAQPageSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }>;
}

// ─── Generators ───────────────────────────────────────────────────────────────

export function generateWebSiteSchema(
  siteUrl: string = CANONICAL_SITE_URL
): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "APScore5",
    url: siteUrl,
    description:
      "Free AP test practice questions, unit quizzes, and exam prep for AP Biology, AP Human Geography, and AP Computer Science Principles.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateOrganizationSchema(
  siteUrl: string = CANONICAL_SITE_URL
): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "APScore5",
    url: siteUrl,
    logo: IMAGE_URLS.logoLight,
    sameAs: [EXTERNAL_URLS.youtube, EXTERNAL_URLS.tiktok],
  };
}

export function generateFAQSchema(faqs: FAQItem[]): FAQPageSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
