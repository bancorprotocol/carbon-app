import { FC, useId } from 'react';
import { OrderCreate } from '../create/useOrder';
import { SafeDecimal } from 'libs/safedecimal';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { Token } from 'libs/tokens';
import { UseQueryResult } from '@tanstack/react-query';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { TooltipTokenAmount } from '../edit/tooltip/TooltipTokenAmount';

interface Props {
  id?: string;
  order: OrderCreate;
  quote: Token;
  base: Token;
  currentBudget: string;
  query: UseQueryResult<string>;
  buy?: boolean;
}

export const DepositBudgetInput: FC<Props> = (props) => {
  const { id, order, quote, base, currentBudget, query, buy } = props;
  const inputId = useId();
  const token = buy ? quote : base;
  const balance = query.data ?? '0';

  const setBudget = (value: string) => {
    order.setBudget(value);
    if (new SafeDecimal(balance).lt(value)) {
      return order.setBudgetError('Insufficient balance');
    } else {
      order.setBudgetError('');
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <TokenInputField
        id={id ?? inputId}
        className="rounded-16 bg-black p-16"
        value={order.budget}
        setValue={setBudget}
        token={token}
        isBalanceLoading={query.isLoading}
        isError={!!order.budgetError}
        balance={balance}
      />
      {!!order.budgetError && (
        <output
          htmlFor={inputId}
          role="alert"
          aria-live="polite"
          className="flex items-center gap-10 font-mono text-12 text-red"
        >
          <IconWarning className="h-12 w-12" />
          <span className="flex-1">{order.budgetError}</span>
        </output>
      )}
      <div className="flex items-center justify-between gap-16 rounded-8 border border-emphasis py-8 px-16 font-mono text-12 font-weight-500">
        <p className="flex items-center gap-6">
          Allocated Budget
          <Tooltip
            sendEventOnMount={{ buy }}
            iconClassName="h-13 text-white/60"
            element={
              buy
                ? `This is the current available ${quote?.symbol} budget you can withdraw`
                : `This is the current available ${base?.symbol} budget you can withdraw`
            }
          />
        </p>
        <TooltipTokenAmount amount={currentBudget} token={buy ? quote : base} />
      </div>
    </div>
  );
};
