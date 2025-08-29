import { cn } from 'utils/helpers';
import { useEffect, useRef } from 'react';
import common from './preview.module.css';
import style from './recurring-range.module.css';

export const PreviewRecurringRangeStrategy = () => {
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
        'bg-black-gradient rounded-2xl p-16 shrink-0',
      )}
    >
      <svg viewBox="0 0 1000 1000">
        <g>
          <rect
            x="50"
            y="250"
            width="900"
            height="200"
            fill="url(#svg-sell-gradient)"
            fillOpacity="0.4"
          />
          <g className={style.marginalSell} transform="translate(50, 450)">
            <line
              x1="0"
              x2="900"
              y1="0"
              y2="0"
              strokeWidth="3"
              stroke="var(--color-sell)"
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
          <g transform="translate(0, 250)">
            <use href="#svg-sell-line" />
          </g>
          <g transform="translate(0, 450)">
            <use href="#svg-sell-line" />
          </g>
        </g>

        <g>
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

        <use href="#svg-axis-lines" />
        <circle
          className={common.pathMotion}
          cx="0"
          cy="0"
          r="10"
          fill="white"
        />
      </svg>

      {/* <div className={cn(common.budget, common.recurring)}>
        <div className={cn(common.price, common.sell, style.budgetSell)}>
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
          <p>
            <span>1000</span>
            <span>900</span>
            <span>800</span>
            <span>700</span>
            <span>600</span>
            <span>500</span>
            <span>400</span>
            <span>300</span>
            <span>200</span>
          </p>
          <span className={common.token}>USDC</span>
        </div>

        <div className={cn(common.price, common.buy, style.budgetBuy)}>

          <span className={common.token}>ETH</span>
        </div>
      </div> */}
    </div>
  );
};
