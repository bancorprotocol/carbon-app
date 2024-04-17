import { FC } from 'react';
import { cn } from 'utils/helpers';
import { TokenLogo } from 'components/common/imager/Imager';
import { Token } from 'libs/tokens';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import style from './OverlappingBudget.module.css';

interface Props {
  base: Token;
  quote: Token;
  anchor?: 'buy' | 'sell';
  setAnchor: (order: 'buy' | 'sell') => void;
  anchorError: string;
  disableBuy: boolean;
  disableSell: boolean;
}
export const OverlappingAnchor: FC<Props> = (props) => {
  const { base, quote, anchor, setAnchor, anchorError } = props;
  return (
    <article className="flex w-full flex-col gap-16 rounded-10 bg-background-900 p-20">
      <h2 className="text-18">Budget</h2>
      <p className="text-14 text-white/80">
        Please specify which token you'd prefer to use as the anchor.
      </p>
      <h3 className="flex items-center gap-8 text-16 font-weight-500">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
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
        />
        <label
          htmlFor="anchor-sell"
          className="flex flex-1 cursor-pointer items-center justify-center gap-8 rounded-8 bg-black p-16 text-14"
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
        />
        <label
          htmlFor="anchor-buy"
          className="flex flex-1 cursor-pointer items-center justify-center gap-8 rounded-8 bg-black p-16 text-14"
        >
          <TokenLogo token={quote} size={14} />
          {quote.symbol}
        </label>
      </div>
      {anchorError && <WarningMessageWithIcon message={anchorError} isError />}
    </article>
  );
};
