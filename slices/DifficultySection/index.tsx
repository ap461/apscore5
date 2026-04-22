import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type DifficultySectionProps = SliceComponentProps<Content.DifficultySectionSlice>;

const DifficultySection: FC<DifficultySectionProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder for DifficultySection.
    </section>
  );
};

export default DifficultySection;
