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
    const symbol =
      pairsToExchangeMapping[`${base?.symbol}${quote?.symbol}`] ||
      `BINANCE:${base?.symbol}${quote?.symbol}`;

    return (
      <div>
        <Widget symbol={symbol} />
        <Copyright symbol={symbol} />
      </div>
    );
  }
);
