import { FC } from 'react';
import { CartStrategy, Order } from 'components/strategies/common/types';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { TokenLogo } from 'components/common/imager/Imager';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import IconTooltip from 'assets/icons/tooltip.svg?react';
import WarningIcon from 'assets/icons/warning.svg?react';
import { cn, getUsdPrice, prettifyNumber } from 'utils/helpers';

export const StrategyBlockBuySell: FC<{
  strategy: CartStrategy<Order>;
  isBuy?: boolean;
  className?: string;
}> = ({ strategy, isBuy = false, className }) => {
  const token = isBuy ? strategy.base : strategy.quote;
  const otherToken = isBuy ? strategy.quote : strategy.base;
  const order = isBuy ? strategy.buy : strategy.sell;
  const testIdPrefix = `${isBuy ? 'buy' : 'sell'}`;
  const otherTokenFiat = useFiatCurrency(otherToken);
  const prettifiedBudget = prettifyNumber(order.budget, { abbreviate: true });
  const hasFiatValue = otherTokenFiat.hasFiatValue();
  const fiatBudget = isBuy
    ? strategy.fiatBudget.quote
    : strategy.fiatBudget.base;
  const fiatBudgetValue = getUsdPrice(fiatBudget);

  const buyTooltip = `${otherToken.symbol} tokens available to buy ${token.symbol}.`;
  const sellTooltip = `${otherToken.symbol} tokens available for sale.`;
  const noCurrencyTooltip = `There is no USD value for this token.`;

  return (
    <article className={cn('flex flex-col gap-4 p-16', className)}>
      {isBuy ? (
        <header className="flex items-center gap-4">
          <h4 className="text-12 text-buy">Buy {token.symbol}</h4>
          {hasFiatValue && (
            <Tooltip element={buyTooltip}>
              <IconTooltip className="size-10 text-main-0/60" />
            </Tooltip>
          )}
          {!hasFiatValue && (
            <Tooltip
              element={
                <p>
                  {buyTooltip}
                  <br />
                  {noCurrencyTooltip}
                </p>
              }
            >
              <span>
                <WarningIcon className="text-warning size-10" />
              </span>
            </Tooltip>
          )}
        </header>
      ) : (
        <header className="flex items-center gap-4">
          <h4 className="text-12 text-sell">Sell {otherToken.symbol}</h4>
          {hasFiatValue && (
            <Tooltip element={sellTooltip}>
              <IconTooltip className="size-10 text-main-0/60" />
            </Tooltip>
          )}
          {!hasFiatValue && (
            <Tooltip
              element={
                <p>
                  {sellTooltip}
                  <br />
                  {noCurrencyTooltip}
                </p>
              }
            >
              <WarningIcon className="text-warning size-10" />
            </Tooltip>
          )}
        </header>
      )}
      <Tooltip
        element={
          <span className="inline-flex items-center gap-4">
            <TokenLogo token={otherToken} size={16} />
            {prettifyNumber(order.budget, { highPrecision: true })}
          </span>
        }
      >
        <p className="text-14" data-testid={`${testIdPrefix}-budget`}>
          {prettifiedBudget} {otherToken.symbol}
        </p>
      </Tooltip>
      <p
        data-testid={`${testIdPrefix}-budget-fiat`}
        className="text-12 text-main-0/60"
      >
        {hasFiatValue ? fiatBudgetValue : '...'}
      </p>
    </article>
  );
};
