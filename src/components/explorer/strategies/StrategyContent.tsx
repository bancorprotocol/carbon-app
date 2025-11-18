import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnyStrategyWithFiat } from 'components/strategies/common/types';
import { StrategyBlock } from 'components/strategies/overview/strategyBlock/StrategyBlock';
import { StrategyBlockCreate } from 'components/strategies/overview/strategyBlock/StrategyBlockCreate';
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
import { sortStrategyFn, StrategyFilter, StrategySort } from './utils';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { SafeDecimal } from 'libs/safedecimal';
import { lsService } from 'services/localeStorage';
import styles from 'components/strategies/overview/StrategyContent.module.css';
import { useNavigate, useSearch } from '@tanstack/react-router';

const text = {
  '/explore/strategies': {
    strategies: 'Total Strategies',
    liquidity: 'Total Liquidity',
  },
  '/portfolio/strategies': {
    strategies: 'Your Strategies',
    liquidity: 'Your Liquidity',
  },
};

interface Props {
  url: '/explore/strategies' | '/portfolio/strategies';
}

export const StrategyContent: FC<Props> = ({ url }) => {
  const { strategies, isPending } = useStrategyCtx();
  const { selectedFiatCurrency: currentCurrency } = useFiatCurrency();
  const search = useSearch({ from: url });
  const nav = useNavigate({ from: url });

  const filter = useMemo(
    () => ({
      status: search.filter ?? 'all',
    }),
    [search.filter],
  );
  const setFilter = useCallback(
    (filter?: StrategyFilter) => {
      nav({
        search: (s) => ({ ...s, filter: filter?.status }),
        replace: true,
        resetScroll: false,
      });
    },
    [nav],
  );

  const sort = search.sort ?? 'trades';
  const setSort = useCallback(
    (sort?: StrategySort) => {
      nav({
        search: (s) => ({ ...s, sort }),
        replace: true,
        resetScroll: false,
      });
    },
    [nav],
  );

  const [layout, setLayout] = useState<StrategyLayout>(
    lsService.getItem('strategyLayout') ?? 'grid',
  );

  useEffect(() => {
    lsService.setItem('strategyLayout', layout);
  }, [layout]);

  const filtered = useMemo(() => {
    if (!strategies) return [];
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

  const sorted = useMemo(() => {
    const sortFn = sortStrategyFn[sort];
    const result = filtered.sort((a, b) => {
      const diff = sortFn(a, b);
      return diff || sortStrategyFn.recent(a, b);
    });
    return [...result];
  }, [filtered, sort]);

  const liquidityAmount = useMemo(() => {
    const amount = filtered.reduce(
      (acc, s) => acc.add(s.fiatBudget.total),
      new SafeDecimal(0),
    );
    return prettifyNumber(amount, { currentCurrency });
  }, [filtered, currentCurrency]);

  if (isPending) {
    return (
      <div className="grid place-items-center grow grid-area-[list]">
        <CarbonLogoLoading className="h-80" />
      </div>
    );
  }

  return (
    <>
      <div className="bg-main-900/20 text-white/60 flex gap-24 grid-area-[amount] rounded-full px-16 py-8 border border-main-500/40 text-12 md:text-14">
        <span>
          {text[url].strategies}: {filtered.length}
        </span>
        <span>
          {text[url].liquidity}: {liquidityAmount}
        </span>
      </div>
      <div
        role="toolbar"
        className="grid grid-flow-col items-center sm:justify-end gap-16 grid-area-[filters]"
      >
        <StrategyFilterDropdown filter={filter} setFilter={setFilter} />
        <StrategySortDropdown sort={sort} setSort={setSort} />
        <StrategySelectLayout layout={layout} setLayout={setLayout} />
      </div>
      <StrategyList url={url} strategies={sorted} layout={layout} />
    </>
  );
};

interface StrategyListProps {
  strategies: AnyStrategyWithFiat[];
  layout: StrategyLayout;
  url: Props['url'];
}
const StrategyList: FC<StrategyListProps> = ({ url, strategies, layout }) => {
  const { belowBreakpoint } = useBreakpoints();
  const [max, setMax] = useState(21);

  const isExplorer = url === '/explore/strategies';

  if (!strategies?.length) {
    return (
      <NotFound
        variant="info"
        title="No results found"
        text="Try changing the search term"
        className="surface rounded-2xl grid-area-[list]"
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
        className={cn('grid gap-16 grid-area-[list]', styles.strategyList)}
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
        {max < strategies.length && (
          <Paginator increase={() => setMax((v) => v + 21)} />
        )}
      </ul>
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
