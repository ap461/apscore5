import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import Link from "next/link";
import HeroQuizWidget from "@/components/ui/HeroQuizWidget";
import { SITE_ROUTES } from "@/config/endpoints";

export type HeroSectionProps = SliceComponentProps<Content.HeroSectionSlice>;

const HeroSection: FC<HeroSectionProps> = ({ slice }) => {
  const d = slice.primary;

  const primaryUrl =
    (d.cta_link as { url?: string })?.url ?? SITE_ROUTES.signup;

  return (
    <div className="hero" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="container">
        <div className="hero-inner">
          {/* Left column — text */}
          <div className="hero-text">
            {/* The PrismicRichText will automatically output the correct heading/paragraph tags */}
            <PrismicRichText field={d.headline} />
            <div className="sub">
              <PrismicRichText field={d.subheadline} />
            </div>

            <div className="hbtns">
              <Link href={primaryUrl} className="btn btn-p">
                {d.cta_text ?? "Create a free account"}
              </Link>
            </div>
          </div>

          {/* Right column — interactive quiz */}
          <HeroQuizWidget />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;