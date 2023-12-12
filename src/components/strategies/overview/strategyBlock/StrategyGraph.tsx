import { FC } from 'react';
import { Strategy } from 'libs/queries';
import { cn, prettifyNumber, sanitizeNumberInput } from 'utils/helpers';
import {
  FloatTooltip,
  FloatTooltipContent,
  FloatTooltipTrigger,
} from 'components/common/tooltip/FloatTooltip';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import style from './StrategyGraph.module.css';
import { useCompareTokenPrice } from 'libs/queries/extApi/tokenPrice';
import { Token } from 'libs/tokens';

interface Props {
  strategy: Strategy;
}

// SVG ratio
const height = 130;
const width = 400;

// Y positions
const baseline = 100; // Line above text
const middle = 75; // Where two polygons can intersect
const top = 50; // End of the polygons
const tick = 87; // Where the ticks end, from baseline
const step = width / 30;
const steps = Array(30)
  .fill(null)
  .map((_, i) => i * step);

export const StrategyGraph: FC<Props> = ({ strategy }) => {
  const buyOrder = strategy.order0;
  const sellOrder = strategy.order1;
  const currentPrice = useCompareTokenPrice(
    strategy.base.address,
    strategy.quote.address
  );

  const buy = {
    from: Number(sanitizeNumberInput(buyOrder.startRate)),
    to: Number(sanitizeNumberInput(buyOrder.endRate)),
    marginalPrice: Number(sanitizeNumberInput(buyOrder.marginalRate)),
  };
  const sell = {
    from: Number(sanitizeNumberInput(sellOrder.startRate)),
    to: Number(sanitizeNumberInput(sellOrder.endRate)),
    marginalPrice: Number(sanitizeNumberInput(sellOrder.marginalRate)),
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

  const hasSpan = min && max && min !== max;
  const center = hasSpan ? (min + max) / 2 : currentPrice ?? 1000;
  const delta = hasSpan ? (max - min) / 2 : center * 1.5;

  // Graph zoom
  const from = center - delta * 1.25;
  const to = center + delta * 1.25;

  const pricePoints = [
    from + (1 / 3) * (center - from),
    from + (2 / 3) * (center - from),
    center,
    to - (2 / 3) * (to - center),
    to - (1 / 3) * (to - center),
  ];

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
      className={style.strategyGraph}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <symbol
          id="carbonLogo"
          width="8"
          height="8"
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
          width="15"
          height="25"
          patternUnits="userSpaceOnUse"
        />
        <pattern href="#base-pattern" id="buy-pattern">
          <use href="#carbonLogo" x="0" y="4" fill="#00B578" />
          <use href="#carbonLogo" x="8" y="16" fill="#00B578" />
          <rect
            x="0"
            y="0"
            width="15"
            height="25"
            fill="#00B578"
            fillOpacity="0.05"
          />
        </pattern>
        <pattern href="#base-pattern" id="sell-pattern">
          <use href="#carbonLogo" x="0" y="4" fill="#D86371" />
          <use href="#carbonLogo" x="8" y="16" fill="#D86371" />
          <rect
            x="0"
            y="0"
            width="15"
            height="25"
            fill="#D86371"
            fillOpacity="0.05"
          />
        </pattern>
        <clipPath id="left-to-right">
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
        {steps.map((x) => (
          <line key={x} x1={x} y1={baseline} x2={x} y2={tick} />
        ))}
      </g>

      <CurrentPrice currentPrice={currentPrice} x={x} token={strategy.quote} />

      <g className={style.buySellAreas} clipPath="url(#left-to-right)">
        {buyOrderExists && (
          <FloatTooltip>
            <FloatTooltipTrigger>
              <g className={style.buy} data-testid="polygon-buy">
                <>
                  {!buyOrderIsLimit && (
                    <>
                      <polygon
                        className={style.buyArea}
                        fill="#00B578"
                        fillOpacity="0.25"
                        points={Array.from(
                          getBuyPoints(
                            buy.from,
                            buy.marginalPrice >= buy.from &&
                              buy.marginalPrice < buy.to
                              ? buy.marginalPrice
                              : buy.to
                          )
                        ).join(' ')}
                      />
                      {buy.marginalPrice < buy.to &&
                        buy.marginalPrice >= buy.from && (
                          <polygon
                            fill="url(#buy-pattern)"
                            points={Array.from(
                              getBuyPoints(buy.marginalPrice, buy.to)
                            ).join(' ')}
                          />
                        )}
                      <line
                        className={style.lineBuySell}
                        stroke="#00B578"
                        strokeWidth="2"
                        x1={x(buy.from)}
                        y1={baseline}
                        x2={x(buy.from)}
                        y2={buyFromInSell ? middle : top}
                      />
                      <line
                        className={style.lineBuySell}
                        stroke="#00B578"
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
                        stroke="#00B578"
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
                        fill="#D86371"
                        fillOpacity="0.25"
                        points={Array.from(
                          getSellPoints(
                            sell.marginalPrice > sell.from &&
                              sell.marginalPrice <= sell.to
                              ? sell.marginalPrice
                              : sell.from,
                            sell.to
                          )
                        ).join(' ')}
                      />
                      {sell.marginalPrice <= sell.to &&
                        sell.marginalPrice > sell.from && (
                          <polygon
                            fill="url(#sell-pattern)"
                            points={Array.from(
                              getSellPoints(sell.from, sell.marginalPrice)
                            ).join(' ')}
                          />
                        )}
                      <line
                        className={style.lineBuySell}
                        stroke="#D86371"
                        strokeWidth="2"
                        x1={x(sell.from)}
                        x2={x(sell.from)}
                        y1={sellFromInBuy ? middle : baseline}
                        y2={top}
                      />
                      <line
                        className={style.lineBuySell}
                        stroke="#D86371"
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
                        stroke="#D86371"
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
        {pricePoints.map((point, i) => (
          <text
            key={i}
            fill="white"
            x={x(point)}
            y={baseline + 10}
            dominantBaseline="hanging"
            textAnchor="middle"
            fontSize="12"
            opacity="60%"
          >
            {prettifyNumber(point, { abbreviate: true, round: true })}
          </text>
        ))}
      </g>
    </svg>
  );
};

interface CurrentPriceProps {
  currentPrice?: number;
  token: Token;
  x: (value: number) => number;
}

export const CurrentPrice: FC<CurrentPriceProps> = ({
  currentPrice,
  token,
  x,
}) => {
  if (!currentPrice) return <></>;
  const price = x(currentPrice);
  const tooLow = price < steps[1];
  const tooHigh = price > steps[steps.length - 1];
  const inRange = !tooLow && !tooHigh;
  const prettyPrice = prettifyNumber(currentPrice, { round: true });
  const formattedPrice = `${prettyPrice} ${token.symbol}`;

  // Out of Range
  const maxChar = Math.max(formattedPrice.length, '(off-scale)'.length);
  const outRangeWidth = `${maxChar + 2}ch`;
  // In Range
  const inRangeWidth = `${formattedPrice.length + 2}ch`;
  const baseDelta = `${(formattedPrice.length + 2) / 2}ch`; // 6ch

  const deltaStart = price - steps[1];
  const deltaEnd = steps[steps.length - 1] - price;
  const translateStart = `min(${baseDelta}, ${deltaStart}px)`;
  const translateEnd = `max((${inRangeWidth}  / 2) - ${deltaEnd}px, 0px)`;
  const translateRect = `translateX(calc(-1 * (${translateStart} + ${translateEnd})))`;
  const translateText = `translateX(calc(-1 * (${translateStart} + ${translateEnd} - 1.5ch)))`;

  return (
    <g className={style.currentPrice}>
      <path
        className={style.priceLine}
        stroke="#404040"
        strokeWidth="2"
        d={`M ${Math.max(
          steps[1],
          Math.min(steps[steps.length - 1], price)
        )} ${baseline} V 25`}
      />
      {tooLow && (
        <>
          <rect
            fill="#404040"
            x={steps[1] - 1}
            y="6"
            width={outRangeWidth}
            height="36"
            rx="4"
          />
          <text
            fill="white"
            x={steps[1]}
            y="13"
            dominantBaseline="hanging"
            textAnchor="start"
            fontSize="12"
            style={{
              transform: `translateX(1ch)`,
            }}
          >
            {formattedPrice}
          </text>
          <text
            fill="white"
            x={steps[1]}
            y="28"
            dominantBaseline="hanging"
            textAnchor="start"
            fontSize="12"
            style={{
              transform: `translateX(1ch)`,
            }}
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
            height="20"
            rx="4"
            style={{
              transform: translateRect,
            }}
          />
          <text
            fill="white"
            x={price}
            y="13"
            dominantBaseline="hanging"
            textAnchor="start"
            fontSize="12"
            style={{
              transform: translateText,
            }}
          >
            {formattedPrice}
          </text>
        </>
      )}
      {tooHigh && (
        <>
          <rect
            fill="#404040"
            x={steps[steps.length - 1] + 1}
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
            x={steps[steps.length - 1]}
            y="13"
            dominantBaseline="hanging"
            textAnchor="end"
            fontSize="12"
            style={{
              transform: `translateX(-1ch)`,
            }}
          >
            {formattedPrice}
          </text>
          <text
            fill="white"
            x={steps[steps.length - 1]}
            y="28"
            dominantBaseline="hanging"
            textAnchor="end"
            fontSize="12"
            style={{
              transform: `translateX(-1ch)`,
            }}
          >
            (off-scale)
          </text>
        </>
      )}
    </g>
  );
};

interface OrderTooltipProps {
  strategy: Strategy;
  buy?: boolean;
}

const OrderTooltip: FC<OrderTooltipProps> = ({ strategy, buy }) => {
  const order = buy ? strategy.order0 : strategy.order1;
  const limit = order.startRate === order.endRate;
  const priceOption = {
    abbreviate: order.endRate.length > 10,
    round: true,
  };
  const startPrice = prettifyNumber(order.startRate, priceOption);
  const endPrice = prettifyNumber(order.endRate, priceOption);
  const marginalPrice = prettifyNumber(order.marginalRate, priceOption);
  const { quote, base } = strategy;
  const color = buy ? 'text-green' : 'text-red';
  return (
    <article
      className="flex flex-col gap-16 text-12"
      data-testid="order-tooltip"
    >
      <h3 className={cn('text-16 font-weight-500', color)}>
        {buy ? 'Buy' : 'Sell'} {base.symbol}
      </h3>
      {limit && (
        <table className="border-separate rounded-8 border border-white/40">
          <tbody>
            <tr>
              <th className="p-8 text-start font-weight-400 text-white/60">
                Price
              </th>
              <td className="p-8 text-end">
                {startPrice} {quote.symbol}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      {!limit && (
        <table className="border-separate rounded-8 border border-white/40">
          <tbody>
            <tr>
              <th className="p-8 pb-4 text-start font-weight-400 text-white/60">
                Min Price
              </th>
              <td className="p-8 pb-4 text-end" data-testid="min-price">
                {startPrice} {quote.symbol}
              </td>
            </tr>
            <tr>
              <th className="p-8 pt-4 text-start font-weight-400 text-white/60">
                Max Price
              </th>
              <td className="p-8 pt-4 text-end" data-testid="max-price">
                {endPrice} {quote.symbol}
              </td>
            </tr>
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
        className="inline-flex items-center gap-4 font-weight-500 text-green"
      >
        <span>Learn more about marginal price</span>
        <IconLink className="inline h-12 w-12" />
      </a>
    </article>
  );
};
