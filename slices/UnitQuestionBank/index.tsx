"use client";
import { FC, useState } from "react";
import { Content, RichTextField } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { AdUnit } from "@/components/ads/AdUnit";

const QB_AD_SLOT = "7625777562";

export type UnitQuestionBankProps =
  SliceComponentProps<Content.UnitQuestionBankSlice>;

type Letter = "A" | "B" | "C" | "D";
type Difficulty = "Easy" | "Medium" | "Hard";

type QuestionShape = {
  text: string | null;
  difficulty: Difficulty | null;
  options: { letter: Letter; text: string | null }[];
  correct: Letter | null;
  short_label: string | null;
  explanation: RichTextField;
  tip: string | null;
};

function readQuestion(
  block: Record<string, unknown>,
  n: 1 | 2 | 3,
): QuestionShape {
  const get = (k: string) => block[`q${n}_${k}`];
  return {
    text: (get("text") as string | null) ?? null,
    difficulty: (get("difficulty") as Difficulty | null) ?? null,
    options: [
      { letter: "A", text: (get("a") as string | null) ?? null },
      { letter: "B", text: (get("b") as string | null) ?? null },
      { letter: "C", text: (get("c") as string | null) ?? null },
      { letter: "D", text: (get("d") as string | null) ?? null },
    ],
    correct: (get("correct") as Letter | null) ?? null,
    short_label: (get("short_label") as string | null) ?? null,
    explanation: (get("explanation") as RichTextField) ?? [],
    tip: (get("tip") as string | null) ?? null,
  };
}

const UnitQuestionBank: FC<UnitQuestionBankProps> = ({ slice }) => {
  const blocks = slice.primary?.unit_blocks ?? [];
  const [answered, setAnswered] = useState<Record<string, Letter>>({});

  if (blocks.length === 0) return null;

  const select = (key: string, choice: Letter) => {
    setAnswered((prev) => (prev[key] ? prev : { ...prev, [key]: choice }));
  };

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

        <div className="qb-units">
          {blocks.map((block, ui) => (
            <div key={ui} className="qb-unit">
              <div className="qb-unit-head">
                {block.unit_number && (
                  <span className="qb-unit-number">
                    Unit {block.unit_number}
                  </span>
                )}
                {block.unit_title && <h3>{block.unit_title}</h3>}
                {block.unit_meta && (
                  <p className="qb-unit-meta">{block.unit_meta}</p>
                )}
              </div>

              {([1, 2, 3] as const).map((qIdx) => {
                const q = readQuestion(
                  block as unknown as Record<string, unknown>,
                  qIdx,
                );
                if (!q.text || !q.correct) return null;

                const key = `${ui}-${qIdx}`;
                const chosen = answered[key];
                const reveal = !!chosen;

                return (
                  <div key={qIdx} className="qb-question">
                    <div className="qb-q-head">
                      <span className="qb-q-num">Question {qIdx}</span>
                      {q.difficulty && (
                        <span
                          className={`qb-difficulty qb-d-${q.difficulty.toLowerCase()}`}
                        >
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="qb-q-text">{q.text}</p>

                    <div className="qb-opts">
                      {q.options.map((o) => {
                        if (!o.text) return null;
                        const isCorrect = o.letter === q.correct;
                        const isChosen = chosen === o.letter;
                        let cls = "qb-opt";
                        if (reveal && isChosen && isCorrect)
                          cls += " chosen-correct";
                        else if (reveal && isChosen && !isCorrect)
                          cls += " chosen-wrong";
                        else if (reveal && isCorrect) cls += " show-correct";

                        return (
                          <button
                            key={o.letter}
                            type="button"
                            className={cls}
                            disabled={reveal}
                            onClick={() => select(key, o.letter)}
                          >
                            <span className="qb-letter">{o.letter}</span>
                            <span className="qb-opt-text">{o.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {reveal && (
                      <>
                        <div className="qb-feedback">
                          {q.short_label && <strong>{q.short_label}</strong>}
                          <PrismicRichText
                            field={q.explanation}
                            components={{
                              paragraph: ({ children }) => <p>{children}</p>,
                              strong: ({ children }) => (
                                <strong>{children}</strong>
                              ),
                            }}
                          />
                          {q.tip && <p className="qb-tip">💡 {q.tip}</p>}
                        </div>
                        <div className="qb-ad">
                          <AdUnit slot={QB_AD_SLOT} layout="in-article" />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {block.unit_page_link && (
                <div className="qb-unit-cta">
                  <PrismicNextLink
                    field={block.unit_page_link}
                    className="btn btn-s"
                  >
                    Open Unit {block.unit_number} →
                  </PrismicNextLink>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UnitQuestionBank;
