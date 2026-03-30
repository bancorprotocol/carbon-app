import { FC, useCallback, useEffect } from 'react';
import { useGetTokenBalance } from 'libs/queries';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import InfoIcon from 'assets/icons/info.svg?react';
import { OverlappingSpread } from 'components/strategies/overlapping/OverlappingSpread';
import { SafeDecimal } from 'libs/safedecimal';
import {
  BudgetDescription,
  BudgetDistribution,
} from 'components/strategies/common/BudgetDistribution';
import { OverlappingAnchor } from 'components/strategies/overlapping/OverlappingAnchor';
import { getDeposit, getWithdraw } from './utils';
import { OverlappingAction } from 'components/strategies/overlapping/OverlappingAction';
import { CreateOverlappingOrder } from '../common/types';
import { useEditStrategyCtx } from './EditStrategyContext';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { EditOverlappingStrategySearch } from 'pages/portfolio/edit/prices/overlapping';
import { isValidRange } from '../utils';
import { OverlappingPriceRange } from '../overlapping/OverlappingPriceRange';
import { useStrategyFormCtx } from '../common/StrategyFormContext';

interface Props {
  buy: CreateOverlappingOrder;
  sell: CreateOverlappingOrder;
  spread: string;
}

type Search = EditOverlappingStrategySearch;

const url = '/strategies/edit/$strategyId/prices/overlapping';
export const EditOverlappingPrice: FC<Props> = (props) => {
  const { buy, sell, spread } = props;
  const { strategy } = useEditStrategyCtx();
  const { base, quote, marketPrice } = useStrategyFormCtx();

  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });
  const { action, anchor, budget } = search;

  const baseBalance = useGetTokenBalance(base);
  const quoteBalance = useGetTokenBalance(quote);

  const initialBuyBudget = strategy.buy.budget;
  const initialSellBudget = strategy.sell.budget;
  const depositBuyBudget = getDeposit(initialBuyBudget, buy.budget);
  const withdrawBuyBudget = getWithdraw(initialBuyBudget, buy.budget);
  const depositSellBudget = getDeposit(initialSellBudget, sell.budget);
  const withdrawSellBudget = getWithdraw(initialSellBudget, sell.budget);

  const set = useCallback(
    (next: Partial<Search>) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, ...next }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const aboveMarket = isMinAboveMarket(buy);
  const belowMarket = isMaxBelowMarket(sell);

  // ERROR
  const budgetError = (() => {
    const value = anchor === 'buy' ? buy.budget : sell.budget;
    const budget = new SafeDecimal(value);
    if (action === 'deposit' && anchor === 'buy' && quoteBalance.data) {
      const delta = budget.sub(initialBuyBudget);
      const balance = quoteBalance.data;
      if (delta.gt(balance)) return 'Insufficient balance';
    }
    if (action === 'deposit' && anchor === 'sell' && baseBalance.data) {
      const delta = budget.sub(initialSellBudget);
      const balance = baseBalance.data;
      if (delta.gt(balance)) return 'Insufficient balance';
    }
    if (action === 'withdraw' && anchor === 'buy' && quoteBalance) {
      if (budget.lt(0)) return 'Insufficient funds';
    }
    if (action === 'withdraw' && anchor === 'sell' && baseBalance) {
      if (budget.lt(0)) return 'Insufficient funds';
    }
    return '';
  })();

  // WARNING
  const priceWarning = (() => {
    if (!aboveMarket && !belowMarket) return;
    return 'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.';
  })();

  const budgetWarning = (() => {
    if (action !== 'deposit' || !search.budget) return;
    return 'Please note that the deposit might create an arb opportunity.';
  })();

  useEffect(() => {
    if (!isValidRange(buy.min, sell.max)) return;
    if (anchor === 'buy' && aboveMarket) {
      set({ anchor: 'sell', budget: undefined });
    }
    if (anchor === 'sell' && belowMarket) {
      set({ anchor: 'buy', budget: undefined });
    }
  }, [anchor, aboveMarket, belowMarket, set, buy.min, sell.max]);

  const setMin = (min: string) =>
    set({ min, max: sell.max, preset: undefined });
  const setMax = (max: string) => set({ min: buy.min, max, preset: undefined });
  const setSpread = (spread: string) => set({ spread });
  const setPreset = (preset: string) =>
    set({ min: undefined, max: undefined, preset });

  const setAnchor = (anchor: 'buy' | 'sell') => {
    set({
      budget: undefined,
      anchor,
      action: action || 'deposit',
    });
  };

  const setAction = (action: 'deposit' | 'withdraw') => {
    set({ budget: undefined, action });
  };

  const setBudget = async (budget: string) => {
    set({ budget });
  };

  return (
    <>
      {marketPrice && (
        <>
          <article className="grid gap-16 p-16">
            <header className="flex items-center gap-8">
              <h2 className="font-title text-16 font-medium flex-1">
                Edit Price Range&nbsp;
                <span className="text-main-0/40">
                  ({quote?.symbol} per 1 {base?.symbol})
                </span>
              </h2>
              <Tooltip element="Indicate the strategy exact buy and sell prices.">
                <InfoIcon className="size-24 text-main-0/60" />
              </Tooltip>
            </header>
            <OverlappingPriceRange
              base={base}
              quote={quote}
              min={buy.min}
              max={sell.max}
              setMin={setMin}
              setMax={setMax}
              setPreset={setPreset}
              minLabel="Min Buy"
              maxLabel="Max Sell"
              warnings={[priceWarning]}
              required
            />
          </article>
          <OverlappingSpread
            buyMin={Number(buy.min)}
            sellMax={Number(sell.max)}
            spread={spread}
            setSpread={setSpread}
          />
        </>
      )}
      <article className="grid gap-16 p-16">
        <OverlappingAnchor
          base={base}
          quote={quote}
          anchor={anchor}
          setAnchor={setAnchor}
          disableBuy={aboveMarket}
          disableSell={belowMarket}
        />
      </article>
      {anchor && (
        <article className="grid gap-16 p-16">
          <OverlappingAction
            base={base}
            quote={quote}
            anchor={anchor}
            action={action}
            setAction={setAction}
            budget={budget ?? ''}
            setBudget={setBudget}
            buyBudget={initialBuyBudget}
            sellBudget={initialSellBudget}
            warning={budgetWarning}
          />
        </article>
      )}
      {anchor && (
        <article id="overlapping-distribution" className="grid gap-16 p-16">
          <hgroup>
            <h3 className="text-16 font-medium flex items-center gap-8">
              Distribution
            </h3>
            <p className="text-14 text-main-0/80">
              Following the above {action} amount, these are the changes in
              budget allocation
            </p>
          </hgroup>
          <BudgetDistribution
            title="Sell"
            token={base}
            initialBudget={initialSellBudget}
            withdraw={budgetError ? '0' : withdrawSellBudget}
            deposit={budgetError ? '0' : depositSellBudget}
            balanceQuery={baseBalance}
          />
          <BudgetDescription
            token={base}
            initialBudget={initialSellBudget}
            withdraw={budgetError ? '0' : withdrawSellBudget}
            deposit={budgetError ? '0' : depositSellBudget}
            balance={baseBalance.data ?? '0'}
          />
          <BudgetDistribution
            title="Buy"
            token={quote}
            initialBudget={initialBuyBudget}
            withdraw={budgetError ? '0' : withdrawBuyBudget}
            deposit={budgetError ? '0' : depositBuyBudget}
            balanceQuery={quoteBalance}
            isBuy
          />
          <BudgetDescription
            token={quote}
            initialBudget={initialBuyBudget}
            withdraw={budgetError ? '0' : withdrawBuyBudget}
            deposit={budgetError ? '0' : depositBuyBudget}
            balance={quoteBalance.data ?? '0'}
          />
        </article>
      )}
    </>
  );
};
