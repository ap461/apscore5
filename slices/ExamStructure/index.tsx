import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type ExamStructureProps = SliceComponentProps<Content.ExamStructureSlice>;

const ExamStructure: FC<ExamStructureProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder for ExamStructure.
    </section>
  );
};

export default ExamStructure;
