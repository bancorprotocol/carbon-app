import { FC, useState } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';
import { TokenLogo } from 'components/common/imager/Imager';
import { OrderCreate } from '../create/useOrder';
import {
  OverlappingBudgetDescription,
  OverlappingBudgetDistribution,
} from './OverlappingBudgetDistribution';
import { ReactComponent as IconDeposit } from 'assets/icons/deposit.svg';
import { ReactComponent as IconWithdraw } from 'assets/icons/withdraw.svg';
import { useGetTokenBalance } from 'libs/queries';
import style from './OverlappingBudget.module.css';
import { cn } from 'utils/helpers';
import { BudgetInput } from '../common/BudgetInput';

export type BudgetMode = 'deposit' | 'withdraw';

interface Props {
  base: Token;
  quote: Token;
  order0: OrderCreate;
  order1: OrderCreate;
  anchoredOrder?: 'buy' | 'sell';
  setAnchoredOrder: (order: 'buy' | 'sell') => void;
}

export const OverlappingBudget: FC<Props> = (props) => {
  const { base, quote, order0, order1, anchoredOrder, setAnchoredOrder } =
    props;
  const [buyBudget, setBuyBudget] = useState<string>('');
  const [sellBudget, setSellBudget] = useState<string>('');
  const [budgetMode, setBudgetMode] = useState<BudgetMode>('deposit');
  const [buyMode, setBuyMode] = useState<BudgetMode>('deposit');
  const [sellMode, setSellMode] = useState<BudgetMode>('deposit');
  const baseBalance = useGetTokenBalance(base);
  const quoteBalance = useGetTokenBalance(quote);

  const setMode = (mode: 'deposit' | 'withdraw') => {
    setBuyBudget('');
    setSellBudget('');
    setBuyMode(mode);
    setSellMode(mode);
    setBudgetMode(mode);
  };

  // const setBuyBudget = (
  //   sellBudget: string,
  //   buyMin: string,
  //   sellMax: string
  // ) => {
  //   if (!base || !quote) return;
  //   if (!sellBudget) return order0.setBudget('');
  //   const buyBudget = calculateOverlappingBuyBudget(
  //     base.decimals,
  //     quote.decimals,
  //     buyMin,
  //     sellMax,
  //     marketPrice.toString(),
  //     spread.toString(),
  //     sellBudget
  //   );
  //   order0.setBudget(buyBudget);
  // };

  // const setSellBudget = (
  //   buyBudget: string,
  //   buyMin: string,
  //   sellMax: string
  // ) => {
  //   if (!base || !quote) return;
  //   if (!buyBudget) order1.setBudget('');
  //   const sellBudget = calculateOverlappingSellBudget(
  //     base.decimals,
  //     quote.decimals,
  //     buyMin,
  //     sellMax,
  //     marketPrice.toString(),
  //     spread.toString(),
  //     buyBudget
  //   );
  //   order1.setBudget(sellBudget);
  // };

  const setBudget = (value: string) => {
    if (anchoredOrder === 'buy') {
      setBuyBudget(value);
    } else {
      setSellBudget(value);
    }
  };

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
            checked={anchoredOrder === 'buy'}
            onChange={(e) => e.target.checked && setAnchoredOrder('buy')}
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
            checked={anchoredOrder === 'sell'}
            onChange={(e) => e.target.checked && setAnchoredOrder('sell')}
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
      {anchoredOrder && (
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
              checked={budgetMode === 'deposit'}
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
              id="select-withdraw"
              checked={budgetMode === 'withdraw'}
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
            token={anchoredOrder === 'buy' ? quote : base}
            query={anchoredOrder === 'buy' ? quoteBalance : baseBalance}
            order={anchoredOrder === 'buy' ? order0 : order1}
            onChange={setBudget}
            withoutWallet={budgetMode === 'deposit'}
          />
        </article>
      )}
      {anchoredOrder && (
        <article className="flex w-full flex-col gap-16 rounded-10 bg-background-900 p-20">
          <hgroup>
            <h3 className="text-16 font-weight-500">Distribution</h3>
            <p className="text-14 text-white/80">
              Following the edits implemented above, these are the changes in
              budget allocation
            </p>
          </hgroup>
          <OverlappingBudgetDistribution
            token={quote}
            initialBudget={order0.budget}
            deltaBudget={buyBudget}
            balance={quoteBalance.data ?? '0'}
            mode={sellMode}
          />
          <OverlappingBudgetDescription
            token={quote}
            deltaBudget={buyBudget}
            mode={sellMode}
          />
          <OverlappingBudgetDistribution
            token={base}
            initialBudget={order1.budget}
            deltaBudget={sellBudget}
            balance={baseBalance.data ?? '0'}
            mode={buyMode}
            buy
          />
          <OverlappingBudgetDescription
            token={base}
            deltaBudget={sellBudget}
            mode={buyMode}
          />
        </article>
      )}
    </>
  );
};
