import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { AnyStrategyWithFiat } from 'components/strategies/common/types';
import { StrategyBlock } from 'components/strategies/overview/strategyBlock';
import { StrategyBlockCreate } from 'components/strategies/overview/strategyBlock';
import { cn } from 'utils/helpers';
import { StrategyTable } from './StrategyTable';
import { StrategyLayout, StrategySelectLayout } from '../StrategySelectLayout';
import { lsService } from 'services/localeStorage';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { NotFound } from 'components/common/NotFound';
import {
  StrategyFilterDropdown,
  StrategySortDropdown,
} from './StrategyFilterSort';
import { useStrategyCtx } from 'hooks/useStrategies';
import { useRouterState } from '@tanstack/react-router';
import {
  getCompareFunctionBySortType,
  getFilterFromLS,
  getSortFromLS,
} from './utils';
import styles from './StrategyContent.module.css';

export const StrategyContent = () => {
  const [layout, setLayout] = useState(
    lsService.getItem('strategyLayout') || 'grid',
  );
  const [filter, setFilter] = useState(getFilterFromLS());
  const [sort, setSort] = useState(getSortFromLS());

  useEffect(() => {
    lsService.setItem('strategyLayout', layout);
  }, [layout]);
  useEffect(() => {
    lsService.setItem('strategyOverviewFilter', filter);
  }, [filter]);
  useEffect(() => {
    lsService.setItem('strategyOverviewSort', sort);
  }, [sort]);

  const strategies = useStrategyCtx();

  const filteredStrategies = useMemo(() => {
    return strategies.filter((strategy) => {
      if (filter.status === 'active' && strategy.status !== 'active') {
        return false;
      }
      if (filter.status === 'inactive' && strategy.status === 'active') {
        return false;
      }
      // @todo(gradient)
      // if (filter.type === 'gradient' && !isGradientStrategy(strategy)) {
      //   return false;
      // }
      // if (filter.type === 'static' && isGradientStrategy(strategy)) {
      //   return false;
      // }
      return true;
    });
  }, [strategies, filter]);

  const sortedStrategies = useMemo(() => {
    const compareFunction = getCompareFunctionBySortType(sort);
    return filteredStrategies.sort((a, b) => {
      const order = compareFunction(a, b);
      return order || getCompareFunctionBySortType('recent')(a, b);
    });
  }, [filteredStrategies, sort]);

  return (
    <>
      <header role="toolbar" className="flex justify-end gap-16">
        <StrategyFilterDropdown filter={filter} setFilter={setFilter} />
        <StrategySortDropdown sort={sort} setSort={setSort} />
        <StrategySelectLayout layout={layout} setLayout={setLayout} />
      </header>
      <StrategyList strategies={sortedStrategies} layout={layout} />
    </>
  );
};

interface StrategyListProps {
  strategies: AnyStrategyWithFiat[];
  layout: StrategyLayout;
}
const StrategyList: FC<StrategyListProps> = ({ strategies, layout }) => {
  const { location } = useRouterState();
  const { belowBreakpoint } = useBreakpoints();
  const [max, setMax] = useState(21);

  const isExplorer = useMemo(
    () => location.pathname.startsWith('/explore'),
    [location.pathname],
  );

  if (!strategies?.length) {
    return (
      <NotFound
        variant="info"
        title="No results found"
        text="Try changing the search term"
      />
    );
  }

  if (layout === 'table' && !belowBreakpoint('xl')) {
    return (
      <>
        <StrategyTable strategies={strategies.slice(0, max)} />
        {max < strategies.length && (
          <Paginator increase={() => setMax((v) => v + 21)} />
        )}
      </>
    );
  }

  return (
    <>
      <ul
        data-testid="strategy-list"
        className={cn('grid gap-20', styles.strategyList)}
      >
        {strategies.slice(0, max).map((s, i) => {
          const animate = i < 21;
          const style = { ['--delay' as any]: `${i * 50}ms` };
          return (
            <StrategyBlock
              key={s.id}
              className={cn(
                styles.strategyItem,
                animate ? styles.animateItem : '',
              )}
              strategy={s}
              isExplorer={isExplorer}
              style={animate ? style : undefined}
            />
          );
        })}
        {!isExplorer && <StrategyBlockCreate />}
      </ul>
      {max < strategies.length && (
        <Paginator increase={() => setMax((v) => v + 21)} />
      )}
    </>
  );
};

const Paginator = ({ increase }: { increase: () => any }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio > 0) increase();
      },
      { rootMargin: '500px' },
    );
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, [increase]);
  return <div ref={ref} className="invisible"></div>;
};
