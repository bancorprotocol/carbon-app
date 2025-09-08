import { useStrategyCtx } from 'hooks/useStrategies';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { useMemo } from 'react';
import { useStore } from 'store';
import { prettifyNumber } from 'utils/helpers';

interface PairRow {
  id: string;
  base: Token;
  quote: Token;
  tradeCount: number;
  tradeCount24h: number;
  strategyAmount: number;
  liquidity: SafeDecimal;
}

export const ExplorerPairs = () => {
  const strategies = useStrategyCtx();
  const {
    fiatCurrency: { selectedFiatCurrency },
  } = useStore();

  const pairs = useMemo(() => {
    const map: Record<string, PairRow> = {};
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
    return Object.values(map).map((row) => ({
      ...row,
      liquidity: prettifyNumber(row.liquidity, {
        currentCurrency: selectedFiatCurrency,
      }),
    }));
  }, [selectedFiatCurrency, strategies]);

  return (
    <>
      <div
        role="toolbar"
        className="flex items-center justify-end gap-16 grid-area-[filters]"
      >
        {/* TODO: add filter & sort */}
      </div>
      <table className="w-full border-collapse md:bg-background-900 rounded-2xl grid-area-[list]">
        <thead>
          <tr className="border-background-800 text-14 border-b text-white/60">
            <th className="text-14 text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
              Token Pair
            </th>
            <th className="text-14 text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
              Trades
            </th>
            <th className="text-14 text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
              24h Trades
            </th>
            <th className="text-14 text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
              # of Sthategies
            </th>
            <th className="text-14 text-start font-normal py-16 pl-8 whitespace-nowrap first:pl-24 last:pr-24 last:text-end">
              Liquidity
            </th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((pair) => (
            <tr key={pair.id}>
              <td className="py-12 pl-8 first:pl-24"></td>
              <td className="py-12 pl-8 first:pl-24">{pair.tradeCount}</td>
              <td className="py-12 pl-8 first:pl-24">{pair.tradeCount24h}</td>
              <td className="py-12 pl-8 first:pl-24">{pair.strategyAmount}</td>
              <td className="py-12 pl-8 first:pl-24">{pair.liquidity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
