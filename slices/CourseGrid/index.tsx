import { FC } from "react";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";

type Course = {
  course_link: unknown;
  course_icon: unknown;
  course_name?: string;
  course_description?: string;
};

type CourseGridSlice = {
  slice_type: string;
  primary?: {
    eyebrow?: string;
    headline?: unknown;
    lede?: unknown;
    courses?: Course[];
  };
};

const CourseGrid: FC<{ slice: CourseGridSlice }> = ({ slice }) => {
  return (
    <section data-slice-type={slice.slice_type}>
      <div className="container">
        {slice.primary?.eyebrow && (
          <div className="kicker">{slice.primary.eyebrow}</div>
        )}
        <PrismicRichText field={slice.primary?.headline as never} />
        <PrismicRichText
          field={slice.primary?.lede as never}
          components={{
            paragraph: ({ children }) => <p className="sdesc">{children}</p>,
          }}
        />

        <div className="grid3" role="list">
          {slice.primary?.courses?.map((item, i) => (
            <PrismicNextLink
              key={i}
              field={item.course_link as never}
              className="ccard"
              role="listitem"
            >
              <div className="ctop2">
                <div className="icon" aria-hidden="true">
                  <PrismicNextImage field={item.course_icon as never} fallbackAlt="" />
                </div>
              </div>
              <h3>{item.course_name}</h3>
              <p>{item.course_description}</p>
              <span className="clink">Explore course →</span>
            </PrismicNextLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseGrid;
