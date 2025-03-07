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
  buy?: boolean;
}

export const BudgetSection: FC<Props> = ({
  buy,
  quote,
  base,
  strategyType,
  order,
  dispatch,
  isBudgetOptional,
  tokenBalanceQuery,
}) => {
  const inputId = useId();
  const type = buy ? 'buy' : 'sell';
  const budgetToken = buy ? quote : base;
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
    <fieldset className="flex flex-col gap-8">
      <legend className="text-14 font-weight-500 mb-11 flex items-center gap-6">
        <span className="flex size-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
          2
        </span>
        <Tooltip
          element={
            buy
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
          <span className="capitalize text-white/80">Set {type} Budget</span>
        </Tooltip>
        {isBudgetOptional && (
          <span className="font-weight-500 ml-8 text-white/60">Optional</span>
        )}
      </legend>
      <TokenInputField
        id={inputId}
        className="rounded-16 bg-black p-16"
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
    </fieldset>
  );
};
