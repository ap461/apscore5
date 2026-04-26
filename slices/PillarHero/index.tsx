import { FC } from "react";
import { Content } from "@prismicio/client";
import {
  SliceComponentProps,
  PrismicRichText,
  type JSXMapSerializer,
} from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

export type PillarHeroProps = SliceComponentProps<Content.PillarHeroSlice>;

const subheadlineComponents: JSXMapSerializer = {
  paragraph: ({ children }) => <p className="sub">{children}</p>,
  strong: ({ children }) => <strong>{children}</strong>,
};

const PillarHero: FC<PillarHeroProps> = ({ slice }) => {
  return (
    <section
      className="pillar-hero"
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="container">
        {slice.primary.eyebrow && (
          <div className="eyebrow">
            <span className="eydot" />
            {slice.primary.eyebrow}
          </div>
        )}

        <PrismicRichText field={slice.primary.headline} />
        <PrismicRichText
          field={slice.primary.subheadline}
          components={subheadlineComponents}
        />

        {slice.items.length > 0 && (
          <div className="pillar-stats">
            {slice.items.map((item, i) => (
              <div key={i} className="pillar-stat">
                <div className="pillar-stat-num">{item.stat_number}</div>
                <div className="pillar-stat-label">{item.stat_label}</div>
                {item.stat_caption && (
                  <div className="pillar-stat-cap">{item.stat_caption}</div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="hbtns">
          {slice.primary.primary_cta_text && (
            <PrismicNextLink
              field={slice.primary.primary_cta_link}
              className="btn-pillar-p"
            >
              {slice.primary.primary_cta_text}
            </PrismicNextLink>
          )}
          {slice.primary.secondary_cta_text && (
            <PrismicNextLink
              field={slice.primary.secondary_cta_link}
              className="btn-pillar-s"
            >
              {slice.primary.secondary_cta_text}
            </PrismicNextLink>
          )}
        </div>
      </div>
    </section>
  );
};

export default PillarHero;
