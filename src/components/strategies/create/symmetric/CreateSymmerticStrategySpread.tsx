import { useRef, FC, KeyboardEvent, Dispatch, SetStateAction } from 'react';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { cn } from 'utils/helpers';
import { decimalNumberValidationRegex } from 'utils/inputsValidations';
import styles from './CreateSymmerticStrategySpread.module.css';

interface Props {
  options: number[];
  spreadPPM: number;
  setSpreadPPM: Dispatch<SetStateAction<number>>;
}
export const CreateSymmerticStrategySpread: FC<Props> = (props) => {
  const { options, spreadPPM, setSpreadPPM } = props;
  const root = useRef<HTMLDivElement>(null);
  const inOptions = options.includes(spreadPPM);
  const hasError = spreadPPM <= 0 || spreadPPM > 10;

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
    <>
      <div
        role="group"
        className="flex items-center gap-10"
        ref={root}
        onKeyDown={onKeyDown}
      >
        {options.map((option) => (
          <div className={styles.spreadOption}>
            <input
              id={'spread-' + option}
              name="spreadppm"
              type="radio"
              value={option}
              checked={spreadPPM === option}
              tabIndex={spreadPPM === option ? 0 : -1}
              onChange={() => setSpreadPPM(option)}
              onFocus={() => setSpreadPPM(option)}
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
            !inOptions && 'outline outline-1 outline-white/60',
            hasError && 'text-red outline-red',
            spreadPPM && inOptions && 'text-white/40'
          )}
        >
          <input
            id="spread-custom"
            className="min-w-0 bg-transparent text-center outline-none placeholder:text-white/40"
            name="spreadppm"
            type="number"
            inputMode="decimal"
            min="0.0001"
            max="10"
            step="0.01"
            pattern={decimalNumberValidationRegex}
            aria-label="Set custom"
            placeholder="Set custom"
            tabIndex={inOptions ? -1 : 0}
            // Use valueAsNumber to not trigger invalid warning
            onFocus={(e) => setSpreadPPM(e.target.valueAsNumber)}
            // Use Number(value) to trigger invalid warning
            onBlur={(e) => setSpreadPPM(Number(e.target.value))}
          />
          <span className={styles.suffix}>%</span>
        </div>
      </div>
      {spreadPPM <= 0 && (
        <output
          htmlFor="spread-custom"
          className="flex items-center gap-8 font-mono text-12 text-red"
        >
          <IconWarning className="h-12 w-12" />
          <span>The spread should be above 0%</span>
        </output>
      )}
      {spreadPPM > 10 && (
        <output
          htmlFor="spread-custom"
          className="flex items-center gap-8 font-mono text-12 text-red"
        >
          <IconWarning className="h-12 w-12" />
          <span>The spread should be equal or below 10%</span>
        </output>
      )}
    </>
  );
};
