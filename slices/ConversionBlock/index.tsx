import { FC } from "react";

const ConversionBlock: FC<any> = ({ slice }) => {
  return (
    <section className="conversion-block py-12 bg-gray-50" data-slice-type={slice.slice_type}>
      <div className="container text-center">
        <h2>Convert Now</h2>
        <p>This is a placeholder for the Conversion Block slice.</p>
      </div>
    </section>
  );
};

export default ConversionBlock;
