import { FC, ReactNode, useId } from 'react';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { Token } from 'libs/tokens';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Switch } from 'components/common/switch';
import { ReactComponent as IconDistributedEntireRange } from 'assets/distributedEntireRange.svg';
import { ReactComponent as IconDistributedUnusedRange } from 'assets/distributedUnusedRange.svg';
import { TooltipTokenAmount } from 'components/strategies/edit/tooltip/TooltipTokenAmount';
import { TooltipTokenRange } from 'components/strategies/edit/tooltip/TooltipTokenRange';
import { BaseOrder } from 'components/strategies/common/types';
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
      className="rounded-8 p-15 text-12 font-weight-500 flex flex-col gap-10 border-2 border-white/10 text-left"
    >
      <div role="row" className="flex items-center justify-between gap-16">
        <p role="columnheader" className="flex w-auto items-center gap-6">
          Allocated Budget
          <Tooltip
            iconClassName="h-13 text-white/60"
            element={`This is the current available ${token.symbol} budget you can withdraw`}
          />
        </p>
        <div role="cell" className="flex flex-1 justify-end gap-8">
          <TooltipTokenAmount amount={initialBudget ?? ''} token={token} />
        </div>
      </div>
      {children}
    </div>
  );
};

interface BudgetTokenPriceProps {
  order: BaseOrder;
  buy?: boolean;
}
export const EditBudgetTokenPrice: FC<BudgetTokenPriceProps> = (props) => {
  const { strategy } = useEditStrategyCtx();
  const { buy, order } = props;
  const isRange = order.min !== order.max;
  return (
    <div role="row" className="flex items-center justify-between gap-16">
      <p role="columnheader">{buy ? 'Buy' : 'Sell'} Price</p>
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
          iconClassName="h-13 text-white/60"
          element={
            <div className="flex flex-col gap-10">
              <div className="flex gap-8">
                <div>
                  <IconDistributedEntireRange />
                </div>
                <div>
                  <div className="text-12 font-weight-500 text-white">
                    Distribute Across Entire Range
                  </div>
                  <div className="text-10 text-white/60">
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
                  <div className="text-12 font-weight-500 text-white">
                    Distribute To Unused Range
                  </div>
                  <div className="text-10 text-white/60">
                    Price remains the same as it was. The budget is not
                    allocated to the new range.
                  </div>
                </div>
              </div>
            </div>
          }
        />
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
