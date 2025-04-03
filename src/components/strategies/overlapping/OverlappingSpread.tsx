import { FC, ChangeEvent } from 'react';
import { cn, sanitizeNumber } from 'utils/helpers';
import { getMaxSpread } from 'components/strategies/overlapping/utils';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { useStore } from 'store';
import styles from './OverlappingSpread.module.css';
import { Preset, Presets } from 'components/common/preset/Preset';

interface Props {
  spread: string;
  buyMin: number;
  sellMax: number;
  setSpread: (value: string) => void;
}

const getWarning = (maxSpread: number) => {
  return `⚠️ Given price range, max fee tier cannot exceed ${maxSpread}%`;
};

const round = (value: number) => Math.round(value * 100) / 100;

const presets: Preset[] = [
  {
    label: '0.01%',
    value: '0.01',
  },
  {
    label: '0.05%',
    value: '0.05',
  },
  {
    label: '0.1%',
    value: '0.1',
  },
];

export const OverlappingSpread: FC<Props> = (props) => {
  const { setSpread, buyMin, sellMax, spread } = props;
  const tooLow = +spread <= 0;
  const tooHigh = +spread > 100;
  const hasError = tooLow || tooHigh;
  const { toaster } = useStore();

  const selectSpread = (value: string) => {
    const maxSpread = round(getMaxSpread(buyMin, sellMax));
    if (+value > maxSpread) {
      toaster.addToast(getWarning(maxSpread), {
        color: 'warning',
        duration: 3000,
      });
      setSpread(maxSpread.toFixed(2));
    } else {
      setSpread(sanitizeNumber(value));
    }
  };

  const onCustomChange = (e: ChangeEvent<HTMLInputElement>) => {
    selectSpread(e.currentTarget.value);
  };

  return (
    <>
      <div role="group" className="flex gap-8">
        <Presets className="flex-grow" presets={presets} onChange={setSpread} />
        <div
          className={cn(
            styles.spreadCustom,
            'rounded-10 flex min-w-0 flex-1 justify-center bg-black p-16 text-center',
            'focus-within:outline focus-within:outline-2',
            hasError && 'text-error outline-error'
          )}
        >
          <input
            id="spread-custom"
            className="w-full bg-transparent text-center outline-none placeholder:text-white/40"
            value={spread}
            type="text"
            inputMode="decimal"
            aria-label="Set spread"
            placeholder="Set spread"
            onChange={onCustomChange}
            data-testid="spread-input"
          />
          <span className={styles.suffix}>%</span>
        </div>
      </div>
      {tooLow && (
        <Warning htmlFor="spread-custom" isError>
          The fee tier should be above 0%
        </Warning>
      )}
      {tooHigh && (
        <Warning htmlFor="spread-custom" isError>
          The fee tier should be equal or below 100%
        </Warning>
      )}
    </>
  );
};
