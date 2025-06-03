import { FC, useEffect, useMemo, useState } from 'react';
import {
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
import { BudgetDistribution } from 'components/strategies/common/BudgetDistribution';
import { OverlappingAnchor } from 'components/strategies/overlapping/OverlappingAnchor';
import {
  SimulatorInputOverlappingValues,
  SimulatorOverlappingInputDispatch,
} from 'hooks/useSimulatorOverlappingInput';
import { InputBudget } from 'components/strategies/common/InputBudget';
import { formatNumber } from 'utils/helpers';
import { OverlappingPriceRange } from 'components/strategies/overlapping/OverlappingPriceRange';
import { isZero } from 'components/strategies/common/utils';
import { overlappingMultiplier } from 'components/strategies/create/utils';

interface Props {
  state: SimulatorInputOverlappingValues;
  dispatch: SimulatorOverlappingInputDispatch;
  spread: string;
  setSpread: (value: string) => void;
  marketPrice: number;
}

const getInitialPrices = (marketPrice: string | number) => {
  const currentPrice = new SafeDecimal(marketPrice);
  return {
    min: currentPrice.times(overlappingMultiplier.min).toString(),
    max: currentPrice.times(overlappingMultiplier.max).toString(),
  };
};

export const CreateOverlappingStrategy: FC<Props> = (props) => {
  const { state, dispatch, marketPrice, spread, setSpread } = props;
  const { baseToken: base, quoteToken: quote, buy, sell } = state;
  const [touched, setTouched] = useState(false);
  const [anchor, setAnchor] = useState<'buy' | 'sell' | undefined>();

  useEffect(() => {
    // Hack: on focus from input while scrolling as it prevents reactive state to behave correctly
    if (document.activeElement instanceof HTMLInputElement) {
      document.activeElement.blur();
    }
  }, [state.start]);

  const { buyMarginal, sellMarginal } = useMemo(() => {
    const min = state.buy.min;
    const max = state.sell.max;
    const validSpread = isValidSpread(min, max, spread);
    if (!base || !quote || !isValidRange(min, max) || !validSpread) {
      return {
        buyMarginal: '',
        sellMarginal: '',
      };
    } else {
      const prices = calculateOverlappingPrices(
        formatNumber(state.buy.min),
        formatNumber(state.sell.max),
        marketPrice.toString(),
        state.spread,
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
    if (!+formatNumber(state.buy.min)) return state.buy.budget;
    if (!+formatNumber(state.sell.max)) return state.buy.budget;
    return calculateOverlappingBuyBudget(
      base.decimals,
      quote.decimals,
      formatNumber(state.buy.min),
      formatNumber(state.sell.max),
      marketPrice.toString(),
      state.spread,
      formatNumber(state.sell.budget),
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
    if (!+formatNumber(state.buy.min)) return state.sell.budget;
    if (!+formatNumber(state.sell.max)) return state.sell.budget;
    return calculateOverlappingSellBudget(
      base.decimals,
      quote.decimals,
      formatNumber(state.buy.min),
      formatNumber(state.sell.max),
      marketPrice.toString(),
      state.spread,
      formatNumber(state.buy.budget),
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
    spreadValue: string = spread.toString(),
  ) => {
    if (!base || !quote) return;
    if (!isValidRange(min, max) || !isValidSpread(min, max, spread)) return;
    const prices = calculateOverlappingPrices(
      formatNumber(min),
      formatNumber(max),
      marketPrice.toString(),
      spreadValue,
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

  const setSpreadValue = (value: string) => {
    setTouched(true);
    setSpread(value);
  };

  const setAnchorValue = (value: 'buy' | 'sell') => {
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

  const disabledAnchor = useMemo(() => {
    if (!buy.min || !sell.max || !marketPrice || isZero(spread)) return;
    const prices = calculateOverlappingPrices(
      formatNumber(buy.min),
      formatNumber(sell.max),
      marketPrice.toString(),
      spread.toString(),
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

  if (!base || !quote) return null;

  return (
    <>
      <article className="grid gap-16 p-16">
        <header className="flex items-center gap-8">
          <h3 className="text-16 font-weight-500 flex-1">
            Set Price Range&nbsp;
            <span className="text-white/40">
              ({quote?.symbol} per 1 {base?.symbol})
            </span>
          </h3>
          <Tooltip
            element="Indicate the strategy exact buy and sell prices."
            iconClassName="size-18 text-white/60"
          />
        </header>
        <OverlappingPriceRange
          minLabel="Min Buy Price"
          maxLabel="Max Sell Price"
          base={base}
          quote={quote}
          min={buy.min}
          max={sell.max}
          setMin={setMin}
          setMax={setMax}
        />
      </article>
      <OverlappingSpread
        buyMin={Number(buy.min)}
        sellMax={Number(sell.max)}
        spread={spread}
        setSpread={setSpreadValue}
      />
      <article className="grid gap-16 p-16">
        <header className="flex items-start justify-between">
          <hgroup>
            <h2 className="text-16">Budget</h2>
            <p className="text-14 text-white/80">
              Please select a token to proceed.
            </p>
          </hgroup>
          <Tooltip
            iconClassName="size-18 text-white/60"
            element="Indicate the token, action and amount for the strategy. Note that in order to maintain the concentrated liquidity behavior, the 2nd budget indication will be calculated using the prices, fee tier and budget values you use."
          />
        </header>
        <OverlappingAnchor
          base={base}
          quote={quote}
          anchor={anchor}
          setAnchor={setAnchorValue}
          disableBuy={disabledAnchor === 'buy'}
          disableSell={disabledAnchor === 'sell'}
        />
      </article>
      {anchor && (
        <article className="grid gap-16 p-16">
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
          <InputBudget
            editType="deposit"
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
          className="grid gap-16 rounded-ee rounded-es p-20"
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
          <BudgetDistribution
            title="Sell"
            token={base}
            initialBudget=""
            withdraw="0"
            deposit={sellBudget || '0'}
            balance="0"
            isSimulator
          />
          <BudgetDistribution
            title="Buy"
            token={quote}
            initialBudget="0"
            withdraw="0"
            deposit={buyBudget || '0'}
            balance="0"
            buy
            isSimulator
          />
        </article>
      )}
    </>
  );
};
