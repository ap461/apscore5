import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type ConversionBlockProps = SliceComponentProps<Content.ConversionBlockSlice>;

const ConversionBlock: FC<ConversionBlockProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder for ConversionBlock.
    </section>
  );
};

export default ConversionBlock;
