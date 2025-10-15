import { FC, useEffect, useMemo, useState } from 'react';
import {
  isValidValue,
  TradeSettingsData,
  warningMessageIfOutOfRange,
} from './utils';
import { cn, sanitizeNumber } from 'utils/helpers';
import { Presets } from 'components/common/preset/Preset';
import { Warning } from 'components/common/WarningMessageWithIcon';
import style from 'components/common/preset/Preset.module.css';

export const TradeSettingsRow: FC<{
  item: TradeSettingsData;
}> = ({ item }) => {
  const [isError, setIsError] = useState(!isValidValue(item.id, item.value));

  useEffect(() => {
    setIsError(!isValidValue(item.id, item.value));
  }, [item.id, item.value]);

  const warningMessage = useMemo(
    () => warningMessageIfOutOfRange(item.id, item.value),
    [item.id, item.value],
  );

  return (
    <fieldset className={cn(style.presetContainer, 'grid gap-8')}>
      <legend className="text-14 mb-8 text-white/80">{item.title}</legend>
      <div className="flex gap-8">
        <Presets
          className="flex-1"
          presets={item.presets}
          value={item.value}
          onChange={(v) => item.setValue(v)}
          testid={item.id}
        />
        <div
          className={cn(
            style.presetCustom,
            'flex-1 rounded-lg text-12 flex gap-8 border bg-black py-8 px-16 text-center',
            'focus-within:bg-white/30 hover:bg-white/20 focus-within:border-main-700',
          )}
        >
          <label htmlFor={item.id}>Custom</label>
          <input
            id={item.id}
            name={item.id}
            className="bg-transparent w-full text-center outline-hidden"
            value={item.value}
            type="number"
            inputMode="decimal"
            onChange={(v) => item.setValue(sanitizeNumber(v.target.value))}
            min="0"
            max={item.max}
            step="any"
            data-testid="spread-input"
          />
          {item.append && <span>{item.append}</span>}
        </div>
      </div>
      {warningMessage && <Warning isError={isError} message={warningMessage} />}
    </fieldset>
  );
};
