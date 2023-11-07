import { useRef, FC, KeyboardEvent, useState } from 'react';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { cn } from 'utils/helpers';
import styles from './SpeadInput.module.css';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';

interface Props {
  value: number;
  options: number[];
}
export const SpreadInput: FC<Props> = ({ value, options }) => {
  const root = useRef<HTMLFieldSetElement>(null);
  const [spread, setSpread] = useState(value);

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

  return (
    <article
      ref={root}
      className="flex flex-col gap-10 rounded-10 bg-silver p-20"
      onKeyDown={onKeyDown}
    >
      <h3 className="mb-10 flex items-center gap-8 text-18 font-weight-500">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[10px] text-white/60">
          2
        </span>
        Indicate Spread
      </h3>
      <div role="group" className="flex items-center gap-10">
        {options.map((option) => (
          <div className={styles.spreadOption}>
            <input
              id={'spread-' + option}
              name="spread"
              type="radio"
              value={option}
              checked={spread === option}
              tabIndex={spread === option ? 0 : -1}
              onChange={() => setSpread(option)}
              onFocus={() => setSpread(option)}
            />
            <label
              htmlFor={'spread-' + option}
              className="cursor-pointer rounded bg-black p-16 text-center text-white/40"
            >
              {option}%
            </label>
          </div>
        ))}
        <div
          className={cn(
            styles.spreadCustom,
            'flex min-w-0 flex-1 justify-center rounded bg-black p-16 text-center',
            'focus-within:outline focus-within:outline-2',
            !options.includes(spread) && 'outline outline-1 outline-white/60',
            spread <= 0 && 'text-red outline-red',
            spread && options.includes(spread) && 'text-white/40'
          )}
        >
          <input
            id="spread-custom"
            className="min-w-0 bg-transparent text-center outline-none placeholder:text-white/40"
            name="spread"
            type="number"
            inputMode="decimal"
            min="0.01"
            max="100"
            step="0.01"
            pattern={decimalNumberValidationRegex}
            aria-label="Set custom"
            placeholder="Set custom"
            tabIndex={options.includes(spread) ? -1 : 0}
            // Use valueAsNumber to not trigger invalid warning
            onFocus={(e) => setSpread(e.target.valueAsNumber)}
            // Use Number(value) to trigger invalid warning
            onBlur={(e) => setSpread(Number(e.target.value))}
          />
          <span className={styles.suffix}>%</span>
        </div>
      </div>
      {spread <= 0 && (
        <output
          htmlFor="spread-custom"
          className="flex items-center gap-8 text-red"
        >
          <IconWarning className="h-12 w-12" />
          <span>The spread should be above 0%</span>
        </output>
      )}
    </article>
  );
};
