import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type FAQAccordionProps = SliceComponentProps<Content.FaqAccordionSlice>;

const FAQAccordion: FC<FAQAccordionProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder for FAQAccordion.
    </section>
  );
};

export default FAQAccordion;
