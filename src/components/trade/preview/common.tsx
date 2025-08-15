import { useEffect } from 'react';
import './common.css';

export const PreviewCommonStrategyType = () => {
  useEffect(() => {
    const path = document.getElementById(
      'path-stroke',
    ) as any as SVGPathElement;
    document.documentElement.style.setProperty(
      '--path-length',
      path.getTotalLength().toString(),
    );
  }, []);
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
        <path
          id="path-stroke"
          fill="none"
          stroke="white"
          strokeLinejoin="round"
          strokeWidth="5"
          d="M50 350 150 350 250 750 300 750 400 300 450 300 500 400 550 400 650 900 700 900 850 350 900 350 950 550 1000 550"
        />
      </defs>
    </svg>
  );
};
