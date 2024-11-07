import { TokensOverlap } from 'components/common/tokensOverlap';
import { getStrategyType } from 'components/strategies/common/utils';
import { useContract } from 'hooks/useContract';
import { useTokens } from 'hooks/useTokens';
import { Strategy, useGetStrategList } from 'libs/queries';
import { Trending, useTrending } from 'libs/queries/extApi/tradeCount';
import { StrategyType } from 'libs/routing';
import { Token } from 'libs/tokens';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { useEffect, useState } from 'react';
import { prettifyNumber } from 'utils/helpers';

interface TrendingPair {
  pairAddress: string;
  base: Token;
  quote: Token;
  trades: number;
}

const useTrendingPairs = (trending?: Trending) => {
  const [loading, setLoading] = useState(true);
  const { tokensMap, importToken } = useTokens();
  const { Token } = useContract();

  useEffect(() => {
    const missingTokens = new Set<string>();
    for (const { token0, token1 } of trending?.tradeCount ?? []) {
      if (!tokensMap.has(token0.toLowerCase())) missingTokens.add(token0);
      if (!tokensMap.has(token1.toLowerCase())) missingTokens.add(token1);
    }
    if (!missingTokens.size) return;
    const getTokens = Array.from(missingTokens).map((address) => {
      return fetchTokenData(Token, address);
    });
    Promise.all(getTokens).then((tokens) => {
      tokens.forEach((data) => importToken(data));
      setLoading(false);
    });
  }, [Token, importToken, tokensMap, trending?.tradeCount]);
  if (!trending || loading) return [];

  const pairs: Record<string, { trades: number; trades_24h: number }> = {};
  for (const trade of trending.tradeCount) {
    pairs[trade.pairAddresses] ||= { trades: 0, trades_24h: 0 };
    pairs[trade.pairAddresses].trades += trade.strategyTrades;
    pairs[trade.pairAddresses].trades_24h += trade.strategyTrades_24h;
  }
  const list = Object.entries(pairs)
    .filter(([, { trades_24h }]) => !!trades_24h)
    .map(([pairAddress, { trades }]) => ({
      pairAddress: pairAddress,
      base: tokensMap.get(pairAddress.split('/').shift()!)!,
      quote: tokensMap.get(pairAddress.split('/').pop()!)!,
      trades,
    }))
    .sort((a, b) => b.trades - a.trades)
    .splice(0, 10);

  const result: TrendingPair[] = [];
  for (let i = 0; i < 3; i++) {
    const index = Math.floor(Math.random() * list.length);
    result[i] = list.splice(index, 1)[0];
  }
  return result.sort((a, b) => b.trades - a.trades);
};

interface StrategyWithTradeCount extends Strategy {
  trades: number;
  type: StrategyType;
}
const useTrendStrategies = (trending?: Trending): StrategyWithTradeCount[] => {
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
  return (query.data ?? []).map((strategy) => ({
    ...strategy,
    type: getStrategyType(strategy),
    trades: record[strategy.id],
  }));
};

export const ExplorerHeader = () => {
  const { data: trending } = useTrending();
  const strategies = useTrendStrategies(trending);
  const pairs = useTrendingPairs(trending);
  console.log({ strategies, pairs });
  return (
    <header className="flex gap-32">
      <article>
        <h2>Total Trades</h2>
        <p className="text-36 font-weight-700 font-title">
          {trending?.totalTradeCount}
        </p>
      </article>
      <article className="border-background-800 rounded border-2 p-20">
        <h2>Populare Pairs</h2>
        <table>
          <thead>
            <tr>
              <td>Token Pair</td>
              <td>Trades</td>
            </tr>
          </thead>
          <tbody>
            {pairs.map(({ pairAddress, base, quote, trades }) => (
              <tr key={pairAddress}>
                <td>
                  <TokensOverlap tokens={[base, quote]} size={18} />
                  {base?.symbol}/{quote?.symbol}
                </td>
                <td>{prettifyNumber(trades)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      <article className="border-background-800 rounded border-2 p-20">
        <h2>Trending Strategies</h2>
        <table>
          <thead>
            <tr>
              <td>ID</td>
              <td>Types</td>
              <td>Trades</td>
            </tr>
          </thead>
          <tbody>
            {strategies.map(({ id, idDisplay, base, quote, type, trades }) => (
              <tr key={id}>
                <td>
                  <TokensOverlap tokens={[base, quote]} size={18} />
                  {idDisplay}
                </td>
                <td>{type}</td>
                <td>{prettifyNumber(trades)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </header>
  );
};
