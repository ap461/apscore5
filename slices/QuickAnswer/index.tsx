import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

export type QuickAnswerProps = SliceComponentProps<Content.QuickAnswerSlice>;

function richTextToPlain(field: unknown): string {
  if (!Array.isArray(field)) return "";
  return field
    .map((block) => {
      if (block && typeof block === "object" && "text" in block) {
        const t = (block as { text?: unknown }).text;
        return typeof t === "string" ? t : "";
      }
      return "";
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

const QuickAnswer: FC<QuickAnswerProps> = ({ slice }) => {
  const question = slice.primary?.question ?? "";
  const directAnswerPlain = richTextToPlain(slice.primary?.direct_answer);

  const qaPageSchema =
    question && directAnswerPlain
      ? {
          "@context": "https://schema.org",
          "@type": "QAPage",
          mainEntity: {
            "@type": "Question",
            name: question,
            acceptedAnswer: {
              "@type": "Answer",
              text: directAnswerPlain,
            },
          },
        }
      : null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {qaPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(qaPageSchema).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <div className="container">
        <div className="quick-answer">
          {slice.primary?.eyebrow && (
            <div className="kicker">{slice.primary.eyebrow}</div>
          )}
          {question && <h2>{question}</h2>}
          <PrismicRichText
            field={slice.primary?.direct_answer}
            components={{
              paragraph: ({ children }) => (
                <p className="quick-answer-direct">{children}</p>
              ),
              strong: ({ children }) => <strong>{children}</strong>,
            }}
          />
          <PrismicRichText
            field={slice.primary?.expansion}
            components={{
              paragraph: ({ children }) => <p className="sdesc">{children}</p>,
              strong: ({ children }) => <strong>{children}</strong>,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default QuickAnswer;
