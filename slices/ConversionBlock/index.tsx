import { FC } from "react";
import { PrismicRichText } from "@prismicio/react";

const ConversionBlock: FC<any> = ({ slice }) => {
  return (
    <section className="conversion-block py-12 bg-gray-50" data-slice-type={slice.slice_type}>
      <div className="container" style={{ textAlign: "center" }}>
        <PrismicRichText field={slice.primary?.headline} />
        <PrismicRichText field={slice.primary?.subcopy} />

        {slice.primary?.cta_link?.url && slice.primary?.cta_text && (
          <a href={slice.primary.cta_link.url} className="btn btn-p" style={{ marginTop: "1em", display: "inline-block" }}>{slice.primary.cta_text}</a>
        )}

        {slice.primary?.footnote && (
          <p style={{ fontSize: "0.875em", color: "#666", marginTop: "0.75em" }}>{slice.primary.footnote}</p>
        )}

        {slice.items && slice.items.length > 0 && (
          <div style={{ marginTop: "3em", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2em", textAlign: "left" }}>
            {slice.items.map((item: any, i: number) => (
              <div key={i}>
                <div style={{ fontSize: "2.5em", marginBottom: "0.25em" }}>{item.benefit_icon}</div>
                <h3 style={{ marginBottom: "0.25em" }}>{item.benefit_title}</h3>
                <p>{item.benefit_description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ConversionBlock;
