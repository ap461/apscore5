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
  const items = slice.items ?? [];

  return (
    <section data-slice-type={slice.slice_type}>
      <div className="container">
        <div className="cta-card">
          <div className="cta-card-head">
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
                paragraph: ({ children }) => <p className="sdesc">{children}</p>,
              }}
            />
            {slice.primary?.cta_link?.url && slice.primary?.cta_text && (
              <a href={slice.primary.cta_link.url} className="btn btn-p">
                {slice.primary.cta_text}
              </a>
            )}
            {slice.primary?.footnote && (
              <p className="note">{slice.primary.footnote}</p>
            )}
          </div>

          {items.length > 0 && (
            <div className="cta-benefits">
              {items.map((item, i) => (
                <div key={i} className="cta-benefit">
                  <div className="icon" aria-hidden="true">
                    {item.benefit_icon}
                  </div>
                  <h3>{item.benefit_title}</h3>
                  <p>{item.benefit_description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ConversionBlock;
