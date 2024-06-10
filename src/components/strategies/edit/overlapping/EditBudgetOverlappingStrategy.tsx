import { FC, useEffect, useState } from 'react';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { Strategy, useGetTokenBalance } from 'libs/queries';
import {
  getRoundedSpread,
  hasArbOpportunity,
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
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
import { getDeposit, getWithdraw } from '../utils';
import { hasNoBudget } from 'components/strategies/overlapping/useOverlappingMarketPrice';
import { OverlappingMarketPrice } from 'components/strategies/overlapping/OverlappingMarketPrice';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import { formatNumber, tokenAmount } from 'utils/helpers';
import { geoMean } from 'utils/fullOutcome';

interface Props {
  strategy: Strategy;
  order0: OrderCreate;
  order1: OrderCreate;
  action: BudgetAction;
}

export const EditBudgetOverlappingStrategy: FC<Props> = (props) => {
  const { strategy, order0, order1, action } = props;
  const { base, quote } = strategy;
  const [delta, setDelta] = useState('');
  const [anchor, setAnchor] = useState<'buy' | 'sell' | undefined>();
  const [budgetError, setBudgetError] = useState('');
  const spread = getRoundedSpread(strategy);

  const externalPrice = useMarketPrice({ base, quote });
  const [marketPrice, setMarketPrice] = useState(0);

  const baseBalance = useGetTokenBalance(base).data;
  const quoteBalance = useGetTokenBalance(quote).data;
  const initialBuyBudget = strategy.order0.balance;
  const initialSellBudget = strategy.order1.balance;
  const depositBuyBudget = getDeposit(initialBuyBudget, order0.budget);
  const withdrawBuyBudget = getWithdraw(initialBuyBudget, order0.budget);
  const depositSellBudget = getDeposit(initialSellBudget, order1.budget);
  const withdrawSellBudget = getWithdraw(initialSellBudget, order1.budget);

  const aboveMarket = isMinAboveMarket(order0);
  const belowMarket = isMaxBelowMarket(order1);

  const warning = (() => {
    if (action !== 'deposit') return;
    if (aboveMarket || belowMarket) {
      return 'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.';
    }
    if (
      hasArbOpportunity(
        order0.marginalPrice,
        spread.toString(),
        externalPrice?.toString()
      )
    ) {
      if (!+delta) return;
      return 'Please note that the deposit might create an arb opportunity.';
    }
  })();

  useEffect(() => {
    if (marketPrice) return;
    const price = geoMean(
      strategy.order0.marginalRate,
      strategy.order1.marginalRate
    );
    if (hasNoBudget(strategy)) {
      if (!externalPrice) return;
      setMarketPrice(externalPrice);
      setMarginalPrices(externalPrice);
    } else if (price) {
      setMarketPrice(price.toNumber());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalPrice]);

  // Only used if no initial budget
  const setMarginalPrices = (price = marketPrice) => {
    if (!base || !quote) return;
    const prices = calculateOverlappingPrices(
      formatNumber(order0.min),
      formatNumber(order1.max),
      price.toString(),
      spread.toString()
    );
    order0.setMax(prices.buyPriceHigh);
    order0.setMarginalPrice(prices.buyPriceMarginal);
    order1.setMin(prices.sellPriceLow);
    order1.setMarginalPrice(prices.sellPriceMarginal);
    return prices;
  };

  const calculateBuyBudget = (
    sellBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    if (!Number(sellBudget)) return order0.setBudget('0');
    if (isMinAboveMarket(order0)) return order0.setBudget('0');
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
    if (!Number(buyBudget)) return order1.setBudget('0');
    if (isMaxBelowMarket(order1)) return order1.setBudget('0');
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

  const resetBudgets = (delta = '') => {
    setDelta(delta);
    setBudgetError('');
    order0.setBudget(initialBuyBudget);
    order1.setBudget(initialSellBudget);
  };

  const setMarketPriceValue = (value: number) => {
    setMarketPrice(value);
    setMarginalPrices(value);
  };

  const setAnchorValue = (value: 'buy' | 'sell') => {
    if (anchor && anchor !== value) resetBudgets();
    setAnchor(value);
  };

  const setBudget = (amount: string) => {
    if (!Number(amount)) return resetBudgets(amount);
    setDelta(amount);
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
    if (action === 'deposit' && anchor === 'buy' && quoteBalance) {
      if (amount.gt(quoteBalance)) return 'Insufficient balance';
    }
    if (action === 'deposit' && anchor === 'sell' && baseBalance) {
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

  return (
    <>
      {hasNoBudget(strategy) && (
        <article className="rounded-10 bg-background-900 flex flex-col gap-16 p-20">
          <header className="text-14 flex items-center justify-between">
            <h3>Market Price</h3>
            <span>{tokenAmount(marketPrice, quote)}</span>
          </header>
          <WarningMessageWithIcon>
            Since the strategy had no budget, it will use the current market
            price to readjust the budget distribution around.
          </WarningMessageWithIcon>
          <OverlappingMarketPrice
            base={base}
            quote={quote}
            marketPrice={marketPrice}
            setMarketPrice={setMarketPriceValue}
            className="self-start"
          />
        </article>
      )}
      <OverlappingAnchor
        base={base}
        quote={quote}
        anchor={anchor}
        setAnchor={setAnchorValue}
        disableBuy={aboveMarket}
        disableSell={belowMarket}
      />
      {anchor && (
        <OverlappingBudget
          base={base}
          quote={quote}
          anchor={anchor}
          editType={action}
          budgetValue={delta}
          setBudget={setBudget}
          buyBudget={initialBuyBudget}
          sellBudget={initialSellBudget}
          error={budgetError}
          warning={warning}
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
              Following the above {action} amount, these are the changes in
              budget allocation
            </p>
          </hgroup>
          <OverlappingBudgetDistribution
            token={base}
            initialBudget={initialSellBudget}
            withdraw={budgetError ? '0' : withdrawSellBudget}
            deposit={budgetError ? '0' : depositSellBudget}
            balance={baseBalance ?? '0'}
          />
          <OverlappingBudgetDescription
            token={base}
            initialBudget={initialSellBudget}
            withdraw={budgetError ? '0' : withdrawSellBudget}
            deposit={budgetError ? '0' : depositSellBudget}
            balance={baseBalance ?? '0'}
          />
          <OverlappingBudgetDistribution
            token={quote}
            initialBudget={initialBuyBudget}
            withdraw={budgetError ? '0' : withdrawBuyBudget}
            deposit={budgetError ? '0' : depositBuyBudget}
            balance={quoteBalance ?? '0'}
            buy
          />
          <OverlappingBudgetDescription
            token={quote}
            withdraw={budgetError ? '0' : withdrawBuyBudget}
            deposit={budgetError ? '0' : depositBuyBudget}
            balance={quoteBalance ?? '0'}
            initialBudget={initialBuyBudget}
          />
        </article>
      )}
    </>
  );
};
