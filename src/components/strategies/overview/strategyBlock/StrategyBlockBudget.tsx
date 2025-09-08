import { FC } from 'react';
import { cn, prettifyNumber } from 'utils/helpers';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { CartStrategy, Order } from 'components/strategies/common/types';

interface Props {
  strategy: CartStrategy<Order>;
}

export const StrategyBlockBudget: FC<Props> = ({ strategy }) => {
  const baseFiat = useFiatCurrency(strategy.base);
  const quoteFiat = useFiatCurrency(strategy.quote);
  const noFiatValue = !baseFiat.hasFiatValue() && !quoteFiat.hasFiatValue();
  const totalBalance = strategy.fiatBudget.total;
  const budgetFormatted = prettifyNumber(totalBalance, {
    currentCurrency: baseFiat.selectedFiatCurrency,
  });

  return (
    <article className="bg-black-gradient rounded-md border-background-800 flex flex-1 flex-col border-2 p-16">
      <h4 className="text-12 flex items-center gap-4 text-white/60">
        Total Budget
      </h4>
      <p
        className={cn(
          'text-18 font-medium',
          noFiatValue ? 'text-white/60' : '',
        )}
        data-testid="total-budget"
      >
        {noFiatValue ? '...' : budgetFormatted}
      </p>
    </article>
  );
};
