import { FC } from 'react';
import { Token } from 'libs/tokens';
import { ReactComponent as IconDeposit } from 'assets/icons/deposit.svg';
import { ReactComponent as IconWithdraw } from 'assets/icons/withdraw.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { useGetTokenBalance } from 'libs/queries';
import { cn } from 'utils/helpers';
import { BudgetInput, BudgetAction } from '../common/BudgetInput';
import style from './OverlappingBudget.module.css';

interface Props {
  base: Token;
  quote: Token;
  buyBudget: string;
  sellBudget: string;
  budgetValue: string;
  setBudget: (value: string) => void;
  resetBudgets: (anchor: 'buy' | 'sell') => void;
  anchor: 'buy' | 'sell';
  action: BudgetAction;
  setAction: (action: BudgetAction) => void;
  error: string;
}

export const OverlappingAction: FC<Props> = (props) => {
  const {
    base,
    quote,
    buyBudget,
    sellBudget,
    action,
    setAction,
    anchor,
    budgetValue,
    setBudget,
    resetBudgets,
    error,
  } = props;
  const baseBalance = useGetTokenBalance(base).data ?? '0';
  const quoteBalance = useGetTokenBalance(quote).data ?? '0';

  const getMax = () => {
    if (action === 'deposit') {
      return anchor === 'buy' ? quoteBalance : baseBalance;
    } else {
      return anchor === 'buy' ? buyBudget : sellBudget;
    }
  };

  return (
    <article className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20">
      <details onToggle={() => resetBudgets(anchor)}>
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
              name="action"
              id="action-deposit"
              checked={action === 'deposit'}
              onChange={(e) => e.target.checked && setAction('deposit')}
            />
            <label
              htmlFor="action-deposit"
              className="text-14 flex cursor-pointer items-center justify-center gap-8 rounded-full px-16 py-4"
              data-testid="action-deposit"
            >
              <IconDeposit className="h-14 w-14" />
              Deposit
            </label>
            <input
              className={cn('absolute opacity-0', style.budgetMode)}
              type="radio"
              name="action"
              id="action-withdraw"
              checked={action === 'withdraw'}
              onChange={(e) => e.target.checked && setAction('withdraw')}
            />
            <label
              htmlFor="action-withdraw"
              className="text-14 flex cursor-pointer items-center justify-center gap-8 rounded-full px-16 py-4"
              data-testid="action-withdraw"
            >
              <IconWithdraw className="h-14 w-14" />
              Withdraw
            </label>
          </div>
          <BudgetInput
            action={action}
            token={anchor === 'buy' ? quote : base}
            value={budgetValue}
            onChange={setBudget}
            max={getMax()}
            errors={error}
            data-testid="input-budget"
          />
        </div>
      </details>
    </article>
  );
};
