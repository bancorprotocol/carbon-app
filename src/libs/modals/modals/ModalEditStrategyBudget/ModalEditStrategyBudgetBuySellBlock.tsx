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
}> = ({ base, quote, balance, buy, order }) => {
  const tokenBaseBalanceQuery = useGetTokenBalance(base);
  const tokenQuoteBalanceQuery = useGetTokenBalance(quote);
  const tokenBalanceQuery = buy
    ? tokenBaseBalanceQuery
    : tokenQuoteBalanceQuery;
  const budgetToken = buy ? quote : base;
  const insufficientBalance = new BigNumber(balance || 0).lt(order.budget);

  return (
    <div
      className={`w-full border-l-2 pl-10 text-left ${
        buy
          ? 'border-green/50 focus-within:border-green'
          : 'border-red/50 focus-within:border-red'
      }`}
    >
      <div className="mb-10 flex justify-between">
        <div className={'font-weight-500 text-white/60'}>
          {buy ? 'Buy' : 'Sell'} Budget
        </div>
        <Tooltip element={<>???</>} />
      </div>
      <TokenInputField
        className={'mr-4 rounded-16 bg-black p-16'}
        value={order.budget}
        setValue={order.setBudget}
        token={budgetToken}
        isBalanceLoading={tokenBalanceQuery.isLoading}
        isError={insufficientBalance}
        withoutWallet
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
        />
      </div>
    </div>
  );
};
