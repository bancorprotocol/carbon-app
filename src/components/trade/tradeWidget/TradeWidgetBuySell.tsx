import { useEffect, useMemo } from 'react';
import Decimal from 'decimal.js';
import { carbonEvents } from 'services/events';
import { Token } from 'libs/tokens';
import { IS_TENDERLY_FORK, useWeb3 } from 'libs/web3';
import { UseQueryResult } from 'libs/queries';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import useInitEffect from 'hooks/useInitEffect';
import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useBuySell } from 'components/trade/tradeWidget/useBuySell';
import { NotEnoughLiquidity } from './NotEnoughLiquidity';
import { prettifyNumber } from 'utils/helpers';
import { ReactComponent as IconRouting } from 'assets/icons/routing.svg';

export type TradeWidgetBuySellProps = {
  source: Token;
  target: Token;
  buy?: boolean;
  sourceBalanceQuery: UseQueryResult<string>;
  targetBalanceQuery: UseQueryResult<string>;
};

export const TradeWidgetBuySell = (props: TradeWidgetBuySellProps) => {
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
        message: 'No Liquidity Available',
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
      return buy ? `Buy ${target.symbol}` : `Sell ${source.symbol}`;
    }

    return 'Connect Wallet';
  }, [buy, source.symbol, target.symbol, user]);

  if (liquidityQuery?.isError) return <div>Error</div>;

  if (!source || !target) return null;

  const slippage = calcSlippage();
  const getRate = () => {
    if (!rate) return '...';

    if (buy) {
      return `1 ${target.symbol} = ${
        rate && rate !== '0' ? prettifyNumber(new Decimal(1).div(rate)) : '--'
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
          ? `Buy ${target.symbol} with ${source.symbol}`
          : `Sell ${source.symbol} for ${target.symbol}`}
      </h2>
      <div className={'flex justify-between text-14'}>
        <div className={'text-white/50'}>You pay</div>
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
            <div className={'text-white/50'}>You receive</div>
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
            placeholder={'Total Amount'}
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
                  element="You can view and manage the orders that are included in the trade."
                >
                  <span>Routing</span>
                </Tooltip>
              </button>
            )}
          </div>
          {IS_TENDERLY_FORK && (
            <div className={'text-secondary mt-5 text-right'}>
              DEBUG: {getLiquidity()}
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
        loadingChildren={'Waiting for Confirmation'}
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
