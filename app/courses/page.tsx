import type { Metadata } from "next";
import { getCoursesHubPage, getNavigation } from "@/lib/prismic";
import { generateCoursesHubMetadata } from "@/lib/metadata";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const coursesPage = await getCoursesHubPage();
  return generateCoursesHubMetadata(coursesPage);
}

export default async function CoursesPage() {
  const [coursesPage, nav] = await Promise.all([
    getCoursesHubPage(),
    getNavigation(),
  ]);

  return (
    <>
      <Nav nav={nav} />

      <main className="pt-24 pb-16">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <SliceZone slices={coursesPage.data.slices as any} components={components} />
      </main>

      <Footer nav={nav} />
    </>
  );
}
