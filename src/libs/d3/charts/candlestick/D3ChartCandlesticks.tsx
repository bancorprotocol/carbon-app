import { scaleBand } from 'd3';
import { D3ChartHandleLine } from 'libs/d3/charts/candlestick/D3ChartHandleLine';
import { DragablePriceRange } from 'libs/d3/charts/candlestick/DragablePriceRange';
import { getDomain, handleStateChange } from 'libs/d3/charts/candlestick/utils';
import { XAxis } from 'libs/d3/charts/candlestick/xAxis';
import { D3YAxiRight } from 'libs/d3/primitives/D3YAxisRight';
import { useLinearScale } from 'libs/d3/useLinearScale';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { Candlesticks } from './Candlesticks';
import { CandlestickData, D3ChartSettings } from 'libs/d3';

export type ChartPrices = {
  buy: { min: string; max: string };
  sell: { min: string; max: string };
};

export type OnPriceUpdates = (props: ChartPrices) => void;

interface Props {
  dms: D3ChartSettings;
  data: CandlestickData[];
  prices: ChartPrices;
  onPriceUpdates: OnPriceUpdates;
  marketPrice?: number;
  bounds: ChartPrices;
  onDragEnd?: OnPriceUpdates;
  isLimit: { buy: boolean; sell: boolean };
}

export const D3ChartCandlesticks = (props: Props) => {
  const {
    dms,
    data,
    prices,
    onPriceUpdates,
    marketPrice,
    bounds,
    onDragEnd,
    isLimit,
  } = props;

  const xScale = useMemo(
    () =>
      scaleBand()
        .domain(data.map((d) => d.date.toString()))
        .range([0, dms.boundedWidth])
        .paddingInner(0.5),
    [data, dms.boundedWidth]
  );

  const y = useLinearScale({
    domain: getDomain(data, bounds, marketPrice),
    range: [dms.boundedHeight, 0],
    domainTolerance: 0.1,
  });

  const onMinMaxChange = useCallback(
    (type: 'buy' | 'sell', min: number, max: number) => {
      const minInverted = y.scale.invert(min).toString();
      const maxInverted = y.scale.invert(max).toString();

      const buy = {
        min: type === 'buy' ? minInverted : prices.buy.min,
        max: type === 'buy' ? maxInverted : prices.buy.max,
      };
      const sell = {
        min: type === 'sell' ? minInverted : prices.sell.min,
        max: type === 'sell' ? maxInverted : prices.sell.max,
      };
      onPriceUpdates({ buy, sell });
    },
    [
      onPriceUpdates,
      prices.buy.max,
      prices.buy.min,
      prices.sell.max,
      prices.sell.min,
      y.scale,
    ]
  );

  const hasDragEnded = useRef(false);

  const onMinMaxChangeEnd = useCallback(
    (type: 'buy' | 'sell', y1?: number, y2?: number) => {
      const minInverted = y1
        ? y.scale.invert(y1).toString()
        : type === 'buy'
        ? prices.buy.min
        : prices.sell.min;

      const maxInverted = y2
        ? y.scale.invert(y2).toString()
        : type === 'buy'
        ? prices.buy.max
        : prices.sell.max;

      const buy = {
        min: type === 'buy' ? minInverted : prices.buy.min,
        max: type === 'buy' ? maxInverted : prices.buy.max,
      };
      const sell = {
        min: type === 'sell' ? minInverted : prices.sell.min,
        max: type === 'sell' ? maxInverted : prices.sell.max,
      };
      onDragEnd?.({ buy, sell });
      hasDragEnded.current = true;
    },
    [
      onDragEnd,
      prices.buy.max,
      prices.buy.min,
      prices.sell.max,
      prices.sell.min,
      y,
    ]
  );

  const labels = {
    // TODO add formater function to child
    buy: {
      min: prettifyNumber(prices.buy.min),
      max: prettifyNumber(prices.buy.max),
    },
    sell: {
      min: prettifyNumber(prices.sell.min),
      max: prettifyNumber(prices.sell.max),
    },
    marketPrice: prettifyNumber(marketPrice ?? ''),
  };

  const yPos = useMemo(
    () => ({
      buy: {
        min: y.scale(Number(prices.buy.min)),
        max: y.scale(Number(prices.buy.max)),
      },
      sell: {
        min: y.scale(Number(prices.sell.min)),
        max: y.scale(Number(prices.sell.max)),
      },
    }),
    [prices.buy.max, prices.buy.min, prices.sell.max, prices.sell.min, y]
  );

  useEffect(() => {
    if (!hasDragEnded.current) {
      return;
    }

    handleStateChange({
      type: 'sell',
      id: 'line1',
      y: y.scale(Number(prices.sell.max)),
      isLimit: isLimit.sell,
    });
    handleStateChange({
      type: 'sell',
      id: 'line2',
      y: y.scale(Number(prices.sell.min)),
      isLimit: isLimit.sell,
    });
    handleStateChange({
      type: 'buy',
      id: 'line1',
      y: y.scale(Number(prices.buy.max)),
      isLimit: isLimit.buy,
    });
    handleStateChange({
      type: 'buy',
      id: 'line2',
      y: y.scale(Number(prices.buy.min)),
      isLimit: isLimit.buy,
    });
    hasDragEnded.current = false;
  }, [
    isLimit.buy,
    isLimit.sell,
    prices.buy.max,
    prices.buy.min,
    prices.sell.max,
    prices.sell.min,
    y,
  ]);

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
          onDragEnd={onMinMaxChangeEnd}
          isLimit={isLimit.buy}
        />

        <DragablePriceRange
          type="sell"
          onMinMaxChange={onMinMaxChange}
          labels={labels.sell}
          yPos={yPos.sell}
          dms={dms}
          isLimit={isLimit.sell}
          onDragEnd={onMinMaxChangeEnd}
        />
      </g>
    </svg>
  );
};
