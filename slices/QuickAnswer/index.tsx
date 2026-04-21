import { FC } from "react";
import { SharedSlice, SharedSliceVariation } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

export type QuickAnswerProps = SliceComponentProps<SharedSlice<'quick_answer', SharedSliceVariation<'default', any, any>>>;

const QuickAnswer: FC<QuickAnswerProps> = ({ slice }) => {
  return (
    <section
      className="pad"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="container">
        {slice.primary.eyebrow && (
          <div className="sec-label">{slice.primary.eyebrow}</div>
        )}
        <div className="aeo">
          {slice.primary.question && (
            <div className="aeo-q">{slice.primary.question}</div>
          )}
          <div className="aeo-a">
            <PrismicRichText field={slice.primary.direct_answer} />
          </div>
          <div className="aeo-exp">
            <PrismicRichText field={slice.primary.expansion} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickAnswer;
