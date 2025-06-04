import { FC, ChangeEvent } from 'react';
import { cn, sanitizeNumber } from 'utils/helpers';
import { getMaxSpread } from 'components/strategies/overlapping/utils';
import { Warning } from 'components/common/WarningMessageWithIcon';
import { Preset, Presets } from 'components/common/preset/Preset';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import styles from './OverlappingSpread.module.css';

interface Props {
  spread: string;
  buyMin: number;
  sellMax: number;
  setSpread: (value: string) => void;
}

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
  const maxSpread = round(getMaxSpread(buyMin, sellMax));
  const tooLow = +spread <= 0;
  const tooHigh = maxSpread > 0 && +spread > maxSpread;

  const onPresetChange = (value: string) => {
    setSpread(value);
  };

  const onCustomChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSpread(sanitizeNumber(e.currentTarget.value));
  };

  return (
    <article
      role="group"
      className={cn(styles.spread, 'bg-background-900 mb-16 grid gap-8 p-16')}
    >
      <header className="flex items-center gap-8 ">
        <h2 className="text-16 font-weight-500 flex-1">Set Fee Tier</h2>
        <Tooltip
          element="The difference between the highest bidding (Sell) price, and the lowest asking (Buy) price"
          iconClassName="size-18 text-white/60"
        />
      </header>
      <div className="flex gap-8">
        <Presets
          className="flex-grow"
          value={spread}
          presets={presets}
          onChange={onPresetChange}
          testid="spread"
        />
        <div
          className={cn(
            styles.spreadCustom,
            'rounded-10 text-12 flex justify-center border border-white bg-black p-8 text-center',
            'focus-within:outline focus-within:outline-1',
          )}
        >
          <input
            id="spread-custom"
            className="w-full bg-transparent text-center outline-none placeholder:text-white/40"
            value={spread}
            type="number"
            inputMode="decimal"
            aria-label="Set fee tier"
            placeholder="Set Fee Tier"
            onChange={onCustomChange}
            min="0.00000000001"
            max={maxSpread}
            step="any"
            data-testid="spread-input"
          />
          <span className={styles.suffix}>%</span>
        </div>
      </div>
      {tooHigh && (
        <Warning htmlFor="spread-custom" isError>
          Given price range, max fee tier cannot exceed&nbsp;
          <button
            type="button"
            className="font-weight-700"
            onClick={() => setSpread(maxSpread.toFixed(2))}
          >
            {maxSpread}%
          </button>
        </Warning>
      )}
      {tooLow && (
        <Warning htmlFor="spread-custom" isError>
          The fee tier should be above 0%
        </Warning>
      )}
    </article>
  );
};
