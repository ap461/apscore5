import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

export type CoursesGridProps = SliceComponentProps<Content.CoursesGridSlice>;

const CoursesGrid: FC<CoursesGridProps> = ({ slice }) => {
  const courses = slice.primary.courses as Array<{ course_name: string; course_description: string; course_link: never; }>;
  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="container">
        <div className="kicker">AP Courses</div>
        <PrismicRichText field={slice.primary.section_heading} />
        <div className="grid3">
          {courses?.map((item, i) => (
            <div className="ccard" key={i}>
              <h3>{item.course_name}</h3>
              <p>{item.course_description}</p>
              <PrismicNextLink field={item.course_link} className="clink">Explore course →</PrismicNextLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesGrid;