import { FC, useEffect, useMemo, useRef, useState } from 'react';
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

const text = {
  '/explore': {
    strategies: 'Total Strategies',
    liquidity: 'Total Liquidity',
  },
  '/portfolio': {
    strategies: 'Your Strategies',
    liquidity: 'Your Liquidity',
  },
};

interface Props {
  url: '/explore' | '/portfolio';
}

export const StrategyContent: FC<Props> = ({ url }) => {
  const { selectedFiatCurrency: currentCurrency } = useFiatCurrency();
  const [filter, setFilter] = useState<StrategyFilter>({ status: 'all' });
  const [sort, setSort] = useState<StrategySort>('trades');
  const [layout, setLayout] = useState<StrategyLayout>(
    lsService.getItem('strategyLayout') ?? 'grid',
  );
  const { strategies, isPending } = useStrategyCtx();

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
    const result = filtered.sort(sortFn);
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
      <div className="text-white/60 flex gap-24 grid-area-[amount] rounded-full px-16 py-8 border-2 border-white/10">
        <span>
          {text[url].strategies}: {filtered.length}
        </span>
        <span>
          {text[url].liquidity}: {liquidityAmount}
        </span>
      </div>
      <div
        role="toolbar"
        className="grid grid-flow-col sm:justify-end gap-16 grid-area-[filters]"
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
  url: '/explore' | '/portfolio';
}
const StrategyList: FC<StrategyListProps> = ({ url, strategies, layout }) => {
  const { belowBreakpoint } = useBreakpoints();
  const [max, setMax] = useState(21);

  const isExplorer = url === '/explore';

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
