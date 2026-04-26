import { FC } from "react";
import { PrismicRichText } from "@prismicio/react";

const CoursesHubHero: FC<{ slice: { slice_type: string; primary?: Record<string, unknown> } }> = ({ slice }) => {
  return (
    <section data-slice-type={slice.slice_type}>
      <div className="container" style={{ textAlign: "center" }}>
        {slice.primary?.eyebrow ? (
          <div className="kicker">{String(slice.primary.eyebrow)}</div>
        ) : null}
        <PrismicRichText field={slice.primary?.headline as never} />
        <PrismicRichText
          field={slice.primary?.subheadline as never}
          components={{
            paragraph: ({ children }) => (
              <p className="sdesc" style={{ margin: "0 auto 22px" }}>
                {children}
              </p>
            ),
          }}
        />
      </div>
    </section>
  );
};

export default CoursesHubHero;
