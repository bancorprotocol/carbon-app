import { FC, memo } from 'react';
import { Copyright } from './copyrights';
import { Widget } from './widget';
import { Token } from 'libs/tokens';
import { pairsToExchangeMapping } from './utils';

export type TradingviewChartProps = {
  base: Token | undefined;
  quote: Token | undefined;
};

export const TradingviewChart: FC<TradingviewChartProps> = memo(
  ({ base, quote }) => {
    // we can force WETH for ETH because it's duplicated in pairsToExchangeMapping
    const baseSymbol = base?.symbol === 'ETH' ? 'WETH' : base?.symbol;
    const quoteSymbol = quote?.symbol === 'ETH' ? 'WETH' : quote?.symbol;
    const symbol =
      pairsToExchangeMapping[`${baseSymbol}${quoteSymbol}`] ||
      `UNISWAP3ETH:${baseSymbol}${quoteSymbol}`;

    return (
      <div>
        <Widget symbol={symbol} />
        <Copyright symbol={symbol} />
      </div>
    );
  }
);
