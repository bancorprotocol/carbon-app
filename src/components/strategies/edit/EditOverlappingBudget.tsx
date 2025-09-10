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
import { EditMarketPrice } from 'components/strategies/common/InitMarketPrice';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { formatNumber, tokenAmount } from 'utils/helpers';
import { CreateOverlappingOrder } from '../common/types';
import { useEditStrategyCtx } from './EditStrategyContext';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { EditBudgetOverlappingSearch } from 'pages/strategies/edit/budget/overlapping';
import { OverlappingBudget } from '../overlapping/OverlappingBudget';
import { Tooltip } from 'components/common/tooltip/Tooltip';

interface Props {
  marketPrice: string;
  buy: CreateOverlappingOrder;
  sell: CreateOverlappingOrder;
}

export function isEditBelowMarket(
  min: string,
  max: string,
  marketPrice: number | undefined,
  spread: number,
) {
  if (!marketPrice) return false;
  const prices = calculateOverlappingPrices(
    formatNumber(min || '0'),
    formatNumber(max || '0'),
    marketPrice.toString(),
    spread.toString(),
  );
  return isMaxBelowMarket({
    max: prices.sellPriceHigh,
    marginalPrice: prices.sellPriceMarginal,
  });
}

type Search = EditBudgetOverlappingSearch;

const url = '/strategies/edit/$strategyId/budget/overlapping';
export const EditOverlappingBudget: FC<Props> = (props) => {
  const { marketPrice, buy, sell } = props;
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;

  const { editType, anchor, budget } = useSearch({ from: url });
  const navigate = useNavigate({ from: url });

  const baseBalance = useGetTokenBalance(base).data;
  const quoteBalance = useGetTokenBalance(quote).data;

  const initialBuyBudget = strategy.buy.budget;
  const initialSellBudget = strategy.sell.budget;
  const depositBuyBudget = getDeposit(initialBuyBudget, buy.budget);
  const withdrawBuyBudget = getWithdraw(initialBuyBudget, buy.budget);
  const depositSellBudget = getDeposit(initialSellBudget, sell.budget);
  const withdrawSellBudget = getWithdraw(initialSellBudget, sell.budget);

  const set = useCallback(
    <T extends keyof Search>(key: T, value: Search[T]) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, [key]: value }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const aboveMarket = isMinAboveMarket(buy);
  const belowMarket = isMaxBelowMarket(sell);

  const budgetError = (() => {
    const value = anchor === 'buy' ? buy.budget : sell.budget;
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
    if (hasArbOpportunity(buy.marginalPrice, spread, marketPrice)) {
      const buyBudgetChanged = strategy.buy.budget !== buy.budget;
      const sellBudgetChanged = strategy.sell.budget !== sell.budget;
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

  const setAnchor = (value: 'buy' | 'sell') => {
    set('budget', undefined);
    set('anchor', value);
  };

  const setBudget = async (value: string) => {
    set('budget', value);
  };

  return (
    <>
      {hasNoBudget(strategy) && (
        <article className="bg-background-900 grid gap-16 p-20">
          <header className="text-14 flex items-center justify-between">
            <h3>Market Price</h3>
            <span>{tokenAmount(marketPrice, quote)}</span>
          </header>
          <Warning>
            Since the strategy had no budget, it will use the current market
            price to readjust the budget distribution around.
          </Warning>
          <EditMarketPrice base={base} quote={quote} className="self-start" />
        </article>
      )}
      <article className="bg-background-900 grid gap-8 p-16">
        <header className="flex items-center justify-between">
          <hgroup>
            <h2 className="text-16">Budget</h2>
            <p className="text-14 text-white/80">
              Please select a token to proceed.
            </p>
          </hgroup>
          <Tooltip
            iconClassName="size-14 text-white/60"
            element="Indicate the token, action and amount for the strategy. Note that in order to maintain the concentrated liquidity behavior, the 2nd budget indication will be calculated using the prices, fee tier and budget values you use."
          />
        </header>
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
        <article className="bg-background-900 grid gap-16 p-16">
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
          className="bg-background-900 grid gap-16 p-16"
        >
          <hgroup>
            <h3 className="text-16 font-medium flex items-center gap-8">
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
            balance={baseBalance}
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
            balance={quoteBalance}
            isBuy
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
    </>
  );
};
