import FAQItemComponent from "@/components/ui/FAQItem";
import type { FAQItem } from "@/types/index";

interface FAQSectionProps {
  faqs: FAQItem[];
}

/**
 * Server component wrapper — FAQ section.
 * Each accordion item is a client component island (FAQItem).
 * Uses microdata itemScope for schema.org/FAQPage.
 */
export default function FAQSection({ faqs }: FAQSectionProps) {
  return (
    <section id="faq" aria-labelledby="faq-heading">
      <div className="container">
        <p className="kicker">Student Questions</p>
        <h2 id="faq-heading">Questions students actually search for.</h2>
        <p className="sdesc">
          We know you have lots of questions about AP Exams. Here are answers to
          some of the most frequent ones students ask.
        </p>

        <div
          className="faq-wrap"
          itemScope
          itemType="https://schema.org/FAQPage"
          role="list"
          aria-label="Frequently asked questions"
        >
          {faqs.map((faq, i) => (
            <div key={`${faq.order}-${i}`} role="listitem">
              <FAQItemComponent faq={faq} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
