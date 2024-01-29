import { ReactComponent as Arrow } from 'assets/icons/arrow-round.svg';
import { prettifyNumber } from 'utils/helpers';
import { Token } from 'libs/tokens';
import { SimulatorSearch } from 'libs/routing';

interface Props {
  summaryData: Pick<
    SimulatorSearch,
    'sellMin' | 'sellMax' | 'buyMin' | 'buyMax' | 'baseBudget' | 'quoteBudget'
  >;
  baseToken: Token;
  quoteToken: Token;
}

export const SimulatorSummaryTable = ({
  baseToken,
  quoteToken,
  summaryData,
}: Props) => {
  const sellMin = prettifyNumber(summaryData.sellMin, { abbreviate: true });
  const sellMax = prettifyNumber(summaryData.sellMax, { abbreviate: true });
  const buyMin = prettifyNumber(summaryData.buyMin, { abbreviate: true });
  const buyMax = prettifyNumber(summaryData.buyMax, { abbreviate: true });
  const baseBudget = prettifyNumber(summaryData.baseBudget, {
    abbreviate: true,
  });
  const quoteBudget = prettifyNumber(summaryData.quoteBudget, {
    abbreviate: true,
  });
  const baseBudgetFormatted = prettifyNumber(baseBudget, { abbreviate: true });
  const quoteBudgetFormatted = prettifyNumber(quoteBudget, {
    abbreviate: true,
  });
  const baseSymbol = baseToken.symbol;
  const quoteSymbol = quoteToken.symbol;

  return (
    <article className="grid grid-cols-[auto,auto] grid-rows-4 items-center justify-evenly gap-2 md:grid-cols-[auto,auto,auto,auto] md:grid-rows-2">
      <Arrow className="mx-6 h-16 w-16 text-green" />
      <span>
        {buyMin}-{buyMax} {baseSymbol} per {quoteSymbol}
      </span>
      <span className="mx-4 text-white/40">|</span>
      {quoteBudgetFormatted} {quoteSymbol}
      <Arrow className="mx-6 h-16 w-16 -rotate-90 text-red" />
      <span>
        {sellMin}-{sellMax} {baseSymbol} per {quoteSymbol}
      </span>
      <span className="mx-4 text-white/40">|</span>
      {baseBudgetFormatted} {baseSymbol}
    </article>
  );
};
