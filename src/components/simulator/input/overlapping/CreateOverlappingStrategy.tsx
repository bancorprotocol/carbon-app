import {
  SimulatorInputOverlappingValues,
  SimulatorOverlappingInputDispatch,
} from 'hooks/useSimulatorOverlappingInput';

import { FC, useCallback, useEffect, useState } from 'react';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { CreateOverlappingStrategyBudget } from './CreateOverlappingStrategyBudget';
import { OverlappingStrategySpread } from 'components/strategies/overlapping/OverlappingStrategySpread';
import { CreateOverlappingRange } from './CreateOverlappingRange';
import {
  isMaxBelowMarket,
  isMinAboveMarket,
  isValidSpread,
} from 'components/strategies/overlapping/utils';
import { isValidRange } from 'components/strategies/utils';
import { SafeDecimal } from 'libs/safedecimal';
import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';

export interface OverlappingStrategyProps {
  state: SimulatorInputOverlappingValues;
  dispatch: SimulatorOverlappingInputDispatch;
  spread: number;
  setSpread: (value: number) => void;
  marketPrice: number;
}

const getInitialPrices = (marketPrice: string | number) => {
  const currentPrice = new SafeDecimal(marketPrice);
  return {
    min: currentPrice.times(0.9).toString(),
    max: currentPrice.times(1.1).toString(),
  };
};

export const CreateOverlappingStrategy: FC<OverlappingStrategyProps> = (
  props
) => {
  const { state, dispatch, spread, setSpread, marketPrice } = props;
  const { baseToken: base, quoteToken: quote } = state;
  const [anchoredOrder, setAnchoredOrder] = useState<'buy' | 'sell'>('buy');

  const setBuyBudget = (
    sellBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    if (!sellBudget) return dispatch('buyBudget', '');
    try {
      const buyBudget = calculateOverlappingBuyBudget(
        base.decimals,
        quote.decimals,
        buyMin,
        sellMax,
        marketPrice.toString(),
        spread.toString(),
        sellBudget
      );
      dispatch('buyBudget', buyBudget);
    } catch (err) {
      console.error(err);
      dispatch('buyBudget', '');
    }
  };

  const setSellBudget = (
    buyBudget: string,
    buyMin: string,
    sellMax: string
  ) => {
    if (!base || !quote) return;
    if (!buyBudget) return dispatch('sellBudget', '');
    try {
      const sellBudget = calculateOverlappingSellBudget(
        base.decimals,
        quote.decimals,
        buyMin,
        sellMax,
        marketPrice.toString(),
        spread.toString(),
        buyBudget
      );
      dispatch('sellBudget', sellBudget);
    } catch (err) {
      console.error(err);
      dispatch('sellBudget', '');
    }
  };

  const setOverlappingParams = (min: string, max: string) => {
    // Set min & max.
    dispatch('buyMin', min);
    dispatch('sellMax', max);

    // If invalid range, wait for timeout to reset range
    if (!isValidRange(min, max) || !isValidSpread(spread)) return;
    const prices = calculateOverlappingPrices(
      min,
      max,
      marketPrice.toString(),
      spread.toString()
    );

    // Set prices
    dispatch('buyMax', prices.buyPriceHigh);

    dispatch('sellMin', prices.sellPriceLow);

    // Set budgets
    const buyOrder = { min, marginalPrice: prices.buyPriceMarginal };
    const sellOrder = { max, marginalPrice: prices.sellPriceMarginal };
    if (isMinAboveMarket(buyOrder)) {
      setAnchoredOrder('sell');
      setBuyBudget(state.sell.budget, min, max);
    } else if (isMaxBelowMarket(sellOrder)) {
      setAnchoredOrder('buy');
      setSellBudget(state.buy.budget, min, max);
    } else {
      if (anchoredOrder === 'buy') setSellBudget(state.buy.budget, min, max);
      if (anchoredOrder === 'sell') setBuyBudget(state.sell.budget, min, max);
    }
  };

  const setMin = (min: string) => {
    if (!state.sell.max) return dispatch('buyMin', min);
    setOverlappingParams(min, state.sell.max);
  };

  const setMax = (max: string) => {
    if (!state.buy.min) return dispatch('sellMax', max);
    setOverlappingParams(state.buy.min, max);
  };

  // Initialize order when market price is available
  useEffect(() => {
    if (marketPrice <= 0 || !quote || !base) return;
    if (!state.buy.min && !state.sell.max) {
      requestAnimationFrame(() => {
        if (state.buy.min || state.sell.max) return;
        const { min, max } = getInitialPrices(marketPrice);
        setOverlappingParams(min, max);
      });
    } else {
      setOverlappingParams(state.buy.min, state.sell.max);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketPrice, spread, base, quote, state.buy.min, state.sell.max]);

  const setErrorCb = useCallback(
    (value: string) => dispatch('buyPriceError', value),
    [dispatch]
  );

  return (
    <>
      <article className="rounded-10 bg-background-900 grid grid-flow-col grid-cols-[auto_auto] grid-rows-2 gap-8 p-20">
        <h4 className="text-14 font-weight-500 flex items-center gap-8">
          Discover Overlapping Strategies
          <span className="rounded-8 bg-primary-dark text-10 text-primary px-8 py-4">
            NEW
          </span>
        </h4>
        <p className="text-12 text-white/60">
          Learn more about the new type of strategy creation.
        </p>
        <a
          href="https://faq.carbondefi.xyz/what-is-an-overlapping-strategy"
          target="_blank"
          className="text-12 font-weight-500 text-primary row-span-2 flex items-center gap-4 self-center justify-self-end"
          rel="noreferrer"
        >
          Learn More
          <IconLink className="h-12 w-12" />
        </a>
      </article>
      <article className="rounded-10 bg-background-900 flex flex-col gap-20 p-20">
        <header className="flex items-center gap-8">
          <span className="flex size-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
            1
          </span>
          <h3 className="text-18 font-weight-500 flex-1">
            Set Price Range&nbsp;
            <span className="text-white/40">
              ({quote?.symbol} per 1 {base?.symbol})
            </span>
          </h3>
          <Tooltip
            element="Indicate the strategy exact buy and sell prices."
            iconClassName="text-white/60"
          />
        </header>
        {base && quote && (
          <CreateOverlappingRange
            base={base}
            quote={quote}
            min={state.buy.min}
            max={state.sell.max}
            error={state.buy.priceError}
            setError={setErrorCb}
            setMin={setMin}
            setMax={setMax}
          />
        )}
      </article>
      <article className="rounded-10 bg-background-900 flex flex-col gap-10 p-20">
        <header className="mb-10 flex items-center gap-8 ">
          <span className="flex size-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
            2
          </span>
          <h3 className="text-18 font-weight-500 flex-1">Indicate Spread</h3>
          <Tooltip
            element="The difference between the highest bidding (Sell) price, and the lowest asking (Buy) price"
            iconClassName="text-white/60"
          />
        </header>
        <OverlappingStrategySpread
          buyMin={+state.buy.min}
          sellMax={+state.sell.max}
          defaultValue={0.05}
          options={[0.01, 0.05, 0.1]}
          spread={spread}
          setSpread={setSpread}
        />
      </article>
      <article className="rounded-10 bg-background-900 flex flex-col gap-20 p-20">
        <header className="flex items-center gap-8 ">
          <span className="flex size-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
            3
          </span>
          <h3 className="text-18 font-weight-500 flex-1">Set Budgets</h3>
          <Tooltip
            element="Indicate the budget you would like to allocate to the strategy. Note that in order to maintain the overlapping behavior, the 2nd budget indication will be calculated using the prices, spread and budget values."
            iconClassName="text-white/60"
          />
        </header>
        <CreateOverlappingStrategyBudget
          {...props}
          marketPrice={marketPrice}
          anchoredOrder={anchoredOrder}
          setAnchoredOrder={setAnchoredOrder}
          setBuyBudget={setBuyBudget}
          setSellBudget={setSellBudget}
        />
      </article>
    </>
  );
};
