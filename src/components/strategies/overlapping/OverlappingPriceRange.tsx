import { InputRange, InputRangeProps } from '../common/InputRange';
import { FC, useId, useMemo } from 'react';
import { useStrategyMarketPrice } from '../UserMarketPrice';
import { SafeDecimal } from 'libs/safedecimal';
import { getFullRangeFactor, isFullRange } from '../common/utils';
import { Presets } from '../../common/preset/Preset';
import { overlappingPresets } from '../common/price-presets';
import { prettifyNumber } from 'utils/helpers';
import { Warning } from 'components/common/WarningMessageWithIcon';

interface Props extends InputRangeProps {
  setFullRange: () => void;
}

export const OverlappingPriceRange: FC<Props> = (props) => {
  const { base, quote, min, max, setMin, setMax, setFullRange, warnings } =
    props;
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
      setFullRange();
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

  const fullRangeWarning = useMemo(() => {
    if (range !== 'Infinity') return '';
    const factor = getFullRangeFactor(min, max);
    if (factor.gt(50)) return '';
    const displayFactor = prettifyNumber(factor);
    const displayMin = prettifyNumber(min);
    const displayMax = prettifyNumber(max);
    return `Due to price and decimal constraints, the full-range strategy will be set ${displayFactor}x above and below the current market price, providing liquidity at prices between ${displayMin} and ${displayMax}`;
  }, [range, min, max]);

  return (
    <>
      {range === 'Infinity' ? (
        <>
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-e-xs rounded-s-2xl grid cursor-text gap-8 input-container">
              <header className="text-12 flex justify-between text-main-0/60">
                <span>{props.minLabel || 'Min'}</span>
                {!!marketPrice && (
                  <button
                    className="text-12 font-medium text-gradient hover:text-secondary focus:text-secondary active:text-secondary"
                    type="button"
                    onClick={() => setMin(marketPrice.toString())}
                    data-testid="market-price-min"
                  >
                    Use Market
                  </button>
                )}
              </header>
              <p className="text-24" onClick={() => reset(minId)}>
                0
              </p>
              <p aria-hidden className="h-[22px]"></p>
            </div>
            <div className="rounded-s-xs rounded-e-2xl grid cursor-text gap-8 input-container">
              <header className="text-12 flex justify-between text-main-0/60">
                <span>{props.maxLabel || 'Max'}</span>
                {!!marketPrice && (
                  <button
                    className="text-12 font-medium text-gradient hover:text-secondary focus:text-secondary active:text-secondary"
                    type="button"
                    onClick={() => setMax(marketPrice.toString())}
                    data-testid="market-price-max"
                  >
                    Use Market
                  </button>
                )}
              </header>
              <p className="text-24" onClick={() => reset(maxId)}>
                ∞
              </p>
              <p aria-hidden className="h-[22px]"></p>
            </div>
          </div>
          {fullRangeWarning && <Warning message={fullRangeWarning} />}
        </>
      ) : (
        <InputRange
          base={base}
          quote={quote}
          min={min}
          max={max}
          setMin={setMin}
          setMax={setMax}
          minLabel="Min Buy"
          maxLabel="Max Sell"
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
