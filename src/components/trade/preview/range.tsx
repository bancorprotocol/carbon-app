import { cn } from 'utils/helpers';
import { useEffect, useRef } from 'react';
import style from './common.module.css';

export const PreviewRangeStrategy = () => {
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
      className={cn(style.graphWrapper, 'rounded-2xl p-16 shrink-0')}
    >
      <svg viewBox="0 0 1000 1000">
        <rect
          x="50"
          y="650"
          width="900"
          height="200"
          fill="url(#svg-buy-gradient)"
          fillOpacity="0.4"
        />

        <g className={style.marginalBuy} transform="translate(50, 650)">
          <line
            x1="0"
            x2="900"
            y1="0"
            y2="0"
            strokeWidth="3"
            stroke="var(--color-buy)"
          />
          <rect
            x="0"
            y="0"
            width="900"
            height="1"
            fill="black"
            fillOpacity="0.4"
          />
        </g>

        <g transform="translate(0, 650)">
          <use href="#svg-buy-line" />
        </g>
        <g transform="translate(0, 850)">
          <use href="#svg-buy-line" />
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

        <g transform="translate(238, 700) rotate(78) scale(0.9)">
          <use className={style.buy1} href="#buy-range" />
        </g>
        <g transform="translate(627, 795) rotate(78) scale(0.9)">
          <use className={style.buy2} href="#buy-range" />
        </g>

        <use href="#svg-axis-lines" />
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
