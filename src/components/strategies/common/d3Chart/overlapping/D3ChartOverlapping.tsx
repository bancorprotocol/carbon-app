import { D3ChartCandlesticksProps } from 'components/strategies/common/d3Chart/D3ChartCandlesticks';
import { D3ChartHandleLine } from 'components/strategies/common/d3Chart/D3ChartHandleLine';
import { D3ChartPriceOutOfScale } from 'components/strategies/common/d3Chart/D3ChartPriceOutOfScale';
import { D3ChartOverlappingHandle } from 'components/strategies/common/d3Chart/overlapping/D3ChartOverlappingHandle';
import { D3ChartOverlappingRangeGroup } from 'components/strategies/common/d3Chart/overlapping/D3ChartOverlappingRangeGroup';
import {
  handleStateChange,
  onDragBuyHandler,
  onDragRectHandler,
  onDragSellHandler,
} from 'components/strategies/common/d3Chart/overlapping/utils';
import {
  getHandleSelector,
  getSelector,
} from 'components/strategies/common/d3Chart/utils';
import {
  getMaxBuyMin,
  getMinSellMax,
} from 'components/strategies/overlapping/utils';
import { useCallback, useEffect, useRef } from 'react';
import { prettifyNumber } from 'utils/helpers';
import { useD3OverlappingChart } from './useD3OverlappingChart';
import { useD3ChartCtx } from '../D3ChartContext';

type Props = Pick<
  D3ChartCandlesticksProps,
  'prices' | 'onPriceUpdates' | 'onDragEnd'
> & {
  marketPrice?: number;
  spread: number;
  readonly?: boolean;
};

export const D3ChartOverlapping = (props: Props) => {
  const { prices, marketPrice, readonly, onPriceUpdates, onDragEnd, spread } =
    props;
  const { dms, yScale } = useD3ChartCtx();
  const isDragging = useRef(false);

  const selectorHandleBuyMin = getHandleSelector('buy', 'line1');
  const selectorHandleBuyMax = getHandleSelector('buy', 'line2');

  const selectorHandleSellMax = getHandleSelector('sell', 'line1');
  const selectorHandleSellMin = getHandleSelector('sell', 'line2');

  const { calcPrices, yPos } = useD3OverlappingChart({
    prices,
    yScale,
    spread,
    marketPrice,
  });

  const onDragBuy = useCallback(
    (y: number) => {
      if (!onPriceUpdates) return;
      isDragging.current = true;

      const maximumBuyMin = getMaxBuyMin(Number(prices.sell.max), spread);
      const maximumBuyMinY = yScale(maximumBuyMin);
      if (y < maximumBuyMinY) {
        y = maximumBuyMinY;
      }
      const buyMin = yScale.invert(y).toString();
      const { sellPriceLow } = calcPrices(buyMin, prices.sell.max);
      onDragBuyHandler({
        y,
        y2: yScale(Number(sellPriceLow)),
        marketPriceY: yPos.marketPrice,
      });
      onPriceUpdates({
        buy: { min: buyMin, max: prices.buy.max },
        sell: { min: sellPriceLow, max: prices.sell.max },
      });
    },
    [
      calcPrices,
      onPriceUpdates,
      prices.buy.max,
      prices.sell.max,
      spread,
      yPos.marketPrice,
      yScale,
    ],
  );

  const onDragEndBuy = useCallback(() => {
    isDragging.current = false;

    const y = Number(
      getSelector(getHandleSelector('buy', 'line1')).select('line').attr('y1'),
    );
    const buyMin = yScale.invert(y).toString();
    const { sellPriceLow } = calcPrices(buyMin, prices.sell.max);
    onDragEnd?.({
      buy: { min: buyMin, max: prices.buy.max },
      sell: { min: sellPriceLow, max: prices.sell.max },
    });
  }, [calcPrices, onDragEnd, prices.buy.max, prices.sell.max, yScale]);

  const onDragSell = useCallback(
    (y: number) => {
      if (!onPriceUpdates) return;
      isDragging.current = true;

      const minimumSellMax = getMinSellMax(Number(prices.buy.min), spread);
      const minimumSellMaxY = yScale(minimumSellMax);
      if (y > minimumSellMaxY) {
        y = minimumSellMaxY;
      }
      const sellMax = yScale.invert(y).toString();
      const { buyPriceHigh } = calcPrices(prices.buy.min, sellMax);
      onDragSellHandler({
        y,
        y2: yScale(Number(buyPriceHigh)),
        marketPriceY: yPos.marketPrice,
      });
      onPriceUpdates({
        buy: { min: prices.buy.min, max: buyPriceHigh },
        sell: { min: prices.sell.min, max: sellMax },
      });
    },
    [
      calcPrices,
      onPriceUpdates,
      prices.buy.min,
      prices.sell.min,
      spread,
      yPos.marketPrice,
      yScale,
    ],
  );

  const onDragEndSell = useCallback(() => {
    isDragging.current = false;

    const y = Number(
      getSelector(getHandleSelector('sell', 'line1')).select('line').attr('y1'),
    );
    const sellMax = yScale.invert(y).toString();
    const { buyPriceHigh } = calcPrices(prices.buy.min, sellMax);
    onDragEnd?.({
      buy: { min: prices.buy.min, max: buyPriceHigh },
      sell: { min: prices.sell.min, max: sellMax },
    });
  }, [calcPrices, onDragEnd, prices.buy.min, prices.sell.min, yScale]);

  const onDragRect = useCallback(
    (y: number, y2: number) => {
      if (!onPriceUpdates) return;
      isDragging.current = true;

      const sellMax = yScale.invert(y).toString();
      const buyMin = yScale.invert(y2).toString();
      const { buyPriceHigh, sellPriceLow } = calcPrices(buyMin, sellMax);
      onDragRectHandler({
        yPos: {
          sell: { min: yScale(Number(sellPriceLow)), max: y },
          buy: { min: y2, max: yScale(Number(buyPriceHigh)) },
        },
        marketPriceY: yPos.marketPrice,
      });
      onPriceUpdates({
        buy: { min: buyMin, max: buyPriceHigh },
        sell: { min: sellPriceLow, max: sellMax },
      });
    },
    [calcPrices, onPriceUpdates, yPos.marketPrice, yScale],
  );

  const onDragEndRect = useCallback(
    (y: number, y2: number) => {
      isDragging.current = false;

      const sellMax = yScale.invert(y).toString();
      const buyMin = yScale.invert(y2).toString();
      const { buyPriceHigh, sellPriceLow } = calcPrices(buyMin, sellMax);
      onDragEnd?.({
        buy: { min: buyMin, max: buyPriceHigh },
        sell: { min: sellPriceLow, max: sellMax },
      });
    },
    [calcPrices, onDragEnd, yScale],
  );

  useEffect(() => {
    if (isDragging.current) {
      return;
    }

    handleStateChange({
      yPos,
      marketPriceY: yPos.marketPrice,
    });
  }, [yPos]);

  const maxIsOutOfScale = yPos.sell.max <= 0;
  const minIsOutOfScale = yPos.buy.min >= dms.boundedHeight;

  return (
    <>
      <D3ChartHandleLine
        selector={selectorHandleSellMin}
        handleClassName="opacity-40"
        color="var(--sell)"
        lineProps={{ strokeDasharray: 2 }}
        label={prettifyNumber(prices.sell.min ?? '', { decimals: 4 })}
        readonly={readonly}
      />
      <D3ChartHandleLine
        selector={selectorHandleBuyMax}
        handleClassName="opacity-40"
        color="var(--buy)"
        lineProps={{ strokeDasharray: 2 }}
        label={prettifyNumber(prices.buy.max ?? '', { decimals: 4 })}
        readonly={readonly}
      />
      <D3ChartOverlappingHandle
        selector={selectorHandleBuyMin}
        onDrag={onDragBuy}
        onDragEnd={onDragEndBuy}
        color="var(--buy)"
        label={prettifyNumber(prices.buy.min ?? '', { decimals: 4 })}
        readonly={readonly}
      />
      <D3ChartOverlappingHandle
        selector={selectorHandleSellMax}
        onDrag={onDragSell}
        onDragEnd={onDragEndSell}
        color="var(--sell)"
        label={prettifyNumber(prices.sell.max ?? '', { decimals: 4 })}
        readonly={readonly}
      />
      <D3ChartOverlappingRangeGroup
        onDrag={onDragRect}
        onDragEnd={onDragEndRect}
        readonly={readonly}
      />
      <D3ChartPriceOutOfScale
        type="buy"
        minOutOfScale={minIsOutOfScale}
        maxOutOfScale={false}
        color="var(--buy)"
      />
      <D3ChartPriceOutOfScale
        type="sell"
        minOutOfScale={false}
        maxOutOfScale={maxIsOutOfScale}
        color="var(--sell)"
      />
    </>
  );
};
