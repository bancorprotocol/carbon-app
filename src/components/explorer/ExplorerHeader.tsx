import { TokensOverlap } from 'components/common/tokensOverlap';
import { useTokensQuery } from 'libs/queries';
import { Trending, useTrending } from 'libs/queries/extApi/tradeCount';
import { Token } from 'libs/tokens';
import { prettifyNumber } from 'utils/helpers';

interface TrendingPair {
  base: Token;
  quote: Token;
  trades: number;
}

const trendByPair = (trending?: Trending, tokenList: Token[] = []) => {
  if (!trending || !tokenList.length) return [];
  const tokens: Record<string, Token> = {};
  for (const token of tokenList) {
    tokens[token.address] = token;
  }
  const pairs: Record<string, { trades: number; trades_24h: number }> = {};
  for (const trade of trending.tradeCount) {
    pairs[trade.pairAddresses] ||= { trades: 0, trades_24h: 0 };
    pairs[trade.pairAddresses].trades += trade.strategyTrades;
    pairs[trade.pairAddresses].trades_24h += trade.strategyTrades_24h;
  }
  console.log(pairs);
  const list = Object.entries(pairs)
    .filter(([, { trades_24h }]) => !!trades_24h)
    .map(([pair, { trades }]) => ({
      base: tokens[pair.split('/').shift()!],
      quote: tokens[pair.split('/').pop()!],
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

export const ExplorerHeader = () => {
  const { data: tokens } = useTokensQuery();
  const { data: trending } = useTrending();
  const pairs = trendByPair(trending, tokens);
  return (
    <header className="flex gap-16">
      <article>
        <h2>Total Trades</h2>
        <p>{trending?.totalTradeCount}</p>
      </article>
      <article>
        <h2>Populare Pairs</h2>
        <table>
          <thead>
            <tr>
              <td>Token Pair</td>
              <td>Trades</td>
            </tr>
          </thead>
          <tbody>
            {pairs.map(({ base, quote, trades }) => (
              <tr key={`${base.address}/${quote.address}`}>
                <td>
                  <TokensOverlap tokens={[base, quote]} size={18} />
                  {base.symbol}/{quote.symbol}
                </td>
                <td>{prettifyNumber(trades)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
      <article>
        <h2>Trending Strategies</h2>
        <table>
          <thead>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            <tr></tr>
          </tbody>
        </table>
      </article>
    </header>
  );
};
