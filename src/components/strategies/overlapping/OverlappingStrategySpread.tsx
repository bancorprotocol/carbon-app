import {
  useRef,
  FC,
  KeyboardEvent,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { cn } from 'utils/helpers';
import { OrderCreate } from '../create/useOrder';
import { getMaxSpreadPPM } from 'components/strategies/overlapping/utils';
import styles from './OverlappingStrategySpread.module.css';

interface Props {
  /** Value used to fallback to when custom input is empty */
  defaultValue: number;
  options: number[];
  spreadPPM: number;
  order0: OrderCreate;
  order1: OrderCreate;
  setSpreadPPM: Dispatch<SetStateAction<number>>;
}

const getWarning = (maxSpreadPPM: number) => {
  return `Given price range, max spread cannot exceed ${maxSpreadPPM}%`;
};

export const OverlappingStrategySpread: FC<Props> = (props) => {
  const { defaultValue, options, spreadPPM, setSpreadPPM } = props;
  const root = useRef<HTMLDivElement>(null);
  const inOptions = options.includes(spreadPPM);
  const hasError = spreadPPM <= 0 || spreadPPM > 100;
  const { order0, order1 } = props;
  const buyMin = Number(order0.min);
  const sellMax = Number(order1.max);
  const maxSpreadPPM = Math.round(getMaxSpreadPPM(buyMin, sellMax) * 100) / 100;
  const [warning, setWarning] = useState('');

  const setCustomSpread = (value: number) => {
    const input = document.getElementById('spread-custom') as HTMLInputElement;
    if (value > maxSpreadPPM) {
      setWarning(getWarning(maxSpreadPPM));
      setSpreadPPM(maxSpreadPPM);
      input.value = maxSpreadPPM.toFixed(2);
    } else {
      setWarning('');
      setSpreadPPM(value);
    }
  };

  const selectSpread = (value: number) => {
    const input = document.getElementById('spread-custom') as HTMLInputElement;
    if (value > maxSpreadPPM) {
      setWarning(getWarning(maxSpreadPPM));
      setSpreadPPM(maxSpreadPPM);
      input.value = maxSpreadPPM.toFixed(2);
      input.focus();
    } else {
      setWarning('');
      setSpreadPPM(value);
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
              name="spreadppm"
              type="radio"
              value={option}
              checked={spreadPPM === option}
              tabIndex={spreadPPM === option ? 0 : -1}
              onChange={() => selectSpread(option)}
              onFocus={() => selectSpread(option)}
            />
            <label
              htmlFor={'spread-' + option}
              className="block cursor-pointer rounded-8 bg-black p-16 text-center text-white/40 hover:outline hover:outline-1"
            >
              {option}%
            </label>
          </div>
        ))}
        <div
          className={cn(
            styles.spreadCustom,
            'flex min-w-0 flex-1 justify-center rounded-8 bg-black p-16 text-center',
            'hover:outline hover:outline-1',
            'focus-within:outline focus-within:outline-2',
            spreadPPM && !inOptions && 'outline outline-1 outline-white/60',
            hasError && 'text-red outline-red',
            spreadPPM && inOptions && 'text-white/40'
          )}
        >
          <input
            id="spread-custom"
            className="min-w-0 bg-transparent text-center outline-none placeholder:text-white/40"
            defaultValue={options.includes(spreadPPM) ? '' : spreadPPM}
            name="spreadppm"
            type="number"
            inputMode="decimal"
            min="0"
            max="100"
            step="0.01"
            aria-label="Set custom"
            placeholder="Set custom"
            tabIndex={inOptions ? -1 : 0}
            onChange={(e) => setCustomSpread(Number(e.target.value ?? '0'))}
            onBlur={(e) => {
              if (options.includes(e.target.valueAsNumber)) e.target.value = '';
              else if (!spreadPPM) setCustomSpread(defaultValue);
            }}
            data-testid="spread-input"
          />
          <span className={styles.suffix}>%</span>
        </div>
      </div>
      {warning && spreadPPM && (
        <output
          htmlFor="spread-custom"
          className="flex items-center gap-8 font-mono text-12 text-warning-500"
        >
          <IconWarning className="h-12 w-12" />
          <span>{warning}</span>
        </output>
      )}
      {spreadPPM <= 0 && (
        <output
          htmlFor="spread-custom"
          className="flex items-center gap-8 font-mono text-12 text-red"
        >
          <IconWarning className="h-12 w-12" />
          <span>The spread should be above 0%</span>
        </output>
      )}
      {spreadPPM > 100 && (
        <output
          htmlFor="spread-custom"
          className="flex items-center gap-8 font-mono text-12 text-red"
        >
          <IconWarning className="h-12 w-12" />
          <span>The spread should be equal or below 100%</span>
        </output>
      )}
    </>
  );
};
