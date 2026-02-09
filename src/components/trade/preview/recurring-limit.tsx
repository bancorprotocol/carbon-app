import { cn } from 'utils/helpers';
import { useEffect, useRef } from 'react';
import common from './common.module.css';

export const PreviewRecurringLimitStrategy = () => {
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
        common.graphWrapper,
        common.recurringRange,
        'rounded-2xl p-16 shrink-0',
      )}
    >
      <svg viewBox="0 0 1000 1000">
        <g transform="translate(0, 450)">
          <use href="#svg-sell-line" />
        </g>
        <g transform="translate(0, 650)">
          <use href="#svg-buy-line" />
        </g>

        <path
          ref={path}
          className={common.pathStroke}
          fill="none"
          stroke="white"
          strokeLinejoin="round"
          strokeWidth="5"
          d="M50 350 150 350 250 750 300 750 400 300 450 300 500 400 550 400 650 900 700 900 850 350 900 350 950 550 1000 550"
        />

        <g transform="translate(375, 450)">
          <use className={common.sell1} href="#sell-box" />
        </g>
        <g transform="translate(825, 450)">
          <use className={common.sell2} href="#sell-box" />
        </g>
        <g transform="translate(211, 650)">
          <use className={common.buy1} href="#buy-box" />
        </g>
        <g transform="translate(600, 650)">
          <use className={common.buy2} href="#buy-box" />
        </g>

        <use href="#svg-axis-lines" />
        <circle
          className={common.pathMotion}
          cx="0"
          cy="0"
          r="10"
          fill="var(--color-main-0)"
        />
      </svg>

      <div className={cn(common.budget, common.recurring, common.limit)}>
        <div className={cn(common.price, common.sell)}>
          <p>
            <span>0</span>
            <span>1000</span>
            <span>0</span>
            <span>1100</span>
            <span>0</span>
          </p>
          <span className={common.token}>USDC</span>
        </div>

        <div className={cn(common.price, common.buy)}>
          <p>
            <span>100</span>
            <span>0</span>
            <span>120</span>
            <span>0</span>
            <span>130</span>
          </p>
          <span className={common.token}>ETH</span>
        </div>
      </div>
    </div>
  );
};
