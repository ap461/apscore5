import { FC } from "react";
import { PrismicRichText } from "@prismicio/react";

type Benefit = {
  benefit_icon?: string;
  benefit_title?: string;
  benefit_description?: string;
};

type ConversionBlockSlice = {
  slice_type: string;
  primary?: {
    headline?: unknown;
    subcopy?: unknown;
    cta_link?: { url?: string };
    cta_text?: string;
    footnote?: string;
  };
  items?: Benefit[];
};

const ConversionBlock: FC<{ slice: ConversionBlockSlice }> = ({ slice }) => {
  return (
    <section data-slice-type={slice.slice_type}>
      <div className="container" style={{ textAlign: "center" }}>
        <PrismicRichText
          field={slice.primary?.headline as never}
          components={{
            heading1: ({ children }) => <h2>{children}</h2>,
            heading2: ({ children }) => <h2>{children}</h2>,
          }}
        />
        <PrismicRichText
          field={slice.primary?.subcopy as never}
          components={{
            paragraph: ({ children }) => (
              <p className="sdesc" style={{ margin: "0 auto 22px" }}>
                {children}
              </p>
            ),
          }}
        />

        {slice.primary?.cta_link?.url && slice.primary?.cta_text && (
          <a href={slice.primary.cta_link.url} className="btn btn-p">
            {slice.primary.cta_text}
          </a>
        )}
        {slice.primary?.footnote && (
          <p className="note" style={{ marginTop: "12px" }}>
            {slice.primary.footnote}
          </p>
        )}

        {slice.items && slice.items.length > 0 && (
          <div className="grid4" style={{ marginTop: "36px", textAlign: "left" }}>
            {slice.items.map((item, i) => (
              <div key={i}>
                <div
                  className="icon"
                  aria-hidden="true"
                  style={{ fontSize: "24px" }}
                >
                  {item.benefit_icon}
                </div>
                <h3 style={{ margin: "10px 0 4px" }}>{item.benefit_title}</h3>
                <p className="sdesc" style={{ margin: 0 }}>
                  {item.benefit_description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ConversionBlock;
