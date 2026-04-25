"use client";

import { FC, useState, useRef } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";

export type NewsletterSignupProps =
  SliceComponentProps<Content.NewsletterSignupSlice>;

type FormState = "idle" | "loading" | "success" | "error";

const NewsletterSignup: FC<NewsletterSignupProps> = ({ slice }) => {
  const d = slice.primary;
  const [formState, setFormState] = useState<FormState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inputRef.current?.value?.trim();
    if (!email) return;

    setFormState("loading");

    // TODO: wire to your email provider API route (e.g. /api/newsletter)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // placeholder
      setFormState("success");
    } catch {
      setFormState("error");
    }
  };

  return (
    <section aria-labelledby="newsletter-heading" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="container">
        <div className="nl-box">
          <div>
            {/* Override heading tags semantically or keep it inside the mapped RichText rendering */}
            <PrismicRichText field={d.heading} />
            <PrismicRichText field={d.description} />
          </div>
          <div>
            {formState === "success" ? (
              <p className="nl-note" style={{ fontSize: "15px", color: "rgba(255,255,255,.8)" }}>
                ✓ You&apos;re in! Check your inbox tomorrow.
              </p>
            ) : (
              <form
                className="nl-form"
                onSubmit={handleSubmit}
                aria-label="Daily AP question newsletter signup"
              >
                <input
                  ref={inputRef}
                  type="email"
                  placeholder={d.input_placeholder || "Your email address"}
                  aria-label="Email address for daily AP question"
                  required
                  disabled={formState === "loading"}
                />
                <button
                  type="submit"
                  disabled={formState === "loading"}
                  aria-label="Subscribe to daily AP questions"
                >
                  {formState === "loading" ? "Joining…" : d.button_text || "Join Free"}
                </button>
              </form>
            )}
            {formState === "error" && (
              <p className="nl-note" role="alert" style={{ color: "rgba(255,100,100,.9)" }}>
                Something went wrong. Please try again.
              </p>
            )}
            {formState !== "success" && (
              <p className="nl-note">Free forever. Unsubscribe anytime.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;