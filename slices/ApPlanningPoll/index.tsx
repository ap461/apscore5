import { FC } from "react";

const ApPlanningPoll: FC<any> = ({ slice }) => {
  return (
    <section className="ap-planning-poll py-12" data-slice-type={slice.slice_type}>
      <div className="container text-center">
        <h2>AP Planning Poll</h2>
        <p>This is a placeholder for the AP Planning Poll slice.</p>
      </div>
    </section>
  );
};

export default ApPlanningPoll;
