import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import { carbonEvents } from 'services/events';
import { Token } from 'libs/tokens';
import {
  isValidValue,
  TradeSettingsData,
  warningMessageIfOutOfRange,
} from './utils';
import { sanitizeNumberInput } from 'utils/helpers';
import { Button } from 'components/common/button';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';

const buttonClasses =
  'rounded-8 !text-white/60 hover:text-green hover:border-green px-5';
const buttonActiveClasses = '!border-green !text-green';
const buttonErrorClasses = '!border-red !text-red focus:text-red';
const inputClasses =
  'border-2 border-black bg-black text-center placeholder-white/25 focus:outline-none';

export const TradeSettingsRow: FC<{
  base: Token;
  quote: Token;
  item: TradeSettingsData;
  isAllSettingsDefault: boolean;
}> = ({ base, quote, item, isAllSettingsDefault }) => {
  const [internalValue, setInternalValue] = useState(
    item.presets.includes(item.value) ? '' : item.value
  );
  const [isError, setIsError] = useState(!isValidValue(item.id, item.value));

  useEffect(() => {
    // clean up input in case of reset
    if (item.presets.includes(item.value) && isAllSettingsDefault) {
      internalValue && setInternalValue('');
    }
  }, [item.value]);

  const updateItemAndInternalState = (value: string) => {
    setInternalValue(value);
    if (isValidValue(item.id, value)) {
      item.setValue(value);
      isError && setIsError(false);
    } else {
      setIsError(true);
    }
  };

  const handleOnBlur = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!isValidValue(item.id, value)) {
      isError && setIsError(false);
      internalValue && setInternalValue('');
      item.setValue(item.presets[1]);
      carbonEvents.trade.tradeErrorShow({
        message: warningMessageIfOutOfRange(item.id, value),
        buyToken: base,
        sellToken: quote,
      });
    }

    if (item.presets.includes(item.value)) {
      internalValue && setInternalValue('');
    }
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

  const warningMessage = useMemo(
    () => warningMessageIfOutOfRange(item.id, internalValue || item.value),
    [internalValue, item.id, item.value]
  );

  useEffect(() => {
    warningMessage &&
      carbonEvents.trade.tradeWarningShow({ message: warningMessage });
  }, [warningMessage]);

  return (
    <div>
      <div className={'text-white/60'}>{item.title}</div>
      <div className={'mt-10 grid grid-cols-4 gap-10'}>
        {item.presets.map((value) => (
          <Button
            key={value}
            variant={'black'}
            onClick={() => {
              setInternalValue('');
              item.setValue(value);
            }}
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
          placeholder={'Custom'}
          value={internalValue}
          onBlur={handleOnBlur}
          onChange={handleOnInputChange}
          className={`${buttonClasses} ${inputClasses} ${
            isError ? buttonErrorClasses : ''
          }${!item.presets.includes(item.value) ? buttonActiveClasses : ''}`}
        />
      </div>
      {warningMessage && (
        <div
          className={`mt-15 flex font-mono text-12 font-weight-500 text-warning-400`}
        >
          <IconWarning className={`w-14 ${isError ? 'text-red' : ''}`} />
          <span className={`ml-5 ${isError ? 'text-red' : ''}`}>
            {warningMessage}
          </span>
        </div>
      )}
    </div>
  );
};
