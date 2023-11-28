import { FC, useId } from 'react';
import { Strategy, useGetTokenBalance } from 'libs/queries';
import { ReactComponent as IconTooltip } from 'assets/icons/tooltip.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OverlappingStrategyGraph } from '../../overlapping/OverlappingStrategyGraph';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { getSpreadPPM } from 'components/strategies/utils';
import { useMarketIndication } from 'components/strategies/marketPriceIndication';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { ReactComponent as IconAction } from 'assets/icons/action.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { WithdrawBudgetInput } from 'components/strategies/common/WithdrawBudgetInput';
import { SafeDecimal } from 'libs/safedecimal';

interface Props {
  strategy: Strategy;
  order0: OrderCreate;
  order1: OrderCreate;
}

export const WithdrawOverlappingStrategy: FC<Props> = (props) => {
  const { strategy, order0, order1 } = props;
  const { base, quote } = strategy;
  const buyId = useId();
  const sellId = useId();

  const tokenBaseBalanceQuery = useGetTokenBalance(base);
  const tokenQuoteBalanceQuery = useGetTokenBalance(quote);

  const marketPrice = useMarketPrice({ base, quote });
  const spreadPPM = getSpreadPPM(strategy).round();
  const min = order0.min;
  const max = order1.max;
  const { marketPricePercentage } = useMarketIndication({
    base,
    quote,
    order: { min, max },
  });

  const aboveMarket = new SafeDecimal(min).gt(marketPrice);
  const belowMarket = new SafeDecimal(max).lt(marketPrice);
  const withdrawAll =
    (order0.budget || '0') === strategy.order0.balance &&
    (order1.budget || '0') === strategy.order1.balance;

  return (
    <>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <header className="flex items-center gap-8">
          <h3 className="flex-1 text-18 font-weight-500">Price Range</h3>
          {/* TODO add tooltip text here */}
          <Tooltip element={''}>
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        <OverlappingStrategyGraph
          base={base}
          quote={quote}
          order={{ min, max }}
          marketPrice={marketPrice}
          spreadPPM={spreadPPM.toNumber()}
          marketPricePercentage={marketPricePercentage}
          disabled
        />
      </article>
      <article className="flex flex-col gap-20 rounded-10 bg-silver p-20">
        <header className="flex items-center gap-8 ">
          <h3 className="flex-1 text-18 font-weight-500">Withdraw Budget</h3>
          {/* TODO add tooltip text here */}
          <Tooltip element={''}>
            <IconTooltip className="h-14 w-14 text-white/60" />
          </Tooltip>
        </header>
        {!aboveMarket && (
          <WithdrawBudgetInput
            base={base}
            quote={quote}
            query={tokenBaseBalanceQuery}
            order={order0}
            currentBudget={strategy.order0.balance}
            buy
          />
        )}
        {!belowMarket && (
          <WithdrawBudgetInput
            base={base}
            quote={quote}
            query={tokenQuoteBalanceQuery}
            order={order1}
            currentBudget={strategy.order1.balance}
          />
        )}
        <footer className="flex items-center gap-8">
          {!withdrawAll && (
            <>
              <IconAction className="h-16 w-16" />
              <p className="text-12 text-white/60">
                Price range and liquidity spread remain unchanged.&nbsp;
                <a
                  href="."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-4 font-weight-500 text-green"
                >
                  <span>Learn More</span>
                  <IconLink className="inline h-12 w-12" />
                </a>
              </p>
            </>
          )}
          {withdrawAll && (
            <output
              htmlFor={[buyId, sellId].join(',')}
              role="alert"
              aria-live="polite"
              className="flex items-center gap-10 font-mono text-12 text-warning-500"
            >
              <IconWarning className="h-12 w-12" />
              <span className="flex-1">
                Please note that your strategy will be inactive as it will not
                have any budget.
              </span>
            </output>
          )}
        </footer>
      </article>
    </>
  );
};
