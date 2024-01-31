import { max, min, scaleBand } from 'd3';
import { D3ChartHandleLine } from 'libs/d3/charts/candlestick/D3ChartHandleLine';
import { DragablePriceRange } from 'libs/d3/charts/candlestick/DragablePriceRange';
import { XAxis } from 'libs/d3/charts/candlestick/xAxis';
import { D3YAxiRight } from 'libs/d3/primitives/D3YAxisRight';
import { useLinearScale } from 'libs/d3/useLinearScale';
import { useCallback, useMemo } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { Candlesticks } from './Candlesticks';
import { CandlestickData, D3ChartSettings } from 'libs/d3';

type GetDomainFn<T extends number | number[]> = (
  data: CandlestickData[],
  prices: ChartPrices,
  marketPrice?: number
) => T;

const yScaleDomainTolerance = 0.1;

const getDomainMin: GetDomainFn<number> = (data, prices, marketPrice) => {
  let dataMin = min(data, (d) => d.low) as number;
  const values = [
    dataMin,
    Number(prices.buyMin),
    Number(prices.sellMin),
    Number(prices.buyMax),
    Number(prices.sellMax),
    marketPrice,
  ];
  return min(values, (d) => d) as number;
};

const getDomainMax: GetDomainFn<number> = (data, prices, marketPrice) => {
  let dataMax = max(data, (d) => d.high) as number;
  const values = [
    dataMax,
    Number(prices.buyMin),
    Number(prices.sellMin),
    Number(prices.buyMax),
    Number(prices.sellMax),
    marketPrice,
  ];
  return max(values, (d) => d) as number;
};

const getDomain: GetDomainFn<number[]> = (data, prices, marketPrice) => {
  const domainMin = getDomainMin(data, prices, marketPrice);
  const domainMax = getDomainMax(data, prices, marketPrice);

  const diff = domainMax - domainMin;
  const tolerance = diff * yScaleDomainTolerance;

  return [domainMin - tolerance, domainMax + tolerance];
};

export type ChartPrices = {
  sellMax: string;
  sellMin: string;
  sellIsLimit: boolean;
  buyMax: string;
  buyMin: string;
  buyIsLimit: boolean;
};

export type OnPriceUpdates = (props: {
  buy: { min: string; max: string };
  sell: { min: string; max: string };
}) => void;

interface Props {
  dms: D3ChartSettings;
  data: CandlestickData[];
  prices: ChartPrices;
  onPriceUpdates: OnPriceUpdates;
  marketPrice?: number;
}

export const D3ChartCandlesticks = (props: Props) => {
  const { dms, data, prices, onPriceUpdates, marketPrice } = props;

  const xScale = useMemo(
    () =>
      scaleBand()
        .domain(data.map((d) => d.date.toString()))
        .range([0, dms.boundedWidth])
        .paddingInner(0.5),
    [data, dms.boundedWidth]
  );

  const y = useLinearScale({
    domain: getDomain(data, prices, marketPrice),
    range: [dms.boundedHeight, 0],
  });

  const onMinMaxChange = useCallback(
    (type: 'buy' | 'sell', min: number, max: number) => {
      const minInverted = y.scale.invert(min).toString();
      const maxInverted = y.scale.invert(max).toString();

      const buy = {
        min: type === 'buy' ? minInverted : prices.buyMin,
        max: type === 'buy' ? maxInverted : prices.buyMax,
      };
      const sell = {
        min: type === 'sell' ? minInverted : prices.sellMin,
        max: type === 'sell' ? maxInverted : prices.sellMax,
      };
      onPriceUpdates({ buy, sell });
    },
    [
      onPriceUpdates,
      prices.buyMax,
      prices.buyMin,
      prices.sellMax,
      prices.sellMin,
      y.scale,
    ]
  );

  const labels = {
    // TODO add formater function to child
    buy: {
      min: prettifyNumber(prices.buyMin, { currentCurrency: 'USD' }),
      max: prettifyNumber(prices.buyMax, { currentCurrency: 'USD' }),
    },
    sell: {
      min: prettifyNumber(prices.sellMin, { currentCurrency: 'USD' }),
      max: prettifyNumber(prices.sellMax, { currentCurrency: 'USD' }),
    },
    marketPrice: prettifyNumber(marketPrice ?? '', { currentCurrency: 'USD' }),
  };

  const yPos = {
    buy: {
      min: y.scale(Number(prices.buyMin)),
      max: y.scale(Number(prices.buyMax)),
    },
    sell: {
      min: y.scale(Number(prices.sellMin)),
      max: y.scale(Number(prices.sellMax)),
    },
  };

  return (
    <svg width={dms.width} height={dms.height}>
      <g transform={`translate(${dms.marginLeft},${dms.marginTop})`}>
        <Candlesticks xScale={xScale} yScale={y.scale} data={data} />

        <D3YAxiRight
          ticks={y.ticks}
          dms={dms}
          formatter={(value) => prettifyNumber(value)}
        />
        <XAxis xScale={xScale} dms={dms} />

        {marketPrice && (
          <D3ChartHandleLine
            dms={dms}
            color="white"
            y={y.scale(marketPrice)}
            lineProps={{ strokeDasharray: 2 }}
            label={labels.marketPrice}
          />
        )}

        <DragablePriceRange
          type="buy"
          onMinMaxChange={onMinMaxChange}
          labels={labels.buy}
          yPos={yPos.buy}
          dms={dms}
          isLimit={prices.buyIsLimit}
        />

        <DragablePriceRange
          type="sell"
          onMinMaxChange={onMinMaxChange}
          labels={labels.sell}
          yPos={yPos.sell}
          dms={dms}
          isLimit={prices.sellIsLimit}
        />
      </g>
    </svg>
  );
};
