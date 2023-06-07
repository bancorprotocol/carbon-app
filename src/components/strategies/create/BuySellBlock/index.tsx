import { FC } from 'react';
import BigNumber from 'bignumber.js';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OrderCreate } from 'components/strategies/create/useOrder';
import { Token } from 'libs/tokens';
import { UseQueryResult } from 'libs/queries';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { LimitRangeSection } from './LimitRangeSection';
import { Imager } from 'components/common/imager/Imager';
import { useStrategyEvents } from './useStrategyEvents';
import {
  StrategyCreateLocationGenerics,
  StrategyType,
} from 'components/strategies/create/types';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { useNavigate } from 'libs/routing';
import { useTranslation } from 'libs/translations';
import { capitalizeFirstChar } from 'utils/strings';

type Props = {
  base: Token;
  quote: Token;
  tokenBalanceQuery: UseQueryResult<string>;
  order: OrderCreate;
  buy?: boolean;
  isBudgetOptional?: boolean;
  strategyType?: StrategyType;
  isOrdersOverlap: boolean;
};

export const BuySellBlock: FC<Props> = ({
  base,
  quote,
  tokenBalanceQuery,
  order,
  isBudgetOptional,
  strategyType,
  buy = false,
  isOrdersOverlap,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate<StrategyCreateLocationGenerics>();
  const budgetToken = buy ? quote : base;
  const insufficientBalance =
    !tokenBalanceQuery.isLoading &&
    new BigNumber(tokenBalanceQuery.data || 0).lt(order.budget);

  useStrategyEvents({ base, quote, order, buy, insufficientBalance });

  const titleText = buy
    ? t('pages.strategyCreate.step2.section2.title1')
    : t('pages.strategyCreate.step2.section2.title2');

  const tooltipText = t('pages.strategyCreate.step2.tooltips.tooltip1', {
    token: base.symbol,
    buyOrSell: buy
      ? t('pages.strategyCreate.step2.section2.content1')
      : t('pages.strategyCreate.step2.section2.content2'),
  });

  const title = (
    <>
      <Tooltip sendEventOnMount={{ buy }} element={tooltipText}>
        <span>{titleText}</span>
      </Tooltip>
      <Imager
        alt={'Token'}
        src={base.logoURI}
        className={'mx-6 h-18 w-18 rounded-full'}
      />
      <span>{base.symbol}</span>
    </>
  );

  const inputTitle = (
    <>
      <div
        className={
          'mr-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px]'
        }
      >
        1
      </div>
      <Tooltip
        sendEventOnMount={{ buy }}
        element={t('pages.strategyCreate.step2.tooltips.tooltip2', {
          buyToken: base.symbol,
          sellToken: quote.symbol,
          buyOrSell: buy
            ? t('pages.strategyCreate.step2.section2.content1')
            : t('pages.strategyCreate.step2.section2.content2'),
        })}
      >
        <div className={'text-14 font-weight-500 text-white/60'}>
          <span>
            {t('pages.strategyCreate.step2.section2.subtitle1', {
              buyOrSell: buy
                ? capitalizeFirstChar(
                    t('pages.strategyCreate.step2.section2.content1')
                  )
                : capitalizeFirstChar(
                    t('pages.strategyCreate.step2.section2.content2')
                  ),
            })}
          </span>
          <span className={'ml-8 text-white/80'}>
            ({quote.symbol}{' '}
            <span className={'text-white/60'}>
              {t('pages.strategyCreate.step2.section2.content3')} 1{' '}
            </span>
            {base.symbol})
          </span>
        </div>
      </Tooltip>
    </>
  );
  // TODO: Add translation to all tooltips
  //  maybe split tooltips into two

  return (
    <div
      className={`bg-secondary space-y-12 rounded-10 border-l-2 p-20 pb-10 ${
        buy
          ? 'border-green/50 focus-within:border-green'
          : 'border-red/50 focus-within:border-red'
      }`}
    >
      {strategyType === 'disposable' && (
        <div className={'mb-30'}>
          <TabsMenu>
            <TabsMenuButton
              onClick={() => {
                navigate({
                  search: (search) => ({
                    ...search,
                    strategyDirection: 'buy',
                  }),
                  replace: true,
                });
              }}
              isActive={buy}
            >
              {capitalizeFirstChar(
                t('pages.strategyCreate.step2.section2.content1')
              )}
            </TabsMenuButton>
            <TabsMenuButton
              onClick={() => {
                navigate({
                  search: (search) => ({
                    ...search,
                    strategyDirection: 'sell',
                  }),
                  replace: true,
                });
              }}
              isActive={!buy}
            >
              {capitalizeFirstChar(
                t('pages.strategyCreate.step2.section2.content2')
              )}
            </TabsMenuButton>
          </TabsMenu>
        </div>
      )}

      <LimitRangeSection
        {...{ base, quote, order, buy, title, inputTitle, isOrdersOverlap }}
      />
      <div className={'flex items-center pt-10 text-14'}>
        <div
          className={
            'mr-6 flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px]'
          }
        >
          2
        </div>
        <Tooltip
          sendEventOnMount={{ buy }}
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
          <div className={'font-weight-500 text-white/60'}>
            {t('pages.strategyCreate.step2.section2.subtitle2', {
              buyOrSell: buy
                ? capitalizeFirstChar(
                    t('pages.strategyCreate.step2.section2.content1')
                  )
                : capitalizeFirstChar(
                    t('pages.strategyCreate.step2.section2.content2')
                  ),
            })}
          </div>
        </Tooltip>
        {isBudgetOptional && (
          <div className="ml-8 font-weight-500 text-white/40">
            {t('pages.strategyCreate.step2.section2.content4')}
          </div>
        )}
      </div>
      <div>
        <TokenInputField
          className={'rounded-16 bg-black p-16'}
          value={order.budget}
          setValue={order.setBudget}
          token={budgetToken}
          isBalanceLoading={tokenBalanceQuery.isLoading}
          balance={tokenBalanceQuery.data}
          isError={insufficientBalance}
        />
        <div
          className={`mt-10 text-center text-12 text-red ${
            !insufficientBalance ? 'invisible' : ''
          }`}
        >
          {t('pages.strategyCreate.step2.section2.content5')}
        </div>
      </div>
    </div>
  );
};
