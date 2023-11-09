import { SafeDecimal } from 'libs/safedecimal';
import { FormEvent, useEffect, useId, useMemo, JSX } from 'react';
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

type FormAttributes = Omit<JSX.IntrinsicElements['form'], 'target'>;
export interface TradeWidgetBuySellProps extends FormAttributes {
  source: Token;
  target: Token;
  buy?: boolean;
  sourceBalanceQuery: UseQueryResult<string>;
}

export const TradeWidgetBuySell = (props: TradeWidgetBuySellProps) => {
  const id = useId();
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
  const {
    source,
    target,
    sourceBalanceQuery,
    buy = false,
    ...formProps
  } = props;
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
      valueUsd: getFiatValueSource(targetInput, true).toString(),
    };

    if (!isTradeBySource) {
      buy
        ? carbonEvents.trade.tradeBuyReceiveSet(tradeData)
        : carbonEvents.trade.tradeSellReceiveSet(tradeData);
    }
  }, [buy, targetInput]);

  const handleTrade = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        rate && rate !== '0'
          ? prettifyNumber(new SafeDecimal(1).div(rate))
          : '--'
      } ${source.symbol}`;
    }
    return `1 ${source.symbol} =
        ${rate ? prettifyNumber(rate) : '--'}
        ${target.symbol}`;
  };

  const showRouting = rate && rate !== '0';
  const disabledCTA =
    !!errorMsgSource ||
    !!errorMsgTarget ||
    !hasEnoughLiquidity ||
    !maxSourceAmountQuery.data;

  const getLiquidity = () => {
    const value = liquidityQuery.isLoading
      ? 'loading'
      : prettifyNumber(liquidityQuery.data);
    return `Liquidity: ${value} ${target.symbol}`;
  };

  return (
    <form
      {...formProps}
      onSubmit={handleTrade}
      className="flex flex-col rounded-12 bg-silver p-20"
    >
      <h2 className="mb-20">
        {buy
          ? `Buy ${target.symbol} with ${source.symbol}`
          : `Sell ${source.symbol} for ${target.symbol}`}
      </h2>
      {hasEnoughLiquidity || liquidityQuery.isLoading ? (
        <>
          <header className="flex justify-between text-14">
            <label htmlFor={`${id}-pay`} className="text-white/50">
              You pay
            </label>
            {errorMsgSource && (
              <output
                htmlFor={`${id}-pay`}
                className="font-weight-500 text-red"
              >
                {errorMsgSource}
              </output>
            )}
          </header>
          <TokenInputField
            id={`${id}-pay`}
            className="mb-20 mt-5 rounded-12 bg-black p-16"
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
          <header className="flex justify-between text-14">
            <label htmlFor={`${id}-receive`} className="text-white/50">
              You receive
            </label>
            {errorMsgTarget && (
              <button
                type="button"
                className="cursor-pointer font-weight-500 text-red"
                onClick={() => {
                  onInputChange(false);
                  setTargetInput(liquidityQuery.data || '0');
                }}
              >
                {errorMsgTarget}
              </button>
            )}
          </header>
          <TokenInputField
            id={`${id}-receive`}
            className="mt-5 rounded-b-4 rounded-t-12 bg-black p-16"
            token={target}
            value={targetInput}
            setValue={(value) => setTargetInput(value)}
            placeholder="Total Amount"
            onKeystroke={() => onInputChange(false)}
            isLoading={bySourceQuery.isFetching}
            isError={!!errorMsgTarget}
            slippage={slippage}
            disabled={!hasEnoughLiquidity}
          />
          <footer className="mt-5 flex justify-between rounded-b-12 rounded-t-4 bg-black p-16 font-mono text-14 text-white/80">
            <p>{getRate()}</p>
            {showRouting && (
              <button
                type="button"
                onClick={openTradeRouteModal}
                className="flex hidden space-x-10 text-left hover:text-white md:flex"
                data-testid="routing"
              >
                <IconRouting className="w-12" />
                <Tooltip
                  placement="left"
                  element="You can view and manage the orders that are included in the trade."
                >
                  <span>Routing</span>
                </Tooltip>
              </button>
            )}
          </footer>
          {IS_TENDERLY_FORK && (
            <div className="text-secondary mt-5 text-right">
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
        type="submit"
        disabled={disabledCTA}
        loading={isAwaiting}
        loadingChildren="Waiting for Confirmation"
        variant={buy ? 'success' : 'error'}
        fullWidth
        className="mt-20"
        data-testid="submit"
      >
        {ctaButtonText}
      </Button>
    </form>
  );
};
