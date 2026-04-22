import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type FlashcardCarouselProps = SliceComponentProps<Content.FlashcardCarouselSlice>;

const FlashcardCarousel: FC<FlashcardCarouselProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder for FlashcardCarousel.
    </section>
  );
};

export default FlashcardCarousel;
