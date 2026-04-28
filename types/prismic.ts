import type {
  PrismicDocumentWithUID,
  AnyRegularField,
  GroupField,
  SliceZone,
  KeyTextField,
  RichTextField,
  ImageField,
  LinkField,
  NumberField,
  PrismicDocumentWithoutUID,
  BooleanField,
} from "@prismicio/client";

/**
 * Convenience alias — satisfies the PrismicDocument generic constraint
 * `Record<string, AnyRegularField | GroupField | SliceZone>`
 */
type PrismicField = AnyRegularField | GroupField | SliceZone;

// ─── Homepage (Single Type) ───────────────────────────────────────────────────

export interface HomepageDocumentData extends Record<string, PrismicField> {
  // SEO
  meta_title: KeyTextField;
  meta_description: KeyTextField;
  og_image: ImageField;

  // Hero
  hero_eyebrow: KeyTextField;
  hero_headline: RichTextField;
  hero_subheadline: RichTextField;
  hero_cta_primary_text: KeyTextField;
  hero_cta_primary_url: LinkField;
  hero_cta_secondary_text: KeyTextField;
  hero_cta_secondary_url: LinkField;
  hero_note: KeyTextField;

  // Trust items (shown in hero)
  trust_items: GroupField<{
    label: KeyTextField;
    value: KeyTextField;
  }>;

  // Stats bar
  stats: GroupField<{
    value: KeyTextField;
    label: KeyTextField;
  }>;

  // Courses section
  courses_kicker: KeyTextField;
  courses_headline: KeyTextField;
  courses_description: KeyTextField;

  // CTA section
  cta_kicker: KeyTextField;
  cta_headline: RichTextField;
  cta_body: RichTextField;
  cta_points: GroupField<{
    text: KeyTextField;
  }>;
  cta_primary_text: KeyTextField;
  cta_primary_url: LinkField;
  cta_secondary_text: KeyTextField;
  cta_secondary_url: LinkField;

  // Newsletter section
  newsletter_headline: KeyTextField;
  newsletter_body: KeyTextField;
}

export type HomepageDocument = PrismicDocumentWithoutUID<HomepageDocumentData, "homepage">;

// ─── Course (Repeatable) ──────────────────────────────────────────────────────

export interface CourseDocumentData extends Record<string, PrismicField> {
  title: KeyTextField;
  description: RichTextField;
  /** Emoji icon, e.g. "🧬" */
  icon: KeyTextField;
  /** Display string, e.g. "4,800 questions" */
  question_count: KeyTextField;
  /** URL path, e.g. "/ap-biology" */
  url_path: KeyTextField;
  /** Sort order (lower = first) */
  order: NumberField;
}

export type CourseDocument = PrismicDocumentWithUID<CourseDocumentData, "course">;

// ─── Courses Hub Page (Single Type) ────────────────────────────────────────────────

export interface CoursesHubPageDocumentData extends Record<string, PrismicField> {
  meta_title: KeyTextField;
  meta_description: KeyTextField;
  canonical_url: LinkField;
  no_index: BooleanField;
  og_image: ImageField;
  slices: SliceZone;
}

export type CoursesHubPageDocument = PrismicDocumentWithoutUID<CoursesHubPageDocumentData, "courses_hub_page">;

// ─── FAQ Item (Repeatable) ────────────────────────────────────────────────────

export interface FAQDocumentData extends Record<string, PrismicField> {
  question: KeyTextField;
  answer: RichTextField;
  order: NumberField;
}

export type FAQDocument = PrismicDocumentWithUID<FAQDocumentData, "faq_block">;

// ─── Navigation (Single Type) ─────────────────────────────────────────────────

export interface NavigationDocumentData extends Record<string, PrismicField> {
  nav_links: GroupField<{
    label: KeyTextField;
    url: KeyTextField;
  }>;
  footer_courses: GroupField<{
    label: KeyTextField;
    url: KeyTextField;
  }>;
  footer_site: GroupField<{
    label: KeyTextField;
    url: KeyTextField;
  }>;
  footer_company: GroupField<{
    label: KeyTextField;
    url: KeyTextField;
  }>;
  footer_tagline: KeyTextField;
  footer_disclaimer: KeyTextField;
}

export type NavigationDocument = PrismicDocumentWithoutUID<NavigationDocumentData, "navigation">;
