import { FC, ChangeEvent } from 'react';
import { cn, sanitizeNumber } from 'utils/helpers';
import { getMaxSpread } from 'components/strategies/overlapping/utils';
import { Preset, Presets } from 'components/common/preset/Preset';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { Warning } from 'components/common/WarningMessageWithIcon';
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
    <article role="group" className={cn(styles.spread, 'grid gap-8 p-16')}>
      <header className="flex items-center gap-8 ">
        <h2 className="text-16 font-medium flex-1">Set Fee Tier</h2>
        <Tooltip
          element="The difference between the highest bidding (Sell) price, and the lowest asking (Buy) price"
          iconClassName="size-18 text-white/60"
        />
      </header>
      <div className="flex gap-8">
        <Presets
          className="flex-1"
          value={spread}
          presets={presets}
          onChange={onPresetChange}
          testid="spread"
        />
        <div
          className={cn(
            styles.spreadCustom,
            'rounded-lg text-12 flex gap-8 border border-white bg-black-gradient py-8 px-16 text-center',
            'focus-within:outline-solid focus-within:outline-1',
          )}
        >
          <label className="text-white/60" htmlFor="spread-custom">
            Custom
          </label>
          <input
            id="spread-custom"
            className="bg-transparent text-center outline-hidden w-[80px]"
            value={spread}
            type="number"
            inputMode="decimal"
            placeholder="Fee Tier"
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
            className="font-bold"
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
