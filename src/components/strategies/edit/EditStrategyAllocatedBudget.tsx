import { FC, useMemo, useRef } from 'react';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { Token } from 'libs/tokens';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Switch } from 'components/common/switch';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { EditTypes } from 'libs/routing';
import { ReactComponent as IconDistributedEntireRange } from 'assets/distributedEntireRange.svg';
import { ReactComponent as IconDistributedUnusedRange } from 'assets/distributedUnusedRange.svg';
import { TooltipTokenAmount } from 'components/strategies/edit/tooltip/TooltipTokenAmount';
import { TooltipTokenRange } from 'components/strategies/edit/tooltip/TooltipTokenRange';

const shouldDisplayDistributeByType: {
  [key in EditTypes]: boolean;
} = {
  renew: false,
  editPrices: false,
  deposit: true,
  withdraw: true,
};

interface Props {
  order: OrderCreate;
  initialBudget: string;
  base: Token;
  quote: Token;
  buy?: boolean;
  type: EditTypes;
  showMax?: boolean;
}
export const EditStrategyAllocatedBudget: FC<Props> = ({
  base,
  quote,
  order,
  initialBudget,
  type,
  buy = false,
  showMax = false,
}) => {
  const firstTime = useRef(true);
  const isDistributeToggleOn =
    order.marginalPriceOption === MarginalPriceOptions.reset ||
    !order.marginalPriceOption;

  const showDistribute = useMemo(() => {
    if (!shouldDisplayDistributeByType[type]) return false;
    if (!order.isRange) return false;
    if (!firstTime.current) {
      firstTime.current = true;
      return false;
    }
    return order.budget !== initialBudget;
  }, [initialBudget, order.budget, order.isRange, type]);

  return (
    <>
      <div
        role="table"
        className="flex flex-col gap-10 rounded-8 border-2 border-white/10 p-15 text-left font-mono text-12 font-weight-500"
      >
        <div role="row" className="flex items-center justify-between gap-16">
          <p role="columnheader" className="flex w-auto items-center gap-6">
            Allocated Budget
            <Tooltip
              sendEventOnMount={{ buy }}
              iconClassName="h-13 text-white/60"
              element={
                buy
                  ? `This is the current available ${quote?.symbol} budget you can withdraw`
                  : `This is the current available ${base?.symbol} budget you can withdraw`
              }
            />
          </p>
          <div role="cell" className="flex flex-1 justify-end gap-8">
            <TooltipTokenAmount
              amount={initialBudget ?? ''}
              token={buy ? quote : base}
            />
            {showMax && (
              <button
                type="button"
                onClick={() => order.setBudget('0')}
                className="cursor-pointer font-weight-500 text-primary"
              >
                MAX
              </button>
            )}
          </div>
        </div>

        {type !== 'editPrices' && (
          <div role="row" className="flex items-center justify-between gap-16">
            <p role="columnheader">{buy ? 'Buy' : 'Sell'} Price</p>
            <div role="cell" className="flex flex-1 justify-end gap-8">
              <div className="flex items-center">
                {/* Limit Strategy Price */}
                {!!order.price && (
                  <TooltipTokenAmount amount={order.price} token={quote} />
                )}
                {/* Range Strategy Price */}
                {!!order.min && !!order.max && (
                  <TooltipTokenRange range={order} token={quote} />
                )}
              </div>
            </div>
          </div>
        )}

        {showDistribute && (
          <div role="row" className="flex justify-between">
            <p role="columnheader" className="flex items-center">
              <span className="mr-5">Distribute Across Entire Range</span>
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
                          The budget is allocated to the entire newly set range
                          and the asking price is updated.
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
              role="cell"
              variant={isDistributeToggleOn ? 'white' : 'black'}
              isOn={isDistributeToggleOn}
              setIsOn={(isOn) =>
                order.setMarginalPriceOption(
                  isOn
                    ? MarginalPriceOptions.reset
                    : MarginalPriceOptions.maintain
                )
              }
              size="sm"
            />
          </div>
        )}
      </div>
      {type === 'editPrices' && showDistribute && (
        <div className="flex items-center gap-10 rounded-8 bg-white/5 p-12 text-left text-12 text-white/60">
          <Tooltip
            iconClassName="h-13 text-white/60"
            element={
              'When updating the rates, the allocated budget will be distributed equally across the entire range'
            }
          />
          Strategy budget will be distributed across entire range
        </div>
      )}
    </>
  );
};
