import { FormEvent, useCallback, useEffect, useMemo } from 'react';
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
import { useModal } from 'hooks/useModal';
import { lsService } from 'services/localeStorage';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { useNavigate } from 'libs/routing';

let didInit = false;

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
  isDuplicate,
  strategySettings,
  selectedStrategySettings,
  isProcessing,
  isAwaiting,
  isOrdersOverlap,
}: UseStrategyCreateReturn) => {
  const { user } = useWeb3();
  const { openModal } = useModal();
  const navigate = useNavigate();
  const strategyEventData = useStrategyEventData({
    base,
    quote,
    order0,
    order1,
  });

  useInitEffect(() => {
    selectedStrategySettings?.search.strategyType === 'disposable' &&
      carbonEvents.strategy.strategyDirectionChange({
        baseToken: base,
        quoteToken: quote,
        strategySettings: selectedStrategySettings.search.strategySettings,
        strategyDirection: strategyDirection,
        strategyType: selectedStrategySettings.search.strategyType,
      });
  }, [strategyDirection]);

  const handleExpertMode = useCallback(() => {
    if (lsService.getItem('hasSeenCreateStratExpertMode')) {
      return;
    }

    if (isDuplicate && (order0.isRange || order1.isRange)) {
      return openModal('createStratExpertMode', {
        onClose: () => {
          order0.setIsRange(false);
          order1.setIsRange(false);
        },
      });
    }

    if (strategySettings === 'range' || strategySettings === 'custom') {
      return openModal('createStratExpertMode', {
        onClose: () =>
          navigate({
            search: (prev: any) => ({ ...prev, strategySettings: 'limit' }),
            replace: true,
          }),
      });
    }
  }, [isDuplicate, navigate, openModal, order0, order1, strategySettings]);

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      void handleExpertMode();
    }
  }, [handleExpertMode]);

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
    >
      <m.header
        variants={items}
        key={'createStrategyBuyTokens'}
        className={'flex flex-col gap-10 rounded-10 bg-silver p-20'}
      >
        <div className={'flex gap-10'}>
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
        <p
          className={'flex items-center text-12 font-weight-400 text-white/60'}
        >
          <IconWarning className={'ml-6 mr-10 w-14 flex-shrink-0'} /> Rebasing
          and fee-on-transfer tokens are not supported
        </p>
      </m.header>

      {(strategyDirection === 'buy' || !strategyDirection) && (
        <BuySellBlock
          key={'createStrategyBuyOrder'}
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
          key={'createStrategySellOrder'}
          base={base!}
          quote={quote!}
          order={order1}
          tokenBalanceQuery={token0BalanceQuery}
          isBudgetOptional={+order1.budget === 0 && +order0.budget > 0}
          strategyType={strategyType}
          isOrdersOverlap={isOrdersOverlap}
        />
      )}
      <m.div variants={items} key={'createStrategyCTA'}>
        <Button
          type="submit"
          variant={'success'}
          size={'lg'}
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
