import { FC, useId } from 'react';
import { Token } from 'libs/tokens';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { FullOutcome } from 'components/strategies/FullOutcome';
import { OrderHeader } from 'components/strategies/common/OrderHeader';
import { InputRange } from 'components/strategies/common/InputRange';
import { InputLimit } from 'components/strategies/common/InputLimit';
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
  optionalBudget,
  type,
  setOrder,
  direction = 'sell',
  setDirection,
  setSettings,
  error,
  warnings,
}) => {
  const titleId = useId();

  const isBuy = direction === 'buy';
  // PRICES
  const inputTitle = (
    <>
      <span className="flex size-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
        1
      </span>
      <Tooltip
        element={`Define the price you are willing to ${
          isBuy ? 'buy' : 'sell'
        } ${base.symbol} at. Make sure the price is in ${quote.symbol} tokens.`}
      >
        <p>
          <span className="text-white/80">
            Set {isBuy ? 'Buy' : 'Sell'} Price&nbsp;
          </span>
          <span className="text-white/60">
            ({quote.symbol} per 1 {base.symbol})
          </span>
        </p>
      </Tooltip>
    </>
  );
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
  const budgetTooltip = () => {
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
  };
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
      >
        <OrderHeader {...headerProps} />
        <fieldset className="flex flex-col gap-8">
          <legend className="text-14 font-medium mb-11 flex items-center gap-6">
            {inputTitle}
          </legend>
          {order.settings === 'range' ? (
            <InputRange
              base={base}
              quote={quote}
              min={order.min}
              setMin={setMin}
              max={order.max}
              setMax={setMax}
              isBuy={isBuy}
              error={error}
              warnings={warnings}
              required
            />
          ) : (
            <InputLimit
              base={base}
              quote={quote}
              price={order.min}
              setPrice={setPrice}
              isBuy={isBuy}
              error={error}
              warnings={warnings}
              required
            />
          )}
        </fieldset>
        <fieldset className="flex flex-col gap-8">
          <legend className="text-14 font-medium mb-11 flex items-center gap-6">
            <span className="flex size-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
              2
            </span>
            <Tooltip element={budgetTooltip()}>
              <span className="text-white/80">
                Set {isBuy ? 'Buy' : 'Sell'} Budget&nbsp;
              </span>
            </Tooltip>
            {optionalBudget && (
              <span className="font-medium ml-8 text-white/60">Optional</span>
            )}
          </legend>
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
        </fieldset>
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
