import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type QuickAnswerProps = SliceComponentProps<Content.QuickAnswerSlice>;

const QuickAnswer: FC<QuickAnswerProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder for QuickAnswer.
    </section>
  );
};

export default QuickAnswer;
