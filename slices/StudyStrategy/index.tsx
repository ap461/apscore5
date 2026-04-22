import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type StudyStrategyProps = SliceComponentProps<Content.StudyStrategySlice>;

const StudyStrategy: FC<StudyStrategyProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder for StudyStrategy.
    </section>
  );
};

export default StudyStrategy;
