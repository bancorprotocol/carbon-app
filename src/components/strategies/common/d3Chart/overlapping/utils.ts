import { ChartPrices } from 'components/strategies/common/d3Chart/D3ChartCandlesticks';
import {
  getHandleSelector,
  getRectSelector,
  getSelector,
  moveBoundary,
  moveRect,
} from 'components/strategies/common/d3Chart/utils';

export const onDragBuyHandler = ({
  y,
  y2,
  marketPriceY,
}: {
  y: number;
  y2: number;
  marketPriceY: number;
}) => {
  const yOpposite = Number(
    getSelector(getHandleSelector('sell', 'line1')).select('line').attr('y1'),
  );

  // SellMin is dragged below BuyMin
  if (y < yOpposite) {
    return;
  }

  moveBoundary(getHandleSelector('buy', 'line1'), y);
  moveBoundary(getHandleSelector('sell', 'line2'), y2);

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
  y2,
  marketPriceY,
}: {
  y: number;
  y2: number;
  marketPriceY: number;
}) => {
  const yOpposite = Number(
    getSelector(getHandleSelector('buy', 'line1')).select('line').attr('y1'),
  );
  // SellMin is dragged below BuyMin
  if (y > yOpposite) {
    return;
  }

  moveBoundary(getHandleSelector('sell', 'line1'), y);
  moveBoundary(getHandleSelector('buy', 'line2'), y2);

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
  yPos,
  marketPriceY,
}: {
  yPos: ChartPrices<number>;
  marketPriceY: number;
}) => {
  onDragSellHandler({ y: yPos.sell.max, y2: yPos.buy.max, marketPriceY });
  onDragBuyHandler({ y: yPos.buy.min, y2: yPos.sell.min, marketPriceY });
};

export const handleStateChange = ({
  yPos,
  marketPriceY,
}: {
  yPos: ChartPrices<number>;
  marketPriceY: number;
}) => {
  moveBoundary(getHandleSelector('buy', 'line1'), yPos.buy.min);
  moveBoundary(getHandleSelector('sell', 'line1'), yPos.sell.max);
  moveBoundary(getHandleSelector('buy', 'line2'), yPos.buy.max);
  moveBoundary(getHandleSelector('sell', 'line2'), yPos.sell.min);

  const sellRect = getRectSelector('sell');
  const buyRect = getRectSelector('buy');

  if (yPos.sell.max < marketPriceY && marketPriceY < yPos.buy.min) {
    moveRect(buyRect, yPos.buy.min, marketPriceY);
    moveRect(sellRect, yPos.sell.max, marketPriceY);
    return;
  }

  if (yPos.buy.min < marketPriceY) {
    moveRect(sellRect, yPos.sell.max, yPos.buy.min);
    moveRect(buyRect, yPos.buy.min, yPos.buy.min);
  } else {
    moveRect(buyRect, yPos.buy.min, yPos.sell.max);
    moveRect(sellRect, yPos.sell.max, yPos.sell.max);
  }
};
