import { FC } from "react";
import { PrismicRichText } from "@prismicio/react";
const CoursesHubHero: FC<any> = ({ slice }) => {
  return (
    <section className="courses-hub-hero navy-bg p-8 text-center text-white" data-slice-type={slice.slice_type}>
      <div className="container">
        <p className="eyebrow">{slice.primary?.eyebrow}</p>
        <PrismicRichText field={slice.primary?.headline} />
        <PrismicRichText field={slice.primary?.subheadline} />
      </div>
    </section>
  );
};
export default CoursesHubHero;
