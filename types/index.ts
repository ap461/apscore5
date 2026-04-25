/**
 * Shared application-level types (not Prismic-specific).
 */

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface QuizQuestion {
  /** The question text */
  q: string;
  /** Array of 4 answer options */
  opts: [string, string, string, string];
  /** Zero-based index of the correct answer */
  ans: number;
  /** Explanation shown after answering */
  exp: string;
  /** Subject tag shown at top of the card, e.g. "AP Biology · Unit 1" */
  tag: string;
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
  order: number;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface StatItem {
  value: string;
  label: string;
}

// ─── Trust ────────────────────────────────────────────────────────────────────

export interface TrustItem {
  label: string;
  value: string;
}

// ─── Nav Link ─────────────────────────────────────────────────────────────────

export interface NavLink {
  label: string;
  url: string;
}

// ─── Course ──────────────────────────────────────────────────────────────────

export interface Course {
  uid: string;
  title: string;
  description: string;
  icon: string;
  questionCount: string;
  urlPath: string;
  order: number;
}
