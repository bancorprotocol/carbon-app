import { max, min, select } from 'd3';
import { ChartPrices } from 'components/simulator/input/d3Chart/D3ChartCandlesticks';
import { CandlestickData } from 'libs/d3/types';
import { useEffect, useState } from 'react';

export const getSelector = (selector: string) => select(`.${selector}`);

export const useSelectable = (selector: string) => {
  const [isSelectable, setIsSelectable] = useState(false);
  useEffect(() => {
    const selection = getSelector(selector);
    setIsSelectable(!!selection.size());
  }, [selector]);
  return isSelectable;
};

export const getHandleSelector = (
  type: 'buy' | 'sell',
  id: 'line1' | 'line2'
) => {
  const base = `range-boundary`;
  return `${base}-${type}-${id}`;
};

export const getRectSelector = (type: 'buy' | 'sell') => {
  const base = `range-rect`;
  return `${base}-${type}`;
};

// TODO move to other utils
export const moveRect = (selector: string, y: number, oppositeY: number) => {
  const rect = getSelector(selector);

  if (y < oppositeY) {
    rect.attr('y', y).attr('height', oppositeY - y);
  } else {
    rect.attr('y', oppositeY).attr('height', y - oppositeY);
  }
};

// TODO move to other utils
export const moveBoundary = (selector: string, y: number) => {
  const me = getSelector(selector);
  const line = me.select('line');
  const handle = me.select('rect');
  const label = me.select('text');
  line.attr('y1', y).attr('y2', y);
  handle.attr('y', y);
  label.attr('y', y + 12);
};

export const onDragHandler = ({
  type,
  id,
  y,
  onMinMaxChange,
  isLimit,
}: {
  type: 'buy' | 'sell';
  id: 'line1' | 'line2';
  y: number;
  onMinMaxChange: (type: 'buy' | 'sell', min: number, max: number) => void;
  isLimit?: boolean;
}) => {
  const selector = getHandleSelector(type, id);
  moveBoundary(selector, y);

  if (isLimit) {
    onMinMaxChange(type, y, y);
    return;
  }

  const oppositeId = id === 'line1' ? 'line2' : 'line1';
  const selectorOpposite = getHandleSelector(type, oppositeId);

  const oppositeY = Number(
    getSelector(selectorOpposite).select('line').attr('y1')
  );

  const rect = getSelector(getRectSelector(type));

  if (y < oppositeY) {
    onMinMaxChange(type, oppositeY, y);
    rect.attr('y', y).attr('height', oppositeY - y);
    return 'flipped';
  } else {
    onMinMaxChange(type, y, oppositeY);
    rect.attr('y', oppositeY).attr('height', y - oppositeY);
  }
};

export const onDragRectHandler = ({
  type,
  y,
  y2,
  onMinMaxChange,
}: {
  type: 'buy' | 'sell';
  y: number;
  y2: number;
  onMinMaxChange: (type: 'buy' | 'sell', min: number, max: number) => void;
}) => {
  getSelector(getRectSelector(type)).attr('y', y);

  moveBoundary(getHandleSelector(type, 'line1'), y);
  moveBoundary(getHandleSelector(type, 'line2'), y2);

  onMinMaxChange(type, y2, y);
};

export const handleStateChange = ({
  type,
  id,
  y,
  isLimit,
}: {
  type: 'buy' | 'sell';
  id: 'line1' | 'line2';
  y: number;
  isLimit?: boolean;
}) => {
  moveBoundary(getHandleSelector(type, id), y);

  if (isLimit) {
    return;
  }

  const oppositeId = id === 'line1' ? 'line2' : 'line1';
  const oppositeY = Number(
    getSelector(getHandleSelector(type, oppositeId)).select('line').attr('y1')
  );

  moveRect(getRectSelector(type), y, oppositeY);
};

type GetDomainFn<T extends number | number[]> = (
  data: CandlestickData[],
  prices: ChartPrices,
  marketPrice?: number
) => T;

const getDomainMin: GetDomainFn<number> = (data, prices, marketPrice) => {
  let dataMin = min(data, (d) => d.low) as number;
  const values = [
    dataMin,
    Number(prices.buy.min),
    Number(prices.sell.min),
    Number(prices.buy.max),
    Number(prices.sell.max),
    marketPrice,
  ];
  return min(values, (d) => d) as number;
};

const getDomainMax: GetDomainFn<number> = (data, prices, marketPrice) => {
  let dataMax = max(data, (d) => d.high) as number;
  const values = [
    dataMax,
    Number(prices.buy.min),
    Number(prices.sell.min),
    Number(prices.buy.max),
    Number(prices.sell.max),
    marketPrice,
  ];
  return max(values, (d) => d) as number;
};

export const getDomain: GetDomainFn<number[]> = (data, prices, marketPrice) => {
  const domainMin = getDomainMin(data, prices, marketPrice);
  const domainMax = getDomainMax(data, prices, marketPrice);

  return [domainMin, domainMax];
};
