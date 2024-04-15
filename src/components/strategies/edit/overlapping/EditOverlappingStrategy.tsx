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
import { useMarketIndication } from 'components/strategies/marketPriceIndication';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OverlappingStrategyGraph } from 'components/strategies/overlapping/OverlappingStrategyGraph';
import { OverlappingStrategySpread } from 'components/strategies/overlapping/OverlappingStrategySpread';
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
import { BudgetAction } from 'components/strategies/common/BudgetInput';
import { geoMean } from 'utils/fullOutcome';
import { getDeposit, getWithdraw } from '../utils';

interface Props {
  strategy: Strategy;
  order0: OrderCreate;
  order1: OrderCreate;
  fixAction?: BudgetAction;
}

export const EditOverlappingStrategy: FC<Props> = (props) => {
  const { strategy, order0, order1, fixAction } = props;
  const { base, quote } = strategy;
  const { marketPricePercentage } = useMarketIndication({
    base,
    quote,
    order: { min: order0.min, max: order1.max, price: '', isRange: true },
  });
  const baseBalance = useGetTokenBalance(base).data ?? '0';
  const quoteBalance = useGetTokenBalance(quote).data ?? '0';
  const [spread, setSpread] = useState(getRoundedSpread(strategy));
  const [touched, setTouched] = useState(false);
  const [anchor, setAnchor] = useState<'buy' | 'sell' | undefined>();
  const [anchorError, setAnchorError] = useState('');
  const [action, setAction] = useState<'deposit' | 'withdraw'>(
    fixAction ?? 'deposit'
  );

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

  const getBudgetValue = () => {
    if (anchor === 'buy') {
      return action === 'deposit' ? depositBuyBudget : withdrawBuyBudget;
    } else {
      return action === 'deposit' ? depositSellBudget : withdrawSellBudget;
    }
  };

  const calculateBuyBudget = (
    sellBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    if (!Number(sellBudget)) return order0.setBudget(initialBuyBudget);
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
    if (!Number(buyBudget)) return order1.setBudget(initialSellBudget);
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

  /**  */
  const resetBudgets = (
    anchorValue: 'buy' | 'sell',
    min = order0.min,
    max = order1.max
  ) => {
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

  const setSpreadValue = (value: number) => {
    setSpread(value);
    setOverlappingParams(order0.min, order1.max, value.toString());
  };

  const setActionValue = (value: BudgetAction) => {
    resetBudgets(anchor!);
    setAction(value);
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

  const setBudget = (value: string) => {
    if (!value && !touched) {
      order0.setBudget(initialBuyBudget);
      order1.setBudget(initialSellBudget);
      return;
    }
    const amount = value || '0'; // SafeDecimal doesn't support ""
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

  const getErrors = () => {
    const errors = [];
    if (new SafeDecimal(depositBuyBudget).gt(quoteBalance)) {
      errors.push(`Insufficient ${quote.symbol} balance`);
    }
    if (new SafeDecimal(depositSellBudget).gt(baseBalance)) {
      errors.push(`Insufficient ${base.symbol} balance`);
    }
    if (new SafeDecimal(withdrawBuyBudget).gt(initialBuyBudget)) {
      errors.push(`Insufficient allocated ${quote.symbol} budget`);
    }
    if (new SafeDecimal(withdrawSellBudget).gt(initialSellBudget)) {
      errors.push(`Insufficient allocated ${base.symbol} budget`);
    }

    return errors;
  };

  useEffect(() => {
    if (!touched || !spread || !marketPrice) return;
    setOverlappingParams(order0.min, order1.max);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched, marketPrice]);

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
      <article className="flex w-full flex-col gap-16 rounded-10 bg-background-900 p-20">
        <header>
          <h3 className="flex-1 text-18 font-weight-500">Price Range</h3>
        </header>
        <OverlappingStrategyGraph
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
          marketPrice={newMarketPrice}
          spread={spread}
          marketPricePercentage={marketPricePercentage}
          setMin={setMin}
          setMax={setMax}
        />
      </article>
      <article className="flex w-full flex-col gap-16 rounded-10 bg-background-900 p-20">
        <header className="flex items-center gap-8">
          <h3 className="flex-1 text-18 font-weight-500">
            Edit Price Range&nbsp;
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
            marketPricePercentage={marketPricePercentage}
            setMin={setMin}
            setMax={setMax}
          />
        )}
      </article>
      <article className="flex w-full flex-col gap-10 rounded-10 bg-background-900 p-20">
        <header className="mb-10 flex items-center gap-8 ">
          <h3 className="flex-1 text-18 font-weight-500">Edit Spread</h3>
          <Tooltip
            element="The difference between the highest bidding (Sell) price, and the lowest asking (Buy) price"
            iconClassName="h-14 w-14 text-white/60"
          />
        </header>
        <OverlappingStrategySpread
          order0={order0}
          order1={order1}
          defaultValue={0.05}
          options={[0.01, 0.05, 0.1]}
          spread={spread}
          setSpread={setSpreadValue}
        />
      </article>
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
          setAction={setActionValue}
          budgetValue={getBudgetValue()}
          setBudget={setBudget}
          buyBudget={initialBuyBudget}
          sellBudget={initialSellBudget}
          fixAction={fixAction}
        />
      )}
      <article className="flex w-full flex-col gap-16 rounded-10 bg-background-900 p-20">
        <hgroup>
          <h3 className="flex items-center gap-8 text-16 font-weight-500">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
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
          withdraw={withdrawSellBudget}
          deposit={depositSellBudget}
          balance={baseBalance}
        />
        <OverlappingBudgetDescription
          token={base}
          withdraw={withdrawSellBudget}
          deposit={depositSellBudget}
          balance={baseBalance}
          initialBudget={initialSellBudget}
        />
        <OverlappingBudgetDistribution
          token={quote}
          initialBudget={initialBuyBudget}
          withdraw={withdrawBuyBudget}
          deposit={depositBuyBudget}
          balance={quoteBalance}
          buy
        />
        <OverlappingBudgetDescription
          token={quote}
          withdraw={withdrawBuyBudget}
          deposit={depositBuyBudget}
          balance={quoteBalance}
          initialBudget={depositBuyBudget}
        />
      </article>
    </>
  );
};
