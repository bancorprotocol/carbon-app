import { ChartPrices } from 'components/strategies/common/d3Chart/D3ChartCandlesticks';
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
import { isFullRange } from '../../utils';
import { Token } from 'libs/tokens';

interface Props {
  base: Token;
  quote: Token;
  prices: ChartPrices;
  marketPrice?: number;
  spread: number;
  onChange?: (prices: ChartPrices) => any;
}

export const D3ChartOverlapping = (props: Props) => {
  const { base, quote, prices, marketPrice, onChange, spread } = props;
  const { dms, yScale } = useD3ChartCtx();
  const isDragging = useRef(false);
  const readonly = (() => {
    if (!onChange) return true;
    return isFullRange(base, quote, prices.buy.min, prices.sell.max);
  })();

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
      if (!onChange) return;
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
      onChange({
        buy: { min: buyMin, max: prices.buy.max },
        sell: { min: sellPriceLow, max: prices.sell.max },
      });
    },
    [
      calcPrices,
      onChange,
      prices.buy.max,
      prices.sell.max,
      spread,
      yPos.marketPrice,
      yScale,
    ],
  );

  const onDragEndBuy = useCallback(() => {
    if (!onChange) return;
    isDragging.current = false;

    const y = Number(
      getSelector(getHandleSelector('buy', 'line1')).select('line').attr('y1'),
    );
    const buyMin = yScale.invert(y).toString();
    const { sellPriceLow } = calcPrices(buyMin, prices.sell.max);
    onChange({
      buy: { min: buyMin, max: prices.buy.max },
      sell: { min: sellPriceLow, max: prices.sell.max },
    });
  }, [calcPrices, onChange, prices.buy.max, prices.sell.max, yScale]);

  const onDragSell = useCallback(
    (y: number) => {
      if (!onChange) return;
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
      onChange({
        buy: { min: prices.buy.min, max: buyPriceHigh },
        sell: { min: prices.sell.min, max: sellMax },
      });
    },
    [
      calcPrices,
      onChange,
      prices.buy.min,
      prices.sell.min,
      spread,
      yPos.marketPrice,
      yScale,
    ],
  );

  const onDragEndSell = useCallback(() => {
    if (!onChange) return;
    isDragging.current = false;

    const y = Number(
      getSelector(getHandleSelector('sell', 'line1')).select('line').attr('y1'),
    );
    const sellMax = yScale.invert(y).toString();
    const { buyPriceHigh } = calcPrices(prices.buy.min, sellMax);
    onChange({
      buy: { min: prices.buy.min, max: buyPriceHigh },
      sell: { min: prices.sell.min, max: sellMax },
    });
  }, [calcPrices, onChange, prices.buy.min, prices.sell.min, yScale]);

  const onDragRect = useCallback(
    (y: number, y2: number) => {
      if (!onChange) return;
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
      onChange({
        buy: { min: buyMin, max: buyPriceHigh },
        sell: { min: sellPriceLow, max: sellMax },
      });
    },
    [calcPrices, onChange, yPos.marketPrice, yScale],
  );

  const onDragEndRect = useCallback(
    (y: number, y2: number) => {
      if (!onChange) return;
      isDragging.current = false;

      const sellMax = yScale.invert(y).toString();
      const buyMin = yScale.invert(y2).toString();
      const { buyPriceHigh, sellPriceLow } = calcPrices(buyMin, sellMax);
      onChange({
        buy: { min: buyMin, max: buyPriceHigh },
        sell: { min: sellPriceLow, max: sellMax },
      });
    },
    [calcPrices, onChange, yScale],
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
        color="var(--color-sell)"
        lineProps={{ strokeDasharray: 2 }}
        label={prettifyNumber(prices.sell.min ?? '', { decimals: 4 })}
        readonly={readonly}
      />
      <D3ChartHandleLine
        selector={selectorHandleBuyMax}
        handleClassName="opacity-40"
        color="var(--color-buy)"
        lineProps={{ strokeDasharray: 2 }}
        label={prettifyNumber(prices.buy.max ?? '', { decimals: 4 })}
        readonly={readonly}
      />
      <D3ChartOverlappingHandle
        selector={selectorHandleBuyMin}
        onDrag={onDragBuy}
        onDragEnd={onDragEndBuy}
        color="var(--color-buy)"
        label={prettifyNumber(prices.buy.min ?? '', { decimals: 4 })}
        readonly={readonly}
      />
      <D3ChartOverlappingHandle
        selector={selectorHandleSellMax}
        onDrag={onDragSell}
        onDragEnd={onDragEndSell}
        color="var(--color-sell)"
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
        color="var(--color-buy)"
      />
      <D3ChartPriceOutOfScale
        type="sell"
        minOutOfScale={false}
        maxOutOfScale={maxIsOutOfScale}
        color="var(--color-sell)"
      />
    </>
  );
};
