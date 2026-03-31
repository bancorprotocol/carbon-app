import SouthEastIcon from 'assets/icons/south_east.svg?react';
import { prettifyNumber } from 'utils/helpers';
import { Token } from 'libs/tokens';
import { StrategyInputOrder } from 'hooks/useStrategyInput';

interface Props {
  buy: StrategyInputOrder;
  sell: StrategyInputOrder;
  base: Token;
  quote: Token;
}

export const SimResultSummaryTable = ({ base, quote, buy, sell }: Props) => {
  const sellMin = prettifyNumber(sell.min, { abbreviate: true });
  const sellMax = prettifyNumber(sell.max, { abbreviate: true });
  const buyMin = prettifyNumber(buy.min, { abbreviate: true });
  const buyMax = prettifyNumber(buy.max, { abbreviate: true });
  const baseBudget = prettifyNumber(sell.budget, { abbreviate: true });
  const quoteBudget = prettifyNumber(buy.budget, { abbreviate: true });
  const baseSymbol = base.symbol;
  const quoteSymbol = quote.symbol;

  const isBuyLimitOrder = buy.min === buy.max;
  const isSellLimitOrder = sell.min === sell.max;

  return (
    <article className="grid grid-cols-[auto_auto_auto_auto] grid-rows-2 items-center justify-evenly gap-x-8 gap-y-4">
      <div className="bg-sell/20 size-20 grid place-items-center rounded-full">
        <SouthEastIcon className="text-sell size-12 -rotate-90" />
      </div>
      <span data-testid="table-sell-order-rates">
        {isSellLimitOrder ? sellMin : `${sellMin} - ${sellMax}`} {quoteSymbol}{' '}
        per {baseSymbol}
      </span>
      <span className="text-main-0/40">|</span>
      <span data-testid="table-sell-order-budget">
        {baseBudget} {baseSymbol}
      </span>
      <div className="bg-buy/20 size-20 grid place-items-center rounded-full">
        <SouthEastIcon className="text-buy size-12" />
      </div>
      <span data-testid="table-buy-order-rates">
        {isBuyLimitOrder ? buyMin : `${buyMin} - ${buyMax}`} {quoteSymbol} per{' '}
        {baseSymbol}
      </span>
      <span className="text-main-0/40">|</span>
      <span data-testid="table-buy-order-budget">
        {quoteBudget} {quoteSymbol}
      </span>
    </article>
  );
};
