import { FC, useId } from 'react';
import { SafeDecimal } from 'libs/safedecimal';
import { Token } from 'libs/tokens';
import { useGetTokenBalance } from 'libs/queries';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { EditStrategyAllocatedBudget } from './EditStrategyAllocatedBudget';
import { FullOutcome } from '../FullOutcome';
import { getUpdatedBudget } from 'utils/fullOutcome';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

export const EditStrategyBudgetBuySellBlock: FC<{
  base: Token;
  quote: Token;
  order: OrderCreate;
  balance?: string;
  buy?: boolean;
  isBudgetOptional?: boolean;
  type: 'deposit' | 'withdraw';
}> = ({ base, quote, balance, buy, order, isBudgetOptional, type }) => {
  const inputId = useId();
  const titleId = useId();
  const tokenBaseBalanceQuery = useGetTokenBalance(base);
  const tokenQuoteBalanceQuery = useGetTokenBalance(quote);
  const tokenBalanceQuery = buy
    ? tokenQuoteBalanceQuery
    : tokenBaseBalanceQuery;
  const budgetToken = buy ? quote : base;

  const calculatedWalletBalance = new SafeDecimal(
    tokenBalanceQuery.data || 0
  ).minus(new SafeDecimal(order.budget || 0));

  const insufficientBalance =
    type === 'withdraw'
      ? new SafeDecimal(balance || 0).lt(order.budget)
      : calculatedWalletBalance.lt(0);

  const budgetProps = {
    base,
    quote,
    balance,
    buy,
    type,
  };

  return (
    <section
      aria-labelledby={titleId}
      className={`bg-secondary flex flex-col gap-20 rounded-6 border-l-2 p-20 text-left ${
        buy
          ? 'border-green/50 focus-within:border-green'
          : 'border-red/50 focus-within:border-red'
      }`}
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
        value={order.budget}
        setValue={order.setBudget}
        token={budgetToken}
        isBalanceLoading={tokenBalanceQuery.isLoading}
        isError={insufficientBalance}
        balance={tokenBalanceQuery.data}
        withoutWallet={type === 'withdraw'}
      />
      {insufficientBalance && (
        <output
          htmlFor={inputId}
          role="alert"
          aria-live="polite"
          className="flex items-center gap-10 font-mono text-12 text-red"
        >
          <IconWarning className="h-12 w-12" />
          <span className="flex-1">Insufficient balance</span>
        </output>
      )}
      <EditStrategyAllocatedBudget
        order={order}
        {...budgetProps}
        {...(type === 'withdraw' && {
          showMaxCb: () => order.setBudget(balance || ''),
        })}
      />
      <FullOutcome
        price={order.price}
        min={order.min}
        max={order.max}
        budget={getUpdatedBudget(type, balance, order.budget)}
        budgetUpdate={order.budget}
        buy={buy}
        base={base}
        quote={quote}
      />
    </section>
  );
};
