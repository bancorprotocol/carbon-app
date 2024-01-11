import { FC, memo, ReactElement } from 'react';
import { StrategyWithFiat } from 'libs/queries';
import { m } from 'libs/motion';
import { StrategyBlock } from 'components/strategies/overview/strategyBlock';
import { StrategyBlockCreate } from 'components/strategies/overview/strategyBlock';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { cn } from 'utils/helpers';
import styles from './StrategyContent.module.css';

type Props = {
  strategies: StrategyWithFiat[];
  isLoading: boolean;
  emptyElement: ReactElement;
  isExplorer?: boolean;
};

export const _StrategyContent: FC<Props> = ({
  strategies,
  isExplorer,
  isLoading,
  emptyElement,
}) => {
  if (isLoading) {
    return (
      <m.div
        key="loading"
        className="flex flex-grow items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="h-80">
          <CarbonLogoLoading />
        </div>
      </m.div>
    );
  }

  if (!strategies?.length) return emptyElement;

  return (
    <ul
      data-testid="strategy-list"
      className={cn('grid gap-20 lg:gap-10 xl:gap-25', styles.strategyList)}
    >
      {strategies.map((s) => (
        <StrategyBlock key={s.id} strategy={s} isExplorer={isExplorer} />
      ))}
      {!isExplorer && <StrategyBlockCreate />}
    </ul>
  );
};

export const StrategyContent = memo(
  _StrategyContent,
  (prev, next) =>
    prev.isLoading === next.isLoading &&
    JSON.stringify(prev.strategies) === JSON.stringify(next.strategies)
);
