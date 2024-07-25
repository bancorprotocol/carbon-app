import {
  useRef,
  FC,
  KeyboardEvent,
  useState,
  FocusEvent,
  ChangeEvent,
} from 'react';
import { cn, formatNumber, sanitizeNumber } from 'utils/helpers';
import { getMaxSpread } from 'components/strategies/overlapping/utils';
import { Warning } from 'components/common/WarningMessageWithIcon';
import styles from './OverlappingSpread.module.css';

interface Props {
  /** Value used to fallback to when custom input is empty */
  defaultValue: number;
  options: number[];
  spread: string;
  buyMin: number;
  sellMax: number;
  setSpread: (value: string) => void;
}

const getWarning = (maxSpread: number) => {
  return `Given price range, max fee tier cannot exceed ${maxSpread}%`;
};

const round = (value: number) => Math.round(value * 100) / 100;

export const OverlappingSpread: FC<Props> = (props) => {
  const { defaultValue, options, setSpread, buyMin, sellMax } = props;
  const spread = Number(props.spread);
  const root = useRef<HTMLDivElement>(null);
  const inOptions = options.includes(spread);
  const hasError = spread <= 0 || spread > 100;
  const [warning, setWarning] = useState('');

  const selectSpread = (value: number) => {
    const input = document.getElementById('spread-custom') as HTMLInputElement;
    const maxSpread = round(getMaxSpread(buyMin, sellMax));
    if (value > maxSpread) {
      setWarning(getWarning(maxSpread));
      setSpread(maxSpread.toString());
      input.value = maxSpread.toFixed(2);
      input.focus();
    } else {
      setWarning('');
      setSpread(value.toString());
      input.value = '';
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const fieldset = root.current!;
    const inputs = fieldset.querySelectorAll('input');
    if (['ArrowRight', 'ArrowLeft'].includes(e.key)) {
      e.preventDefault();
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] === document.activeElement) {
          const nextIndex =
            e.key === 'ArrowRight'
              ? (i + 1) % inputs.length
              : (inputs.length + i - 1) % inputs.length;
          return inputs[nextIndex].focus();
        }
      }
    }
  };

  const onCustomChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const value = Number(e.target.value);
    const maxSpread = round(getMaxSpread(buyMin, sellMax));
    if (isNaN(value)) {
      e.target.value = sanitizeNumber(e.target.value, 6);
    } else if (value > maxSpread) {
      const max = sanitizeNumber(maxSpread.toString(), 6);
      setWarning(getWarning(maxSpread));
      setSpread(max);
      e.target.value = max;
    } else {
      const value = sanitizeNumber(e.target.value, 6);
      setWarning('');
      setSpread(value);
      e.target.value = value;
    }
  };

  const onCustomBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (options.includes(e.target.valueAsNumber)) {
      e.target.value = '';
    } else {
      const value = formatNumber(e.target.value);
      if (!value || !Number(value)) {
        setSpread(defaultValue.toString());
        e.target.value = '';
      } else {
        e.target.value = Number(Number(value).toFixed(6)).toString();
      }
    }
  };

  return (
    <>
      <div
        role="group"
        className="flex items-center gap-10"
        ref={root}
        onKeyDown={onKeyDown}
      >
        {options.map((option) => (
          <div key={option} className={styles.spreadOption}>
            <input
              id={'spread-' + option}
              name="spread"
              type="radio"
              value={option}
              checked={spread === option}
              tabIndex={spread === option ? 0 : -1}
              onChange={() => selectSpread(option)}
              onFocus={() => selectSpread(option)}
              data-testid={'spread-' + option}
            />
            <label
              htmlFor={'spread-' + option}
              className="rounded-8 block cursor-pointer bg-black p-16 text-center text-white/40 hover:outline hover:outline-1"
            >
              {option}%
            </label>
          </div>
        ))}
        <div
          className={cn(
            styles.spreadCustom,
            'rounded-8 flex min-w-0 flex-1 justify-center bg-black p-16 text-center',
            'hover:outline hover:outline-1',
            'focus-within:outline focus-within:outline-2',
            spread && !inOptions && 'outline outline-1 outline-white/60',
            hasError && 'text-error outline-error',
            spread && inOptions && 'text-white/40'
          )}
        >
          <input
            id="spread-custom"
            className="w-full bg-transparent text-center outline-none placeholder:text-white/40"
            defaultValue={options.includes(spread) ? '' : spread}
            name="spread"
            type="text"
            inputMode="decimal"
            aria-label="Set custom"
            placeholder="Set custom"
            tabIndex={inOptions ? -1 : 0}
            onChange={onCustomChange}
            onFocus={(e) => e.target.select()}
            onBlur={onCustomBlur}
            data-testid="spread-input"
          />
          <span className={styles.suffix}>%</span>
        </div>
      </div>
      {warning && spread && (
        <Warning htmlFor="spread-custom">{warning}</Warning>
      )}
      {spread <= 0 && (
        <Warning htmlFor="spread-custom" isError>
          The fee tier should be above 0%
        </Warning>
      )}
      {spread > 100 && (
        <Warning htmlFor="spread-custom" isError>
          The fee tier should be equal or below 100%
        </Warning>
      )}
    </>
  );
};
