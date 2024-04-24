import { FC, useEffect, useState } from 'react';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { Strategy, useGetTokenBalance } from 'libs/queries';
import {
  getMaxBuyMin,
  getMinSellMax,
  getRoundedSpread,
  isMaxBelowMarket,
  isMinAboveMarket,
  isValidSpread,
} from 'components/strategies/overlapping/utils';
import { useMarketPrice } from 'hooks/useMarketPrice';
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
import { BudgetAction } from 'components/strategies/common/BudgetInput';
import { geoMean } from 'utils/fullOutcome';
import { getDeposit, getWithdraw } from '../utils';

interface Props {
  strategy: Strategy;
  order0: OrderCreate;
  order1: OrderCreate;
  action: BudgetAction;
}

export const EditBudgetOverlappingStrategy: FC<Props> = (props) => {
  const { strategy, order0, order1, action } = props;
  const { base, quote } = strategy;
  const baseBalance = useGetTokenBalance(base).data ?? '0';
  const quoteBalance = useGetTokenBalance(quote).data ?? '0';
  const [touched, setTouched] = useState(false);
  const [delta, setDelta] = useState('');
  const [anchor, setAnchor] = useState<'buy' | 'sell' | undefined>();
  const [anchorError, setAnchorError] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const spread = getRoundedSpread(strategy);

  const newMarketPrice = useMarketPrice({ base, quote });
  const initialMarketPrice = geoMean(
    strategy.order0.marginalRate,
    strategy.order1.marginalRate
  )!;
  const marketPrice = touched
    ? newMarketPrice.toString()
    : initialMarketPrice!.toString();

  const initialBuyBudget = strategy.order0.balance;
  const initialSellBudget = strategy.order1.balance;
  const depositBuyBudget = getDeposit(initialBuyBudget, order0.budget);
  const withdrawBuyBudget = getWithdraw(initialBuyBudget, order0.budget);
  const depositSellBudget = getDeposit(initialSellBudget, order1.budget);
  const withdrawSellBudget = getWithdraw(initialSellBudget, order1.budget);

  const calculateBuyBudget = (
    sellBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    try {
      const buyBudget = calculateOverlappingBuyBudget(
        base.decimals,
        quote.decimals,
        buyMin,
        sellMax,
        marketPrice,
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
    try {
      const sellBudget = calculateOverlappingSellBudget(
        base.decimals,
        quote.decimals,
        buyMin,
        sellMax,
        marketPrice,
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
    setDelta('');
    setBudgetError('');
    if (!touched) {
      order0.setBudget(initialBuyBudget);
      order1.setBudget(initialSellBudget);
      return;
    }
    if (anchorValue === 'buy') {
      order0.setBudget(initialBuyBudget);
      calculateSellBudget(initialBuyBudget, min, max);
    } else {
      order1.setBudget(initialSellBudget);
      calculateBuyBudget(initialSellBudget, min, max);
    }
  };

  const setAnchorValue = (value: 'buy' | 'sell') => {
    if (!anchor) setAnchorError('');
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

  const setBudget = (amount: string) => {
    setDelta(amount);
    if (!amount) return resetBudgets(anchor!);
    setBudgetError(getBudgetErrors(amount));

    if (anchor === 'buy') {
      const initial = new SafeDecimal(initialBuyBudget);
      const buyBudget =
        action === 'deposit' ? initial.add(amount) : initial.sub(amount);
      order0.setBudget(buyBudget.toString());
      calculateSellBudget(buyBudget.toString(), order0.min, order1.max);
    } else {
      const initial = new SafeDecimal(initialSellBudget);
      const sellBudget =
        action === 'deposit' ? initial.add(amount) : initial.sub(amount);
      order1.setBudget(sellBudget.toString());
      calculateBuyBudget(sellBudget.toString(), order0.min, order1.max);
    }
  };

  const getBudgetErrors = (value: string) => {
    const amount = new SafeDecimal(value);
    if (action === 'deposit' && anchor === 'buy') {
      if (amount.gt(quoteBalance)) return 'Insufficient balance';
    }
    if (action === 'deposit' && anchor === 'sell') {
      if (amount.gt(baseBalance)) return 'Insufficient balance';
    }
    if (action === 'withdraw' && anchor === 'buy') {
      if (amount.gt(initialBuyBudget)) return 'Insufficient funds';
    }
    if (action === 'withdraw' && anchor === 'sell') {
      if (amount.gt(initialSellBudget)) return 'Insufficient funds';
    }
    return '';
  };

  useEffect(() => {
    if (!touched || !spread || !marketPrice) return;
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

  return (
    <>
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
          action={action}
          budgetValue={delta}
          setBudget={setBudget}
          buyBudget={initialBuyBudget}
          sellBudget={initialSellBudget}
          error={budgetError}
        />
      )}
      {anchor && (
        <article
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
              Following the edits implemented above, these are the changes in
              budget allocation
            </p>
          </hgroup>
          <OverlappingBudgetDistribution
            token={base}
            initialBudget={initialSellBudget}
            withdraw={budgetError ? '0' : withdrawSellBudget}
            deposit={budgetError ? '0' : depositSellBudget}
            balance={baseBalance}
          />
          <OverlappingBudgetDescription
            token={base}
            withdraw={budgetError ? '0' : withdrawSellBudget}
            deposit={budgetError ? '0' : depositSellBudget}
            balance={baseBalance}
            initialBudget={initialSellBudget}
          />
          <OverlappingBudgetDistribution
            token={quote}
            initialBudget={initialBuyBudget}
            withdraw={budgetError ? '0' : withdrawBuyBudget}
            deposit={budgetError ? '0' : depositBuyBudget}
            balance={quoteBalance}
            buy
          />
          <OverlappingBudgetDescription
            token={quote}
            withdraw={budgetError ? '0' : withdrawBuyBudget}
            deposit={budgetError ? '0' : depositBuyBudget}
            balance={quoteBalance}
            initialBudget={initialBuyBudget}
          />
        </article>
      )}
    </>
  );
};
