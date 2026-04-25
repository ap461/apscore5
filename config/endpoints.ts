/**
 * All hardcoded URLs and paths for the application.
 * Never write URL strings directly in components — always import from here.
 */

// ─── Site Routes ──────────────────────────────────────────────────────────────

export const SITE_ROUTES = {
  home: "/",
  courses: "/courses",
  practice: "/practice",
  daily: "/daily",
  dashboard: "/dashboard",
  pricing: "/pricing",
  login: "/login",
  signup: "/signup",
  about: "/about",
  privacy: "/privacy",
  terms: "/terms",
  contact: "/contact",
  faq: "/#faq",
} as const;

// ─── Course Routes ─────────────────────────────────────────────────────────────

export const COURSE_ROUTES = {
  apBiology: "/ap-biology",
  apHumanGeography: "/ap-human-geography",
  apComputerSciencePrinciples: "/ap-computer-science-principles",
} as const;

// ─── External URLs ─────────────────────────────────────────────────────────────

export const EXTERNAL_URLS = {
  collegeBoard: "https://collegeboard.org",
  youtube: "https://www.youtube.com/@APScore5",
  tiktok: "https://www.tiktok.com/@apscore5",
} as const;

// ─── Image Paths ───────────────────────────────────────────────────────────────

export const IMAGE_PATHS = {
  logoLight: "/images/AP Score5 Light Background SVG.svg",
  logoDark: "/images/AP Score5 Dark Background SVG.svg",
  ogBanner: "/images/apscore5-og-banner.png",
} as const;

// ─── Canonical Site URL ────────────────────────────────────────────────────────
// Resolved at runtime so it works in both server and edge contexts.

export const CANONICAL_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://apscore5.com";

// ─── Image Absolute URLs ──────────────────────────────────────────────────────

export const IMAGE_URLS = {
  ogBanner: `${CANONICAL_SITE_URL}/images/apscore5-og-banner.png`,
  logoLight: `${CANONICAL_SITE_URL}/images/AP Score5 Light Background SVG.svg`,
} as const;

// ─── AdSense ──────────────────────────────────────────────────────────────────

export const ADSENSE = {
  publisherId: "ca-pub-4424361283304614",
  scriptSrc:
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4424361283304614",
} as const;

// ─── Prismic ──────────────────────────────────────────────────────────────────

export const PRISMIC = {
  toolbarSrc: `https://static.cdn.prismic.io/prismic.js?new=true&repo=${
    process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME ?? "apscore5"
  }`,
} as const;
