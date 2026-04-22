import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type DiagnosticQuizProps = SliceComponentProps<Content.DiagnosticQuizSlice>;

const DiagnosticQuiz: FC<DiagnosticQuizProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder for DiagnosticQuiz.
    </section>
  );
};

export default DiagnosticQuiz;
