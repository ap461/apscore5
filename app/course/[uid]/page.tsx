import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone } from "@prismicio/react";
import { asLink } from "@prismicio/client";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page(props: PageProps<"/course/[uid]">) {
  const { uid } = await props.params;
  const client = createClient();
  const page = await client
    .getByUID("course_pillar_page", uid)
    .catch(() => null);

  if (!page) notFound();

  return <SliceZone slices={page.data.slices} components={components} />;
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

  return {
    title: data.meta_title || undefined,
    description: data.meta_description || undefined,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: data.meta_title || undefined,
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
