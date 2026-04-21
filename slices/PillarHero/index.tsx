import { FC } from "react";
import { SharedSlice, SharedSliceVariation } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

export type PillarHeroProps = SliceComponentProps<SharedSlice<'pillar_hero', SharedSliceVariation<'default', any, any>>>;

const PillarHero: FC<PillarHeroProps> = ({ slice }) => {
  return (
    <section
      className="pillar-hero"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="container pillar-hero-inner">
        {slice.primary.eyebrow && (
          <div className="pillar-hero-eyebrow">
            <span className="pillar-hero-eyebrow-dot" aria-hidden="true" />
            {slice.primary.eyebrow}
          </div>
        )}
        <PrismicRichText field={slice.primary.headline} />
        <div className="pillar-hero-sub">
          <PrismicRichText field={slice.primary.subheadline} />
        </div>

        {slice.items.length > 0 && (
          <div className="pillar-hero-stats">
            {slice.items.map((item, i) => (
              <div className="pillar-hero-stat" key={`stat-${i}`}>
                <div className="pillar-hero-stat-num">{item.stat_number}</div>
                <div className="pillar-hero-stat-lbl">{item.stat_label}</div>
                {item.stat_caption && (
                  <div className="pillar-hero-stat-why">{item.stat_caption}</div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="pillar-hero-actions">
          <PrismicNextLink
            field={slice.primary.primary_cta_link}
            className="btn btn-p"
          >
            {slice.primary.primary_cta_text || "Start Free →"}
          </PrismicNextLink>
          <PrismicNextLink
            field={slice.primary.secondary_cta_link}
            className="btn btn-ghost-w"
          >
            {slice.primary.secondary_cta_text || "Learn more"}
          </PrismicNextLink>
        </div>
      </div>
    </section>
  );
};

export default PillarHero;
