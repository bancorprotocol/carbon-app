import { FC, useEffect } from 'react';
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
import { useWagmi } from 'libs/wagmi';
import { useSearch } from '@tanstack/react-router';
import { CreateOverlappingOrder } from 'components/strategies/common/types';
import { isValidRange } from '../utils';
import { SetOverlapping } from 'libs/routing/routes/trade';

interface Props {
  base: Token;
  quote: Token;
  buy: CreateOverlappingOrder;
  sell: CreateOverlappingOrder;
  set: SetOverlapping;
}

const url = '/trade/overlapping';
export const CreateOverlappingBudget: FC<Props> = (props) => {
  const { base, quote, buy, sell, set } = props;
  const search = useSearch({ from: url });
  const { anchor, budget } = search;
  const { user } = useWagmi();

  const baseBalance = useGetTokenBalance(base).data;
  const quoteBalance = useGetTokenBalance(quote).data;

  const aboveMarket = isMinAboveMarket(buy);
  const belowMarket = isMaxBelowMarket(sell);

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
    if (!isValidRange(buy.min, sell.max)) return;
    if (anchor === 'buy' && aboveMarket) {
      set({ anchor: 'sell', budget: undefined });
    }
    if (anchor === 'sell' && belowMarket) {
      set({ anchor: 'buy', budget: undefined });
    }
  }, [anchor, aboveMarket, belowMarket, set, buy.min, sell.max]);

  const setBudget = async (budget: string) => set({ budget });

  if (!anchor) return null;

  if (!base || !quote) return null;

  return (
    <>
      <article className="bg-background-900 grid gap-16 p-16">
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
      <article
        id="overlapping-distribution"
        className="bg-background-900 grid gap-16 p-16"
      >
        <hgroup>
          <h3 className="text-16 font-weight-500 flex items-center gap-8">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px] text-white/60">
              3
            </span>
            Distribution
          </h3>
          <p className="text-14 text-white/80">
            Based on the deposit amount above, the total required budgets are as
            follows:
          </p>
        </hgroup>
        <BudgetDistribution
          title="Sell"
          token={base}
          initialBudget="0"
          withdraw="0"
          deposit={budgetError ? '0' : sell.budget}
          balance={baseBalance}
          isSimulator={!user}
        />
        {!!user && (
          <BudgetDescription
            token={base}
            initialBudget="0"
            withdraw="0"
            deposit={budgetError ? '0' : sell.budget}
            balance={baseBalance || '0'}
          />
        )}
        <BudgetDistribution
          title="Buy"
          token={quote}
          initialBudget="0"
          withdraw="0"
          deposit={budgetError ? '0' : buy.budget}
          balance={quoteBalance}
          isSimulator={!user}
          isBuy
        />
        {!!user && (
          <BudgetDescription
            token={quote}
            initialBudget="0"
            withdraw="0"
            deposit={budgetError ? '0' : buy.budget}
            balance={quoteBalance || '0'}
          />
        )}
      </article>
    </>
  );
};
