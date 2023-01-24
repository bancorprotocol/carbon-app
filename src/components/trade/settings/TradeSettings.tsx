import { Button } from 'components/common/button';
import { sanitizeNumberInput } from 'utils/helpers';
import { useStore } from 'store';

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

  const data = [
    {
      title: 'Slippage Tolerance',
      value: slippage,
      prepend: '+',
      append: '%',
      setValue: setSlippage,
      values: presets.slippage,
    },
    {
      title: 'Transaction Expiration Time',
      value: deadline,
      prepend: '',
      append: ' Min',
      setValue: setDeadline,
      values: presets.deadline,
    },
    {
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
      {data.map((item, i) => (
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
              onChange={(e) =>
                item.setValue(sanitizeNumberInput(e.target.value))
              }
              className={`${buttonClasses} ${inputClasses} ${
                !item.values.some((value) => value === item.value)
                  ? buttonActiveClasses
                  : ''
              }`}
            />
          </div>
          {data.length - 1 > i && (
            <hr className={'my-20 border-b-2 border-grey5'} />
          )}
        </div>
      ))}
    </div>
  );
};
