import type { Metadata } from "next";
import { getCoursesHubPage, getNavigation } from "@/lib/prismic";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "AP Courses",
  description: "Browse our selection of free AP courses and start studying today.",
};

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
