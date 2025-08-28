import { cn } from 'utils/helpers';
import { useEffect, useRef } from 'react';
import style from './preview.module.css';

export const PreviewFullRangeStrategy = () => {
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
        style.fullRange,
        'bg-black-gradient rounded-2xl p-16 shrink-0',
      )}
    >
      <svg viewBox="0 0 1000 1000" width="500" height="500">
        <g className="marginal-range">
          <rect
            className={cn(style.marginal, style.sell)}
            x="50"
            y="250"
            width="900"
            height="650"
            fill="url(#svg-sell-gradient)"
            fillOpacity="0.1"
          />
          <rect
            className={cn(style.marginal, style.buy)}
            x="50"
            y="250"
            width="900"
            height="650"
            fill="url(#svg-buy-gradient)"
            fillOpacity="0.1"
          />
          <rect
            x="50"
            y="250"
            width="900"
            height="650"
            fill="url(#circle-pattern)"
          />
        </g>

        <line
          x1="50"
          x2="950"
          y1="250"
          y2="250"
          stroke="white"
          strokeWidth="2"
        />
        <line
          x1="50"
          x2="950"
          y1="900"
          y2="900"
          stroke="white"
          strokeWidth="2"
        />

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
      <div className={style.trades}>
        <p>
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
          <span>7</span>
          <span>8</span>
          <span>9</span>
        </p>
        <span>Trades</span>
      </div>
      <div className={cn(style.budget)}>
        <div className={cn(style.price, style.sell)}>
          <p>100</p>
          <span className={style.token}>USDC</span>
        </div>

        <div className={cn(style.price, style.buy)}>
          <p>1000</p>
          <span className={style.token}>ETH</span>
        </div>
      </div>
    </div>
  );
};
