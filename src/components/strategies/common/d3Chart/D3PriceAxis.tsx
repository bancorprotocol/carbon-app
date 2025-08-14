import { FC } from 'react';
import { useD3ChartCtx } from './D3ChartContext';
import { prettifyNumber } from 'utils/helpers';
import { ChartPrices } from './D3ChartCandlesticks';
import { handleDms } from './utils';

export const D3PricesAxis = ({ prices }: { prices: ChartPrices<string> }) => {
  const buyMin = Number(prices.buy.min);
  const buyMax = Number(prices.buy.max);
  const showBuyMax = buyMax && buyMin !== buyMax;
  const sellMin = Number(prices.sell.min);
  const sellMax = Number(prices.sell.max);
  const showSellMax = sellMax && sellMin !== sellMax;

  return (
    <>
      {!!buyMin && <D3PriceAxis price={buyMin} color="var(--color-buy)" />}
      {showBuyMax && <D3PriceAxis price={buyMax} color="var(--color-buy)" />}
      {!!sellMin && <D3PriceAxis price={sellMin} color="var(--color-sell)" />}
      {showSellMax && <D3PriceAxis price={sellMax} color="var(--color-sell)" />}
    </>
  );
};

interface Props {
  price: number;
  color: string;
}

const D3PriceAxis: FC<Props> = ({ price, color }) => {
  const { dms, yScale } = useD3ChartCtx();
  const lineWidth = dms.boundedWidth + 5;
  const y = yScale(price);
  return (
    <g
      transform={`translate(${lineWidth},-${handleDms.height / 2})`}
      className="pointer-events-none"
    >
      <rect y={y} {...handleDms} fill={color} rx={4} />
      <text y={y + 12} x={6} fill="black" fontSize={10}>
        {prettifyNumber(price, { abbreviate: true })}
      </text>
    </g>
  );
};
