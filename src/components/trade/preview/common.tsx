export const PreviewCommonStrategyType = () => {
  return (
    <svg width="0" height="0" className="fixed">
      <defs>
        <g id="sell-box">
          <rect
            x="-40"
            y="-20"
            width="80"
            height="40"
            rx="8"
            ry="8"
            fill="var(--color-sell)"
          />
          <text
            x="0"
            y="0"
            fontSize="28"
            dominantBaseline="middle"
            textAnchor="middle"
            stroke="black"
          >
            Sell
          </text>
        </g>
        <g id="sell-indicator">
          <polyline
            points="-40,0 -20,-20 40,-20 40,20 -20,20"
            fill="var(--color-sell)"
          />
          <text
            x="-15"
            y="0"
            fontSize="28"
            dominantBaseline="middle"
            textAnchor="start"
            stroke="black"
          >
            Sell
          </text>
        </g>

        <g id="buy-box">
          <rect
            x="-40"
            y="-20"
            width="80"
            height="40"
            rx="8"
            ry="8"
            fill="var(--color-buy)"
          />
          <text
            x="0"
            y="0"
            fontSize="28"
            dominantBaseline="middle"
            textAnchor="middle"
            stroke="black"
          >
            Buy
          </text>
        </g>
        <g id="buy-indicator">
          <polyline
            points="-40,0 -20,-20 40,-20 40,20 -20,20"
            fill="var(--color-buy)"
          />
          <text
            x="-15"
            y="0"
            fontSize="28"
            dominantBaseline="middle"
            textAnchor="start"
            stroke="black"
          >
            Buy
          </text>
        </g>
        <g id="buy-range">
          <polyline
            points="-60,0 -40,-20 40,-20 60,0 40,20 -40,20"
            fill="var(--color-buy)"
          />
          <text
            x="0"
            y="0"
            fontSize="28"
            dominantBaseline="middle"
            textAnchor="middle"
            stroke="black"
          >
            Buy
          </text>
        </g>
        <g id="trade-icon">
          <polygon points="-20,0 0,20 20,0 0,-20" fill="white" />
        </g>
        <pattern
          id="circle-pattern"
          patternUnits="userSpaceOnUse"
          width="50"
          height="50"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.2"
          />
        </pattern>
      </defs>
    </svg>
  );
};
