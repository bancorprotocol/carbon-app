import { FC, useId } from 'react';
import { Token } from 'libs/tokens';
import { UseQueryResult } from 'libs/queries';
import { StrategyType } from 'libs/routing';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { LimitRangeSection } from 'components/simulator/input/BuySellBlockNew/LimitRangeSection';
import { LogoImager } from 'components/common/imager/Imager';
import { BuySellHeader } from 'components/simulator/input/BuySellBlockNew/Header';
import { BudgetSection } from 'components/simulator/input/BuySellBlockNew/BudgetSection';
import {
  StrategyInputDispatch,
  StrategyInputOrder,
} from 'hooks/useStrategyInput';
import style from 'components/strategies/common/order.module.css';
import { cn } from 'utils/helpers';

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
  isOrdersReversed: boolean;
  warningMsg?: string;
  className?: string;
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
  isOrdersReversed,
  warningMsg,
  className,
}) => {
  const titleId = useId();

  const type = buy ? 'buy' : 'sell';

  const tooltipText = `This section will define the order details in which you are willing to ${type} ${base.symbol} at.`;

  const inputTitle = (
    <>
      <span className="flex size-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
        1
      </span>
      <Tooltip
        element={`Define the price you are willing to ${type} ${base.symbol} at. Make sure the price is in ${quote.symbol} tokens.`}
      >
        <p>
          <span className="capitalize text-white/80">
            Set {type} Price&nbsp;
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
    isOrdersReversed,
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
      className={cn(style.order, className, 'grid gap-16 p-16')}
      data-testid={`${buy ? 'buy' : 'sell'}-section`}
      data-direction={buy ? 'buy' : 'sell'}
    >
      <BuySellHeader {...headerProps}>
        <h2 className="text-16 flex items-center gap-8" id={titleId}>
          <Tooltip element={tooltipText}>
            <span>{buy ? 'Buy Low' : 'Sell High'}</span>
          </Tooltip>
          <LogoImager alt="Token" src={base.logoURI} className="size-18" />
          <span>{base.symbol}</span>
        </h2>
      </BuySellHeader>
      <LimitRangeSection {...limitRangeProps} />
      <BudgetSection {...budgetProps} />
      {warningMsg && <Warning message={warningMsg} />}
    </section>
  );
};
