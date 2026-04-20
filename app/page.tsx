import { Metadata } from "next";
import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";

const client = createClient();

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.getSingle("homepage");
  return {
    title: page.data.meta_title || "AP Test Practice — Free AP Exam Prep | APScore5",
    description: page.data.meta_description || "Free AP practice questions for AP Biology, AP Human Geography, and AP CSP.",
    openGraph: {
      title: page.data.meta_title || "AP Test Practice — Free AP Exam Prep | APScore5",
      description: page.data.meta_description || "Free AP practice questions.",
      images: page.data.og_image?.url ? [{ url: page.data.og_image.url, width: 1200, height: 628 }] : [],
      type: "website",
      url: "https://apscore5.com",
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: "https://apscore5.com/" },
  };
}

export default async function Home() {
  const page = await client.getSingle("homepage");
  return <SliceZone slices={page.data.slices} components={components} />;
}