import { FC } from 'react';
import { Strategy } from 'libs/queries';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { LogoImager } from 'components/common/imager/Imager';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as TooltipIcon } from 'assets/icons/tooltip.svg';
import { ReactComponent as WarningIcon } from 'assets/icons/warning.svg';
import { cn, getFiatDisplayValue, prettifyNumber } from 'utils/helpers';

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
  const baseFiat = useFiatCurrency(token);
  const quoteFiat = useFiatCurrency(otherToken);
  const currency = baseFiat.selectedFiatCurrency;
  const prettifiedBudget = prettifyNumber(order.balance, {
    abbreviate: order.balance.length > 10,
  });
  const balance = buy ? order.balance : otherOrder.balance;
  const budget = quoteFiat.getFiatValue(balance);
  const quoteHasFiatValue = quoteFiat.hasFiatValue();
  const fullFiatBudget = getFiatDisplayValue(budget, currency);

  return (
    <article
      className={cn(
        'flex flex-col gap-4 p-16',
        active ? '' : 'opacity-50',
        className
      )}
    >
      {buy ? (
        <header className="flex items-center gap-4">
          <h4 className="font-mono text-12 text-green">
            Buy {token.symbol} Budget
          </h4>
          {quoteHasFiatValue && (
            <Tooltip
              element={`This is the available amount of ${otherToken.symbol} tokens that you are willing to use in order to buy ${token.symbol}.`}
            >
              <TooltipIcon className="h-10 w-10 text-white/60" />
            </Tooltip>
          )}
          {!quoteHasFiatValue && (
            <Tooltip element={`There is no ${currency} value for this token.`}>
              <WarningIcon className="h-10 w-10 text-warning-500" />
            </Tooltip>
          )}
        </header>
      ) : (
        <header className="flex items-center gap-4">
          <h4 className="font-mono text-12 text-red">
            Sell {otherToken.symbol} Budget
          </h4>
          {quoteHasFiatValue && (
            <Tooltip
              element={`This is the available amount of ${otherToken.symbol} tokens that you are willing to sell.`}
            >
              <TooltipIcon className="h-10 w-10 text-white/60" />
            </Tooltip>
          )}
          {!quoteHasFiatValue && (
            <Tooltip element={`There is no ${currency} value for this token.`}>
              <WarningIcon className="h-10 w-10 text-warning-500" />
            </Tooltip>
          )}
        </header>
      )}
      <p data-testid={`${testIdPrefix}-budget`}>
        <Tooltip
          element={
            <span className="inline-flex items-center gap-4">
              <LogoImager
                className="h-16 w-16"
                src={otherToken.logoURI}
                alt="token"
              />
              {order.balance.toString()}
            </span>
          }
        >
          <>
            {prettifiedBudget} {otherToken.symbol}
          </>
        </Tooltip>
      </p>
      <p className="font-mono text-12 text-white/60">
        {quoteHasFiatValue ? fullFiatBudget : '...'}
      </p>
    </article>
  );
};
