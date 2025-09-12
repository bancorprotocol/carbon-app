import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { PairContent } from 'components/explorer/pairs/PairContent';
import { useStrategyCtx } from 'hooks/useStrategies';
import { SafeDecimal } from 'libs/safedecimal';
import { useMemo, useState } from 'react';
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

export const PairLayout = () => {
  const { strategies, isPending } = useStrategyCtx();
  const { selectedFiatCurrency: currentCurrency } = useFiatCurrency();

  const [filter, setFilter] = useState<PairFilter>('all');
  const [sort, setSort] = useState<PairSort>('trades');

  const allPairs = useMemo(() => {
    if (!strategies) return [];
    const map: Record<string, RawPairRow> = {};
    for (const strategy of strategies) {
      const { base, quote, tradeCount, tradeCount24h, fiatBudget } = strategy;
      const pairKey = `${base.address}_${quote.address}`;
      map[pairKey] ||= {
        id: pairKey,
        base,
        quote,
        tradeCount: 0,
        tradeCount24h: 0,
        strategyAmount: 0,
        liquidity: new SafeDecimal(0),
      };
      const liquidity = map[pairKey].liquidity.add(fiatBudget.total);
      map[pairKey].tradeCount += tradeCount;
      map[pairKey].tradeCount24h += tradeCount24h;
      map[pairKey].strategyAmount++;
      map[pairKey].liquidity = liquidity;
    }
    return Object.values(map);
  }, [strategies]);

  const filtered = useMemo(() => {
    return allPairs.filter((pair) => {
      if (filter === 'all') return true;
      return pair.liquidity.gte(100);
    });
  }, [allPairs, filter]);

  const sorted = useMemo(() => {
    const sortFn = sortPairFn[sort];
    return filtered.sort(sortFn);
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

  if (isPending) {
    return (
      <div className="grid place-items-center grow grid-area-[list]">
        <CarbonLogoLoading className="h-80" />
      </div>
    );
  }

  return (
    <>
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
