import { FC } from 'react';
import { Token } from 'libs/tokens';
import { useGetTokenBalance } from 'libs/queries';
import { BudgetInput, BudgetAction } from '../common/BudgetInput';
import { useWeb3 } from 'libs/web3';

interface Props {
  base: Token;
  quote: Token;
  buyBudget?: string;
  sellBudget?: string;
  budgetValue: string;
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
    budgetValue,
    setBudget,
    error,
    warning,
  } = props;
  const { user } = useWeb3();
  const baseBalance = useGetTokenBalance(base).data;
  const quoteBalance = useGetTokenBalance(quote).data;

  const getMax = () => {
    if (editType === 'deposit') {
      return anchor === 'buy' ? quoteBalance : baseBalance;
    } else {
      return anchor === 'buy' ? buyBudget : sellBudget;
    }
  };

  const disabled = (() => {
    if (!user) return false;
    if (editType !== 'deposit') return false;
    return anchor === 'buy' ? !quoteBalance : !baseBalance;
  })();

  return (
    <article className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20">
      <hgroup>
        <h3 className="text-16 font-weight-500 flex items-center gap-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px] text-white/60">
            2
          </span>
          {getTitle(editType)}
        </h3>
        <p className="text-14 text-white/80">{getDescription(editType)}</p>
      </hgroup>
      <BudgetInput
        editType={editType}
        token={anchor === 'buy' ? quote : base}
        value={budgetValue}
        onChange={setBudget}
        max={getMax()}
        error={error}
        warning={warning}
        disabled={disabled}
        data-testid="input-budget"
      />
    </article>
  );
};
