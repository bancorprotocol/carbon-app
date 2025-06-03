import { ScaleLinear } from 'd3';
import { ChartPrices } from '../D3ChartCandlesticks';
import { useCallback, useMemo } from 'react';
import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';
import { formatNumber } from 'utils/helpers';

interface Props {
  prices: ChartPrices<string>;
  yScale: ScaleLinear<number, number, never>;
  spread: number;
  marketPrice?: number;
}

export const useD3OverlappingChart = (props: Props) => {
  const { prices, yScale, spread, marketPrice } = props;

  const calcPrices = useCallback(
    (buyMin: string, sellMax: string) => {
      return calculateOverlappingPrices(
        formatNumber(buyMin),
        formatNumber(sellMax),
        marketPrice?.toString() ?? '0',
        spread.toString(),
      );
    },
    [marketPrice, spread],
  );

  const yPos = useMemo(() => {
    let buyMax = prices.buy.max;
    let sellMin = prices.sell.min;

    if (prices.buy.min && prices.sell.max) {
      const calculatedPrices = calcPrices(
        formatNumber(prices.buy.min),
        formatNumber(prices.sell.max),
      );
      buyMax = calculatedPrices.buyPriceHigh;
      sellMin = calculatedPrices.sellPriceLow;
    }

    // clamp with domain to prevent negative values in full range
    const max = Math.max(...yScale.domain());
    const min = Math.min(...yScale.domain());

    return {
      buy: {
        min: yScale(Math.max(min, Number(prices.buy.min))),
        max: yScale(Math.min(max, Number(buyMax))),
      },
      sell: {
        min: yScale(Math.max(min, Number(sellMin))),
        max: yScale(Math.min(max, Number(prices.sell.max))),
      },
      marketPrice: marketPrice ? yScale(marketPrice) : 0,
    };
  }, [prices, yScale, marketPrice, calcPrices]);

  return {
    calcPrices,
    yPos,
  };
};
