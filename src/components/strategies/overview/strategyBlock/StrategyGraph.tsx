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

interface Props {
  strategy: Strategy;
}

export const StrategyGraph: FC<Props> = ({ strategy }) => {
  // SVG ratio
  const height = 130;
  const width = 400;

  // Y positions
  const baseline = 100; // Line above text
  const middle = 75; // Where two polygons can intersect
  const top = 50; // End of the polygons
  const tick = 87; // Where the ticks end, from baseline

  const buyOrder = strategy.order0;
  const sellOrder = strategy.order1;

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

  const buyOrderExists: boolean = buy.from !== 0 && buy.to !== 0;
  const sellOrderExists: boolean = sell.from !== 0 && sell.to !== 0;
  const buyOrderIsLimit: boolean = buy.from === buy.to;
  const sellOrderIsLimit: boolean = sell.from === sell.to;

  const center =
    !buyOrderExists && !sellOrderExists
      ? 1000 // TODO: Replace with currentPrice
      : ((sellOrderExists ? sell.to : buy.to) +
          (buyOrderExists ? buy.from : sell.from)) /
        2;

  const delta =
    (!buyOrderExists && !sellOrderExists) ||
    (!buyOrderExists && sellOrderIsLimit) ||
    (!sellOrderExists && buyOrderIsLimit)
      ? center * 1.5
      : ((sellOrderExists ? sell.to : buy.to) -
          (buyOrderExists ? buy.from : sell.from)) /
        2;

  // TODO: Change to the real value
  const currentPrice = center;

  // Graph zoom
  const from = center - delta * 1.25;
  const to = center + delta * 1.25;
  const ratio = width / (to - from);
  const step = width / 30;
  const steps = Array(30)
    .fill(null)
    .map((_, i) => i * step);

  // X position
  const x = (value: number) => (value - from) * ratio;

  const currentPriceTooLow = x(currentPrice) < steps[1];
  const currentPriceTooHigh = x(currentPrice) > steps[steps.length - 1];

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

  const prettyPrice = prettifyNumber(currentPrice, { round: true });
  const formattedPrice = `${prettyPrice} ${strategy.quote.symbol}`;
  const maxChar = Math.max(formattedPrice.length, 'Out of Range'.length);
  const textBoxWidth = `${maxChar + 2}ch`;

  // return <OrderTooltip strategy={strategy} buy/>

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
            fill="white"
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
          <use href="#carbonLogo" x="0" y="4" />
          <use href="#carbonLogo" x="8" y="16" />
          <rect
            x="0"
            y="0"
            width="15"
            height="25"
            fill="#00B578"
            fillOpacity="0.2"
          />
        </pattern>
        <pattern href="#base-pattern" id="sell-pattern">
          <use href="#carbonLogo" x="0" y="4" />
          <use href="#carbonLogo" x="8" y="16" />
          <rect
            x="0"
            y="0"
            width="15"
            height="25"
            fill="#D86371"
            fillOpacity="0.2"
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

      <g className={style.currentPrice}>
        <path
          className={style.priceLine}
          stroke="#404040"
          strokeWidth="2"
          d={`M ${Math.max(
            steps[1],
            Math.min(steps[steps.length - 1], x(currentPrice))
          )} ${baseline} V 25`}
        />
        {currentPriceTooLow && (
          <>
            <rect
              fill="#404040"
              x={steps[1] - 1}
              y="10"
              width={textBoxWidth}
              height="30"
              rx="4"
            />
            <text
              fill="white"
              x={steps[1]}
              y="14"
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
              Out of Range
            </text>
          </>
        )}
        {!currentPriceTooLow && !currentPriceTooHigh && (
          <>
            <rect
              fill="#404040"
              x={x(currentPrice)}
              y="10"
              width={`${formattedPrice.length + 2}ch`}
              height="15"
              rx="4"
              style={{
                transform: `translateX(-${(formattedPrice.length + 2) / 2}ch)`,
              }}
            />
            <text
              fill="white"
              x={x(currentPrice)}
              y="14"
              dominantBaseline="hanging"
              textAnchor="middle"
              fontSize="12"
            >
              {formattedPrice}
            </text>
          </>
        )}
        {currentPriceTooHigh && (
          <>
            <rect
              fill="#404040"
              x={steps[steps.length - 1] + 1}
              y="10"
              width={textBoxWidth}
              height="30"
              rx="4"
              style={{
                transform: `translateX(-${formattedPrice.length + 2}ch)`,
              }}
            />
            <text
              fill="white"
              x={steps[steps.length - 1]}
              y="14"
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
              Out of Range
            </text>
          </>
        )}
      </g>

      <g className={style.buySellAreas} clipPath="url(#left-to-right)">
        {buyOrderExists && (
          <FloatTooltip>
            <FloatTooltipTrigger>
              <g className={style.buy}>
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
                          <g className={style.buyAreaMarginalPrice}>
                            <polygon
                              fill="url(#buy-pattern)"
                              fillOpacity="0.25"
                              points={Array.from(
                                getBuyPoints(buy.marginalPrice, buy.to)
                              ).join(' ')}
                            />
                          </g>
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
                    </>
                  )}
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
              <g className={style.sell}>
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
                      {sell.marginalPrice < sell.to &&
                        sell.marginalPrice >= sell.from && (
                          <g className={style.sellAreaMarginalPrice}>
                            <polygon
                              fillOpacity="0.25"
                              fill="url(#sell-pattern)"
                              points={Array.from(
                                getSellPoints(sell.from, sell.marginalPrice)
                              ).join(' ')}
                            />
                          </g>
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
                    </>
                  )}
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
              </g>
            </FloatTooltipTrigger>
            <FloatTooltipContent>
              <OrderTooltip strategy={strategy} />
            </FloatTooltipContent>
          </FloatTooltip>
        )}
      </g>
    </svg>
  );
};

interface OrderTooltipProps {
  strategy: Strategy;
  buy?: boolean;
}

const OrderTooltip: FC<OrderTooltipProps> = ({ strategy, buy }) => {
  const order = buy ? strategy.order0 : strategy.order1;
  const limit = order.startRate === order.endRate;
  const marginalPrice = prettifyNumber(order.marginalRate);
  const { quote, base } = strategy;
  const color = buy ? 'text-green' : 'text-red';
  return (
    <article className="flex flex-col gap-16">
      <h3 className={cn('text-16 font-weight-500', color)}>
        {buy ? 'Buy' : 'Sell'} {quote.symbol}
      </h3>
      {limit && (
        <table className="border-separate rounded-8 border border-white/40">
          <tbody>
            <tr>
              <th className="p-8 text-start text-12 font-weight-400 text-white/60">
                Price
              </th>
              <td className="p-8 text-end text-12">
                {prettifyNumber(order.startRate)} {base.symbol}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      {!limit && (
        <table className="border-separate rounded-8 border border-white/40">
          <tbody>
            <tr>
              <th className="p-8 pb-4 text-start text-12 font-weight-400 text-white/60">
                Min Price
              </th>
              <td className="p-8 pb-4 text-end text-12">
                {prettifyNumber(order.startRate)} {base.symbol}
              </td>
            </tr>
            <tr>
              <th className="p-8 pt-4 text-start text-12 font-weight-400 text-white/60">
                Max Price
              </th>
              <td className="p-8 pt-4 text-end text-12">
                {prettifyNumber(order.endRate)} {base.symbol}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <p className="text-12 text-white/60">
        Current marginal price is {marginalPrice} {base.symbol} per 1&nbsp;
        {quote.symbol}
      </p>
      <p className="text-12 text-white/60">
        *Want to know about prices and their meaning?
        <br />
        <a
          href="https://faq.carbondefi.xyz"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-4 font-weight-500 text-green"
        >
          <span>Learn More</span>
          <IconLink className="inline h-12 w-12" />
        </a>
      </p>
    </article>
  );
};
