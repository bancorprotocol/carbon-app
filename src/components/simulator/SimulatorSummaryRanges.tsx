import { ReactComponent as ArrowUp } from 'assets/icons/sim-arrow-up.svg';
import { ReactComponent as ArrowDown } from 'assets/icons/sim-arrow-down.svg';
import { SimulatorBounds } from 'libs/queries';
import { prettifyNumber } from 'utils/helpers';
import { Token } from 'libs/tokens';

interface Props {
  bounds: SimulatorBounds;
  baseToken: Token;
  quoteToken: Token;
  baseBudget: number;
  quoteBudget: number;
}

export const SimulatorSummaryRanges = ({
  baseToken,
  quoteToken,
  baseBudget,
  quoteBudget,
  bounds,
}: Props) => {
  const sellMin = prettifyNumber(bounds.bidMin, { abbreviate: true });
  const sellMax = prettifyNumber(bounds.bidMax, { abbreviate: true });
  const buyMin = prettifyNumber(bounds.askMin, { abbreviate: true });
  const buyMax = prettifyNumber(bounds.askMax, { abbreviate: true });
  const baseBudgetFormatted = prettifyNumber(baseBudget, { abbreviate: true });
  const quoteBudgetFormatted = prettifyNumber(quoteBudget, {
    abbreviate: true,
  });
  const baseSymbol = baseToken.symbol;
  const quoteSymbol = quoteToken.symbol;

  return (
    <article className="grid grid-cols-[auto,auto] grid-rows-4 items-center justify-evenly gap-2 md:grid-cols-[auto,auto,auto,auto] md:grid-rows-2">
      <ArrowUp className="mx-6" />
      <span>
        {sellMin}-{sellMax} {baseSymbol} per {quoteSymbol}
      </span>
      <span className="mx-4 text-white/40">|</span>
      {quoteBudgetFormatted} {quoteSymbol}
      <ArrowDown className="mx-6" />
      <span>
        {buyMin}-{buyMax} {baseSymbol} per {quoteSymbol}
      </span>
      <span className="mx-4 text-white/40">|</span>
      {baseBudgetFormatted} {baseSymbol}
    </article>
  );
};
