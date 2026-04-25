import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicNextImage } from "@prismicio/next";

export type CoursesGridProps = SliceComponentProps<Content.CoursesGridSlice>;

/**
 * Server component — AP courses grid section slice.
 */
const CoursesGrid: FC<CoursesGridProps> = ({ slice }) => {
  const d = slice.primary;

  return (
    <section aria-labelledby="courses-heading" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="container">
        {/* The section heading is configured to be a single RichText field that likely outputs an <h2> based on semantic Prismic config */}
        <PrismicRichText field={d.section_heading} />
        
        <div className="grid3" role="list" aria-label="AP Courses">
          {d.courses?.map((item, i) => (
            <div key={i} role="listitem">
              <PrismicNextLink field={item.course_link} className="ccard">
                <div className="ctop2">
                  <div className="icon" aria-hidden="true">
                    {/* If icon is an image field via Slice configuration */}
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

export default CoursesGrid;