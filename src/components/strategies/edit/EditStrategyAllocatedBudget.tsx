import { FC, ReactNode, useId } from 'react';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { Token } from 'libs/tokens';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import IconTooltip from 'assets/icons/tooltip.svg?react';
import { Switch } from 'components/common/switch';
import IconDistributedEntireRange from 'assets/distributedEntireRange.svg?react';
import IconDistributedUnusedRange from 'assets/distributedUnusedRange.svg?react';
import { TooltipTokenAmount } from 'components/strategies/edit/tooltip/TooltipTokenAmount';
import { TooltipTokenRange } from 'components/strategies/edit/tooltip/TooltipTokenRange';
import { FormStaticOrder } from 'components/strategies/common/types';
import { useEditStrategyCtx } from './EditStrategyContext';

interface Props {
  initialBudget: string;
  token: Token;
  children?: ReactNode;
}
export const EditStrategyAllocatedBudget: FC<Props> = ({
  token,
  initialBudget,
  children,
}) => {
  return (
    <div
      role="table"
      className="rounded-md p-15 text-12 font-medium grid gap-8 border border-white/10 text-left"
    >
      <div role="row" className="grid grid-flow-col items-center gap-16">
        <p
          role="columnheader"
          className="flex items-center gap-8 justify-self-start"
        >
          Allocated Budget
          <Tooltip
            element={`This is the current available ${token.symbol} budget you can withdraw`}
          >
            <IconTooltip className="size-14 text-main-0/60" />
          </Tooltip>
        </p>
        <div role="cell" className="justify-self-end">
          <TooltipTokenAmount amount={initialBudget ?? ''} token={token} />
        </div>
      </div>
      {children}
    </div>
  );
};

interface BudgetTokenPriceProps {
  order: FormStaticOrder;
  isBuy?: boolean;
}
export const EditBudgetTokenPrice: FC<BudgetTokenPriceProps> = (props) => {
  const { strategy } = useEditStrategyCtx();
  const { isBuy, order } = props;
  const isRange = order.min !== order.max;
  return (
    <div role="row" className="flex items-center justify-between gap-16">
      <p role="columnheader">{isBuy ? 'Buy' : 'Sell'} Price</p>
      <div role="cell" className="flex flex-1 justify-end gap-8">
        <div className="flex items-center">
          {/* Limit Strategy Price */}
          {!isRange && order.min && (
            <TooltipTokenAmount amount={order.min} token={strategy.quote} />
          )}
          {/* Range Strategy Price */}
          {isRange && !!order.min && !!order.max && (
            <TooltipTokenRange range={order} token={strategy.quote} />
          )}
        </div>
      </div>
    </div>
  );
};

interface BudgetDistributionProps {
  marginalPrice?: string;
  onChange: (marginalPrice: MarginalPriceOptions) => void;
}
export const EditBudgetDistribution: FC<BudgetDistributionProps> = (props) => {
  const id = useId();
  const { marginalPrice, onChange } = props;
  const checked = marginalPrice !== MarginalPriceOptions.maintain;
  return (
    <div role="row" className="flex justify-between">
      <p role="columnheader" className="flex items-center">
        <label htmlFor={id} className="mr-5" data-testid="distribute-budget">
          Distribute Across Entire Range
        </label>
        <Tooltip
          element={
            <div className="flex flex-col gap-10">
              <div className="flex gap-8">
                <div>
                  <IconDistributedEntireRange />
                </div>
                <div>
                  <div className="text-12 font-medium text-main-0">
                    Distribute Across Entire Range
                  </div>
                  <div className="text-10 text-main-0/60">
                    The budget is allocated to the entire newly set range and
                    the asking price is updated.
                  </div>
                </div>
              </div>
              <div className="flex gap-8">
                <div>
                  <IconDistributedUnusedRange />
                </div>
                <div>
                  <div className="text-12 font-medium text-main-0">
                    Distribute To Unused Range
                  </div>
                  <div className="text-10 text-main-0/60">
                    Price remains the same as it was. The budget is not
                    allocated to the new range.
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <IconTooltip className="h-13 text-main-0/60" />
        </Tooltip>
      </p>
      <Switch
        id={id}
        size="sm"
        role="cell"
        variant={checked ? 'white' : 'black'}
        isOn={checked}
        setIsOn={(isOn) =>
          onChange(
            isOn ? MarginalPriceOptions.reset : MarginalPriceOptions.maintain,
          )
        }
      />
    </div>
  );
};
