import { useEffect, useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useBuySell } from 'components/trade/tradeWidget/useBuySell';
import { NotEnoughLiquidity } from './NotEnoughLiquidity';
import { Token } from 'libs/tokens';
import { UseQueryResult } from 'libs/queries';
import { prettifyNumber } from 'utils/helpers';
import { ReactComponent as IconRouting } from 'assets/icons/routing.svg';
import { carbonEvents } from 'services/events';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import useInitEffect from 'hooks/useInitEffect';
import { IS_TENDERLY_FORK, useWeb3 } from 'libs/web3';
import { useTranslation } from 'libs/translations';

export type TradeWidgetBuySellProps = {
  source: Token;
  target: Token;
  buy?: boolean;
  sourceBalanceQuery: UseQueryResult<string>;
  targetBalanceQuery: UseQueryResult<string>;
};

export const TradeWidgetBuySell = (props: TradeWidgetBuySellProps) => {
  const { t } = useTranslation();
  const { user } = useWeb3();
  const {
    sourceInput,
    setSourceInput,
    targetInput,
    setTargetInput,
    rate,
    onInputChange,
    handleCTAClick,
    bySourceQuery,
    byTargetQuery,
    liquidityQuery,
    errorMsgSource,
    errorMsgTarget,
    openTradeRouteModal,
    calcSlippage,
    isTradeBySource,
    maxSourceAmountQuery,
    isAwaiting,
  } = useBuySell(props);
  const { source, target, sourceBalanceQuery, buy = false } = props;
  const hasEnoughLiquidity = +liquidityQuery?.data! > 0;

  const { getFiatValue: getFiatValueSource } = useFiatCurrency(source);

  useEffect(() => {
    errorMsgSource &&
      carbonEvents.trade.tradeErrorShow({
        buy,
        buyToken: target,
        sellToken: source,
        valueUsd: getFiatValueSource(sourceInput, true).toString(),
        message: errorMsgSource || '',
      });

    errorMsgTarget &&
      carbonEvents.trade.tradeErrorShow({
        buy,
        buyToken: target,
        sellToken: source,
        valueUsd: getFiatValueSource(sourceInput, true).toString(),
        message: errorMsgTarget || '',
      });

    !hasEnoughLiquidity &&
      !liquidityQuery.isLoading &&
      carbonEvents.trade.tradeErrorShow({
        buy,
        buyToken: target,
        sellToken: source,
        message: t('pages.trade.errors.error3'),
      });
  }, [
    buy,
    errorMsgSource,
    errorMsgTarget,
    getFiatValueSource,
    liquidityQuery.isLoading,
  ]);

  useInitEffect(() => {
    const tradeData = {
      buy,
      buyToken: target,
      sellToken: source,
      valueUsd: getFiatValueSource(sourceInput, true).toString(),
    };
    if (isTradeBySource) {
      buy
        ? carbonEvents.trade.tradeBuyPaySet(tradeData)
        : carbonEvents.trade.tradeSellPaySet(tradeData);
    }
  }, [buy, sourceInput]);

  useInitEffect(() => {
    const tradeData = {
      buy,
      buyToken: target,
      sellToken: source,
      valueUsd: getFiatValueSource(sourceInput, true).toString(),
    };

    if (!isTradeBySource && sourceInput) {
      buy
        ? carbonEvents.trade.tradeBuyReceiveSet(tradeData)
        : carbonEvents.trade.tradeSellReceiveSet(tradeData);
    }
  }, [buy, targetInput, sourceInput]);

  const handleTradeClick = () => {
    handleCTAClick();
    buy
      ? carbonEvents.trade.tradeBuyClick({
          buy,
          buyToken: target,
          sellToken: source,
          valueUsd: getFiatValueSource(sourceInput, true).toString(),
        })
      : carbonEvents.trade.tradeSellClick({
          buy,
          buyToken: target,
          sellToken: source,
          valueUsd: getFiatValueSource(sourceInput, true).toString(),
        });
  };

  const ctaButtonText = useMemo(() => {
    if (user) {
      return buy
        ? t('pages.trade.section2.actionButtons.actionButton3', {
            token: target.symbol,
          })
        : t('pages.trade.section2.actionButtons.actionButton4', {
            token: source.symbol,
          });
    }

    return t('common.actionButtons.actionButton1');
  }, [buy, source.symbol, t, target.symbol, user]);

  if (liquidityQuery?.isError)
    return <div>{t('pages.trade.errors.error2')}</div>;
  if (!source || !target) return null;

  const slippage = calcSlippage();
  const getRate = () => {
    if (!rate) return '...';

    if (buy) {
      return `1 ${target.symbol} = ${
        rate && rate !== '0' ? prettifyNumber(new BigNumber(1).div(rate)) : '--'
      } ${source.symbol}`;
    }
    return `1 ${source.symbol} =
        ${rate ? prettifyNumber(rate) : '--'}
        ${target.symbol}`;
  };

  const showRouting =
    rate && rate !== '0' && !errorMsgTarget && !errorMsgSource;

  const getLiquidity = () => {
    const value = liquidityQuery.isLoading
      ? 'loading'
      : prettifyNumber(liquidityQuery.data);
    return `Liquidity: ${value} ${target.symbol}`;
  };

  return (
    <div className={`flex flex-col rounded-12 bg-silver p-20`}>
      <h2 className={'mb-20'}>
        {buy
          ? t('pages.trade.section2.titles.title1', {
              baseToken: target.symbol,
              quoteToken: source.symbol,
            }) || ''
          : t('pages.trade.section2.titles.title2', {
              baseToken: source.symbol,
              quoteToken: target.symbol,
            }) || ''}
      </h2>
      <div className={'flex justify-between text-14'}>
        <div className={'text-white/50'}>
          {t('pages.trade.section2.subtitles.subtitle1')}
        </div>
        {errorMsgSource && (
          <div className={`font-weight-500 text-red`}>{errorMsgSource}</div>
        )}
      </div>
      {hasEnoughLiquidity || liquidityQuery.isLoading ? (
        <>
          <TokenInputField
            className={'mb-20 mt-5 rounded-12 bg-black p-16'}
            token={source}
            isBalanceLoading={sourceBalanceQuery.isLoading}
            value={sourceInput}
            setValue={(value) => {
              setSourceInput(value);
            }}
            balance={sourceBalanceQuery.data}
            onKeystroke={() => onInputChange(true)}
            isLoading={byTargetQuery.isFetching}
            isError={!!errorMsgSource}
            disabled={!hasEnoughLiquidity}
          />
          <div className={'flex justify-between text-14'}>
            <div className={'text-white/50'}>
              {t('pages.trade.section2.subtitles.subtitle2')}
            </div>
            {errorMsgTarget && (
              <div
                className={`cursor-pointer font-weight-500 text-red`}
                onClick={() => {
                  onInputChange(false);
                  setTargetInput(liquidityQuery.data || '0');
                }}
              >
                {errorMsgTarget}
              </div>
            )}
          </div>
          <TokenInputField
            className={'mt-5 rounded-b-4 rounded-t-12 bg-black p-16'}
            token={target}
            value={targetInput}
            setValue={(value) => {
              setTargetInput(value);
            }}
            placeholder={t('common.placeholders.placeholder3') || ''}
            onKeystroke={() => onInputChange(false)}
            isLoading={bySourceQuery.isFetching}
            isError={!!errorMsgTarget}
            slippage={slippage}
            disabled={!hasEnoughLiquidity}
          />
          <div
            className={
              'mt-5 flex justify-between rounded-b-12 rounded-t-4 bg-black p-16 font-mono text-14 text-white/80'
            }
          >
            <span>{getRate()}</span>
            {showRouting && (
              <button
                onClick={openTradeRouteModal}
                className={
                  'flex hidden space-x-10 text-left hover:text-white md:flex'
                }
              >
                <IconRouting className={'w-12'} />
                <Tooltip
                  placement={'left'}
                  element={t('pages.trade.section2.tooltips.tooltip1')}
                >
                  <span>
                    {t('pages.trade.section2.actionButtons.actionButton5')}
                  </span>
                </Tooltip>
              </button>
            )}
          </div>
          {IS_TENDERLY_FORK && (
            <div className={'text-secondary mt-5 text-right'}>
              {t('pages.trade.section2.contents.content1', {
                num: getLiquidity(),
              })}
            </div>
          )}
        </>
      ) : (
        <NotEnoughLiquidity
          source={buy ? target : source}
          target={buy ? source : target}
        />
      )}
      <Button
        disabled={!hasEnoughLiquidity || !maxSourceAmountQuery.data}
        loading={isAwaiting}
        loadingChildren={t('common.statuses.status1')}
        onClick={handleTradeClick}
        variant={buy ? 'success' : 'error'}
        fullWidth
        className={'mt-20'}
      >
        {ctaButtonText}
      </Button>
    </div>
  );
};
