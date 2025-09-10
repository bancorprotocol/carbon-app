import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { AnyStrategyWithFiat } from 'components/strategies/common/types';
import { StrategyBlock } from 'components/strategies/overview/strategyBlock';
import { StrategyBlockCreate } from 'components/strategies/overview/strategyBlock';
import { cn, prettifyNumber } from 'utils/helpers';
import { StrategyTable } from './StrategyTable';
import {
  StrategyLayout,
  StrategySelectLayout,
} from 'components/explorer/strategies/StrategySelectLayout';
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
  StrategyFilter,
  StrategySort,
} from './utils';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { SafeDecimal } from 'libs/safedecimal';
import styles from 'components/strategies/overview/StrategyContent.module.css';

export const StrategyContent = () => {
  const { selectedFiatCurrency: currentCurrency } = useFiatCurrency();
  const [layout, setLayout] = useState<StrategyLayout>('grid');
  const [filter, setFilter] = useState<StrategyFilter>({ status: 'all' });
  const [sort, setSort] = useState<StrategySort>('trades');
  const { strategies, isPending } = useStrategyCtx();

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

  const liquidityAmount = useMemo(() => {
    const amount = filteredStrategies.reduce(
      (acc, s) => acc.add(s.fiatBudget.total),
      new SafeDecimal(0),
    );
    return prettifyNumber(amount, { currentCurrency });
  }, [filteredStrategies, currentCurrency]);

  if (isPending) {
    return (
      <div className="grid place-items-center grow grid-area-[list]">
        <CarbonLogoLoading className="h-80" />
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-24 grid-area-[amount]">
        <span className="bg-background-900 rounded-2xl px-16 py-8">
          Total Amount: {filteredStrategies.length}
        </span>
        <span className="bg-background-900 rounded-2xl px-16 py-8">
          Total Liquidity: {liquidityAmount}
        </span>
      </div>
      <div
        role="toolbar"
        className="flex items-center justify-end gap-16 grid-area-[filters]"
      >
        <StrategyFilterDropdown filter={filter} setFilter={setFilter} />
        <StrategySortDropdown sort={sort} setSort={setSort} />
        <StrategySelectLayout layout={layout} setLayout={setLayout} />
      </div>
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
        className="grid-area-[list]"
      />
    );
  }

  if (layout === 'table' && !belowBreakpoint('xl')) {
    return (
      <>
        <StrategyTable
          className="grid-area-[list]"
          strategies={strategies.slice(0, max)}
        />
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
        className={cn('grid gap-20 grid-area-[list]', styles.strategyList)}
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
