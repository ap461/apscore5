import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import ScoreDistributionChart from "@/components/diagrams/ScoreDistributionChart";

export type ExamStructureProps = SliceComponentProps<Content.ExamStructureSlice>;

const ExamStructure: FC<ExamStructureProps> = ({ slice }) => {
  const items = slice.items ?? [];
  const weights = items.filter(
    (i) => i.unit_label || i.unit_weight || i.unit_topic,
  );
  const logistics = items.filter(
    (i) => i.logistics_icon || i.logistics_title || i.logistics_value,
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
          }}
        />
        <PrismicRichText
          field={slice.primary?.format_description}
          components={{
            paragraph: ({ children }) => (
              <p style={{ marginBottom: "12px" }}>{children}</p>
            ),
            strong: ({ children }) => <strong>{children}</strong>,
          }}
        />

        {weights.length > 0 && (
          <>
            {slice.primary?.weights_heading && (
              <h3 className="exam-subhead">{slice.primary.weights_heading}</h3>
            )}
            <div className="exam-weights">
              {weights.map((w, i) => (
                <div key={i} className="exam-weight-row">
                  <div className="label">{w.unit_label}</div>
                  <div className="weight">{w.unit_weight}</div>
                  <div className="topic">{w.unit_topic}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <h3 className="exam-subhead">How students actually scored last year</h3>
        <ScoreDistributionChart />
        <p className="note">
          In 2025, 17.1 percent of students scored a 5 and 64.7 percent passed
          with a 3 or higher. The mean score was 3.14.
        </p>

        {logistics.length > 0 && (
          <div className="grid4 logistics-grid">
            {logistics.map((l, i) => (
              <div key={i} className="logistics-card">
                {l.logistics_icon && (
                  <div className="logistics-icon" aria-hidden="true">
                    {l.logistics_icon}
                  </div>
                )}
                {l.logistics_title && <h4>{l.logistics_title}</h4>}
                {l.logistics_value && (
                  <div className="value">{l.logistics_value}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {slice.primary?.score_heading && (
          <h3 className="exam-subhead">{slice.primary.score_heading}</h3>
        )}
        <PrismicRichText
          field={slice.primary?.score_description}
          components={{
            paragraph: ({ children }) => <p className="note">{children}</p>,
            strong: ({ children }) => <strong>{children}</strong>,
          }}
        />
      </div>
    </section>
  );
};

export default ExamStructure;
