import { FC, useMemo } from 'react';
import { Token } from 'libs/tokens';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import BigNumber from 'bignumber.js';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useGetTokenBalance } from 'libs/queries';
import { EditStrategyAllocatedBudget } from './EditStrategyAllocatedBudget';
import { useTranslation } from 'libs/translations';

export const EditStrategyBudgetBuySellBlock: FC<{
  base: Token;
  quote: Token;
  order: OrderCreate;
  balance?: string;
  buy?: boolean;
  isBudgetOptional?: boolean;
  type: 'deposit' | 'withdraw';
}> = ({ base, quote, balance, buy, order, isBudgetOptional, type }) => {
  const { t } = useTranslation();
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

  const buyOrSellText = buy
    ? t('pages.strategyEdit.section2.content3')
    : t('pages.strategyEdit.section2.content4');

  return (
    <div
      className={`bg-secondary w-full rounded-6 border-l-2 p-20 text-left ${
        buy
          ? 'border-green/50 focus-within:border-green'
          : 'border-red/50 focus-within:border-red'
      }`}
    >
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center">
          <div>
            {`${
              type === 'withdraw'
                ? t('pages.strategyEdit.section2.titles.title1', {
                    buyOrSell: buyOrSellText,
                  })
                : t('pages.strategyEdit.section2.titles.title2', {
                    buyOrSell: buyOrSellText,
                  })
            }`}
          </div>
          {isBudgetOptional && (
            <div className="ml-8 text-14 font-weight-500 text-white/40">
              {t('pages.strategyEdit.section2.content1')}
            </div>
          )}
        </div>
        <Tooltip
          element={
            type === 'withdraw'
              ? t('pages.strategyEdit.tooltips.tooltip1')
              : t('pages.strategyEdit.tooltips.tooltip2')
          }
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
        {t('pages.strategyEdit.section2.content2')}
      </div>
      <div className="pt-10">
        <EditStrategyAllocatedBudget
          {...{ order, base, quote, balance, buy, type }}
          {...(type === 'withdraw' && {
            showMaxCb: () => order.setBudget(balance || ''),
          })}
        />
      </div>
    </div>
  );
};
