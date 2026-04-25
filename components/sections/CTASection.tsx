import Link from "next/link";
import type { HomepageDocument } from "@/types/prismic";
import { SITE_ROUTES } from "@/config/endpoints";

interface CTASectionProps {
  homepage: HomepageDocument;
}

const DEFAULT_POINTS = [
  "✓ Start before signup friction appears",
  "✓ Explore courses, units, quizzes, and FAQs",
  "✓ Save progress when you care about it",
  "✓ Free forever — no credit card required",
];

/**
 * Server component — bottom CTA box.
 * All copy and links come from Prismic homepage document.
 */
export default function CTASection({ homepage }: CTASectionProps) {
  const d = homepage.data;

  const primaryUrl =
    (d.cta_primary_url as { url?: string })?.url ?? SITE_ROUTES.practice;
  const secondaryUrl =
    (d.cta_secondary_url as { url?: string })?.url ?? SITE_ROUTES.faq;

  const points =
    d.cta_points && d.cta_points.length > 0
      ? d.cta_points.map(
          (p: { text?: string | null }) => p.text ?? ""
        )
      : DEFAULT_POINTS;

  const bodyText =
    d.cta_body && d.cta_body.length > 0
      ? d.cta_body
          .map((block: { text?: string }) => block.text ?? "")
          .join(" ")
      : "Students don\u2019t need another overwhelming platform. They need a clean starting point and enough momentum to come back tomorrow.";

  return (
    <section aria-labelledby="cta-heading">
      <div className="container">
        <div className="cta-box">
          <div>
            {d.cta_kicker && <p className="kicker">{d.cta_kicker}</p>}

            <h2 id="cta-heading">
              {d.cta_headline && d.cta_headline.length > 0
                ? d.cta_headline
                    .map((block: { text?: string }) => block.text ?? "")
                    .join("")
                : "Give it 5 minutes a day.\u00A0Let the progress compound."}
            </h2>

            <p>{bodyText}</p>

            <div className="cta-btns">
              <Link href={primaryUrl} className="btn btn-p">
                {d.cta_primary_text ?? "Try a free question →"}
              </Link>
              <Link href={secondaryUrl} className="btn btn-s">
                {d.cta_secondary_text ?? "Read AP exam FAQ"}
              </Link>
            </div>
          </div>

          <div className="cpoints" aria-label="Key benefits">
            {points.map((point: string, i: number) => (
              <div key={i} className="cp">
                {point}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
