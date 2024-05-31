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
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { useWeb3 } from 'libs/web3';
import { Button } from 'components/common/button';
import { useCreateStrategy } from 'components/strategies/create/useCreate';
import { getStatusTextByTxStatus } from 'components/strategies/utils';
import { useModal } from 'hooks/useModal';
import { cn } from 'utils/helpers';
import { createStrategyEvents } from 'services/events/strategyEvents';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { SafeDecimal } from 'libs/safedecimal';
import { isNil } from 'lodash';
import style from 'components/strategies/common/form.module.css';

export interface CreateRecurringStrategySearch {
  base: string;
  quote: string;
  buyMin?: string;
  buyMax?: string;
  buyBudget?: string;
  buySettings: StrategySettings;
  sellMin?: string;
  sellMax?: string;
  sellBudget?: string;
  sellSettings: StrategySettings;
}

type OrderKey = keyof Omit<CreateRecurringStrategySearch, 'base' | 'quote'>;
const toOrderSearch = (order: Partial<Order>, direction: 'buy' | 'sell') => {
  const search: Partial<CreateRecurringStrategySearch> = {};
  for (const [key, value] of Object.entries(order)) {
    const camelCaseKey = key.charAt(0).toUpperCase() + key.slice(1);
    const searchKey = `${direction}${camelCaseKey}` as OrderKey;
    search[searchKey] = value as any;
  }
  return search;
};

const getWarning = (search: CreateRecurringStrategySearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const sellMinInRange =
    buyMin && buyMax && sellMin && +sellMin >= +buyMin && +sellMin < +buyMax;
  const buyMaxInRange =
    sellMin && sellMax && buyMax && +buyMax >= +sellMin && +buyMax < +sellMax;
  if (sellMinInRange || buyMaxInRange) {
    return 'Notice: your Buy and Sell orders overlap';
  }
};

const getError = (search: CreateRecurringStrategySearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const minReversed = buyMin && sellMin && +buyMin > +sellMin;
  const maxReversed = buyMax && sellMax && +buyMax > +sellMax;
  if (minReversed || maxReversed) {
    return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid an immediate loss of funds upon creation.';
  }
};

export const CreateRecurringStrategyPage = () => {
  const [showGraph, setShowGraph] = useState(true);
  const { getTokenById } = useTokens();
  const navigate = useNavigate({ from: '/strategies/create/recurring' });
  const search = useSearch({ from: '/strategies/create/recurring' });
  const base = getTokenById(search.base);
  const quote = getTokenById(search.quote);
  const { user } = useWeb3();
  const { openModal } = useModal();
  const marketPrice = useMarketPrice({ base, quote });

  useEffect(() => {
    const timeout = setTimeout(() => {
      createStrategyEvents.recurring.change(search);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [search]);

  const buyOrder: Order = {
    min: search.buyMin ?? '',
    max: search.buyMax ?? '',
    budget: search.buyBudget ?? '',
    settings: search.buySettings ?? 'range',
  };
  const sellOrder: Order = {
    min: search.sellMin ?? '',
    max: search.sellMax ?? '',
    budget: search.sellBudget ?? '',
    settings: search.sellSettings ?? 'range',
  };

  const { isProcessing, isAwaiting, createStrategy } = useCreateStrategy({
    base,
    quote,
    order0: buyOrder,
    order1: sellOrder,
  });

  const loading = isProcessing || isAwaiting;
  const loadingChildren = getStatusTextByTxStatus(isAwaiting, isProcessing);

  const connectWallet = () => {
    createStrategyEvents.recurring.connectWallet(search);
    openModal('wallet', undefined);
  };

  const setOrder = useCallback(
    (order: Partial<Order>, direction: StrategyDirection) => {
      navigate({
        search: (previous) => ({
          ...previous,
          ...toOrderSearch(order, direction),
        }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  const setSellOrder = useCallback(
    (order: Partial<Order>) => setOrder(order, 'sell'),
    [setOrder]
  );

  const setBuyOrder = useCallback(
    (order: Partial<Order>) => setOrder(order, 'buy'),
    [setOrder]
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
    createStrategyEvents.recurring.submit(search);
    createStrategy();
  };

  // Warnings
  const buyOutSideMarket = (() => {
    if (!marketPrice || isNil(search.buyMax)) return;
    if (new SafeDecimal(search.buyMax).gt(marketPrice)) {
      return `Notice: you offer to buy ${base?.symbol} above current market price`;
    }
  })();
  const sellOutsideMarket = (() => {
    if (!marketPrice || isNil(search.sellMin)) return;
    if (new SafeDecimal(search.sellMin).lt(marketPrice)) {
      return `Notice: you offer to sell ${base?.symbol} below current market price`;
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
                  <p className="text-14 capitalize text-white/60">Recurring</p>
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
              order={sellOrder}
              setOrder={setSellOrder}
              optionalBudget={+buyOrder.budget > 0}
              error={getError(search)}
              warning={buyOutSideMarket || getWarning(search)}
            />
            <OrderFields
              base={base}
              quote={quote}
              order={buyOrder}
              setOrder={setBuyOrder}
              optionalBudget={+sellOrder.budget > 0}
              error={getError(search)}
              warning={sellOutsideMarket || getWarning(search)}
              buy
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
