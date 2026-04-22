import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type UnitQuestionBankProps = SliceComponentProps<Content.UnitQuestionBankSlice>;

const UnitQuestionBank: FC<UnitQuestionBankProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder for UnitQuestionBank.
    </section>
  );
};

export default UnitQuestionBank;
