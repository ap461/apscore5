export default function DemographicTransitionDiagram() {
  return (
    <figure className="dtm-figure">
      <svg
        viewBox="0 0 600 320"
        role="img"
        aria-labelledby="dtm-title dtm-desc"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id="dtm-title">Demographic Transition Model</title>
        <desc id="dtm-desc">
          A line graph showing the five stages of the Demographic Transition
          Model: birth rates and death rates both start high in pre-industrial
          Stage 1, death rates fall sharply in Stage 2 causing rapid population
          growth, birth rates fall in Stages 3 and 4, and population stabilizes
          or slightly declines in post-industrial Stage 5.
        </desc>

        {/* Title */}
        <text
          x="300"
          y="22"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="14"
          fontWeight="700"
          fill="#0a0f5a"
        >
          Demographic Transition Model
        </text>

        {/* Y-axis label */}
        <text
          x="14"
          y="160"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontSize="11"
          fontWeight="600"
          fill="#3d4a7a"
          transform="rotate(-90 14 160)"
        >
          Rate / Population
        </text>

        {/* Plot area baseline */}
        <line x1="24" y1="240" x2="504" y2="240" stroke="#0a0f5a" strokeOpacity="0.25" strokeWidth="1" />

        {/* Stage dividers */}
        <line x1="120" y1="50" x2="120" y2="240" stroke="#0a0f5a" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="216" y1="50" x2="216" y2="240" stroke="#0a0f5a" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="312" y1="50" x2="312" y2="240" stroke="#0a0f5a" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="408" y1="50" x2="408" y2="240" stroke="#0a0f5a" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="3 3" />

        {/* Population area — low/flat in stage 1, rises in stage 2, peaks in stage 4, slight decline in stage 5 */}
        <path
          d="M 24,232 L 120,232 C 144,230 180,195 216,165 C 240,145 290,130 312,130 C 340,130 380,132 408,135 L 504,150 L 504,240 L 24,240 Z"
          fill="rgba(10,15,90,0.06)"
        />

        {/* Birth rate curve — high, flat through stage 1, sharp drop in 3-4, ends at ~200 */}
        <path
          d="M 24,70 L 120,70 C 144,72 168,76 216,82 C 240,90 280,140 312,170 C 340,185 380,195 408,200 L 504,200"
          fill="none"
          stroke="#2f66d0"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Death rate curve — high in stage 1, sharp drop in stage 2, levels off at ~215 */}
        <path
          d="M 24,75 L 120,75 C 144,80 180,150 216,200 C 240,213 280,215 312,215 L 504,215"
          fill="none"
          stroke="#f5a623"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Stage labels */}
        <g fontFamily="Inter, system-ui, sans-serif" fill="#0a0f5a" fontSize="12" fontWeight="700" textAnchor="middle">
          <text x="72" y="258">Stage 1</text>
          <text x="168" y="258">Stage 2</text>
          <text x="264" y="258">Stage 3</text>
          <text x="360" y="258">Stage 4</text>
          <text x="456" y="258">Stage 5</text>
        </g>

        {/* Stage sub-labels */}
        <g fontFamily="Inter, system-ui, sans-serif" fill="#3d4a7a" fontSize="10" fontStyle="italic" textAnchor="middle">
          <text x="72" y="276">Pre-industrial</text>
          <text x="168" y="276">Transitional</text>
          <text x="264" y="276">Industrial</text>
          <text x="360" y="276">Mature</text>
          <text x="456" y="276">Post-industrial</text>
        </g>

        {/* Legend */}
        <g transform="translate(80 296)" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fill="#3d4a7a">
          <rect x="0" y="0" width="14" height="3" fill="#2f66d0" rx="1" />
          <text x="20" y="6" dominantBaseline="middle">Birth rate</text>

          <rect x="120" y="0" width="14" height="3" fill="#f5a623" rx="1" />
          <text x="140" y="6" dominantBaseline="middle">Death rate</text>

          <rect x="240" y="-5" width="14" height="13" fill="rgba(10,15,90,0.18)" rx="2" />
          <text x="260" y="6" dominantBaseline="middle">Total population</text>
        </g>
      </svg>
      <figcaption>
        The Demographic Transition Model — a core AP HuG concept tested on the FRQ. Memorize the curves; explain the why.
      </figcaption>
    </figure>
  );
}
