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
  isPending: boolean;
  emptyElement: ReactElement;
  isExplorer?: boolean;
};

export const _StrategyContent: FC<Props> = ({
  strategies,
  isExplorer,
  isPending,
  emptyElement,
}) => {
  if (isPending) {
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
      className={cn('xl:gap-25 grid gap-20 lg:gap-10', styles.strategyList)}
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
    prev.isPending === next.isPending &&
    JSON.stringify(prev.strategies) === JSON.stringify(next.strategies)
);
