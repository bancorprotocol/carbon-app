import { FC, useState } from 'react';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { Strategy, useGetTokenBalance } from 'libs/queries';
import {
  getRoundedSpread,
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import {
  calculateOverlappingBuyBudget,
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
import { useOverlappingMarketPrice } from 'components/strategies/overlapping/useOverlappingMarketPrice';

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

  const marketPrice = useOverlappingMarketPrice(strategy);

  const baseBalance = useGetTokenBalance(base).data ?? '0';
  const quoteBalance = useGetTokenBalance(quote).data ?? '0';
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

  const resetBudgets = (delta = '') => {
    setDelta(delta);
    setBudgetError('');
    order0.setBudget(initialBuyBudget);
    order1.setBudget(initialSellBudget);
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

  return (
    <>
      <OverlappingAnchor
        base={base}
        quote={quote}
        anchor={anchor}
        setAnchor={setAnchorValue}
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
