import { FC } from "react";

const WhyApMatters: FC<any> = ({ slice }) => {
  return (
    <section className="why-ap-matters py-12" data-slice-type={slice.slice_type}>
      <div className="container text-center">
        <h2>Why AP Matters</h2>
        <p>This is a placeholder for the Why AP matters slice.</p>
      </div>
    </section>
  );
};

export default WhyApMatters;
