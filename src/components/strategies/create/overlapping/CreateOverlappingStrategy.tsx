import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { useMarketIndication } from 'components/strategies/marketPriceIndication';
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
import {
  getMaxBuyMin,
  getMinSellMax,
  isMaxBelowMarket,
  isMinAboveMarket,
  isValidSpread,
} from 'components/strategies/overlapping/utils';
import { isValidRange } from 'components/strategies/utils';
import { SafeDecimal } from 'libs/safedecimal';
import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';

export interface OverlappingStrategyProps {
  base?: Token;
  quote?: Token;
  order0: OrderCreate;
  order1: OrderCreate;
  token0BalanceQuery: UseQueryResult<string, any>;
  token1BalanceQuery: UseQueryResult<string, any>;
  spread: number;
  setSpread: Dispatch<SetStateAction<number>>;
}

const getInitialPrices = (marketPrice: string | number) => {
  const currentPrice = new SafeDecimal(marketPrice);
  return {
    min: currentPrice.times(0.99).toString(),
    max: currentPrice.times(1.01).toString(),
  };
};

export const CreateOverlappingStrategy: FC<OverlappingStrategyProps> = (
  props
) => {
  const { base, quote, order0, order1, spread, setSpread } = props;
  const marketPrice = useMarketPrice({ base, quote });
  const [anchoredOrder, setAnchoredOrder] = useState<'buy' | 'sell'>('buy');
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

  const setBuyBudget = (
    sellBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    if (!sellBudget) return order0.setBudget('');
    try {
      const buyBudget = calculateOverlappingBuyBudget(
        base.decimals,
        quote.decimals,
        buyMin,
        sellMax,
        marketPrice.toString(),
        spread.toString(),
        sellBudget
      );
      order0.setBudget(buyBudget);
    } catch (err) {
      console.error(err);
      order0.setBudget('');
    }
  };

  const setSellBudget = (
    buyBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    if (!buyBudget) return order1.setBudget('');
    try {
      const sellBudget = calculateOverlappingSellBudget(
        base.decimals,
        quote.decimals,
        buyMin,
        sellMax,
        marketPrice.toString(),
        spread.toString(),
        buyBudget
      );
      order1.setBudget(sellBudget);
    } catch (err) {
      console.error(err);
      order1.setBudget('');
    }
  };

  const setOverlappingParams = (min: string, max: string) => {
    // Set min & max.
    order0.setMin(min);
    order1.setMax(max);

    // If invalid range, wait for timeout to reset range
    if (!isValidRange(min, max) || !isValidSpread(spread)) return;
    const prices = calculateOverlappingPrices(
      min,
      max,
      marketPrice.toString(),
      spread.toString()
    );

    // Set prices
    order0.setMax(prices.buyPriceHigh);
    order0.setMarginalPrice(prices.buyPriceMarginal);
    order1.setMin(prices.sellPriceLow);
    order1.setMarginalPrice(prices.sellPriceMarginal);

    // Set budgets
    const buyOrder = { min, marginalPrice: prices.buyPriceMarginal };
    const sellOrder = { max, marginalPrice: prices.sellPriceMarginal };
    if (isMinAboveMarket(buyOrder)) {
      setAnchoredOrder('sell');
      setBuyBudget(order1.budget, min, max);
    } else if (isMaxBelowMarket(sellOrder)) {
      setAnchoredOrder('buy');
      setSellBudget(order0.budget, min, max);
    } else {
      if (anchoredOrder === 'buy') setSellBudget(order0.budget, min, max);
      if (anchoredOrder === 'sell') setBuyBudget(order1.budget, min, max);
    }
  };

  const setMin = (min: string) => {
    if (!order1.max) return order0.setMin(min);
    setOverlappingParams(min, order1.max);
  };

  const setMax = (max: string) => {
    if (!order0.min) return order1.setMax(max);
    setOverlappingParams(order0.min, max);
  };

  // Update on buyMin changes
  useEffect(() => {
    if (!order0.min) return;

    // automatically update max if min > max
    const timeout = setTimeout(async () => {
      const minSellMax = getMinSellMax(Number(order0.min), spread);
      if (Number(order1.max) < minSellMax) {
        setMax(minSellMax.toString());
      }
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.min]);

  // Update on sellMax changes
  useEffect(() => {
    if (!order1.max) return;

    // automatically update min if min > max
    const timeout = setTimeout(async () => {
      const maxBuyMin = getMaxBuyMin(Number(order1.max), spread);
      if (Number(order0.min) > maxBuyMin) {
        setMin(maxBuyMin.toString());
      }
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order1.max]);

  // Initialize order when market price is available
  useEffect(() => {
    if (marketPrice <= 0 || !quote || !base) return;
    if (!order0.min && !order1.max) {
      requestAnimationFrame(() => {
        if (order0.min || order1.max) return;
        const { min, max } = getInitialPrices(marketPrice);
        setOverlappingParams(min, max);
      });
    } else {
      setOverlappingParams(order0.min, order1.max);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketPrice, spread]);

  return (
    <>
      <article className="rounded-10 bg-background-900 grid grid-flow-col grid-cols-[auto_auto] grid-rows-2 gap-8 p-20">
        <h4 className="text-14 font-weight-500 flex items-center gap-8">
          Discover Overlapping Strategies
          <span className="rounded-8 bg-primary-dark text-10 text-primary px-8 py-4">
            NEW
          </span>
        </h4>
        <p className="text-12 text-white/60">
          Learn more about the new type of strategy creation.
        </p>
        <a
          href="https://faq.carbondefi.xyz/what-is-an-overlapping-strategy"
          target="_blank"
          className="text-12 font-weight-500 text-primary row-span-2 flex items-center gap-4 self-center justify-self-end"
          rel="noreferrer"
        >
          Learn More
          <IconLink className="size-12" />
        </a>
      </article>
      <article className="rounded-10 bg-background-900 flex flex-col gap-20 p-20">
        <header className="flex items-center gap-8">
          <h3 className="text-18 font-weight-500 flex-1">Price Range</h3>
          <Tooltip
            element="Drag and drop your strategy buy and sell prices."
            iconClassName="text-white/60"
          />
        </header>
        <OverlappingStrategyGraph
          {...props}
          order0={order0}
          order1={order1}
          marketPrice={marketPrice}
          marketPricePercentage={marketPricePercentage}
          setMin={setMin}
          setMax={setMax}
        />
      </article>
      <article className="rounded-10 bg-background-900 flex flex-col gap-20 p-20">
        <header className="flex items-center gap-8">
          <span className="size-16 flex items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
            1
          </span>
          <h3 className="text-18 font-weight-500 flex-1">
            Set Price Range&nbsp;
            <span className="text-white/40">
              ({quote?.symbol} per 1 {base?.symbol})
            </span>
          </h3>
          <Tooltip
            element="Indicate the strategy exact buy and sell prices."
            iconClassName="text-white/60"
          />
        </header>
        {base && quote && (
          <CreateOverlappingRange
            base={base}
            quote={quote}
            order0={order0}
            order1={order1}
            marketPricePercentage={marketPricePercentage}
            setMin={setMin}
            setMax={setMax}
          />
        )}
      </article>
      <article className="rounded-10 bg-background-900 flex flex-col gap-10 p-20">
        <header className="mb-10 flex items-center gap-8 ">
          <span className="size-16 flex items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
            2
          </span>
          <h3 className="text-18 font-weight-500 flex-1">Indicate Spread</h3>
          <Tooltip
            element="The difference between the highest bidding (Sell) price, and the lowest asking (Buy) price"
            iconClassName="text-white/60"
          />
        </header>
        <OverlappingStrategySpread
          buyMin={+order0.min}
          sellMax={+order1.max}
          defaultValue={0.05}
          options={[0.01, 0.05, 0.1]}
          spread={spread}
          setSpread={setSpread}
        />
      </article>
      <article className="rounded-10 bg-background-900 flex flex-col gap-20 p-20">
        <header className="flex items-center gap-8 ">
          <span className="size-16 flex items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
            3
          </span>
          <h3 className="text-18 font-weight-500 flex-1">Set Budgets</h3>
          <Tooltip
            element="Indicate the budget you would like to allocate to the strategy. Note that in order to maintain the overlapping behavior, the 2nd budget indication will be calculated using the prices, spread and budget values."
            iconClassName="text-white/60"
          />
        </header>
        <CreateOverlappingStrategyBudget
          {...props}
          marketPrice={marketPrice}
          anchoredOrder={anchoredOrder}
          setAnchoredOrder={setAnchoredOrder}
          setBuyBudget={setBuyBudget}
          setSellBudget={setSellBudget}
        />
      </article>
    </>
  );
};
