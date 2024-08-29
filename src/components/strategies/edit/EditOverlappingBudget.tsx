import { FC, useCallback, useEffect } from 'react';
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
  BudgetDescription,
  BudgetDistribution,
} from 'components/strategies/common/BudgetDistribution';
import { OverlappingAnchor } from 'components/strategies/overlapping/OverlappingAnchor';
import { getDeposit, getWithdraw } from './utils';
import { hasNoBudget } from '../overlapping/utils';
import { OverlappingMarketPrice } from 'components/strategies/overlapping/OverlappingMarketPrice';
import { OverlappingMarketPriceProvider } from 'components/strategies/UserMarketPrice';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { formatNumber, tokenAmount } from 'utils/helpers';
import { OverlappingOrder } from '../common/types';
import { useEditStrategyCtx } from './EditStrategyContext';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { EditBudgetOverlappingSearch } from 'pages/strategies/edit/budget/overlapping';
import { OverlappingBudget } from '../overlapping/OverlappingBudget';
import { Tooltip } from 'components/common/tooltip/Tooltip';

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
export const EditOverlappingBudget: FC<Props> = (props) => {
  const { marketPrice, order0, order1 } = props;
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;

  const { editType, anchor, budget } = useSearch({ from: url });
  const navigate = useNavigate({ from: url });

  const baseBalance = useGetTokenBalance(base).data;
  const quoteBalance = useGetTokenBalance(quote).data;

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

  const setMarketPrice = (price: string) => {
    set('marketPrice', price);
  };

  const setAnchor = (value: 'buy' | 'sell') => {
    set('budget', undefined);
    set('anchor', value);
  };

  const setBudget = async (value: string) => {
    set('budget', value);
  };

  return (
    <OverlappingMarketPriceProvider marketPrice={+marketPrice}>
      {hasNoBudget(strategy) && (
        <article className="rounded-10 bg-background-900 flex flex-col gap-16 p-20">
          <header className="text-14 flex items-center justify-between">
            <h3>Market Price</h3>
            <span>{tokenAmount(marketPrice, quote)}</span>
          </header>
          <Warning>
            Since the strategy had no budget, it will use the current market
            price to readjust the budget distribution around.
          </Warning>
          <OverlappingMarketPrice
            base={base}
            quote={quote}
            marketPrice={marketPrice}
            setMarketPrice={setMarketPrice}
            className="self-start"
          />
        </article>
      )}
      <article className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20">
        <header className="flex items-center justify-between">
          <h2 className="text-18">Budget</h2>
          <Tooltip
            iconClassName="size-18 text-white/60"
            element="Indicate the token, action and amount for the strategy. Note that in order to maintain the concentrated liquidity behavior, the 2nd budget indication will be calculated using the prices, fee tier and budget values you use."
          />
        </header>
        <p className="text-14 text-white/80">
          Please select a token to proceed.
        </p>
        <OverlappingAnchor
          base={base}
          quote={quote}
          anchor={anchor}
          setAnchor={setAnchor}
          disableBuy={aboveMarket}
          disableSell={belowMarket}
        />
      </article>
      {anchor && editType && (
        <article className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20">
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
        </article>
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
          <BudgetDistribution
            title="Sell"
            token={base}
            initialBudget={initialSellBudget}
            withdraw={budgetError ? '0' : withdrawSellBudget}
            deposit={budgetError ? '0' : depositSellBudget}
            balance={baseBalance ?? '0'}
          />
          <BudgetDescription
            token={base}
            initialBudget={initialSellBudget}
            withdraw={budgetError ? '0' : withdrawSellBudget}
            deposit={budgetError ? '0' : depositSellBudget}
            balance={baseBalance ?? '0'}
          />
          <BudgetDistribution
            title="Buy"
            token={quote}
            initialBudget={initialBuyBudget}
            withdraw={budgetError ? '0' : withdrawBuyBudget}
            deposit={budgetError ? '0' : depositBuyBudget}
            balance={quoteBalance ?? '0'}
            buy
          />
          <BudgetDescription
            token={quote}
            initialBudget={initialBuyBudget}
            withdraw={budgetError ? '0' : withdrawBuyBudget}
            deposit={budgetError ? '0' : depositBuyBudget}
            balance={quoteBalance ?? '0'}
          />
        </article>
      )}
    </OverlappingMarketPriceProvider>
  );
};
