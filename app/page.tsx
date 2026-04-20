import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { Metadata } from "next";

const client = createClient();

export async function generateMetadata(): Promise<Metadata> {
  const page = await client.getSingle("homepage");
  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: page.data.og_image?.url || "" }],
    },
    alternates: {
      canonical: "https://apscore5.com/",
    },
  };
}

export default async function Home() {
  const page = await client.getSingle("homepage");
  return <SliceZone slices={page.data.slices} components={components} />;
}