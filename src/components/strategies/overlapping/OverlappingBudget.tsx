import { FC } from 'react';
import { Token } from 'libs/tokens';
import { ReactComponent as IconDeposit } from 'assets/icons/deposit.svg';
import { ReactComponent as IconWithdraw } from 'assets/icons/withdraw.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { useGetTokenBalance } from 'libs/queries';
import { cn } from 'utils/helpers';
import { BudgetInput, BudgetMode } from '../common/BudgetInput';
import style from './OverlappingBudget.module.css';

interface Props {
  base: Token;
  quote: Token;
  buyBudget: string;
  sellBudget: string;
  budgetValue: string;
  setBudget: (value: string) => void;
  anchor?: 'buy' | 'sell';
  mode: BudgetMode;
  setMode: (mode: BudgetMode) => void;
  errors: string[];
}

export const OverlappingBudget: FC<Props> = (props) => {
  const {
    base,
    quote,
    buyBudget,
    sellBudget,
    mode,
    setMode,
    anchor,
    budgetValue,
    setBudget,
    errors,
  } = props;
  const baseBalance = useGetTokenBalance(base).data ?? '0';
  const quoteBalance = useGetTokenBalance(quote).data ?? '0';

  const getMax = () => {
    if (mode === 'deposit') {
      return anchor === 'buy' ? quoteBalance : baseBalance;
    } else {
      return anchor === 'buy' ? buyBudget : sellBudget;
    }
  };

  if (!anchor) return null;
  return (
    <article className="flex w-full flex-col gap-16 rounded-10 bg-background-900 p-20">
      <details>
        <summary className="flex cursor-pointer items-center gap-8">
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
            className="flex gap-2 self-start rounded-full border-2 border-background-700 p-6"
          >
            <input
              className={cn('absolute opacity-0', style.budgetMode)}
              type="radio"
              name="mode"
              id="select-deposit"
              checked={mode === 'deposit'}
              onChange={(e) => e.target.checked && setMode('deposit')}
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
              name="mode"
              id="select-withdraw"
              checked={mode === 'withdraw'}
              onChange={(e) => e.target.checked && setMode('withdraw')}
            />
            <label
              htmlFor="select-withdraw"
              className="flex cursor-pointer items-center justify-center gap-8 rounded-full px-16 py-8 text-14"
            >
              <IconWithdraw className="h-14 w-14" />
              Withdraw
            </label>
          </div>
          <BudgetInput
            mode={mode}
            token={anchor === 'buy' ? quote : base}
            value={budgetValue}
            onChange={setBudget}
            max={getMax()}
            errors={errors}
          />
        </div>
      </details>
    </article>
  );
};
