import { FC } from "react";
import { PrismicRichText } from "@prismicio/react";

const WhyApMatters: FC<any> = ({ slice }) => {
  const columns = slice.primary?.columns || 2;
  const gridClass = columns === 2 ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "grid grid-cols-1 gap-8";

  return (
    <section className="why-ap-matters py-16" data-slice-type={slice.slice_type}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-10">
          {slice.primary?.eyebrow && (
            <p className="eyebrow">{slice.primary.eyebrow}</p>
          )}
          <PrismicRichText field={slice.primary?.headline} />
        </div>
        <div className={gridClass}>
          <PrismicRichText
            field={slice.primary?.body}
            components={{
              paragraph: ({ children }) => <p className="mb-4 text-base leading-relaxed">{children}</p>,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default WhyApMatters;
