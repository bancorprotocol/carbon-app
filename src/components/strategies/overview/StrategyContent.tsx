import { FC, memo, ReactElement } from 'react';
import { StrategyWithFiat } from 'libs/queries';
import { StrategyBlock } from 'components/strategies/overview/strategyBlock';
import { StrategyBlockCreate } from 'components/strategies/overview/strategyBlock';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { cn } from 'utils/helpers';
import { StrategyTable } from './StrategyTable';
import { StrategyLayout } from '../StrategySelectLayout';
import { lsService } from 'services/localeStorage';
import { useBreakpoints } from 'hooks/useBreakpoints';
import styles from './StrategyContent.module.css';

type Props = {
  strategies: StrategyWithFiat[];
  isPending: boolean;
  emptyElement: ReactElement;
  isExplorer?: boolean;
  layout?: StrategyLayout;
};

export const _StrategyContent: FC<Props> = ({
  strategies,
  isExplorer,
  isPending,
  emptyElement,
  layout = lsService.getItem('strategyLayout') || 'grid',
}) => {
  const { belowBreakpoint } = useBreakpoints();

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

  if (layout === 'table' && !belowBreakpoint('xl')) {
    return <StrategyTable strategies={strategies} />;
  }

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

export const StrategyContent = memo(_StrategyContent, (prev, next) => {
  if (prev.isPending !== next.isPending) return false;
  if (prev.layout !== next.layout) return false;
  return JSON.stringify(prev.strategies) === JSON.stringify(next.strategies);
});
