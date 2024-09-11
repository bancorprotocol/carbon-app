import { D3ChartCandlesticksProps } from 'components/simulator/input/d3Chart/D3ChartCandlesticks';
import { DragablePriceRange } from 'components/simulator/input/d3Chart/recurring/DragablePriceRange';
import { handleStateChange } from 'components/simulator/input/d3Chart/recurring/utils';
import { ScaleLinear } from 'd3';
import { useCallback, useEffect, useRef } from 'react';
import { prettifyNumber } from 'utils/helpers';

type Props = Pick<
  D3ChartCandlesticksProps,
  'prices' | 'onPriceUpdates' | 'dms' | 'onDragEnd'
> & {
  yScale: ScaleLinear<number, number>;
  isLimit: { buy: boolean; sell: boolean };
  readonly?: boolean;
};

export const D3ChartRecurring = ({
  prices,
  onPriceUpdates,
  dms,
  yScale,
  isLimit,
  readonly,
  onDragEnd,
}: Props) => {
  const onMinMaxChange = useCallback(
    (type: 'buy' | 'sell', min: number, max: number) => {
      const minInverted = yScale.invert(min).toString();
      const maxInverted = yScale.invert(max).toString();

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
      yScale,
    ]
  );

  const hasDragEnded = useRef(false);

  const onMinMaxChangeEnd = useCallback(
    (type: 'buy' | 'sell', y1?: number, y2?: number) => {
      const minInverted = y1
        ? yScale.invert(y1).toString()
        : type === 'buy'
        ? prices.buy.min
        : prices.sell.min;

      const maxInverted = y2
        ? yScale.invert(y2).toString()
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
      yScale,
    ]
  );

  const labels = {
    buy: {
      min: prettifyNumber(prices.buy.min, { decimals: 4 }),
      max: prettifyNumber(prices.buy.max, { decimals: 4 }),
    },
    sell: {
      min: prettifyNumber(prices.sell.min, { decimals: 4 }),
      max: prettifyNumber(prices.sell.max, { decimals: 4 }),
    },
  };

  const yPos = {
    buy: {
      min: yScale(Number(prices.buy.min)),
      max: yScale(Number(prices.buy.max)),
    },
    sell: {
      min: yScale(Number(prices.sell.min)),
      max: yScale(Number(prices.sell.max)),
    },
  };

  useEffect(() => {
    if (!hasDragEnded.current) {
      return;
    }

    handleStateChange({
      type: 'sell',
      id: 'line1',
      y: yScale(Number(prices.sell.max)),
      isLimit: isLimit.sell,
    });
    handleStateChange({
      type: 'sell',
      id: 'line2',
      y: yScale(Number(prices.sell.min)),
      isLimit: isLimit.sell,
    });
    handleStateChange({
      type: 'buy',
      id: 'line1',
      y: yScale(Number(prices.buy.max)),
      isLimit: isLimit.buy,
    });
    handleStateChange({
      type: 'buy',
      id: 'line2',
      y: yScale(Number(prices.buy.min)),
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
    yScale,
  ]);

  return (
    <>
      <DragablePriceRange
        type="buy"
        onMinMaxChange={onMinMaxChange}
        labels={labels.buy}
        yPos={yPos.buy}
        dms={dms}
        onDragEnd={onMinMaxChangeEnd}
        isLimit={isLimit.buy}
        readonly={readonly}
      />
      <DragablePriceRange
        type="sell"
        onMinMaxChange={onMinMaxChange}
        labels={labels.sell}
        yPos={yPos.sell}
        dms={dms}
        isLimit={isLimit.sell}
        onDragEnd={onMinMaxChangeEnd}
        readonly={readonly}
      />
    </>
  );
};
