import { FC, useCallback, useEffect, useState } from 'react';
import { useGetTokenBalance } from 'libs/queries';
import {
  getRoundedSpread,
  hasArbOpportunity,
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';
import { SafeDecimal } from 'libs/safedecimal';
import {
  OverlappingBudgetDescription,
  OverlappingBudgetDistribution,
} from 'components/strategies/overlapping/OverlappingBudgetDistribution';
import { OverlappingAnchor } from 'components/strategies/overlapping/OverlappingAnchor';
import { getDeposit, getWithdraw } from './utils';
import { hasNoBudget } from 'components/strategies/overlapping/useOverlappingMarketPrice';
import { OverlappingMarketPrice } from 'components/strategies/overlapping/OverlappingMarketPrice';
import { UserMarketPrice } from 'components/strategies/UserMarketPrice';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import { formatNumber, tokenAmount } from 'utils/helpers';
import { OverlappingOrder } from '../common/types';
import { useEditStrategyCtx } from './EditStrategyContext';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { EditBudgetOverlappingSearch } from 'pages/strategies/edit/budget/overlapping';
import { OverlappingBudget } from '../overlapping/OverlappingBudget';

interface Props {
  marketPrice: string;
  order0: OverlappingOrder;
  order1: OverlappingOrder;
}

// When working with edit overlapping we can't trust marginal price when budget was 0, so we need to recalculate
export function isEditAboveMarket(
  min: string,
  max: string,
  marketPrice: number | undefined,
  spread: number
) {
  if (!marketPrice) return false;
  const prices = calculateOverlappingPrices(
    formatNumber(min || '0'),
    formatNumber(max || '0'),
    marketPrice.toString(),
    spread.toString()
  );
  return isMinAboveMarket({
    min: prices.buyPriceLow,
    marginalPrice: prices.buyPriceMarginal,
  });
}
export function isEditBelowMarket(
  min: string,
  max: string,
  marketPrice: number | undefined,
  spread: number
) {
  if (!marketPrice) return false;
  const prices = calculateOverlappingPrices(
    formatNumber(min || '0'),
    formatNumber(max || '0'),
    marketPrice.toString(),
    spread.toString()
  );
  return isMaxBelowMarket({
    max: prices.sellPriceHigh,
    marginalPrice: prices.sellPriceMarginal,
  });
}

type Search = EditBudgetOverlappingSearch;

const url = '/strategies/edit/$strategyId/budget/overlapping';
export const EditBudgetOverlappingStrategy: FC<Props> = (props) => {
  const { marketPrice, order0, order1 } = props;
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;

  const { editType, anchor, budget } = useSearch({ from: url });
  const navigate = useNavigate({ from: url });

  const baseBalance = useGetTokenBalance(base).data;
  const quoteBalance = useGetTokenBalance(quote).data;
  const [touched, setTouched] = useState(false);

  const initialBuyBudget = strategy.order0.balance;
  const initialSellBudget = strategy.order1.balance;
  const depositBuyBudget = getDeposit(initialBuyBudget, order0.budget);
  const withdrawBuyBudget = getWithdraw(initialBuyBudget, order0.budget);
  const depositSellBudget = getDeposit(initialSellBudget, order1.budget);
  const withdrawSellBudget = getWithdraw(initialSellBudget, order1.budget);

  const set = useCallback(
    <T extends keyof Search>(key: T, value: Search[T]) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, [key]: value }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  const aboveMarket = isMinAboveMarket(order0);
  const belowMarket = isMaxBelowMarket(order1);

  // ERROR
  const anchorError = (() => {
    if (touched && !anchor) return 'Please select a token to proceed';
  })();

  const budgetError = (() => {
    const value = anchor === 'buy' ? order0.budget : order1.budget;
    const budget = new SafeDecimal(value);
    if (editType === 'deposit' && anchor === 'buy' && quoteBalance) {
      const delta = budget.sub(initialBuyBudget);
      if (delta.gt(quoteBalance)) return 'Insufficient balance';
    }
    if (editType === 'deposit' && anchor === 'sell' && baseBalance) {
      const delta = budget.sub(initialSellBudget);
      if (delta.gt(baseBalance)) return 'Insufficient balance';
    }
    if (editType === 'withdraw' && anchor === 'buy' && quoteBalance) {
      if (budget.lt(0)) return 'Insufficient funds';
    }
    if (editType === 'withdraw' && anchor === 'sell' && baseBalance) {
      if (budget.lt(0)) return 'Insufficient funds';
    }
    return '';
  })();

  // WARNING
  useEffect(() => {
    if (anchor === 'buy' && aboveMarket) set('anchor', undefined);
    if (anchor === 'sell' && belowMarket) set('anchor', undefined);
  }, [anchor, aboveMarket, belowMarket, set]);

  const budgetWarning = (() => {
    if (editType !== 'deposit') return;
    const spread = getRoundedSpread(strategy).toString();
    if (hasArbOpportunity(order0.marginalPrice, spread, marketPrice)) {
      const buyBudgetChanged = strategy.order0.balance !== order0.budget;
      const sellBudgetChanged = strategy.order1.balance !== order1.budget;
      if (!buyBudgetChanged && !sellBudgetChanged) return;
      return 'Please note that the deposit might create an arb opportunity.';
    }
  })();

  useEffect(() => {
    if (
      (anchor === 'buy' && aboveMarket) ||
      (anchor === 'sell' && belowMarket)
    ) {
      set('anchor', undefined);
      set('budget', '');
    }
  }, [anchor, aboveMarket, belowMarket, set]);

  const setMarketPrice = (price: number) => {
    setTouched(true);
    set('marketPrice', price.toString());
  };

  const setAnchor = (value: 'buy' | 'sell') => {
    set('budget', undefined);
    set('anchor', value);
  };

  const setBudget = async (value: string) => {
    set('budget', value);
  };

  return (
    <UserMarketPrice marketPrice={+marketPrice}>
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
            marketPrice={+marketPrice}
            setMarketPrice={setMarketPrice}
            className="self-start"
          />
        </article>
      )}
      <OverlappingAnchor
        base={base}
        quote={quote}
        anchor={anchor}
        setAnchor={setAnchor}
        anchorError={anchorError}
        disableBuy={aboveMarket}
        disableSell={belowMarket}
      />
      {anchor && editType && (
        <OverlappingBudget
          base={base}
          quote={quote}
          anchor={anchor}
          editType={editType}
          budget={budget ?? ''}
          setBudget={setBudget}
          buyBudget={initialBuyBudget}
          sellBudget={initialSellBudget}
          error={budgetError}
          warning={budgetWarning}
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
              Following the above {editType} amount, these are the changes in
              budget allocation
            </p>
          </hgroup>
          <OverlappingBudgetDistribution
            title="Sell"
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
            title="Buy"
            token={quote}
            initialBudget={initialBuyBudget}
            withdraw={budgetError ? '0' : withdrawBuyBudget}
            deposit={budgetError ? '0' : depositBuyBudget}
            balance={quoteBalance ?? '0'}
            buy
          />
          <OverlappingBudgetDescription
            token={quote}
            initialBudget={initialBuyBudget}
            withdraw={budgetError ? '0' : withdrawBuyBudget}
            deposit={budgetError ? '0' : depositBuyBudget}
            balance={quoteBalance ?? '0'}
          />
        </article>
      )}
    </UserMarketPrice>
  );
};
