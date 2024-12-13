import { FC, memo, ReactElement } from 'react';
import { StrategyWithFiat } from 'libs/queries';
import { m } from 'libs/motion';
import { StrategyBlock } from 'components/strategies/overview/strategyBlock';
import { StrategyBlockCreate } from 'components/strategies/overview/strategyBlock';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { cn } from 'utils/helpers';
import { StrategyTable } from './StrategyTable';
import { StrategyLayout } from '../StrategySelectLayout';
import { lsService } from 'services/localeStorage';
import styles from './StrategyContent.module.css';
import { useBreakpoints } from 'hooks/useBreakpoints';

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

  if (layout === 'table' && !belowBreakpoint('xl')) {
    return <StrategyTable strategies={strategies} />;
  }

  return (
    <ul
      data-testid="strategy-list"
      className={cn('xl:gap-25 grid gap-20 lg:gap-10', styles.strategyList)}
    >
      {strategies.map((s) => (
        <StrategyBlock key={s.id} strategy={s} />
      ))}
      {!isExplorer && <StrategyBlockCreate />}
    </ul>
  );
};

export const StrategyContent = memo(_StrategyContent, (prev, next) => {
  if (prev.isPending && next.isPending) return true;
  if (prev.layout !== next.layout) return false;
  return JSON.stringify(prev.strategies) === JSON.stringify(next.strategies);
});
