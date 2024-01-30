import { select } from 'd3';
import { SimulatorInputSearch } from 'libs/routing/routes/sim';

export const getSelector = (selector: string) => select(`.${selector}`);

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

const moveRect = (selector: string, y: number, oppositeY: number) => {
  const rect = getSelector(selector);

  if (y < oppositeY) {
    rect.attr('y', y).attr('height', oppositeY - y);
  } else {
    rect.attr('y', oppositeY).attr('height', y - oppositeY);
  }
};

const moveBoundary = (selector: string, y: number) => {
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
  onDrag,
  isLimit,
}: {
  type: 'buy' | 'sell';
  id: 'line1' | 'line2';
  y: number;
  onDrag: (key: keyof SimulatorInputSearch, value: number) => void;
  isLimit?: boolean;
}) => {
  const selector = getHandleSelector(type, id);
  moveBoundary(selector, y);

  if (isLimit) {
    onDrag(`${type}Max`, y);
    onDrag(`${type}Min`, y);
    return;
  }

  const oppositeId = id === 'line1' ? 'line2' : 'line1';
  const selectorOpposite = getHandleSelector(type, oppositeId);

  const oppositeY = Number(
    getSelector(selectorOpposite).select('line').attr('y1')
  );

  const rect = getSelector(getRectSelector(type));

  if (y < oppositeY) {
    onDrag(`${type}Max`, y);
    rect.attr('y', y).attr('height', oppositeY - y);
  } else {
    onDrag(`${type}Min`, y);
    rect.attr('y', oppositeY).attr('height', y - oppositeY);
  }
};

export const onDragRectHandler = ({
  type,
  y,
  y2,
  onDrag,
}: {
  type: 'buy' | 'sell';
  y: number;
  y2: number;
  onDrag: (key: keyof SimulatorInputSearch, value: number) => void;
}) => {
  getSelector(getRectSelector(type)).attr('y', y);

  moveBoundary(getHandleSelector(type, 'line1'), y);
  onDrag(`${type}Max`, y);

  moveBoundary(getHandleSelector(type, 'line2'), y2);
  onDrag(`${type}Min`, y2);
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
  const oppositeY = getSelector(getHandleSelector(type, oppositeId))
    .select('line')
    .attr('y1');

  moveRect(getRectSelector(type), y, Number(oppositeY));
};
