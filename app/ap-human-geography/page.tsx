import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { asLink, isFilled } from "@prismicio/client";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

const PILLAR_UID = "ap-human-geography";
const SITE_URL = "https://apscore5.com";

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client
    .getByUID("course_pillar_page", PILLAR_UID)
    .catch(() => null);

  if (!page) {
    return {
      title: "AP Human Geography | APScore5",
      robots: { index: false, follow: false },
    };
  }

  const canonical =
    (isFilled.link(page.data.canonical_url) && asLink(page.data.canonical_url)) ||
    `${SITE_URL}/${PILLAR_UID}`;

  const title =
    page.data.meta_title ||
    "AP Human Geography Course Guide — Units, FRQ, Free Practice | APScore5";
  const description =
    page.data.meta_description ||
    "Plan smarter for AP Human Geography. Unit breakdowns, exam format, 70 free practice questions, and a 5-minute daily path to a 5.";

  return {
    title,
    description,
    robots: page.data.no_index
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: { canonical: canonical ?? undefined },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonical ?? undefined,
      siteName: "APScore5",
      locale: "en_US",
      images: isFilled.image(page.data.og_image)
        ? [
            {
              url: page.data.og_image.url ?? "",
              width: page.data.og_image.dimensions?.width ?? 1200,
              height: page.data.og_image.dimensions?.height ?? 628,
              alt: page.data.og_image.alt ?? title,
            },
          ]
        : [
            {
              url: `${SITE_URL}/images/apscore5-og-banner.png`,
              width: 1200,
              height: 628,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function Page() {
  const client = createClient();
  const page = await client
    .getByUID("course_pillar_page", PILLAR_UID)
    .catch(() => null);

  if (!page) notFound();

  // Schema.org Course + BreadcrumbList JSON-LD
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: page.data.course_name || "AP Human Geography",
    description:
      page.data.meta_description ||
      "Complete AP Human Geography course guide — seven units, exam prep, 1,250+ practice questions.",
    provider: {
      "@type": "Organization",
      name: "APScore5",
      url: SITE_URL,
    },
    educationalLevel: "High School",
    courseCode: page.data.course_name || "AP Human Geography",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT5H",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Courses",
        item: `${SITE_URL}/courses`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.data.course_name || "AP Human Geography",
        item: `${SITE_URL}/${PILLAR_UID}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <SliceZone slices={page.data.slices} components={components} />
    </>
  );
}
