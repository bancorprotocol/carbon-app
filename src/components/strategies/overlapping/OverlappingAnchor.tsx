import { FC } from 'react';
import { cn } from 'utils/helpers';
import { TokenLogo } from 'components/common/imager/Imager';
import { Token } from 'libs/tokens';
import style from './OverlappingBudget.module.css';

interface Props {
  base: Token;
  quote: Token;
  anchor?: 'buy' | 'sell';
  setAnchor: (order: 'buy' | 'sell') => void;
  disableBuy: boolean;
  disableSell: boolean;
}
export const OverlappingAnchor: FC<Props> = (props) => {
  const { base, quote, anchor, setAnchor } = props;
  return (
    <>
      <h3 className="text-16 font-weight-500 flex items-center gap-8">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px] text-white/60">
          1
        </span>
        Select Token
      </h3>
      <div role="radiogroup" className="flex gap-16">
        {/* SELL */}
        <input
          className={cn('absolute opacity-0', style.selectToken)}
          type="radio"
          name="anchor"
          id="anchor-sell"
          checked={anchor === 'sell'}
          onChange={(e) => e.target.checked && setAnchor('sell')}
          disabled={props.disableSell}
          required
          data-testid="anchor-sell"
        />
        <label
          htmlFor="anchor-sell"
          data-testid="anchor-sell-label"
          className="rounded-8 text-14 flex flex-1 cursor-pointer items-center justify-center gap-8 bg-black p-16"
        >
          <TokenLogo token={base} size={14} />
          {base.symbol}
        </label>
        {/* BUY */}
        <input
          className={cn('absolute opacity-0', style.selectToken)}
          type="radio"
          name="anchor"
          id="anchor-buy"
          checked={anchor === 'buy'}
          onChange={(e) => e.target.checked && setAnchor('buy')}
          disabled={props.disableBuy}
          required
          data-testid="anchor-buy"
        />
        <label
          htmlFor="anchor-buy"
          data-testid="anchor-buy-label"
          className="rounded-8 text-14 flex flex-1 cursor-pointer items-center justify-center gap-8 bg-black p-16"
        >
          <TokenLogo token={quote} size={14} />
          {quote.symbol}
        </label>
      </div>
    </>
  );
};
