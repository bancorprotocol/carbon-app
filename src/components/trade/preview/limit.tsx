import { cn } from 'utils/helpers';
import { useEffect, useRef } from 'react';
import style from './preview.module.css';

export const PreviewLimitStrategy = () => {
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
        'bg-black-gradient rounded-2xl p-16 shrink-0',
      )}
    >
      <svg viewBox="0 0 1000 1000">
        <line
          x1="50"
          x2="950"
          y1="650"
          y2="650"
          strokeWidth="3"
          stroke="var(--color-buy)"
        />
        <g transform="translate(950, 650)">
          <use href="#buy-indicator" />
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

        <g transform="translate(211, 650)">
          <use className={style.buy1} href="#buy-box" />
        </g>

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

      <div className={cn(style.budget, style.disposable, style.limit)}>
        <div className={cn(style.price, style.sell)}>
          <p>
            <span>0</span>
            <span>1000</span>
          </p>
          <span className={style.token}>USDC</span>
        </div>

        <div className={cn(style.price, style.buy)}>
          <p>
            <span>100</span>
            <span>0</span>
          </p>
          <span className={style.token}>ETH</span>
        </div>
      </div>
    </div>
  );
};
