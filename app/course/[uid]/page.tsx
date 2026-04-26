import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { asLink } from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { getNavigation } from "@/lib/prismic";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import Banner from "@/components/Banner";
import StickyMobileCta from "@/components/StickyMobileCta";
import { CANONICAL_SITE_URL } from "@/config/endpoints";

const UNIT_NAMES_BY_UID: Record<string, string[]> = {
  "ap-human-geography": [
    "Thinking Geographically",
    "Population & Migration",
    "Cultural Patterns & Processes",
    "Political Patterns & Processes",
    "Agriculture & Rural Land Use",
    "Cities & Urban Land Use",
    "Industrial & Economic Development",
  ],
};

function jsonLd(payload: object): string {
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}

function ensureBrandSuffix(title: string): string {
  return title.endsWith(" | APScore5") ? title : `${title} | APScore5`;
}

function formatReviewedDate(value: string | null | undefined): string {
  const d = value ? new Date(value) : new Date();
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Page(props: PageProps<"/course/[uid]">) {
  const { uid } = await props.params;
  const client = createClient();
  const [page, nav] = await Promise.all([
    client.getByUID("course_pillar_page", uid).catch(() => null),
    getNavigation(),
  ]);

  if (!page) notFound();

  const data = page.data;
  // Normalize: editors sometimes paste " | APScore5" into course_name —
  // strip the brand suffix so breadcrumb / courseCode read cleanly.
  const courseName =
    (data.course_name ?? "").split(/\s*\|\s*/)[0].trim() || "Course";
  const canonicalUrl =
    asLink(data.canonical_url) ?? `${CANONICAL_SITE_URL}/course/${uid}`;
  const unitNames = UNIT_NAMES_BY_UID[uid] ?? [];
  const reviewedLabel = formatReviewedDate(data.last_reviewed);

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: courseName,
    description: data.meta_description || undefined,
    provider: {
      "@type": "Organization",
      name: "APScore5",
      sameAs: CANONICAL_SITE_URL,
    },
    courseCode: courseName,
    educationalLevel: "HighSchool",
    url: canonicalUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: CANONICAL_SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Courses",
        item: `${CANONICAL_SITE_URL}/courses`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: courseName,
        item: canonicalUrl,
      },
    ],
  };

  const itemListSchema =
    unitNames.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          numberOfItems: unitNames.length,
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          itemListElement: unitNames.map((name, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name,
          })),
        }
      : null;

  // Inject the meta bar between PillarHero and the rest of the slices.
  const slices = data.slices ?? [];
  const heroSlices = slices.filter((s) => s.slice_type === "pillar_hero");
  const restSlices = slices.filter((s) => s.slice_type !== "pillar_hero");

  return (
    <>
      <Nav nav={nav} />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(courseSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }}
        />
        {itemListSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd(itemListSchema) }}
          />
        )}

        <div className="container">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Courses", href: "/courses" },
              { label: courseName },
            ]}
          />
        </div>

        <Banner
          image={data.banner_image}
          fallbackAlt={`${courseName} — Complete course guide for the May 5, 2026 exam.`}
        />

        <SliceZone slices={heroSlices} components={components} />

        {reviewedLabel && (
          <div className="page-meta-bar">Last reviewed: {reviewedLabel}</div>
        )}

        <SliceZone slices={restSlices} components={components} />

        <StickyMobileCta hidden={false} />
      </main>
      <Footer nav={nav} />
    </>
  );
}

export async function generateMetadata(
  props: PageProps<"/course/[uid]">,
): Promise<Metadata> {
  const { uid } = await props.params;
  const client = createClient();
  const page = await client
    .getByUID("course_pillar_page", uid)
    .catch(() => null);

  if (!page) return {};

  const data = page.data;
  const canonical = asLink(data.canonical_url) ?? undefined;
  const ogImageUrl = data.og_image?.url ?? undefined;
  const titleAbsolute = data.meta_title
    ? ensureBrandSuffix(data.meta_title)
    : undefined;

  return {
    title: titleAbsolute ? { absolute: titleAbsolute } : undefined,
    description: data.meta_description || undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: titleAbsolute || undefined,
      description: data.meta_description || undefined,
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: data.og_image.dimensions?.width,
              height: data.og_image.dimensions?.height,
              alt: data.og_image.alt || undefined,
            },
          ]
        : undefined,
    },
    robots: data.no_index ? { index: false, follow: false } : undefined,
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("course_pillar_page");
  return pages.map((page) => ({ uid: page.uid }));
}
