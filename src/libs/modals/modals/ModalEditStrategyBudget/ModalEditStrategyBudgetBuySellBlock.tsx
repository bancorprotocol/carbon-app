import { FC } from 'react';
import { Token } from 'libs/tokens';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { ModalEditStrategyAllocatedBudget } from '../ModalEditStrategy/ModalEditStrategyAllocatedBudget';
import { TokenInputField } from 'components/common/TokenInputField';
import BigNumber from 'bignumber.js';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useGetTokenBalance } from 'libs/queries';

export const ModalEditStrategyBudgetBuySellBlock: FC<{
  base: Token;
  quote: Token;
  order: OrderCreate;
  balance?: string;
  buy?: boolean;
  isBudgetOptional?: boolean;
  type?: 'deposit' | 'withdraw';
}> = ({ base, quote, balance, buy, order, isBudgetOptional, type }) => {
  const tokenBaseBalanceQuery = useGetTokenBalance(base);
  const tokenQuoteBalanceQuery = useGetTokenBalance(quote);
  const tokenBalanceQuery = buy
    ? tokenQuoteBalanceQuery
    : tokenBaseBalanceQuery;
  const budgetToken = buy ? quote : base;

  const calculatedWalletBalance = new BigNumber(
    tokenBalanceQuery.data || 0
  ).minus(new BigNumber(order.budget || 0));

  const insufficientBalance =
    type === 'withdraw'
      ? new BigNumber(balance || 0).lt(order.budget)
      : calculatedWalletBalance.lt(0);

  return (
    <div
      className={`w-full border-l-2 pl-10 text-left ${
        buy
          ? 'border-green/50 focus-within:border-green'
          : 'border-red/50 focus-within:border-red'
      }`}
    >
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center">
          <div>
            {`${type === 'withdraw' ? 'Withdraw' : 'Deposit'}`}{' '}
            {buy ? 'Buy' : 'Sell'} Budget
          </div>
          {isBudgetOptional && (
            <div className="ml-8 text-14 font-weight-500 text-white/40">
              Optional
            </div>
          )}
        </div>
        <Tooltip
          element={`Indicate the amount you wish to ${
            type === 'withdraw' ? 'withdraw' : 'deposit'
          } from the available "allocated budget"`}
        />
      </div>
      <TokenInputField
        className={'mr-4 rounded-16 bg-black p-16'}
        value={order.budget}
        setValue={order.setBudget}
        token={budgetToken}
        isBalanceLoading={tokenBalanceQuery.isLoading}
        isError={insufficientBalance}
        balance={tokenBalanceQuery.data}
        withoutWallet={type === 'withdraw'}
      />
      <div
        className={`mt-10 text-center text-12 text-red ${
          !insufficientBalance ? 'invisible' : ''
        }`}
      >
        Insufficient balance
      </div>
      <div className="pt-10">
        <ModalEditStrategyAllocatedBudget
          {...{ order, base, quote, balance, buy }}
          {...(type === 'withdraw' && {
            showMaxCb: () => order.setBudget(balance || ''),
          })}
        />
      </div>
    </div>
  );
};
