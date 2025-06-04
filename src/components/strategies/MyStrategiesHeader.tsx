import { Link } from '@tanstack/react-router';
import { buttonStyles } from 'components/common/button/buttonStyles';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { useStrategyCtx } from 'hooks/useStrategies';
import { SafeDecimal } from 'libs/safedecimal';
import { useMemo } from 'react';
import { cn, prettifyNumber } from 'utils/helpers';
import style from './MyStrategiesHeader.module.css';

export const MyStrategiesHeader = () => {
  const { strategies } = useStrategyCtx();
  const { selectedFiatCurrency: currentCurrency } = useFiatCurrency();

  const netWorth = useMemo(() => {
    const total = strategies.reduce((acc, strategy) => {
      return acc.add(strategy.fiatBudget.total);
    }, new SafeDecimal(0));
    return prettifyNumber(total, { currentCurrency });
  }, [strategies, currentCurrency]);

  const totalTrade = useMemo(() => {
    const total = strategies.reduce((acc, strategy) => {
      return acc.add(strategy.tradeCount);
    }, new SafeDecimal(0));
    return prettifyNumber(total, { isInteger: true });
  }, [strategies]);

  const totalTrade24h = useMemo(() => {
    const total = strategies.reduce((acc, strategy) => {
      return acc.add(strategy.tradeCount24h);
    }, new SafeDecimal(0));
    return prettifyNumber(total, { isInteger: true });
  }, [strategies]);

  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-16 md:flex-row md:items-center',
        style.header,
      )}
    >
      <div role="table" className="flex flex-col gap-16 md:flex-row md:gap-24">
        <div role="row" className="flex justify-between gap-8 md:flex-col">
          <p role="rowheader" className="flex items-center gap-4 text-white/60">
            <span>Net Worth</span>
            <Tooltip
              iconClassName="size-14"
              element="The sum of the budgets from all strategies in the portfolio."
            />
          </p>
          <p role="cell" className="md:text-[32px]">
            {netWorth}
          </p>
        </div>
        <div role="row" className="flex justify-between gap-8 md:flex-col">
          <p role="rowheader" className="text-white/60">
            Total Trades
          </p>
          <p role="cell" className="md:text-[32px]">
            {totalTrade}
          </p>
        </div>
        <div role="row" className="flex justify-between gap-8 md:flex-col">
          <p role="rowheader" className="text-white/60">
            Trades (Last 24h)
          </p>
          <p role="cell" className="md:text-[32px]">
            {totalTrade24h}
          </p>
        </div>
      </div>
      <Link
        to="/trade"
        className={buttonStyles({ variant: 'success' })}
        data-testid="create-strategy-desktop"
      >
        Create
      </Link>
    </div>
  );
};
