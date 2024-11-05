import { FC } from 'react';
import { cn, prettifyNumber } from 'utils/helpers';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { StrategyWithFiat } from 'libs/queries';

interface Props {
  strategy: StrategyWithFiat;
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
    <article
      className={cn(
        'rounded-8 border-background-800 flex w-3/5 flex-col border-2 p-16',
        strategy.status === 'active' ? '' : 'opacity-50'
      )}
    >
      <h4 className="text-12 flex items-center gap-4 text-white/60">
        Total Budget
      </h4>
      <p
        className={cn(
          'text-18 font-weight-500',
          noFiatValue ? 'text-white/60' : ''
        )}
        data-testid="total-budget"
      >
        {noFiatValue ? '...' : budgetFormatted}
      </p>
    </article>
  );
};
