import { FC } from "react";

const ApPlanningPoll: FC<{ slice: { slice_type: string } }> = ({ slice }) => {
  return (
    <section data-slice-type={slice.slice_type}>
      <div className="container" style={{ textAlign: "center" }}>
        <h2>AP Planning Poll</h2>
        <p>This is a placeholder for the AP Planning Poll slice.</p>
      </div>
    </section>
  );
};

export default ApPlanningPoll;
