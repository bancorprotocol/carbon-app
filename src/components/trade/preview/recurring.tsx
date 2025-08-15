import { cn } from 'utils/helpers';
import style from './preview.module.css';

export const PreviewRecurringStrategy = () => {
  return (
    <div
      className={cn(
        style.graphWrapper,
        'bg-black-gradient rounded-2xl p-16 shrink-0',
      )}
    >
      <svg id="limit_limit" viewBox="0 0 1000 1000">
        <line
          x1="50"
          x2="950"
          y1="450"
          y2="450"
          strokeWidth="3"
          stroke="var(--color-sell)"
        />
        <g transform="translate(950, 450)">
          <use href="#sell-indicator" />
        </g>
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

        <use href="#path-stroke" />

        <g transform="translate(375, 450)">
          <use className={style.sell1} href="#sell-box" />
        </g>
        <g transform="translate(825, 450)">
          <use className={style.sell2} href="#sell-box" />
        </g>
        <g transform="translate(211, 650)">
          <use className={style.buy1} href="#buy-box" />
        </g>
        <g transform="translate(600, 650)">
          <use className={style.buy2} href="#buy-box" />
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

      <div className={cn(style.budget, style.limit)}>
        <div className={cn(style.price, style.sell)}>
          <p>
            <span>0</span>
            <span>1000</span>
            <span>0</span>
            <span>1100</span>
            <span>0</span>
          </p>
          <span className={style.token}>USDC</span>
        </div>

        <div className={cn(style.price, style.buy)}>
          <p>
            <span>100</span>
            <span>0</span>
            <span>120</span>
            <span>0</span>
            <span>130</span>
          </p>
          <span className={style.token}>ETH</span>
        </div>
      </div>
    </div>
  );
};
