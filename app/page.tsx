import type { Metadata } from "next";
import { Suspense } from "react";
import { getHomepage, getFAQs, getNavigation } from "@/lib/prismic";
import { generateHomeMetadata } from "@/lib/metadata";
import {
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateFAQSchema,
} from "@/lib/schema";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";

// ─── Metadata (dynamic from Prismic) ─────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  return generateHomeMetadata(homepage);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

export default async function Home() {
  console.log("process.env.PRISMIC_WEBHOOK_SECRET", process.env.PRISMIC_WEBHOOK_SECRET);
  const [homepage, faqs, nav] = await Promise.all([
    getHomepage(),
    getFAQs(),
    getNavigation(),
  ]);

  console.log("homepage", homepage);
  console.log("faqs", faqs);



  const jsonLd = [
    generateWebSiteSchema(),
    generateOrganizationSchema(),
    generateFAQSchema(faqs),
  ];

  return (
    <>
      {/* JSON-LD structured data */}
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Nav nav={nav} />

      <main>
        <Suspense>
          {/* Automatically resolve the array of 4 slices sequentially */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <SliceZone slices={homepage.data.slices as any} components={components} />
        </Suspense>

        {/* Retain these because they explicitly don't exist inside your Prismic document yet */}
        <FAQSection faqs={faqs} />
        <CTASection homepage={homepage} />
      </main>

      <Footer nav={nav} />
    </>
  );
}