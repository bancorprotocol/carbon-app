import { FC, useEffect, useRef, useState } from 'react';
import BigNumber from 'bignumber.js';
import { MarginalPriceOptions } from '@bancor/carbon-sdk/strategy-management';
import { Token } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Imager } from 'components/common/imager/Imager';
import { Switch } from 'components/common/switch';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { TokenPrice } from 'components/strategies/overview/strategyBlock/TokenPrice';
import { EditTypes } from './EditStrategyMain';
import { getFiatDisplayValue, sanitizeNumberInput } from 'utils/helpers';
import { ReactComponent as IconDistributedEntireRange } from 'assets/distributedEntireRange.svg';
import { ReactComponent as IconDistributedUnusedRange } from 'assets/distributedUnusedRange.svg';

const shouldDisplayDistributeByType: {
  [key in EditTypes]: boolean;
} = {
  renew: false,
  editPrices: true,
  deposit: true,
  withdraw: true,
};

export const EditStrategyAllocatedBudget: FC<{
  order: OrderCreate;
  base: Token;
  quote: Token;
  balance?: string;
  buy?: boolean;
  showMaxCb?: () => void;
  type: EditTypes;
}> = ({ base, quote, balance, order, showMaxCb, type, buy = false }) => {
  const { t } = useTranslation();
  const firstTime = useRef(true);
  const [showDistribute, setShowDistribute] = useState(false);
  const { selectedFiatCurrency, useGetTokenPrice } = useFiatCurrency();
  const baseTokenPriceQuery = useGetTokenPrice(base.address);
  const quoteTokenPriceQuery = useGetTokenPrice(quote.address);
  const isDistributeToggleOn =
    order.marginalPriceOption === MarginalPriceOptions.reset;

  useEffect(() => {
    if (
      !firstTime.current &&
      order.isRange &&
      +order.budget > 0 &&
      shouldDisplayDistributeByType[type]
    ) {
      setShowDistribute(true);
    }
    if (!order.isRange || +order.budget === 0) {
      setShowDistribute(false);
    }
    firstTime.current = false;
  }, [order.max, order.min, order.budget, order.isRange, type]);

  const getTokenFiat = (value: string) => {
    return buy
      ? new BigNumber(value || 0).times(
          quoteTokenPriceQuery.data?.[selectedFiatCurrency] || 0
        )
      : new BigNumber(value || 0).times(
          baseTokenPriceQuery.data?.[selectedFiatCurrency] || 0
        );
  };

  const budgetFiat = getFiatDisplayValue(
    getTokenFiat(balance || ''),
    selectedFiatCurrency
  );

  return (
    <>
      <div className="flex w-full flex-col rounded-8 border-2 border-white/10 p-15 text-start font-mono text-12 font-weight-500">
        <div className="flex items-center justify-between gap-16">
          <div className="flex w-auto items-center gap-6">
            <div>{t('pages.strategyEdit.section2.contents.content5')}</div>
            <Tooltip
              sendEventOnMount={{ buy }}
              iconClassName="h-13 me-6 text-white/60"
              element={t('pages.strategyEdit.tooltips.tooltip4', {
                token: buy ? quote?.symbol : base.symbol,
              })}
            />
          </div>
          <div className="flex flex-1 justify-end gap-8">
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
              <div className={'flex items-center'}>
                {balance && (
                  <span>
                    {sanitizeNumberInput(
                      balance,
                      buy ? quote?.decimals : base?.decimals
                    )}
                  </span>
                )}
                <Imager
                  className="ml-10 h-16 w-16 rounded-full"
                  src={buy ? quote?.logoURI : base?.logoURI}
                  alt="token"
                />
              </div>
            </Tooltip>
            {showMaxCb && (
              <div
                onClick={() => showMaxCb()}
                className="cursor-pointer font-weight-500 text-green"
              >
                {t('common.contents.content2')}
              </div>
            )}
          </div>
        </div>
        {showDistribute && type !== 'editPrices' && (
          <div className="mt-10 flex justify-between">
            <div className="flex items-center">
              <span className="me-5">
                {t('pages.strategyEdit.section2.contents.content6')}
              </span>
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
                          {t('pages.strategyEdit.section2.contents.content6')}
                        </div>
                        <div className="text-10 text-white/60">
                          {t('pages.strategyEdit.section2.contents.content7')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-8">
                      <div>
                        <IconDistributedUnusedRange />
                      </div>
                      <div>
                        <div className="text-12 font-weight-500 text-white">
                          {t('pages.strategyEdit.section2.contents.content9')}
                        </div>
                        <div className="text-10 text-white/60">
                          {t('pages.strategyEdit.section2.contents.content10')}
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
            <Switch
              variant={isDistributeToggleOn ? 'white' : 'black'}
              isOn={isDistributeToggleOn}
              setIsOn={(isOn) =>
                order.setMarginalPriceOption(
                  isOn
                    ? MarginalPriceOptions.reset
                    : MarginalPriceOptions.maintain
                )
              }
              size={'sm'}
            />
          </div>
        )}
      </div>
      {type === 'editPrices' && showDistribute && (
        <div className="mt-10 flex items-center gap-10 rounded-8 bg-white/5 p-12 text-start  text-12 text-white/60">
          <Tooltip
            iconClassName="h-13 text-white/60"
            element={t('pages.strategyEdit.tooltips.tooltip3')}
          />
          {t('pages.strategyEdit.section2.contents.content11')}
        </div>
      )}
    </>
  );
};
