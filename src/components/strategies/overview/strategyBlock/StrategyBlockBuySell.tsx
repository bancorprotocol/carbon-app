import { FC } from 'react';
import { Strategy, StrategyStatus } from 'libs/queries';
import { Imager } from 'components/common/imager/Imager';
import { prettifyNumber } from 'utils/helpers';
import { BuySellPriceRangeIndicator } from 'components/common/buySellPriceRangeIndicator/BuySellPriceRangeIndicator';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { TokenPrice } from './TokenPrice';
import BigNumber from 'bignumber.js';
import { useFiatCurrency } from 'hooks/useFiatCurrency';

export const StrategyBlockBuySell: FC<{
  strategy: Strategy;
  buy?: boolean;
}> = ({ strategy, buy }) => {
  const token = buy ? strategy.token0 : strategy.token1;
  const otherToken = buy ? strategy.token1 : strategy.token0;
  const order = buy ? strategy.order0 : strategy.order1;
  const limit = order.startRate === order.endRate;
  const active = strategy.status === StrategyStatus.Active;
  const { selectedFiatCurrency, useGetTokenPrice } = useFiatCurrency();
  const tokenPriceQuery = useGetTokenPrice(token.symbol);

  const getPrice = (usd = false) => {
    return `${prettifyNumber(order.startRate, {
      abbreviate: order.startRate.length > 10,
      usd,
    })} ${
      !limit
        ? ` - ${prettifyNumber(order.endRate, {
            abbreviate: order.endRate.length > 10,
            usd,
          })}`
        : ''
    }`;
  };

  const getFiatValue = (value: string) => {
    return prettifyNumber(
      new BigNumber(value || 0).times(
        tokenPriceQuery.data?.[selectedFiatCurrency] || 0
      ),
      { abbreviate: order.startRate.length > 10, usd: true }
    );
  };
  const prices = getPrice();
  const fiatValue = getFiatValue(order.startRate);
  const fiatSecondValue = getFiatValue(order.endRate);

  const fiatPrices = `${fiatValue} ${!limit ? ` - ${fiatSecondValue}` : ''}`;

  return (
    <div
      className={`rounded-8 border border-emphasis p-12 ${
        active ? '' : 'opacity-35'
      }`}
    >
      <div className="flex items-center gap-6">
        <Tooltip
          element={
            buy
              ? `This section indicates the details to which you are willing to buy ${token.symbol} at. When a trader interact with your buy order, it will fill up your "Sell" order with tokens.`
              : `This section indicates the details to which you are willing to sell ${token.symbol} at. When a trader interact with your sell order, it will fill up your "Buy" order with tokens.`
          }
        >
          <div className="flex items-center gap-6">
            {buy ? 'Buy' : 'Sell'}
            <Imager className="h-16 w-16" src={token.logoURI} alt="token" />
          </div>
        </Tooltip>
      </div>
      <hr className="my-12 border-silver dark:border-emphasis" />
      <div>
        <div className="mb-5 flex items-center justify-between">
          <Tooltip
            element={
              buy
                ? `This is the rate in which you are willing to buy ${token.symbol}.`
                : `This is the rate in which you are willing to sell ${token.symbol}.`
            }
          >
            <div className={`${buy ? 'text-green' : 'text-red'}`}>
              {limit ? 'Limit Price' : 'Price Range'}
            </div>
          </Tooltip>
          <Tooltip
            element={
              <>
                <TokenPrice
                  price={prices}
                  iconSrc={buy ? otherToken.logoURI : token.logoURI}
                />
                <TokenPrice className="text-white/60" price={fiatPrices} />
              </>
            }
          >
            <div>
              <TokenPrice
                price={prices}
                iconSrc={buy ? otherToken.logoURI : token.logoURI}
              />
            </div>
          </Tooltip>
        </div>
        <div className="mb-10 flex items-center justify-between">
          <Tooltip
            element={
              buy
                ? `This is the available amount of ${otherToken.symbol} tokens that you are willing to use in order to buy ${token.symbol}.`
                : `This is the available amount of ${otherToken.symbol} tokens that you are willing to sell.`
            }
          >
            <div className="text-secondary !text-16">Budget</div>
          </Tooltip>
          <div className="flex items-center gap-7">
            {prettifyNumber(order.balance, {
              abbreviate: order.balance.length > 10,
            })}
            <Imager
              className="h-16 w-16"
              src={otherToken.logoURI}
              alt="token"
            />
          </div>
        </div>
        <BuySellPriceRangeIndicator buy={buy} limit={limit} />
      </div>
    </div>
  );
};
