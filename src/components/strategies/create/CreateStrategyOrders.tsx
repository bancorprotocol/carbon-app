import { FormEvent, useMemo } from 'react';
import { Button } from 'components/common/button';
import { m } from 'libs/motion';
import { BuySellBlock } from './BuySellBlock';
import { items } from './variants';
import { UseStrategyCreateReturn } from 'components/strategies/create';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { useStrategyEventData } from './useStrategyEventData';
import { carbonEvents } from 'services/events';
import useInitEffect from 'hooks/useInitEffect';
import { useWeb3 } from 'libs/web3';
import { getStatusTextByTxStatus } from '../utils';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { CreateOverlappingStrategy } from './overlapping/CreateOverlappingStrategy';

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
  selectedStrategySettings,
  isProcessing,
  isAwaiting,
  isOrdersOverlap,
  spreadPPM,
  setSpreadPPM,
  isOverlapping,
}: UseStrategyCreateReturn) => {
  const { user } = useWeb3();
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
    carbonEvents.strategy.strategyCreateClick(strategyEventData);
    createStrategy();
  };

  const loadingChildren = useMemo(() => {
    return getStatusTextByTxStatus(isAwaiting, isProcessing);
  }, [isAwaiting, isProcessing]);

  return (
    <form
      onSubmit={(e) => onCreateStrategy(e)}
      className="flex flex-col gap-20 md:w-[440px]"
      data-testid="create-strategy-form"
    >
      <m.header
        variants={items}
        key="createStrategyBuyTokens"
        className="flex flex-col gap-10 rounded-10 bg-silver p-20"
      >
        <div className="flex gap-10">
          <TokensOverlap className="h-32 w-32" tokens={[base!, quote!]} />
          <div>
            <h2 className="flex gap-6 text-14">
              <span>{base?.symbol}</span>
              <span role="separator" className="text-secondary">
                /
              </span>
              <span>{quote?.symbol}</span>
            </h2>
            <div className="text-secondary capitalize">{strategyType}</div>
          </div>
        </div>
        <p className="flex items-center text-12 font-weight-400 text-white/60">
          <IconWarning className="ml-6 mr-10 w-14 flex-shrink-0" /> Rebasing and
          and fee-on-transfer tokens are not supported
        </p>
      </m.header>

      {isOverlapping && base && quote && (
        <CreateOverlappingStrategy
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
          token0BalanceQuery={token0BalanceQuery}
          token1BalanceQuery={token1BalanceQuery}
          spreadPPM={spreadPPM}
          setSpreadPPM={setSpreadPPM}
        />
      )}
      {!isOverlapping && (
        <>
          {(strategyDirection === 'buy' || !strategyDirection) && (
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
            />
          )}
          {(strategyDirection === 'sell' || !strategyDirection) && (
            <BuySellBlock
              key="createStrategySellOrder"
              base={base!}
              quote={quote!}
              order={order1}
              tokenBalanceQuery={token0BalanceQuery}
              isBudgetOptional={+order1.budget === 0 && +order0.budget > 0}
              strategyType={strategyType}
              isOrdersOverlap={isOrdersOverlap}
            />
          )}
        </>
      )}
      <m.div variants={items} key="createStrategyCTA">
        <Button
          type="submit"
          variant="success"
          size="lg"
          fullWidth
          disabled={isCTAdisabled}
          loading={isProcessing || isAwaiting}
          loadingChildren={loadingChildren}
        >
          {user ? 'Create Strategy' : 'Connect Wallet'}
        </Button>
      </m.div>
    </form>
  );
};
