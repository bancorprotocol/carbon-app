import { FC, memo, ReactElement } from 'react';
import { StrategyWithFiat } from 'libs/queries';
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
      <div key="loading" className="flex flex-grow items-center justify-center">
        <div className="h-80">
          <CarbonLogoLoading />
        </div>
      </div>
    );
  }

  if (!strategies?.length) return emptyElement;

  return (
    <ul
      data-testid="strategy-list"
      className={cn('grid gap-20', styles.strategyList)}
    >
      {strategies.map((s, i) => {
        const animate = i < 12;
        const style = { ['--delay' as any]: `${i * 50}ms` };
        return (
          <StrategyBlock
            key={s.id}
            className={cn(
              styles.strategyItem,
              animate ? styles.animateItem : ''
            )}
            strategy={s}
            isExplorer={isExplorer}
            style={animate ? style : undefined}
          />
        );
      })}
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
