import { Button } from 'components/common/button';
import { sanitizeNumberInput } from 'utils/helpers';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { TradeSettingsData, warningMessageIfOutOfRange } from './utils';
import { ChangeEvent, FC, useEffect, useState } from 'react';

const buttonClasses =
  'rounded-8 !text-white/60 hover:text-green hover:border-green px-5';
const buttonActiveClasses = 'border-green !text-green';
const inputClasses =
  'border-2 border-black bg-black text-center placeholder-white/25 focus:outline-none';

export const TradeSettingsRow: FC<{
  item: TradeSettingsData;
}> = ({ item }) => {
  const [internalValue, setInternalValue] = useState(
    item.presets.includes(item.value) ? '' : item.value
  );

  useEffect(() => {
    const isDefault = item.value === item.presets[1];
    isDefault && setInternalValue('');
  }, [item.presets, item.value]);

  const updateItemAndInternalState = (value: string) => {
    item.setValue(value);
    setInternalValue(value);
  };

  const handleOnInputChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (item.id === 'slippageTolerance') {
      updateItemAndInternalState(sanitizeNumberInput(value));
    } else {
      updateItemAndInternalState(value.replace(/\D/g, ''));
    }
  };

  const warningMessage = warningMessageIfOutOfRange(item.id, item.value);
  return (
    <div>
      <div className={'text-white/60'}>{item.title}</div>
      <div className={'mt-10 grid grid-cols-4 gap-10'}>
        {item.presets.map((value) => (
          <Button
            key={value}
            variant={'black'}
            onClick={() => item.setValue(value)}
            className={`${buttonClasses} ${
              item.value === value ? buttonActiveClasses : ''
            }`}
          >
            {item.prepend}
            {value}
            {item.append}
          </Button>
        ))}
        <input
          placeholder={'custom'}
          value={internalValue}
          onChange={handleOnInputChange}
          className={`${buttonClasses} ${inputClasses} ${
            !item.presets.includes(item.value) ? buttonActiveClasses : ''
          }`}
        />
      </div>
      {warningMessage && (
        <div className="mt-15 flex font-mono text-12 font-weight-500 text-warning-400">
          <IconWarning className={`w-14 text-warning-400`} />
          <span className="ml-5">{warningMessage}</span>
        </div>
      )}
    </div>
  );
};
