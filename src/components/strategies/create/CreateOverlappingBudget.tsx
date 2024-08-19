import { FC, useCallback, useEffect } from 'react';
import { useGetTokenBalance } from 'libs/queries';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { OverlappingBudget } from 'components/strategies/overlapping/OverlappingBudget';
import { SafeDecimal } from 'libs/safedecimal';
import {
  BudgetDescription,
  BudgetDistribution,
} from 'components/strategies/common/BudgetDistribution';
import { Token } from 'libs/tokens';
import { OverlappingMarketPriceProvider } from '../UserMarketPrice';
import { useWagmi } from 'libs/wagmi';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { CreateOverlappingStrategySearch } from 'pages/strategies/create/overlapping';
import { OverlappingOrder } from 'components/strategies/common/types';
import { isValidRange } from '../utils';
import { TradeOverlappingSearch } from 'libs/routing/routes/trade';

interface Props {
  base: Token;
  quote: Token;
  marketPrice: string;
  order0: OverlappingOrder;
  order1: OverlappingOrder;
}

type Search = CreateOverlappingStrategySearch;

const url = '/trade/activity/overlapping/budget';
export const CreateOverlappingBudget: FC<Props> = (props) => {
  const { base, quote, order0, order1, marketPrice } = props;
  const navigate = useNavigate({ from: url });
  const search = useSearch({ strict: false }) as TradeOverlappingSearch;
  const { anchor, budget } = search;
  const { user } = useWagmi();

  const baseBalance = useGetTokenBalance(base).data;
  const quoteBalance = useGetTokenBalance(quote).data;

  const set = useCallback(
    <T extends keyof Search>(key: T, value: Search[T]) => {
      navigate({
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
  const budgetError = (() => {
    if (anchor === 'buy' && quoteBalance && budget) {
      const hasError = new SafeDecimal(budget).gt(quoteBalance);
      if (hasError) return 'Insufficient balance';
    }
    if (anchor === 'sell' && baseBalance && budget) {
      const hasError = new SafeDecimal(budget).gt(baseBalance);
      if (hasError) return 'Insufficient balance';
    }
  })();

  useEffect(() => {
    if (!isValidRange(order0.min, order1.max)) return;
    if (anchor === 'buy' && aboveMarket) {
      set('anchor', 'sell');
      set('budget', undefined);
    }
    if (anchor === 'sell' && belowMarket) {
      set('anchor', 'buy');
      set('budget', undefined);
    }
  }, [anchor, aboveMarket, belowMarket, set, order0.min, order1.max]);

  const setBudget = async (value: string) => {
    set('budget', value);
  };

  if (!anchor) return null;

  if (!base || !quote) return null;

  return (
    <OverlappingMarketPriceProvider marketPrice={+marketPrice}>
      <article className="grid gap-16">
        <OverlappingBudget
          base={base}
          quote={quote}
          anchor={anchor}
          editType="deposit"
          budget={budget ?? ''}
          setBudget={setBudget}
          error={budgetError}
        />
      </article>
      <article id="overlapping-distribution" className="grid gap-16">
        <hgroup>
          <h3 className="text-16 font-weight-500 flex items-center gap-8">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px] text-white/60">
              3
            </span>
            Distribution
          </h3>
          <p className="text-14 text-white/80">
            Following the above deposit amount, these are the changes in budget
            allocation
          </p>
        </hgroup>
        <BudgetDistribution
          title="Sell"
          token={base}
          initialBudget="0"
          withdraw="0"
          deposit={budgetError ? '0' : order1.budget}
          balance={baseBalance || '0'}
          isSimulator={!user}
        />
        {!!user && (
          <BudgetDescription
            token={base}
            initialBudget="0"
            withdraw="0"
            deposit={budgetError ? '0' : order1.budget}
            balance={baseBalance || '0'}
          />
        )}
        <BudgetDistribution
          title="Buy"
          token={quote}
          initialBudget="0"
          withdraw="0"
          deposit={budgetError ? '0' : order0.budget}
          balance={quoteBalance || '0'}
          isSimulator={!user}
          buy
        />
        {!!user && (
          <BudgetDescription
            token={quote}
            initialBudget="0"
            withdraw="0"
            deposit={budgetError ? '0' : order0.budget}
            balance={quoteBalance || '0'}
          />
        )}
      </article>
    </OverlappingMarketPriceProvider>
  );
};
