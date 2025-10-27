import {
  FC,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  WheelEvent,
  useEffect,
  useId,
  useState,
} from 'react';
import { CreateOverlappingOrder } from '../common/types';
import { SafeDecimal } from 'libs/safedecimal';
import { cn, prettifySignedNumber, tokenAmount } from 'utils/helpers';
import { Token } from 'libs/tokens';
import { isValidRange } from '../utils';
import { getMaxBuyMin, getMinSellMax } from './utils';
import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';
import { getSignedMarketPricePercentage } from '../marketPriceIndication/utils';
import { marketPricePercent } from '../marketPriceIndication/useMarketPercent';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { clamp, getMax, getMin } from 'utils/helpers/operators';
import { isFullRange } from '../common/utils';
import { NotFound } from 'components/common/NotFound';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import styles from './OverlappingChart.module.css';

type Scale = ReturnType<typeof getScale>;

// Static
const outline = 'var(--color-main-700)';
const background = 'var(--color-main-700)';
const fontSize = 13;
const padding = 5;
const top = 70;
const middle = 40;
const bottom = 10;

// Utils
const round = (value: number) => Math.round(value * 100) / 100;

const textWidth = (text: string = '') => {
  return text.length * (fontSize / 2) + 5;
};

// Polygons
const getOrders = (
  min: number,
  max: number,
  marketPrice: string,
  spread?: string,
) => {
  const params = calculateOverlappingPrices(
    min.toString(),
    max.toString(),
    marketPrice,
    spread || Number.MIN_VALUE.toString(),
  );
  return {
    buy: {
      min: params.buyPriceLow,
      max: params.buyPriceHigh,
      marginalPrice: params.buyPriceMarginal,
    },
    sell: {
      min: params.sellPriceLow,
      max: params.sellPriceHigh,
      marginalPrice: params.sellPriceMarginal,
    },
  };
};
type Orders = ReturnType<typeof getOrders>;
const getBuyPoint = ({ buy, sell }: Orders, scale: Scale) => {
  const { x, y } = scale;
  const min = +buy.min;
  const maxTop = getMin(sell.min, buy.marginalPrice);
  const maxBottom = getMin(buy.max, buy.marginalPrice);
  if (min > +buy.max || min > +buy.marginalPrice) return '';
  return [
    [x(min), y(top)].join(','),
    [x(maxTop), y(top)].join(','),
    [x(maxTop), y(middle)].join(','),
    [x(maxBottom), y(middle)].join(','),
    [x(maxBottom), y(bottom)].join(','),
    [x(min), y(bottom)].join(','),
  ].join(' ');
};
const getMarginalBuyPoint = ({ buy, sell }: Orders, scale: Scale) => {
  const { x, y } = scale;
  if (+buy.min > +buy.max || +buy.min > +buy.marginalPrice) {
    return '';
  }
  if (+sell.min >= +buy.marginalPrice) {
    return [
      [x(buy.marginalPrice), y(top)].join(','),
      [x(sell.min), y(top)].join(','),
      [x(sell.min), y(middle)].join(','),
      [x(buy.max), y(middle)].join(','),
      [x(buy.max), y(bottom)].join(','),
      [x(buy.marginalPrice), y(bottom)].join(','),
    ].join(' ');
  } else {
    return [
      [x(buy.marginalPrice), y(middle)].join(','),
      [x(buy.max), y(middle)].join(','),
      [x(buy.max), y(bottom)].join(','),
      [x(buy.marginalPrice), y(bottom)].join(','),
    ].join(' ');
  }
};
const getSellPoint = ({ buy, sell }: Orders, scale: Scale) => {
  const { x, y } = scale;
  const minTop = getMax(sell.min, sell.marginalPrice);
  const minBottom = getMax(buy.max, sell.marginalPrice);
  if (+sell.max < +sell.min || +sell.max < +sell.marginalPrice) {
    return '';
  }
  return [
    [x(minTop), y(top)].join(','),
    [x(sell.max), y(top)].join(','),
    [x(sell.max), y(bottom)].join(','),
    [x(minBottom), y(bottom)].join(','),
    [x(minBottom), y(middle)].join(','),
    [x(minTop), y(middle)].join(','),
  ].join(' ');
};
const getMarginalSellPoint = ({ buy, sell }: Orders, scale: Scale) => {
  const { x, y } = scale;
  if (+sell.max < +sell.min || +sell.max < +sell.marginalPrice) {
    return '';
  }
  if (+sell.marginalPrice >= +buy.max) {
    return [
      [x(sell.min), y(top)].join(','),
      [x(sell.marginalPrice), y(top)].join(','),
      [x(sell.marginalPrice), y(bottom)].join(','),
      [x(buy.max), y(bottom)].join(','),
      [x(buy.max), y(middle)].join(','),
      [x(sell.min), y(middle)].join(','),
    ].join(' ');
  } else {
    return [
      [x(sell.min), y(top)].join(','),
      [x(sell.marginalPrice), y(top)].join(','),
      [x(sell.marginalPrice), y(middle)].join(','),
      [x(sell.min), y(middle)].join(','),
    ].join(' ');
  }
};

// Scale
const useResize = (id: string) => {
  const [box, setBox] = useState({
    width: 600,
    height: 300,
  });
  useEffect(() => {
    const svg = document.getElementById(id);
    if (!svg || !('ResizeObserver' in window)) return;
    // Start observing
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width === box.width && height === box.height) return;
      setBox({ width, height });
    });
    observer.observe(svg);
    return () => observer.disconnect();
  });
  return box;
};

interface ScaleParams {
  left: number;
  right: number;
  width: number;
  height: number;
  zoom: number;
}
const getScale = ({ width, height, left, right, zoom }: ScaleParams) => {
  const anchor = (width / 2) * (1 - zoom);
  const xRatio = (zoom * width) / (right - left);
  const yRatio = height / 100;
  return {
    x: (value: string | number) => anchor + round((+value - left) * xRatio),
    y: (value: string | number) => round((100 - +value) * yRatio),
  };
};
const getBoundaries = (lowest: number, highest: number) => {
  const delta = highest - lowest;
  const mean = (highest + lowest) / 2;
  return {
    left: mean - delta * 1.2,
    mean,
    right: mean + delta * 1.2,
  };
};

// Prices
const getSteps = (width: number) => {
  const steps: number[] = [];
  const delta = 30;
  const amount = Math.ceil(width / delta);
  for (let i = 0; i < amount; i++) {
    steps.push(i * delta);
  }
  return steps;
};

const getPrices = (lowest: number, highest: number, width: number) => {
  const delta = highest - lowest;
  const mean = (highest + lowest) / 2;
  if (width < 500) {
    return [mean - delta * 0.5, mean, mean + delta * 0.5];
  } else {
    return [
      mean - delta,
      mean - delta * 0.5,
      mean,
      mean + delta * 0.5,
      mean + delta,
    ];
  }
};

interface Props {
  base: Token;
  quote: Token;
  buy: CreateOverlappingOrder;
  sell: CreateOverlappingOrder;
  spread?: string;
  userMarketPrice?: string;
  disabled?: boolean;
  className?: string;
  setMin: (min: string) => any;
  setMax: (max: string) => any;
}
export const OverlappingChart: FC<Props> = (props) => {
  const { base, quote, buy, sell, userMarketPrice, spread, className } = props;
  const id = useId();
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState('');
  const box = useResize(id);
  const isValid = isValidRange(buy.min, sell.max);
  const { marketPrice: externalPrice, isPending } = useMarketPrice({
    base,
    quote,
  });
  const marketPrice = userMarketPrice ?? externalPrice?.toString();

  const min = +buy.min;
  const max = +sell.max;
  const lowest = getMin(buy.min, marketPrice ?? buy.min);
  const highest = getMax(sell.max, marketPrice ?? sell.max);
  const prices = getPrices(lowest, highest, box.width);
  const { left, mean, right } = getBoundaries(lowest, highest);
  const fullRange = isFullRange(base, quote, buy.min, sell.max);
  const marketPosition = fullRange ? mean : marketPrice;
  const disabled = props.disabled;

  const scaleConfig = {
    left,
    right,
    width: box.width,
    height: box.height,
    zoom: zoom,
  };
  const { x, y } = getScale(scaleConfig);
  const viewBox = `0 0 ${box.width} ${box.height}`;

  // Texts
  const marketPriceText = tokenAmount(marketPrice, quote);
  const marketPercent = {
    min: marketPricePercent(buy.min, marketPrice),
    max: marketPricePercent(sell.max, marketPrice),
  };
  const minText = fullRange ? tokenAmount(0, quote) : tokenAmount(min, quote);
  const minPrecent = fullRange
    ? null
    : getSignedMarketPricePercentage(marketPercent.min);
  const minPercentText = minPrecent ? `${minPrecent}%` : '...';

  const maxText = fullRange
    ? tokenAmount(Infinity, quote)
    : tokenAmount(max, quote);
  const maxPercent = fullRange
    ? null
    : getSignedMarketPricePercentage(marketPercent.max);
  const maxPercentText = maxPercent ? `${maxPercent}%` : '...';

  const title = (() => {
    const feeTier = `Fee Tier ${spread || 0}%`;
    if (userMarketPrice) {
      return ['User-defined market price', feeTier].join(' · ');
    } else if (externalPrice) {
      return ['Market price provided by CoinGecko', feeTier].join(' · ');
    } else {
      return ['No Market price found', feeTier].join(' · ');
    }
  })();

  // ZOOM
  const updateZoom = (e: WheelEvent) => {
    const newZoom = clamp(1, zoom + e.deltaY * 0.005, 2);
    setZoom(newZoom);
  };

  // onWheel doesn't support preventDefault as it's a passive event.
  // We need to add active listener on prevent Default
  // But we still need to set the update zoom with react's onWheel event for some reason
  useEffect(() => {
    const el = document.getElementById(id);
    const handler = (e: Event) => e.preventDefault();
    el?.addEventListener('wheel', handler, { passive: false });
    return () => el?.removeEventListener('wheel', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // DRAGGABLE
  let draggedHandler: 'buy' | 'sell' | undefined;
  let initialPosition = 0;

  const translateHandler = (mode: 'buy' | 'sell', x: number) => {
    const g = document.getElementById(`${mode}-handler`);
    if (!g) return;
    if (x) {
      g.dataset.delta = x.toString();
      g.style.setProperty('transform', `translateX(${x}px)`);
    } else {
      g.dataset.delta = '';
      g.style.removeProperty('transform');
    }
  };

  const toDelta = (value: number) => {
    return (value / (right - left)) * box.width * zoom;
  };
  const fromDelta = (delta: number) => {
    return ((delta / box.width) * (right - left)) / zoom;
  };

  const getHandlerDelta = (mode: 'buy' | 'sell') => {
    return document.getElementById(`${mode}-handler`)?.dataset.delta ?? '0';
  };

  const getDraggedMin = () => {
    const delta = Number(getHandlerDelta('buy'));
    if (!delta) return;
    return new SafeDecimal(min).add(fromDelta(delta)).toString();
  };
  const getDraggedMax = () => {
    const delta = Number(getHandlerDelta('sell'));
    if (!delta) return;
    return new SafeDecimal(max).add(fromDelta(delta)).toString();
  };

  const updatePoints = {
    'buy-polygon': getBuyPoint,
    'marginal-buy-polygon': getMarginalBuyPoint,
    'sell-polygon': getSellPoint,
    'marginal-sell-polygon': getMarginalSellPoint,
  };

  // Get new min & max based on current handler
  const updatedMinMax = (e: MouseEvent | TouchEvent) => {
    const x = 'clientX' in e ? e.clientX : e.touches.item(0)!.clientX;
    const delta = fromDelta(x - initialPosition);
    const distance = max - min;
    const lowest = Math.max(0, left);
    const safeSpread = spread ? +spread : Number.MIN_VALUE;
    const minSellMax = getMinSellMax(min, safeSpread);
    const maxBuyMin = getMaxBuyMin(max, safeSpread);
    if (draggedHandler === 'buy') {
      return {
        newMin: clamp(lowest, min + delta, maxBuyMin),
        newMax: clamp(max, max + delta - distance, right),
      };
    } else {
      return {
        newMin: clamp(lowest, min + delta + distance, min),
        newMax: clamp(minSellMax, max + delta, right),
      };
    }
  };

  const dragStart = (
    e: ReactMouseEvent | ReactTouchEvent,
    mode: 'buy' | 'sell',
  ) => {
    e.preventDefault();
    if (disabled) return;
    const x = 'clientX' in e ? e.clientX : e.touches.item(0).clientX;
    initialPosition = x;
    draggedHandler = mode;
    setDragging(styles.drag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);
  };

  const drag = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    if (!marketPrice) return;
    if (!draggedHandler) return;
    const { newMin, newMax } = updatedMinMax(e);
    // Translate handlers
    translateHandler('buy', toDelta(newMin - min));
    translateHandler('sell', toDelta(newMax - max));

    // Update points
    const orders = getOrders(newMin, newMax, marketPrice, spread);

    for (const [id, update] of Object.entries(updatePoints)) {
      const points = update(orders, { x, y });
      document.getElementById(id)?.setAttribute('points', points);
    }

    // Update lines
    const buyMaxLine = document.getElementById('buy-max-line');
    buyMaxLine?.setAttribute('x1', x(orders.buy.max).toString());
    buyMaxLine?.setAttribute('x2', x(orders.buy.max).toString());
    const sellMinLine = document.getElementById('sell-min-line');
    sellMinLine?.setAttribute('x1', x(orders.sell.min).toString());
    sellMinLine?.setAttribute('x2', x(orders.sell.min).toString());

    // Update tooltip
    const updateTooltip = (mode: 'buy' | 'sell') => {
      const priceSelector = `#${mode}-handler .tooltip-price`;
      const tooltipPrice = document.querySelector(priceSelector);
      const priceValue = mode === 'buy' ? newMin : newMax;
      if (tooltipPrice) {
        tooltipPrice.textContent = tokenAmount(priceValue, quote) ?? '';
      }
      if (marketPrice) {
        const percentSelector = `#${mode}-handler .tooltip-percent`;
        const tooltipPercent = document.querySelector(percentSelector);
        const percentValue = getSignedMarketPricePercentage(
          new SafeDecimal((100 * (priceValue - +marketPrice)) / +marketPrice),
        );
        if (tooltipPercent) tooltipPercent.textContent = `${percentValue}%`;
      }
    };
    updateTooltip('buy');
    updateTooltip('sell');
  };

  const dragEnd = () => {
    if (draggedHandler) {
      setDragging('');
      const newMin = getDraggedMin();
      const newMax = getDraggedMax();
      if (newMin) props.setMin(newMin);
      if (newMax) props.setMax(newMax);
      translateHandler('buy', 0);
      translateHandler('sell', 0);
      initialPosition = 0;
      draggedHandler = undefined;
    }
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', dragEnd);
  };

  if (!userMarketPrice && isPending) {
    return (
      <div className="flex-1 grid">
        <CarbonLogoLoading className="h-80 place-self-center" />
      </div>
    );
  }

  if (!marketPrice) {
    return (
      <NotFound
        variant="info"
        title="Market Price Unavailable"
        text="Please provide a price."
      />
    );
  }

  return (
    <svg
      id={id}
      className={cn(
        styles.graph,
        dragging,
        'rounded-2xl bg-black/60',
        className,
      )}
      viewBox={viewBox}
      onWheel={updateZoom}
    >
      <g className="title">
        <text
          x={box.width / 2}
          y={y(100) + padding + fontSize}
          fontSize={box.width < 500 ? fontSize - 2 : fontSize}
          textAnchor="middle"
          fill="white"
          fillOpacity="0.8"
        >
          {title}
        </text>
      </g>

      <g className={styles.content}>
        <g className={cn('buy', isValid ? '' : 'hidden')}>
          <polygon
            id="buy-polygon"
            points={getBuyPoint(props, { x, y })}
            fill="url(#svg-buy-gradient)"
            fillOpacity="0.5"
          />
          <polygon
            id="marginal-buy-polygon"
            points={getMarginalBuyPoint(props, { x, y })}
            fill="url(#buy-pattern)"
          />
          <line
            id="buy-max-line"
            x1={x(buy.max)}
            x2={x(buy.max)}
            y1={y(bottom)}
            y2={y(middle)}
            stroke="var(--color-buy)"
            strokeWidth={2}
          />
        </g>
        <g className={cn('sell', isValid ? '' : 'hidden')}>
          <polygon
            id="sell-polygon"
            points={getSellPoint(props, { x, y })}
            fill="url(#svg-sell-gradient)"
            fillOpacity="0.5"
          />
          <polygon
            id="marginal-sell-polygon"
            points={getMarginalSellPoint(props, { x, y })}
            fill="url(#sell-pattern)"
          />
          <line
            id="sell-min-line"
            x1={x(sell.min)}
            x2={x(sell.min)}
            y1={y(middle)}
            y2={y(top)}
            stroke="var(--color-sell)"
            strokeWidth={2}
          />
        </g>
        <g className="price-indicators">
          <line
            stroke={outline}
            x1={0}
            x2={box.width}
            y1={y(bottom)}
            y2={y(bottom)}
          />
          {getSteps(box.width).map((step, i) => (
            <line
              key={`${step}-${i}`}
              stroke={outline}
              x1={step}
              x2={step}
              y1={y(bottom)}
              y2={y(bottom + 3)}
            />
          ))}
          {fullRange && (
            <>
              <text
                x={x(min)}
                y={y(5)}
                fontSize={fontSize}
                dominantBaseline="hanging"
                textAnchor="middle"
                fill="white"
                fillOpacity="0.8"
              >
                0
              </text>
              <text
                x={x(max)}
                y={y(5)}
                fontSize={fontSize}
                dominantBaseline="hanging"
                textAnchor="middle"
                fill="white"
                fillOpacity="0.8"
              >
                ∞
              </text>
            </>
          )}
          {!fullRange &&
            prices.map((price, i) => (
              <text
                key={`${price}-${i}`}
                x={x(price)}
                y={y(5)}
                fontSize={fontSize}
                dominantBaseline="hanging"
                textAnchor="middle"
                fill="white"
                fillOpacity="0.8"
              >
                {prettifySignedNumber(price, { abbreviate: true })}
              </text>
            ))}
        </g>

        {marketPrice && (
          <g
            id="market-price"
            transform={`translate(${x(marketPosition!)}, 0)`}
          >
            <line
              stroke={outline}
              x1={0}
              x2={0}
              y1={y(top + 10)}
              y2={y(bottom)}
              strokeWidth={3}
            />
            <rect
              x={(textWidth(marketPriceText) / 2) * -1 - padding}
              y={y(top + 10) - fontSize / 2 - padding}
              width={textWidth(marketPriceText) + 2 * padding}
              height={fontSize + 2 * padding}
              fill={outline}
              rx="4"
            />
            <text
              x={0}
              y={y(top + 10)}
              fontSize={fontSize}
              dominantBaseline="middle"
              textAnchor="middle"
              fill="white"
            >
              {marketPriceText}
            </text>
          </g>
        )}
        <g
          id="buy-handler"
          className={disabled ? '' : 'cursor-ew-resize'}
          onMouseDown={(e) => dragStart(e, 'buy')}
          onTouchStart={(e) => dragStart(e, 'buy')}
        >
          <g className={styles.handlerTooltip}>
            <rect
              x={
                x(min) +
                (Math.max(textWidth(minText), textWidth(minPercentText)) / 2) *
                  -1 -
                padding
              }
              y={y(top) - 3 * fontSize - 3 * padding}
              width={
                Math.max(textWidth(minText), textWidth(minPercentText)) +
                2 * padding
              }
              height={2 * fontSize + 3 * padding}
              fill={background}
              rx="4"
            />
            <text
              className="tooltip-price"
              x={x(min)}
              y={y(top) - 2 * fontSize - 3 * padding}
              fontSize={fontSize}
              dominantBaseline="middle"
              textAnchor="middle"
              fill="white"
            >
              {minText}
            </text>
            <text
              className="tooltip-percent"
              x={x(min)}
              y={y(top) - 1 * fontSize - 2 * padding}
              fontSize={fontSize}
              dominantBaseline="middle"
              textAnchor="middle"
              fill="white"
              fillOpacity="0.4"
            >
              {minPercentText}
            </text>
          </g>
          {!disabled && (
            <g id="buy-handler-rect" transform="translate(-20, 0)">
              <rect
                x={x(buy.min)}
                y={y(top)}
                width={20}
                height={30}
                fill="url(#svg-buy-gradient)"
                rx="4"
              />
              <rect
                x={x(buy.min) + 7}
                y={y(top) + 10}
                width={1}
                height={10}
                fill="black"
                fillOpacity="0.5"
              />
              <rect
                x={x(buy.min) + 13}
                y={y(top) + 10}
                width={1}
                height={10}
                fill="black"
                fillOpacity="0.5"
              />
            </g>
          )}
          <line
            x1={x(buy.min) - 1}
            x2={x(buy.min) - 1}
            y1={y(top)}
            y2={y(bottom)}
            stroke="var(--color-buy)"
            strokeWidth="3"
          />
        </g>
        <g
          id="sell-handler"
          className={disabled ? '' : 'cursor-ew-resize'}
          onMouseDown={(e) => dragStart(e, 'sell')}
          onTouchStart={(e) => dragStart(e, 'sell')}
        >
          <g className={styles.handlerTooltip}>
            <rect
              x={
                x(max) +
                (Math.max(textWidth(maxText), textWidth(maxPercentText)) / 2) *
                  -1 -
                padding
              }
              y={y(top) - 3 * fontSize - 3 * padding}
              width={
                Math.max(textWidth(maxText), textWidth(maxPercentText)) +
                2 * padding
              }
              height={2 * fontSize + 3 * padding}
              fill={background}
              rx="4"
            />
            <text
              className="tooltip-price"
              x={x(max)}
              y={y(top) - 2 * fontSize - 3 * padding}
              fontSize={fontSize}
              dominantBaseline="middle"
              textAnchor="middle"
              fill="white"
            >
              {maxText}
            </text>
            <text
              className="tooltip-percent"
              x={x(max)}
              y={y(top) - 1 * fontSize - 2 * padding}
              fontSize={fontSize}
              dominantBaseline="middle"
              textAnchor="middle"
              fill="white"
              fillOpacity="0.4"
            >
              {maxPercentText}
            </text>
          </g>
          {!disabled && (
            <g id="sell-handler-rect">
              <rect
                x={x(sell.max)}
                y={y(top)}
                width={20}
                height={30}
                fill="url(#svg-sell-gradient)"
                rx="4"
              />
              <rect
                x={x(sell.max) + 7}
                y={y(top) + 10}
                width={1}
                height={10}
                fill="black"
                fillOpacity="0.5"
              />
              <rect
                x={x(sell.max) + 13}
                y={y(top) + 10}
                width={1}
                height={10}
                fill="black"
                fillOpacity="0.5"
              />
            </g>
          )}
          <line
            x1={x(sell.max) + 1}
            x2={x(sell.max) + 1}
            y1={y(top)}
            y2={y(bottom)}
            stroke="var(--color-sell)"
            strokeWidth="3"
          />
        </g>
      </g>
    </svg>
  );
};
