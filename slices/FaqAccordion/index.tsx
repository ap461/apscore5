import { FC } from "react";
import { PrismicRichText } from "@prismicio/react";

const FaqAccordion: FC<any> = ({ slice }) => {
  const items =
    slice.primary?.faq_items ||
    slice.primary?.items ||
    slice.items ||
    [];

  const eyebrow = typeof slice.primary?.eyebrow === "string" ? slice.primary.eyebrow : null;
  const headline = typeof slice.primary?.headline === "string" ? slice.primary.headline : null;
  const lede = typeof slice.primary?.lede === "string" ? slice.primary.lede : null;

  return (
    <section className="faq-accordion py-12" data-slice-type={slice.slice_type}>
      <div className="container">
        {eyebrow && (<p className="eyebrow" style={{ textAlign: "center" }}>{eyebrow}</p>)}
        {headline && (<h2 style={{ textAlign: "center", marginBottom: "0.5em" }}>{headline}</h2>)}
        {lede && (<p style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 2em", color: "#555" }}>{lede}</p>)}

        {items.length > 0 && (
          <div style={{ maxWidth: "820px", margin: "0 auto" }}>
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
