import { Button } from 'components/common/button';
import { useStore } from 'store';
import { sanitizeIntegerInput } from 'utils/helpers';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { DataType, getWarningMessageIfNeeded } from './utils';

const buttonClasses =
  'rounded-8 !text-white/60 hover:text-green hover:border-green px-5';
const buttonActiveClasses = 'border-green !text-green';
const inputClasses =
  'border-2 border-black bg-black text-center placeholder-white/25 focus:outline-none';

export const TradeSettings = () => {
  const {
    trade: {
      settings: {
        slippage,
        setSlippage,
        deadline,
        setDeadline,
        maxOrders,
        setMaxOrders,
        presets,
      },
    },
  } = useStore();

  const data: DataType[] = [
    {
      id: 'slippageTolerance',
      title: 'Slippage Tolerance',
      value: slippage,
      prepend: '+',
      append: '%',
      setValue: setSlippage,
      values: presets.slippage,
    },
    {
      id: 'transactionExpiration',
      title: 'Transaction Expiration Time',
      value: deadline,
      prepend: '',
      append: ' Min',
      setValue: setDeadline,
      values: presets.deadline,
    },
    {
      id: 'maxOrders',
      title: 'Maximum Orders',
      value: maxOrders,
      prepend: '',
      append: '',
      setValue: setMaxOrders,
      values: presets.maxOrders,
    },
  ];

  return (
    <div className={'mt-30'}>
      {data.map((item, i) => {
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
                value={
                  !item.values.some((value) => value === item.value)
                    ? item.value
                    : ''
                }
                onChange={({ target: { value } }) => {
                  const res = sanitizeIntegerInput(value);
                  item.setValue(res);
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
            {data.length - 1 > i && (
              <hr className={'my-20 border-b-2 border-grey5'} />
            )}
          </div>
        );
      })}
    </div>
  );
};
