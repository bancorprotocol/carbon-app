import { FC } from 'react';
import { Strategy, StrategyStatus } from 'libs/queries';
import { Imager } from 'components/common/imager/Imager';
import { prettifyNumber } from 'utils/helpers';
import { BuySellPriceRangeIndicator } from 'components/common/buySellPriceRangeIndicator/BuySellPriceRangeIndicator';

export const StrategyBlockBuySell: FC<{
  strategy: Strategy;
  buy?: boolean;
}> = ({ strategy, buy }) => {
  const token = buy ? strategy.token0 : strategy.token1;
  const otherToken = buy ? strategy.token1 : strategy.token0;
  const order = buy ? strategy.order0 : strategy.order1;
  const limit = order.startRate === order.endRate;
  const active = strategy.status === StrategyStatus.Active;

  const prices = `${prettifyNumber(order.startRate, {
    abbreviate: order.startRate.length > 10,
  })} ${
    !limit
      ? ` - ${prettifyNumber(order.endRate, {
          abbreviate: order.endRate.length > 10,
        })}`
      : ''
  }`;

  return (
    <div
      className={`rounded-8 border border-emphasis p-12 ${
        active ? '' : 'opacity-35'
      }`}
    >
      <div className="flex items-center gap-6">
        {buy ? 'Buy' : 'Sell'}
        <Imager
          className="h-16 w-16"
          src={buy ? token.logoURI : otherToken.logoURI}
          alt="token"
        />
      </div>
      <hr className="my-12 border-silver dark:border-emphasis" />
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div className={`${buy ? 'text-green' : 'text-red'}`}>
            {limit ? 'Limit Price' : 'Price Range'}
          </div>
          <div className="flex items-center gap-7">
            {prices}
            <Imager
              className="h-16 w-16"
              src={buy ? otherToken.logoURI : token.logoURI}
              alt="token"
            />
          </div>
        </div>
        <div className="mb-10 flex items-center justify-between">
          <div className="text-secondary !text-16">Budget</div>
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
