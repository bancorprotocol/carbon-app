import { FC, useEffect, useState } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';
import { TokenLogo } from 'components/common/imager/Imager';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { OrderCreate } from '../create/useOrder';
import { OverlappingBudgetDistribution } from './OverlappingBudgetDistribution';

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

  // Keep initial budget as reference
  useEffect(() => {
    console.log('Set initial budget', order0.budget, order1.budget);
    setBuyBudget(order0.budget);
    setSellBudget(order1.budget);
  }, []);

  const setAnchor = (order: 'buy' | 'sell') => {
    order0.setBudget(buyBudget);
    order1.setBudget(sellBudget);
    setAnchoredOrder(order);
  };

  return (
    <>
      <article className="flex w-full flex-col gap-20 rounded-10 bg-background-900 p-20">
        <header>
          <h2>Budget</h2>
          <Tooltip element="" />
        </header>
        <p>Please specify which token you'd prefer to use as the anchor.</p>
        <h3>Select Token</h3>
        <div role="radiogroup" className="flex gap-16">
          <input
            className="absolute opacity-0"
            type="radio"
            id="anchor-buy"
            checked={anchoredOrder === 'buy'}
            onChange={(e) => e.target.checked && setAnchor('buy')}
          />
          <label
            htmlFor="anchor-buy"
            className="flex flex-1 items-center justify-center gap-8 rounded-8 bg-black p-16 text-14"
          >
            <TokenLogo token={quote} size={14} />
            {quote.symbol}
          </label>
          <input
            className="absolute opacity-0"
            type="radio"
            id="anchor-sell"
            checked={anchoredOrder === 'sell'}
            onChange={(e) => e.target.checked && setAnchor('sell')}
          />
          <label
            htmlFor="anchor-sell"
            className="flex flex-1 items-center justify-center gap-8 rounded-8 bg-black p-16 text-14"
          >
            <TokenLogo token={base} size={14} />
            {base.symbol}
          </label>
        </div>
      </article>
      {anchoredOrder && (
        <article className="flex w-full flex-col gap-20 rounded-10 bg-background-900 p-20">
          <h3>Budget Amount</h3>
          <p>Please enter the amount of tokens you want to deposit.</p>
          <TokenInputField
            token={anchoredOrder === 'buy' ? quote : base}
            value={anchoredOrder === 'buy' ? order0.budget : order1.budget}
            setValue={
              anchoredOrder === 'buy' ? order0.setBudget : order1.setBudget
            }
          />
        </article>
      )}
      {anchoredOrder && (
        <article className="flex w-full flex-col gap-20 rounded-10 bg-background-900 p-20">
          <h3>Distribution</h3>
          <p>
            Following the edits implemented above, these are the changes in
            budget allocation
          </p>
          <OverlappingBudgetDistribution
            token={quote}
            initialBudget={buyBudget}
            updatedBudget={order0.budget}
            buy
          />
          <OverlappingBudgetDistribution
            token={base}
            initialBudget={sellBudget}
            updatedBudget={order1.budget}
          />
        </article>
      )}
    </>
  );
};
