import { FC } from "react";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";

const CourseGrid: FC<any> = ({ slice }) => {
  return (
    <section className="course-grid py-12" data-slice-type={slice.slice_type}>
      <div className="container">
        <p className="kicker">{slice.primary?.eyebrow}</p>
        <PrismicRichText field={slice.primary?.headline} />
        <PrismicRichText field={slice.primary?.lede} />
        
        <div className="grid3" role="list">
          {slice.primary?.courses?.map((item: any, i: number) => (
            <div key={i} role="listitem">
              <PrismicNextLink field={item.course_link} className="ccard">
                <div className="ctop2">
                  <div className="icon" aria-hidden="true">
                    <PrismicNextImage field={item.course_icon} fallbackAlt="" />
                  </div>
                </div>
                <h3>{item.course_name}</h3>
                <p>{item.course_description}</p>
                <span className="clink">Explore course →</span>
              </PrismicNextLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseGrid;
