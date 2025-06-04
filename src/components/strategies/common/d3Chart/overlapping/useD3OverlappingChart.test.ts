import { renderHook } from 'libs/testing-library';
import { useLinearScale } from 'libs/d3';
import { getDomain } from '../utils';
import { expect, describe, it } from 'vitest';
import { useD3OverlappingChart } from './useD3OverlappingChart';
import { formatNumber } from 'utils/helpers';

describe('useYPos', () => {
  it('should handle case where prices.buy.min or prices.sell.max are non-zero', () => {
    const prices = {
      buy: { min: '0.6', max: '1.2' },
      sell: { min: '0.8', max: '1.6' },
    };
    const bounds = {
      buy: { min: '0', max: '3' },
      sell: { min: '0.8', max: '3' },
    };
    const spread = 5;
    const marketPrice = 1.0;
    const maxRange = 300;

    const { result: linearScaleResult } = renderHook(() =>
      useLinearScale({
        domain: getDomain([], bounds, marketPrice),
        range: [maxRange, 0],
        domainTolerance: 0.1,
      }),
    );
    const yScale = linearScaleResult.current.scale;
    const max = Math.max(...yScale.domain());
    const min = Math.min(...yScale.domain());

    const { result } = renderHook(() =>
      useD3OverlappingChart({ prices, yScale, spread, marketPrice }),
    );

    const { buyPriceHigh, sellPriceLow } = result.current.calcPrices(
      formatNumber(prices.buy.min),
      formatNumber(prices.sell.max),
    );

    expect(buyPriceHigh).not.toEqual(prices.buy.min);
    expect(sellPriceLow).not.toEqual(prices.sell.max);

    expect(result.current.yPos).toStrictEqual({
      buy: {
        min: yScale(Math.max(min, Number(prices.buy.min))),
        max: yScale(Math.min(max, Number(buyPriceHigh))),
      },
      sell: {
        min: yScale(Math.max(min, Number(sellPriceLow))),
        max: yScale(Math.min(max, Number(prices.sell.max))),
      },
      marketPrice: yScale(marketPrice),
    });
  });
  it('should handle case where prices.buy.min or prices.sell.max are zero', () => {
    const prices = {
      buy: { min: '0', max: '1.2' },
      sell: { min: '0.8', max: '0' },
    };
    const bounds = {
      buy: { min: '0', max: '1' },
      sell: { min: '0.8', max: '3' },
    };
    const spread = 5;
    const marketPrice = 0.9;
    const maxRange = 300;

    const { result: linearScaleResult } = renderHook(() =>
      useLinearScale({
        domain: getDomain([], bounds, marketPrice),
        range: [maxRange, 0],
        domainTolerance: 0.1,
      }),
    );
    const yScale = linearScaleResult.current.scale;
    const max = Math.max(...yScale.domain());
    const min = Math.min(...yScale.domain());

    const { result } = renderHook(() =>
      useD3OverlappingChart({ prices, yScale, spread, marketPrice }),
    );

    const { buyPriceHigh, sellPriceLow } = result.current.calcPrices(
      formatNumber(prices.buy.min),
      formatNumber(prices.sell.max),
    );

    expect(result.current.yPos).toStrictEqual({
      buy: {
        min: yScale(Math.max(min, Number(prices.buy.min))),
        max: yScale(Math.min(max, Number(buyPriceHigh))),
      },
      sell: {
        min: yScale(Math.max(min, Number(sellPriceLow))),
        max: yScale(Math.min(max, Number(prices.sell.max))),
      },
      marketPrice: yScale(marketPrice),
    });
  });
  it('should handle case with no marketPrice', () => {
    const prices = {
      buy: { min: '0', max: '1.2' },
      sell: { min: '0.8', max: '0' },
    };
    const bounds = {
      buy: { min: '0', max: '1' },
      sell: { min: '0.8', max: '3' },
    };
    const spread = 5;
    const marketPrice = 0.9;
    const maxRange = 300;

    const { result: linearScaleResult } = renderHook(() =>
      useLinearScale({
        domain: getDomain([], bounds, marketPrice),
        range: [maxRange, 0],
        domainTolerance: 0.1,
      }),
    );
    const yScale = linearScaleResult.current.scale;

    const { result } = renderHook(() =>
      useD3OverlappingChart({ prices, yScale, spread }),
    );

    expect(result.current.yPos.marketPrice).toEqual(0);
  });
});
