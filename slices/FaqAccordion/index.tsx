import { FC } from "react";
import { PrismicRichText } from "@prismicio/react";

type FaqItem = {
  question?: string;
  answer?: unknown;
  category_label?: string;
  open_by_default?: boolean;
};

type FaqAccordionSlice = {
  slice_type: string;
  primary?: Record<string, unknown>;
  items?: FaqItem[];
};

const FaqAccordion: FC<{ slice: FaqAccordionSlice }> = ({ slice }) => {
  let items: FaqItem[] = [];

  if (Array.isArray(slice.items) && slice.items.length > 0) {
    items = slice.items;
  } else if (slice.primary && typeof slice.primary === "object") {
    for (const key of Object.keys(slice.primary)) {
      const val = (slice.primary as Record<string, unknown>)[key];
      if (!Array.isArray(val) || val.length === 0) continue;
      const first = val[0];
      if (typeof first !== "object" || first === null) continue;
      if (
        "type" in first &&
        typeof (first as { type?: unknown }).type === "string" &&
        ("spans" in first || "text" in first)
      )
        continue;
      items = val as FaqItem[];
      break;
    }
  }

  return (
    <section className="faq-light" id="faq" data-slice-type={slice.slice_type}>
      <div className="container">
        {slice.primary?.eyebrow ? (
          <div className="kicker">{String(slice.primary.eyebrow)}</div>
        ) : null}
        <PrismicRichText
          field={slice.primary?.headline as never}
          components={{
            heading1: ({ children }) => <h2>{children}</h2>,
            heading2: ({ children }) => <h2>{children}</h2>,
          }}
        />
        <PrismicRichText
          field={slice.primary?.lede as never}
          components={{
            paragraph: ({ children }) => <p className="sdesc">{children}</p>,
          }}
        />

        {items.length > 0 && (
          <div className="faq-wrap">
            {items.map((item, i) => (
              <details key={i} className="fi" open={item.open_by_default}>
                <summary className="fiq">
                  <span className="fiq-text">
                    {item.category_label && (
                      <span className="tag" style={{ marginRight: "10px" }}>
                        {item.category_label}
                      </span>
                    )}
                    {item.question}
                  </span>
                  <span className="arr" aria-hidden="true">
                    ▾
                  </span>
                </summary>
                <div className="fia">
                  <PrismicRichText field={item.answer as never} />
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FaqAccordion;
