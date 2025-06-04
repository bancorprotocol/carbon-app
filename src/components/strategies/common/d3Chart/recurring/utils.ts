import {
  getHandleSelector,
  getRectSelector,
  getSelector,
  moveBoundary,
  moveRect,
} from 'components/strategies/common/d3Chart/utils';

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
    getSelector(selectorOpposite).select('line').attr('y1'),
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
    getSelector(getHandleSelector(type, oppositeId)).select('line').attr('y1'),
  );

  moveRect(getRectSelector(type), y, oppositeY);
};
