import { FC } from 'react';
import { Strategy } from 'libs/queries';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { LogoImager } from 'components/common/imager/Imager';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as TooltipIcon } from 'assets/icons/tooltip.svg';
import { ReactComponent as WarningIcon } from 'assets/icons/warning.svg';
import { TokenPrice } from './TokenPrice';
import { cn, getFiatDisplayValue, prettifyNumber } from 'utils/helpers';
import { getPrice } from './utils';

export const StrategyBlockBuySell: FC<{
  strategy: Strategy;
  buy?: boolean;
  className?: string;
}> = ({ strategy, buy = false, className }) => {
  const token = buy ? strategy.base : strategy.quote;
  const otherToken = buy ? strategy.quote : strategy.base;
  const order = buy ? strategy.order0 : strategy.order1;
  const otherOrder = buy ? strategy.order1 : strategy.order1;
  const limit = order.startRate === order.endRate;
  const testIdPrefix = `${buy ? 'buy' : 'sell'}-${limit ? 'limit' : 'range'}`;
  const active = strategy.status === 'active';
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

  const prettifiedBudget = prettifyNumber(order.balance, {
    abbreviate: order.balance.length > 10,
  });
  const budget = getFiatValueQuote(buy ? order.balance : otherOrder.balance);
  const fullFiatBudget = getFiatDisplayValue(budget, selectedFiatCurrency);

  return (
    <article className={cn('flex flex-col gap-16 p-16', className)}>
      {buy ? (
        <h4 className="text-16 font-weight-500 text-green">Buy</h4>
      ) : (
        <h4 className="text-16 font-weight-500 text-red">Sell</h4>
      )}
      <dl
        className={`flex flex-col gap-8 text-12 ${active ? '' : 'opacity-50'}`}
      >
        {/* BUDGET */}
        <dt className="flex items-center gap-4 font-mono text-white/60">
          Budget
          {budget.eq(0) && (
            <Tooltip
              sendEventOnMount={{ buy }}
              element={`There is no ${selectedFiatCurrency} value for this token.`}
            >
              <WarningIcon className="h-8 w-8 text-warning-500" />
            </Tooltip>
          )}
          {budget.gt(0) && (
            <Tooltip
              sendEventOnMount={{ buy }}
              element={
                buy
                  ? `This is the available amount of ${otherToken.symbol} tokens that you are willing to use in order to buy ${token.symbol}.`
                  : `This is the available amount of ${otherToken.symbol} tokens that you are willing to sell.`
              }
            >
              <TooltipIcon className="h-8 w-8" />
            </Tooltip>
          )}
        </dt>
        <dd
          className="inline-flex items-center gap-4"
          data-testid={`${testIdPrefix}-budget`}
        >
          <LogoImager
            className="h-16 w-16"
            src={otherToken.logoURI}
            alt="token"
          />
          {prettifiedBudget}
        </dd>
        <dd className="font-mono text-white/60">
          {budget.eq(0) ? '...' : fullFiatBudget}
        </dd>

        {/* PRICE */}
        <dt className="mt-16 flex items-center gap-4 font-mono text-white/60">
          {limit ? 'Limit Price' : 'Price Range'}
          <Tooltip
            sendEventOnMount={{ buy }}
            element={
              buy
                ? `This is the price in which you are willing to buy ${token.symbol}.`
                : `This is the price in which you are willing to sell ${otherToken.symbol}.`
            }
          >
            <TooltipIcon className="h-8 w-8" />
          </Tooltip>
        </dt>
        <dd>
          <Tooltip
            sendEventOnMount={{ buy }}
            maxWidth={430}
            element={
              <>
                {fullPrice} {buy ? otherToken.symbol : token.symbol}
                <TokenPrice className="text-white/60" price={fullFiatPrices} />
              </>
            }
          >
            <TokenPrice
              price={prettifiedPrice}
              iconSrc={buy ? otherToken.logoURI : token.logoURI}
              data-testid={`${testIdPrefix}-price`}
            />
          </Tooltip>
        </dd>
      </dl>
    </article>
  );
};
