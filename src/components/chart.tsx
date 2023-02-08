import { Token } from 'libs/tokens';
import Copyright from './copyrights';
import Widget from './widget';

export type ChartProps = {
  token0: Token | undefined;
  token1: Token | undefined;
};

export const Chart: React.FC<ChartProps> = ({ token0, token1 }) => {
  const symbol = `BINANCE:${token0?.symbol}${token1?.symbol}`;

  return (
    <div>
      <Widget symbol={symbol} />
      <Copyright symbol={symbol} />
    </div>
  );
};
