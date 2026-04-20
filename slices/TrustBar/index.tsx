import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
export type TrustBarProps = SliceComponentProps<Content.TrustBarSlice>;
const TrustBar: FC<TrustBarProps> = ({ slice }) => {
  const stats = slice.primary.stats as Array<{ stat_value: string; stat_label: string }>;
  return (
    <div className="stats-bar" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="container"><div className="stats-inner">
        {stats?.map((item, i) => (
          <div className="stat" key={i}>
            <span className="stat-val">{item.stat_value}</span>
            <span className="stat-label">{item.stat_label}</span>
          </div>
        ))}
      </div></div>
    </div>
  );
};
export default TrustBar;