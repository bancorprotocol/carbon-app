import { FC, useEffect, useRef, useState } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Imager } from 'components/common/imager/Imager';
import { Token } from 'libs/tokens';
import { sanitizeNumberInput } from 'utils/helpers';
import { Switch } from 'components/common/switch';
import { OrderCreate } from 'components/strategies/create/useOrder';

export const ModalEditStrategyAllocatedBudget: FC<{
  order: OrderCreate;
  base: Token;
  quote: Token;
  balance?: string;
  buy?: boolean;
}> = ({ base, quote, balance, buy, order }) => {
  const numOfRenders = useRef(0);
  const [isDistribute, setIsDistribute] = useState(true);
  const [showDistribute, setShowDistribute] = useState(false);

  useEffect(() => {
    numOfRenders.current++;
    if (numOfRenders.current > 3 && order.isRange) {
      setShowDistribute(true);
    }
    if (!order.isRange) {
      setShowDistribute(false);
    }
  }, [order.isRange, order.min, order.max]);

  return (
    <div className="flex w-full flex-col rounded-8 border border-emphasis p-15 text-left font-mono text-12 font-weight-500">
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
                buy
                  ? `This is the available amount of ${quote?.symbol} tokens that you are willing to use in order to buy ${base?.symbol}.`
                  : `This is the available amount of ${base?.symbol} tokens that you are willing to sell.`
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
