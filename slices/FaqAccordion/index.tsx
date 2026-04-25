import { FC } from "react";

const FaqAccordion: FC<any> = ({ slice }) => {
  return (
    <section className="faq-accordion py-12" data-slice-type={slice.slice_type}>
      <div className="container text-center">
        <h2>FAQ</h2>
        <p>This is a placeholder for the FAQ accordion slice.</p>
      </div>
    </section>
  );
};

export default FaqAccordion;
