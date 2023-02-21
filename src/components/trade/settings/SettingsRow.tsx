import { Button } from 'components/common/button';
import { sanitizeIntegerInput } from 'utils/helpers';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { DataType, getWarningMessageIfNeeded } from './utils';
import { FC, useEffect, useState } from 'react';

const buttonClasses =
  'rounded-8 !text-white/60 hover:text-green hover:border-green px-5';
const buttonActiveClasses = 'border-green !text-green';
const inputClasses =
  'border-2 border-black bg-black text-center placeholder-white/25 focus:outline-none';

export const SettingsRow: FC<{
  item: DataType;
  i: number;
  numOfItems: number;
}> = ({ item, i, numOfItems }) => {
  const isExist = item.values.some((value) => value === item.value);
  const [internalValue, setInternalValue] = useState(isExist ? '' : item.value);

  useEffect(() => {
    if (isExist) {
      setInternalValue('');
    }
  }, [internalValue, isExist, item, item.values]);

  const warningMessage = getWarningMessageIfNeeded(item.id, item.value);
  return (
    <div key={item.title}>
      <div className={'text-white/60'}>{item.title}</div>
      <div className={'mt-10 grid grid-cols-4 gap-10'}>
        {item.values.map((value) => (
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
          onChange={({ target: { value } }) => {
            const res = sanitizeIntegerInput(value);
            item.setValue(res);
            setInternalValue(res);
          }}
          className={`${buttonClasses} ${inputClasses} ${
            !item.values.some((value) => value === item.value)
              ? buttonActiveClasses
              : ''
          }`}
        />
      </div>
      {warningMessage && (
        <div className="mt-15 flex font-mono text-12 font-weight-500 text-warning-400">
          <IconWarning className={`w-14 text-warning-400`} />
          <span className="ml-5">{warningMessage}</span>
        </div>
      )}
      {numOfItems - 1 > i && <hr className={'my-20 border-b-2 border-grey5'} />}
    </div>
  );
};
