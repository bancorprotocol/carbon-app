import { FC } from 'react';
import { StrategyWithFiat } from 'libs/queries';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { LogoImager } from 'components/common/imager/Imager';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { ReactComponent as TooltipIcon } from 'assets/icons/tooltip.svg';
import { ReactComponent as WarningIcon } from 'assets/icons/warning.svg';
import { cn, getFiatDisplayValue, prettifyNumber } from 'utils/helpers';

export const StrategyBlockBuySell: FC<{
  strategy: StrategyWithFiat;
  buy?: boolean;
  className?: string;
}> = ({ strategy, buy = false, className }) => {
  const token = buy ? strategy.base : strategy.quote;
  const otherToken = buy ? strategy.quote : strategy.base;
  const order = buy ? strategy.order0 : strategy.order1;
  const testIdPrefix = `${buy ? 'buy' : 'sell'}`;
  const active = strategy.status === 'active';
  const otherTokenFiat = useFiatCurrency(otherToken);
  const currency = otherTokenFiat.selectedFiatCurrency;
  const prettifiedBudget = prettifyNumber(order.balance, {
    abbreviate: order.balance.length > 10,
  });
  const hasFiatValue = otherTokenFiat.hasFiatValue();
  const fiatBudget = buy ? strategy.fiatBudget.quote : strategy.fiatBudget.base;
  const fiatBudgetValue = getFiatDisplayValue(fiatBudget, currency);

  const buyTooltip = `This is the available amount of ${otherToken.symbol} tokens that you are willing to use in order to buy ${token.symbol}.`;
  const sellTooltip = `This is the available amount of ${otherToken.symbol} tokens that you are willing to sell.`;
  const noCurrencyTooltip = `There is no ${currency} value for this token.`;

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
          <h4 className="font-mono text-12 text-green">Buy {token.symbol}</h4>
          {hasFiatValue && (
            <Tooltip element={buyTooltip}>
              <TooltipIcon className="h-10 w-10 text-white/60" />
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
              <WarningIcon className="h-10 w-10 text-warning-500" />
            </Tooltip>
          )}
        </header>
      ) : (
        <header className="flex items-center gap-4">
          <h4 className="font-mono text-12 text-red">
            Sell {otherToken.symbol}
          </h4>
          {hasFiatValue && (
            <Tooltip element={sellTooltip}>
              <TooltipIcon className="h-10 w-10 text-white/60" />
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
              <WarningIcon className="h-10 w-10 text-warning-500" />
            </Tooltip>
          )}
        </header>
      )}
      <p className="text-14" data-testid={`${testIdPrefix}-budget`}>
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
      <p
        data-testid={`${testIdPrefix}-budget-fiat`}
        className="font-mono text-12 text-white/60"
      >
        {hasFiatValue ? fiatBudgetValue : '...'}
      </p>
    </article>
  );
};
