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
  fixAction?: BudgetAction;
  error: string;
}

const getTitle = (fixAction?: BudgetAction) => {
  if (!fixAction) return 'Edit Budget';
  if (fixAction === 'deposit') return 'Deposit Budget';
  return 'Withdraw Budget';
};
const getDescription = (fixAction?: BudgetAction) => {
  if (!fixAction) return 'Please select the action and amount of tokens';
  if (fixAction === 'deposit') {
    return 'Please enter the amount of tokens you want to deposit.';
  } else {
    return 'Please enter the amount of tokens you want to withdraw.';
  }
};

export const OverlappingBudget: FC<Props> = (props) => {
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
    fixAction,
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
    <article className="flex w-full flex-col gap-16 rounded-10 bg-background-900 p-20">
      <details open={!!fixAction} onToggle={() => resetBudgets(anchor)}>
        <summary className="flex cursor-pointer items-center gap-8">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
            2
          </span>
          <h3 className="text-16 font-weight-500">{getTitle(fixAction)}</h3>
          {!fixAction && (
            <span className="text-12 text-white/60">(Optional)</span>
          )}
          <IconChevron className="toggle h-14 w-14" />
        </summary>
        <div className="flex flex-col gap-16">
          <p className="text-14 text-white/80">{getDescription(fixAction)}</p>
          {!fixAction && (
            <div
              role="radiogroup"
              className="flex gap-2 self-start rounded-full border-2 border-background-700 p-6"
            >
              <input
                className={cn('absolute opacity-0', style.budgetMode)}
                type="radio"
                name="action"
                id="select-deposit"
                checked={action === 'deposit'}
                onChange={(e) => e.target.checked && setAction('deposit')}
              />
              <label
                htmlFor="select-deposit"
                className="flex cursor-pointer items-center justify-center gap-8 rounded-full px-16 py-8 text-14"
              >
                <IconDeposit className="h-14 w-14" />
                Deposit
              </label>
              <input
                className={cn('absolute opacity-0', style.budgetMode)}
                type="radio"
                name="action"
                id="select-withdraw"
                checked={action === 'withdraw'}
                onChange={(e) => e.target.checked && setAction('withdraw')}
              />
              <label
                htmlFor="select-withdraw"
                className="flex cursor-pointer items-center justify-center gap-8 rounded-full px-16 py-8 text-14"
              >
                <IconWithdraw className="h-14 w-14" />
                Withdraw
              </label>
            </div>
          )}
          <BudgetInput
            action={action}
            token={anchor === 'buy' ? quote : base}
            value={budgetValue}
            onChange={setBudget}
            max={getMax()}
            errors={error}
          />
        </div>
      </details>
    </article>
  );
};
