import {
  getHandleSelector,
  getRectSelector,
  getSelector,
  moveBoundary,
  moveRect,
} from 'components/simulator/input/d3Chart/utils';

export const onDragBuyHandler = ({
  y,
  marketPriceY,
  onChange,
}: {
  y: number;
  marketPriceY: number;
  onChange: (y: number) => void;
}) => {
  onChange(y);
  const id = 'line1';
  const selector = getHandleSelector('buy', id);
  const yOpposite = Number(
    getSelector(getHandleSelector('sell', id)).select('line').attr('y1')
  );

  // SellMin is dragged below BuyMin
  if (y < yOpposite) {
    return;
  }

  moveBoundary(selector, y);

  const rect = getSelector(getRectSelector('buy'));
  const rectOpposite = getSelector(getRectSelector('sell'));

  // BuyMin and SellMax are both below the market price
  if (y > marketPriceY && yOpposite > marketPriceY) {
    rectOpposite.attr('height', 0);
    rect.attr('y', yOpposite).attr('height', y - yOpposite);
    return;
  }

  // BuyMin is below and SellMax is above the market price
  if (yOpposite < marketPriceY && marketPriceY < y) {
    rect.attr('y', marketPriceY).attr('height', y - marketPriceY);
    rectOpposite.attr('height', marketPriceY - yOpposite);
    return;
  }

  // BuyMin and SellMax are both above the market price
  rect.attr('height', 0);
  rectOpposite.attr('height', y - yOpposite);
};

export const onDragSellHandler = ({
  y,
  marketPriceY,
  onChange,
}: {
  y: number;
  marketPriceY: number;
  onChange: (y: number) => void;
}) => {
  onChange(y);
  const id = 'line1';
  const selector = getHandleSelector('sell', id);
  const yOpposite = Number(
    getSelector(getHandleSelector('buy', id)).select('line').attr('y1')
  );
  // SellMin is dragged below BuyMin
  if (y > yOpposite) {
    return;
  }

  moveBoundary(selector, y);

  const rect = getSelector(getRectSelector('sell'));
  const rectOpposite = getSelector(getRectSelector('buy'));

  // BuyMin and SellMax are both above the market price
  if (y < marketPriceY && yOpposite < marketPriceY) {
    rectOpposite.attr('height', 0);
    rect.attr('y', y).attr('height', yOpposite - y);
    return;
  }

  // BuyMin is below and SellMax is above the market price
  if (y < marketPriceY && marketPriceY < yOpposite) {
    rect.attr('y', y).attr('height', marketPriceY - y);
    rectOpposite
      .attr('y', marketPriceY)
      .attr('height', yOpposite - marketPriceY);
    return;
  }

  // BuyMin and SellMax are both above the market price
  rect.attr('height', 0);
  rectOpposite.attr('y', y).attr('height', yOpposite - y);
};

export const onDragRectHandler = ({
  y,
  y2,
  marketPriceY,
  onChange,
}: {
  y: number;
  y2: number;
  marketPriceY: number;
  onChange: (min: number, max: number) => void;
}) => {
  getSelector(getRectSelector('buy')).attr('y2', y);
  getSelector(getRectSelector('sell')).attr('y', y2);

  moveBoundary(getHandleSelector('buy', 'line1'), y);
  moveBoundary(getHandleSelector('sell', 'line1'), y2);

  onChange(y2, y);
};

export const handleStateChange = ({
  yBuyMin,
  ySellMax,
  marketPriceY,
}: {
  yBuyMin: number;
  ySellMax: number;
  marketPriceY: number;
}) => {
  const id = 'line1';
  moveBoundary(getHandleSelector('buy', id), yBuyMin);
  moveBoundary(getHandleSelector('sell', id), ySellMax);

  const sellRect = getRectSelector('sell');
  const buyRect = getRectSelector('buy');

  if (ySellMax < marketPriceY && marketPriceY < yBuyMin) {
    moveRect(buyRect, yBuyMin, marketPriceY);
    moveRect(sellRect, ySellMax, marketPriceY);
    return;
  }

  if (yBuyMin < marketPriceY) {
    moveRect(sellRect, ySellMax, yBuyMin);
    moveRect(buyRect, yBuyMin, yBuyMin);
  } else {
    moveRect(buyRect, yBuyMin, ySellMax);
    moveRect(sellRect, ySellMax, ySellMax);
  }
};
