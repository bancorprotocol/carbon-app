import { FC, useId } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { FullOutcome } from 'components/strategies/FullOutcome';
import { BaseOrder, OrderBlock } from 'components/strategies/common/types';
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

interface Props {
  budget: string;
  order: BaseOrder;
  editType: 'withdraw' | 'deposit';
  buy?: boolean;
  optional?: boolean;
  initialBudget: string;
  setOrder: (order: Partial<OrderBlock>) => void;
  error?: string;
  warning?: string;
}

export const EditStrategyBudgetField: FC<Props> = ({
  budget,
  order,
  editType,
  initialBudget,
  setOrder,
  optional = false,
  buy = false,
  error,
  warning,
}) => {
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;
  const titleId = useId();
  const token = buy ? quote : base;
  const balance = useGetTokenBalance(token);

  const max = editType === 'deposit' ? balance.data || '0' : initialBudget;
  const maxIsLoading = editType === 'deposit' && balance.isLoading;
  const insufficientBalance =
    balance.data && new SafeDecimal(max).lt(budget)
      ? 'Insufficient balance'
      : '';

  const setBudget = (budget: string) => setOrder({ budget });
  const setMarginalPrice = (marginalPrice: string) =>
    setOrder({ marginalPrice });

  return (
    <article
      aria-labelledby={titleId}
      className={`rounded-10 bg-background-900 flex flex-col gap-20 border-l-2 p-20 ${
        buy
          ? 'border-buy/50 focus-within:border-buy'
          : 'border-sell/50 focus-within:border-sell'
      }`}
      data-testid={`${buy ? 'buy' : 'sell'}-section`}
    >
      <header className="flex items-center justify-between">
        <h3 id={titleId} className="text-18 flex items-center gap-8">
          <span>
            {`${editType === 'withdraw' ? 'Withdraw' : 'Deposit'}`}{' '}
            {buy ? 'Buy' : 'Sell'} Budget
          </span>
          {optional && (
            <span className="text-14 font-weight-500 text-white/40">
              Optional
            </span>
          )}
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
        <EditBudgetTokenPrice order={order} buy={buy} />
        {order.min !== order.max && !isZero(budget) && (
          <EditBudgetDistribution order={order} onChange={setMarginalPrice} />
        )}
      </EditStrategyAllocatedBudget>
      <FullOutcome
        min={order.min}
        max={order.max}
        budget={order.budget}
        budgetUpdate={budget}
        buy={buy}
        base={base}
        quote={quote}
      />
    </article>
  );
};
