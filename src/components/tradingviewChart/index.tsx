import { FC, memo } from 'react';
import { Copyright } from './copyrights';
import { Widget } from './widget';
import { Token } from 'libs/tokens';
import { pairsToExchangeMapping } from './utils';

export type TradingviewChartProps = {
  token0: Token | undefined;
  token1: Token | undefined;
};

export const TradingviewChart: FC<TradingviewChartProps> = memo(
  ({ token0, token1 }) => {
    const symbol =
      pairsToExchangeMapping[`${token0?.symbol}${token1?.symbol}`] ||
      `BINANCE:${token0?.symbol}${token1?.symbol}`;

    return (
      <div>
        <Widget symbol={symbol} />
        <Copyright symbol={symbol} />
      </div>
    );
  }
);
