import BigNumber from 'bignumber.js';
import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useBuySell } from 'components/trade/tradeWidget/useBuySell';
import { NotEnoughLiquidity } from './NotEnoughLiquidity';
import { Token } from 'libs/tokens';
import { UseQueryResult } from 'libs/queries';
import { prettifyNumber } from 'utils/helpers';
import { IS_TENDERLY_FORK } from 'libs/web3';
import { ReactComponent as IconRouting } from 'assets/icons/routing.svg';
import { sendEvent } from 'services/googleTagManager';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { useEffect } from 'react';

export type TradeWidgetBuySellProps = {
  source: Token;
  target: Token;
  buy?: boolean;
  sourceBalanceQuery: UseQueryResult<string>;
  targetBalanceQuery: UseQueryResult<string>;
};

export const TradeWidgetBuySell = (props: TradeWidgetBuySellProps) => {
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
  } = useBuySell(props);
  const { buy, source, target, sourceBalanceQuery } = props;
  const hasEnoughLiquidity = +liquidityQuery?.data! > 0;

  const { getFiatValue: getFiatValueSource } = useFiatCurrency(source);
  const { getFiatValue: getFiatValueTarget } = useFiatCurrency(target);

  useEffect(() => {
    errorMsgSource &&
      sendEvent('trade', 'trade_error_show', {
        trade_direction: buy ? 'buy' : 'sell',
        buy_token: target.symbol,
        sell_token: source.symbol,
        token_pair: `${target.symbol}/${source.symbol}`,
        value_usd: getFiatValueSource(sourceInput, true).toString(),
        message: errorMsgSource,
      });

    errorMsgTarget &&
      sendEvent('trade', 'trade_error_show', {
        trade_direction: buy ? 'buy' : 'sell',
        buy_token: target.symbol,
        sell_token: source.symbol,
        token_pair: `${target.symbol}/${source.symbol}`,
        value_usd: getFiatValueTarget(targetInput, true).toString(),
        message: errorMsgTarget,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMsgSource, errorMsgTarget]);

  if (liquidityQuery?.isError) return <div>Error</div>;
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

  const getLiquidity = () => {
    const value = liquidityQuery.isLoading
      ? 'loading'
      : prettifyNumber(liquidityQuery.data);
    return `Liquidity: ${value} ${target.symbol}`;
  };

  const handleEvents = (value: string, isSource = false) => {
    isSource
      ? sendEvent('trade', buy ? 'trade_buy_pay_set' : 'trade_sell_pay_set', {
          trade_direction: buy ? 'buy' : 'sell',
          buy_token: target.symbol,
          sell_token: source.symbol,
          token_pair: `${target.symbol}/${source.symbol}`,
          value_usd: getFiatValueSource(value, true).toString(),
        })
      : sendEvent(
          'trade',
          buy ? 'trade_buy_receive_set' : 'trade_sell_receive_set',
          {
            trade_direction: buy ? 'buy' : 'sell',
            buy_token: target.symbol,
            sell_token: source.symbol,
            token_pair: `${target.symbol}/${source.symbol}`,
            value_usd: getFiatValueTarget(value, true).toString(),
          }
        );
  };

  const showRouting =
    rate && rate !== '0' && !errorMsgTarget && !errorMsgSource;

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
            className={'mt-5 mb-20 rounded-12 bg-black p-16'}
            token={source}
            isBalanceLoading={sourceBalanceQuery.isLoading}
            value={sourceInput}
            setValue={(value) => {
              setSourceInput(value);
              handleEvents(value, true);
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
            className={'mt-5 rounded-t-12 rounded-b-4 bg-black p-16'}
            token={target}
            value={targetInput}
            setValue={(value) => {
              setTargetInput(value);
              handleEvents(value);
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
                <Tooltip element="You can view and manage the orders that are included in the trade.">
                  <span>Routing</span>
                </Tooltip>
              </button>
            )}
          </div>
          {IS_TENDERLY_FORK && (
            <div className={'text-secondary mt-5 text-right'}>
              {getLiquidity()}
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
        disabled={!hasEnoughLiquidity}
        onClick={() => {
          handleCTAClick();
          sendEvent('trade', buy ? 'trade_buy_click' : 'trade_sell_click', {
            trade_direction: buy ? 'buy' : 'sell',
            buy_token: target.symbol,
            sell_token: source.symbol,
            token_pair: `${target.symbol}/${source.symbol}`,
          });
        }}
        variant={buy ? 'success' : 'error'}
        fullWidth
        className={'mt-20'}
      >
        {buy ? `Buy ${target.symbol}` : `Sell ${source.symbol}`}
      </Button>
    </div>
  );
};
