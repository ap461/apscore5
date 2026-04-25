import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

export type TrustBarProps = SliceComponentProps<Content.TrustBarSlice>;

const TrustBar: FC<TrustBarProps> = ({ slice }) => {
  const stats = slice.primary.stats as Array<{ stat_value: string; stat_label: string }>;
  
  return (
    <div className="stats-bar" aria-label="Key statistics" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="stats-inner">
        {stats?.map((item, i) => (
          <div className="stat" key={i}>
            <strong>{item.stat_value}</strong>
            <span>{item.stat_label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBar;