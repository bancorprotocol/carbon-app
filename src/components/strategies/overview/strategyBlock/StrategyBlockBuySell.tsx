import { FC } from 'react';
import { Strategy, StrategyStatus } from 'libs/queries';
import { Imager } from 'components/common/imager/Imager';
import {
  getFiatDisplayValue,
  prettifyNumber,
  sanitizeNumberInput,
} from 'utils/helpers';
import { BuySellPriceRangeIndicator } from 'components/common/buySellPriceRangeIndicator/BuySellPriceRangeIndicator';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { TokenPrice } from './TokenPrice';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { getPrice } from './utils';

export const StrategyBlockBuySell: FC<{
  strategy: Strategy;
  buy?: boolean;
}> = ({ strategy, buy }) => {
  const token = buy ? strategy.base : strategy.quote;
  const otherToken = buy ? strategy.quote : strategy.base;
  const order = buy ? strategy.order0 : strategy.order1;
  const otherOrder = buy ? strategy.order1 : strategy.order1;
  const limit = order.startRate === order.endRate;
  const active = strategy.status === StrategyStatus.Active;
  const { selectedFiatCurrency, getFiatValue: getFiatValueBase } =
    useFiatCurrency(token);
  const { getFiatValue: getFiatValueQuote } = useFiatCurrency(otherToken);

  const prettifiedPrice = getPrice({
    order,
    limit,
    prettified: true,
    decimals: buy ? otherToken.decimals : token.decimals,
  });

  const fullPrice = getPrice({
    order,
    limit,
    decimals: buy ? otherToken.decimals : token.decimals,
  });

  const fiatStartRate = buy
    ? getFiatValueQuote(order.startRate)
    : getFiatValueBase(otherOrder.startRate);

  const fiatEndRate = buy
    ? getFiatValueQuote(order.endRate)
    : getFiatValueBase(otherOrder.endRate);

  const fullFiatPrices = `${getFiatDisplayValue(
    fiatStartRate,
    selectedFiatCurrency
  )} ${
    !limit ? ` - ${getFiatDisplayValue(fiatEndRate, selectedFiatCurrency)}` : ''
  }`;

  const fullBudget = sanitizeNumberInput(
    buy ? order.balance : otherOrder.balance,
    buy ? token.decimals : otherToken.decimals
  );
  const prettifiedBudget = prettifyNumber(order.balance, {
    abbreviate: order.balance.length > 10,
  });
  const budget = getFiatValueQuote(buy ? order.balance : otherOrder.balance);
  const fullFiatBudget = getFiatDisplayValue(budget, selectedFiatCurrency);

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
              : `This section indicates the details to which you are willing to sell ${otherToken.symbol} at. When a trader interact with your sell order, it will fill up your "Buy" order with tokens.`
          }
        >
          <div className="flex items-center gap-6">
            {buy ? 'Buy' : 'Sell'}
            <Imager
              className="h-16 w-16"
              src={buy ? token.logoURI : otherToken.logoURI}
              alt="token"
            />
          </div>
        </Tooltip>
      </div>
      <hr className="my-12 border-silver dark:border-emphasis" />
      <div>
        <div className="mb-5 flex items-center justify-between">
          <Tooltip
            element={
              buy
                ? `This is the price in which you are willing to buy ${token.symbol}.`
                : `This is the price in which you are willing to sell ${otherToken.symbol}.`
            }
          >
            <div className={`${buy ? 'text-green' : 'text-red'}`}>
              {limit ? 'Limit Price' : 'Price Range'}
            </div>
          </Tooltip>
          <Tooltip
            maxWidth={430}
            element={
              <>
                <div>
                  {`${fullPrice} ${buy ? otherToken.symbol : token.symbol}`}
                </div>
                <TokenPrice className="text-white/60" price={fullFiatPrices} />
              </>
            }
          >
            <div>
              <TokenPrice
                price={prettifiedPrice}
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
          <div className="flex gap-7">
            <Tooltip
              element={
                <>
                  <div>{`${fullBudget} ${otherToken.symbol}`}</div>
                  <TokenPrice
                    className="text-white/60"
                    price={fullFiatBudget}
                  />
                </>
              }
            >
              <div className="flex items-center gap-7">
                {prettifiedBudget}
                <Imager
                  className="h-16 w-16"
                  src={otherToken.logoURI}
                  alt="token"
                />
              </div>
            </Tooltip>
          </div>
        </div>
        <BuySellPriceRangeIndicator buy={buy} limit={limit} />
      </div>
    </div>
  );
};
