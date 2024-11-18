import { buttonStyles } from 'components/common/button/buttonStyles';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { getStrategyType } from 'components/strategies/common/utils';
import { useContract } from 'hooks/useContract';
import { useTokens } from 'hooks/useTokens';
import { Strategy, useGetStrategList } from 'libs/queries';
import {
  TradeCount,
  Trending,
  useTrending,
} from 'libs/queries/extApi/tradeCount';
import { Link, StrategyType } from 'libs/routing';
import { Token } from 'libs/tokens';
import { useState } from 'react';
import { prettifyNumber } from 'utils/helpers';

interface TrendingPair {
  pairAddress: string;
  base: Token;
  quote: Token;
  trades: number;
}

const typeLabel = {
  disposable: 'Limit / Range',
  recurring: 'Recurring',
  overlapping: 'Concentrated',
};

const useTrendingPairs = (trending?: Trending) => {
  const [loading, setLoading] = useState(true);
  const { tokensMap, importToken } = useTokens();
  const { Token } = useContract();

  // useEffect(() => {
  //   const missingTokens = new Set<string>();
  //   for (const { token0, token1 } of trending?.tradeCount ?? []) {
  //     if (!tokensMap.has(token0.toLowerCase())) missingTokens.add(token0);
  //     if (!tokensMap.has(token1.toLowerCase())) missingTokens.add(token1);
  //   }
  //   if (!missingTokens.size) return;
  //   const getTokens = Array.from(missingTokens).map((address) => {
  //     return fetchTokenData(Token, address);
  //   });
  //   Promise.all(getTokens).then((tokens) => {
  //     console.log({ tokens });
  //     tokens.forEach((data) => importToken(data));
  //     setLoading(false);
  //   });
  // }, [Token, importToken, tokensMap, trending?.tradeCount]);
  if (!trending) return { isLoading: true, data: [] };

  const isMissingToken = (trade: TradeCount) => {
    if (!tokensMap.has(trade.token0.toLowerCase())) return true;
    if (!tokensMap.has(trade.token1.toLowerCase())) return true;
    return false;
  };

  const pairs: Record<string, { trades: number; trades_24h: number }> = {};
  for (const trade of trending.tradeCount) {
    if (isMissingToken(trade)) continue;
    pairs[trade.pairAddresses] ||= { trades: 0, trades_24h: 0 };
    pairs[trade.pairAddresses].trades += trade.strategyTrades;
    pairs[trade.pairAddresses].trades_24h += trade.strategyTrades_24h;
  }
  const list = Object.entries(pairs)
    .filter(([, { trades_24h }]) => !!trades_24h)
    .map(([pairAddress, { trades }]) => ({
      pairAddress: pairAddress,
      base: tokensMap.get(pairAddress.split('/').shift()!.toLowerCase())!,
      quote: tokensMap.get(pairAddress.split('/').pop()!.toLowerCase())!,
      trades,
    }))
    .sort((a, b) => b.trades - a.trades)
    .splice(0, 10);

  const result: TrendingPair[] = [];
  for (let i = 0; i < 3; i++) {
    const index = Math.floor(Math.random() * list.length);
    result[i] = list.splice(index, 1)[0];
  }
  return {
    isLoading: false,
    data: result.sort((a, b) => b.trades - a.trades),
  };
};

interface StrategyWithTradeCount extends Strategy {
  trades: number;
  type: StrategyType;
}
const useTrendStrategies = (
  trending?: Trending
): { isLoading: boolean; data: StrategyWithTradeCount[] } => {
  const list = (trending?.tradeCount ?? [])
    .filter((t) => !!t.strategyTrades_24h)
    .sort((a, b) => b.strategyTrades - a.strategyTrades)
    .splice(0, 10);
  const record: Record<string, number> = {};
  for (let i = 0; i < 3; i++) {
    if (!list.length) break;
    const index = Math.floor(Math.random() * list.length);
    const item = list.splice(index, 1)[0];
    record[item.id] = item.strategyTrades;
  }
  const query = useGetStrategList(Object.keys(record));
  if (query.isLoading) {
    return { isLoading: true, data: [] };
  }
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
        <h2>Total Trades</h2>
        <p className="text-36 font-weight-700 font-title">
          {prettifyNumber(trending?.totalTradeCount ?? '0')}
        </p>
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
        <h2>Populare Pairs</h2>
        <table className="w-full">
          <thead>
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
                <td className="text-end">{prettifyNumber(trades)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      <article className="border-background-800 hidden flex-1 rounded border-2 p-20 lg:block">
        <h2>Trending Strategies</h2>
        <table className="w-full">
          <thead>
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
                <td className="text-end">{prettifyNumber(trades)}</td>
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
