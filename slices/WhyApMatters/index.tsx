import { FC } from "react";
import { PrismicRichText } from "@prismicio/react";

const WhyApMatters: FC<{ slice: { slice_type: string; primary?: Record<string, unknown> } }> = ({ slice }) => {
  return (
    <section data-slice-type={slice.slice_type}>
      <div className="container">
        {slice.primary?.eyebrow ? (
          <div className="kicker">{String(slice.primary.eyebrow)}</div>
        ) : null}
        <PrismicRichText
          field={slice.primary?.headline as never}
          components={{ heading1: ({ children }) => <h2>{children}</h2> }}
        />
        <PrismicRichText
          field={slice.primary?.body as never}
          components={{
            paragraph: ({ children }) => (
              <p className="sdesc" style={{ maxWidth: "720px", marginBottom: "14px" }}>
                {children}
              </p>
            ),
            strong: ({ children }) => <strong>{children}</strong>,
          }}
        />
      </div>
    </section>
  );
};

export default WhyApMatters;
