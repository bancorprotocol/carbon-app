import { buttonStyles } from 'components/common/button/buttonStyles';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { useTokens } from 'hooks/useTokens';
import { Strategy, useGetStrategyList } from 'libs/queries';
import {
  PairTrade,
  Trending,
  useTrending,
} from 'libs/queries/extApi/tradeCount';
import { Link } from 'libs/routing';
import { Token } from 'libs/tokens';
import { CSSProperties, useEffect, useRef } from 'react';
import { toPairSlug } from 'utils/pairSearch';

const getTrendingPairs = (
  tokensMap: Map<string, Token>,
  trending?: Trending,
) => {
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
    }))
    .filter((pair) => !!pair.base && !!pair.quote);
  return { isLoading: false, data };
};

interface StrategyWithTradeCount extends Strategy {
  trades: number;
}
const useTrendStrategies = (
  trending?: Trending,
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
  const ids = list.map((s) => s.id);
  const query = useGetStrategyList(ids);
  if (query.isLoading) return { isLoading: true, data: [] };

  const data = (query.data ?? []).map((strategy) => ({
    ...strategy,
    trades: record[strategy.id],
  }));
  return { isLoading: false, data };
};

export const ExplorerHeader = () => {
  const { tokensMap } = useTokens();
  const { data: trending, isLoading, isError } = useTrending();
  const trendingStrategies = useTrendStrategies(trending);
  const trendingPairs = getTrendingPairs(tokensMap, trending);
  const strategies = trendingStrategies.data;
  const pairs = trendingPairs.data;

  const strategiesLoading = trendingStrategies.isLoading || isLoading;
  const pairLoading = trendingPairs.isLoading || isLoading;
  if (isError) return;
  return (
    <header className="mb-42 flex gap-32">
      <article className="flex w-full flex-col items-center justify-around gap-16 py-20 md:w-[40%] md:items-start">
        <h2 className="text-24 font-weight-400 font-title my-0">
          Total Trades
        </h2>
        <Trades trades={trending?.totalTradeCount} />
        <div className="flex gap-16">
          <Link to="/trade" className={buttonStyles({ variant: 'success' })}>
            Create
          </Link>
          <Link
            to="/trade/market"
            className={buttonStyles({ variant: 'white' })}
          >
            Trade
          </Link>
        </div>
      </article>
      <article className="border-background-800 hidden flex-1 gap-8 rounded border-2 p-20 md:block">
        <h2 className="text-20 font-weight-400 font-title">Popular Pairs</h2>
        <table className="font-weight-500 text-14 w-full">
          <thead className="text-16 text-white/60">
            <tr>
              <th className="font-weight-400 text-start">Token Pair</th>
              <th className="font-weight-400 text-end">Trades</th>
            </tr>
          </thead>
          <tbody className="font-weight-500">
            {pairLoading &&
              [1, 2, 3].map((id) => (
                <tr key={id}>
                  <td>
                    <Loading height={34} />
                  </td>
                  <td>
                    <Loading height={34} />
                  </td>
                </tr>
              ))}
            {pairs.map(({ pairAddress, base, quote, trades }) => (
              <tr key={pairAddress}>
                <td>
                  <Link
                    to="/explore/$slug"
                    params={{
                      slug: toPairSlug(base, quote),
                    }}
                    className="block w-full"
                  >
                    <div className="inline-flex items-center gap-8">
                      <TokensOverlap tokens={[base, quote]} size={18} />
                      <span>{base?.symbol}</span>
                      <span className="text-white/60">/</span>
                      <span>{quote?.symbol}</span>
                    </div>
                  </Link>
                </td>
                <td className="py-8 text-end">
                  <Link
                    to="/explore/$slug"
                    params={{
                      slug: toPairSlug(base, quote),
                    }}
                    className="block w-full"
                  >
                    {formatter.format(trades)}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      <article className="border-background-800 hidden flex-1 gap-8 rounded border-2 p-20 lg:block">
        <h2 className="text-20 font-weight-400 font-title">
          Trending Strategies
        </h2>
        <table className="text-14 w-full">
          <thead className="text-16 text-white/60">
            <tr>
              <th className="font-weight-400 text-start">ID</th>
              <th className="font-weight-400 text-end">Trades</th>
            </tr>
          </thead>
          <tbody className="font-weight-500">
            {strategiesLoading &&
              [1, 2, 3].map((id) => (
                <tr key={id}>
                  <td>
                    <Loading height={34} />
                  </td>
                  <td>
                    <Loading height={34} />
                  </td>
                </tr>
              ))}
            {strategies.map(({ id, idDisplay, base, quote, trades }) => (
              <tr key={id}>
                <td>
                  <Link
                    to="/strategy/$id"
                    params={{ id }}
                    className="block w-full"
                  >
                    <div className="bg-background-700 flex gap-8 rounded px-8">
                      <TokensOverlap tokens={[base, quote]} size={18} />
                      {idDisplay}
                    </div>
                  </Link>
                </td>
                <td className="w-full py-8 text-end">
                  <Link
                    to="/strategy/$id"
                    params={{ id }}
                    className="block w-full"
                  >
                    {formatter.format(trades)}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </header>
  );
};

const Loading = (style: CSSProperties) => (
  <div className="animate-pulse p-4" style={style}>
    <div className="bg-background-700 h-full rounded"></div>
  </div>
);

const formatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

interface TradesProps {
  trades?: number;
}

const Trades = ({ trades }: TradesProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const anims = useRef<Promise<Animation>[]>(null);
  const lastTrades = useRef(0);
  const initDelta = 60;

  useEffect(() => {
    if (typeof trades !== 'number') return;
    let tradesChanged = false;
    const start = async () => {
      const from = lastTrades.current || trades - initDelta;
      const to = trades;
      const letters = ref.current!.children;
      // Initial animation
      if (!lastTrades.current) {
        const initAnims: Promise<Animation>[] = [];
        const next = formatter.format(from).split('');
        for (let i = 0; i < next.length; i++) {
          const v = next[i];
          if (!'0123456789'.includes(v)) continue;
          const anim = letters[i]?.animate(
            [{ transform: `translateY(-${v}0%)` }],
            {
              duration: 1000,
              delay: i * 100,
              fill: 'forwards',
              easing: 'cubic-bezier(1,-0.54,.65,1.46)',
            },
          );
          if (anim) initAnims.push(anim.finished);
        }
        await Promise.allSettled(initAnims);
      }
      // Wait for lingering animations if any
      await Promise.allSettled(anims.current ?? []);
      anims.current = [];
      let previous = formatter.format(from - 1).split('');
      for (let value = from; value <= to; value++) {
        const next = formatter.format(value).split('');
        for (let i = 0; i < next.length; i++) {
          if (tradesChanged) return;
          const v = next[i];
          if (!'0123456789'.includes(v)) continue;
          if (previous[i] === next[i]) continue;
          const anim = letters[i].animate(
            [{ transform: `translateY(-${v}0%)` }],
            {
              duration: 1000,
              delay: 2000,
              fill: 'forwards',
              easing: 'cubic-bezier(1,.11,.55,.79)',
            },
          );
          anims.current.push(anim.finished);
        }
        previous = next;
        await Promise.allSettled(anims.current ?? []);
        lastTrades.current = value;
      }
    };
    start();
    return () => {
      tradesChanged = true;
    };
  }, [trades]);

  if (typeof trades !== 'number') {
    return <Loading height={40} width="10ch" fontSize="36px" />;
  }

  const initial = trades ? formatter.format(trades - initDelta) : '0';
  return (
    <p ref={ref} className="text-36 font-title flex h-[40px] overflow-hidden">
      {initial.split('').map((v, i) => {
        if (!'0123456789'.includes(v)) return <span key={i}>{v}</span>;
        return (
          <span key={i} className="grid h-max text-center">
            <span>0</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
          </span>
        );
      })}
    </p>
  );
};
