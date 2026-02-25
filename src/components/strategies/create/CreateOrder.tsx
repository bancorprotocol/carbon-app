import { FC, useId, useMemo } from 'react';
import { Token } from 'libs/tokens';
import { FullOutcome } from 'components/strategies/FullOutcome';
import { OrderHeader } from 'components/strategies/common/OrderHeader';
import { OrderBlock } from 'components/strategies/common/types';
import { InputBudget } from 'components/strategies/common/InputBudget';
import { useGetTokenBalance } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { cn } from 'utils/helpers';
import { OrderDirection } from '../common/OrderDirection';
import {
  StrategyDirection,
  StrategySettings,
  StrategyType,
} from 'libs/routing';
import { LimitRangeOrder } from '../common/LimitRangeOrder';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import style from 'components/strategies/common/order.module.css';

interface Props {
  base: Token;
  quote: Token;
  order: OrderBlock;
  direction?: StrategyDirection;
  optionalBudget?: boolean;
  type: StrategyType;
  setOrder: (order: Partial<OrderBlock>) => any;
  /** If provided, display the direction tabs */
  setDirection?: (direction: StrategyDirection) => any;
  /** If provided, display the settings tabs */
  setSettings?: (settings: StrategySettings) => any;
  warnings?: (string | undefined)[];
  error?: string;
}

export const CreateOrder: FC<Props> = ({
  base,
  quote,
  order,
  type,
  setOrder,
  direction = 'sell',
  setDirection,
  setSettings,
  error,
  warnings,
}) => {
  const titleId = useId();
  const budgetId = useId();

  const isBuy = direction === 'buy';
  const setPrice = (price: string) => setOrder({ min: price, max: price });
  const setMin = (min: string) => setOrder({ min });
  const setMax = (max: string) => setOrder({ max });

  // BUDGET
  const budgetToken = isBuy ? quote : base;
  const balance = useGetTokenBalance(budgetToken);
  const insufficientBalance =
    balance.data && new SafeDecimal(balance.data).lt(order.budget)
      ? 'Insufficient balance'
      : '';
  const budgetTooltip = useMemo(() => {
    if (isBuy) {
      const note =
        type === 'recurring'
          ? 'Note: this amount will re-fill once the "Sell" order is used by traders.'
          : '';
      return `The amount of ${quote.symbol} tokens you would like to use in order to buy ${base.symbol}. ${note}`;
    } else {
      const note =
        type === 'recurring'
          ? 'Note: this amount will re-fill once the "Buy" order is used by traders.'
          : '';
      return `The amount of ${base.symbol} tokens you would like to sell. ${note}`;
    }
  }, [base.symbol, isBuy, quote.symbol, type]);
  const setBudget = (budget: string) => setOrder({ budget });

  const headerProps = {
    titleId,
    order,
    base,
    buy: isBuy,
    direction,
    setSettings,
  };

  return (
    <article
      aria-labelledby={titleId}
      className="grid"
      data-testid={`${direction}-section`}
    >
      {!!setDirection && (
        <OrderDirection direction={direction} setDirection={setDirection} />
      )}
      <div
        className={cn(style.order, 'grid gap-16 p-16')}
        data-direction={direction}
        data-disposable={!!setDirection}
      >
        <OrderHeader {...headerProps} />
        <LimitRangeOrder
          base={base}
          quote={quote}
          order={order}
          direction={direction}
          setMin={setMin}
          setMax={setMax}
          setPrice={setPrice}
          error={error}
          warnings={warnings}
        />
        <div className="grid gap-8">
          <Tooltip element={budgetTooltip}>
            <label
              htmlFor={budgetId}
              className="text-14 font-medium flex items-center gap-8 capitalize text-main-0/80"
            >
              Budget
            </label>
          </Tooltip>
          <InputBudget
            editType="deposit"
            token={budgetToken}
            value={order.budget}
            onChange={setBudget}
            max={balance.data || '0'}
            maxIsLoading={balance.isPending}
            error={insufficientBalance}
            data-testid="input-budget"
          />
        </div>
        <FullOutcome
          min={order.min}
          max={order.max}
          budget={order.budget}
          isBuy={isBuy}
          base={base}
          quote={quote}
        />
      </div>
    </article>
  );
};
