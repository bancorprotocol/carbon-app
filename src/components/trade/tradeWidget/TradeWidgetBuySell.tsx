import { SafeDecimal } from 'libs/safedecimal';
import { FormEvent, useId, JSX, useMemo } from 'react';
import { Token } from 'libs/tokens';
import { IS_TENDERLY_FORK, useWagmi } from 'libs/wagmi';
import { UseQueryResult } from 'libs/queries';
import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useBuySell } from 'components/trade/tradeWidget/useBuySell';
import { NoLiquidity } from './NoLiquidity';
import { prettifyNumber } from 'utils/helpers';
import { ReactComponent as IconRouting } from 'assets/icons/routing.svg';
import { useTradePairs } from '../useTradePairs';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { isZero } from 'components/strategies/common/utils';
import { Warning } from 'components/common/WarningMessageWithIcon';

type FormAttributes = Omit<JSX.IntrinsicElements['form'], 'target'>;
export interface TradeWidgetBuySellProps extends FormAttributes {
  source: Token;
  target: Token;
  isBuy?: boolean;
  sourceBalanceQuery: UseQueryResult<string>;
}

export const TradeWidgetBuySell = (props: TradeWidgetBuySellProps) => {
  const id = useId();
  const { user } = useWagmi();
  const { isTradePairError, isPending: isTradePairPending } = useTradePairs();
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
    maxSourceAmountQuery,
    isAwaiting,
  } = useBuySell(props);
  const {
    source,
    target,
    sourceBalanceQuery,
    isBuy = false,
    ...formProps
  } = props;
  const hasEnoughLiquidity = +liquidityQuery.data! > 0;

  const handleTrade = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleCTAClick();
  };
  const tooLow = useMemo(() => {
    // empty strings means that amount is too large
    if (!sourceInput || !targetInput) return false;
    return !isZero(sourceInput) && isZero(targetInput);
  }, [sourceInput, targetInput]);

  const warning = useMemo(() => {
    if (tooLow) return 'Input amount too small to return a value';
    return '';
  }, [tooLow]);

  const slippage = useMemo(() => calcSlippage(), [calcSlippage]);
  const rateMessage = useMemo(() => {
    if (warning) return;

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
  }, [isBuy, rate, source.symbol, target.symbol, warning]);

  const ctaButtonText = (() => {
    if (!user) return 'Connect Wallet';
    return isBuy ? `Buy ${target.symbol}` : `Sell ${source.symbol}`;
  })();

  if (isTradePairPending || liquidityQuery.isPending) {
    return <CarbonLogoLoading className="h-80 m-20" />;
  }
  if (liquidityQuery?.isError) return <div>Error</div>;
  if (isTradePairError) return <NoLiquidity />;
  if (!hasEnoughLiquidity && !liquidityQuery.isPending) {
    return <NoLiquidity />;
  }

  if (!source || !target) return null;

  const showRouting = rate && rate !== '0';
  const disabledCTA =
    !!errorMsgSource ||
    !!errorMsgTarget ||
    !hasEnoughLiquidity ||
    !maxSourceAmountQuery.data;

  const getLiquidity = () => {
    const value = liquidityQuery.isPending
      ? 'loading'
      : prettifyNumber(liquidityQuery.data);
    return `Liquidity: ${value} ${target.symbol}`;
  };

  return (
    <form {...formProps} onSubmit={handleTrade} className="grid gap-24">
      <div className="rounded-xl p-16 input-container">
        <header className="text-14 flex justify-between">
          <label htmlFor={`${id}-pay`} className="text-white/50">
            You pay
          </label>
          {errorMsgSource && (
            <output
              htmlFor={`${id}-pay`}
              className="text-12 font-weight-500 text-error"
            >
              {errorMsgSource}
            </output>
          )}
        </header>
        <TokenInputField
          id={`${id}-pay`}
          token={source}
          isBalanceLoading={sourceBalanceQuery.isPending}
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
      </div>
      <div className="grid gap-8">
        <div className="rounded-b-xs rounded-t-xl  input-container">
          <header className="text-14 flex justify-between">
            <label htmlFor={`${id}-receive`} className="text-white/50">
              You receive
            </label>
            {errorMsgTarget && (
              <button
                type="button"
                className="font-weight-500 text-error cursor-pointer"
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
        </div>
        <footer className="rounded-b-xl rounded-t-xs text-14 flex justify-between bg-main-900/40 p-16 text-white/80">
          {warning && <Warning className="text-14" message={warning} />}
          {rateMessage && <p>{rateMessage}</p>}
          {showRouting && (
            <button
              type="button"
              onClick={openTradeRouteModal}
              className="flex gap-8 text-left hover:text-white md:flex"
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
      </div>
      {IS_TENDERLY_FORK && (
        <div className="text-14 text-right text-white/60">
          DEBUG: {getLiquidity()}
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
