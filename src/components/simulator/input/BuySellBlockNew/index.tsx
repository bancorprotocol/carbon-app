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
  isBuy?: boolean;
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
  isBuy = false,
  isOrdersOverlap,
  isOrdersReversed,
  warningMsg,
  className,
}) => {
  const titleId = useId();

  const type = isBuy ? 'buy' : 'sell';

  const tooltipText = `This section will define the order details in which you are willing to ${type} ${base.symbol} at.`;

  const headerProps = { titleId, order, dispatch, base, isBuy };
  const limitRangeProps = {
    base,
    quote,
    order,
    dispatch,
    isBuy,
    isOrdersOverlap,
    isOrdersReversed,
  };
  const budgetProps = {
    isBuy,
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
      data-testid={`${isBuy ? 'buy' : 'sell'}-section`}
      data-direction={isBuy ? 'buy' : 'sell'}
    >
      <BuySellHeader {...headerProps}>
        <h2 className="text-16 flex items-center gap-8" id={titleId}>
          <Tooltip element={tooltipText}>
            <span>{isBuy ? 'Buy Low' : 'Sell High'}</span>
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
