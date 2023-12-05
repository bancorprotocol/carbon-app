import { Dispatch, FC, SetStateAction } from 'react';
import { useMarketIndication } from 'components/strategies/marketPriceIndication';
import { CreateOverlappingStrategySpread } from './CreateOverlappingStrategySpread';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';
import { OrderCreate } from '../useOrder';
import { UseQueryResult } from '@tanstack/react-query';
import { CreateOverlappingStrategyBudget } from './CreateOverlappingStrategyBudget';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { OverlappingStrategyGraph } from 'components/strategies/overlapping/OverlappingStrategyGraph';
import { CreateOverlappingRange } from './CreateOverlappingRange';
import { carbonSDK } from 'libs/sdk';
import useAsyncEffect from 'use-async-effect';

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

export const CreateOverlappingStrategy: FC<OverlappingStrategyProps> = (
  props
) => {
  const { base, quote, order0, order1, spreadPPM, setSpreadPPM } = props;
  const marketPrice = useMarketPrice({ base, quote });
  const { marketPricePercentage } = useMarketIndication({
    base,
    quote,
    order: {
      min: order0.min,
      max: order1.max,
      price: '',
      isRange: true,
    },
    buy: true,
  });

  // Initialize order when market price is available
  useAsyncEffect(async () => {
    if (quote && base && marketPrice > 0 && !order0.min && !order1.max) {
      const min = (marketPrice * 0.999).toString();
      const max = (marketPrice * 1.001).toString();
      order0.setMin(min);
      order1.setMax(max);
      const params = await carbonSDK.calculateOverlappingStrategyParams(
        quote.address,
        order0.min,
        order1.max,
        marketPrice.toString(),
        spreadPPM.toString()
      );
      order0.setMax(params.buyPriceHigh);
      order0.setMarginalPrice(params.buyPriceMarginal);
      order1.setMin(params.sellPriceLow);
      order1.setMarginalPrice(params.sellPriceMarginal);
    }
  }, [
    marketPrice,
    order0,
    order1,
    spreadPPM,
    order0.setMarginalPrice,
    order1.setMarginalPrice,
  ]);

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
        <a
          href="https://faq.carbondefi.xyz/what-is-an-overlapping-strategy"
          target="_blank"
          className="row-span-2 flex items-center gap-4 self-center justify-self-end text-12 font-weight-500 text-green"
          rel="noreferrer"
        >
          Learn More
          <IconLink className="h-12 w-12" />
        </a>
      </article>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <header className="flex items-center gap-8">
          <h3 className="flex-1 text-18 font-weight-500">Price Range</h3>
          <Tooltip element="Drag and drop your strategy buy and sell prices.">
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        <OverlappingStrategyGraph
          {...props}
          order0={order0}
          order1={order1}
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
          <Tooltip element="Indicate the strategy exact buy and sell prices.">
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        {base && quote && (
          <CreateOverlappingRange
            base={base}
            quote={quote}
            order0={order0}
            order1={order1}
            spreadPPM={spreadPPM}
            marketPricePercentage={marketPricePercentage}
          />
        )}
      </article>
      <article className="flex flex-col gap-10 rounded-10 bg-silver p-20">
        <header className="mb-10 flex items-center gap-8 ">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
            2
          </span>
          <h3 className="flex-1 text-18 font-weight-500">Indicate Spread</h3>
          <Tooltip element="The gap between the Buy and Sell orders price.">
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        <CreateOverlappingStrategySpread
          order0={order0}
          order1={order1}
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
          <Tooltip element="Indicate the budget you would like to allocate to the strategy. Note that in order to maintain the overlapping behavior, the 2nd budget indication will be calculated using the prices, spread and budget values.">
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        <CreateOverlappingStrategyBudget {...props} marketPrice={marketPrice} />
      </article>
    </>
  );
};
