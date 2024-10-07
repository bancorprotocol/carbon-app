import { FC, ReactNode, SyntheticEvent, useId, useRef } from 'react';
import { Token } from 'libs/tokens';
import { ReactComponent as IconDeposit } from 'assets/icons/deposit.svg';
import { ReactComponent as IconWithdraw } from 'assets/icons/withdraw.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { useGetTokenBalance } from 'libs/queries';
import { cn } from 'utils/helpers';
import { InputBudget, BudgetAction } from '../common/InputBudget';
import { SafeDecimal } from 'libs/safedecimal';
import style from './OverlappingBudget.module.css';

interface Props {
  base: Token;
  quote: Token;
  buyBudget: string;
  sellBudget: string;
  budget: string;
  setBudget: (value: string) => void;
  anchor: 'buy' | 'sell';
  action?: BudgetAction;
  setAction: (action: BudgetAction) => void;
  warning?: string;
  children?: ReactNode;
}

export const OverlappingAction: FC<Props> = (props) => {
  const {
    base,
    quote,
    buyBudget,
    sellBudget,
    action = 'deposit',
    setAction,
    anchor,
    budget,
    setBudget,
    warning,
    children,
  } = props;
  const actionName = useId();
  const depositId = useId();
  const withdrawId = useId();
  const opened = useRef(!!anchor && !!budget);

  const token = anchor === 'buy' ? quote : base;
  const balance = useGetTokenBalance(token);
  const allocatedBudget = anchor === 'buy' ? buyBudget : sellBudget;
  const maxIsLoading = action === 'deposit' && balance.isPending;
  const max = action === 'deposit' ? balance.data || '0' : allocatedBudget;

  const onToggle = (e: SyntheticEvent<HTMLDetailsElement, ToggleEvent>) => {
    if (e.nativeEvent.oldState === 'open') setBudget('');
  };

  const budgetError = (() => {
    const value = new SafeDecimal(budget);
    if (action === 'deposit') {
      if (balance.isLoading || !balance.data) return;
      if (value.gt(balance.data)) return 'Insufficient balance';
    } else {
      if (value.gt(allocatedBudget)) return 'Insufficient funds';
    }
    return '';
  })();

  return (
    <details open={opened.current} onToggle={onToggle}>
      <summary
        className="flex cursor-pointer items-center gap-8"
        data-testid="budget-summary"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px] text-white/60">
          2
        </span>
        <h3 className="text-16 font-weight-500">Edit Budget</h3>
        <span className="text-12 text-white/60">(Optional)</span>
        <IconChevron className="toggle h-14 w-14" />
      </summary>
      <div className="flex flex-col gap-16">
        <p className="text-14 text-white/80">
          Please select the action and amount of tokens
        </p>
        <div
          role="radiogroup"
          className="border-background-700 flex gap-2 self-start rounded-full border-2 p-4"
        >
          <input
            className={cn('absolute opacity-0', style.budgetMode)}
            type="radio"
            name={actionName}
            id={depositId}
            checked={action === 'deposit'}
            onChange={(e) => e.target.checked && setAction('deposit')}
          />
          <label
            htmlFor={depositId}
            className="text-14 flex cursor-pointer items-center justify-center gap-8 rounded-full px-16 py-4"
            data-testid="action-deposit"
          >
            <IconDeposit className="h-14 w-14" />
            Deposit
          </label>
          <input
            className={cn('absolute opacity-0', style.budgetMode)}
            type="radio"
            name={actionName}
            id={withdrawId}
            checked={action === 'withdraw'}
            onChange={(e) => e.target.checked && setAction('withdraw')}
          />
          <label
            htmlFor={withdrawId}
            className="text-14 flex cursor-pointer items-center justify-center gap-8 rounded-full px-16 py-4"
            data-testid="action-withdraw"
          >
            <IconWithdraw className="h-14 w-14" />
            Withdraw
          </label>
        </div>
        <InputBudget
          editType={action}
          token={anchor === 'buy' ? quote : base}
          value={budget}
          onChange={setBudget}
          max={max}
          maxIsLoading={maxIsLoading}
          error={budgetError}
          warning={warning}
          data-testid="input-budget"
        />
      </div>
      {children}
    </details>
  );
};
