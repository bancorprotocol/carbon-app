import { FC } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';
import { TokenLogo } from 'components/common/imager/Imager';
import { ReactComponent as IconDeposit } from 'assets/icons/deposit.svg';
import { ReactComponent as IconWithdraw } from 'assets/icons/withdraw.svg';
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
  setAnchor: (order: 'buy' | 'sell') => void;
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
    setAnchor,
    budgetValue,
    setBudget,
    errors,
  } = props;
  const baseBalance = useGetTokenBalance(base).data ?? '0';
  const quoteBalance = useGetTokenBalance(quote).data ?? '0';

  const setBudgetMode = (mode: BudgetMode) => {
    setBudget('');
    setMode(mode);
  };

  const getMax = () => {
    if (mode === 'deposit') {
      return anchor === 'buy' ? quoteBalance : baseBalance;
    } else {
      return anchor === 'buy' ? buyBudget : sellBudget;
    }
  };

  // TODO: split this into 3 components: anchor / mode / budget

  return (
    <>
      <article className="flex w-full flex-col gap-16 rounded-10 bg-background-900 p-20">
        <header className="flex items-center justify-between">
          <h2 className="text-18">Budget</h2>
          <Tooltip element="" />
        </header>
        <p className="text-14 text-white/80">
          Please specify which token you'd prefer to use as the anchor.
        </p>
        <h3 className="text-16 font-weight-500">Select Token</h3>
        <div role="radiogroup" className="flex gap-16">
          <input
            className={cn('absolute opacity-0', style.selectToken)}
            type="radio"
            id="anchor-buy"
            checked={anchor === 'buy'}
            onChange={(e) => e.target.checked && setAnchor('buy')}
          />
          <label
            htmlFor="anchor-buy"
            className="flex flex-1 cursor-pointer items-center justify-center gap-8 rounded-8 bg-black p-16 text-14"
          >
            <TokenLogo token={quote} size={14} />
            {quote.symbol}
          </label>
          <input
            className={cn('absolute opacity-0', style.selectToken)}
            type="radio"
            id="anchor-sell"
            checked={anchor === 'sell'}
            onChange={(e) => e.target.checked && setAnchor('sell')}
          />
          <label
            htmlFor="anchor-sell"
            className="flex flex-1 cursor-pointer items-center justify-center gap-8 rounded-8 bg-black p-16 text-14"
          >
            <TokenLogo token={base} size={14} />
            {base.symbol}
          </label>
        </div>
      </article>
      {anchor && (
        <article className="flex w-full flex-col gap-16 rounded-10 bg-background-900 p-20">
          <hgroup>
            <h3 className="text-16 font-weight-500">Edit Budget</h3>
            <p className="text-14 text-white/80">
              Please select the action and amount of tokens
            </p>
          </hgroup>
          <div
            role="radiogroup"
            className="flex gap-2 self-start rounded-full border-2 border-background-700 p-6"
          >
            <input
              className={cn('absolute opacity-0', style.budgetMode)}
              type="radio"
              id="select-deposit"
              checked={mode === 'deposit'}
              onChange={(e) => e.target.checked && setBudgetMode('deposit')}
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
              id="select-withdraw"
              checked={mode === 'withdraw'}
              onChange={(e) => e.target.checked && setBudgetMode('withdraw')}
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
        </article>
      )}
    </>
  );
};
