import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { PairContent } from 'components/explorer/pairs/PairContent';
import { useStrategyCtx } from 'hooks/useStrategies';
import { SafeDecimal } from 'libs/safedecimal';
import { FC, useCallback, useMemo } from 'react';
import { getUsdPrice, prettifyNumber } from 'utils/helpers';
import { RawPairRow } from 'components/explorer/pairs/types';
import {
  PairFilter,
  PairSort,
  sortPairFn,
} from 'components/explorer/pairs/utils';
import {
  PairFilterDropdown,
  PairSortDropdown,
} from 'components/explorer/pairs/PairFilterSort';
import { useRewards } from 'libs/queries/extApi/rewards';
import {
  PairTrade,
  StrategyTrade,
  useTrending,
} from 'libs/queries/extApi/tradeCount';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { usePairs } from 'hooks/usePairs';

const text = {
  '/explore/pairs': {
    pairs: 'Total Pairs',
    liquidity: 'Total Liquidity',
  },
  '/portfolio/pairs': {
    pairs: 'Your Pairs',
    liquidity: 'Your Liquidity',
  },
};

const toSortedPairSlug = (base: string, quote: string) => {
  return [base, quote]
    .map((v) => v.toLowerCase())
    .sort((a, b) => a.localeCompare(b))
    .join('_');
};

type TradeMap = Record<string, { tradeCount: number; tradeCount24h: number }>;

interface Props {
  url: '/explore/pairs' | '/portfolio/pairs';
}

export const PairLayout: FC<Props> = ({ url }) => {
  const { getType } = usePairs();
  const { search, filter = 'all', sort = 'trades' } = useSearch({ from: url });
  const nav = useNavigate({ from: url });
  const { strategies, isPending } = useStrategyCtx();

  const setFilter = useCallback(
    (filter?: PairFilter) => {
      nav({
        search: (s) => ({ ...s, filter }),
        replace: true,
        resetScroll: false,
      });
    },
    [nav],
  );

  const setSort = useCallback(
    (sort?: PairSort) => {
      nav({
        search: (s) => ({ ...s, sort }),
        replace: true,
        resetScroll: false,
      });
    },
    [nav],
  );

  const rewards = useRewards();
  const trending = useTrending();

  // Order by alphabetic order to merge opposite pairs
  const ordered = useMemo(() => {
    if (!strategies) return;
    return strategies.sort((a, b) => {
      return a.base.address.localeCompare(b.base.address);
    });
  }, [strategies]);

  const tradesByPair = useMemo(() => {
    if (!ordered) return;
    const map: TradeMap = {};
    // On portfolio we take only the active strategy's trades
    if (url.includes('/portfolio') || getType(search) === 'wallet') {
      const record: Record<string, StrategyTrade> = {};
      for (const strategyTrade of trending.data?.tradeCount || []) {
        record[strategyTrade.id] = strategyTrade;
      }
      for (const strategy of ordered) {
        const base = strategy.base.address;
        const quote = strategy.quote.address;
        const key = toSortedPairSlug(base, quote);
        if (!record?.[strategy.id]) continue;
        map[key] ||= {
          tradeCount: 0,
          tradeCount24h: 0,
        };
        map[key].tradeCount += record[strategy.id].strategyTrades;
        map[key].tradeCount24h += record[strategy.id].strategyTrades_24h;
      }
    }
    // In explore we take the total amount of trade for this pair
    else {
      const record: Record<string, PairTrade> = {};
      for (const pair of trending.data?.pairCount || []) {
        const slug = toSortedPairSlug(pair.token0, pair.token1);
        record[slug] = pair;
      }
      for (const strategy of ordered) {
        const base = strategy.base.address;
        const quote = strategy.quote.address;
        const key = toSortedPairSlug(base, quote);
        if (!record[key]) continue;
        map[key] = {
          tradeCount: record[key].pairTrades,
          tradeCount24h: record[key].pairTrades_24h,
        };
      }
    }

    return map;
  }, [
    getType,
    ordered,
    search,
    trending.data?.pairCount,
    trending.data?.tradeCount,
    url,
  ]);

  const allPairs = useMemo(() => {
    if (!ordered || !tradesByPair) return [];
    const rewardPairs = new Set(rewards.data?.map((r) => r.pair));

    const map: Record<string, RawPairRow> = {};
    for (const strategy of ordered) {
      const { base, quote, fiatBudget } = strategy;
      // Merge both pair direction
      const pairKey = toSortedPairSlug(base.address, quote.address);
      const pairCount = tradesByPair[pairKey];
      map[pairKey] ||= {
        id: pairKey,
        base,
        quote,
        tradeCount: pairCount?.tradeCount ?? 0,
        tradeCount24h: pairCount?.tradeCount24h ?? 0,
        strategyAmount: 0,
        liquidity: new SafeDecimal(0),
        reward: rewardPairs.has(pairKey),
      };
      const liquidity = map[pairKey].liquidity.add(fiatBudget.total);
      map[pairKey].strategyAmount++;
      map[pairKey].liquidity = liquidity;
    }
    return Object.values(map);
  }, [ordered, rewards.data, tradesByPair]);

  const filtered = useMemo(() => {
    return allPairs.filter((pair) => {
      if (filter === 'all') return true;
      if (filter === 'rewards') return !!pair.reward;
      return pair.liquidity.gte(100);
    });
  }, [allPairs, filter]);

  const sorted = useMemo(() => {
    const sortFn = sortPairFn[sort];
    const result = filtered.sort(sortFn);
    return [...result];
  }, [filtered, sort]);

  const pairs = useMemo(() => {
    return sorted.map((row) => ({
      ...row,
      tradeCount: prettifyNumber(row.tradeCount, { isInteger: true }),
      tradeCount24h: prettifyNumber(row.tradeCount24h, { isInteger: true }),
      strategyAmount: prettifyNumber(row.strategyAmount, { isInteger: true }),
      liquidity: getUsdPrice(row.liquidity),
    }));
  }, [sorted]);

  const liquidityAmount = useMemo(() => {
    const amount = filtered.reduce(
      (acc, p) => acc.add(p.liquidity),
      new SafeDecimal(0),
    );
    return getUsdPrice(amount);
  }, [filtered]);

  if (isPending || rewards.isPending || trending.isPending) {
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
          {text[url].pairs}: {pairs.length}
        </span>
        <span>
          {text[url].liquidity}: {liquidityAmount}
        </span>
      </div>
      <div
        role="toolbar"
        className="grid grid-flow-col sm:justify-end gap-16 grid-area-[filters]"
      >
        <PairFilterDropdown filter={filter} setFilter={setFilter} />
        <PairSortDropdown sort={sort} setSort={setSort} />
      </div>
      <PairContent pairs={pairs} />
    </>
  );
};
