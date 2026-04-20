import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

export type NewsletterSignupProps = SliceComponentProps<Content.NewsletterSignupSlice>;

const NewsletterSignup: FC<NewsletterSignupProps> = ({ slice }) => {
  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="container">
        <div className="nl-box">
          <div>
            <PrismicRichText field={slice.primary.heading} />
            <PrismicRichText field={slice.primary.description} />
          </div>
          <div>
            <div className="nl-form">
              <input placeholder={slice.primary.input_placeholder || "Your email address"} type="email" />
              <button>{slice.primary.button_text || "Join Free"}</button>
            </div>
            <div className="nl-note">Free forever. Unsubscribe anytime.</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;