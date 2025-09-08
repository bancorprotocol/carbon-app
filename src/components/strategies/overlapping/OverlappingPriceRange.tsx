import { InputRange, InputRangeProps } from '../common/InputRange';
import { FC, useId, useMemo } from 'react';
import { useStrategyMarketPrice } from '../UserMarketPrice';
import { SafeDecimal } from 'libs/safedecimal';
import { getFullRangesPrices, isFullRange } from '../common/utils';
import { Presets } from '../../common/preset/Preset';
import { overlappingPresets } from '../common/price-presets';

export const OverlappingPriceRange: FC<InputRangeProps> = (props) => {
  const { base, quote, min, max, setMin, setMax, warnings } = props;
  const { marketPrice } = useStrategyMarketPrice({ base, quote });
  const minId = useId();
  const maxId = useId();

  const range = useMemo(() => {
    if (!marketPrice) return '';
    if (isFullRange(base, quote, min, max)) {
      return 'Infinity';
    } else {
      const low = new SafeDecimal(min).div(marketPrice).sub(1).abs();
      const high = new SafeDecimal(max).div(marketPrice).sub(1).abs();
      if (!low.eq(high)) return '';
      return low.mul(100).toString();
    }
  }, [base, marketPrice, max, min, quote]);

  const change = (change: string) => {
    if (!marketPrice) return;
    const value = Number(change);
    const price = new SafeDecimal(marketPrice);
    if (value === Infinity) {
      const { min, max } = getFullRangesPrices(
        marketPrice,
        base.decimals,
        quote.decimals,
      );
      setMin(min);
      setMax(max);
    } else {
      const nextMin = price.mul(1 - value / 100);
      const nextMax = price.mul(1 + value / 100);
      setMin(nextMin.toString());
      setMax(nextMax.toString());
    }
  };

  const reset = (id: string) => {
    const price = new SafeDecimal(marketPrice!);
    setMin(price.mul(0.99).toString());
    setMax(price.mul(1.01).toString());
    setTimeout(() => document.getElementById(id)?.focus(), 10);
  };

  return (
    <>
      {range === 'Infinity' ? (
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-e-xs rounded-s-2xl grid cursor-text gap-5 border border-black bg-black p-16 focus-within:border-white/50">
            <header className="text-12 mb-5 flex justify-between text-white/60">
              <span>{props.minLabel || 'Min'}</span>
              {!!marketPrice && (
                <button
                  className="text-12 font-medium text-primary hover:text-tertiary focus:text-tertiary active:text-tertiary"
                  type="button"
                  onClick={() => setMin(marketPrice.toString())}
                  data-testid="market-price-min"
                >
                  Use Market
                </button>
              )}
            </header>
            <p onClick={() => reset(minId)}>0</p>
            <p aria-hidden className="h-[22px]"></p>
          </div>
          <div className="rounded-s-xs rounded-e-2xl grid cursor-text gap-5 border border-black bg-black p-16 focus-within:border-white/50">
            <header className="text-12 mb-5 flex justify-between text-white/60">
              <span>{props.maxLabel || 'Max'}</span>
              {!!marketPrice && (
                <button
                  className="text-12 font-medium text-primary hover:text-tertiary focus:text-tertiary active:text-tertiary"
                  type="button"
                  onClick={() => setMax(marketPrice.toString())}
                  data-testid="market-price-max"
                >
                  Use Market
                </button>
              )}
            </header>
            <p onClick={() => reset(maxId)}>∞</p>
            <p aria-hidden className="h-[22px]"></p>
          </div>
        </div>
      ) : (
        <InputRange
          base={base}
          quote={quote}
          min={min}
          max={max}
          setMin={setMin}
          setMax={setMax}
          minLabel="Min Buy Price"
          maxLabel="Max Sell Price"
          minId={minId}
          maxId={maxId}
          warnings={warnings}
          isOverlapping
          required
        />
      )}
      {marketPrice && (
        <Presets value={range} presets={overlappingPresets} onChange={change} />
      )}
    </>
  );
};
