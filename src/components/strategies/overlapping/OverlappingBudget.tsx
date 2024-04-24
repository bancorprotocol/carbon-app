import { FC } from 'react';
import { Token } from 'libs/tokens';
import { useGetTokenBalance } from 'libs/queries';
import { BudgetInput, BudgetAction } from '../common/BudgetInput';

interface Props {
  base: Token;
  quote: Token;
  buyBudget?: string;
  sellBudget?: string;
  budgetValue: string;
  setBudget: (value: string) => void;
  anchor: 'buy' | 'sell';
  action: BudgetAction;
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
    buyBudget = '',
    sellBudget = '',
    action,
    anchor,
    budgetValue,
    setBudget,
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
      <hgroup>
        <h3 className="text-16 font-weight-500 flex items-center gap-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px] text-white/60">
            2
          </span>
          {getTitle(action)}
        </h3>
        <p className="text-14 text-white/80">{getDescription(action)}</p>
      </hgroup>
      <BudgetInput
        action={action}
        token={anchor === 'buy' ? quote : base}
        value={budgetValue}
        onChange={setBudget}
        max={getMax()}
        errors={error}
        data-testid="input-budget"
      />
    </article>
  );
};
