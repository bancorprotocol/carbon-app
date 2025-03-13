import { InputRange, InputRangeProps } from '../common/InputRange';
import { ChangeEvent, FC, useId, useMemo } from 'react';
import { useOverlappingMarketPrice } from '../UserMarketPrice';
import { SafeDecimal } from 'libs/safedecimal';
import { isFullRangeCreation } from '../common/utils';
import { defaultSpread, getMaxSpread } from './utils';
import style from './OverlappingPriceRange.module.css';

interface Props extends InputRangeProps {
  spread: string;
  setSpread: (spread: string) => void;
}

const options = [
  {
    label: '±0.5%',
    value: 0.5,
  },
  {
    label: '±1%',
    value: 1,
  },
  {
    label: '±5%',
    value: 5,
  },
  {
    label: '±10%',
    value: 10,
  },
  {
    label: 'Full Range',
    value: Infinity,
  },
];

export const OverlappingPriceRange: FC<Props> = (props) => {
  const { base, quote, min, max, setMin, setMax, warnings, spread, setSpread } =
    props;
  const marketPrice = useOverlappingMarketPrice({ base, quote });
  const minId = useId();
  const maxId = useId();

  const range = useMemo(() => {
    if (!marketPrice) return;
    if (isFullRangeCreation(min, max, marketPrice)) {
      return Infinity;
    } else {
      const low = new SafeDecimal(min).div(marketPrice).sub(1).abs();
      const high = new SafeDecimal(max).div(marketPrice).sub(1).abs();
      if (!low.eq(high)) return;
      return low.mul(100).toNumber();
    }
  }, [marketPrice, max, min]);

  const change = (event: ChangeEvent<HTMLInputElement>) => {
    if (!marketPrice) return;
    const value = Number(event.target.value);
    const price = new SafeDecimal(marketPrice);
    if (value === Infinity) {
      setMin(price.div(1000).toString());
      setMax(price.mul(1000).toString());
    } else {
      const nextMin = price.mul(1 - value / 100);
      const nextMax = price.mul(1 + value / 100);
      setMin(nextMin.toString());
      setMax(nextMax.toString());

      const maxSpread = getMaxSpread(nextMin.toNumber(), nextMax.toNumber());
      if (new SafeDecimal(maxSpread).lt(spread)) {
        setSpread(defaultSpread);
      }
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
      {range === Infinity ? (
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-r-4 rounded-l-16 grid cursor-text gap-5 border border-black bg-black p-16 focus-within:border-white/50">
            <header className="text-12 mb-5 flex justify-between text-white/60">
              <span>{props.minLabel || 'Min'}</span>
              {!!marketPrice && (
                <button
                  className="text-12 font-weight-500 text-primaryGradient-first hover:text-primary focus:text-primary active:text-primaryGradient-first"
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
          <div className="rounded-l-4 rounded-r-16 grid cursor-text gap-5 border border-black bg-black p-16 focus-within:border-white/50">
            <header className="text-12 mb-5 flex justify-between text-white/60">
              <span>{props.maxLabel || 'Max'}</span>
              {!!marketPrice && (
                <button
                  className="text-12 font-weight-500 text-primaryGradient-first hover:text-primary focus:text-primary active:text-primaryGradient-first"
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
      {!!marketPrice && (
        <div role="radiogroup" className="flex gap-8">
          {options.map(({ label, value }, i) => (
            <label key={i} className={style.priceOption}>
              <input
                type="radio"
                name="price-range"
                value={value}
                onChange={change}
                checked={range === value}
              />
              {label}
            </label>
          ))}
        </div>
      )}
    </>
  );
};
