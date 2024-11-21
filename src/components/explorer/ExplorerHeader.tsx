import { buttonStyles } from 'components/common/button/buttonStyles';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { getStrategyType } from 'components/strategies/common/utils';
import { useTokens } from 'hooks/useTokens';
import { Strategy, useGetStrategList } from 'libs/queries';
import {
  PairTrade,
  Trending,
  useTrending,
} from 'libs/queries/extApi/tradeCount';
import { Link, StrategyType } from 'libs/routing';
import { useCallback, useEffect, useRef } from 'react';

const typeLabel = {
  disposable: 'Limit / Range',
  recurring: 'Recurring',
  overlapping: 'Concentrated',
};

const useTrendingPairs = (trending?: Trending) => {
  const { tokensMap } = useTokens();
  if (!trending) return { isLoading: true, data: [] };
  const pairs: Record<string, PairTrade> = {};
  for (const trade of trending?.pairCount ?? []) {
    pairs[trade.pairAddresses] ||= trade;
  }
  const list = Object.values(pairs)
    .filter((pair) => !!pair.pairTrades_24h)
    .sort((a, b) => b.pairTrades - a.pairTrades)
    .splice(0, 3);

  // If there are less than 3, pick the remaining best
  if (list.length < 3) {
    const remaining = Object.values(pairs)
      .filter((pair) => !!pair.pairTrades_24h)
      .sort((a, b) => b.pairTrades - a.pairTrades)
      .splice(0, 3 - list.length);
    list.push(...remaining);
  }

  // Sort again in case we had to add more
  const data = list
    .sort((a, b) => b.pairTrades - a.pairTrades)
    .map((pair) => ({
      pairAddress: pair.pairAddresses,
      base: tokensMap.get(pair.token0.toLowerCase())!,
      quote: tokensMap.get(pair.token1.toLowerCase())!,
      trades: pair.pairTrades,
    }));
  return { isLoading: false, data };
};

interface StrategyWithTradeCount extends Strategy {
  trades: number;
  type: StrategyType;
}
const useTrendStrategies = (
  trending?: Trending
): { isLoading: boolean; data: StrategyWithTradeCount[] } => {
  const trades = trending?.tradeCount ?? [];
  const list = trades
    .filter((t) => !!t.strategyTrades_24h)
    .sort((a, b) => b.strategyTrades - a.strategyTrades)
    .splice(0, 3);

  // If there are less than 3, pick the remaining best
  if (list.length < 3) {
    const remaining = trades
      .filter((t) => !!t.strategyTrades_24h)
      .sort((a, b) => b.strategyTrades - a.strategyTrades)
      .splice(0, 3 - list.length);
    list.push(...remaining);
  }

  const record: Record<string, number> = {};
  for (const item of list) {
    record[item.id] = item.strategyTrades;
  }
  const ids = list
    .sort((a, b) => b.strategyTrades - a.strategyTrades)
    .map((s) => s.id);
  const query = useGetStrategList(ids);
  if (query.isLoading) return { isLoading: true, data: [] };

  const data = (query.data ?? []).map((strategy) => ({
    ...strategy,
    type: getStrategyType(strategy),
    trades: record[strategy.id],
  }));
  return { isLoading: false, data };
};

export const ExplorerHeader = () => {
  const { data: trending } = useTrending();
  const trendingStrategies = useTrendStrategies(trending);
  const trendingPairs = useTrendingPairs(trending);
  const strategies = trendingStrategies.data;
  const pairs = trendingPairs.data;
  return (
    <header className="mb-42 flex gap-32">
      <article className="flex flex-1 flex-col items-center justify-around gap-16 md:items-start">
        <h2 className="text-24 font-weight-700 font-title">Total Trades</h2>
        <Trades
          trades={trending?.totalTradeCount ?? 0}
          className="text-36 font-weight-700 font-title"
        />
        <div className="flex gap-16">
          <Link to="/trade" className={buttonStyles({ variant: 'success' })}>
            Trade
          </Link>
          <Link
            to="/trade/disposable"
            className={buttonStyles({ variant: 'white' })}
          >
            Create Strategy
          </Link>
        </div>
      </article>
      <article className="border-background-800 hidden flex-1 rounded border-2 p-20 md:block">
        <h2 className="text-24 font-weight-700 font-title">Popular Pairs</h2>
        <table className="font-weight-500 w-full">
          <thead className="text-18 text-white/60">
            <tr>
              <td>Token Pair</td>
              <td className="text-end">Trades</td>
            </tr>
          </thead>
          <tbody>
            {trendingPairs.isLoading &&
              [1, 2, 3].map((id) => (
                <tr key={id}>
                  <td>
                    <Loading />
                  </td>
                  <td>
                    <Loading />
                  </td>
                </tr>
              ))}
            {pairs.map(({ pairAddress, base, quote, trades }) => (
              <tr key={pairAddress}>
                <td>
                  <div className="inline-flex items-center gap-8">
                    <TokensOverlap tokens={[base, quote]} size={18} />
                    <span>{base?.symbol}</span>
                    <span className="text-white/60">/</span>
                    <span>{quote?.symbol}</span>
                  </div>
                </td>
                <td className="text-end">
                  <Trades trades={trades} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      <article className="border-background-800 hidden flex-1 rounded border-2 p-20 lg:block">
        <h2 className="text-24 font-weight-700 font-title">
          Trending Strategies
        </h2>
        <table className="font-weight-500 w-full">
          <thead className="text-18 text-white/60">
            <tr>
              <td>ID</td>
              <td>Types</td>
              <td className="text-end">Trades</td>
            </tr>
          </thead>
          <tbody>
            {trendingStrategies.isLoading &&
              [1, 2, 3].map((id) => (
                <tr key={id}>
                  <td>
                    <Loading />
                  </td>
                  <td>
                    <Loading />
                  </td>
                  <td>
                    <Loading />
                  </td>
                </tr>
              ))}
            {strategies.map(({ id, idDisplay, base, quote, type, trades }) => (
              <tr key={id}>
                <td>
                  <div className="bg-background-700 inline-flex gap-8 rounded px-8">
                    <TokensOverlap tokens={[base, quote]} size={18} />
                    {idDisplay}
                  </div>
                </td>
                <td>{typeLabel[type]}</td>
                <td className="text-end">
                  <Trades trades={trades} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </header>
  );
};

const Loading = () => (
  <div className="h-[30px] animate-pulse p-4">
    <div className="bg-background-700 h-full rounded"></div>
  </div>
);

const formatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

interface TradesProps {
  trades: number;
  className?: string;
}
const frames = 60 * 60 * 3; // 3min
const Trades = ({ trades, className }: TradesProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const values = useRef<string[]>([]);
  const lastTrades = useRef(0);

  const runAnimation = useCallback(() => {
    const figure = ref.current;
    if (!figure) return;
    const run = () => {
      const next = values.current.shift();
      if (next) {
        figure.textContent = next;
        if (values.current.length > 0) requestAnimationFrame(run);
      }
    };
    requestAnimationFrame(run);
  }, []);

  useEffect(() => {
    const last = lastTrades.current;
    if (last === trades) return;
    if (!last) {
      const nextValues = new Array(frames);
      for (let i = 0; i < frames; i++) {
        const percent = Math.pow(i / frames, 1 / 20); // ease-ouy
        const v = Math.round(trades * percent);
        nextValues[i] = formatter.format(v);
      }
      values.current = nextValues;
      runAnimation();
    } else {
      const nextValues = new Array(frames);
      const delta = trades - last;
      for (let i = 0; i < frames; i++) {
        const percent = i / frames; // linear
        const v = Math.round(delta * percent);
        nextValues[i] = formatter.format(v + last);
      }
      if (!values.current.length) {
        values.current = nextValues;
        runAnimation();
      } else {
        values.current.push(...nextValues);
      }
    }
    lastTrades.current = trades;
  }, [trades, runAnimation]);

  return (
    <p ref={ref} className={className}>
      {trades}
    </p>
  );
};
