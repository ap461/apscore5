import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type PillarHeroProps = SliceComponentProps<Content.PillarHeroSlice>;

const PillarHero: FC<PillarHeroProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder for PillarHero — replaced in commit 2.
    </section>
  );
};

export default PillarHero;
