import { capitalize } from 'lodash';
import { FC, useId } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';
import { UseQueryResult } from 'libs/queries';
import { LimitRangeSection } from './LimitRangeSection';
import { LogoImager } from 'components/common/imager/Imager';
import { StrategyType } from 'libs/routing';
import { FullOutcome } from 'components/strategies/FullOutcome';
import { BuySellHeader } from './Header';
import { BudgetSection } from './BudgetSection';
import {
  StrategyInputDispatch,
  StrategyInputOrder,
} from 'hooks/useStrategyInput';

type Props = {
  base: Token;
  quote: Token;
  tokenBalanceQuery?: UseQueryResult<string>;
  order: StrategyInputOrder;
  dispatch: StrategyInputDispatch;
  buy?: boolean;
  isBudgetOptional?: boolean;
  strategyType?: StrategyType;
  isOrdersOverlap: boolean;
};

export const BuySellBlock: FC<Props> = ({
  base,
  quote,
  tokenBalanceQuery,
  order,
  dispatch,
  isBudgetOptional,
  strategyType,
  buy = false,
  isOrdersOverlap,
}) => {
  const titleId = useId();

  const type = buy ? 'buy' : 'sell';

  const tooltipText = `This section will define the order details in which you are willing to ${type} ${base.symbol} at.`;

  const inputTitle = (
    <>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
        1
      </span>
      <Tooltip
        sendEventOnMount={{ buy }}
        element={`Define the price you are willing to ${type} ${base.symbol} at. Make sure the price is in ${quote.symbol} tokens.`}
      >
        <p>
          <span className="text-white/80">
            Set {capitalize(type)} Price&nbsp;
          </span>
          <span className="text-white/60">
            ({quote.symbol} per 1 {base.symbol})
          </span>
        </p>
      </Tooltip>
    </>
  );

  const headerProps = { titleId, order, dispatch, base, buy };
  const limitRangeProps = {
    base,
    quote,
    order,
    dispatch,
    buy,
    inputTitle,
    isOrdersOverlap,
  };
  const budgetProps = {
    buy,
    quote,
    base,
    strategyType,
    order,
    dispatch,
    isBudgetOptional,
    tokenBalanceQuery,
  };

  return (
    <section
      aria-labelledby={titleId}
      className={`bg-secondary flex flex-col gap-20 rounded-10 border-l-2 p-20 ${
        buy
          ? 'border-green/50 focus-within:border-green'
          : 'border-red/50 focus-within:border-red'
      }`}
      data-testid={`${buy ? 'buy' : 'sell'}-section`}
    >
      <BuySellHeader {...headerProps}>
        <h3 className="flex items-center gap-8" id={titleId}>
          <Tooltip sendEventOnMount={{ buy }} element={tooltipText}>
            <span>{buy ? 'Buy Low' : 'Sell High'}</span>
          </Tooltip>
          <LogoImager alt="Token" src={base.logoURI} className="h-18 w-18" />
          <span>{base.symbol}</span>
        </h3>
      </BuySellHeader>
      <LimitRangeSection {...limitRangeProps} />
      <BudgetSection {...budgetProps} />
      <FullOutcome
        price={order.min}
        min={order.min}
        max={order.max}
        budget={order.budget}
        buy={buy}
        base={base}
        quote={quote}
      />
    </section>
  );
};
