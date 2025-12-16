import { SafeDecimal } from 'libs/safedecimal';
import { FormEvent, useId, JSX, useMemo } from 'react';
import { Token } from 'libs/tokens';
import { IS_TENDERLY_FORK, useWagmi } from 'libs/wagmi';
import { UseQueryResult } from 'libs/queries';
import { Button } from 'components/common/button';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useBuySell } from 'components/trade/tradeWidget/useBuySell';
import { prettifyNumber } from 'utils/helpers';
import { useTradePairs } from '../useTradePairs';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { isZero } from 'components/strategies/common/utils';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { LogoImager } from 'components/common/imager/Imager';
import { useModal } from 'hooks/useModal';
import { useNavigate } from '@tanstack/react-router';
import { OpenOceanPath } from './OpenOceanPath';
import IconRouting from 'assets/icons/routing.svg?react';
import IconChevron from 'assets/icons/chevron.svg?react';
import IconArrow from 'assets/icons/arrowDown.svg?react';

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
  const { openModal } = useModal();
  const { isPending: isTradePairPending } = useTradePairs();
  const navigate = useNavigate({ from: '/trade/market' });
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
    displayRouting,
    calcSlippage,
    maxSourceAmountQuery,
    isAwaiting,
    showRoutingPath,
    routingPath,
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

  const selectToken = (key: 'source' | 'target') => {
    const exclude = key === 'source' ? target : source;
    const tokenKey = isBuy
      ? key === 'source'
        ? 'quote'
        : 'base'
      : key === 'source'
        ? 'base'
        : 'quote';
    openModal('tokenLists', {
      excludedTokens: [exclude.address],
      onClick: (next) => {
        navigate({
          search: (s) => ({ ...s, [tokenKey]: next.address }),
          replace: true,
          resetScroll: false,
        });
      },
    });
  };

  const swapTokens = () => {
    navigate({
      search: (s) => ({ ...s, base: s.quote, quote: s.base }),
      replace: true,
      resetScroll: false,
    });
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
    if (!hasEnoughLiquidity) return 'No Liquidity available';
    if (!user) return 'Connect Wallet';
    return isBuy ? `Buy ${target.symbol}` : `Sell ${source.symbol}`;
  })();

  if (isTradePairPending || liquidityQuery.isPending) {
    return <CarbonLogoLoading className="h-80 m-20" />;
  }

  if (!source || !target) return null;

  const showRouting = routingPath || !isZero(rate);
  const disabledCTA =
    !!errorMsgSource ||
    !!errorMsgTarget ||
    !hasEnoughLiquidity ||
    !maxSourceAmountQuery.data;

  const getLiquidity = () => {
    if (!liquidityQuery.data) return;
    const value = prettifyNumber(liquidityQuery.data);
    return `Liquidity: ${value} ${target.symbol}`;
  };

  return (
    <form {...formProps} onSubmit={handleTrade} className="grid gap-24">
      <div className="grid">
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
            setValue={(value) => setSourceInput(value)}
            balance={sourceBalanceQuery.data}
            onKeystroke={() => onInputChange(true)}
            isLoading={byTargetQuery.isFetching}
            isError={!!errorMsgSource}
            disabled={!hasEnoughLiquidity}
          >
            <button
              onClick={() => selectToken('source')}
              type="button"
              className="btn-on-background flex items-center gap-8 rounded-full px-8 py-6"
            >
              <LogoImager
                alt="Token"
                src={source.logoURI}
                className="size-20"
              />
              <span className="font-medium">{source.symbol}</span>
              <IconChevron className="size-14" />
            </button>
          </TokenInputField>
        </div>
        <button
          onClick={swapTokens}
          type="button"
          className="grid place-items-center place-self-center size-40 -my-12 border-2 border-main-900 btn-on-background p-0 rounded-full z-0"
        >
          <IconArrow className="size-16" />
        </button>
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
            >
              <button
                onClick={() => selectToken('target')}
                type="button"
                className="btn-on-background flex items-center gap-8 rounded-full px-8 py-6"
              >
                <LogoImager
                  alt="Token"
                  src={target.logoURI}
                  className="size-20"
                />
                <span className="font-medium">{target.symbol}</span>
                <IconChevron className="size-14" />
              </button>
            </TokenInputField>
          </div>
          <footer className="rounded-b-xl rounded-t-xs text-14 flex justify-between bg-main-900/40 p-16 text-white/80">
            {warning && <Warning className="text-14" message={warning} />}
            {rateMessage && <p>{rateMessage}</p>}
            {showRouting && (
              <button
                type="button"
                onClick={displayRouting}
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
      </div>
      {IS_TENDERLY_FORK && (
        <div className="text-14 text-right text-white/60">
          DEBUG: {getLiquidity()}
        </div>
      )}

      {showRoutingPath && !!routingPath && (
        <div className="grid gap-8 px-16 py-8 rounded-md bg-main-500/60">
          <h3 className="text-12">Routing:</h3>
          <OpenOceanPath path={routingPath} />
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
