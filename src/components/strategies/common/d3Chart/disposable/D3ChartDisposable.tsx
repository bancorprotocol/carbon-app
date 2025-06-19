import { ChartPrices } from 'components/strategies/common/d3Chart/D3ChartCandlesticks';
import { DragablePriceRange } from 'components/strategies/common/d3Chart/recurring/DragablePriceRange';
import { handleStateChange } from 'components/strategies/common/d3Chart/recurring/utils';
import { isZero } from 'components/strategies/common/utils';
import { useCallback, useEffect, useRef } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { useD3ChartCtx } from '../D3ChartContext';

interface Props {
  prices: ChartPrices;
  isLimit: { buy: boolean; sell: boolean };
  onChange?: (prices: ChartPrices) => any;
}

export const D3ChartDisposable = ({ prices, onChange, isLimit }: Props) => {
  const { yScale } = useD3ChartCtx();
  const readonly = !onChange;
  const onMinMaxChange = useCallback(
    (type: 'buy' | 'sell', min: number, max: number) => {
      if (!onChange) return;
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
      onChange({ buy, sell });
    },
    [
      onChange,
      prices.buy.max,
      prices.buy.min,
      prices.sell.max,
      prices.sell.min,
      yScale,
    ],
  );

  const hasDragEnded = useRef(false);

  const type =
    isZero(prices.buy.min) && isZero(prices.buy.max) ? 'sell' : 'buy';

  const onMinMaxChangeEnd = useCallback(
    (type: 'buy' | 'sell', y1?: number, y2?: number) => {
      if (!onChange) return;
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
      onChange({ buy, sell });
      hasDragEnded.current = true;
    },
    [
      onChange,
      prices.buy.max,
      prices.buy.min,
      prices.sell.max,
      prices.sell.min,
      yScale,
    ],
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
    if (!hasDragEnded.current) return;
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
    <DragablePriceRange
      type={type}
      onMinMaxChange={onMinMaxChange}
      labels={labels[type]}
      yPos={yPos[type]}
      onDragEnd={onMinMaxChangeEnd}
      isLimit={isLimit[type]}
      readonly={readonly}
    />
  );
};
