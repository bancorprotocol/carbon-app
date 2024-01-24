import { drag, ScaleLinear, select } from 'd3';
import { D3ChartSettings } from 'libs/d3/types';
import { SimulatorInputSearch } from 'libs/routing/routes/sim';
import { useEffect, useRef } from 'react';

const dragAccessor2 = function (this: Element) {
  const me = select(this);
  const line = me.select('line');
  return {
    y: Number(line.attr('y1')),
  };
};

const dragAccessor = function (this: Element) {
  const me = select(this);
  return {
    y: Number(me.attr('y')),
    height: Number(me.attr('height')),
  };
};

type OrderRangeProps = {
  type: 'buy' | 'sell';
  yScale: ScaleLinear<number, number>;
  onDrag: (key: keyof SimulatorInputSearch, value: number) => void;
  state: SimulatorInputSearch;
  dms: D3ChartSettings;
};

export const DragablePriceRange = ({
  type,
  yScale,
  onDrag,
  state,
  dms: { boundedWidth },
}: OrderRangeProps) => {
  const isHovering = useRef(false);
  const buyRectRef = useRef<SVGRectElement>(null);
  const buyUpperLineRef = useRef<SVGLineElement>(null);
  const buyLowerLineRef = useRef<SVGLineElement>(null);

  const dragRect = drag()
    .subject(dragAccessor)
    .on('drag', function ({ y, subject: { height } }) {
      const me = select(this);
      const upperLine = select(buyUpperLineRef.current).select('line');
      const upperHandle = select(buyUpperLineRef.current).select('rect');
      const lowerLine = select(buyLowerLineRef.current).select('line');
      const lowerHandle = select(buyLowerLineRef.current).select('rect');

      me.attr('y', y);
      upperHandle.attr('y', y);
      upperLine.attr('y1', y).attr('y2', y);
      lowerLine.attr('y1', y + height).attr('y2', y + height);
      lowerHandle.attr('y', y + height);
      onDrag(`${type}Max`, y);
      onDrag(`${type}Min`, y + height);
    });

  const dragUpperLine = drag()
    .subject(dragAccessor2)
    .on('drag', function ({ y }) {
      const me = select(this);
      const handle = me.select('rect');
      const upper = me.select('line');
      const rect = select(buyRectRef.current);
      const lower = select(buyLowerLineRef.current).select('line');

      const lowerY = Number(lower.attr('y1'));

      handle.attr('y', y);
      rect.attr('y', y).attr('height', lowerY - y);
      upper.attr('y1', y).attr('y2', y);
      onDrag(`${type}Max`, y);
    });

  const dragLowerLine = drag()
    .subject(dragAccessor2)
    .on('drag', function ({ y }) {
      const me = select(this);
      const handle = me.select('rect');
      const lower = me.select('line');
      const upper = select(buyUpperLineRef.current).select('line');
      const rect = select(buyRectRef.current);

      const upperY = Number(upper.attr('y1'));

      rect.attr('height', y - upperY);
      handle.attr('y', y);
      lower.attr('y1', y).attr('y2', y);
      onDrag(`${type}Min`, y);
    });

  useEffect(() => {
    // @ts-ignore
    dragRect(select(buyRectRef.current));
    // @ts-ignore
    dragUpperLine(select(buyUpperLineRef.current));
    // @ts-ignore
    dragLowerLine(select(buyLowerLineRef.current));
  }, []);

  const color = type === 'buy' ? 'green' : 'red';

  const handleDimensions = {
    width: 40,
    height: 20,
  };

  const max = state[`${type}Max`];
  const min = state[`${type}Min`];

  useEffect(() => {
    if (!isHovering.current && max) {
      const y = yScale(Number(max));
      const me = select(buyUpperLineRef.current);
      const handle = me.select('rect');
      const upper = me.select('line');
      const rect = select(buyRectRef.current);
      const lower = select(buyLowerLineRef.current).select('line');

      const lowerY = Number(lower.attr('y1'));

      handle.attr('y', y);
      rect.attr('y', y).attr('height', lowerY - y);
      upper.attr('y1', y).attr('y2', y);
    }
  }, [max, type, yScale]);

  return (
    <g
      onMouseEnter={() => {
        isHovering.current = true;
      }}
      onMouseLeave={() => {
        isHovering.current = false;
      }}
    >
      <rect
        ref={buyRectRef}
        height={30}
        width={boundedWidth}
        fill={color}
        fillOpacity={0.5}
      />
      <g ref={buyUpperLineRef}>
        <line x1={0} x2={boundedWidth} stroke={color} strokeWidth={10} />
        <rect
          {...handleDimensions}
          fill={color}
          transform={`translate(-${handleDimensions.width},-${
            handleDimensions.height / 2
          })`}
        />
      </g>

      <g ref={buyLowerLineRef}>
        <line
          y1={35}
          y2={35}
          x1={0}
          x2={boundedWidth}
          stroke={color}
          strokeWidth={10}
        />
        <rect
          {...handleDimensions}
          y={35}
          fill={color}
          transform={`translate(-${handleDimensions.width},-${
            handleDimensions.height / 2
          })`}
        />
      </g>
    </g>
  );
};
