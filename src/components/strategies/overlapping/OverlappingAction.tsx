import { FC, ReactNode, SyntheticEvent, useId, useRef } from 'react';
import { Token } from 'libs/tokens';
import IconDeposit from 'assets/icons/deposit.svg?react';
import IconWithdraw from 'assets/icons/withdraw.svg?react';
import IconChevron from 'assets/icons/chevron.svg?react';
import { useGetTokenBalance } from 'libs/queries';
import { InputBudget, BudgetAction } from '../common/InputBudget';
import { SafeDecimal } from 'libs/safedecimal';
import { Radio, RadioGroup } from 'components/common/radio/RadioGroup';

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
        <h3 className="text-16 font-medium">Edit Budget</h3>
        <span className="text-12 text-main-0/60">(Optional)</span>
        <IconChevron className="toggle h-14 w-14" />
      </summary>
      <div className="grid gap-16">
        <p className="text-14 text-main-0/80">
          Please select the action and amount of tokens
        </p>
        <RadioGroup className="justify-self-start">
          <Radio
            className="flex items-center gap-8"
            value="deposit"
            checked={action === 'deposit'}
            onChange={() => setAction('deposit')}
            data-testid="action-deposit"
          >
            <IconDeposit className="size-14" />
            Deposit
          </Radio>
          <Radio
            className="flex items-center gap-8"
            value="withdraw"
            checked={action === 'withdraw'}
            onChange={() => setAction('withdraw')}
            data-testid="action-withdraw"
          >
            <IconWithdraw className="size-14" />
            Withdraw
          </Radio>
        </RadioGroup>
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
