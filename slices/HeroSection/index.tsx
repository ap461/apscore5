import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

export type HeroSectionProps = SliceComponentProps<Content.HeroSectionSlice>;

const HeroSection: FC<HeroSectionProps> = ({ slice }) => {
  return (
    <div className="hero" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="container hero-inner">
        <div className="hero-text">
          <PrismicRichText field={slice.primary.headline} />
          <PrismicRichText field={slice.primary.subheadline} />
          <div className="hero-cta">
            <PrismicNextLink field={slice.primary.cta_link} className="btn btn-primary">
              {slice.primary.cta_text || "Create a free account"}
            </PrismicNextLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;