import { FC, useEffect, useRef, useState } from 'react';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Imager } from 'components/common/imager/Imager';
import { Token } from 'libs/tokens';
import { getFiatValue, sanitizeNumberInput } from 'utils/helpers';
import { Switch } from 'components/common/switch';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { ReactComponent as IconDistributedEntireRange } from 'assets/distributedEntireRange.svg';
import { ReactComponent as IconDistributedUnusedRange } from 'assets/distributedUnusedRange.svg';
import { TokenPrice } from 'components/strategies/overview/strategyBlock/TokenPrice';
import BigNumber from 'bignumber.js';
import { useFiatCurrency } from 'hooks/useFiatCurrency';

export const ModalEditStrategyAllocatedBudget: FC<{
  order: OrderCreate;
  base: Token;
  quote: Token;
  balance?: string;
  buy?: boolean;
  showMaxCb?: () => void;
}> = ({ base, quote, balance, buy, order, showMaxCb }) => {
  const firstTime = useRef(true);
  const [isDistribute, setIsDistribute] = useState(true);
  const [showDistribute, setShowDistribute] = useState(false);
  const { selectedFiatCurrency, useGetTokenPrice } = useFiatCurrency();
  const baseTokenPriceQuery = useGetTokenPrice(base.symbol);
  const quoteTokenPriceQuery = useGetTokenPrice(quote.symbol);

  useEffect(() => {
    if (!firstTime.current && order.isRange && +order.budget > 0) {
      setShowDistribute(true);
    }
    if (!order.isRange || +order.budget === 0) {
      setShowDistribute(false);
    }
    firstTime.current = false;
  }, [order.max, order.min, order.budget, order.isRange]);

  const getTokenFiat = (value: string) => {
    return buy
      ? new BigNumber(value || 0).times(
          quoteTokenPriceQuery.data?.[selectedFiatCurrency] || 0
        )
      : new BigNumber(value || 0).times(
          baseTokenPriceQuery.data?.[selectedFiatCurrency] || 0
        );
  };

  const budgetFiat = getFiatValue(
    getTokenFiat(balance || ''),
    selectedFiatCurrency
  );

  return (
    <div className="flex w-full flex-col rounded-8 border border-emphasis p-15 text-left font-mono text-12 font-weight-500">
      <div className="flex justify-between">
        <div className="flex items-center">
          <div className="mr-5">Allocated Budget</div>
          <Tooltip
            iconClassName="h-13 text-white/60"
            element={
              buy
                ? `This is the current available ${quote?.symbol} budget you can withdraw`
                : `This is the current available ${base?.symbol} budget you can withdraw`
            }
          />
        </div>
        <div className="flex">
          <Tooltip
            element={
              <>
                <TokenPrice
                  price={sanitizeNumberInput(
                    balance || '',
                    buy ? quote.decimals : base.decimals
                  )}
                  iconSrc={buy ? quote?.logoURI : base?.logoURI}
                />
                <TokenPrice className="text-white/60" price={budgetFiat} />
              </>
            }
          >
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
          </Tooltip>
          {showMaxCb && (
            <div
              onClick={() => showMaxCb()}
              className="ml-8 cursor-pointer font-weight-500 text-green"
            >
              MAX
            </div>
          )}
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
