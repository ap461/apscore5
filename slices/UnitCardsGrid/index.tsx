import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type UnitCardsGridProps = SliceComponentProps<Content.UnitCardsGridSlice>;

const UnitCardsGrid: FC<UnitCardsGridProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder for UnitCardsGrid.
    </section>
  );
};

export default UnitCardsGrid;
