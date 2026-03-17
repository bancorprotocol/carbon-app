import { SafeDecimal } from 'libs/safedecimal';
import { FormEvent, useId, JSX, useMemo, useCallback, useState } from 'react';
import { Token } from 'libs/tokens';
import { IS_TENDERLY_FORK, useWagmi } from 'libs/wagmi';
import {
  useGetTokenBalance,
  useGetTokenPrice,
  useGetTradeData,
  useGetTradeLiquidity,
  UseQueryResult,
} from 'libs/queries';
import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { prettifyNumber, tokenAmount } from 'utils/helpers';
import { isZero } from 'components/strategies/common/utils';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { TokenLogo } from 'components/common/imager/Imager';
import { useModal } from 'hooks/useModal';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { RoutingExchanges } from './RoutingExchanges';
import { TradeMarketSearch } from 'libs/routing/routes/trade';
import { useFiatCurrency } from 'hooks/useFiatCurrency';
import { useTradeAction } from './useTradeAction';
import { carbonEvents } from 'services/events';
import { useGetMaxSource } from 'libs/queries/sdk/maxSourceAmount';
import IconRouting from 'assets/icons/routing.svg?react';
import IconChevron from 'assets/icons/chevron.svg?react';
import IconArrow from 'assets/icons/arrowDown.svg?react';
import config from 'config';
import { useDebounced } from 'hooks/useDebouncedValue';

type FormAttributes = Omit<JSX.IntrinsicElements['form'], 'target'>;
export interface TradeWidgetBuySellProps extends FormAttributes {
  source: Token;
  target: Token;
  isBuy?: boolean;
  set: (params: Partial<TradeMarketSearch>) => void;
}

const getTokenFiat = (
  value: string,
  query: UseQueryResult<number | undefined>,
) => {
  const price = query.data || 0;
  return new SafeDecimal(value || 0).times(price);
};

export const TradeWidgetBuySell = (props: TradeWidgetBuySellProps) => {
  const { set, source, target, isBuy = false } = props;

  const id = useId();
  const { user, openConnect, provider } = useWagmi();
  const { openModal } = useModal();
  const { getFiatValue } = useFiatCurrency(source);
  const search = useSearch({ from: '/trade/market' });
  const sourcePriceQuery = useGetTokenPrice(source.address);
  const targetPriceQuery = useGetTokenPrice(target.address);
  const balanceQuery = useGetTokenBalance(source);
  const maxSource = useGetMaxSource(source.address, target.address);
  const maxTarget = useGetTradeLiquidity(source.address, target.address);

  const navigate = useNavigate({ from: '/trade/market' });

  const [showRoutingPath, setShowRoutingPath] = useState(false);

  const { sourceInput, targetInput } = search;
  const isTradeBySource = !!sourceInput;

  const debouncedSource = useDebounced(sourceInput, 300);
  const debouncedTarget = useDebounced(targetInput, 300);

  const bySourceQuery = useGetTradeData({
    sourceToken: source,
    targetToken: target,
    isTradeBySource: true,
    input: debouncedSource || '',
  });

  const byTargetQuery = useGetTradeData({
    sourceToken: source,
    targetToken: target,
    isTradeBySource: false,
    input: debouncedTarget || '',
  });

  const query = isTradeBySource ? bySourceQuery : byTargetQuery;

  const sourceValue =
    sourceInput ?? byTargetQuery.data?.totalSourceAmount ?? '';
  const targetValue =
    targetInput ?? bySourceQuery.data?.totalTargetAmount ?? '';

  const displayRouting = useCallback(() => {
    if (config.ui.useDexAggregator) {
      setShowRoutingPath((current) => !current);
    } else if (query.data) {
      const { actionsTokenRes, actionsWei } = query.data;
      openModal('tradeRouting', {
        source,
        target,
        sourceBalance: balanceQuery.data ?? '0',
        tradeActionsWei: actionsWei,
        tradeActionsRes: actionsTokenRes,
        isTradeBySource,
        onSuccess: () =>
          set({
            sourceInput: undefined,
            targetInput: undefined,
          }),
        isBuy,
      });
    }
  }, [
    balanceQuery.data,
    isBuy,
    isTradeBySource,
    openModal,
    query.data,
    set,
    source,
    target,
  ]);

  const { trade, calcMaxInput, isAwaiting } = useTradeAction({
    onSuccess: async (transactionHash: string) => {
      set({
        sourceInput: undefined,
        targetInput: undefined,
      });
      const network = await provider?.getNetwork();
      const event = {
        trade_direction: isBuy ? ('buy' as const) : ('sell' as const),
        token_pair: `${target.symbol}/${source.symbol}`,
        buy_token: target.symbol,
        sell_token: source.symbol,
        value_usd: getFiatValue(sourceValue).toString(),
        transaction_hash: transactionHash,
        blockchain_network: network?.name ?? '',
      };
      if (isBuy) carbonEvents.trade.tradeBuy(event);
      else carbonEvents.trade.tradeSell(event);
    },
  });

  const handleTrade = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return openConnect();
    if (query.isFetching) return;
    if (!query.data) return;
    if (e.currentTarget.querySelector('.error-message')) {
      return;
    }
    const { tradeActions, quoteId } = query.data;
    return trade({
      source,
      target,
      tradeActions,
      isTradeBySource,
      sourceInput: sourceValue,
      targetInput: targetValue,
      quoteId,
    });
  };

  const setSourceInput = useCallback(
    (value: string) => {
      set({
        sourceInput: value || undefined,
        targetInput: undefined,
      });
    },
    [set],
  );

  const setTargetInput = useCallback(
    (value: string) => {
      set({
        sourceInput: undefined,
        targetInput: value || undefined,
      });
    },
    [set],
  );

  const selectToken = (key: 'source' | 'target') => {
    const exclude = key === 'source' ? target : source;
    const tokenKey = (() => {
      if (isBuy) {
        return key === 'source' ? 'quote' : 'base';
      } else {
        return key === 'source' ? 'base' : 'quote';
      }
    })();
    openModal('tokenLists', {
      excludedTokens: [exclude.address],
      onClick: (next) => {
        set({
          [tokenKey]: next.address,
          sourceInput: undefined,
          targetInput: undefined,
        });
      },
    });
  };

  const reverseTokens = () => {
    navigate({
      search: (s) => ({
        ...s,
        base: s.quote,
        quote: s.base,
        sourceInput: undefined,
        targetInput: undefined,
      }),
      replace: true,
      resetScroll: false,
    });
  };

  const slippage = useMemo(() => {
    if (query.isFetching) return;
    if (query.isPending) return;
    const sourceFiat = getTokenFiat(sourceValue, sourcePriceQuery);
    const targetFiat = getTokenFiat(targetValue, targetPriceQuery);
    if (sourceFiat.isZero() || targetFiat.isZero()) return;

    const diff = targetFiat.div(sourceFiat);
    const slippage = diff.minus(new SafeDecimal(1)).times(100);
    if (slippage.isFinite()) return slippage;
    return null;
  }, [
    query.isFetching,
    query.isPending,
    sourcePriceQuery,
    sourceValue,
    targetPriceQuery,
    targetValue,
  ]);

  const rate = query.data?.effectiveRate;
  const rateMessage = useMemo(() => {
    if (!rate) return '...';

    if (isBuy) {
      return `1 ${target.symbol} = ${
        rate && rate !== '0'
          ? prettifyNumber(new SafeDecimal(1).div(rate), { decimals: 6 })
          : '--'
      } ${source.symbol}`;
    }
    return `1 ${source.symbol} =
        ${rate ? prettifyNumber(rate, { decimals: 6 }) : '--'}
        ${target.symbol}`;
  }, [isBuy, rate, source.symbol, target.symbol]);

  // Errors
  const balanceTooLow = useMemo(() => {
    if (!balanceQuery.data) return;
    const balance = new SafeDecimal(balanceQuery.data);
    if (isTradeBySource && balance.lt(sourceValue)) {
      return 'Insufficient balance';
    }
    if (!isTradeBySource && balance.lt(calcMaxInput(sourceValue))) {
      return 'Insufficient balance';
    }
  }, [balanceQuery.data, calcMaxInput, isTradeBySource, sourceValue]);

  const isMaxSource = useMemo(() => {
    if (config.ui.useDexAggregator) return;
    if (!maxSource.data) return;
    const max = new SafeDecimal(maxSource.data);
    if (max.gte(sourceValue || '0')) return;
    const msg = `Available liquidity: ${tokenAmount(maxSource.data, source)}`;
    return (
      <button type="button" onClick={() => setSourceInput(maxSource.data!)}>
        <Warning htmlFor={`${id}-pay`} message={msg} isError />
      </button>
    );
  }, [id, maxSource.data, setSourceInput, source, sourceValue]);

  const sourceError = useMemo(() => {
    if (balanceTooLow) return balanceTooLow;
    return isMaxSource;
  }, [balanceTooLow, isMaxSource]);

  const isMaxTarget = useMemo(() => {
    if (config.ui.useDexAggregator) return;
    if (!maxTarget.data) return;
    const max = new SafeDecimal(maxTarget.data);
    if (max.gte(targetValue || '0')) return;
    const msg = `Requested amount exceeds available liquidity: ${tokenAmount(max, target)}`;
    return (
      <button type="button" onClick={() => setTargetInput(maxTarget.data!)}>
        <Warning htmlFor={`${id}-receive`} message={msg} isError />
      </button>
    );
  }, [id, maxTarget.data, setTargetInput, target, targetValue]);

  const targetError = useMemo(() => {
    if (isMaxTarget) return isMaxTarget;
    // Input amount too small
    if (!sourceInput || !targetInput) return;
    if (!isZero(sourceInput) && isZero(targetInput)) {
      return 'Input amount too small to return a value';
    }
  }, [isMaxTarget, sourceInput, targetInput]);

  const globalError = useMemo(() => {
    if (config.ui.useDexAggregator && query.error) {
      return 'Could not find any trade';
    }
  }, [query.error]);

  const ctaButtonText = (() => {
    if (!user) return 'Connect Wallet';
    if (isBuy) return `Buy ${target.symbol}`;
    return `Sell ${source.symbol}`;
  })();

  if (!source || !target) return null;

  const routingPath = query.data?.path;
  const showRouting = (!query.error && routingPath) || !isZero(rate);
  const hasPrice = config.ui.useDexAggregator
    ? !!query.data?.quoteId
    : !!maxSource.data;

  const disabledCTA =
    !!sourceError || !!targetError || !!globalError || !hasPrice;

  return (
    <form
      onSubmit={handleTrade}
      className="form grid gap-24"
      data-testid={isBuy ? 'buy-form' : 'sell-form'}
    >
      <div className="grid">
        <div className="rounded-xl p-16 input-container relative">
          {byTargetQuery.isFetching && (
            <div className="rounded-xl absolute inset-0 animate-pulse bg-main-400/40 loading-message"></div>
          )}
          <label htmlFor={`${id}-pay`} className="text-14 text-main-0/50">
            You pay
          </label>
          <TokenInputField
            id={`${id}-pay`}
            token={source}
            isBalanceLoading={balanceQuery.isPending}
            value={sourceValue}
            setValue={(value) => setSourceInput(value)}
            balance={balanceQuery.data}
            isLoading={byTargetQuery.isFetching}
            error={sourceError}
          >
            <button
              onClick={() => selectToken('source')}
              type="button"
              className="btn-on-background flex items-center gap-8 rounded-full px-8 py-6"
            >
              <TokenLogo token={source} size={20} />
              <span className="font-medium">{source.symbol}</span>
              <IconChevron className="size-14" />
            </button>
          </TokenInputField>
        </div>
        <button
          aria-label="switch tokens"
          onClick={reverseTokens}
          type="button"
          className="grid place-items-center place-self-center size-40 -my-12 border-2 border-main-900 btn-on-background p-0 rounded-full z-1 bg-main-600 hover:bg-main-500"
        >
          <IconArrow className="size-16" />
        </button>
        <div className="grid gap-8">
          <div className="rounded-b-xs rounded-t-xl input-container relative">
            {bySourceQuery.isFetching && (
              <div className="rounded-b-xs rounded-t-xl absolute inset-0 animate-pulse bg-main-400/40 loading-message"></div>
            )}
            <label htmlFor={`${id}-receive`} className="text-14 text-main-0/50">
              You receive
            </label>
            <TokenInputField
              id={`${id}-receive`}
              token={target}
              value={targetValue}
              setValue={(value) => setTargetInput(value)}
              placeholder="Total Amount"
              isLoading={bySourceQuery.isFetching}
              error={targetError}
              slippage={slippage}
            >
              <button
                onClick={() => selectToken('target')}
                type="button"
                className="btn-on-background flex items-center gap-8 rounded-full px-8 py-6"
              >
                <TokenLogo token={target} size={20} />
                <span className="font-medium">{target.symbol}</span>
                <IconChevron className="size-14" />
              </button>
            </TokenInputField>
          </div>
          <button
            type="button"
            onClick={displayRouting}
            className="grid gap-16 input-container rounded-b-xl rounded-t-xs text-14 bg-main-900/40 p-16 text-main-0/80"
          >
            <div className=" flex justify-between">
              {globalError && (
                <Warning className="text-14" message={globalError} isError />
              )}
              {!globalError && rateMessage && <p>{rateMessage}</p>}
              {showRouting && (
                <p
                  className="flex gap-8 text-left hover:text-main-0 md:flex"
                  data-testid="routing"
                >
                  <IconRouting className="w-12" />
                  <span>Routing</span>
                </p>
              )}
            </div>
            {showRoutingPath && !!routingPath && (
              <div className="grid gap-8 text-start">
                <h3 className="text-12">Exchanges:</h3>
                <RoutingExchanges path={routingPath} />
              </div>
            )}
          </button>
        </div>
      </div>
      {IS_TENDERLY_FORK && (
        <div className="text-14 text-right text-main-0/60">
          DEBUG: {`Liquidity: ${tokenAmount(maxTarget.data, target)}`}
        </div>
      )}

      <Button
        type="submit"
        disabled={disabledCTA}
        loading={isAwaiting}
        loadingChildren="Waiting for Confirmation"
        variant={isBuy ? 'buy' : 'sell'}
        fullWidth
        data-testid="submit"
      >
        {ctaButtonText}
      </Button>
    </form>
  );
};
