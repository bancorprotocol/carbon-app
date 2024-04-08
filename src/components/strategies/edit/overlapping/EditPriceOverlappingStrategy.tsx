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

interface Props {
  strategy: Strategy;
  order0: OrderCreate;
  order1: OrderCreate;
  setOverlappingError: (error: string) => void;
}

export const EditPriceOverlappingStrategy: FC<Props> = (props) => {
  const { strategy, order0, order1 } = props;
  const { base, quote } = strategy;
  const marketPrice = useMarketPrice({ base, quote });
  const { marketPricePercentage } = useMarketIndication({
    base,
    quote,
    order: { min: order0.min, max: order1.max, price: '', isRange: true },
  });
  const baseBalance = useGetTokenBalance(base).data ?? '0';
  const quoteBalance = useGetTokenBalance(quote).data ?? '0';
  const [spread, setSpread] = useState(getRoundedSpread(strategy));
  const [depositBuyBudget, setDepositBuyBudget] = useState<string>('');
  const [depositSellBudget, setDepositSellBudget] = useState<string>('');
  const [withdrawBuyBudget, setWithdrawBuyBudget] = useState<string>('');
  const [withdrawSellBudget, setWithdrawSellBudget] = useState<string>('');

  const [anchor, setAnchor] = useState<'buy' | 'sell'>('buy');
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit');

  const getBudgetValue = () => {
    if (anchor === 'buy') {
      return mode === 'deposit' ? depositBuyBudget : withdrawBuyBudget;
    } else {
      return mode === 'deposit' ? depositSellBudget : withdrawSellBudget;
    }
  };

  const getBuyBudget = () => {
    return new SafeDecimal(order0.budget)
      .add(depositBuyBudget)
      .sub(withdrawBuyBudget)
      .toString();
  };

  const getSellBudget = () => {
    return new SafeDecimal(order1.budget)
      .add(depositSellBudget)
      .sub(withdrawSellBudget)
      .toString();
  };

  const setSellBudgets = (newBudget: string) => {
    if (new SafeDecimal(newBudget).eq(order1.budget)) {
      setDepositSellBudget('');
      setWithdrawSellBudget('');
    } else if (new SafeDecimal(newBudget).gt(order1.budget)) {
      const deposit = new SafeDecimal(newBudget).sub(order1.budget).toString();
      setDepositSellBudget(deposit);
      setWithdrawSellBudget('');
    } else {
      const withdraw = new SafeDecimal(order1.budget).sub(newBudget).toString();
      setWithdrawSellBudget(withdraw);
      setDepositSellBudget('');
    }
  };

  const setBuyBudgets = (newBudget: string) => {
    if (new SafeDecimal(newBudget).eq(order0.budget)) {
      setDepositBuyBudget('');
      setWithdrawBuyBudget('');
    } else if (new SafeDecimal(newBudget).gt(order0.budget)) {
      const deposit = new SafeDecimal(newBudget).sub(order0.budget).toString();
      setDepositBuyBudget(deposit);
      setWithdrawBuyBudget('');
    } else {
      const withdraw = new SafeDecimal(order0.budget).sub(newBudget).toString();
      setWithdrawBuyBudget(withdraw);
      setDepositBuyBudget('');
    }
  };

  const calculateBuyBudget = (
    sellBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    if (!sellBudget) return setBuyBudgets('0');
    const buyBudget = calculateOverlappingBuyBudget(
      base.decimals,
      quote.decimals,
      buyMin,
      sellMax,
      marketPrice.toString(),
      spread.toString(),
      sellBudget
    );
    setBuyBudgets(buyBudget);
  };

  const calculateSellBudget = (
    buyBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    if (!buyBudget) return setSellBudgets('0');
    const sellBudget = calculateOverlappingSellBudget(
      base.decimals,
      quote.decimals,
      buyMin,
      sellMax,
      marketPrice.toString(),
      spread.toString(),
      buyBudget
    );
    setSellBudgets(sellBudget);
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
    const sellBudget = getSellBudget();
    const buyBudget = getBuyBudget();
    if (isMinAboveMarket(buyOrder)) {
      setAnchor('sell');
      calculateBuyBudget(sellBudget, min, max);
    } else if (isMaxBelowMarket(sellOrder)) {
      setAnchor('buy');
      calculateSellBudget(buyBudget, min, max);
    } else {
      if (anchor === 'buy') calculateSellBudget(buyBudget, min, max);
      if (anchor === 'sell') calculateBuyBudget(sellBudget, min, max);
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

  const setBudget = (amount: string) => {
    if (anchor === 'buy') {
      let buyBudget = Number(order0.budget);
      if (mode === 'deposit') {
        setDepositBuyBudget(amount);
        buyBudget += Number(amount);
      } else {
        setWithdrawBuyBudget(amount);
        buyBudget -= Number(amount);
      }
      calculateSellBudget(buyBudget.toString(), order0.min, order1.max);
    } else {
      let sellBudget = Number(order1.budget);
      if (mode === 'deposit') {
        setDepositSellBudget(amount);
        sellBudget += Number(amount);
      } else {
        setWithdrawSellBudget(amount);
        sellBudget -= Number(amount);
      }
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

    if (new SafeDecimal(withdrawBuyBudget).gt(order0.budget)) {
      errors.push(`Insufficient allocated ${quote.symbol} budget`);
    }
    if (new SafeDecimal(withdrawSellBudget).gt(order1.budget)) {
      errors.push(`Insufficient allocated ${base.symbol} budget`);
    }

    return errors;
  };

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
          marketPrice={marketPrice}
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
          setSpread={setSpread}
        />
      </article>
      <OverlappingBudget
        base={base}
        quote={quote}
        anchor={anchor}
        setAnchor={setAnchor}
        mode={mode}
        setMode={setMode}
        budgetValue={getBudgetValue()}
        setBudget={setBudget}
        buyBudget={order0.budget}
        sellBudget={order1.budget}
        errors={getErrors()}
      />
      <article className="flex w-full flex-col gap-16 rounded-10 bg-background-900 p-20">
        <hgroup>
          <h3 className="text-16 font-weight-500">Distribution</h3>
          <p className="text-14 text-white/80">
            Following the edits implemented above, these are the changes in
            budget allocation
          </p>
        </hgroup>
        <OverlappingBudgetDistribution
          token={base}
          initialBudget={order1.budget}
          withdraw={withdrawSellBudget}
          deposit={depositSellBudget}
          balance={baseBalance}
          mode={mode}
        />
        <OverlappingBudgetDescription
          token={base}
          withdraw={withdrawSellBudget}
          deposit={depositSellBudget}
        />
        <OverlappingBudgetDistribution
          token={quote}
          initialBudget={order0.budget}
          withdraw={withdrawBuyBudget}
          deposit={depositBuyBudget}
          balance={quoteBalance}
          mode={mode}
          buy
        />
        <OverlappingBudgetDescription
          token={quote}
          withdraw={withdrawSellBudget}
          deposit={depositSellBudget}
        />
      </article>
    </>
  );
};
