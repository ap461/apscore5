import { FC } from "react";
import { Content } from "@prismicio/client";
import {
  SliceComponentProps,
  PrismicRichText,
  type JSXMapSerializer,
} from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

export type PillarHeroProps = SliceComponentProps<Content.PillarHeroSlice>;

const headlineComponents: JSXMapSerializer = {
  heading1: ({ children }) => (
    <h1 className="text-white font-extrabold text-[clamp(40px,6vw,68px)] leading-[1.02] tracking-[-2px] mb-[22px] max-w-[900px]">
      {children}
    </h1>
  ),
  em: ({ children }) => (
    <em className="not-italic text-orange relative inline-block after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-1 after:bg-orange after:rounded-md after:opacity-40">
      {children}
    </em>
  ),
};

const subheadlineComponents: JSXMapSerializer = {
  paragraph: ({ children }) => (
    <p className="text-white/[0.72] text-[18px] leading-[1.7] max-w-[720px] mb-8">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="text-white font-semibold">{children}</strong>
  ),
};

const PillarHero: FC<PillarHeroProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={[
        "relative overflow-hidden bg-navy text-white pt-[72px] pb-14",
        // Dot pattern overlay
        "before:content-[''] before:absolute before:inset-0 before:pointer-events-none before:opacity-80",
        "before:[background-image:radial-gradient(rgba(255,255,255,0.06)_1.5px,transparent_1.5px)] before:[background-size:30px_30px]",
        // Blue radial glow, top-right
        "after:content-[''] after:absolute after:-top-[120px] after:-right-[120px] after:size-[620px] after:rounded-full after:pointer-events-none",
        "after:[background:radial-gradient(circle,rgba(47,102,208,0.28)_0%,transparent_65%)]",
      ].join(" ")}
    >
      <div className="container relative z-10">
        {slice.primary.eyebrow && (
          <div className="inline-flex items-center gap-2.5 px-3.5 py-[7px] mb-[22px] rounded-full border border-orange/30 bg-orange/10 text-orange font-mono text-[11px] font-medium tracking-[0.08em] uppercase">
            <span className="size-[7px] rounded-full bg-orange shadow-[0_0_10px_rgba(245,166,35,0.6)]" />
            {slice.primary.eyebrow}
          </div>
        )}

        <PrismicRichText
          field={slice.primary.headline}
          components={headlineComponents}
        />
        <PrismicRichText
          field={slice.primary.subheadline}
          components={subheadlineComponents}
        />

        {slice.items.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-7">
            {slice.items.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-[8px] text-center px-3.5 py-4"
              >
                <div className="text-orange text-[26px] font-extrabold leading-none tracking-[-0.5px] mb-1">
                  {item.stat_number}
                </div>
                <div className="font-mono text-[10px] text-white/65 uppercase tracking-[0.05em] leading-snug mb-1">
                  {item.stat_label}
                </div>
                {item.stat_caption && (
                  <div className="text-[10px] text-white/[0.42] leading-snug">
                    {item.stat_caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {slice.primary.primary_cta_text && (
            <PrismicNextLink
              field={slice.primary.primary_cta_link}
              className="inline-flex items-center justify-center gap-2 rounded-[9px] bg-orange text-navy font-bold text-[15px] px-[26px] py-3.5 transition hover:bg-[#fbb83a] hover:-translate-y-px"
            >
              {slice.primary.primary_cta_text}
            </PrismicNextLink>
          )}
          {slice.primary.secondary_cta_text && (
            <PrismicNextLink
              field={slice.primary.secondary_cta_link}
              className="inline-flex items-center justify-center gap-2 rounded-[9px] border-[1.5px] border-white/25 bg-transparent text-white/85 font-bold text-[15px] px-[22px] py-3.5 transition hover:border-white/50 hover:text-white hover:-translate-y-px"
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
