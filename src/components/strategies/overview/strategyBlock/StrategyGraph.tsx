import { FC } from 'react';
import { Strategy } from 'libs/queries';
import { utils } from '@bancor/carbon-sdk';
import './StrategyGraph.css';

interface Props {
  strategy: Strategy;
  buy?: boolean;
}

const round = (v: number) => Math.round(v * 1000) / 1000;

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

  const buyEncoded = utils.encodedOrderStrToBN(strategy.encoded.order0);
  const buyMarginalRate = utils.decodeOrder(buyEncoded).marginalRate;
  const sellEncoded = utils.encodedOrderStrToBN(strategy.encoded.order1);
  const sellMarginalRate = utils.decodeOrder(sellEncoded).marginalRate;

  const buy = {
    from: round(Number(buyOrder.startRate)),
    to: round(Number(buyOrder.endRate)),
    marginalPrice: round(Number(buyMarginalRate)),
  };
  const sell = {
    from: round(Number(sellOrder.startRate)),
    to: round(Number(sellOrder.endRate)),
    marginalPrice: round(Number(sellMarginalRate)),
  };

  const middlePoint = (sell.to + buy.from) / 2;

  // TODO: Change to the real value
  const currentPrice = round(middlePoint);

  // Graph zoom
  const from = middlePoint / 3;
  const to = (middlePoint * 5) / 3;
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

  const getBuyPoints = (buyFrom: number, buyTo: number) =>
    new Set([
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

  const getSellPoints = (sellFrom: number, sellTo: number) =>
    new Set([
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

  return (
    <svg
      className="strategy-graph"
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
          id="Pattern"
          x="0"
          y="0"
          width="15"
          height="25"
          patternUnits="userSpaceOnUse"
        >
          <use href="#carbonLogo" x="0" y="4" />
          <use href="#carbonLogo" x="8" y="16" />
        </pattern>
        <clipPath id="left-to-right">
          <rect x="0" y="0" width={width} height="100">
            <animate
              attributeName="width"
              values="0;400"
              dur="3s"
              fill="freeze"
            />
          </rect>
        </clipPath>
      </defs>

      <g className="axes" stroke="#404040">
        <line x1="0" y1={baseline} x2={width} y2={baseline} />
        {steps.map((x) => (
          <line key={x} x1={x} y1={baseline} x2={x} y2={tick} />
        ))}
      </g>

      <g className="current-price">
        <path
          className="priceLine"
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
              width="100"
              height="30"
              rx="4"
            />
            <text
              fill="white"
              x={steps[1] + 50}
              y="14"
              dominantBaseline="hanging"
              textAnchor="middle"
              fontSize="12"
            >
              {currentPrice}
            </text>
            <text
              fill="white"
              x={x(from + 50)}
              y="28"
              dominantBaseline="hanging"
              textAnchor="middle"
              fontSize="12"
            >
              Out of Range
            </text>
          </>
        )}
        {!currentPriceTooLow && !currentPriceTooHigh && (
          <>
            <rect
              fill="#404040"
              x={x(currentPrice) - 30}
              y="10"
              width="60"
              height="15"
              rx="4"
            />
            <text
              fill="white"
              x={x(currentPrice)}
              y="14"
              dominantBaseline="hanging"
              textAnchor="middle"
              fontSize="12"
            >
              {currentPrice}
            </text>
          </>
        )}
        {currentPriceTooHigh && (
          <>
            <rect
              fill="#404040"
              x={steps[steps.length - 1] + 1 - 100}
              y="10"
              width="100"
              height="30"
              rx="4"
            />
            <text
              fill="white"
              x={steps[steps.length - 1] - 50}
              y="14"
              dominantBaseline="hanging"
              textAnchor="middle"
              fontSize="12"
            >
              {currentPrice}
            </text>
            <text
              fill="white"
              x={x(to - 50)}
              y="28"
              dominantBaseline="hanging"
              textAnchor="middle"
              fontSize="12"
            >
              Out of Range
            </text>
          </>
        )}
      </g>

      <g className="buySellAreas" clip-path="url(#left-to-right)">
        <g className="buy">
          {buy.from !== buy.to && (
            <>
              <polygon
                className="buyArea"
                fill="#00B578"
                fillOpacity="0.25"
                points={Array.from(
                  getBuyPoints(buy.from, Math.min(buy.marginalPrice, buy.to))
                ).join(' ')}
              />
              {buy.marginalPrice < buy.to && buy.marginalPrice > buy.from && (
                <g className="buyAreaMarginalPrice">
                  <polygon
                    fill="#00B578"
                    opacity="0.15"
                    points={Array.from(
                      getBuyPoints(buy.marginalPrice, buy.to)
                    ).join(' ')}
                  />
                  <polygon
                    fill="url(#Pattern)"
                    fillOpacity="0.25"
                    points={Array.from(
                      getBuyPoints(buy.marginalPrice, buy.to)
                    ).join(' ')}
                  />
                </g>
              )}
              <line
                className="lineBuySell"
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
            className="lineBuySell"
            stroke="#00B578"
            strokeWidth="2"
            x1={x(buy.to)}
            y1={baseline}
            x2={x(buy.to)}
            y2={buyToInSell ? middle : top}
          />
        </g>

        <g className="sell">
          {sell.from !== sell.to && (
            <>
              <polygon
                className="sellArea"
                fill="#D86371"
                fillOpacity="0.25"
                points={Array.from(
                  getSellPoints(
                    Math.max(sell.from, sell.marginalPrice),
                    sell.to
                  )
                ).join(' ')}
              />
              {sell.marginalPrice < sell.to &&
                sell.marginalPrice > sell.from && (
                  <g className="sellAreaMarginalPrice">
                    <polygon
                      fill="#D86371"
                      opacity="0.15"
                      points={Array.from(
                        getSellPoints(sell.from, sell.marginalPrice)
                      ).join(' ')}
                    />
                    <polygon
                      fill="url(#Pattern)"
                      fillOpacity="0.4"
                      points={Array.from(
                        getSellPoints(sell.from, sell.marginalPrice)
                      ).join(' ')}
                    />
                  </g>
                )}
              <line
                className="lineBuySell"
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
            className="lineBuySell"
            stroke="#D86371"
            strokeWidth="2"
            x1={x(sell.to)}
            x2={x(sell.to)}
            y1={sellToInBuy ? middle : baseline}
            y2={top}
          />
        </g>
      </g>
    </svg>
  );
};
