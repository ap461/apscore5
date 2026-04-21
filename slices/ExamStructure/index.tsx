import { FC } from "react";
import { SharedSlice, SharedSliceVariation } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

export type ExamStructureProps =
  SliceComponentProps<SharedSlice<'exam_structure', SharedSliceVariation<'default', any, any>>>;

const ExamStructure: FC<ExamStructureProps> = ({ slice }) => {
  // First 7 items = weight cards (one per unit), remaining = logistics cards
  const weightItems = slice.items.filter((i) => i.unit_label);
  const logisticsItems = slice.items.filter((i) => i.logistics_title);

  return (
    <section
      className="pad exam-section"
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

        <div className="exam-wrap">
          <div className="exam-format">
            <PrismicRichText field={slice.primary.format_description} />
          </div>

          {weightItems.length > 0 && (
            <>
              <h3 className="exam-subhead">
                {slice.primary.weights_heading ||
                  "Unit Weights — Where To Spend Your Study Time"}
              </h3>
              <div className="weight-grid">
                {weightItems.map((item, i) => (
                  <div className="weight-card" key={`w-${i}`}>
                    <div className="wc-unit">{item.unit_label}</div>
                    <div className="wc-pct">{item.unit_weight}</div>
                    <div className="wc-name">{item.unit_topic}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <h3 className="exam-subhead">
            {slice.primary.score_heading ||
              "How The 1–5 Score Is Calculated"}
          </h3>
          <div className="exam-score-copy">
            <PrismicRichText field={slice.primary.score_description} />
          </div>

          {logisticsItems.length > 0 && (
            <div className="logistics">
              {logisticsItems.map((item, i) => (
                <div className="log-card" key={`l-${i}`}>
                  <span className="log-icon">{item.logistics_icon}</span>
                  <div className="log-title">{item.logistics_title}</div>
                  <div className="log-val">{item.logistics_value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExamStructure;
