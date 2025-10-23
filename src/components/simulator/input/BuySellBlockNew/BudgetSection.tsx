import { Tooltip } from 'components/common/tooltip/Tooltip';
import {
  StrategyInputDispatch,
  StrategyInputOrder,
} from 'hooks/useStrategyInput';
import { Token } from 'libs/tokens';
import { FC, useEffect, useId } from 'react';
import { StrategyType } from 'libs/routing';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { UseQueryResult } from '@tanstack/react-query';
import { SafeDecimal } from 'libs/safedecimal';
import { Warning } from 'components/common/WarningMessageWithIcon';

interface Props {
  base: Token;
  quote: Token;
  order: StrategyInputOrder;
  dispatch: StrategyInputDispatch;
  strategyType?: StrategyType;
  tokenBalanceQuery?: UseQueryResult<string>;
  isBudgetOptional?: boolean;
  isBuy?: boolean;
}

export const BudgetSection: FC<Props> = ({
  isBuy,
  quote,
  base,
  strategyType,
  order,
  dispatch,
  isBudgetOptional,
  tokenBalanceQuery,
}) => {
  const inputId = useId();
  const type = isBuy ? 'buy' : 'sell';
  const budgetToken = isBuy ? quote : base;
  const insufficientBalance =
    tokenBalanceQuery &&
    !tokenBalanceQuery?.isPending &&
    new SafeDecimal(tokenBalanceQuery?.data || 0).lt(order.budget);

  useEffect(() => {
    if (tokenBalanceQuery?.data) return;
    if (insufficientBalance) {
      dispatch(`${type}BudgetError`, 'Insufficient balance');
    } else {
      dispatch(`${type}BudgetError`, '');
    }
  }, [insufficientBalance, type, dispatch, tokenBalanceQuery?.data]);

  return (
    <div role="group" className="grid gap-8">
      <h3 className="text-14 font-medium flex items-center gap-8">
        <Tooltip
          element={
            isBuy
              ? `The amount of ${
                  quote.symbol
                } tokens you would like to use in order to buy ${
                  base.symbol
                }. ${
                  strategyType === 'recurring'
                    ? 'Note: this amount will re-fill once the "Sell" order is used by traders.'
                    : ''
                }`
              : `The amount of ${base.symbol} tokens you would like to sell. ${
                  strategyType === 'recurring'
                    ? 'Note: this amount will re-fill once the "Buy" order is used by traders.'
                    : ''
                }`
          }
        >
          <span className="text-white/80">Budget</span>
        </Tooltip>
        {isBudgetOptional && (
          <span className="font-medium ml-8 text-white/60">Optional</span>
        )}
      </h3>
      <TokenInputField
        id={inputId}
        className="rounded-2xl border border-transparent bg-black hover:bg-black/40 p-16 focus-within:border-white/60"
        value={order.budget}
        setValue={(value) => dispatch(`${type}Budget`, value)}
        token={budgetToken}
        isBalanceLoading={tokenBalanceQuery?.isPending}
        balance={tokenBalanceQuery?.data}
        isError={insufficientBalance}
        data-testid="input-budget"
      />
      {insufficientBalance && (
        <Warning htmlFor={inputId} isError>
          Insufficient balance
        </Warning>
      )}
    </div>
  );
};
