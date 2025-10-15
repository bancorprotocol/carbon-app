import { UseQueryResult } from '@tanstack/react-query';
import { Loading } from 'components/common/Loading';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { useGetEnrichedStrategies } from 'hooks/useStrategies';
import { useTokens } from 'hooks/useTokens';
import { useGetAllStrategies } from 'libs/queries';
import {
  PairTrade,
  Trending,
  useTrending,
} from 'libs/queries/extApi/tradeCount';
import { Link } from 'libs/routing';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { cn, getLowestBits, prettifyNumber } from 'utils/helpers';
import { toPairSlug } from 'utils/pairSearch';

interface PairTrendingQuery {
  isPending: boolean;
  data: {
    pairAddress: string;
    base: Token;
    quote: Token;
    trades: number;
  }[];
}
const useTrendingPairs = (trending: UseQueryResult<Trending, Error>) => {
  const { getTokenById, isPending } = useTokens();
  if (trending.isPending || isPending) return { isPending: true, data: [] };
  const pairs: Record<string, PairTrade> = {};
  for (const trade of trending.data?.pairCount ?? []) {
    pairs[trade.pairAddresses] ||= trade;
  }
  const list = Object.values(pairs)
    .filter((pair) => !!pair.pairTrades_24h)
    .sort((a, b) => b.pairTrades - a.pairTrades)
    .splice(0, 3);

  // If there are less than 3, pick the remaining best
  if (list.length < 3) {
    const ids = list.map((p) => p.pairId);
    const remaining = Object.values(pairs)
      .filter((pair) => !!pair.pairTrades_24h && !ids.includes(pair.pairId))
      .sort((a, b) => b.pairTrades - a.pairTrades)
      .splice(0, 3 - list.length);
    list.push(...remaining);
  }

  // Sort again in case we had to add more
  const data = list
    .sort((a, b) => b.pairTrades - a.pairTrades)
    .map((pair) => ({
      pairAddress: pair.pairAddresses,
      base: getTokenById(pair.token0)!,
      quote: getTokenById(pair.token1)!,
      trades: pair.pairTrades,
    }))
    .filter((pair) => !!pair.base && !!pair.quote);
  return { isPending, data };
};

interface StrategyTrendingQuery {
  isPending: boolean;
  data: {
    id: string;
    idDisplay: string;
    base: Token | undefined;
    quote: Token | undefined;
    trades: number;
  }[];
}
const useTrendStrategies = (trending: UseQueryResult<Trending, Error>) => {
  const { getTokenById, isPending } = useTokens();
  if (trending.isPending || isPending) return { isPending: true, data: [] };
  const trades = trending.data?.tradeCount ?? [];
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

  return {
    isPending: isPending,
    data: list.map((item) => ({
      id: item.id,
      idDisplay: getLowestBits(item.id),
      base: getTokenById(item.token0),
      quote: getTokenById(item.token1),
      trades: item.strategyTrades,
    })),
  };
};

const useTotalExchange = () => {
  const query = useGetAllStrategies({ enabled: true });
  const { isPending, data } = useGetEnrichedStrategies(query);
  const result = useMemo(() => {
    if (isPending) return;
    return data!
      .reduce((acc, strategy) => {
        return acc.add(strategy.fiatBudget.total);
      }, new SafeDecimal(0))
      .toNumber();
  }, [isPending, data]);
  return result;
};

export const ExplorerHeader = () => {
  const { selectedFiatCurrency: currentCurrency } = useFiatCurrency();

  const trending = useTrending();
  const trendingStrategies = useTrendStrategies(trending);
  const trendingPairs = useTrendingPairs(trending);
  const totalExchange = useTotalExchange();

  const formatInt = useCallback((value: number) => {
    return prettifyNumber(value, { isInteger: true });
  }, []);
  const formatCurrency = useCallback(
    (value: number) => {
      return prettifyNumber(value, { currentCurrency, isInteger: true });
    },
    [currentCurrency],
  );

  if (trending.isError) return;
  return (
    <header className="bg-black/20">
      <div className="flex gap-32 max-w-[1920px] mx-auto px-16 py-24 px-content xl:px-50">
        <article className="flex w-full flex-col items-center justify-around gap-16 py-20 md:w-[40%] md:items-start font-title">
          <h2 className="text-24 font-normal my-0">Total Trades</h2>
          <RollingNumber
            value={trending.data?.totalTradeCount}
            format={formatInt}
            loadingWidth="10ch"
          />
          <div className="flex gap-16">
            <div className="grid gap-8">
              <h3 className="text-16">Total Exchanges</h3>
              <RollingNumber
                value={totalExchange}
                className="text-24"
                format={formatCurrency}
                loadingWidth="7ch"
              />
            </div>
            <div className="grid gap-8">
              <h3 className="text-16">Total Strategies</h3>
              <RollingNumber
                value={trending.data?.tradeCount.length}
                className="text-24"
                format={formatInt}
                delay={9_000}
                loadingWidth="4ch"
              />
            </div>
          </div>
        </article>
        <article className="surface hidden flex-1 gap-8 rounded-2xl p-20 md:grid">
          <h2 className="text-20 font-normal font-title">Popular Pairs</h2>
          <table className="font-medium text-14 w-full">
            <thead className="text-16 text-white/60">
              <tr>
                <th className="font-normal text-start">Token Pair</th>
                <th className="font-normal text-end">Trades</th>
              </tr>
            </thead>
            <tbody className="font-medium">
              <PairRows query={trendingPairs} />
            </tbody>
          </table>
        </article>
        <article className="surface hidden flex-1 gap-8 rounded-2xl p-20 lg:grid">
          <h2 className="text-20 font-normal font-title">
            Trending Strategies
          </h2>
          <table className="text-14 w-full">
            <thead className="text-16 text-white/60">
              <tr>
                <th className="font-normal text-start">ID</th>
                <th className="font-normal text-end">Trades</th>
              </tr>
            </thead>
            <tbody className="font-medium">
              <StrategyRows query={trendingStrategies} />
            </tbody>
          </table>
        </article>
      </div>
    </header>
  );
};

interface PairTrendingProps {
  query: PairTrendingQuery;
}
const PairRows = ({ query }: PairTrendingProps) => {
  if (query.isPending) {
    return [1, 2, 3].map((id) => (
      <tr key={id}>
        <td>
          <Loading height={34} />
        </td>
        <td>
          <Loading height={34} />
        </td>
      </tr>
    ));
  }
  return query.data.map(({ pairAddress, base, quote, trades }) => (
    <tr key={pairAddress}>
      <td>
        <Link
          to="/explore"
          search={{
            search: toPairSlug(base, quote),
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
          to="/explore"
          search={{
            search: toPairSlug(base, quote),
          }}
          className="block w-full"
        >
          {prettifyNumber(trades, { isInteger: true })}
        </Link>
      </td>
    </tr>
  ));
};

interface StrategyTrendingProps {
  query: StrategyTrendingQuery;
}
const StrategyRows = ({ query }: StrategyTrendingProps) => {
  if (query.isPending) {
    return [1, 2, 3].map((id) => (
      <tr key={id}>
        <td>
          <Loading height={34} />
        </td>
        <td>
          <Loading height={34} />
        </td>
      </tr>
    ));
  }
  return query.data.map(({ id, idDisplay, base, quote, trades }) => (
    <tr key={id}>
      <td>
        <Link to="/strategy/$id" params={{ id }} className="block w-full">
          <div className="bg-main-600 flex gap-8 rounded-2xl px-8 py-4">
            <TokensOverlap tokens={[base!, quote!]} size={18} />
            {idDisplay}
          </div>
        </Link>
      </td>
      <td className="w-full py-8 text-end">
        <Link to="/strategy/$id" params={{ id }} className="block w-full">
          {prettifyNumber(trades, { isInteger: true })}
        </Link>
      </td>
    </tr>
  ));
};

interface TradesProps {
  value?: number;
  className?: string;
  delay?: number;
  loadingWidth: string;
  format: (value: number) => string;
}

const RollingNumber = ({
  value,
  format,
  delay,
  className,
  loadingWidth,
}: TradesProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const anims = useRef<Promise<Animation>[]>(null);
  const lastTrades = useRef(0);
  const initDelta = 60;

  useEffect(() => {
    if (typeof value !== 'number' || !value) return;
    let tradesChanged = false;
    const start = async () => {
      const from = lastTrades.current || value - initDelta;
      const to = value;
      const letters = ref.current!.children;
      // Initial animation
      if (!lastTrades.current) {
        const initAnims: Promise<Animation>[] = [];
        const next = format(from).split('');
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
      let previous = format(from - 1).split('');
      for (let value = from; value <= to; value++) {
        const next = format(value).split('');
        for (let i = 0; i < next.length; i++) {
          if (tradesChanged) return;
          const v = next[i];
          if (!'0123456789'.includes(v)) continue;
          if (previous[i] === next[i]) continue;
          const anim = letters[i].animate(
            [{ transform: `translateY(-${v}0%)` }],
            {
              duration: 1000,
              delay: delay ?? 2000,
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
  }, [format, value, delay]);

  if (typeof value !== 'number' || !value) {
    return <Loading height={40} width={loadingWidth} fontSize="36px" />;
  }

  const initial = format(value - initDelta);
  return (
    <p
      ref={ref}
      className={cn(
        'text-36 font-title flex h-[40px] overflow-hidden leading-40',
        className,
      )}
    >
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
