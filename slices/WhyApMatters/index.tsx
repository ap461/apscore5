import { FC } from "react";
import { PrismicRichText } from "@prismicio/react";

const WhyApMatters: FC<any> = ({ slice }) => {
  return (
    <section className="why-ap-matters py-12" data-slice-type={slice.slice_type}>
      <div className="container">
        <p className="eyebrow">{slice.primary?.eyebrow}</p>
        <PrismicRichText field={slice.primary?.headline} />
        <div className="space-y-4">
          <PrismicRichText field={slice.primary?.body} />
        </div>
      </div>
    </section>
  );
};

export default WhyApMatters;
