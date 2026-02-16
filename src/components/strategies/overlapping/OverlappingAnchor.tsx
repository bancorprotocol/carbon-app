import { FC } from 'react';
import { cn } from 'utils/helpers';
import { TokenLogo } from 'components/common/imager/Imager';
import { Token } from 'libs/tokens';
import style from './OverlappingAnchor.module.css';

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
      <h2 className="text-16 font-medium flex items-center gap-8">
        Select Token
      </h2>
      <div
        role="radiogroup"
        className="flex gap-8 input-container p-4 rounded-2xl tab-list"
      >
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
          className="rounded-md text-14 flex flex-1 cursor-pointer items-center justify-center gap-8 hover:bg-main-600/20 active:scale-90 p-16 border border-transparent"
        >
          <TokenLogo token={base} size={20} />
          {base.symbol}
        </label>
        <hr className="h-2/3 self-center border-l border-main-500/40" />
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
          className="rounded-md text-14 flex flex-1 cursor-pointer items-center justify-center gap-8 hover:bg-main-600/20 active:scale-90 p-16 border border-transparent"
        >
          <TokenLogo token={quote} size={20} />
          {quote.symbol}
        </label>
      </div>
    </>
  );
};
