import { cn } from 'utils/helpers';
import style from './preview.module.css';

export const PreviewRangeStrategy = () => {
  return (
    <div
      className={cn(
        style.graphWrapper,
        'bg-black-gradient rounded-2xl p-16 shrink-0',
      )}
    >
      <svg id="limit_limit" viewBox="0 0 1000 1000" width="500" height="500">
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

        <g transform="translate(238, 700) rotate(78) scale(0.9)">
          <use id="buy-1" href="#buy-range" />
        </g>
        <g transform="translate(622, 750) rotate(78) scale(0.8)">
          <use id="buy-2" href="#buy-range" />
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
      <div className={cn(style.budget, style.range)}>
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
