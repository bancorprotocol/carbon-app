import { ReactComponent as Arrow } from 'assets/icons/arrow-round.svg';
import { prettifyNumber } from 'utils/helpers';
import { Token } from 'libs/tokens';
import { StrategyInputOrder } from 'hooks/useStrategyInput';

interface Props {
  buy: StrategyInputOrder;
  sell: StrategyInputOrder;
  baseToken: Token;
  quoteToken: Token;
}

export const SimResultSummaryTable = ({
  baseToken,
  quoteToken,
  buy,
  sell,
}: Props) => {
  const sellMin = prettifyNumber(sell.min, { abbreviate: true });
  const sellMax = prettifyNumber(sell.max, { abbreviate: true });
  const buyMin = prettifyNumber(buy.min, { abbreviate: true });
  const buyMax = prettifyNumber(buy.max, { abbreviate: true });
  const baseBudget = prettifyNumber(sell.budget, { abbreviate: true });
  const quoteBudget = prettifyNumber(buy.budget, { abbreviate: true });
  const baseSymbol = baseToken.symbol;
  const quoteSymbol = quoteToken.symbol;

  const isBuyLimitOrder = buy.min === buy.max;
  const isSellLimitOrder = sell.min === sell.max;

  return (
    <article className="grid grid-cols-[auto,auto,auto,auto] grid-rows-2 items-center justify-evenly gap-x-8 gap-y-4">
      <Arrow className="text-sell size-16 -rotate-90" />
      <span data-testid="table-sell-order-rates">
        {isSellLimitOrder ? sellMin : `${sellMin} - ${sellMax}`} {quoteSymbol}{' '}
        per {baseSymbol}
      </span>
      <span className="text-white/40">|</span>
      <span data-testid="table-sell-order-budget">
        {baseBudget} {baseSymbol}
      </span>
      <Arrow className="text-buy size-16" />
      <span data-testid="table-buy-order-rates">
        {isBuyLimitOrder ? buyMin : `${buyMin} - ${buyMax}`} {quoteSymbol} per{' '}
        {baseSymbol}
      </span>
      <span className="text-white/40">|</span>
      <span data-testid="table-buy-order-budget">
        {quoteBudget} {quoteSymbol}
      </span>
    </article>
  );
};
