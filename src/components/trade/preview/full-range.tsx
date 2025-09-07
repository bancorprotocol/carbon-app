import { cn } from 'utils/helpers';
import { useEffect, useRef } from 'react';
import common from './common.module.css';
import style from './full-range.module.css';

interface Props {
  className?: string;
  running?: boolean;
}
export const PreviewFullRangeStrategy = ({ running, className }: Props) => {
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
        { [common.running]: running },
        common.graphWrapper,
        common.fullRange,
        'rounded-2xl p-16 shrink-0',
        className,
      )}
    >
      <svg viewBox="0 0 1000 1000">
        <g className="marginal-range">
          <rect
            className={cn(common.marginal, common.sell)}
            x="50"
            y="250"
            width="900"
            height="650"
            fill="url(#svg-sell-gradient)"
            fillOpacity="0.1"
          />
          <rect
            className={cn(common.marginal, common.buy)}
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
      <div className={style.trades}>
        <p>
          {new Array(41).fill(null).map((_, i) => (
            <span key={i}>{i}</span>
          ))}
        </p>
        <span>Trades</span>
      </div>
      <aside className={style.budget}>
        <div className={style.initialSell}>↓ 1 ETH</div>
        <div className={style.initialBuy}>↓ 3000 USDC</div>

        <div className={style.currentSell}>
          <div
            style={{ transform: 'scaleY(0.5)' }}
            className={style.range}
          ></div>
          <span className="text-16">1 ETH</span>
        </div>
        <div className={style.currentBuy}>
          <div
            style={{ transform: 'scaleY(0.5)' }}
            className={style.range}
          ></div>
          <span className="text-16">3000 USDC</span>
        </div>

        <div className={style.finalSell}>1 ETH</div>
        <div className={style.finalBuy}>3000 USDC</div>
      </aside>
    </div>
  );
};
