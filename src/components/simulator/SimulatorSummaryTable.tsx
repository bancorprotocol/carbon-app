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

export const SimulatorSummaryTable = ({
  baseToken,
  quoteToken,
  buy,
  sell,
}: Props) => {
  const sellMin = prettifyNumber(sell.min, { abbreviate: true });
  const sellMax = prettifyNumber(sell.max, { abbreviate: true });
  const buyMin = prettifyNumber(buy.min, { abbreviate: true });
  const buyMax = prettifyNumber(buy.max, { abbreviate: true });
  const baseBudget = prettifyNumber(sell.budget, {
    abbreviate: true,
  });
  const quoteBudget = prettifyNumber(buy.budget, {
    abbreviate: true,
  });
  const baseBudgetFormatted = prettifyNumber(baseBudget, { abbreviate: true });
  const quoteBudgetFormatted = prettifyNumber(quoteBudget, {
    abbreviate: true,
  });
  const baseSymbol = baseToken.symbol;
  const quoteSymbol = quoteToken.symbol;

  return (
    <article className="grid grid-cols-[auto,auto] grid-rows-4 items-center justify-evenly gap-6 md:grid-cols-[auto,auto,auto,auto] md:grid-rows-2">
      <Arrow className="h-16 w-16 text-green" />
      {buyMin}-{buyMax} {baseSymbol} per {quoteSymbol}
      <span className="text-white/40">|</span>
      {quoteBudgetFormatted} {quoteSymbol}
      <Arrow className="h-16 w-16 -rotate-90 text-red" />
      {sellMin}-{sellMax} {baseSymbol} per {quoteSymbol}
      <span className="text-white/40">|</span>
      {baseBudgetFormatted} {baseSymbol}
    </article>
  );
};
