import { FC, useCallback, useEffect, useState } from 'react';
import { useGetTokenBalance } from 'libs/queries';
import {
  getMaxBuyMin,
  getMinSellMax,
  isMaxBelowMarket,
  isMinAboveMarket,
} from 'components/strategies/overlapping/utils';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OverlappingSpread } from 'components/strategies/overlapping/OverlappingSpread';
import { calculateOverlappingPrices } from '@bancor/carbon-sdk/strategy-management';
import { SafeDecimal } from 'libs/safedecimal';
import {
  BudgetDescription,
  BudgetDistribution,
} from 'components/strategies/common/BudgetDistribution';
import { OverlappingAnchor } from 'components/strategies/overlapping/OverlappingAnchor';
import { getDeposit, getWithdraw } from './utils';
import { OverlappingAction } from 'components/strategies/overlapping/OverlappingAction';
import { hasNoBudget } from '../overlapping/utils';
import { OverlappingMarketPrice } from 'components/strategies/overlapping/OverlappingMarketPrice';
import { OverlappingMarketPriceProvider } from 'components/strategies/UserMarketPrice';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { formatNumber } from 'utils/helpers';
import { OverlappingOrder } from '../common/types';
import { useEditStrategyCtx } from './EditStrategyContext';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { EditOverlappingStrategySearch } from 'pages/strategies/edit/prices/overlapping';
import { InputRange } from '../common/InputRange';
import { useMarketPrice } from 'hooks/useMarketPrice';
import { TokenLogo } from 'components/common/imager/Imager';
import { InputLimit } from '../common/InputLimit';
import { Button } from 'components/common/button';
import { isZero } from '../common/utils';
import { isValidRange } from '../utils';
import { OverlappingChart } from '../overlapping/OverlappingChart';

interface Props {
  marketPrice: string;
  order0: OverlappingOrder;
  order1: OverlappingOrder;
  spread: string;
}

// When working with edit overlapping we can't trust marginal price when budget was 0, so we need to recalculate
export function isEditAboveMarket(
  min: string,
  max: string,
  marketPrice: number | undefined,
  spread: number
) {
  if (!marketPrice) return false;
  const prices = calculateOverlappingPrices(
    formatNumber(min || '0'),
    formatNumber(max || '0'),
    marketPrice.toString(),
    spread.toString()
  );
  return isMinAboveMarket({
    min: prices.buyPriceLow,
    marginalPrice: prices.buyPriceMarginal,
  });
}
export function isEditBelowMarket(
  min: string,
  max: string,
  marketPrice: number | undefined,
  spread: number
) {
  if (!marketPrice) return false;
  const prices = calculateOverlappingPrices(
    formatNumber(min || '0'),
    formatNumber(max || '0'),
    marketPrice.toString(),
    spread.toString()
  );
  return isMaxBelowMarket({
    max: prices.sellPriceHigh,
    marginalPrice: prices.sellPriceMarginal,
  });
}

type Search = EditOverlappingStrategySearch;

const url = '/strategies/edit/$strategyId/prices/overlapping';
export const EditOverlappingPrice: FC<Props> = (props) => {
  const { marketPrice, order0, order1, spread } = props;
  const { strategy } = useEditStrategyCtx();
  const { base, quote } = strategy;

  const { marketPrice: externalPrice } = useMarketPrice({ base, quote });

  const search = useSearch({ from: url });
  const navigate = useNavigate({ from: url });
  const { action, anchor, budget } = search;

  const baseBalance = useGetTokenBalance(base).data;
  const quoteBalance = useGetTokenBalance(quote).data;
  const [localPrice, setLocalPrice] = useState('');

  const initialBuyBudget = strategy.order0.balance;
  const initialSellBudget = strategy.order1.balance;
  const depositBuyBudget = getDeposit(initialBuyBudget, order0.budget);
  const withdrawBuyBudget = getWithdraw(initialBuyBudget, order0.budget);
  const depositSellBudget = getDeposit(initialSellBudget, order1.budget);
  const withdrawSellBudget = getWithdraw(initialSellBudget, order1.budget);

  const set = useCallback(
    <T extends keyof Search>(key: T, value: Search[T]) => {
      navigate({
        params: (params) => params,
        search: (previous) => ({ ...previous, [key]: value }),
        replace: true,
        resetScroll: false,
      });
    },
    [navigate]
  );

  const displayPrice = externalPrice || search.marketPrice;
  const aboveMarket = isMinAboveMarket(order0);
  const belowMarket = isMaxBelowMarket(order1);

  // ERROR
  const budgetError = (() => {
    const value = anchor === 'buy' ? order0.budget : order1.budget;
    const budget = new SafeDecimal(value);
    if (action === 'deposit' && anchor === 'buy' && quoteBalance) {
      const delta = budget.sub(initialBuyBudget);
      if (delta.gt(quoteBalance)) return 'Insufficient balance';
    }
    if (action === 'deposit' && anchor === 'sell' && baseBalance) {
      const delta = budget.sub(initialSellBudget);
      if (delta.gt(baseBalance)) return 'Insufficient balance';
    }
    if (action === 'withdraw' && anchor === 'buy' && quoteBalance) {
      if (budget.lt(0)) return 'Insufficient funds';
    }
    if (action === 'withdraw' && anchor === 'sell' && baseBalance) {
      if (budget.lt(0)) return 'Insufficient funds';
    }
    return '';
  })();

  // WARNING
  const priceWarning = (() => {
    if (!aboveMarket && !belowMarket) return;
    return 'Notice: your strategy is “out of the money” and will be traded when the market price moves into your price range.';
  })();

  const budgetWarning = (() => {
    if (action !== 'deposit' || !search.budget) return;
    return 'Please note that the deposit might create an arb opportunity.';
  })();

  useEffect(() => {
    if (!isValidRange(order0.min, order1.max)) return;
    if (anchor === 'buy' && aboveMarket) {
      set('anchor', 'sell');
      set('budget', undefined);
    }
    if (anchor === 'sell' && belowMarket) {
      set('anchor', 'buy');
      set('budget', undefined);
    }
  }, [anchor, aboveMarket, belowMarket, set, order0.min, order1.max]);

  const setMarketPrice = (price: string) => set('marketPrice', price);
  const setMin = (min: string) => set('min', min);
  const setMax = (max: string) => set('max', max);
  const setSpread = (value: string) => set('spread', value);

  const setAnchor = (value: 'buy' | 'sell') => {
    set('budget', undefined);
    set('anchor', value);
    if (!action) set('action', 'deposit');
  };

  const setAction = (value: 'deposit' | 'withdraw') => {
    set('budget', undefined);
    set('action', value);
  };

  const setBudget = async (value: string) => {
    set('budget', value);
  };

  // Update on buyMin changes
  useEffect(() => {
    if (isZero(order0.min)) return;
    const timeout = setTimeout(async () => {
      const minSellMax = getMinSellMax(Number(order0.min), Number(spread));
      if (Number(order1.max) < minSellMax) set('max', minSellMax.toString());
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order0.min]);

  // Update on sellMax changes
  useEffect(() => {
    if (isZero(order1.max)) return;
    const timeout = setTimeout(async () => {
      const maxBuyMin = getMaxBuyMin(Number(order1.max), Number(spread));
      if (Number(order0.min) > maxBuyMin) set('min', maxBuyMin.toString());
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order1.max]);

  return (
    <OverlappingMarketPriceProvider marketPrice={+marketPrice}>
      <article className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20">
        <header className="flex items-center gap-8">
          <h2 className="text-18 font-weight-500 flex-1">Price Range</h2>
          {displayPrice && (
            <OverlappingMarketPrice
              base={base}
              quote={quote}
              marketPrice={marketPrice}
              setMarketPrice={setMarketPrice}
            />
          )}
        </header>
        <OverlappingChart
          className="min-h-[250px]"
          base={base}
          quote={quote}
          order0={order0}
          order1={order1}
          userMarketPrice={search.marketPrice}
          spread={spread}
          setMin={setMin}
          setMax={setMax}
          disabled={!displayPrice}
        />
        {hasNoBudget(strategy) && (
          <Warning>
            Since the strategy had no budget, it will use the current market
            price to readjust the budget distribution around.
          </Warning>
        )}
      </article>
      {displayPrice && (
        <>
          <article className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20">
            <header className="flex items-center gap-8">
              <h2 className="text-18 font-weight-500 flex-1">
                Edit Price Range&nbsp;
                <span className="text-white/40">
                  ({quote?.symbol} per 1 {base?.symbol})
                </span>
              </h2>
              <Tooltip
                element="Indicate the strategy exact buy and sell prices."
                iconClassName="size-18 text-white/60"
              />
            </header>
            <InputRange
              base={base}
              quote={quote}
              min={order0.min}
              max={order1.max}
              setMin={setMin}
              setMax={setMax}
              minLabel="Min Buy Price"
              maxLabel="Max Sell Price"
              warnings={[priceWarning]}
              isOverlapping
              required
            />
          </article>
          <article className="rounded-10 bg-background-900 flex w-full flex-col gap-10 p-20">
            <header className="mb-10 flex items-center gap-8 ">
              <h2 className="text-18 font-weight-500 flex-1">Edit Fee Tier</h2>
              <Tooltip
                element="The difference between the highest bidding (Sell) price, and the lowest asking (Buy) price"
                iconClassName="size-18 text-white/60"
              />
            </header>
            <OverlappingSpread
              buyMin={Number(order0.min)}
              sellMax={Number(order1.max)}
              defaultValue={0.05}
              options={[0.01, 0.05, 0.1]}
              spread={spread}
              setSpread={setSpread}
            />
          </article>
        </>
      )}
      {!displayPrice && (
        <article className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20">
          <hgroup>
            <h2 className="text-18 font-weight-500 flex-1">Market Price</h2>
            <p className="text-12 text-white/80">
              {base.symbol} market price is missing. Please provide the market
              price to enable price editing.
            </p>
          </hgroup>
          <Tooltip element="Price used to calculate concentrated liquidity strategy params">
            <label
              htmlFor="market-price-input"
              className="text-14 font-weight-500 flex items-center gap-4 text-white/80"
            >
              Enter <TokenLogo token={base} size={14} /> {base.symbol} market
              price ({quote.symbol} per 1 {base.symbol})
            </label>
          </Tooltip>
          <InputLimit
            id="market-price-input"
            price={localPrice}
            setPrice={setLocalPrice}
            base={base}
            quote={quote}
            ignoreMarketPriceWarning
          />
          <Button
            type="button"
            disabled={!localPrice}
            onClick={() => setMarketPrice(localPrice)}
          >
            Confirm
          </Button>
        </article>
      )}
      <article className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20">
        <header className="flex items-center justify-between">
          <h2 className="text-18">Budget</h2>
          <Tooltip
            iconClassName="size-18 text-white/60"
            element="Indicate the token, action and amount for the strategy. Note that in order to maintain the concentrated liquidity behavior, the 2nd budget indication will be calculated using the prices, fee tier and budget values you use."
          />
        </header>
        <p className="text-14 text-white/80">
          Please select a token to proceed.
        </p>
        <OverlappingAnchor
          base={base}
          quote={quote}
          anchor={anchor}
          setAnchor={setAnchor}
          disableBuy={aboveMarket}
          disableSell={belowMarket}
        />
      </article>
      {anchor && (
        <article className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20">
          <OverlappingAction
            base={base}
            quote={quote}
            anchor={anchor}
            action={action}
            setAction={setAction}
            budget={budget ?? ''}
            setBudget={setBudget}
            buyBudget={initialBuyBudget}
            sellBudget={initialSellBudget}
            warning={budgetWarning}
          />
        </article>
      )}
      {anchor && (
        <article
          id="overlapping-distribution"
          className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20"
        >
          <hgroup>
            <h3 className="text-16 font-weight-500 flex items-center gap-8">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px] text-white/60">
                3
              </span>
              Distribution
            </h3>
            <p className="text-14 text-white/80">
              Following the above {action} amount, these are the changes in
              budget allocation
            </p>
          </hgroup>
          <BudgetDistribution
            title="Sell"
            token={base}
            initialBudget={initialSellBudget}
            withdraw={budgetError ? '0' : withdrawSellBudget}
            deposit={budgetError ? '0' : depositSellBudget}
            balance={baseBalance ?? '0'}
          />
          <BudgetDescription
            token={base}
            initialBudget={initialSellBudget}
            withdraw={budgetError ? '0' : withdrawSellBudget}
            deposit={budgetError ? '0' : depositSellBudget}
            balance={baseBalance ?? '0'}
          />
          <BudgetDistribution
            title="Buy"
            token={quote}
            initialBudget={initialBuyBudget}
            withdraw={budgetError ? '0' : withdrawBuyBudget}
            deposit={budgetError ? '0' : depositBuyBudget}
            balance={quoteBalance ?? '0'}
            buy
          />
          <BudgetDescription
            token={quote}
            initialBudget={initialBuyBudget}
            withdraw={budgetError ? '0' : withdrawBuyBudget}
            deposit={budgetError ? '0' : depositBuyBudget}
            balance={quoteBalance ?? '0'}
          />
        </article>
      )}
    </OverlappingMarketPriceProvider>
  );
};
