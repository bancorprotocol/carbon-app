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
  const [internalValue, setInternalValue] = useState(item.value);
  const [isError, setIsError] = useState(!isValidValue(item.id, item.value));

  useEffect(() => {
    if (item.value !== internalValue) setInternalValue(item.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.value]);

  useEffect(() => {
    if (isValidValue(item.id, internalValue)) {
      setIsError(false);
      if (!!internalValue && item.value !== internalValue) {
        item.setValue(internalValue);
      }
    } else {
      setIsError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalValue]);

  const warningMessage = useMemo(
    () => warningMessageIfOutOfRange(item.id, internalValue),
    [item.id, internalValue],
  );

  return (
    <fieldset className={cn(style.presetContainer, 'grid gap-8 p-8')}>
      <legend className="mb-8 text-white/60">{item.title}</legend>
      <div className="flex gap-8">
        <Presets
          className="flex-1"
          presets={item.presets}
          value={internalValue}
          onChange={(v) => setInternalValue(v)}
        />
        <input
          id={item.id}
          className={cn(
            style.presetCustom,
            'text-12 rounded-10 bg-black text-center placeholder:text-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white',
          )}
          value={internalValue}
          type="number"
          inputMode="decimal"
          aria-label="Set custom"
          placeholder="Custom"
          onChange={(v) => setInternalValue(sanitizeNumber(v.target.value))}
          min="0"
          max={item.max}
          step="any"
          data-testid="spread-input"
        />
      </div>
      {warningMessage && <Warning isError={isError} message={warningMessage} />}
    </fieldset>
  );
};
