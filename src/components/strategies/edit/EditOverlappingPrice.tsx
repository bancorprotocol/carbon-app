import { FC, useCallback, useEffect } from 'react';
import { useGetTokenBalance } from 'libs/queries';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OverlappingSpread } from 'components/strategies/overlapping/OverlappingSpread';
import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';
import { SafeDecimal } from 'libs/safedecimal';
import {
  BudgetDescription,
  BudgetDistribution,
} from 'components/strategies/common/BudgetDistribution';
import { OverlappingAnchor } from 'components/strategies/overlapping/OverlappingAnchor';
import { getDeposit, getWithdraw } from './utils';
import { OverlappingAction } from 'components/strategies/overlapping/OverlappingAction';
import { formatNumber } from 'utils/helpers';
import { CreateOverlappingOrder } from '../common/types';
import { useEditStrategyCtx } from './EditStrategyContext';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { EditOverlappingStrategySearch } from 'pages/portfolio/edit/prices/overlapping';
import { isValidRange } from '../utils';
import { OverlappingPriceRange } from '../overlapping/OverlappingPriceRange';
import { useStrategyMarketPrice } from '../UserMarketPrice';

interface Props {
  buy: CreateOverlappingOrder;
  sell: CreateOverlappingOrder;
  spread: string;
}

// When working with edit overlapping we can't trust marginal price when budget was 0, so we need to recalculate
export function isEditAboveMarket(
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
  return isMinAboveMarket({
    min: prices.buyPriceLow,
    marginalPrice: prices.buyPriceMarginal,
  });
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

type Search = EditOverlappingStrategySearch;

const url = '/strategies/edit/$strategyId/prices/overlapping';
export const EditOverlappingPrice: FC<Props> = (props) => {
  const { buy, sell, spread } = props;
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;
  const { marketPrice } = useStrategyMarketPrice({ base, quote });

  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });
  const { action, anchor, budget } = search;

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

  // ERROR
  const budgetError = (() => {
    const value = anchor === 'buy' ? buy.budget : sell.budget;
    const budget = new SafeDecimal(value);
    if (action === 'deposit' && anchor === 'buy' && quoteBalance) {
      const delta = budget.sub(initialBuyBudget);
      if (delta.gt(quoteBalance)) return 'Insufficient balance';
    }
    if (action === 'deposit' && anchor === 'sell' && baseBalance) {
      const delta = budget.sub(initialSellBudget);
      if (delta.gt(baseBalance)) return 'Insufficient balance';
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
      set('anchor', 'sell');
      set('budget', undefined);
    }
    if (anchor === 'sell' && belowMarket) {
      set('anchor', 'buy');
      set('budget', undefined);
    }
  }, [anchor, aboveMarket, belowMarket, set, buy.min, sell.max]);

  const setMin = (min: string) => set('min', min);
  const setMax = (max: string) => set('max', max);
  const setSpread = (value: string) => set('spread', value);

  const setAnchor = (value: 'buy' | 'sell') => {
    set('budget', undefined);
    set('anchor', value);
    if (!action) set('action', 'deposit');
  };

  const setAction = (value: 'deposit' | 'withdraw') => {
    set('budget', undefined);
    set('action', value);
  };

  const setBudget = async (value: string) => {
    set('budget', value);
  };

  return (
    <>
      {marketPrice && (
        <>
          <article className="grid gap-16 p-16">
            <header className="flex items-center gap-8">
              <h2 className="text-16 font-medium flex-1">
                Edit Price Range&nbsp;
                <span className="text-white/40">
                  ({quote?.symbol} per 1 {base?.symbol})
                </span>
              </h2>
              <Tooltip
                element="Indicate the strategy exact buy and sell prices."
                iconClassName="size-18 text-white/60"
              />
            </header>
            <OverlappingPriceRange
              base={base}
              quote={quote}
              min={buy.min}
              max={sell.max}
              setMin={setMin}
              setMax={setMax}
              minLabel="Min Buy Price"
              maxLabel="Max Sell Price"
              warnings={[priceWarning]}
              isOverlapping
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
            <p className="text-14 text-white/80">
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
