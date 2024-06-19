import { useRef, FC, KeyboardEvent, FocusEvent, ChangeEvent } from 'react';
import { cn, formatNumber } from 'utils/helpers';
import { getMaxSpread } from 'components/strategies/overlapping/utils';
import { Warning } from 'components/common/WarningMessageWithIcon';
import styles from './OverlappingSpread.module.css';

interface Props {
  spread: number;
  buyMin: number;
  sellMax: number;
  setSpread: (value: number) => void;
}

export const defaultSpread = '0.05';
const options = [0.01, 0.05, 0.1];
const round = (value: number) => Math.round(value * 100) / 100;

export const OverlappingSpread: FC<Props> = (props) => {
  const { spread, setSpread, buyMin, sellMax } = props;
  const root = useRef<HTMLDivElement>(null);
  const inOptions = options.includes(spread);
  const maxSpread = round(getMaxSpread(buyMin, sellMax));
  const hasError = spread <= 0 || spread > maxSpread || spread > 100;

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

  const selectSpread = (value: number) => {
    const input = document.getElementById('spread-custom') as HTMLInputElement;
    setSpread(value);
    input.value = '';
  };

  const setMax = () => {
    const input = document.getElementById('spread-custom') as HTMLInputElement;
    setSpread(maxSpread);
    input.value = formatNumber(maxSpread.toFixed(6));
  };

  const onCustomChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSpread(Number(e.target.value));
  };

  const onCustomBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (options.includes(spread)) {
      e.target.value = '';
    } else {
      const value = formatNumber(e.target.value);
      const trimmed = Number(value).toFixed(2);
      if (options.includes(+trimmed)) selectSpread(+trimmed);
      else e.target.value = trimmed;
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
      {spread > maxSpread && (
        <Warning htmlFor="spread-custom" isError>
          Given price range, max fee tier cannot exceed&nbsp;
          <button onClick={setMax} className="font-weight-600 border-b">
            {maxSpread}%
          </button>
        </Warning>
      )}
      {spread <= 0 && (
        <Warning htmlFor="spread-custom" isError>
          The fee tier should be above 0%
        </Warning>
      )}
      {maxSpread > 100 && spread > 100 && (
        <Warning htmlFor="spread-custom" isError>
          The fee tier should be equal or below 100%
        </Warning>
      )}
    </>
  );
};
