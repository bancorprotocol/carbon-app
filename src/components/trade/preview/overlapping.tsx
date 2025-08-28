import { cn } from 'utils/helpers';
import { useEffect, useRef } from 'react';
import style from './preview.module.css';

export const PreviewOverlappingStrategy = () => {
  const path = useRef<SVGPathElement>(null);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    root.current!.style.setProperty(
      '--path-length',
      path.current!.getTotalLength().toString(),
    );
  }, []);
  return (
    <div
      ref={root}
      className={cn(
        style.graphWrapper,
        style.overlapping,
        'bg-black-gradient rounded-2xl p-16 shrink-0',
      )}
    >
      <svg viewBox="0 0 1000 1000" width="500" height="500">
        <g className="rect-ranges">
          {/* Marginal */}
          <rect
            className={cn(style.marginal, style.sell)}
            x="50"
            y="350"
            width="900"
            height="300"
            fill="url(#svg-sell-gradient)"
            fillOpacity="0.1"
          />
          <rect
            className={cn(style.marginal, style.buy)}
            x="50"
            y="350"
            width="900"
            height="300"
            fill="url(#svg-buy-gradient)"
            fillOpacity="0.1"
          />
          <rect
            x="50"
            y="350"
            width="900"
            height="300"
            fill="url(#circle-pattern)"
          />

          {/* Sell */}
          <rect
            x="50"
            y="250"
            height="100"
            width="900"
            fill="url(#svg-sell-gradient)"
            fillOpacity="0.4"
          />
          {/* Buy */}
          <rect
            x="50"
            y="650"
            height="100"
            width="900"
            fill="url(#svg-buy-gradient)"
            fillOpacity="0.4"
          />
        </g>
        <g className="sell-range">
          <line
            x1="50"
            x2="950"
            y1="250"
            y2="250"
            strokeWidth="3"
            stroke="var(--color-sell)"
          />
          <g transform="translate(950, 250)">
            <use href="#sell-indicator" />
          </g>
          <line
            x1="50"
            x2="950"
            y1="650"
            y2="650"
            strokeWidth="3"
            stroke="var(--color-sell)"
          />
          <g transform="translate(950, 650)">
            <use href="#sell-indicator" />
          </g>
        </g>

        <g className="buy-range">
          <line
            x1="50"
            x2="950"
            y1="350"
            y2="350"
            strokeWidth="3"
            stroke="var(--color-buy)"
          />
          <g transform="translate(950, 350)">
            <use href="#buy-indicator" />
          </g>
          <line
            x1="50"
            x2="950"
            y1="750"
            y2="750"
            strokeWidth="3"
            stroke="var(--color-buy)"
          />
          <g transform="translate(950, 750)">
            <use href="#buy-indicator" />
          </g>
        </g>

        <path
          ref={path}
          className={style.pathStroke}
          fill="none"
          stroke="white"
          strokeLinejoin="round"
          strokeWidth="5"
          d="M50 350 150 350 250 750 300 750 400 300 450 300 500 400 550 400 650 900 700 900 850 350 900 350 950 550 1000 550"
        />

        <line
          x1="50"
          x2="950"
          y1="950"
          y2="950"
          strokeWidth="3"
          stroke="white"
        />
        <line x1="50" x2="50" y1="50" y2="950" strokeWidth="3" stroke="white" />
        <circle
          className={style.pathMotion}
          cx="0"
          cy="0"
          r="10"
          fill="white"
        />
      </svg>
      <div className={cn(style.budget, style.disposable, style.range)}>
        <div className={cn(style.price, style.sell)}>
          <p>
            <span>0</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>400</span>
            <span>500</span>
            <span>600</span>
            <span>700</span>
            <span>800</span>
            <span>900</span>
            <span>1000</span>
          </p>
          <span className={style.token}>USDC</span>
        </div>

        <div className={cn(style.price, style.buy)}>
          <p>
            <span>100</span>
            <span>88</span>
            <span>74</span>
            <span>62</span>
            <span>51</span>
            <span>40</span>
            <span>31</span>
            <span>24</span>
            <span>15</span>
            <span>9</span>
            <span>0</span>
          </p>
          <span className={style.token}>ETH</span>
        </div>
      </div>
    </div>
  );
};
