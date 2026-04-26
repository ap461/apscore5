import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

export type UnitCardsGridProps =
  SliceComponentProps<Content.UnitCardsGridSlice>;

function firstParagraphText(field: unknown): string {
  if (!Array.isArray(field)) return "";
  const block = field.find(
    (b) =>
      b &&
      typeof b === "object" &&
      "text" in b &&
      typeof (b as { text?: unknown }).text === "string",
  );
  if (!block) return "";
  return String((block as { text?: string }).text ?? "");
}

const UnitCardsGrid: FC<UnitCardsGridProps> = ({ slice }) => {
  const items = slice.items ?? [];
  const visibleItems = items.filter((i) => i.unit_title || i.unit_number);
  if (visibleItems.length === 0) return null;

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

        <div className="grid3">
          {visibleItems.map((item, i) => {
            const description =
              item.unit_tagline || firstParagraphText(item.overview);
            const ctaText = item.unit_cta_text || "Study this unit →";
            const inner = (
              <>
                {item.unit_number && (
                  <div className="unit-number">
                    <span>{item.unit_number}</span>
                    {item.unit_weight && (
                      <span className="unit-weight">{item.unit_weight}</span>
                    )}
                  </div>
                )}
                {item.unit_title && <h3>{item.unit_title}</h3>}
                {description && <p>{description}</p>}
                <span className="unit-cta">{ctaText}</span>
              </>
            );

            return item.unit_cta_link ? (
              <PrismicNextLink
                key={i}
                field={item.unit_cta_link}
                className="ccard unit-card"
              >
                {inner}
              </PrismicNextLink>
            ) : (
              <div key={i} className="ccard unit-card">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UnitCardsGrid;
