import { FC, useEffect, useRef, useState } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Imager } from 'components/common/imager/Imager';
import { Token } from 'libs/tokens';
import { sanitizeNumberInput } from 'utils/helpers';
import { Switch } from 'components/common/switch';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { ReactComponent as IconDistributedEntireRange } from 'assets/distributedEntireRange.svg';
import { ReactComponent as IconDistributedUnusedRange } from 'assets/distributedUnusedRange.svg';

export const ModalEditStrategyAllocatedBudget: FC<{
  order: OrderCreate;
  base: Token;
  quote: Token;
  balance?: string;
  buy?: boolean;
}> = ({ base, quote, balance, buy, order }) => {
  const firstTime = useRef(true);
  const [isDistribute, setIsDistribute] = useState(true);
  const [showDistribute, setShowDistribute] = useState(false);

  useEffect(() => {
    if (!firstTime.current && order.isRange) {
      setShowDistribute(true);
    }
    if (!order.isRange) {
      setShowDistribute(false);
    }
    firstTime.current = false;
  }, [order.max, order.min, order.isRange]);

  return (
    <div className="flex w-full flex-col rounded-8 border-2 border-emphasis p-15 text-left font-mono text-12 font-weight-500">
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="mr-5">Allocated Budget</div>
          <Tooltip
            iconClassName="h-13 text-white/60"
            element={
              buy
                ? `This is the available amount of ${quote?.symbol} tokens that you are willing to use in order to buy ${base?.symbol}.`
                : `This is the available amount of ${base?.symbol} tokens that you are willing to sell.`
            }
          />
        </div>
        <div className="flex">
          {balance && (
            <span>
              {sanitizeNumberInput(
                balance,
                buy ? quote?.decimals : base?.decimals
              )}
            </span>
          )}
          <Imager
            className="ml-8 h-16 w-16"
            src={buy ? quote?.logoURI : base?.logoURI}
            alt="token"
          />
        </div>
      </div>
      {showDistribute && (
        <div className="mt-10 flex justify-between">
          <div className="flex items-center">
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
          </div>
          <Switch
            variant={isDistribute ? 'white' : 'black'}
            isOn={isDistribute}
            setIsOn={(isOn) => setIsDistribute(isOn)}
            size={'sm'}
          />
        </div>
      )}
    </div>
  );
};
