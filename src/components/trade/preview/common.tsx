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
            fill="url(#svg-sell-gradient)"
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
            fill="url(#svg-sell-gradient)"
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
        <g id="svg-sell-line">
          <line
            x1="50"
            x2="950"
            y1="0"
            y2="0"
            strokeWidth="3"
            stroke="var(--color-sell)"
          />
          <g transform="translate(950, 0)">
            <use href="#sell-indicator" />
          </g>
        </g>

        <g id="buy-box">
          <rect
            x="-40"
            y="-20"
            width="80"
            height="40"
            rx="8"
            ry="8"
            fill="url(#svg-buy-gradient)"
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
            fill="url(#svg-buy-gradient)"
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
        <g id="svg-buy-line">
          <line
            x1="50"
            x2="950"
            y1="0"
            y2="0"
            strokeWidth="3"
            stroke="var(--color-buy)"
          />
          <g transform="translate(950, 0)">
            <use href="#buy-indicator" />
          </g>
        </g>

        <g id="buy-range">
          <polyline
            points="-60,0 -40,-20 40,-20 60,0 40,20 -40,20"
            fill="url(#svg-buy-gradient)"
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
        <path
          id="svg-price-path"
          fill="none"
          stroke="white"
          strokeLinejoin="round"
          strokeWidth="5"
          d="M50 350 150 350 250 750 300 750 400 300 450 300 500 400 550 400 650 900 700 900 850 350 900 350 950 550 1000 550"
        />
        <g id="svg-axis-lines">
          <line
            x1="50"
            x2="950"
            y1="950"
            y2="950"
            strokeWidth="3"
            stroke="white"
          />
          <line
            x1="50"
            x2="50"
            y1="50"
            y2="950"
            strokeWidth="3"
            stroke="white"
          />
        </g>
        <pattern
          id="logo-pattern"
          patternUnits="userSpaceOnUse"
          width="40"
          height="50"
        >
          <use
            href="#carbonLogo"
            x="10"
            y="10"
            width="30"
            height="30"
            fill="white"
            fillOpacity="0.4"
          />
          {/* <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.2"
          /> */}
        </pattern>
      </defs>
    </svg>
  );
};
