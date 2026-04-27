import { createClient } from "@/prismicio";
import type {
  HomepageDocument,
  CoursesHubPageDocument,
  FAQDocument,
  NavigationDocument,
} from "@/types/prismic";
import type { FAQItem, NavLink } from "@/types/index";

// ─── ISR Revalidation ─────────────────────────────────────────────────────────

const REVALIDATE = 10; // 1 hour

// ─── Fallback Data ────────────────────────────────────────────────────────────

const FALLBACK_HOMEPAGE: HomepageDocument = {
  id: "fallback",
  uid: null,
  type: "homepage",
  href: "",
  url: "/",
  lang: "en-us",
  alternate_languages: [],
  first_publication_date: "",
  last_publication_date: "",
  slugs: [],
  linked_documents: [],
  tags: [],
  data: {
    meta_title: "AP Test Practice — Free AP Exam Prep | APScore5",
    meta_description:
      "Free AP practice questions for AP Biology, AP Human Geography, and AP CSP. Study 5 minutes a day, find your blind spots, and score a 5. No signup required.",
    og_image: { dimensions: null, alt: null, copyright: null, url: null },
    hero_eyebrow: "Free AP Exam Prep — No Signup Required",
    hero_headline: [],
    hero_subheadline: [],
    hero_cta_primary_text: "Create a free account",
    hero_cta_primary_url: { link_type: "Web", url: "/signup" },
    hero_cta_secondary_text: "Browse AP Courses",
    hero_cta_secondary_url: { link_type: "Web", url: "/courses" },
    hero_note: "✓ Free forever · ✓ No credit card · ✓ Start in 30 seconds",
    trust_items: [
      { value: "12,000+", label: "AP Practice Questions" },
      { value: "3 Courses", label: "Biology · HUG · CSP" },
      { value: "5 min/day", label: "Built for busy students" },
      { value: "Free", label: "No credit card needed" },
    ],
    stats: [
      { value: "12,000+", label: "AP Practice Questions" },
      { value: "3", label: "Live AP Courses" },
      { value: "5 min", label: "Daily Sessions" },
      { value: "Free", label: "No Credit Card" },
    ],
    courses_kicker: "AP Courses",
    courses_headline: "Choose your AP course and start today.",
    courses_description:
      "Each course is broken into unit pages, quizzes, and study guides so students can build understanding one concept at a time.",
    cta_kicker: "Start Free",
    cta_headline: [],
    cta_body: [],
    cta_points: [
      { text: "✓ Start before signup friction appears" },
      { text: "✓ Explore courses, units, quizzes, and FAQs" },
      { text: "✓ Save progress when you care about it" },
      { text: "✓ Free forever — no credit card required" },
    ],
    cta_primary_text: "Try a free question →",
    cta_primary_url: { link_type: "Web", url: "/practice" },
    cta_secondary_text: "Read AP exam FAQ",
    cta_secondary_url: { link_type: "Web", url: "/#faq" },
    newsletter_headline: "Get a free AP question every day.",
    newsletter_body:
      "One question. One clear explanation. Daily practice that compounds over time.",
  },
} as unknown as HomepageDocument;


const FALLBACK_FAQS: FAQItem[] = [
  {
    question: "How are AP tests scored?",
    answer:
      "AP exams are scored on a 1-5 scale. A 5 signals college-level mastery. Raw scores from multiple-choice and free-response sections are combined using a formula that varies by exam. Most colleges grant credit for scores of 3, 4, or 5.",
    order: 1,
  },
  {
    question: "How long is an AP test?",
    answer:
      "Most AP exams run between 2 and 3.5 hours. AP Biology is about 3 hours, AP Human Geography is around 2 hours 15 minutes, and AP CSP is about 2 hours.",
    order: 2,
  },
  {
    question: "When are AP test scores released?",
    answer:
      "AP scores are typically released in mid-July, about two months after the exam window. You can view scores through the College Board online score portal.",
    order: 3,
  },
  {
    question: "Can AP tests be retaken?",
    answer:
      "Yes. Students can retake any AP exam in a subsequent year. You cannot retake the same exam in the same year. If you score higher, you control which scores are reported to colleges.",
    order: 4,
  },
  {
    question: "How many AP exams are there?",
    answer:
      "The College Board currently offers 38 AP courses and exams across sciences, social sciences, math, English, history, world languages, and the arts.",
    order: 5,
  },
  {
    question: "Do AP test scores matter for college?",
    answer:
      "Yes. Strong AP scores (3-5) can earn college credit or placement out of introductory courses, saving tuition and time.",
    order: 6,
  },
  {
    question: "Which AP test is the hardest?",
    answer:
      "AP Physics C, AP Chemistry, and AP Calculus BC consistently have the lowest 5-rates. Difficulty depends on your strengths and preparation.",
    order: 7,
  },
  {
    question: "What is the easiest AP exam?",
    answer:
      "AP Human Geography, AP Computer Science Principles, and AP Environmental Science are often cited as most accessible for first-time AP students.",
    order: 8,
  },
];

const FALLBACK_NAVIGATION = {
  navLinks: [
    { label: "AP Courses", url: "/courses" },
    { label: "Practice", url: "/practice" },
    { label: "Daily Questions", url: "/daily" },
    { label: "Progress", url: "/dashboard" },
    { label: "Pricing", url: "/pricing" },
  ] satisfies NavLink[],
  footerCourses: [
    { label: "AP Biology", url: "/ap-biology" },
    { label: "AP Human Geography", url: "/ap-human-geography" },
    { label: "AP Computer Science Principles", url: "/ap-computer-science-principles" },
  ] satisfies NavLink[],
  footerSite: [
    { label: "How it Works", url: "/courses" },
    { label: "Practice Sets", url: "/practice" },
    { label: "Pricing", url: "/pricing" },
    { label: "Dashboard", url: "/dashboard" },
  ] satisfies NavLink[],
  footerCompany: [
    { label: "About", url: "/about" },
    { label: "Privacy Policy", url: "/privacy" },
    { label: "Terms of Use", url: "/terms" },
    { label: "Contact", url: "/contact" },
  ] satisfies NavLink[],
  footerTagline:
    "AP practice questions, unit quizzes, and exam prep designed to help students build confidence one session at a time.",
  footerDisclaimer:
    "AP® is a trademark of the College Board, which is not affiliated with APScore5.",
};

// ─── Return Types ─────────────────────────────────────────────────────────────

export type GetHomepageReturn = HomepageDocument;
export type GetCoursesHubPageReturn = CoursesHubPageDocument;
export type GetFAQsReturn = FAQItem[];
export type GetNavigationReturn = typeof FALLBACK_NAVIGATION;

// ─── Fetch Functions ──────────────────────────────────────────────────────────

/**
 * Fetches the homepage single-type document from Prismic.
 * Falls back to static data if Prismic is unreachable.
 */
export async function getHomepage(): Promise<GetHomepageReturn> {
  try {
    const client = createClient({
      fetchOptions: { next: { revalidate: REVALIDATE } },
    });
    const doc = (await client.getSingle("homepage")) as unknown as HomepageDocument;
    return doc;
  } catch (error) {
    console.error("[prismic] getHomepage failed — using fallback:", error);
    return FALLBACK_HOMEPAGE;
  }
}

/**
 * Fetches the courses_hub_page single-type document from Prismic.
 */
export async function getCoursesHubPage(): Promise<GetCoursesHubPageReturn> {
  try {
    const client = createClient({
      fetchOptions: { next: { revalidate: REVALIDATE } },
    });
    // In some repositories, this is a singleton, or we grab the first one if it's repeatable.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docs = await client.getAllByType("courses_hub_page" as any);
    if (docs.length === 0) {
      throw new Error("No courses_hub_page found");
    }
    return docs[0] as unknown as CoursesHubPageDocument;
  } catch (error) {
    console.error("[prismic] getCoursesHubPage failed:", error);
    // Returning a dummy fallback document structure so the page doesn't fatally crash
    return {
      uid: "courses",
      data: { slices: [] },
    } as unknown as CoursesHubPageDocument;
  }
}

/**
 * Fetches all FAQ items sorted by their `order` field.
 * Falls back to static data if Prismic is unreachable.
 */
export async function getFAQs(): Promise<GetFAQsReturn> {
  try {
    const client = createClient({
      fetchOptions: { next: { revalidate: REVALIDATE } },
    });
    const docs = (await client.getAllByType("faq_block", {
      orderings: [{ field: "my.faq_block.order", direction: "asc" }],
    })) as unknown as FAQDocument[];
    return docs.map((doc) => ({
      question: doc.data.question ?? "",
      answer: doc.data.answer
        ? doc.data.answer
          .map((block: { text?: string }) => block.text ?? "")
          .join(" ")
        : "",
      order: doc.data.order ?? 0,
    }));
  } catch (error) {
    console.error("[prismic] getFAQs failed — using fallback:", error);
    return FALLBACK_FAQS;
  }
}

/**
 * Fetches the navigation single-type document and normalises it.
 * Falls back to static data if Prismic is unreachable.
 */
export async function getNavigation(): Promise<GetNavigationReturn> {
  try {
    const client = createClient({
      fetchOptions: { next: { revalidate: REVALIDATE } },
    });
    const doc = (await client.getSingle(
      "navigation" as Parameters<typeof client.getSingle>[0]
    )) as unknown as NavigationDocument;
    const toLinks = (
      group: Array<{ label: string | null; url: string | null }>
    ): NavLink[] =>
      group.map(({ label, url }) => ({
        label: label ?? "",
        url: url ?? "/",
      }));

    return {
      navLinks: toLinks(
        doc.data.nav_links as Array<{ label: string | null; url: string | null }>
      ),
      footerCourses: toLinks(
        doc.data.footer_courses as Array<{ label: string | null; url: string | null }>
      ),
      footerSite: toLinks(
        doc.data.footer_site as Array<{ label: string | null; url: string | null }>
      ),
      footerCompany: toLinks(
        doc.data.footer_company as Array<{ label: string | null; url: string | null }>
      ),
      footerTagline: doc.data.footer_tagline ?? FALLBACK_NAVIGATION.footerTagline,
      footerDisclaimer: doc.data.footer_disclaimer ?? FALLBACK_NAVIGATION.footerDisclaimer,
    };
  } catch (error) {
    console.error("[prismic] getNavigation failed — using fallback:", error);
    return FALLBACK_NAVIGATION;
  }
}
