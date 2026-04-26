import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";

export type StudyStrategyProps =
  SliceComponentProps<Content.StudyStrategySlice>;

const StudyStrategy: FC<StudyStrategyProps> = ({ slice }) => {
  const items = slice.items ?? [];
  const features = (slice.primary?.mock_features ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const hasMockBlock = Boolean(
    (Array.isArray(slice.primary?.mock_headline) &&
      slice.primary.mock_headline.length > 0) ||
      (Array.isArray(slice.primary?.mock_body) &&
        slice.primary.mock_body.length > 0) ||
      slice.primary?.mock_cta_text,
  );

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <div className="container">
        {slice.primary?.eyebrow && (
          <div className="kicker">{slice.primary.eyebrow}</div>
        )}
        <PrismicRichText
          field={slice.primary?.headline}
          components={{ heading2: ({ children }) => <h2>{children}</h2> }}
        />
        <PrismicRichText
          field={slice.primary?.lede}
          components={{
            paragraph: ({ children }) => <p className="sdesc">{children}</p>,
            strong: ({ children }) => <strong>{children}</strong>,
          }}
        />

        {items.length > 0 && (
          <div className="steps-grid">
            {items.map((item, i) => (
              <div key={i} className="step-card">
                {item.phase_label && (
                  <div className="step-label">{item.phase_label}</div>
                )}
                {item.phase_icon && (
                  <div className="step-icon" aria-hidden="true">
                    {item.phase_icon}
                  </div>
                )}
                {item.phase_title && <h3>{item.phase_title}</h3>}
                {item.phase_description && <p>{item.phase_description}</p>}
              </div>
            ))}
          </div>
        )}

        {hasMockBlock && (
          <div className="mock-card">
            <PrismicRichText
              field={slice.primary?.mock_headline}
              components={{ heading3: ({ children }) => <h3>{children}</h3> }}
            />
            <PrismicRichText
              field={slice.primary?.mock_body}
              components={{
                paragraph: ({ children }) => (
                  <p className="sdesc">{children}</p>
                ),
                strong: ({ children }) => <strong>{children}</strong>,
              }}
            />
            {features.length > 0 && (
              <div className="features">
                {features.map((f, i) => (
                  <span key={i} className="feature">
                    {f}
                  </span>
                ))}
              </div>
            )}
            {slice.primary?.mock_cta_text && (
              <PrismicNextLink
                field={slice.primary.mock_cta_link}
                className="btn btn-p"
              >
                {slice.primary.mock_cta_text}
              </PrismicNextLink>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default StudyStrategy;
