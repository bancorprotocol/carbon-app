import { FC, ReactNode, useId } from 'react';
import { FullOutcome } from 'components/strategies/FullOutcome';
import { OrderHeader } from 'components/strategies/common/OrderHeader';
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
import { LimitRangeOrder } from '../common/LimitRangeOrder';

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
      data-testid={`${direction}-section`}
    >
      {settings}
      <div
        className={cn(style.order, 'grid gap-16 p-16')}
        data-direction={direction}
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
              className="rounded-md p-15 text-12 font-medium mt-8 flex flex-col gap-10 border border-white/10 text-left"
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
