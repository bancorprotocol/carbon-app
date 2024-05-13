import { FormEvent, useMemo } from 'react';
import { m } from 'libs/motion';
import { useWeb3 } from 'libs/web3';
import { Button } from 'components/common/button';
import { BuySellBlock } from 'components/strategies/create/BuySellBlock';
import { items } from 'components/strategies/create/variants';
import { UseStrategyCreateReturn } from 'components/strategies/create';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { useStrategyEventData } from 'components/strategies/create/useStrategyEventData';
import { getStatusTextByTxStatus } from 'components/strategies/utils';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { CreateOverlappingStrategy } from 'components/strategies/create/overlapping/CreateOverlappingStrategy';
import { useStrategyWarning } from 'components/strategies/useWarning';
import useInitEffect from 'hooks/useInitEffect';
import { carbonEvents } from 'services/events';

export const CreateStrategyOrders = ({
  base,
  quote,
  order0,
  order1,
  createStrategy,
  isCTAdisabled,
  token0BalanceQuery,
  token1BalanceQuery,
  strategyDirection,
  strategyType,
  strategySettings,
  selectedStrategySettings,
  isProcessing,
  isAwaiting,
  isOrdersOverlap,
  isOrdersReversed,
  spread,
  setSpread,
}: UseStrategyCreateReturn) => {
  const { user } = useWeb3();
  const warnings = useStrategyWarning({
    base,
    quote,
    order0,
    order1,
    isOverlapping: strategySettings === 'overlapping',
    invalidForm: isCTAdisabled,
    isConnected: !!user,
  });

  const strategyEventData = useStrategyEventData({
    base,
    quote,
    order0,
    order1,
  });

  useInitEffect(() => {
    if (selectedStrategySettings?.search.strategyType !== 'disposable') return;
    const { strategyType, strategySettings } = selectedStrategySettings.search;
    carbonEvents.strategy.strategyDirectionChange({
      baseToken: base,
      quoteToken: quote,
      strategyDirection: strategyDirection,
      strategySettings,
      strategyType,
    });
  }, [strategyDirection]);

  const onCreateStrategy = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!!e.currentTarget.querySelector('.error-message')) return;
    carbonEvents.strategy.strategyCreateClick(strategyEventData);
    createStrategy();
  };

  const loadingChildren = useMemo(() => {
    return getStatusTextByTxStatus(isAwaiting, isProcessing);
  }, [isAwaiting, isProcessing]);

  return (
    <form
      onSubmit={(e) => onCreateStrategy(e)}
      className="group flex flex-col gap-20 md:w-[440px]"
      data-testid="create-strategy-form"
    >
      <m.header
        variants={items}
        key="createStrategyBuyTokens"
        className="rounded-10 bg-background-900 flex flex-col gap-10 p-20"
      >
        <div className="flex gap-10">
          <TokensOverlap tokens={[base!, quote!]} size={32} />
          <div>
            <h2 className="text-14 flex gap-6">
              <span>{base?.symbol}</span>
              <span role="separator" className="text-white/60">
                /
              </span>
              <span>{quote?.symbol}</span>
            </h2>
            <div className="text-14 capitalize text-white/60">
              {strategyType}
            </div>
          </div>
        </div>
        <p className="text-12 font-weight-400 flex items-center text-white/60">
          <IconWarning className="ml-6 mr-10 w-14 flex-shrink-0" /> Rebasing and
          fee-on-transfer tokens are not supported
        </p>
      </m.header>

      {strategySettings === 'overlapping' && base && quote && (
        <CreateOverlappingStrategy
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
          token0BalanceQuery={token0BalanceQuery}
          token1BalanceQuery={token1BalanceQuery}
          spread={spread}
          setSpread={setSpread}
        />
      )}
      {strategySettings !== 'overlapping' && (
        <>
          {(strategyDirection === 'sell' || strategyType === 'recurring') && (
            <BuySellBlock
              key="createStrategySellOrder"
              base={base!}
              quote={quote!}
              order={order1}
              tokenBalanceQuery={token0BalanceQuery}
              isBudgetOptional={+order1.budget === 0 && +order0.budget > 0}
              strategyType={strategyType}
              isOrdersOverlap={isOrdersOverlap}
              isOrdersReversed={isOrdersReversed}
            />
          )}
          {(strategyDirection === 'buy' ||
            !strategyDirection ||
            strategyType === 'recurring') && (
            <BuySellBlock
              key="createStrategyBuyOrder"
              base={base!}
              quote={quote!}
              order={order0}
              buy
              tokenBalanceQuery={token1BalanceQuery}
              isBudgetOptional={+order0.budget === 0 && +order1.budget > 0}
              strategyType={strategyType}
              isOrdersOverlap={isOrdersOverlap}
              isOrdersReversed={isOrdersReversed}
            />
          )}
        </>
      )}

      {warnings.formHasWarning && !isCTAdisabled && (
        <m.label
          variants={items}
          className="rounded-10 bg-background-900 text-14 font-weight-500 flex items-center gap-8 p-20 text-white/60"
        >
          <input
            type="checkbox"
            value={warnings.approvedWarnings.toString()}
            onChange={(e) => warnings.setApprovedWarnings(e.target.checked)}
            data-testid="approve-warnings"
          />
          I've reviewed the warning(s) but choose to proceed.
        </m.label>
      )}

      <m.div variants={items} key="createStrategyCTA">
        <Button
          type="submit"
          variant="success"
          size="lg"
          fullWidth
          disabled={isCTAdisabled || warnings.shouldApproveWarnings}
          loading={isProcessing || isAwaiting}
          loadingChildren={loadingChildren}
          // TODO: Remove in #1161
          className="group-has-[.error-message]:cursor-not-allowed group-has-[.error-message]:opacity-40"
        >
          {user ? 'Create Strategy' : 'Connect Wallet'}
        </Button>
      </m.div>
    </form>
  );
};
