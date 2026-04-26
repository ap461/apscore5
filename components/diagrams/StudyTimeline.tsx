export default function StudyTimeline() {
  return (
    <figure className="timeline-figure">
      <svg
        viewBox="0 0 600 200"
        role="img"
        aria-labelledby="timeline-title timeline-desc"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id="timeline-title">9-month AP Human Geography study timeline</title>
        <desc id="timeline-desc">
          A horizontal calendar timeline running September through May 5
          showing four study phases ahead of the AP Human Geography exam:
          Phase 1 builds vocabulary at 5 minutes a day from September through
          December, Phase 2 applies models at 10 minutes a day through
          January and February, Phase 3 drills FRQs three a week through
          March and April, and Phase 4 is two weeks of full mock review
          before exam day on May 5.
        </desc>

        {/* Title */}
        <text x="300" y="22" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="14" fontWeight="700" fill="#0a0f5a">
          9 months → 5 minutes a day → a 5
        </text>

        {/* Timeline track baseline */}
        <line x1="40" y1="100" x2="510" y2="100" stroke="#0a0f5a" strokeOpacity="0.10" strokeWidth="1" />

        {/* Phase 01 — Sept-Dec, 4 months */}
        <rect x="40" y="80" width="190" height="40" rx="6" fill="#7ba3e8" fillOpacity="0.85" />
        <text x="135" y="97" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fontWeight="800" letterSpacing="1" fill="#ffffff">
          PHASE 01
        </text>
        <text x="135" y="113" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fontWeight="600" fill="#ffffff">
          Vocab · 5 min/day
        </text>

        {/* Phase 02 — Jan-Feb, 2 months */}
        <rect x="234" y="80" width="95" height="40" rx="6" fill="#5a8fd8" fillOpacity="0.85" />
        <text x="281.5" y="97" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fontWeight="800" letterSpacing="1" fill="#ffffff">
          PHASE 02
        </text>
        <text x="281.5" y="113" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="10" fontWeight="600" fill="#ffffff">
          Models · 10 min
        </text>

        {/* Phase 03 — Mar-Apr, 2 months */}
        <rect x="330" y="80" width="95" height="40" rx="6" fill="#2f66d0" fillOpacity="0.85" />
        <text x="377.5" y="97" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fontWeight="800" letterSpacing="1" fill="#ffffff">
          PHASE 03
        </text>
        <text x="377.5" y="113" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="10" fontWeight="600" fill="#ffffff">
          FRQs · 3/week
        </text>

        {/* Phase 04 — last 2 weeks */}
        <rect x="426" y="80" width="65" height="40" rx="6" fill="#1a4ba8" fillOpacity="0.9" />
        <text x="458.5" y="97" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fontWeight="800" letterSpacing="1" fill="#ffffff">
          P04
        </text>
        <text x="458.5" y="113" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="10" fontWeight="600" fill="#ffffff">
          Full review
        </text>

        {/* Exam day circle */}
        <circle cx="540" cy="100" r="22" fill="#f5a623" />
        <text x="540" y="97" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="14">
          🎯
        </text>
        <text x="540" y="112" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="9" fontWeight="800" fill="#0a0f5a">
          May 5
        </text>

        {/* Month markers */}
        <g fontFamily="Inter, system-ui, sans-serif" fontSize="10" fontWeight="700" fill="#0a0f5a" textAnchor="middle">
          <text x="40" y="148">Sep</text>
          <text x="102.5" y="148">Oct</text>
          <text x="165" y="148">Nov</text>
          <text x="227.5" y="148">Dec</text>
          <text x="290" y="148">Jan</text>
          <text x="352.5" y="148">Feb</text>
          <text x="415" y="148">Mar</text>
          <text x="477.5" y="148">Apr</text>
          <text x="540" y="148">May</text>
        </g>

        {/* Phase callouts */}
        <g fontFamily="Inter, system-ui, sans-serif" fontSize="10" fill="#3d4a7a" textAnchor="middle">
          <text x="135" y="175">Build vocab base</text>
          <text x="281.5" y="175">Apply models</text>
          <text x="377.5" y="175">Master FRQs</text>
          <text x="458.5" y="175">Mock exam</text>
          <text x="540" y="175" fontWeight="800" fill="#0a0f5a">
            Exam day
          </text>
        </g>
      </svg>
      <figcaption>
        9 months. 5 minutes a day. One score that matters.
      </figcaption>
    </figure>
  );
}
