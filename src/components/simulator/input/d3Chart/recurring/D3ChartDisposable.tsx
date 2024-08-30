import { D3ChartCandlesticksProps } from 'components/simulator/input/d3Chart/D3ChartCandlesticks';
import { DragablePriceRange } from 'components/simulator/input/d3Chart/recurring/DragablePriceRange';
import { handleStateChange } from 'components/simulator/input/d3Chart/recurring/utils';
import { isZero } from 'components/strategies/common/utils';
import { ScaleLinear } from 'd3';
import { useCallback, useEffect, useRef } from 'react';
import { prettifyNumber } from 'utils/helpers';

type Props = Pick<
  D3ChartCandlesticksProps,
  'prices' | 'onPriceUpdates' | 'dms' | 'onDragEnd'
> & {
  yScale: ScaleLinear<number, number>;
  isLimit: { buy: boolean; sell: boolean };
};

export const D3ChartDisposable = ({
  prices,
  onPriceUpdates,
  dms,
  yScale,
  isLimit,
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

  const type =
    isZero(prices.buy.min) && isZero(prices.buy.max) ? 'sell' : 'buy';

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
      min: prettifyNumber(prices.buy.min),
      max: prettifyNumber(prices.buy.max),
    },
    sell: {
      min: prettifyNumber(prices.sell.min),
      max: prettifyNumber(prices.sell.max),
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
      type,
      id: 'line1',
      y: yScale(Number(prices[type].max)),
      isLimit: isLimit[type],
    });
    handleStateChange({
      type,
      id: 'line2',
      y: yScale(Number(prices[type].min)),
      isLimit: isLimit[type],
    });
    hasDragEnded.current = false;
  }, [type, isLimit, yScale, prices]);

  return (
    <>
      <DragablePriceRange
        type={type}
        onMinMaxChange={onMinMaxChange}
        labels={labels[type]}
        yPos={yPos[type]}
        dms={dms}
        onDragEnd={onMinMaxChangeEnd}
        isLimit={isLimit[type]}
      />
    </>
  );
};
