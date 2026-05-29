import { FC, useId, useMemo } from 'react';
import { cn, prettifyNumber, sanitizeNumber, tokenAmount } from 'utils/helpers';
import {
  FloatTooltip,
  FloatTooltipContent,
  FloatTooltipTrigger,
} from 'components/common/tooltip/FloatTooltip';
import OpenInNewIcon from 'assets/icons/open_in_new.svg?react';
import { Token } from 'libs/tokens';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { SafeDecimal } from 'libs/safedecimal';
import {
  isGradientStrategy,
  isZero,
  isFullRangeStrategy,
  isOrderInPast,
  isOrderInFuture,
  isEmptyGradientOrder,
} from 'components/strategies/common/utils';
import { isOverlappingStrategy } from 'components/strategies/common/utils';
import { getRoundedSpread } from 'components/strategies/overlapping/utils';
import {
  AnyBaseStrategy,
  BaseStrategy,
  GradientOrder,
  Order,
  StaticOrder,
} from 'components/strategies/common/types';
import { fromUnixUTC } from 'components/simulator/utils';
import { isToday } from 'date-fns';
import { useLocation } from '@tanstack/react-router';
import { gradientMarginalPrice } from 'components/strategies/common/gradient/utils';
import style from './StrategyGraph.module.css';

interface Props {
  strategy: AnyBaseStrategy;
  className?: string;
}

const toMinMax = (order: Order) => {
  if ('min' in order) return order;
  const marginalPrice = gradientMarginalPrice(order);
  return {
    min: marginalPrice,
    max: marginalPrice,
    budget: order.budget,
    marginalPrice: marginalPrice,
  };
};

const isSmallRange = (strategy: AnyBaseStrategy) => {
  const strategyPrices = (() => {
    if (isGradientStrategy(strategy)) {
      const { buy, sell } = strategy;
      return [buy.startPrice, buy.endPrice, sell.startPrice, sell.endPrice];
    } else {
      const { buy, sell } = strategy;
      return [buy.min, buy.max, sell.min, sell.max];
    }
  })();
  const allPrices = new Set(strategyPrices);
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

const fontSize = 15;
const fontWidth = fontSize / 2;

export const StrategyGraph: FC<Props> = ({ strategy, className }) => {
  const clipPathId = useId();
  const { base, quote } = strategy;
  const { marketPrice: currentPrice } = useMarketPrice({ base, quote });

  // Transform gradient strategy into a static strategy
  const buyOrder = toMinMax(strategy.buy);
  const sellOrder = toMinMax(strategy.sell);
  const staticStrategy = { ...strategy, buy: buyOrder, sell: sellOrder };
  const isGradient = isGradientStrategy(strategy);

  const buy = {
    from: Number(sanitizeNumber(buyOrder.min)),
    to: Number(sanitizeNumber(buyOrder.max)),
    marginalPrice: Number(sanitizeNumber(buyOrder.marginalPrice)),
  };
  const sell = {
    from: Number(sanitizeNumber(sellOrder.min)),
    to: Number(sanitizeNumber(sellOrder.max)),
    marginalPrice: Number(sanitizeNumber(sellOrder.marginalPrice)),
  };
  const fullRange = isFullRangeStrategy(base, quote, buyOrder, sellOrder);

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
  const smallRange = isSmallRange(staticStrategy);
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
        <g id="svg-time-icon">
          <path d="M2.9987 0c-.0484.001-.0967.0056-.1446.0137H1.0142C.8817.0118.7501.0363.6272.0857.5042.1351.3923.2085.298.3015.2035.3946.1286.5054.0775.6277.0263.7499 0 .8812 0 1.0137s.0263.2637.0775.386c.0512.1222.1261.2331.2205.3262s.2063.1664.3293.2159c.1229.0494.2545.0739.387.072h1V3.3575c0 1.3255.5262 2.5978 1.4648 3.5351L5.6002 9.0137 3.4791 11.1348c-.9386.9374-1.4648 2.2096-1.4648 3.5351v1.3438h-1c-.1325-.002-.2641.0226-.387.072-.123.0493-.2349.1228-.3293.2158-.0944.093-.1693.2039-.2205.3261-.0512.1222-.0775.2535-.0775.3861 0 .1325.0263.2637.0775.386s.1261.2331.2205.3261c.0944.0932.2063.1665.3293.2158.1229.0495.2545.0739.387.072h1.832c.108.0179.2182.0179.3262 0h7.6739c.108.0179.2182.0179.3262 0h1.8418c.1325.002.2641-.0225.3871-.072.1229-.0494.2349-.1227.3293-.2158.0943-.093.1693-.2038.2204-.3261.0511-.1222.0775-.2535.0775-.386 0-.1326-.0263-.2638-.0775-.3861-.0511-.1223-.1261-.2331-.2204-.3261-.0944-.093-.2063-.1665-.3293-.2158-.123-.0494-.2546-.074-.3871-.072h-1V14.6699c0-1.3254-.5275-2.5978-1.4648-3.5351L8.4283 9.0137l2.1212-2.1211c.938-.938 1.4648-2.2096 1.4648-3.5351V2.0137h1c.1325.0019.2641-.0226.3871-.072.1229-.0494.2349-.1228.3293-.2159.0943-.093.1693-.2039.2204-.3262s.0775-.2534.0775-.386-.0263-.2638-.0775-.386-.1261-.2331-.2204-.3262c-.0944-.093-.2063-.1663-.3293-.2158-.123-.0494-.2546-.074-.3871-.0721h-1.832c-.108-.0179-.2182-.0179-.3262 0H3.1685C3.1124.0043 3.0556-.0003 2.9987 0ZM4.0142 2.0137h6V3.3575c0 .7964-.3149 1.5572-.8789 2.1211L7.0142 7.5996 4.8932 5.4766c-.5634-.5627-.8789-1.3227-.8789-2.1191V2.0137Zm3 8.4141 2.1211 2.1211c.5627.5626.8789 1.3265.8789 2.1211v1.3438h-6V14.6699c0-.7964.3155-1.5565.8789-2.1191l2.1211-2.123Z" />
          <rect x="0" y="0" width="13" height="22" fill="transparent" />
        </g>
      </defs>

      {isGradient && <GradientTime strategy={strategy} />}

      <g className={style.axes} stroke="var(--color-main-600)">
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
                        fill="url(#svg-buy-gradient)"
                        fillOpacity="0.5"
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
                        stroke="var(--color-buy)"
                        strokeWidth="2"
                        x1={x(buy.from)}
                        y1={baseline}
                        x2={x(buy.from)}
                        y2={buyFromInSell ? middle : top}
                      />
                      <line
                        className={style.lineBuySell}
                        stroke="var(--color-buy)"
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
                        stroke="var(--color-buy)"
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
              {isGradient ? (
                <GradientOrderTooltip strategy={strategy} isBuy />
              ) : (
                <StaticOrderTooltip strategy={strategy} isBuy />
              )}
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
                        fill="url(#svg-sell-gradient)"
                        fillOpacity="0.5"
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
                        stroke="var(--color-sell)"
                        strokeWidth="2"
                        x1={x(sell.from)}
                        x2={x(sell.from)}
                        y1={sellFromInBuy ? middle : baseline}
                        y2={top}
                      />
                      <line
                        className={style.lineBuySell}
                        stroke="var(--color-sell)"
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
                        stroke="var(--color-sell)"
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
              {isGradientStrategy(strategy) ? (
                <GradientOrderTooltip strategy={strategy} />
              ) : (
                <StaticOrderTooltip strategy={strategy} />
              )}
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
                stroke="var(--color-main-0)"
                opacity="60%"
              />
              <text
                fill="var(--color-main-0)"
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
                stroke="var(--color-main-0)"
                opacity="60%"
              />
              <text
                fill="var(--color-main-0)"
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
        stroke="var(--color-main-600)"
        strokeWidth="2"
        d={`M ${Math.max(lowest, Math.min(highest, price))} ${baseline} V 25`}
      />
      {tooLow && (
        <>
          <rect
            fill="var(--color-main-600)"
            x={lowest - 1}
            y="6"
            width={outRangeWidth}
            height="36"
            rx="4"
          />
          <text
            fill="var(--color-main-0)"
            x={lowest + fontWidth}
            y="9"
            dominantBaseline="hanging"
            textAnchor="start"
            fontSize={fontSize}
          >
            {formattedPrice}
          </text>
          <text
            fill="var(--color-main-0)"
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
            fill="var(--color-main-600)"
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
            fill="var(--color-main-0)"
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
            fill="var(--color-main-600)"
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
            fill="var(--color-main-0)"
            x={highest - fontWidth}
            y="9"
            dominantBaseline="hanging"
            textAnchor="end"
            fontSize={fontSize}
          >
            {formattedPrice}
          </text>
          <text
            fill="var(--color-main-0)"
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

interface OrderTooltipProps<O extends Order> {
  strategy: BaseStrategy<O>;
  isBuy?: boolean;
}

const StaticOrderTooltip: FC<OrderTooltipProps<StaticOrder>> = ({
  strategy,
  isBuy,
}) => {
  const { quote, base } = strategy;
  const order = isBuy ? strategy.buy : strategy.sell;
  const { min, max } = order;
  const limit = min === max;
  const smallRange = isSmallRange(strategy);
  const spread = isOverlappingStrategy(strategy) && getRoundedSpread(strategy);
  const priceOption = useMemo(
    () => ({
      abbreviate: true,
      round: !smallRange,
      decimals: smallRange ? 6 : undefined,
    }),
    [smallRange],
  );
  const fullRange = isFullRangeStrategy(
    base,
    quote,
    strategy.buy,
    strategy.sell,
  );
  const startPrice = useMemo(() => {
    return fullRange ? '0' : prettifyNumber(min, priceOption);
  }, [fullRange, min, priceOption]);
  const endPrice = useMemo(() => {
    return fullRange ? '∞' : prettifyNumber(max, priceOption);
  }, [fullRange, max, priceOption]);
  const marginalPrice = useMemo(
    () => prettifyNumber(order.marginalPrice, priceOption),
    [order.marginalPrice, priceOption],
  );
  const color = isBuy ? 'text-buy' : 'text-sell';
  return (
    <article
      className="text-14 flex flex-col gap-16"
      data-testid="order-tooltip"
    >
      <h3 className={cn('text-16 font-medium', color)}>
        {isBuy ? 'Buy' : 'Sell'} {base.symbol}
      </h3>
      {limit && (
        <table className="bg-main-900/40 rounded-md border-separate border border-main-0/40">
          <tbody>
            <tr>
              <th className="font-normal p-8 text-start text-main-0/60">
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
        <table className="bg-main-900/40 rounded-md border-separate border border-main-0/40 p-8">
          <tbody>
            <tr>
              <th className="font-normal text-start text-main-0/60">
                Min Price
              </th>
              <td className="text-end" data-testid="min-price">
                {startPrice} {quote.symbol}
              </td>
            </tr>
            <tr>
              <th className="font-normal text-start text-main-0/60">
                Max Price
              </th>
              <td className="text-end" data-testid="max-price">
                {endPrice} {quote.symbol}
              </td>
            </tr>
            {!!spread && (
              <tr>
                <th className="font-normal text-start text-main-0/60">
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
      <p className="text-main-0/60">
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
        className="font-medium text-primary inline-flex items-center gap-4"
      >
        <span>Learn more about marginal price</span>
        <OpenInNewIcon className="inline size-24" />
      </a>
    </article>
  );
};

const GradientOrderTooltip: FC<OrderTooltipProps<GradientOrder>> = ({
  strategy,
  isBuy,
}) => {
  const location = useLocation();
  const order = isBuy ? strategy.buy : strategy.sell;
  const { startDate, endDate } = order;

  const smallRange = isSmallRange(strategy);
  const priceOption = useMemo(
    () => ({
      abbreviate: true,
      round: !smallRange,
      decimals: smallRange ? 6 : undefined,
    }),
    [smallRange],
  );
  const startPrice = useMemo(() => {
    return prettifyNumber(order.startPrice, priceOption);
  }, [order.startPrice, priceOption]);
  const endPrice = useMemo(() => {
    return prettifyNumber(order.endPrice, priceOption);
  }, [order.endPrice, priceOption]);
  const marginalPrice = useMemo(() => {
    const price = gradientMarginalPrice(order);
    return prettifyNumber(price, priceOption);
  }, [order, priceOption]);
  const { quote, base } = strategy;
  const color = isBuy ? 'text-buy' : 'text-sell';
  const startDateText =
    location.pathname.includes('cart') && isToday(fromUnixUTC(startDate))
      ? 'Now'
      : fromUnixUTC(startDate).toLocaleString();

  return (
    <article
      className="text-14 flex flex-col gap-16"
      data-testid="order-tooltip"
    >
      <h3 className={cn('text-16 font-medium', color)}>
        {isBuy ? 'Buy' : 'Sell'} {base.symbol}
      </h3>
      <table className="bg-main-900/40 rounded-md border-separate border border-main-0/40 p-8">
        <tbody>
          <tr>
            <th className="font-normal text-start text-main-0/60">
              Start Price
            </th>
            <td className="text-end" data-testid="start-price">
              {startPrice} {quote.symbol}
            </td>
          </tr>
          <tr>
            <th className="font-normal text-start text-main-0/60">End Price</th>
            <td className="text-end" data-testid="end-price">
              {endPrice} {quote.symbol}
            </td>
          </tr>
          <tr>
            <th className="font-normal text-start text-main-0/60">
              Start Date
            </th>
            <td className="text-end" data-testid="start-date">
              {startDateText}
            </td>
          </tr>
          <tr>
            <th className="font-normal text-start text-main-0/60">End Date</th>
            <td className="text-end" data-testid="end-date">
              {fromUnixUTC(endDate).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="text-main-0/60">
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
        className="font-medium text-primary inline-flex items-center gap-4"
      >
        <span>Learn more about marginal price</span>
        <OpenInNewIcon className="inline size-24" />
      </a>
    </article>
  );
};

interface GradientTimeProps {
  strategy: BaseStrategy<GradientOrder>;
}
const timeFormatter = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});
const GradientTime: FC<GradientTimeProps> = ({ strategy }) => {
  const { base, quote, buy, sell } = strategy;
  const buyExist = !isEmptyGradientOrder(buy) && !isOrderInPast(buy);
  const sellExist = !isEmptyGradientOrder(sell) && !isOrderInPast(sell);
  const buyIsFuture = isOrderInFuture(buy);
  const sellIsFuture = isOrderInFuture(sell);
  const buyStart = useMemo(() => {
    const date = fromUnixUTC(buy.startDate);
    return timeFormatter.format(date);
  }, [buy.startDate]);
  const sellStart = useMemo(() => {
    const date = fromUnixUTC(sell.startDate);
    return timeFormatter.format(date);
  }, [sell.startDate]);
  const buyStartPrice = useMemo(() => {
    return `${tokenAmount(buy.startPrice, quote)} per 1 ${base.symbol}`;
  }, [base.symbol, buy.startPrice, quote]);
  const sellStartPrice = useMemo(() => {
    return `${tokenAmount(sell.startPrice, quote)} per 1 ${base.symbol}`;
  }, [base.symbol, sell.startPrice, quote]);
  return (
    <>
      {buyExist && buyIsFuture && (
        <FloatTooltip>
          <FloatTooltipTrigger>
            <use
              href="#svg-time-icon"
              x={17}
              y={baseline - 30}
              className="fill-buy"
            />
          </FloatTooltipTrigger>
          <FloatTooltipContent className="grid gap-8 max-w-330 p-16 text-12 text-main-0/60">
            <h3 className="text-14 text-buy">Future Auction</h3>
            <p>
              Buy order will begin on {buyStart} at the price of {buyStartPrice}
              .
            </p>
            <a
              href="https://faq.carbondefi.xyz/trading-strategies/order-dynamics"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary inline-flex items-center gap-4"
            >
              <span>Learn more about marginal price</span>
              <OpenInNewIcon className="inline size-24" />
            </a>
          </FloatTooltipContent>
        </FloatTooltip>
      )}
      {sellExist && sellIsFuture && (
        <FloatTooltip>
          <FloatTooltipTrigger>
            <use
              href="#svg-time-icon"
              x={width - 30}
              y={baseline - 30}
              className="fill-sell"
            />
          </FloatTooltipTrigger>
          <FloatTooltipContent className="grid gap-8 max-w-330 p-16 text-12 text-main-0/60">
            <h3 className="text-14 text-sell">Future Auction</h3>
            <p>
              Sell order will begin on {sellStart} at the price of{' '}
              {sellStartPrice}.
            </p>
            <a
              href="https://faq.carbondefi.xyz/trading-strategies/order-dynamics"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary inline-flex items-center gap-4"
            >
              <span>Learn more about marginal price</span>
              <OpenInNewIcon className="inline size-24" />
            </a>
          </FloatTooltipContent>
        </FloatTooltip>
      )}
    </>
  );
};
