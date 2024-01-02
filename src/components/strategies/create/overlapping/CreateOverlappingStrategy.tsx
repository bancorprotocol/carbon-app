import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { useMarketIndication } from 'components/strategies/marketPriceIndication';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';
import { OrderCreate } from '../useOrder';
import { UseQueryResult } from '@tanstack/react-query';
import { CreateOverlappingStrategyBudget } from './CreateOverlappingStrategyBudget';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { OverlappingStrategyGraph } from 'components/strategies/overlapping/OverlappingStrategyGraph';
import { OverlappingStrategySpread } from 'components/strategies/overlapping/OverlappingStrategySpread';
import { CreateOverlappingRange } from './CreateOverlappingRange';
import { carbonSDK } from 'libs/sdk';
import { Toolkit } from '@bancor/carbon-sdk/strategy-management';
import {
  getMaxBuyMin,
  getMinSellMax,
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';

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
type FromPromise<T> = T extends Promise<infer I> ? I : never;
type StrategyPrices = FromPromise<
  ReturnType<Toolkit['calculateOverlappingStrategyPrices']>
>;

export type SetOverlappingParams = (
  min: string,
  max: string
) => Promise<StrategyPrices | undefined>;

export const CreateOverlappingStrategy: FC<OverlappingStrategyProps> = (
  props
) => {
  const { base, quote, order0, order1, spreadPPM, setSpreadPPM } = props;
  const marketPrice = useMarketPrice({ base, quote });
  const [anchoredOrder, setAnchoderOrder] = useState<'buy' | 'sell'>('buy');
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

  const setOverlappingParams = async (min: string, max: string) => {
    const params = await carbonSDK.calculateOverlappingStrategyPrices(
      quote!.address,
      min,
      max,
      marketPrice.toString(),
      spreadPPM.toString()
    );
    order0.setMin(min);
    order0.setMax(params.buyPriceHigh);
    order0.setMarginalPrice(params.buyPriceMarginal);
    order1.setMin(params.sellPriceLow);
    order1.setMax(max);
    order1.setMarginalPrice(params.sellPriceMarginal);
    return params;
  };

  const setBuyBudget = async (
    sellBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    if (!sellBudget) return order0.setBudget('');
    const buyBudget = await carbonSDK.calculateOverlappingStrategyBuyBudget(
      base.address,
      quote.address,
      buyMin,
      sellMax,
      marketPrice.toString(),
      spreadPPM.toString(),
      sellBudget
    );
    order0.setBudget(buyBudget);
  };

  const setSellBudget = async (
    buyBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    if (!buyBudget) return order1.setBudget('');
    const sellBudget = await carbonSDK.calculateOverlappingStrategySellBudget(
      base.address,
      quote.address,
      buyMin,
      sellMax,
      marketPrice.toString(),
      spreadPPM.toString(),
      buyBudget
    );
    order1.setBudget(sellBudget);
  };

  // Initialize order when market price is available
  useEffect(() => {
    if (!quote || !base || marketPrice <= 0) return;
    if (!order0.min && !order1.max) {
      const min = (marketPrice * 0.999).toFixed(quote.decimals);
      const max = (marketPrice * 1.001).toFixed(quote.decimals);
      setOverlappingParams(min, max);
    } else {
      const min = order0.min;
      const max = order1.max;
      if (min && max) setOverlappingParams(min, max);
      if (anchoredOrder === 'buy') setSellBudget(order0.budget, min, max);
      if (anchoredOrder === 'sell') setBuyBudget(order1.budget, min, max);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketPrice, spreadPPM]);

  // Update on buyMin changes
  useEffect(() => {
    const min = order0.min;
    const max = order1.max;
    if (!min) return;
    if (max) {
      setOverlappingParams(min, max).then((params) => {
        const marginalPrice = params.buyPriceMarginal;
        if (isMinAboveMarket({ min, marginalPrice }, quote)) {
          setAnchoderOrder('sell');
          setBuyBudget(order1.budget, min, max);
        } else {
          if (anchoredOrder === 'buy') setSellBudget(order0.budget, min, max);
          if (anchoredOrder === 'sell') setBuyBudget(order1.budget, min, max);
        }
      });
    }
    const timeout = setTimeout(async () => {
      const decimals = quote?.decimals ?? 18;
      const minSellMax = getMinSellMax(Number(min), spreadPPM);
      if (Number(max) < minSellMax) order1.setMax(minSellMax.toFixed(decimals));
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.min]);

  // Update on sellMax changes
  useEffect(() => {
    const min = order0.min;
    const max = order1.max;
    if (!max) return;
    if (min) {
      setOverlappingParams(min, max).then((params) => {
        const marginalPrice = params.sellPriceMarginal;
        if (isMaxBelowMarket({ max, marginalPrice }, quote)) {
          setAnchoderOrder('buy');
          setSellBudget(order0.budget, min, max);
        } else {
          if (anchoredOrder === 'buy') setSellBudget(order0.budget, min, max);
          if (anchoredOrder === 'sell') setBuyBudget(order1.budget, min, max);
        }
      });
    }
    const timeout = setTimeout(async () => {
      const decimals = quote?.decimals ?? 18;
      const maxBuyMin = getMaxBuyMin(Number(max), spreadPPM);
      if (Number(min) > maxBuyMin) order0.setMin(maxBuyMin.toFixed(decimals));
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order1.max]);

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
          setOverlappingParams={setOverlappingParams}
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
          <Tooltip element="The difference between the highest bidding (Sell) price, and the lowest asking (Buy) price">
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        <OverlappingStrategySpread
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
        <CreateOverlappingStrategyBudget
          {...props}
          marketPrice={marketPrice}
          anchoredOrder={anchoredOrder}
          setAnchoderOrder={setAnchoderOrder}
          setBuyBudget={setBuyBudget}
          setSellBudget={setSellBudget}
        />
      </article>
    </>
  );
};
