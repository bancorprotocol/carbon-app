import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Token } from 'libs/tokens';
import { FC, useId } from 'react';
import { StrategyType } from 'libs/routing';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { SafeDecimal } from 'libs/safedecimal';
import { WarningMessageWithIcon } from 'components/common/WarningMessageWithIcon';
import { useGetTokenBalance } from 'libs/queries';
import { BaseOrder } from 'components/strategies/create/types';

interface Props {
  base: Token;
  quote: Token;
  order: BaseOrder;
  setBudget: (budget: string) => void;
  strategyType?: StrategyType;
  optional?: boolean;
  buy?: boolean;
}

export const InputBudget: FC<Props> = ({
  buy,
  quote,
  base,
  strategyType,
  order,
  setBudget,
  optional,
}) => {
  const inputId = useId();
  const budgetToken = buy ? quote : base;
  const balance = useGetTokenBalance(budgetToken);
  const insufficientBalance = (() => {
    if (balance.isLoading) return false;
    return new SafeDecimal(balance.data || 0).lt(order.budget);
  })();

  const tooltipText = () => {
    if (buy) {
      const note =
        strategyType === 'recurring'
          ? 'Note: this amount will re-fill once the "Sell" order is used by traders.'
          : '';
      return `The amount of ${quote.symbol} tokens you would like to use in order to buy ${base.symbol}. ${note}`;
    } else {
      const note =
        strategyType === 'recurring'
          ? 'Note: this amount will re-fill once the "Buy" order is used by traders.'
          : '';
      return `The amount of ${base.symbol} tokens you would like to sell. ${note}`;
    }
  };

  return (
    <fieldset className="flex flex-col gap-8">
      <legend className="text-14 font-weight-500 mb-11 flex items-center gap-6">
        <span className="flex size-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
          2
        </span>
        <Tooltip sendEventOnMount={{ buy }} element={tooltipText()}>
          <span className="text-white/80">
            Set {buy ? 'Buy' : 'Sell'} Budget&nbsp;
          </span>
        </Tooltip>
        {optional && (
          <span className="font-weight-500 ml-8 text-white/60">Optional</span>
        )}
      </legend>
      <TokenInputField
        id={inputId}
        className="rounded-16 bg-black p-16"
        value={order.budget}
        setValue={setBudget}
        token={budgetToken}
        isBalanceLoading={balance.isLoading}
        balance={balance.data}
        isError={insufficientBalance}
        data-testid="input-budget"
      />
      {insufficientBalance && (
        <WarningMessageWithIcon htmlFor={inputId} isError>
          Insufficient balance
        </WarningMessageWithIcon>
      )}
    </fieldset>
  );
};
