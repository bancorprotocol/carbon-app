import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import {
  MarketPricePercentage,
  useMarketIndication,
} from 'components/strategies/marketPriceIndication';
import { CreateOverlappingStrategySpread } from './CreateOverlappingStrategySpread';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { InputRange } from '../BuySellBlock/InputRange';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';
import { OrderCreate } from '../useOrder';
import { UseQueryResult } from '@tanstack/react-query';
import { CreateOverlappingStrategyBudget } from './CreateOverlappingStrategyBudget';
import { CreateOverlappingStrategyGraph } from './CreateOverlappingStrategyGraph';
import { useMarketPrice } from 'hooks/useMarketPrice';

export interface OverlappingStrategyProps {
  base?: Token;
  quote?: Token;
  order0: OrderCreate;
  order1: OrderCreate;
  token0BalanceQuery: UseQueryResult<string, any>;
  token1BalanceQuery: UseQueryResult<string, any>;
  spreadPPM: number;
  setSpreadPPM: Dispatch<SetStateAction<number>>;
}

const getPriceWarnings = ({ min, max }: MarketPricePercentage): string[] => {
  const aboveOrBelowMarket = min.gt(0) || max.lt(0);
  if (!aboveOrBelowMarket) return [];
  return [
    'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.',
  ];
};

export const CreateOverlappingStrategy: FC<OverlappingStrategyProps> = (
  props
) => {
  const { base, quote, order0, spreadPPM, setSpreadPPM } = props;
  const marketPrice = useMarketPrice({ base, quote });
  const { marketPricePercentage } = useMarketIndication({
    base,
    quote,
    order: order0,
    buy: true,
  });
  const priceWarnings = getPriceWarnings(marketPricePercentage);

  // Initialize order when market price is available
  useEffect(() => {
    if (marketPrice > 0 && !order0.min && !order0.max) {
      order0.setMin((marketPrice * 0.999).toString());
      order0.setMax((marketPrice * 1.001).toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketPrice]);

  return (
    <>
      <article className="grid grid-flow-col grid-cols-[auto_auto] grid-rows-2 gap-8 rounded-10 bg-silver p-20">
        <h4 className="flex items-center gap-8 text-14 font-weight-500">
          Discover Overlapping Strategies
          <span className="rounded-8 bg-darkGreen px-8 py-4 text-10 text-green">
            NEW
          </span>
        </h4>
        <p className="text-12 text-white/60">
          Learn more about the new type of strategy creation.
        </p>
        {/* TODO: Set url */}
        <a
          href="/"
          target="_blank"
          className="row-span-2 flex items-center gap-4 self-center justify-self-end text-12 font-weight-500 text-green"
        >
          Learn More
          <IconLink className="h-12 w-12" />
        </a>
      </article>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <header className="flex items-center gap-8">
          <h3 className="flex-1 text-18 font-weight-500">Price Range</h3>
          {/* TODO add tooltip text here */}
          <Tooltip element={''}>
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        <CreateOverlappingStrategyGraph
          {...props}
          marketPrice={marketPrice}
          marketPricePercentage={marketPricePercentage}
        />
      </article>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <header className="flex items-center gap-8">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
            1
          </span>
          <h3 className="flex-1 text-18 font-weight-500">
            Set Price Range&nbsp;
            <span className="text-white/40">
              ({quote?.symbol} per 1 {base?.symbol})
            </span>
          </h3>
          {/* TODO add tooltip text here */}
          <Tooltip element={''}>
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        {base && quote && (
          <InputRange
            base={base}
            quote={quote}
            min={order0.min}
            max={order0.max}
            setMin={order0.setMin}
            setMax={order0.setMax}
            minLabel="Min Buy Price"
            maxLabel="Max Sell Price"
            error={order0.rangeError}
            warnings={priceWarnings}
            setRangeError={order0.setRangeError}
            marketPricePercentages={marketPricePercentage}
          />
        )}
      </article>
      <article className="flex flex-col gap-10 rounded-10 bg-silver p-20">
        <header className="mb-10 flex items-center gap-8 ">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
            2
          </span>
          <h3 className="flex-1 text-18 font-weight-500">Indicate Spread</h3>
          {/* TODO add tooltip text here */}
          <Tooltip element={''}>
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        <CreateOverlappingStrategySpread
          defaultValue={0.05}
          options={[0.01, 0.05, 0.1]}
          spreadPPM={spreadPPM}
          setSpreadPPM={setSpreadPPM}
        />
      </article>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <header className="flex items-center gap-8 ">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
            3
          </span>
          <h3 className="flex-1 text-18 font-weight-500">Set Budgets</h3>
          {/* TODO add tooltip text here */}
          <Tooltip element={''}>
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        <CreateOverlappingStrategyBudget
          {...props}
          marketPricePercentage={marketPricePercentage}
        />
      </article>
    </>
  );
};
