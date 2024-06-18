import { FC } from 'react';
import { cn } from 'utils/helpers';
import { TokenLogo } from 'components/common/imager/Imager';
import { Token } from 'libs/tokens';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { m } from 'libs/motion';
import { items } from '../common/variants';
import style from './OverlappingBudget.module.css';

interface Props {
  base: Token;
  quote: Token;
  anchor?: 'buy' | 'sell';
  setAnchor: (order: 'buy' | 'sell') => void;
  disableBuy: boolean;
  disableSell: boolean;
  anchorError?: string;
}
export const OverlappingAnchor: FC<Props> = (props) => {
  const { base, quote, anchor, setAnchor, anchorError } = props;
  return (
    <m.article
      variants={items}
      className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20"
    >
      <header className="flex items-center justify-between">
        <h2 className="text-18">Budget</h2>
        <Tooltip
          iconClassName="size-18 text-white/60"
          element="Indicate the token, action and amount for the strategy. Note that in order to maintain the concentrated liquidity behavior, the 2nd budget indication will be calculated using the prices, fee tier and budget values you use."
        />
      </header>
      <p className="text-14 text-white/80">Please select a token to proceed.</p>
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
        />
        <label
          htmlFor="anchor-sell"
          className="rounded-8 text-14 flex flex-1 cursor-pointer items-center justify-center gap-8 bg-black p-16"
          data-testid="anchor-sell"
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
        />
        <label
          htmlFor="anchor-buy"
          className="rounded-8 text-14 flex flex-1 cursor-pointer items-center justify-center gap-8 bg-black p-16"
          data-testid="anchor-buy"
        >
          <TokenLogo token={quote} size={14} />
          {quote.symbol}
        </label>
      </div>
      {anchorError && (
        <Warning message={anchorError} isError data-testid="require-anchor" />
      )}
    </m.article>
  );
};
