import { AnimatePresence } from 'framer-motion';
import { m } from 'libs/motion';
import { items, list } from 'components/strategies/create/variants';
import { CreateStrategyHeader } from 'components/strategies/create/CreateStrategyHeader';
import { CreateStrategyGraph } from 'components/strategies/create/CreateStrategyGraph';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTokens } from 'hooks/useTokens';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { useWeb3 } from 'libs/web3';
import { Button } from 'components/common/button';
import { useCreateStrategy } from 'components/strategies/create/useCreate';
import {
  getStatusTextByTxStatus,
  isValidRange,
} from 'components/strategies/utils';
import { useModal } from 'hooks/useModal';
import { cn } from 'utils/helpers';
import { createStrategyEvents } from 'services/events/strategyEvents';
import { CreateNewOverlapping } from 'components/strategies/create/CreateNewOverlapping';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { SafeDecimal } from 'libs/safedecimal';
import { OverlappingInitMarketPriceField } from 'components/strategies/overlapping/OverlappingMarketPrice';
import { isNil } from 'components/strategies/create/Order/utils';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
  isValidSpread,
} from 'components/strategies/overlapping/utils';
import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';
import style from 'components/strategies/common/form.module.css';
import { Token } from 'libs/tokens';

export interface CreateOverlappingStrategySearch {
  base: string;
  quote: string;
  marketPrice?: string;
  min?: string;
  max?: string;
  spread?: string;
  anchor?: 'buy' | 'sell';
  budget?: string;
}
type Search = CreateOverlappingStrategySearch;

const initSpread = '0.05';

const initMin = (marketPrice: string) => {
  return new SafeDecimal(marketPrice).times(0.99).toString();
};
const initMax = (marketPrice: string) => {
  return new SafeDecimal(marketPrice).times(1.01).toString();
};

const getOrders = (
  search: Search,
  base?: Token,
  quote?: Token,
  marketPrice?: string
) => {
  if (!base || !quote || !marketPrice) {
    return {
      buy: { min: '', max: '', marginalPrice: '', budget: '' },
      sell: { min: '', max: '', marginalPrice: '', budget: '' },
    };
  }
  const {
    anchor,
    min = initMin(marketPrice),
    max = initMax(marketPrice),
    spread = initSpread,
    budget,
  } = search;
  if (!isValidRange(min, max) || !isValidSpread(spread)) {
    return {
      buy: { min, max: min, marginalPrice: min, budget: '' },
      sell: { min, max: min, marginalPrice: min, budget: '' },
    };
  }
  const prices = calculateOverlappingPrices(min, max, marketPrice, spread);
  const orders = {
    buy: {
      min: prices.buyPriceLow,
      max: prices.buyPriceHigh,
      marginalPrice: prices.buyPriceMarginal,
      budget: '',
    },
    sell: {
      min: prices.sellPriceLow,
      max: prices.sellPriceHigh,
      marginalPrice: prices.sellPriceMarginal,
      budget: '',
    },
  };
  if (!anchor || isNil(budget)) return orders;
  if (anchor === 'buy') {
    if (isMinAboveMarket(orders.buy)) return orders;
    orders.buy.budget = budget;
    orders.sell.budget = calculateOverlappingSellBudget(
      base.decimals,
      quote.decimals,
      min,
      max,
      marketPrice,
      spread,
      budget
    );
  } else {
    if (isMaxBelowMarket(orders.sell)) return orders;
    orders.sell.budget = budget;
    orders.buy.budget = calculateOverlappingBuyBudget(
      base.decimals,
      quote.decimals,
      min,
      max,
      marketPrice,
      spread,
      budget
    );
  }
  return orders;
};

export const CreateOverlappingStrategyPage = () => {
  const [showGraph, setShowGraph] = useState(true);
  const { getTokenById } = useTokens();
  const navigate = useNavigate({ from: '/strategies/create/overlapping' });
  const search = useSearch({ from: '/strategies/create/overlapping' });
  const base = getTokenById(search.base);
  const quote = getTokenById(search.quote);
  const externalPrice = useMarketPrice({ base, quote });
  const marketPrice = search.marketPrice ?? externalPrice?.toString();
  const { user } = useWeb3();
  const { openModal } = useModal();

  useEffect(() => {
    const timeout = setTimeout(() => {
      createStrategyEvents.overlapping.change(search);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [search]);

  const orders = getOrders(search, base, quote, marketPrice);

  const { isProcessing, isAwaiting, createStrategy } = useCreateStrategy({
    base,
    quote,
    order0: orders.buy,
    order1: orders.sell,
  });

  const loading = isProcessing || isAwaiting;
  const loadingChildren = getStatusTextByTxStatus(isAwaiting, isProcessing);

  const connectWallet = () => {
    createStrategyEvents.overlapping.connectWallet(search);
    openModal('wallet', undefined);
  };

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
    createStrategyEvents.overlapping.submit(search);
    createStrategy();
  };

  if (!base || !quote) {
    return <CarbonLogoLoading className="h-[100px] place-self-center" />;
  }

  if (!marketPrice) {
    const setMarketPrice = (price: number) => {
      navigate({
        search: (previous) => ({ ...previous, marketPrice: price.toString() }),
        replace: true,
        resetScroll: false,
      });
    };
    return (
      <m.article
        variants={items}
        key="marketPrice"
        className="rounded-10 bg-background-900 flex flex-col place-self-center md:w-[440px]"
      >
        <OverlappingInitMarketPriceField
          base={base}
          quote={quote}
          marketPrice={+(marketPrice || '')}
          setMarketPrice={setMarketPrice}
        />
      </m.article>
    );
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
                  <p className="text-14 capitalize text-white/60">
                    Overlapping
                  </p>
                </hgroup>
              </div>
              <p className="text-12 font-weight-400 flex items-center text-white/60">
                <IconWarning className="ml-6 mr-10 w-14 flex-shrink-0" />
                Rebasing and fee-on-transfer tokens are not supported
              </p>
            </m.header>

            {!!marketPrice && (
              <>
                <CreateNewOverlapping
                  base={base}
                  quote={quote}
                  marketPrice={marketPrice}
                  order0={orders.buy}
                  order1={orders.sell}
                  spread={search.spread || initSpread}
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
                  {isNil(search.budget)
                    ? "I've reviewed the warning(s) but choose to proceed."
                    : "I've approved the token deposit(s) and distribution."}
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
              </>
            )}
          </form>
        </div>
      </m.div>
    </AnimatePresence>
  );
};
