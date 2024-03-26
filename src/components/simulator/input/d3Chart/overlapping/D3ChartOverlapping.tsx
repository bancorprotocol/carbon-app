import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';
import { D3ChartCandlesticksProps } from 'components/simulator/input/d3Chart/D3ChartCandlesticks';
import { D3ChartHandleLine } from 'components/simulator/input/d3Chart/D3ChartHandleLine';
import { D3ChartRect } from 'components/simulator/input/d3Chart/D3ChartRect';
import { D3ChartOverlappingHandle } from 'components/simulator/input/d3Chart/overlapping/D3ChartOverlappingHandle';
import {
  handleStateChange,
  onDragBuyHandler,
  onDragSellHandler,
} from 'components/simulator/input/d3Chart/overlapping/utils';
import {
  getHandleSelector,
  getRectSelector,
} from 'components/simulator/input/d3Chart/utils';
import {
  getMaxBuyMin,
  getMinSellMax,
} from 'components/strategies/overlapping/utils';
import { ScaleLinear } from 'd3';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { prettifyNumber } from 'utils/helpers';

type Props = Pick<
  D3ChartCandlesticksProps,
  'prices' | 'onPriceUpdates' | 'dms' | 'onDragEnd'
> & {
  yScale: ScaleLinear<number, number>;
  marketPrice?: number;
  spread: number;
};

export const D3ChartOverlapping = (props: Props) => {
  const {
    dms,
    yScale,
    prices,
    marketPrice,
    onPriceUpdates,
    onDragEnd,
    spread,
  } = props;

  const isDragging = useRef(false);
  const hasDragEnded = useRef(false);

  const selectorRectBuy = getRectSelector('buy');
  const selectorRectSell = getRectSelector('sell');

  const selectorHandleBuy = getHandleSelector('buy', 'line1');
  const selectorHandleSell = getHandleSelector('sell', 'line1');

  const yPos = useMemo(
    () => ({
      buy: {
        min: yScale(Number(prices.buy.min)),
        max: yScale(Number(prices.buy.max)),
      },
      sell: {
        min: yScale(Number(prices.sell.min)),
        max: yScale(Number(prices.sell.max)),
      },
      marketPrice: marketPrice ? yScale(marketPrice) : 0,
    }),
    [prices, yScale, marketPrice]
  );

  const onDragBuy = useCallback(
    (y: number) => {
      isDragging.current = true;
      const maximumBuyMin = getMaxBuyMin(Number(prices.sell.max), spread);
      const maximumBuyMinY = yScale(maximumBuyMin);
      if (y < maximumBuyMinY) {
        y = maximumBuyMinY;
      }
      onDragBuyHandler({
        y,
        onChange: (y) => {
          const buyMin = yScale.invert(y).toString();
          const { sellPriceLow } = calculateOverlappingPrices(
            buyMin,
            prices.sell.max,
            marketPrice?.toString() ?? '0',
            spread.toString()
          );
          onPriceUpdates({
            buy: { min: buyMin, max: prices.buy.max },
            sell: { min: sellPriceLow, max: prices.sell.max },
          });
        },
        marketPriceY: yPos.marketPrice,
      });
    },
    [
      marketPrice,
      onPriceUpdates,
      prices.buy.max,
      prices.sell.max,
      spread,
      yPos.marketPrice,
      yScale,
    ]
  );

  const onDragEndBuy = useCallback(
    (y: number) => {
      isDragging.current = false;
      const buyMin = yScale.invert(y).toString();
      const { sellPriceLow } = calculateOverlappingPrices(
        buyMin,
        prices.sell.max,
        marketPrice?.toString() ?? '0',
        spread.toString()
      );
      onDragEnd?.({
        buy: { min: buyMin, max: prices.buy.max },
        sell: { min: sellPriceLow, max: prices.sell.max },
      });
      hasDragEnded.current = true;
    },
    [marketPrice, onDragEnd, prices.buy.max, prices.sell.max, spread, yScale]
  );

  const onDragSell = useCallback(
    (y: number) => {
      isDragging.current = true;
      const minimumSellMax = getMinSellMax(Number(prices.buy.min), spread);
      const minimumSellMaxY = yScale(minimumSellMax);
      if (y > minimumSellMaxY) {
        y = minimumSellMaxY;
      }
      onDragSellHandler({
        y,
        onChange: (y) => {
          const sellMax = yScale.invert(y).toString();
          const { buyPriceHigh } = calculateOverlappingPrices(
            prices.buy.min,
            sellMax,
            marketPrice?.toString() ?? '0',
            spread.toString()
          );
          onPriceUpdates({
            buy: { min: prices.buy.min, max: buyPriceHigh },
            sell: { min: prices.sell.min, max: sellMax },
          });
        },
        marketPriceY: yPos.marketPrice,
      });
    },
    [
      marketPrice,
      onPriceUpdates,
      prices.buy.min,
      prices.sell.min,
      spread,
      yPos.marketPrice,
      yScale,
    ]
  );

  const onDragEndSell = useCallback(
    (y: number) => {
      isDragging.current = false;
      const sellMax = yScale.invert(y).toString();
      const { buyPriceHigh } = calculateOverlappingPrices(
        prices.buy.min,
        sellMax,
        marketPrice?.toString() ?? '0',
        spread.toString()
      );
      onDragEnd?.({
        buy: { min: prices.buy.min, max: buyPriceHigh },
        sell: { min: prices.sell.min, max: sellMax },
      });
      hasDragEnded.current = true;
    },
    [marketPrice, onDragEnd, prices.buy.min, prices.sell.min, spread, yScale]
  );

  useEffect(() => {
    if (isDragging.current) {
      return;
    }

    handleStateChange({
      yBuyMin: yPos.buy.min,
      ySellMax: yPos.sell.max,
      marketPriceY: yPos.marketPrice,
    });
  }, [yPos.buy.min, yPos.marketPrice, yPos.sell.max]);

  return (
    <>
      <D3ChartHandleLine
        handleClassName="opacity-40"
        dms={dms}
        color="var(--sell)"
        y={yPos.sell.min}
        lineProps={{ strokeDasharray: 2 }}
        label={prettifyNumber(prices.sell.min ?? '')}
      />
      <D3ChartHandleLine
        handleClassName="opacity-40"
        dms={dms}
        color="var(--buy)"
        y={yPos.buy.max}
        lineProps={{ strokeDasharray: 2 }}
        label={prettifyNumber(prices.buy.max ?? '')}
      />
      <D3ChartOverlappingHandle
        selector={selectorHandleBuy}
        dms={dms}
        onDrag={onDragBuy}
        onDragEnd={onDragEndBuy}
        color="var(--buy)"
        label={prettifyNumber(prices.buy.min ?? '')}
      />
      <D3ChartRect selector={selectorRectBuy} dms={dms} color="var(--buy)" />
      <D3ChartOverlappingHandle
        selector={selectorHandleSell}
        dms={dms}
        onDrag={onDragSell}
        onDragEnd={onDragEndSell}
        color="var(--sell)"
        label={prettifyNumber(prices.sell.max ?? '')}
      />
      <D3ChartRect selector={selectorRectSell} dms={dms} color="var(--sell)" />
    </>
  );
};
