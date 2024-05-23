import { FC, useEffect, useState } from 'react';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { useGetTokenBalance } from 'libs/queries';
import {
  getMaxBuyMin,
  getMinSellMax,
  isMaxBelowMarket,
  isMinAboveMarket,
  isValidSpread,
} from 'components/strategies/overlapping/utils';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OverlappingStrategyGraph } from 'components/strategies/overlapping/OverlappingStrategyGraph';
import { OverlappingSpread } from 'components/strategies/overlapping/OverlappingSpread';
import { OverlappingRange } from 'components/strategies/overlapping/OverlappingRange';
import { isValidRange } from 'components/strategies/utils';
import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';
import { OverlappingBudget } from 'components/strategies/overlapping/OverlappingBudget';
import { SafeDecimal } from 'libs/safedecimal';
import {
  OverlappingBudgetDescription,
  OverlappingBudgetDistribution,
} from 'components/strategies/overlapping/OverlappingBudgetDistribution';
import { OverlappingAnchor } from 'components/strategies/overlapping/OverlappingAnchor';
import { Token } from 'libs/tokens';
import { m } from 'libs/motion';
import { items } from './variants';
import {
  OverlappingInitMarketPriceField,
  OverlappingMarketPrice,
} from '../overlapping/OverlappingMarketPrice';
import { UserMarketPrice } from '../UserMarketPrice';

interface Props {
  base: Token;
  quote: Token;
  order0: OrderCreate;
  order1: OrderCreate;
  // TODO(#1223) Remove spread from useCreateStrategy and use it only locally
  spread: number;
  setSpread: (value: number) => void;
}

const getInitialPrices = (marketPrice: string | number) => {
  const currentPrice = new SafeDecimal(marketPrice);
  return {
    min: currentPrice.times(0.99).toString(),
    max: currentPrice.times(1.01).toString(),
  };
};

export const CreateOverlapping: FC<Props> = (props) => {
  const { base, quote, order0, order1, spread, setSpread } = props;
  const externalPrice = useMarketPrice({ base, quote });
  const [marketPrice, setMarketPrice] = useState(externalPrice ?? 0);
  const baseBalance = useGetTokenBalance(base).data;
  const quoteBalance = useGetTokenBalance(quote).data;
  const [touched, setTouched] = useState(false);
  const [anchor, setAnchor] = useState<'buy' | 'sell' | undefined>();
  const [anchorError, setAnchorError] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const budget = (() => {
    if (!anchor) return '';
    return anchor === 'buy' ? order0.budget : order1.budget;
  })();

  const calculateBuyBudget = (
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
    } catch (error) {
      console.error(error);
    }
  };

  const calculateSellBudget = (
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
    } catch (error) {
      console.error(error);
    }
  };

  const setOverlappingPrices = (
    min: string,
    max: string,
    spreadValue: string = spread.toString()
  ) => {
    if (!base || !quote) return;
    if (!isValidRange(min, max) || !isValidSpread(spread)) return;
    const prices = calculateOverlappingPrices(
      min,
      max,
      marketPrice.toString(),
      spreadValue
    );

    order0.setMax(prices.buyPriceHigh);
    order0.setMarginalPrice(prices.buyPriceMarginal);
    order1.setMin(prices.sellPriceLow);
    order1.setMarginalPrice(prices.sellPriceMarginal);
    return prices;
  };

  const setOverlappingParams = (
    min: string,
    max: string,
    spreadValue: string = spread.toString()
  ) => {
    // Set min & max.
    order0.setMin(min);
    order1.setMax(max);

    const prices = setOverlappingPrices(min, max, spreadValue);
    if (!prices) return;

    // Set budgets
    const buyOrder = { min, marginalPrice: prices.buyPriceMarginal };
    const buyBudget = order0.budget;
    const sellOrder = { max, marginalPrice: prices.sellPriceMarginal };
    const sellBudget = order1.budget;

    if (!touched) setTouched(true);
    // If there is not anchor display error
    if (!anchor) return setAnchorError('Please select a token to proceed');

    if (isMinAboveMarket(buyOrder)) {
      if (anchor !== 'sell') resetBudgets('sell', min, max);
      else calculateBuyBudget(sellBudget, min, max);
      setAnchor('sell');
    } else if (isMaxBelowMarket(sellOrder)) {
      if (anchor !== 'buy') resetBudgets('buy', min, max);
      else calculateSellBudget(buyBudget, min, max);
      setAnchor('buy');
    } else {
      if (anchor === 'buy') calculateSellBudget(buyBudget, min, max);
      if (anchor === 'sell') calculateBuyBudget(sellBudget, min, max);
    }
  };

  const resetBudgets = (
    anchorValue: 'buy' | 'sell',
    min = order0.min,
    max = order1.max
  ) => {
    setBudgetError('');
    if (!touched) {
      order0.setBudget('');
      order1.setBudget('');
      return;
    }
    if (anchorValue === 'buy') {
      order0.setBudget('');
      calculateSellBudget('0', min, max);
    } else {
      order1.setBudget('');
      calculateBuyBudget('0', min, max);
    }
  };

  const setSpreadValue = (value: number) => {
    setSpread(value);
    setOverlappingParams(order0.min, order1.max, value.toString());
  };

  const setAnchorValue = (value: 'buy' | 'sell') => {
    if (!anchor) {
      // make sure we set params even with duplicate
      setOverlappingPrices(order0.min, order1.max);
      setAnchorError('');
    }
    resetBudgets(value);
    setAnchor(value);
  };

  const setMin = (min: string) => {
    if (!order1.max) return order0.setMin(min);
    setOverlappingParams(min, order1.max);
  };

  const setMax = (max: string) => {
    if (!order0.min) return order1.setMax(max);
    setOverlappingParams(order0.min, max);
  };

  const setBudget = async (amount: string) => {
    if (!amount) return resetBudgets(anchor!);

    if (anchor === 'buy') {
      order0.setBudget(amount);
      calculateSellBudget(amount, order0.min, order1.max);
    } else {
      order1.setBudget(amount);
      calculateBuyBudget(amount, order0.min, order1.max);
    }
  };

  useEffect(() => {
    if (anchor === 'buy' && quoteBalance) {
      const hasError = new SafeDecimal(order0.budget).gt(quoteBalance);
      if (hasError) return setBudgetError('Insufficient balance');
    }
    if (anchor === 'sell' && baseBalance) {
      const hasError = new SafeDecimal(order1.budget).gt(baseBalance);
      if (hasError) return setBudgetError('Insufficient balance');
    }
    setBudgetError('');
  }, [baseBalance, quoteBalance, anchor, order0.budget, order1.budget]);

  useEffect(() => {
    if (!externalPrice) return;
    if (Number(marketPrice) && Number(marketPrice) !== externalPrice) return;
    setMarketPrice(externalPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPrice]);

  useEffect(() => {
    if (!spread || !marketPrice) return;
    if (!order0.min && !order1.max) {
      const { min, max } = getInitialPrices(marketPrice);
      order0.setMin(min);
      order1.setMax(max);
      setOverlappingPrices(min, max);
    }
    if (!touched) return;
    setOverlappingParams(order0.min, order1.max);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched, anchor, marketPrice]);

  // Update on buyMin changes
  useEffect(() => {
    if (!order0.min) return;
    const timeout = setTimeout(async () => {
      const minSellMax = getMinSellMax(Number(order0.min), spread);
      if (Number(order1.max) < minSellMax) setMax(minSellMax.toString());
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.min]);

  // Update on sellMax changes
  useEffect(() => {
    if (!order1.max) return;
    const timeout = setTimeout(async () => {
      const maxBuyMin = getMaxBuyMin(Number(order1.max), spread);
      if (Number(order0.min) > maxBuyMin) setMin(maxBuyMin.toString());
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order1.max]);

  if (!base || !quote) return null;

  if (!marketPrice) {
    return (
      <m.article
        variants={items}
        key="marketPrice"
        className="rounded-10 bg-background-900 flex flex-col"
      >
        <OverlappingInitMarketPriceField
          base={base}
          quote={quote}
          marketPrice={marketPrice}
          setMarketPrice={setMarketPrice}
        />
      </m.article>
    );
  }

  return (
    <UserMarketPrice marketPrice={marketPrice}>
      <m.article
        variants={items}
        key="price-graph"
        className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20"
      >
        <header className="flex items-center gap-8">
          <h2 className="text-18 font-weight-500 flex-1">Price Range</h2>
          <OverlappingMarketPrice
            base={base}
            quote={quote}
            marketPrice={marketPrice}
            setMarketPrice={setMarketPrice}
          />
        </header>
        <OverlappingStrategyGraph
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
          marketPrice={marketPrice}
          spread={spread}
          setMin={setMin}
          setMax={setMax}
        />
      </m.article>
      <m.article
        variants={items}
        key="price-range"
        className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20"
      >
        <header className="flex items-center gap-8">
          <h3 className="text-18 font-weight-500 flex-1">
            Set Price Range&nbsp;
            <span className="text-white/40">
              ({quote?.symbol} per 1 {base?.symbol})
            </span>
          </h3>
          <Tooltip
            element="Indicate the strategy exact buy and sell prices."
            iconClassName="h-14 w-14 text-white/60"
          />
        </header>
        {base && quote && (
          <OverlappingRange
            base={base}
            quote={quote}
            order0={order0}
            order1={order1}
            spread={spread}
            setMin={setMin}
            setMax={setMax}
          />
        )}
      </m.article>
      <m.article
        variants={items}
        key="spread"
        className="rounded-10 bg-background-900 flex w-full flex-col gap-10 p-20"
      >
        <header className="mb-10 flex items-center gap-8 ">
          <h3 className="text-18 font-weight-500 flex-1">Set Spread</h3>
          <Tooltip
            element="The difference between the highest bidding (Sell) price, and the lowest asking (Buy) price"
            iconClassName="h-14 w-14 text-white/60"
          />
        </header>
        <OverlappingSpread
          buyMin={Number(order0.min)}
          sellMax={Number(order1.max)}
          defaultValue={0.05}
          options={[0.01, 0.05, 0.1]}
          spread={spread}
          setSpread={setSpreadValue}
        />
      </m.article>
      <OverlappingAnchor
        base={base}
        quote={quote}
        anchor={anchor}
        setAnchor={setAnchorValue}
        anchorError={anchorError}
        disableBuy={isMinAboveMarket(order0)}
        disableSell={isMaxBelowMarket(order1)}
      />
      {anchor && (
        <OverlappingBudget
          base={base}
          quote={quote}
          anchor={anchor}
          action="deposit"
          budgetValue={budget}
          setBudget={setBudget}
          error={budgetError}
        />
      )}
      {anchor && (
        <m.article
          variants={items}
          key="overlapping-distribution"
          id="overlapping-distribution"
          className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20"
        >
          <hgroup>
            <h3 className="text-16 font-weight-500 flex items-center gap-8">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px] text-white/60">
                3
              </span>
              Distribution
            </h3>
            <p className="text-14 text-white/80">
              Following the above deposit amount, these are the changes in
              budget allocation
            </p>
          </hgroup>
          <OverlappingBudgetDistribution
            token={base}
            initialBudget="0"
            withdraw="0"
            deposit={budgetError ? '0' : order1.budget}
            balance={baseBalance || '0'}
          />
          <OverlappingBudgetDescription
            token={base}
            initialBudget="0"
            withdraw="0"
            deposit={budgetError ? '0' : order1.budget}
            balance={baseBalance || '0'}
          />
          <OverlappingBudgetDistribution
            token={quote}
            initialBudget="0"
            withdraw="0"
            deposit={budgetError ? '0' : order0.budget}
            balance={quoteBalance || '0'}
            buy
          />
          <OverlappingBudgetDescription
            token={quote}
            initialBudget="0"
            withdraw="0"
            deposit={budgetError ? '0' : order0.budget}
            balance={quoteBalance || '0'}
          />
        </m.article>
      )}
    </UserMarketPrice>
  );
};
