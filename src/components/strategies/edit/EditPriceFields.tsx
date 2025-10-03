import { FC, ReactNode, useId } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { FullOutcome } from 'components/strategies/FullOutcome';
import { OrderHeader } from 'components/strategies/common/OrderHeader';
import { InputRange } from 'components/strategies/common/InputRange';
import { InputLimit } from 'components/strategies/common/InputLimit';
import {
  EditOrderBlock,
  StaticOrder,
} from 'components/strategies/common/types';
import { useEditStrategyCtx } from './EditStrategyContext';
import { BudgetDistribution } from '../common/BudgetDistribution';
import { getDeposit, getWithdraw } from './utils';
import { useGetTokenBalance } from 'libs/queries';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { OverlappingAction } from '../overlapping/OverlappingAction';
import { EditBudgetDistribution } from './EditStrategyAllocatedBudget';
import { isZero } from '../common/utils';
import { SafeDecimal } from 'libs/safedecimal';
import style from 'components/strategies/common/order.module.css';
import { cn } from 'utils/helpers';

interface Props {
  order: EditOrderBlock;
  direction?: StrategyDirection;
  initialOrder: StaticOrder;
  budget: string;
  action?: 'deposit' | 'withdraw';
  hasPriceChanged: boolean;
  setOrder: (order: Partial<EditOrderBlock>) => void;
  settings?: ReactNode;
  warnings?: (string | undefined)[];
  error?: string;
}

export const EditStrategyPriceField: FC<Props> = ({
  order,
  initialOrder,
  budget,
  hasPriceChanged,
  setOrder,
  direction = 'sell',
  settings,
  error,
  warnings,
}) => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;
  const isBuy = direction === 'buy';
  const token = isBuy ? quote : base;
  const balance = useGetTokenBalance(token);
  const initialBudget = initialOrder.budget;
  const titleId = useId();

  const inputTitle = (
    <>
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black-gradient text-[10px] text-white/60">
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
  const setMin = (min: string) => setOrder({ min, marginalPrice: undefined });
  const setMax = (max: string) => setOrder({ max, marginalPrice: undefined });
  const setBudget = (budget: string) => setOrder({ budget });
  const setMarginalPrice = (marginalPrice: string) => {
    setOrder({ marginalPrice });
  };
  const setAction = (action: 'deposit' | 'withdraw') => {
    setOrder({ action, budget: undefined, marginalPrice: undefined });
  };
  const setSettings = (settings: StrategySettings) => {
    setOrder({
      settings,
      min: undefined,
      max: undefined,
      marginalPrice: undefined,
    });
  };

  const showDistribution = () => {
    if (hasPriceChanged) return false;
    if (order.min === order.max) return false;
    if (isZero(budget)) return false;
    if (isZero(initialBudget)) return false;
    if (new SafeDecimal(order.budget).lte(0)) return false;
    if (!balance.data || new SafeDecimal(budget).gt(balance.data)) return false;
    if (isBuy && initialOrder.marginalPrice === order.max) return false;
    if (!isBuy && initialOrder.marginalPrice === order.min) return false;
    return true;
  };

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
      className="grid text-left"
      data-testid={`${isBuy ? 'buy' : 'sell'}-section`}
    >
      {settings}
      <div
        className={cn(style.order, 'grid gap-16 p-16')}
        data-direction={isBuy ? 'buy' : 'sell'}
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
        <OverlappingAction
          base={base}
          quote={quote}
          anchor={isBuy ? 'buy' : 'sell'}
          action={order.action}
          setAction={setAction}
          budget={budget}
          setBudget={setBudget}
          buyBudget={strategy.buy.budget}
          sellBudget={strategy.sell.budget}
        >
          {showDistribution() && (
            <div
              role="table"
              className="rounded-md p-15 text-12 font-medium mt-8 flex flex-col gap-10 border-2 border-white/10 text-left"
            >
              <EditBudgetDistribution
                marginalPrice={order.marginalPrice}
                onChange={setMarginalPrice}
              />
            </div>
          )}
        </OverlappingAction>
        <BudgetDistribution
          token={token}
          initialBudget={initialBudget}
          withdraw={getWithdraw(initialBudget, order.budget)}
          deposit={getDeposit(initialBudget, order.budget)}
          balance={balance.data}
          isBuy={isBuy}
        />
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
