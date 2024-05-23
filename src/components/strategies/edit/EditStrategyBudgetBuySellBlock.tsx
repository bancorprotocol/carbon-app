import { FC, useId, useState } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { useGetTokenBalance } from 'libs/queries';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { EditStrategyAllocatedBudget } from './EditStrategyAllocatedBudget';
import { FullOutcome } from '../FullOutcome';
import { useMarketIndication } from '../marketPriceIndication';
import { OutsideMarketPriceWarning } from 'components/common/OutsideMarketPriceWarning';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';

interface Props {
  base: Token;
  quote: Token;
  order: OrderCreate;
  initialBudget: string;
  buy?: boolean;
  isBudgetOptional?: boolean;
  type: 'deposit' | 'withdraw';
}

export const EditStrategyBudgetBuySellBlock: FC<Props> = (props) => {
  const { base, quote, initialBudget, buy, order, isBudgetOptional, type } =
    props;
  const inputId = useId();
  const titleId = useId();
  const tokenBaseBalanceQuery = useGetTokenBalance(base);
  const tokenQuoteBalanceQuery = useGetTokenBalance(quote);
  const [delta, setDelta] = useState('');
  const tokenBalanceQuery = buy
    ? tokenQuoteBalanceQuery
    : tokenBaseBalanceQuery;
  const budgetToken = buy ? quote : base;

  const setBudget = (value: string) => {
    setDelta(value);
    const amount =
      type === 'deposit'
        ? new SafeDecimal(initialBudget).add(value || '0')
        : new SafeDecimal(initialBudget).sub(value || '0');
    order.setBudget(amount.toString());
  };

  const tokenBalance = tokenBalanceQuery.data || 0;
  const insufficientBalance =
    type === 'withdraw'
      ? new SafeDecimal(initialBudget || 0).lt(delta)
      : new SafeDecimal(tokenBalance).lt(delta);

  const { isOrderAboveOrBelowMarketPrice } = useMarketIndication({
    base,
    quote,
    order,
    buy,
  });

  const budgetProps = {
    order,
    base,
    quote,
    buy,
    type,
  };

  return (
    <article
      aria-labelledby={titleId}
      className={`rounded-6 bg-background-900 flex flex-col gap-20 border-l-2 p-20 text-left ${
        buy
          ? 'border-buy/50 focus-within:border-buy'
          : 'border-sell/50 focus-within:border-sell'
      }`}
      data-testid={`${buy ? 'buy' : 'sell'}-section`}
    >
      <header className="flex items-center justify-between">
        <h3 id={titleId} className="text-18 flex items-center gap-8">
          <span>
            {`${type === 'withdraw' ? 'Withdraw' : 'Deposit'}`}{' '}
            {buy ? 'Buy' : 'Sell'} Budget
          </span>
          {isBudgetOptional && (
            <span className="text-14 font-weight-500 text-white/40">
              Optional
            </span>
          )}
        </h3>
        <Tooltip
          element={`Indicate the amount you wish to ${
            type === 'withdraw' ? 'withdraw' : 'deposit'
          } from the available "allocated budget"`}
          iconClassName="text-white/60"
        />
      </header>
      <TokenInputField
        id={inputId}
        className="rounded-16 bg-black p-16"
        value={delta}
        setValue={setBudget}
        token={budgetToken}
        isBalanceLoading={tokenBalanceQuery.isLoading}
        isError={insufficientBalance}
        balance={tokenBalanceQuery.data}
        withoutWallet={type === 'withdraw'}
        data-testid="input-budget"
      />
      {isOrderAboveOrBelowMarketPrice && (
        <OutsideMarketPriceWarning base={base} buy={!!buy} />
      )}
      {insufficientBalance && (
        <WarningMessageWithIcon htmlFor={inputId} isError>
          Insufficient balance
        </WarningMessageWithIcon>
      )}
      <EditStrategyAllocatedBudget
        {...budgetProps}
        initialBudget={initialBudget}
        setMax={type === 'withdraw' ? setBudget : undefined}
      />
      <FullOutcome
        price={order.price}
        min={order.min}
        max={order.max}
        budget={order.budget}
        budgetUpdate={delta}
        buy={buy}
        base={base}
        quote={quote}
      />
    </article>
  );
};
