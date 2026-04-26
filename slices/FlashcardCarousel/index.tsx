"use client";
import { FC, useState } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextLink } from "@prismicio/next";
import { AdUnit } from "@/components/ads/AdUnit";

const FC_AD_SLOT = "1227370650";
const FC_AD_FREQUENCY = 5;

export type FlashcardCarouselProps =
  SliceComponentProps<Content.FlashcardCarouselSlice>;

type DeckEntry = { kind: "card"; index: number } | { kind: "ad" };

function buildDeck(cardCount: number, frequency: number): DeckEntry[] {
  const deck: DeckEntry[] = [];
  let cardIdx = 0;
  let pos = 1;
  while (cardIdx < cardCount) {
    if (pos % frequency === 0) {
      deck.push({ kind: "ad" });
    } else {
      deck.push({ kind: "card", index: cardIdx });
      cardIdx++;
    }
    pos++;
  }
  return deck;
}

const FlashcardCarousel: FC<FlashcardCarouselProps> = ({ slice }) => {
  const cards = slice.items ?? [];
  const [position, setPosition] = useState(0);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  if (cards.length === 0) return null;

  const deck = buildDeck(cards.length, FC_AD_FREQUENCY);
  const total = deck.length;
  const current = deck[Math.min(position, total - 1)];

  const goPrev = () => setPosition((p) => Math.max(0, p - 1));
  const goNext = () => setPosition((p) => Math.min(total - 1, p + 1));
  const flipCurrent = () => {
    if (current.kind !== "card") return;
    const idx = current.index;
    setFlipped((f) => ({ ...f, [idx]: !f[idx] }));
  };

  const card = current.kind === "card" ? cards[current.index] : null;
  const isFlipped = card ? !!flipped[(current as { index: number }).index] : false;

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

        <div className="fc-deck">
          <div className="fc-stage">
            {current.kind === "ad" ? (
              <div className="fc-ad-slide">
                <AdUnit slot={FC_AD_SLOT} layout="display" />
              </div>
            ) : card ? (
              <button
                type="button"
                className={`fc-card${isFlipped ? " is-flipped" : ""}`}
                onClick={flipCurrent}
                aria-label={
                  isFlipped ? "Show term" : "Show definition"
                }
              >
                <div className="fc-card-inner">
                  <div className="fc-card-front">
                    {card.unit_label && (
                      <span className="fc-unit">{card.unit_label}</span>
                    )}
                    {card.term && <div className="fc-term">{card.term}</div>}
                    <span className="fc-flip-hint">
                      Tap to reveal definition
                    </span>
                  </div>
                  <div className="fc-card-back">
                    <span className="fc-back-label">Definition</span>
                    {card.definition && (
                      <div className="fc-definition">{card.definition}</div>
                    )}
                  </div>
                </div>
              </button>
            ) : null}
          </div>

          <div className="fc-controls">
            <button
              type="button"
              onClick={goPrev}
              disabled={position === 0}
              className="fc-nav"
              aria-label="Previous card"
            >
              ‹ Prev
            </button>
            <span className="fc-counter">
              {position + 1} / {total}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={position === total - 1}
              className="fc-nav"
              aria-label="Next card"
            >
              Next ›
            </button>
          </div>

          {slice.primary?.unlock_link_text && (
            <div className="fc-unlock">
              <PrismicNextLink
                field={slice.primary.unlock_link}
                className="btn btn-p"
              >
                {slice.primary.unlock_link_text}
              </PrismicNextLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlashcardCarousel;
