import { FC } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { cn, prettifyNumber } from 'utils/helpers';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { StrategyWithFiat } from 'libs/queries';

interface Props {
  fullWidth?: boolean;
  strategy: StrategyWithFiat;
}

export const StrategyBlockBudget: FC<Props> = ({ strategy, fullWidth }) => {
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
        'rounded-8 border-background-800 flex w-2/3 flex-col border-2 p-16',
        strategy.status === 'active' ? '' : 'opacity-50',
        !!fullWidth ? 'col-start-1 col-end-3 flex-row justify-between' : ''
      )}
    >
      <Tooltip element={<TooltipContent />}>
        <h4 className="text-12 flex items-center gap-4 text-white/60">
          Total Budget
          <IconTooltip className="size-10" />
        </h4>
      </Tooltip>
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

const TooltipContent: FC = () => {
  const currency = useFiatCurrency();
  const fiatSymbol = currency.selectedFiatCurrency;
  return <p>Sum of the {fiatSymbol} value of the token budgets.</p>;
};
