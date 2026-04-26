import { FC } from "react";
import { PrismicRichText } from "@prismicio/react";

const FaqAccordion: FC<any> = ({ slice }) => {
  let items: any[] = [];

  if (Array.isArray(slice.items) && slice.items.length > 0) {
    items = slice.items;
  } else if (slice.primary && typeof slice.primary === "object") {
    for (const key of Object.keys(slice.primary)) {
      const val = slice.primary[key];
      if (!Array.isArray(val) || val.length === 0) continue;
      const first = val[0];
      if (typeof first !== "object" || first === null) continue;
      if ("type" in first && typeof first.type === "string" && ("spans" in first || "text" in first)) continue;
      items = val;
      break;
    }
  }

  return (
    <section className="faq-accordion py-12" data-slice-type={slice.slice_type}>
      <div className="container">
        {slice.primary?.eyebrow && (<p className="eyebrow">{slice.primary.eyebrow}</p>)}
        <PrismicRichText field={slice.primary?.headline} />
        <div style={{ marginBottom: "2em", color: "#555" }}><PrismicRichText field={slice.primary?.lede} /></div>

        {items.length > 0 && (
          <div>
            {items.map((item: any, i: number) => (
              <details key={i} open={item.open_by_default} style={{ borderBottom: "1px solid #e5e5e5", padding: "1.25em 0" }}>
                <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "1.1em", lineHeight: 1.4 }}>
                  {item.category_label && (
                    <span style={{ display: "inline-block", fontSize: "0.7em", color: "#555", textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "0.75em", fontWeight: 600, padding: "0.2em 0.6em", backgroundColor: "#f0f0f0", borderRadius: "4px", verticalAlign: "middle" }}>{item.category_label}</span>
                  )}
                  {item.question}
                </summary>
                <div style={{ marginTop: "1em", color: "#333", lineHeight: 1.6 }}>
                  <PrismicRichText field={item.answer} components={{ paragraph: ({ children }) => <p style={{ marginBottom: "0.75em" }}>{children}</p> }} />
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
