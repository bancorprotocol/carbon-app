import { TradeWidget } from 'components/trade/tradeWidget/TradeWidget';
import { OrderBookWidget } from 'components/trade/orderWidget/OrderBookWidget';
import { DepthChartWidget } from 'components/trade/depthChartWidget/DepthChartWidget';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { config } from 'services/web3/config';
import { TokenPair } from '@bancor/carbon-sdk';
import { useTradeTokens } from 'components/trade/useTradeTokens';
import { useEffect, useState } from 'react';
import { Token } from 'libs/tokens';
import { useTradePairs } from 'components/trade/useTradePairs';
import { MainMenuTrade } from 'components/core/menu/mainMenu/MainMenuTrade';

export type TradePageProps = { base: Token; quote: Token };

const { ETH, DAI, BNT, USDT, WBTC, USDC } = config.tokens;

const defaultPairs: TokenPair[] = [
  [ETH, USDC],
  [ETH, USDT],
  [ETH, DAI],
  [BNT, USDC],
  [BNT, USDT],
  [BNT, DAI],
  [WBTC, USDC],
  [WBTC, USDT],
  [WBTC, DAI],
  [BNT, ETH],
  [USDC, USDT],
  [USDT, USDC],
  [USDC, DAI],
  [USDT, DAI],
];

const checkDefaultPairs = (
  pairs: { baseToken: Token; quoteToken: Token }[]
) => {
  const tokenPairs = new Set(
    pairs.map((pair) =>
      [
        pair.baseToken.address.toLowerCase(),
        pair.quoteToken.address.toLowerCase(),
      ].join('-')
    )
  );
  const lowercases = defaultPairs.map((p) => p.map((t) => t.toLowerCase()));
  for (const pair of lowercases) {
    if (tokenPairs.has(pair.join('-'))) {
      return pair;
    }
  }
  return undefined;
};

export const TradePage = () => {
  const { belowBreakpoint } = useBreakpoints();
  const { baseToken, quoteToken, goToPair } = useTradeTokens();
  const { isLoading, isTradePairError, tradePairs } = useTradePairs();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    if (hasMounted) {
      return;
    }
    if (!!tradePairs.length && !baseToken && !quoteToken) {
      const foundDefault = checkDefaultPairs(tradePairs);
      if (foundDefault) {
        goToPair(foundDefault[0], foundDefault[1], true);
      }
      setHasMounted(true);
    }
  }, [
    baseToken,
    goToPair,
    hasMounted,
    quoteToken,
    tradePairs,
    tradePairs.length,
  ]);

  const isValidPair = !(!baseToken || !quoteToken);

  const noTokens = !baseToken && !quoteToken;

  return (
    <>
      {belowBreakpoint('md') && <MainMenuTrade />}

      {isLoading ? (
        <div>is loading</div>
      ) : isTradePairError || !isValidPair ? (
        <div>{!noTokens && <div>Not found</div>}</div>
      ) : (
        <div className="px-content mx-auto mt-50 grid grid-cols-1 gap-20 pb-30 md:grid-cols-12 xl:px-50">
          <div
            className={'order-last md:order-first md:col-span-4 md:row-span-2'}
          >
            <OrderBookWidget base={baseToken} quote={quoteToken} />
          </div>
          <div className={'md:col-span-8'}>
            <TradeWidget base={baseToken} quote={quoteToken} />
          </div>
          <div className={'order-first md:order-last md:col-span-8'}>
            <DepthChartWidget base={baseToken} quote={quoteToken} />
          </div>
        </div>
      )}
    </>
  );
};
