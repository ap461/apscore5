import { FC } from "react";
import { Content, RichTextField } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

export type DifficultySectionProps =
  SliceComponentProps<Content.DifficultySectionSlice>;

type Card = {
  title: string | null;
  body: RichTextField;
  kind: "harder" | "easier" | "fit" | "maybe";
};

const hasContent = (card: Card) =>
  Boolean(card.title) || (Array.isArray(card.body) && card.body.length > 0);

const DifficultySection: FC<DifficultySectionProps> = ({ slice }) => {
  const cards: Card[] = [
    {
      title: slice.primary?.harder_title ?? null,
      body: slice.primary?.harder_bullets,
      kind: "harder",
    },
    {
      title: slice.primary?.easier_title ?? null,
      body: slice.primary?.easier_bullets,
      kind: "easier",
    },
    {
      title: slice.primary?.fit_title ?? null,
      body: slice.primary?.fit_body,
      kind: "fit",
    },
    {
      title: slice.primary?.maybe_title ?? null,
      body: slice.primary?.maybe_body,
      kind: "maybe",
    },
  ];

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="container">
        {slice.primary?.eyebrow && (
          <div className="kicker">{slice.primary.eyebrow}</div>
        )}
        <PrismicRichText
          field={slice.primary?.headline}
          components={{ heading2: ({ children }) => <h2>{children}</h2> }}
        />
        <PrismicRichText
          field={slice.primary?.lede}
          components={{
            paragraph: ({ children }) => <p className="sdesc">{children}</p>,
            strong: ({ children }) => <strong>{children}</strong>,
          }}
        />

        <div className="difficulty-grid">
          {cards.filter(hasContent).map((card, i) => (
            <div
              key={i}
              className={`difficulty-card difficulty-${card.kind}`}
            >
              {card.title && <h3>{card.title}</h3>}
              <PrismicRichText
                field={card.body}
                components={{
                  paragraph: ({ children }) => <p>{children}</p>,
                  listItem: ({ children }) => <li>{children}</li>,
                  strong: ({ children }) => <strong>{children}</strong>,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifficultySection;
