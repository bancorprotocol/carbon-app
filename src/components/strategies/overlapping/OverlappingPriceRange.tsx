import { InputRange, InputRangeProps } from '../common/InputRange';
import { ChangeEvent, FC, useMemo } from 'react';
import { useOverlappingMarketPrice } from '../UserMarketPrice';
import style from './OverlappingPriceRange.module.css';
import { SafeDecimal } from 'libs/safedecimal';

const options = [
  {
    label: '±0.5',
    value: 0.5,
  },
  {
    label: '±1',
    value: 1,
  },
  {
    label: '±5',
    value: 5,
  },
  {
    label: '±10',
    value: 10,
  },
  {
    label: 'Full Range',
    value: Infinity,
  },
];

export const OverlappingPriceRange: FC<InputRangeProps> = (props) => {
  const { base, quote, min, max, setMin, setMax, warnings } = props;
  const marketPrice = useOverlappingMarketPrice({ base, quote });

  const range = useMemo(() => {
    if (!marketPrice) return;
    const price = new SafeDecimal(marketPrice);
    if (price.mul(1000).eq(max) && price.div(1000).eq(min)) {
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
      setMin(price.mul(1 - value / 100).toString());
      setMax(price.mul(1 + value / 100).toString());
    }
  };

  return (
    <>
      <InputRange
        base={base}
        quote={quote}
        min={min}
        max={max}
        setMin={setMin}
        setMax={setMax}
        minLabel="Min Buy Price"
        maxLabel="Max Sell Price"
        warnings={warnings}
        isOverlapping
        required
        hideMarketIndicator={range === Infinity}
      />
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
