import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { PairContent } from 'components/explorer/pairs/PairContent';
import { useStrategyCtx } from 'hooks/useStrategies';
import { SafeDecimal } from 'libs/safedecimal';
import { FC, useMemo, useState } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { RawPairRow } from 'components/explorer/pairs/types';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import {
  PairFilter,
  PairSort,
  sortPairFn,
} from 'components/explorer/pairs/utils';
import {
  PairFilterDropdown,
  PairSortDropdown,
} from 'components/explorer/pairs/PairFilterSort';
import { toPairSlug } from 'utils/pairSearch';
import { useRewards } from 'libs/queries/extApi/rewards';
import { PairTrade, useTrending } from 'libs/queries/extApi/tradeCount';

const text = {
  '/explore': {
    pairs: 'Total Pairs',
    liquidity: 'Total Liquidity',
  },
  '/portfolio': {
    pairs: 'Your Pairs',
    liquidity: 'Your Liquidity',
  },
};

interface Props {
  url: '/explore' | '/portfolio';
}

export const PairLayout: FC<Props> = ({ url }) => {
  const { strategies, isPending } = useStrategyCtx();
  const { selectedFiatCurrency: currentCurrency } = useFiatCurrency();

  const [filter, setFilter] = useState<PairFilter>('all');
  const [sort, setSort] = useState<PairSort>('trades');

  const allPairKeys = useMemo(() => {
    if (!strategies) return [];
    const all = strategies.map((s) => toPairSlug(s.base, s.quote));
    return Array.from(new Set(all));
  }, [strategies]);
  const rewards = useRewards(allPairKeys);
  const trending = useTrending();

  const pairTradeCount = useMemo(() => {
    if (trending.isPending) return;
    const record: Record<string, PairTrade> = {};
    for (const pair of trending.data?.pairCount || []) {
      const slug = toPairSlug(
        { address: pair.token0 },
        { address: pair.token1 },
      );
      record[slug] = pair;
    }
    return record;
  }, [trending.data?.pairCount, trending.isPending]);

  // Order by alphabetic order to merge opposite pairs
  const ordered = useMemo(() => {
    if (!strategies) return;
    return strategies.sort((a, b) => {
      return a.base.address.localeCompare(b.base.address);
    });
  }, [strategies]);

  const allPairs = useMemo(() => {
    if (!ordered) return [];
    const map: Record<string, RawPairRow> = {};
    for (const strategy of ordered) {
      const { base, quote, fiatBudget } = strategy;
      // Merge both pair direction
      const directKey = toPairSlug(base, quote);
      const oppositeKey = toPairSlug(quote, base);
      const pairKey = map[oppositeKey] ? oppositeKey : directKey;
      const pairCount =
        pairTradeCount?.[directKey] || pairTradeCount?.[oppositeKey];

      map[pairKey] ||= {
        id: pairKey,
        base,
        quote,
        tradeCount: pairCount?.pairTrades ?? 0,
        tradeCount24h: pairCount?.pairTrades_24h ?? 0,
        strategyAmount: 0,
        liquidity: new SafeDecimal(0),
        reward: !!rewards.data?.[pairKey],
      };
      const liquidity = map[pairKey].liquidity.add(fiatBudget.total);
      map[pairKey].strategyAmount++;
      map[pairKey].liquidity = liquidity;
    }
    return Object.values(map);
  }, [ordered, pairTradeCount, rewards.data]);

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
      liquidity: prettifyNumber(row.liquidity, { currentCurrency }),
    }));
  }, [sorted, currentCurrency]);

  const liquidityAmount = useMemo(() => {
    const amount = filtered.reduce(
      (acc, p) => acc.add(p.liquidity),
      new SafeDecimal(0),
    );
    return prettifyNumber(amount, { currentCurrency });
  }, [filtered, currentCurrency]);

  if (isPending || rewards.isPending || trending.isPending) {
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
          {text[url].pairs}: {pairs.length}
        </span>
        <span>
          {text[url].liquidity}: {liquidityAmount}
        </span>
      </div>
      <div
        role="toolbar"
        className="flex items-center sm:justify-end gap-16 grid-area-[filters]"
      >
        <PairFilterDropdown filter={filter} setFilter={setFilter} />
        <PairSortDropdown sort={sort} setSort={setSort} />
      </div>
      <PairContent pairs={pairs} />
    </>
  );
};
