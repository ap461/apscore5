export default function ScoreDistributionChart() {
  // Bar geometry: starts at x=30, width 540, scale 5.4 px per percentage point.
  // Segment widths in order: 5 / 4 / 3 / 2 / 1
  const segments = [
    { score: "5", pct: "17.1%", x: 30, width: 92.34, fill: "#f5a623", textColor: "#0a0f5a" },
    { score: "4", pct: "21.6%", x: 122.34, width: 116.64, fill: "#2f66d0", textColor: "#ffffff" },
    { score: "3", pct: "26.0%", x: 238.98, width: 140.4, fill: "#7ba3e8", textColor: "#ffffff" },
    { score: "2", pct: "21.7%", x: 379.38, width: 117.18, fill: "#c5c9d6", textColor: "#0a0f5a" },
    { score: "1", pct: "13.6%", x: 496.56, width: 73.44, fill: "#9097ad", textColor: "#ffffff" },
  ];

  return (
    <figure className="score-figure">
      <svg
        viewBox="0 0 600 180"
        role="img"
        aria-labelledby="score-title score-desc"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id="score-title">2025 AP Human Geography Score Distribution</title>
        <desc id="score-desc">
          A horizontal stacked bar showing the 2025 AP Human Geography score
          distribution. 17.1 percent scored 5, 21.6 percent scored 4, 26.0
          percent scored 3, 21.7 percent scored 2, and 13.6 percent scored 1.
          The pass rate (3 or higher) was 64.7 percent. Mean score 3.14 across
          approximately 280,000 test-takers.
        </desc>

        {/* Title */}
        <text x="300" y="20" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="14" fontWeight="700" fill="#0a0f5a">
          2025 AP Human Geography Score Distribution
        </text>

        {/* Subtitle */}
        <text x="300" y="40" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fill="#3d4a7a">
          Pass rate (3+): 64.7% · Mean score: 3.14 · ~280,000 test-takers
        </text>

        {/* Pass-rate divider label (above bar) */}
        <text x="379.38" y="58" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fontWeight="700" fill="#0a0f5a">
          ← Pass rate 64.7%
        </text>

        {/* Bar segments */}
        {segments.map((s, i) => (
          <g key={s.score}>
            <rect x={s.x} y={64} width={s.width} height={44} fill={s.fill} />
            <text
              x={s.x + s.width / 2}
              y={82}
              textAnchor="middle"
              fontFamily="Inter, system-ui, sans-serif"
              fontSize="14"
              fontWeight="800"
              fill={s.textColor}
            >
              {s.score}
            </text>
            <text
              x={s.x + s.width / 2}
              y={100}
              textAnchor="middle"
              fontFamily="Inter, system-ui, sans-serif"
              fontSize="10"
              fontWeight="600"
              fill={s.textColor}
            >
              {s.pct}
            </text>
            {/* Hairline between segments for definition */}
            {i < segments.length - 1 && (
              <line x1={s.x + s.width} y1={64} x2={s.x + s.width} y2={108} stroke="#ffffff" strokeWidth="1" />
            )}
          </g>
        ))}

        {/* Pass-rate dashed divider — vertical, between Score 3 and Score 2 */}
        <line
          x1="379.38"
          y1="60"
          x2="379.38"
          y2="118"
          stroke="#0a0f5a"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* Legend */}
        <g transform="translate(60 138)" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fill="#3d4a7a">
          <rect x="0" y="0" width="12" height="12" fill="#f5a623" rx="2" />
          <text x="18" y="9" dominantBaseline="middle">Score 5</text>

          <rect x="100" y="0" width="12" height="12" fill="#2f66d0" rx="2" />
          <text x="118" y="9" dominantBaseline="middle">Score 4</text>

          <rect x="200" y="0" width="12" height="12" fill="#7ba3e8" rx="2" />
          <text x="218" y="9" dominantBaseline="middle">Score 3</text>

          <rect x="300" y="0" width="12" height="12" fill="#c5c9d6" rx="2" />
          <text x="318" y="9" dominantBaseline="middle">Score 2</text>

          <rect x="400" y="0" width="12" height="12" fill="#9097ad" rx="2" />
          <text x="418" y="9" dominantBaseline="middle">Score 1</text>
        </g>
      </svg>
      <figcaption>
        2025 score distribution from College Board. Aim for the orange bar.
      </figcaption>
    </figure>
  );
}
