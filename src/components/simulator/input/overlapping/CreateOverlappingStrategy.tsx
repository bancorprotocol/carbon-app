import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getMaxBuyMin,
  getMinSellMax,
  isMaxBelowMarket,
  isMinAboveMarket,
  isValidSpread,
} from 'components/strategies/overlapping/utils';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { OverlappingSpread } from 'components/strategies/overlapping/OverlappingSpread';
import { isValidRange } from 'components/strategies/utils';
import {
  calculateOverlappingBuyBudget,
  calculateOverlappingPrices,
  calculateOverlappingSellBudget,
} from '@bancor/carbon-sdk/strategy-management';
import { SafeDecimal } from 'libs/safedecimal';
import { OverlappingBudgetDistribution } from 'components/strategies/overlapping/OverlappingBudgetDistribution';
import { OverlappingAnchor } from 'components/strategies/overlapping/OverlappingAnchor';
import {
  SimulatorInputOverlappingValues,
  SimulatorOverlappingInputDispatch,
} from 'hooks/useSimulatorOverlappingInput';
import { InputRange } from 'components/strategies/create/BuySellBlock/InputRange';
import { BudgetInput } from 'components/strategies/common/BudgetInput';

interface Props {
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

export const CreateOverlappingStrategy: FC<Props> = (props) => {
  const { state, dispatch, marketPrice, spread, setSpread } = props;
  const { baseToken: base, quoteToken: quote, buy, sell } = state;
  const [touched, setTouched] = useState(false);
  const [anchor, setAnchor] = useState<'buy' | 'sell' | undefined>();
  const [anchorError, setAnchorError] = useState('');

  const { buyMarginal, sellMarginal } = useMemo(() => {
    const min = state.buy.min;
    const max = state.sell.max;
    if (!base || !quote || !isValidRange(min, max) || !isValidSpread(spread)) {
      return {
        buyMarginal: '',
        sellMarginal: '',
      };
    } else {
      const prices = calculateOverlappingPrices(
        state.buy.min,
        state.sell.max,
        marketPrice.toString(),
        state.spread
      );
      return {
        buyMarginal: prices.buyPriceMarginal,
        sellMarginal: prices.sellPriceMarginal,
      };
    }
  }, [
    base,
    marketPrice,
    quote,
    spread,
    state.buy.min,
    state.sell.max,
    state.spread,
  ]);

  const aboveMarket = (() => {
    if (!buyMarginal) return false;
    return isMinAboveMarket({
      min: state.buy.min,
      marginalPrice: buyMarginal,
    });
  })();

  const belowMarket = (() => {
    if (!sellMarginal) return false;
    return isMaxBelowMarket({
      max: state.sell.max,
      marginalPrice: sellMarginal,
    });
  })();

  const buyBudget = useMemo(() => {
    if (!base || !quote || !anchor) return '';
    if (anchor === 'buy') return state.buy.budget;
    if (!state.sell.budget || belowMarket) return '';
    return calculateOverlappingBuyBudget(
      base.decimals,
      quote.decimals,
      state.buy.min,
      state.sell.max,
      marketPrice.toString(),
      state.spread,
      state.sell.budget
    );
  }, [
    anchor,
    base,
    marketPrice,
    quote,
    state.buy.budget,
    state.buy.min,
    state.sell.budget,
    state.sell.max,
    state.spread,
    belowMarket,
  ]);

  const sellBudget = useMemo(() => {
    if (!base || !quote || !anchor) return '';
    if (anchor === 'sell') return state.sell.budget;
    if (!state.buy.budget || aboveMarket) return '';
    return calculateOverlappingSellBudget(
      base.decimals,
      quote.decimals,
      state.buy.min,
      state.sell.max,
      marketPrice.toString(),
      state.spread,
      state.buy.budget
    );
  }, [
    anchor,
    base,
    marketPrice,
    quote,
    state.buy.budget,
    state.buy.min,
    state.sell.budget,
    state.sell.max,
    state.spread,
    aboveMarket,
  ]);

  const budget = useMemo(() => {
    if (!anchor) return '';
    return anchor === 'buy' ? buyBudget : sellBudget;
  }, [anchor, buyBudget, sellBudget]);

  const setOverlappingPrices = (
    min: string,
    max: string,
    spreadValue: string = spread.toString()
  ) => {
    if (!base || !quote) return;
    if (!isValidRange(min, max) || !isValidSpread(spread)) return;
    const prices = calculateOverlappingPrices(
      min,
      max,
      marketPrice.toString(),
      spreadValue
    );
    dispatch('buyMax', prices.buyPriceHigh);
    dispatch('sellMin', prices.sellPriceLow);
    return prices;
  };

  const resetBudgets = (anchorValue: 'buy' | 'sell') => {
    if (!touched) {
      dispatch('buyBudget', '');
      dispatch('sellBudget', '');
      return;
    } else {
      if (anchorValue === 'buy') dispatch('buyBudget', '');
      else dispatch('sellBudget', '');
    }
  };

  const setSpreadValue = (value: number) => {
    setTouched(true);
    setSpread(value);
  };

  const setAnchorValue = (value: 'buy' | 'sell') => {
    if (!anchor) setAnchorError('');
    resetBudgets(value);
    setAnchor(value);
  };

  const setMin = (min: string) => {
    setTouched(true);
    dispatch('buyMin', min);
  };

  const setMax = (max: string) => {
    setTouched(true);
    dispatch('sellMax', max);
  };

  const setBudget = (amount: string) => {
    if (!amount) return resetBudgets(anchor!);
    if (anchor === 'buy') dispatch('buyBudget', amount);
    else dispatch('sellBudget', amount);
  };

  const setRangeError = useCallback(
    (value: string) => dispatch('buyPriceError', value),
    [dispatch]
  );

  const disabledAnchor = useMemo(() => {
    if (!buy.min || !sell.max || !marketPrice || !spread) return;
    const prices = calculateOverlappingPrices(
      buy.min,
      sell.max,
      marketPrice.toString(),
      spread.toString()
    );
    const buyOrder = {
      min: prices.buyPriceLow,
      marginalPrice: prices.buyPriceMarginal,
    };
    const sellOrder = {
      max: prices.sellPriceHigh,
      marginalPrice: prices.sellPriceMarginal,
    };
    // Disable anchor
    if (isMinAboveMarket(buyOrder)) return 'buy';
    if (isMaxBelowMarket(sellOrder)) return 'sell';
    return;
  }, [buy.min, marketPrice, sell.max, spread]);

  // Reset anchor and price when current one it disabled
  useEffect(() => {
    if (!disabledAnchor || !anchor) return;
    if (disabledAnchor === 'buy' && anchor === 'buy') {
      resetBudgets('buy');
      setAnchor('sell');
    }
    if (disabledAnchor === 'sell' && anchor === 'sell') {
      resetBudgets('sell');
      setAnchor('buy');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabledAnchor, anchor]);

  // Update buy.max & sell.min
  useEffect(() => {
    if (!spread || !marketPrice) return;
    if (!buy.min && !sell.max) {
      const { min, max } = getInitialPrices(marketPrice);
      queueMicrotask(() => {
        dispatch('buyMin', min);
        dispatch('sellMax', max);
        setOverlappingPrices(min, max);
      });
    } else {
      setOverlappingPrices(buy.min, sell.max);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched, anchor, marketPrice, buy.min, sell.max]);

  // Update on buyMin changes
  useEffect(() => {
    if (!buy.min) return;
    const timeout = setTimeout(async () => {
      const minSellMax = getMinSellMax(Number(buy.min), spread);
      if (Number(sell.max) < minSellMax) setMax(minSellMax.toString());
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buy.min]);

  // Update on sellMax changes
  useEffect(() => {
    if (!sell.max) return;
    const timeout = setTimeout(async () => {
      const maxBuyMin = getMaxBuyMin(Number(sell.max), spread);
      if (Number(buy.min) > maxBuyMin) setMin(maxBuyMin.toString());
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sell.max]);

  if (!base || !quote) return null;

  return (
    <>
      <article className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20">
        <header className="flex items-center gap-8">
          <h3 className="text-18 font-weight-500 flex-1">
            Set Price Range&nbsp;
            <span className="text-white/40">
              ({quote?.symbol} per 1 {base?.symbol})
            </span>
          </h3>
          <Tooltip
            element="Indicate the strategy exact buy and sell prices."
            iconClassName="h-14 w-14 text-white/60"
          />
        </header>
        {base && quote && (
          <InputRange
            minLabel="Min Buy Price"
            maxLabel="Max Sell Price"
            base={base}
            quote={quote}
            min={buy.min}
            max={sell.max}
            setMin={setMin}
            setMax={setMax}
            error={state.buy.priceError}
            setRangeError={setRangeError}
          />
        )}
      </article>
      <article className="rounded-10 bg-background-900 flex w-full flex-col gap-10 p-20">
        <header className="mb-10 flex items-center gap-8 ">
          <h3 className="text-18 font-weight-500 flex-1">Set Spread</h3>
          <Tooltip
            element="The difference between the highest bidding (Sell) price, and the lowest asking (Buy) price"
            iconClassName="h-14 w-14 text-white/60"
          />
        </header>
        <OverlappingSpread
          buyMin={Number(buy.min)}
          sellMax={Number(sell.max)}
          defaultValue={0.05}
          options={[0.01, 0.05, 0.1]}
          spread={spread}
          setSpread={setSpreadValue}
        />
      </article>
      <OverlappingAnchor
        base={base}
        quote={quote}
        anchor={anchor}
        setAnchor={setAnchorValue}
        anchorError={anchorError}
        disableBuy={disabledAnchor === 'buy'}
        disableSell={disabledAnchor === 'sell'}
      />
      {anchor && (
        <article className="rounded-10 bg-background-900 flex w-full flex-col gap-16 p-20">
          <hgroup>
            <h3 className="text-16 font-weight-500 flex items-center gap-6">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[10px] text-white/60">
                2
              </span>
              Deposit Budget
            </h3>
            <p className="text-14 text-white/80">
              Please enter the amount of tokens you want to deposit.
            </p>
          </hgroup>
          <BudgetInput
            action="deposit"
            token={anchor === 'buy' ? quote : base}
            value={budget}
            onChange={setBudget}
            data-testid="input-budget"
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
              Following the above deposit amount, these are the changes in
              budget allocation
            </p>
          </hgroup>
          <OverlappingBudgetDistribution
            token={base}
            initialBudget={sellBudget || '0'}
            withdraw="0"
            deposit="0"
            balance="0"
            isSimulator
          />
          <OverlappingBudgetDistribution
            token={quote}
            initialBudget={buyBudget || '0'}
            withdraw="0"
            deposit="0"
            balance="0"
            buy
            isSimulator
          />
        </article>
      )}
    </>
  );
};
