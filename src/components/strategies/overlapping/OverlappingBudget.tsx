import { FC } from 'react';
import { Token } from 'libs/tokens';
import { useGetTokenBalance } from 'libs/queries';
import { InputBudget, BudgetAction } from '../common/InputBudget';
import { useWagmi } from 'libs/wagmi';

interface Props {
  base: Token;
  quote: Token;
  buyBudget?: string;
  sellBudget?: string;
  budget: string;
  setBudget: (value: string) => void;
  anchor: 'buy' | 'sell';
  editType: BudgetAction;
  error?: string;
  warning?: string;
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
    editType,
    anchor,
    budget,
    setBudget,
    error,
    warning,
  } = props;
  const { user } = useWagmi();

  const token = anchor === 'buy' ? quote : base;
  const balance = useGetTokenBalance(token);
  const allocatedBudget = anchor === 'buy' ? buyBudget : sellBudget;
  const maxIsLoading = editType === 'deposit' && balance.isPending;
  const max = editType === 'deposit' ? balance.data || '0' : allocatedBudget;

  const disabled = (() => {
    if (!user) return false;
    if (editType !== 'deposit') return false;
    return !balance.data;
  })();

  return (
    <>
      <hgroup>
        <h3 className="text-16 font-weight-500 flex items-center gap-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px] text-white/60">
            2
          </span>
          {getTitle(editType)}
        </h3>
        <p className="text-14 text-white/80">{getDescription(editType)}</p>
      </hgroup>
      <InputBudget
        editType={editType}
        token={token}
        value={budget}
        onChange={setBudget}
        max={max}
        maxIsLoading={maxIsLoading}
        error={error}
        warning={warning}
        disabled={disabled}
        data-testid="input-budget"
      />
    </>
  );
};
