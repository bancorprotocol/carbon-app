import { FC, useId } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { FullOutcome } from 'components/strategies/FullOutcome';
import {
  FormStaticOrder,
  StaticOrder,
  OrderBlock,
} from 'components/strategies/common/types';
import {
  EditBudgetDistribution,
  EditBudgetTokenPrice,
  EditStrategyAllocatedBudget,
} from './EditStrategyAllocatedBudget';
import { useEditStrategyCtx } from './EditStrategyContext';
import { InputBudget } from '../common/InputBudget';
import { useGetTokenBalance } from 'libs/queries';
import { SafeDecimal } from 'libs/safedecimal';
import { isZero } from '../common/utils';
import { cn } from 'utils/helpers';
import style from 'components/strategies/common/order.module.css';

interface Props {
  budget: string;
  order: FormStaticOrder;
  editType: 'withdraw' | 'deposit';
  isBuy?: boolean;
  initialOrder: StaticOrder;
  setOrder: (order: Partial<OrderBlock>) => void;
  error?: string;
  warning?: string;
}

export const EditStrategyBudgetField: FC<Props> = ({
  budget,
  order,
  editType,
  initialOrder,
  setOrder,
  isBuy = false,
  error,
  warning,
}) => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;
  const titleId = useId();
  const token = isBuy ? quote : base;
  const balance = useGetTokenBalance(token);
  const initialBudget = initialOrder.budget;

  const max = editType === 'deposit' ? balance.data || '0' : initialBudget;
  const maxIsLoading = editType === 'deposit' && balance.isPending;
  const insufficientBalance =
    balance.data && new SafeDecimal(max).lt(budget)
      ? 'Insufficient balance'
      : '';

  const setBudget = (budget: string) => setOrder({ budget });
  const setMarginalPrice = (marginalPrice: string) =>
    setOrder({ marginalPrice });

  const showDistribution = () => {
    if (order.min === order.max) return false;
    if (isZero(budget)) return false;
    if (isZero(initialBudget)) return false;
    if (new SafeDecimal(order.budget).lte(0)) return false;
    if (!balance.data || new SafeDecimal(budget).gt(balance.data)) return false;
    if (isBuy && initialOrder.marginalPrice === order.max) return false;
    if (!isBuy && initialOrder.marginalPrice === order.min) return false;
    return true;
  };

  return (
    <article
      aria-labelledby={titleId}
      className={cn(style.order, 'grid gap-16 p-16')}
      data-testid={`${isBuy ? 'buy' : 'sell'}-section`}
      data-direction={isBuy ? 'buy' : 'sell'}
    >
      <header className="flex items-center justify-between">
        <h3 id={titleId} className="text-18 flex items-center gap-8">
          {`${editType === 'withdraw' ? 'Withdraw' : 'Deposit'}`}{' '}
          {isBuy ? 'Buy' : 'Sell'} Budget
        </h3>
        <Tooltip
          element={`Indicate the amount you wish to ${
            editType === 'withdraw' ? 'withdraw' : 'deposit'
          } from the available "allocated budget"`}
          iconClassName="text-white/60"
        />
      </header>
      <InputBudget
        editType={editType}
        token={token}
        value={budget}
        onChange={setBudget}
        max={max}
        maxIsLoading={maxIsLoading}
        error={error || insufficientBalance}
        warning={warning}
        data-testid="input-budget"
      />
      <EditStrategyAllocatedBudget token={token} initialBudget={initialBudget}>
        <EditBudgetTokenPrice order={order} isBuy={isBuy} />
        {showDistribution() && (
          <EditBudgetDistribution
            marginalPrice={order.marginalPrice}
            onChange={setMarginalPrice}
          />
        )}
      </EditStrategyAllocatedBudget>
      <FullOutcome
        min={order.min}
        max={order.max}
        budget={order.budget}
        budgetUpdate={budget}
        isBuy={isBuy}
        base={base}
        quote={quote}
      />
    </article>
  );
};
