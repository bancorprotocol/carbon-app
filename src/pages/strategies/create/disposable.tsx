import { AnimatePresence } from 'framer-motion';
import { m } from 'libs/motion';
import { items, list } from 'components/strategies/create/variants';
import { CreateStrategyHeader } from 'components/strategies/create/CreateStrategyHeader';
import { CreateStrategyGraph } from 'components/strategies/create/CreateStrategyGraph';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTokens } from 'hooks/useTokens';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { StrategyDirection, StrategySettings } from 'libs/routing';
import { OrderFields } from 'components/strategies/create/Order/OrderFields';
import { Order } from 'components/strategies/create/Order/OrderContext';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { TabsMenu } from 'components/common/tabs/TabsMenu';
import { TabsMenuButton } from 'components/common/tabs/TabsMenuButton';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { useWeb3 } from 'libs/web3';
import { Button } from 'components/common/button';
import { useCreateStrategy } from 'components/strategies/create/useCreate';
import { getStatusTextByTxStatus } from 'components/strategies/utils';
import { useModal } from 'hooks/useModal';
import { cn, formatNumber } from 'utils/helpers';
import { createStrategyEvents } from 'services/events/strategyEvents';
import style from 'components/strategies/common/form.module.css';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { SafeDecimal } from 'libs/safedecimal';

export interface CreateDisposableStrategySearch {
  base: string;
  quote: string;
  direction: StrategyDirection;
  settings: StrategySettings;
  min?: string;
  max?: string;
  budget?: string;
}

const emptyOrder = () => ({
  min: '0',
  max: '0',
  budget: '0',
  settings: 'limit' as const,
});

export const CreateDisposableStrategyPage = () => {
  const [showGraph, setShowGraph] = useState(true);
  const { getTokenById } = useTokens();
  const navigate = useNavigate({ from: '/strategies/create/disposable' });
  const search = useSearch({ from: '/strategies/create/disposable' });
  const base = getTokenById(search.base);
  const quote = getTokenById(search.quote);
  const { user } = useWeb3();
  const { openModal } = useModal();
  const marketPrice = useMarketPrice({ base, quote });

  useEffect(() => {
    const timeout = setTimeout(() => {
      createStrategyEvents.disposable.change(search);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [search]);

  const buy = search.direction !== 'sell';
  const order: Order = {
    min: search.min ?? '',
    max: search.max ?? '',
    budget: search.budget ?? '',
    settings: search.settings ?? 'limit',
  };

  const { isProcessing, isAwaiting, createStrategy } = useCreateStrategy({
    base,
    quote,
    order0: buy ? order : emptyOrder(),
    order1: buy ? emptyOrder() : order,
  });

  const loading = isProcessing || isAwaiting;
  const loadingChildren = getStatusTextByTxStatus(isAwaiting, isProcessing);

  const connectWallet = () => {
    createStrategyEvents.disposable.connectWallet(search);
    openModal('wallet', undefined);
  };

  const setDirection = (direction: StrategyDirection) => {
    navigate({
      search: (previous) => ({
        ...previous,
        direction,
        min: '',
        max: '',
        budget: '',
      }),
      replace: true,
      resetScroll: false,
    });
  };

  const setOrder = useCallback(
    (order: Partial<Order>) => {
      navigate({
        search: (previous) => ({ ...previous, ...order }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  const isDisabled = (form: HTMLFormElement) => {
    if (!form.checkValidity()) return true;
    if (!!form.querySelector('.error-message')) return true;
    const warnings = form.querySelector('.warning-message');
    if (!warnings) return false;
    return !form.querySelector<HTMLInputElement>('#approve-warnings')?.checked;
  };

  const create = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled(e.currentTarget)) return;
    createStrategyEvents.disposable.submit(search);
    createStrategy();
  };

  // Warnings
  const outSideMarket = (() => {
    if (!marketPrice || !search.min || !+formatNumber(search.min)) return;
    if (buy) {
      if (new SafeDecimal(search.min).gt(marketPrice)) {
        return `Notice: you offer to buy ${base?.symbol} above current market price`;
      }
    } else {
      if (new SafeDecimal(search.min).lt(marketPrice)) {
        return `Notice: you offer to sell ${base?.symbol} below current market price`;
      }
    }
  })();

  if (!base || !quote) {
    return <CarbonLogoLoading className="h-[100px] place-self-center" />;
  }

  return (
    <AnimatePresence mode="sync">
      <m.div
        className={`flex flex-col gap-20 p-20 ${
          showGraph ? '' : 'md:w-[480px] md:justify-self-center'
        }`}
        variants={list}
        initial="hidden"
        animate="visible"
      >
        <CreateStrategyHeader
          showGraph={showGraph}
          setShowGraph={setShowGraph}
        />

        <div className="flex flex-col gap-20 md:flex-row-reverse md:justify-center">
          {showGraph && (
            <CreateStrategyGraph
              base={base}
              quote={quote}
              showGraph={showGraph}
              setShowGraph={setShowGraph}
            />
          )}
          <form
            onSubmit={create}
            className={cn(style.form, 'flex flex-col gap-20 md:w-[440px]')}
            data-testid="create-strategy-form"
          >
            <m.header
              variants={items}
              key="createStrategyBuyTokens"
              className="rounded-10 bg-background-900 flex flex-col gap-10 p-20"
            >
              <div className="flex gap-10">
                <TokensOverlap tokens={[base, quote]} size={32} />
                <hgroup>
                  <h2 className="text-14 flex gap-6">
                    <span>{base?.symbol}</span>
                    <span role="separator" className="text-white/60">
                      /
                    </span>
                    <span>{quote?.symbol}</span>
                  </h2>
                  <p className="text-14 capitalize text-white/60">Disposable</p>
                </hgroup>
              </div>
              <p className="text-12 font-weight-400 flex items-center text-white/60">
                <IconWarning className="ml-6 mr-10 w-14 flex-shrink-0" />
                Rebasing and fee-on-transfer tokens are not supported
              </p>
            </m.header>
            <OrderFields
              base={base}
              quote={quote}
              buy={buy}
              order={order}
              setOrder={setOrder}
              warning={outSideMarket}
              settings={
                <TabsMenu>
                  <TabsMenuButton
                    onClick={() => setDirection('buy')}
                    isActive={buy}
                    data-testid="tab-buy"
                  >
                    Buy
                  </TabsMenuButton>
                  <TabsMenuButton
                    onClick={() => setDirection('sell')}
                    isActive={!buy}
                    data-testid="tab-sell"
                  >
                    Sell
                  </TabsMenuButton>
                </TabsMenu>
              }
            />
            <m.label
              htmlFor="approve-warnings"
              variants={items}
              className={cn(
                style.approveWarnings,
                'rounded-10 bg-background-900 text-14 font-weight-500 flex items-center gap-8 p-20 text-white/60'
              )}
            >
              <input
                id="approve-warnings"
                type="checkbox"
                data-testid="approve-warnings"
              />
              I've reviewed the warning(s) but choose to proceed.
            </m.label>

            <m.div variants={items} key="createStrategyCTA">
              {user ? (
                <Button
                  type="submit"
                  variant="success"
                  size="lg"
                  fullWidth
                  loading={loading}
                  loadingChildren={loadingChildren}
                >
                  Create Strategy
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="success"
                  size="lg"
                  fullWidth
                  loading={loading}
                  loadingChildren={loadingChildren}
                  onClick={connectWallet}
                >
                  Connect Wallet
                </Button>
              )}
            </m.div>
          </form>
        </div>
      </m.div>
    </AnimatePresence>
  );
};
