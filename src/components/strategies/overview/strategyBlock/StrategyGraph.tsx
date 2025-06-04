import { FC, useId } from 'react';
import { BaseStrategy } from 'libs/queries';
import { cn, prettifyNumber, sanitizeNumber } from 'utils/helpers';
import {
  FloatTooltip,
  FloatTooltipContent,
  FloatTooltipTrigger,
} from 'components/common/tooltip/FloatTooltip';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { Token } from 'libs/tokens';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { SafeDecimal } from 'libs/safedecimal';
import {
  isFullRangeStrategy,
  isZero,
} from 'components/strategies/common/utils';
import { isOverlappingStrategy } from 'components/strategies/common/utils';
import { getRoundedSpread } from 'components/strategies/overlapping/utils';
import style from './StrategyGraph.module.css';

interface Props {
  strategy: BaseStrategy;
  className?: string;
}

const isSmallRange = ({ order0, order1 }: BaseStrategy) => {
  const allPrices = new Set([
    order0.startRate,
    order0.endRate,
    order1.startRate,
    order1.endRate,
  ]);
  const prices = Array.from(allPrices).filter((v) => !isZero(v));
  if (prices.length < 2) return false;
  const min = SafeDecimal.min(...prices);
  const max = SafeDecimal.max(...prices);
  return max.sub(min).lt(1);
};

// SVG ratio
const height = 130;
const width = 400;

// Y positions
const baseline = 100; // Line above text
const middle = 75; // Where two polygons can intersect
const top = 50; // End of the polygons
const tick = 87; // Where the ticks end, from baseline
// X positions
const lowest = 10;
const highest = width - 10;

const fontSize = 16;
const fontWidth = fontSize / 2;

export const StrategyGraph: FC<Props> = ({ strategy, className }) => {
  const clipPathId = useId();
  const { base, quote, order0: buyOrder, order1: sellOrder } = strategy;
  const { marketPrice: currentPrice } = useMarketPrice({ base, quote });
  const fullRange = isFullRangeStrategy(buyOrder, sellOrder);

  const buy = {
    from: Number(sanitizeNumber(buyOrder.startRate)),
    to: Number(sanitizeNumber(buyOrder.endRate)),
    marginalPrice: fullRange
      ? Number(sanitizeNumber(sellOrder.endRate))
      : Number(sanitizeNumber(buyOrder.marginalRate)),
  };
  const sell = {
    from: Number(sanitizeNumber(sellOrder.startRate)),
    to: fullRange
      ? Number(sanitizeNumber(buyOrder.endRate))
      : Number(sanitizeNumber(sellOrder.endRate)),
    marginalPrice: fullRange
      ? Number(sanitizeNumber(buyOrder.startRate))
      : Number(sanitizeNumber(sellOrder.marginalRate)),
  };

  const buyOrderExists = buy.from !== 0 && buy.to !== 0;
  const sellOrderExists = sell.from !== 0 && sell.to !== 0;
  const buyOrderIsLimit = buy.from === buy.to;
  const sellOrderIsLimit = sell.from === sell.to;

  const max = Math.max(buy.to, sell.to);
  const min =
    buy.from && sell.from
      ? Math.min(buy.from, sell.from)
      : Math.max(buy.from, sell.from);

  const center = min && max ? (min + max) / 2 : (currentPrice ?? 1000);
  const delta = min !== max ? (max - min) / 2 : center / 30;

  // Graph zoom
  const from = center - delta * 1.25;
  const to = center + delta * 1.25;

  const pricePoints = [
    from + (1 / 4) * (center - from),
    from + (3 / 4) * (center - from),
    to - (3 / 4) * (to - center),
    to - (1 / 4) * (to - center),
  ];
  const smallRange = isSmallRange(strategy);
  const priceIntlOption = {
    abbreviate: true,
    round: !smallRange,
    decimals: smallRange ? 6 : undefined,
  };

  // X position
  const ratio = width / (to - from);
  const x = (value: number) => (value - from) * ratio;

  const buyFromInSell = buy.from < sell.to && buy.from >= sell.from;
  const buyToInSell = buy.to < sell.to && buy.to >= sell.from;
  const sellFromInBuy = sell.from < buy.to && sell.from >= buy.from;
  const sellToInBuy = sell.to <= buy.to && sell.to > buy.from;

  const getBuyPoints = (buyFrom: number, buyTo: number) => {
    if (sellOrderExists) {
      return new Set([
        `${x(buyFrom)},${baseline}`,
        `${x(buyTo)},${baseline}`,
        `${x(buyTo)},${buyToInSell ? middle : top}`,
        `${x(Math.min(buyTo, sell.to))},${buyToInSell ? middle : top}`,
        `${x(Math.min(buyTo, sell.to))},${buyTo < sell.from ? top : middle}`,
        `${x(Math.max(buyFrom, Math.min(buyTo, sell.from)))},${
          buyTo < sell.from ? top : middle
        }`,
        `${x(Math.max(buyFrom, Math.min(buyTo, sell.from)))},${
          sell.from < buyFrom ? middle : top
        }`,
        `${x(buyFrom)},${sell.from < buyFrom ? middle : top}`,
      ]);
    } else {
      return new Set([
        `${x(buyFrom)},${baseline}`,
        `${x(buyFrom)},${top}`,
        `${x(buyTo)},${top}`,
        `${x(buyTo)},${baseline}`,
      ]);
    }
  };

  const getSellPoints = (sellFrom: number, sellTo: number) => {
    if (buyOrderExists) {
      return new Set([
        `${x(sellFrom)},${top}`,
        `${x(sellTo)},${top}`,
        `${x(sellTo)},${buy.to > sellTo ? middle : baseline}`,
        `${x(Math.min(sellTo, Math.max(sellFrom, buy.to)))},${
          buy.to > sellTo ? middle : baseline
        }`,
        `${x(Math.min(sellTo, Math.max(sellFrom, buy.to)))},${
          sellFrom > buy.to ? baseline : middle
        }`,
        `${x(Math.max(sellFrom, buy.from))},${
          sellFrom > buy.to ? baseline : middle
        }`,
        `${x(Math.max(sellFrom, buy.from))},${
          sellFrom < buy.from ? baseline : top
        }`,
        `${x(sellFrom)},${sellFrom < buy.from ? baseline : top}`,
      ]);
    } else {
      return new Set([
        `${x(sellFrom)},${baseline}`,
        `${x(sellFrom)},${top}`,
        `${x(sellTo)},${top}`,
        `${x(sellTo)},${baseline}`,
      ]);
    }
  };

  return (
    <svg
      className={cn(style.strategyGraph, className)}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <clipPath id={clipPathId}>
          <rect x="0" y="0" width={width} height={height}>
            <animate
              attributeName="width"
              values={`0;${width}`}
              dur="1.5s"
              fill="freeze"
            />
          </rect>
        </clipPath>
      </defs>

      <g className={style.axes} stroke="#404040">
        <line x1="0" y1={baseline} x2={width} y2={baseline} />
      </g>

      <CurrentPrice
        position={fullRange ? center : currentPrice}
        currentPrice={currentPrice}
        x={x}
        token={strategy.quote}
      />

      <g className={style.buySellAreas} clipPath={`url(#${clipPathId})`}>
        {buyOrderExists && (
          <FloatTooltip>
            <FloatTooltipTrigger>
              <g className={style.buy} data-testid="polygon-buy">
                <>
                  {!buyOrderIsLimit && (
                    <>
                      <polygon
                        className={style.buyArea}
                        fill="var(--buy)"
                        fillOpacity="0.25"
                        points={Array.from(
                          getBuyPoints(
                            buy.from,
                            buy.marginalPrice >= buy.from &&
                              buy.marginalPrice < buy.to
                              ? buy.marginalPrice
                              : buy.to,
                          ),
                        ).join(' ')}
                      />
                      {buy.marginalPrice < buy.to &&
                        buy.marginalPrice >= buy.from && (
                          <polygon
                            fill="url(#buy-pattern)"
                            points={Array.from(
                              getBuyPoints(buy.marginalPrice, buy.to),
                            ).join(' ')}
                          />
                        )}
                      <line
                        className={style.lineBuySell}
                        stroke="var(--buy)"
                        strokeWidth="2"
                        x1={x(buy.from)}
                        y1={baseline}
                        x2={x(buy.from)}
                        y2={buyFromInSell ? middle : top}
                      />
                      <line
                        className={style.lineBuySell}
                        stroke="var(--buy)"
                        strokeWidth="2"
                        x1={x(buy.to)}
                        y1={baseline}
                        x2={x(buy.to)}
                        y2={buyToInSell ? middle : top}
                      />
                    </>
                  )}
                  {buyOrderIsLimit && (
                    <g className={style.rectBuySell}>
                      <rect
                        x={x(buy.to) - 10}
                        y={top}
                        width="20"
                        height={baseline - top}
                        fill="transparent"
                      />
                      <line
                        stroke="var(--buy)"
                        strokeWidth="2"
                        x1={x(buy.to)}
                        y1={baseline}
                        x2={x(buy.to)}
                        y2={buyToInSell ? middle : top}
                      />
                    </g>
                  )}
                </>
              </g>
            </FloatTooltipTrigger>
            <FloatTooltipContent>
              <OrderTooltip strategy={strategy} buy />
            </FloatTooltipContent>
          </FloatTooltip>
        )}

        {sellOrderExists && (
          <FloatTooltip>
            <FloatTooltipTrigger>
              <g className={style.sell} data-testid="polygon-sell">
                <>
                  {!sellOrderIsLimit && (
                    <>
                      <polygon
                        className={style.sellArea}
                        fill="var(--sell)"
                        fillOpacity="0.25"
                        points={Array.from(
                          getSellPoints(
                            sell.marginalPrice > sell.from &&
                              sell.marginalPrice <= sell.to
                              ? sell.marginalPrice
                              : sell.from,
                            sell.to,
                          ),
                        ).join(' ')}
                      />
                      {sell.marginalPrice <= sell.to &&
                        sell.marginalPrice > sell.from && (
                          <polygon
                            fill="url(#sell-pattern)"
                            points={Array.from(
                              getSellPoints(sell.from, sell.marginalPrice),
                            ).join(' ')}
                          />
                        )}
                      <line
                        className={style.lineBuySell}
                        stroke="var(--sell)"
                        strokeWidth="2"
                        x1={x(sell.from)}
                        x2={x(sell.from)}
                        y1={sellFromInBuy ? middle : baseline}
                        y2={top}
                      />
                      <line
                        className={style.lineBuySell}
                        stroke="var(--sell)"
                        strokeWidth="2"
                        x1={x(sell.to)}
                        x2={x(sell.to)}
                        y1={sellToInBuy ? middle : baseline}
                        y2={top}
                      />
                    </>
                  )}
                  {sellOrderIsLimit && (
                    <g className={style.rectBuySell}>
                      <rect
                        x={x(sell.to) - 10}
                        y={top}
                        width="20"
                        height={baseline - top}
                        fill="transparent"
                      />
                      <line
                        stroke="var(--sell)"
                        strokeWidth="2"
                        x1={x(sell.to)}
                        x2={x(sell.to)}
                        y1={sellToInBuy ? middle : baseline}
                        y2={top}
                      />
                    </g>
                  )}
                </>
              </g>
            </FloatTooltipTrigger>
            <FloatTooltipContent>
              <OrderTooltip strategy={strategy} />
            </FloatTooltipContent>
          </FloatTooltip>
        )}
      </g>
      <g className={style.pricePoints}>
        {fullRange &&
          [min, max].map((point, i) => (
            <g key={i}>
              <line
                x1={x(point)}
                x2={x(point)}
                y1={tick}
                y2={baseline + 5}
                stroke="white"
                opacity="60%"
              />
              <text
                fill="white"
                x={x(point)}
                y={baseline + 10}
                dominantBaseline="hanging"
                textAnchor="middle"
                fontSize={fontSize}
                opacity="60%"
              >
                {point === min ? '0' : '∞'}
              </text>
            </g>
          ))}
        {!fullRange &&
          pricePoints.map((point, i) => (
            <g key={i}>
              <line
                x1={x(point)}
                x2={x(point)}
                y1={tick}
                y2={baseline + 5}
                stroke="white"
                opacity="60%"
              />
              <text
                fill="white"
                x={x(point)}
                y={baseline + 10}
                dominantBaseline="hanging"
                textAnchor="middle"
                fontSize={fontSize}
                opacity="60%"
              >
                {prettifyNumber(point, priceIntlOption)}
              </text>
            </g>
          ))}
      </g>
    </svg>
  );
};

interface CurrentPriceProps {
  position?: number;
  currentPrice?: number;
  token: Token;
  x: (value: number) => number;
}

export const CurrentPrice: FC<CurrentPriceProps> = ({
  currentPrice,
  token,
  x,
  position,
}) => {
  if (!currentPrice || !position) return <></>;
  const price = x(position);
  const tooLow = price < lowest;
  const tooHigh = price > highest;
  const inRange = !tooLow && !tooHigh;
  const prettyPrice = prettifyNumber(currentPrice, { round: true });
  const formattedPrice = `${prettyPrice} ${token.symbol}`;

  // Out of Range
  const maxChar = Math.max(formattedPrice.length, '(off-scale)'.length);
  const outRangeWidth = `${(maxChar + 6) * fontWidth}px`;
  // In Range
  const inRangeWidth = (formattedPrice.length + 4) * fontWidth;
  const baseDelta = inRangeWidth / 2;

  const deltaStart = price - lowest;
  const deltaEnd = highest - price;
  const translateStart = Math.min(baseDelta, deltaStart);
  const translateEnd = Math.max(inRangeWidth / 2 - deltaEnd, 0);
  const translateRect = `translateX(calc(-1px * (${translateStart} + ${translateEnd})))`;

  const getTextAttr = () => {
    if (baseDelta > deltaStart) {
      return {
        x: lowest + fontWidth,
        textAnchor: 'start',
      };
    } else if (baseDelta > deltaEnd) {
      return {
        x: highest - fontWidth,
        textAnchor: 'end',
      };
    } else {
      return {
        x: price,
        textAnchor: 'middle',
      };
    }
  };

  return (
    <g className={style.currentPrice}>
      <path
        className={style.priceLine}
        stroke="#404040"
        strokeWidth="2"
        d={`M ${Math.max(lowest, Math.min(highest, price))} ${baseline} V 25`}
      />
      {tooLow && (
        <>
          <rect
            fill="#404040"
            x={lowest - 1}
            y="6"
            width={outRangeWidth}
            height="36"
            rx="4"
          />
          <text
            fill="white"
            x={lowest + fontWidth}
            y="9"
            dominantBaseline="hanging"
            textAnchor="start"
            fontSize={fontSize}
          >
            {formattedPrice}
          </text>
          <text
            fill="white"
            x={lowest + fontWidth}
            y="26"
            dominantBaseline="hanging"
            textAnchor="start"
            fontSize={fontSize}
          >
            (off-scale)
          </text>
        </>
      )}
      {inRange && (
        <>
          <rect
            fill="#404040"
            x={price}
            y="6"
            width={inRangeWidth}
            height="22"
            rx="4"
            style={{
              transform: translateRect,
            }}
          />
          <text
            fill="white"
            y="12"
            dominantBaseline="hanging"
            fontSize={fontSize}
            {...getTextAttr()}
          >
            {formattedPrice}
          </text>
        </>
      )}
      {tooHigh && (
        <>
          <rect
            fill="#404040"
            x={highest + 1}
            y="6"
            width={outRangeWidth}
            height="36"
            rx="4"
            style={{
              transform: `translateX(-${outRangeWidth})`,
            }}
          />
          <text
            fill="white"
            x={highest - fontWidth}
            y="9"
            dominantBaseline="hanging"
            textAnchor="end"
            fontSize={fontSize}
          >
            {formattedPrice}
          </text>
          <text
            fill="white"
            x={highest - fontWidth}
            y="26"
            dominantBaseline="hanging"
            textAnchor="end"
            fontSize={fontSize}
          >
            (off-scale)
          </text>
        </>
      )}
    </g>
  );
};

interface OrderTooltipProps {
  strategy: BaseStrategy;
  buy?: boolean;
}

const OrderTooltip: FC<OrderTooltipProps> = ({ strategy, buy }) => {
  const order = buy ? strategy.order0 : strategy.order1;
  const { startRate, endRate, marginalRate } = order;
  const limit = startRate === endRate;
  const smallRange = isSmallRange(strategy);
  const spread = isOverlappingStrategy(strategy) && getRoundedSpread(strategy);
  const priceOption = {
    abbreviate: true,
    round: !smallRange,
    decimals: smallRange ? 6 : undefined,
  };
  const fullRange = isFullRangeStrategy(strategy.order0, strategy.order1);
  const startPrice = fullRange ? '0' : prettifyNumber(startRate, priceOption);
  const endPrice = fullRange ? '∞' : prettifyNumber(endRate, priceOption);
  const marginalPrice = prettifyNumber(marginalRate, priceOption);
  const { quote, base } = strategy;
  const color = buy ? 'text-buy' : 'text-sell';
  return (
    <article
      className="text-14 flex flex-col gap-16"
      data-testid="order-tooltip"
    >
      <h3 className={cn('text-16 font-weight-500', color)}>
        {buy ? 'Buy' : 'Sell'} {base.symbol}
      </h3>
      {limit && (
        <table className="rounded-8 border-separate border border-white/40">
          <tbody>
            <tr>
              <th className="font-weight-400 p-8 text-start text-white/60">
                Price
              </th>
              <td className="p-8 text-end" data-testid="price">
                {startPrice} {quote.symbol}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      {!limit && (
        <table className="rounded-8 border-separate border border-white/40 p-8">
          <tbody>
            <tr>
              <th className="font-weight-400 text-start text-white/60">
                Min Price
              </th>
              <td className="text-end" data-testid="min-price">
                {startPrice} {quote.symbol}
              </td>
            </tr>
            <tr>
              <th className="font-weight-400 text-start text-white/60">
                Max Price
              </th>
              <td className="text-end" data-testid="max-price">
                {endPrice} {quote.symbol}
              </td>
            </tr>
            {!!spread && (
              <tr>
                <th className="font-weight-400 text-start text-white/60">
                  Spread
                </th>
                <td className="text-end" data-testid="spread">
                  {spread}%
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <p className="text-white/60">
        Current marginal price is&nbsp;
        <span data-testid="marginal-price">
          {marginalPrice} {quote.symbol}
        </span>
        &nbsp;per 1&nbsp;
        {base.symbol}
      </p>
      <a
        href="https://faq.carbondefi.xyz/trading-strategies/order-dynamics"
        target="_blank"
        rel="noreferrer"
        className="font-weight-500 text-primary inline-flex items-center gap-4"
      >
        <span>Learn more about marginal price</span>
        <IconLink className="inline size-12" />
      </a>
    </article>
  );
};
