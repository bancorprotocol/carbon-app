import { FC, useId } from 'react';
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
import { getDeposit, getWithdraw } from './utils';
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
  const tokenBalanceQuery = buy
    ? tokenQuoteBalanceQuery
    : tokenBaseBalanceQuery;
  const budgetToken = buy ? quote : base;

  const budget =
    type === 'deposit'
      ? getDeposit(initialBudget, order.budget)
      : getWithdraw(initialBudget, order.budget);

  const setBudget = (value: string) => {
    const amount =
      type === 'deposit'
        ? new SafeDecimal(initialBudget).add(value || '0')
        : new SafeDecimal(initialBudget).sub(value || '0');
    order.setBudget(amount.toString());
  };

  const tokenBalance = tokenBalanceQuery.data || 0;
  const insufficientBalance =
    type === 'withdraw'
      ? new SafeDecimal(initialBudget || 0).lt(budget)
      : new SafeDecimal(tokenBalance).lt(budget);

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
    <section
      aria-labelledby={titleId}
      className={`flex flex-col gap-20 rounded-6 border-l-2 bg-background-900 p-20 text-left ${
        buy
          ? 'border-buy/50 focus-within:border-buy'
          : 'border-sell/50 focus-within:border-sell'
      }`}
      data-testid={`${buy ? 'buy' : 'sell'}-section`}
    >
      <header className="flex items-center justify-between">
        <h3 id={titleId} className="flex items-center gap-8 text-18">
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
        />
      </header>
      <TokenInputField
        id={inputId}
        className="rounded-16 bg-black p-16"
        value={budget}
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
        <WarningMessageWithIcon
          htmlFor={inputId}
          isError
          message="Insufficient balance"
        />
      )}
      <EditStrategyAllocatedBudget
        {...budgetProps}
        initialBudget={initialBudget}
        showMax={type === 'withdraw'}
      />
      <FullOutcome
        price={order.price}
        min={order.min}
        max={order.max}
        budget={order.budget}
        budgetUpdate={budget}
        buy={buy}
        base={base}
        quote={quote}
      />
    </section>
  );
};
