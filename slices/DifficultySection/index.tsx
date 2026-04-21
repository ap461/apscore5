import { FC } from "react";
import { SharedSlice, SharedSliceVariation } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

export type DifficultySectionProps =
  SliceComponentProps<SharedSlice<'difficulty_section', SharedSliceVariation<'default', any, any>>>;

const DifficultySection: FC<DifficultySectionProps> = ({ slice }) => {
  return (
    <section
      className="pad difficulty-section"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="container">
        {slice.primary.eyebrow && (
          <div className="sec-label">{slice.primary.eyebrow}</div>
        )}
        <PrismicRichText field={slice.primary.headline} />
        <div className="sec-copy">
          <PrismicRichText field={slice.primary.lede} />
        </div>

        <div className="hard-grid">
          <div className="hard-card harder">
            <h3>{slice.primary.harder_title || "What makes it harder"}</h3>
            <PrismicRichText field={slice.primary.harder_bullets} />
          </div>
          <div className="hard-card easier">
            <h3>{slice.primary.easier_title || "What makes it easier"}</h3>
            <PrismicRichText field={slice.primary.easier_bullets} />
          </div>
        </div>

        <div className="fit-grid">
          <div className="fit-card good">
            <h4>{slice.primary.fit_title || "Good fit if…"}</h4>
            <PrismicRichText field={slice.primary.fit_body} />
          </div>
          <div className="fit-card maybe">
            <h4>{slice.primary.maybe_title || "Maybe not yet if…"}</h4>
            <PrismicRichText field={slice.primary.maybe_body} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DifficultySection;
