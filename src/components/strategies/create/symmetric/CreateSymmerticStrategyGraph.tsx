import {
  FC,
  MouseEvent as ReactMouseEvent,
  WheelEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SymmetricStrategyProps } from './CreateSymmetricStrategy';
import { cn, prettifyNumber } from 'utils/helpers';
import { MarketPricePercentage } from 'components/strategies/marketPriceIndication';
import { ReactComponent as IconCoinGecko } from 'assets/icons/coin-gecko.svg';
import { getSignedMarketPricePercentage } from 'components/strategies/marketPriceIndication/utils';
import { SafeDecimal } from 'libs/safedecimal';
import styles from './CreateSymmerticStrategyGraph.module.css';

interface Props extends SymmetricStrategyProps {
  marketPrice: number;
  marketPricePercentage: MarketPricePercentage;
}

const clamp = (min: number, value: number, max: number) =>
  Math.min(max, Math.max(value, min));

const getBoundaries = (props: Props, zoom: number) => {
  const min = new SafeDecimal(props.order0.min || '0');
  const max = new SafeDecimal(props.order0.max || '0');
  const marketPrice = new SafeDecimal(props.marketPrice);
  const minMean = marketPrice.lt(min) ? marketPrice : min;
  const maxMean = marketPrice.gt(max) ? marketPrice : max;
  const mean = minMean.plus(maxMean).div(2);
  const padding = maxMean.minus(minMean).times(zoom);
  return {
    left: minMean.minus(padding),
    right: maxMean.plus(padding),
    meanLeft: minMean.plus(mean).div(2),
    meanRight: maxMean.plus(mean).div(2),
    mean,
  };
};

interface PointConfig {
  bottom: number;
  middle: number;
  top: number;
  min: number;
  max: number;
  buyMax: number;
  sellMin: number;
  marginalBuy: number;
  marginalSell: number;
}

const getBuyPoint = (config: PointConfig) => {
  const { top, middle, bottom, min, sellMin, marginalBuy } = config;
  if (marginalBuy <= min) return '';
  const max = Math.min(sellMin, marginalBuy);
  return [
    [min, top].join(','),
    [marginalBuy, top].join(','),
    [marginalBuy, middle].join(','),
    [max, middle].join(','),
    [max, bottom].join(','),
    [min, bottom].join(','),
  ].join(' ');
};

const getMarginalBuyPoint = (config: PointConfig) => {
  const { top, middle, bottom, buyMax, sellMin, marginalBuy } = config;
  if (marginalBuy >= buyMax) return '';
  if (marginalBuy >= sellMin) {
    return [
      [marginalBuy, top],
      [buyMax, top].join(','),
      [buyMax, middle].join(','),
      [marginalBuy, middle].join(','),
    ].join(' ');
  } else {
    return [
      [marginalBuy, top],
      [buyMax, top].join(','),
      [buyMax, middle].join(','),
      [sellMin, middle].join(','),
      [sellMin, bottom].join(','),
      [marginalBuy, bottom].join(','),
    ].join(' ');
  }
};

const getSellPoint = (config: PointConfig) => {
  const { top, middle, bottom, max, buyMax, marginalSell } = config;
  if (marginalSell >= max) return '';
  const min = Math.max(buyMax, marginalSell);
  return [
    [min, top].join(','),
    [max, top].join(','),
    [max, bottom].join(','),
    [marginalSell, bottom].join(','),
    [marginalSell, middle].join(','),
    [min, middle].join(','),
  ].join(' ');
};

const getMarginalSellPoint = (config: PointConfig) => {
  const { top, middle, bottom, buyMax, sellMin, marginalSell } = config;
  if (marginalSell <= sellMin) return '';
  if (marginalSell <= buyMax) {
    return [
      [sellMin, bottom].join(','),
      [sellMin, middle].join(','),
      [marginalSell, middle].join(','),
      [marginalSell, bottom].join(','),
    ].join(' ');
  }
  return [
    [sellMin, bottom].join(','),
    [sellMin, middle].join(','),
    [buyMax, middle].join(','),
    [buyMax, top].join(','),
    [marginalSell, top].join(','),
    [marginalSell, bottom].join(','),
  ].join(' ');
};

export const CreateSymmerticStrategyGraph: FC<Props> = (props) => {
  const svg = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(0.4);
  const [dragging, setDragging] = useState('');
  const { marketPrice, quote, order0, spreadPPM } = props;
  const { left, right, mean, meanLeft, meanRight } = getBoundaries(props, zoom);

  const baseWidth = right.minus(left);
  const width = baseWidth.toNumber();
  const ratio = width / 400;
  const height = 265 * ratio;
  const fontSize = 11 * ratio;

  ////////////////
  // Price line //
  ////////////////
  const bottom = height - 28 * ratio;
  const priceStep = right.minus(left).div(40);
  const priceStepHeight = bottom - 10 * ratio;
  const steps = new Array(40)
    .fill(null)
    .map((_, i) => left.plus(priceStep.times(i)).toString());

  const priceIndicator = {
    y: bottom + 10 * ratio,
    fontSize: fontSize,
    dominantBaseline: 'hanging',
    textAnchor: 'middle',
    fill: 'white',
    fillOpacity: 0.6,
  };

  const middle = bottom - 62 * ratio;
  const top = middle - 62 * ratio;

  //////////////////
  // Market price //
  //////////////////
  const marketValue = `${prettifyNumber(marketPrice)} ${quote?.symbol}`;
  const fontRatio = fontSize / 2;
  const padding = 4 * ratio;
  const rectWidth = marketValue.length * fontRatio + 5 * padding;
  const rectHeight = fontSize + 3 * padding;
  const rectLeft = marketPrice - rectWidth / 2;
  const rectTop = bottom - (172 + 16) * ratio;
  const marketIndicator = {
    line: {
      x1: marketPrice,
      x2: marketPrice,
      y1: bottom,
      y2: bottom - 172 * ratio,
    },
    rect: {
      x: rectLeft,
      y: rectTop,
      width: rectWidth,
      height: rectHeight,
      rx: 4 * ratio,
    },
    text: {
      x: marketPrice,
      y: rectTop + rectHeight / 2,
      fontSize,
      textAnchor: 'middle',
      dominantBaseline: 'middle',
    },
  };

  //////////////
  // Polygons //
  //////////////
  const getPointConfig = ({ min, max }: { min: number; max: number }) => {
    const spread = ((max - min) * spreadPPM) / 100;
    const buyMax = max - spread;
    const sellMin = min + spread;
    const marginalBuy = Math.min(marketPrice - spread / 2, buyMax);
    const marginalSell = Math.max(marketPrice + spread / 2, sellMin);
    return {
      top,
      middle,
      bottom,
      min,
      max,
      buyMax,
      sellMin,
      marginalBuy: Math.max(marginalBuy, min),
      marginalSell: Math.min(marginalSell, max),
    };
  };
  const config = getPointConfig({
    min: Number(order0.min),
    max: Number(order0.max),
  });
  const { min, max, sellMin, buyMax } = config;
  const marketPercent = props.marketPricePercentage;
  const minValue = prettifyNumber(min);
  const minPercent = getSignedMarketPricePercentage(marketPercent.min);
  const maxValue = prettifyNumber(max);
  const maxPercent = getSignedMarketPricePercentage(marketPercent.max);

  const buyPoints = getBuyPoint(config);
  const marginalBuyPoints = getMarginalBuyPoint(config);
  const sellPoints = getSellPoint(config);
  const marginalSellPoints = getMarginalSellPoint(config);

  /////////////
  // TOOLTIP //
  /////////////
  const buyTooltipTextLength = Math.max(minValue.length, minPercent.length + 1);
  const buyTooltipWidth = buyTooltipTextLength * fontRatio + 4 * padding;
  const buyTooltip = {
    rect: {
      x: min - buyTooltipWidth / 2,
      y: top - 3 * fontSize - 4 * padding,
      width: buyTooltipWidth,
      height: 2 * fontSize + 4 * padding,
      fill: '#212123',
      rx: 4 * ratio,
    },
    text: {
      x: min,
      fontSize: fontSize,
      fill: 'white',
      textAnchor: 'middle',
    },
  };

  const sellTooltipTextLength = Math.max(
    maxValue.length,
    maxPercent.length + 1
  );
  const sellTooltipWidth = sellTooltipTextLength * fontRatio + 4 * padding;
  const sellTooltip = {
    rect: {
      x: max - sellTooltipWidth / 2,
      y: top - 3 * fontSize - 4 * padding,
      width: sellTooltipWidth,
      height: 2 * fontSize + 4 * padding,
      fill: '#212123',
      rx: 4 * ratio,
    },
    text: {
      x: max,
      fontSize: fontSize,
      fill: 'white',
      textAnchor: 'middle',
    },
  };

  ///////////////
  // Draggable //
  ///////////////

  let draggedHandler: 'buy' | 'sell' | undefined;
  let initialPosition = 0;
  const distance = max - min;

  const getDelta = (e: MouseEvent) => {
    return (e.clientX - initialPosition) * ratio;
  };

  const translateHandler = (mode: 'buy' | 'sell', x: number) => {
    const g = document.getElementById(`${mode}-handler`);
    g?.style.setProperty('transform', `translateX(${x}px)`);
  };

  const updatePoints = {
    'buy-polygon': getBuyPoint,
    'marginal-buy-polygon': getMarginalBuyPoint,
    'sell-polygon': getSellPoint,
    'marginal-sell-polygon': getMarginalSellPoint,
  };

  // Get new min & max based on current handler
  const updateMinMax = (e: MouseEvent) => {
    const delta = getDelta(e);
    const lowest = Math.max(0, left.toNumber());
    if (draggedHandler === 'buy') {
      return {
        newMin: clamp(lowest, min + delta, max),
        newMax: clamp(max, max + delta - distance, right.toNumber()),
      };
    } else {
      return {
        newMin: clamp(lowest, min + delta + distance, min),
        newMax: clamp(min, max + delta, right.toNumber()),
      };
    }
  };

  const dragStart = (e: ReactMouseEvent, mode: 'buy' | 'sell') => {
    initialPosition = e.clientX;
    draggedHandler = mode;
    setDragging(styles.drag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
  };

  const drag = (e: MouseEvent) => {
    e.preventDefault();
    if (!draggedHandler) return;
    const { newMin, newMax } = updateMinMax(e);

    // Translate handlers
    translateHandler('buy', newMin - min);
    translateHandler('sell', newMax - max);

    // Update points
    const config = getPointConfig({ min: newMin, max: newMax });
    for (const [id, update] of Object.entries(updatePoints)) {
      document.getElementById(id)?.setAttribute('points', update(config));
    }

    // Update lines
    const buyMaxLine = document.getElementById('buy-max-line');
    buyMaxLine?.setAttribute('x1', config.buyMax.toString());
    buyMaxLine?.setAttribute('x2', config.buyMax.toString());
    const sellMinLine = document.getElementById('sell-min-line');
    sellMinLine?.setAttribute('x1', config.sellMin.toString());
    sellMinLine?.setAttribute('x2', config.sellMin.toString());

    // Update tooltip
    const priceSelector = `#${draggedHandler}-handler .tooltip-price`;
    const tooltipPrice = document.querySelector(priceSelector);
    const priceValue = draggedHandler === 'buy' ? newMin : newMax;
    if (tooltipPrice) tooltipPrice.textContent = prettifyNumber(priceValue);
    const percentSelector = `#${draggedHandler}-handler .tooltip-percent`;
    const tooltipPercent = document.querySelector(percentSelector);
    const percentValue = getSignedMarketPricePercentage(
      new SafeDecimal((100 * (priceValue - marketPrice)) / marketPrice)
    );
    if (tooltipPercent) tooltipPercent.textContent = `${percentValue}%`;
  };

  const dragEnd = (e: MouseEvent) => {
    if (draggedHandler) {
      setDragging('');
      const { newMin, newMax } = updateMinMax(e);
      order0.setMin(newMin.toString());
      order0.setMax(newMax.toString());
      translateHandler('buy', 0);
      translateHandler('sell', 0);
      initialPosition = 0;
      draggedHandler = undefined;
    }
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', dragEnd);
  };

  //////////////
  // Zoomable //
  //////////////

  const onWheel = (e: WheelEvent) => {
    if (!e.deltaY) return;
    const delta = e.deltaY / (10 * Math.abs(e.deltaY));
    const value = clamp(0.2, zoom + delta, 0.8);
    setZoom(value);
  };
  // onWheel doesn't support preventDefault as it's a passive event.
  // We need to add active listener on prevent Default
  // But we still need to set the update zoom with react's onWheel event for some reason
  useEffect(() => {
    const ref = svg.current;
    const handler = (e: Event) => e.preventDefault();
    ref?.addEventListener('wheel', handler, { passive: false });
    return () => ref?.removeEventListener('wheel', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <figure className="relative">
      <figcaption className="absolute inset-x-0 top-0 flex items-center justify-center gap-4 p-16 font-mono text-10 text-white/60">
        <span>Market price provided by CoinGecko</span>
        <IconCoinGecko className="h-8 w-8" />
        <span role="separator">·</span>
        <span>Spead {spreadPPM}%</span>
      </figcaption>
      <svg
        ref={svg}
        aria-label="Price range"
        aria-description="Interactive graph to select the price range"
        className={cn(
          styles.graph,
          dragging,
          'aspect-[400/265] w-full rounded bg-black font-mono'
        )}
        viewBox={`${left} 0 ${width} ${height}`}
        onWheel={onWheel}
      >
        {/* Pattern */}
        <defs>
          <symbol
            id="carbonLogo"
            width={8 * ratio}
            height={8 * ratio}
            viewBox="0 0 672 886"
            fill="dark"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M236.253 0.40625H543.432L590.851 151.443L516.258 259.817L671.892 562.311L597.058 641.054L667.572 865.583H3.43463L31.0508 642.298L0.482422 563.705L34.4791 195.043H66.9848L73.1824 56.3078L236.253 0.40625ZM86.5195 195.043H130.749L109.676 572.069H24.6749L51.0225 639.81L25.5123 846.068H329.049L339.284 534.202L265.803 380.763L236.207 259.029H361.697L442.063 641.054H597.058L671.892 562.311H526.547L404.627 204.8H488.529L516.258 259.817L590.851 151.443H273.103L240.312 19.9215L92.085 70.458L86.5195 195.043Z"
              opacity="0.4"
            />
          </symbol>
          <pattern
            id="base-pattern"
            width={15 * ratio}
            height={25 * ratio}
            patternUnits="userSpaceOnUse"
          />
          <pattern href="#base-pattern" id="buy-pattern">
            <use href="#carbonLogo" x="0" y={4 * ratio} fill="#00B578" />
            <use
              href="#carbonLogo"
              x={8 * ratio}
              y={16 * ratio}
              fill="#00B578"
            />
            <rect
              x="0"
              y="0"
              width={15 * ratio}
              height={25 * ratio}
              fill="#00B578"
              fillOpacity="0.05"
            />
          </pattern>
          <pattern href="#base-pattern" id="sell-pattern">
            <use href="#carbonLogo" x="0" y={4 * ratio} fill="#D86371" />
            <use
              href="#carbonLogo"
              x={8 * ratio}
              y={16 * ratio}
              fill="#D86371"
            />
            <rect
              x="0"
              y="0"
              width={15 * ratio}
              height={25 * ratio}
              fill="#D86371"
              fillOpacity="0.05"
            />
          </pattern>
        </defs>

        <g className={styles.content}>
          {/* Buy */}
          <g>
            <polygon
              id="buy-polygon"
              points={buyPoints}
              fill="#00B578"
              fillOpacity="0.35"
            />
            <polygon
              id="marginal-buy-polygon"
              points={marginalBuyPoints}
              fill="url(#buy-pattern)"
            />
            <line
              id="buy-max-line"
              x1={buyMax}
              x2={buyMax}
              y1={middle}
              y2={top}
              stroke="#00B578"
              strokeWidth={2 * ratio}
            />
          </g>

          {/* Sell */}
          <g>
            <line
              id="sell-min-line"
              x1={sellMin}
              x2={sellMin}
              y1={bottom}
              y2={middle}
              stroke="#D86371"
              strokeWidth={2 * ratio}
            />
            <polygon
              id="sell-polygon"
              points={sellPoints}
              fill="#D86371"
              fillOpacity="0.35"
            />
            <polygon
              id="marginal-sell-polygon"
              points={marginalSellPoints}
              fill="url(#sell-pattern)"
            />
          </g>
          {/* Price line */}
          <g>
            <line
              x1={left.toString()}
              x2={right.toString()}
              y1={bottom}
              y2={bottom}
              stroke="#212123"
              strokeWidth={ratio}
            />
            {steps.map((step) => (
              <line
                key={step}
                x1={step}
                x2={step}
                y1={bottom}
                y2={priceStepHeight}
                stroke="#212123"
                strokeWidth={ratio}
              />
            ))}
            <text x={meanLeft.toString()} {...priceIndicator}>
              {prettifyNumber(meanLeft)}
            </text>
            <text x={mean.toString()} {...priceIndicator}>
              {prettifyNumber(mean)}
            </text>
            <text x={meanRight.toString()} {...priceIndicator}>
              {prettifyNumber(meanRight)}
            </text>
          </g>
          {/* Market Price */}
          <g>
            <line
              {...marketIndicator.line}
              stroke="#404040"
              strokeWidth={ratio}
            />
            <rect {...marketIndicator.rect} fill="#404040" />
            <text {...marketIndicator.text} fill="white">
              {marketValue}
            </text>
          </g>

          {/* Handlers: must be at the end to always be above the graph */}
          <g
            id="buy-handler"
            className={cn(styles.handler, 'cursor-ew-resize')}
            onMouseDown={(e) => dragStart(e, 'buy')}
          >
            <g className={styles.handlerTooltip}>
              <rect {...buyTooltip.rect} />
              <text
                className="tooltip-price"
                y={top - 2 * fontSize - 3 * padding}
                {...buyTooltip.text}
              >
                {minValue}
              </text>
              <text
                className="tooltip-percent"
                y={top - 1 * fontSize - 2 * padding}
                fillOpacity="0.4"
                {...buyTooltip.text}
              >
                {minPercent}%
              </text>
            </g>
            <rect
              x={min - 11 * ratio}
              y={top - 1 * ratio}
              width={12 * ratio}
              height={24 * ratio}
              fill="#00B578"
              rx={4 * ratio}
            />
            <line
              x1={min - 7 * ratio}
              x2={min - 7 * ratio}
              y1={top + 19 * ratio}
              y2={top + 4 * ratio}
              stroke="black"
              strokeOpacity="0.5"
              strokeWidth={ratio}
            />
            <line
              x1={min - 3 * ratio}
              x2={min - 3 * ratio}
              y1={top + 19 * ratio}
              y2={top + 4 * ratio}
              stroke="black"
              strokeOpacity="0.5"
              strokeWidth={ratio}
            />
            <line
              x1={min}
              x2={min}
              y1={bottom}
              y2={top + 20 * ratio}
              stroke="#00B578"
              strokeWidth={2 * ratio}
            />
          </g>
          <g
            id="sell-handler"
            className={cn(styles.handler, 'cursor-ew-resize')}
            onMouseDown={(e) => dragStart(e, 'sell')}
          >
            <g className={styles.handlerTooltip}>
              <rect {...sellTooltip.rect} />
              <text
                className="tooltip-price"
                y={top - 2 * fontSize - 3 * padding}
                {...sellTooltip.text}
              >
                {maxValue}
              </text>
              <text
                className="tooltip-percent"
                y={top - 1 * fontSize - 2 * padding}
                fillOpacity="0.4"
                {...sellTooltip.text}
              >
                {maxPercent}%
              </text>
            </g>
            <rect
              x={max - 1 * ratio}
              y={top - 1 * ratio}
              width={12 * ratio}
              height={24 * ratio}
              fill="#D86371"
              rx={4 * ratio}
            />
            <line
              x1={max + 7 * ratio}
              x2={max + 7 * ratio}
              y1={top + 19 * ratio}
              y2={top + 4 * ratio}
              stroke="black"
              strokeOpacity="0.5"
              strokeWidth={ratio}
            />
            <line
              x1={max + 3 * ratio}
              x2={max + 3 * ratio}
              y1={top + 19 * ratio}
              y2={top + 4 * ratio}
              stroke="black"
              strokeOpacity="0.5"
              strokeWidth={ratio}
            />
            <line
              x1={max}
              x2={max}
              y1={bottom}
              y2={top + 20 * ratio}
              stroke="#D86371"
              strokeWidth={2 * ratio}
            />
          </g>
        </g>
      </svg>
    </figure>
  );
};
