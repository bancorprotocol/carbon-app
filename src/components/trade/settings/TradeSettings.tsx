import { Button } from 'components/common/button';
import { useState } from 'react';
import { sanitizeNumberInput } from 'utils/helpers';

const slippageValues = [0.01, 0.05, 0.1];
const expireTimeValues = [5, 10, 30];
const maxOrdersValues = [5, 10, 20];

const buttonClasses =
  'rounded-8 !text-white/60 hover:text-green hover:border-green px-5';
const buttonActiveClasses = 'border-green !text-green';
const inputClasses =
  'border-2 border-black bg-black text-center placeholder-white/25 focus:outline-none';

export const TradeSettings = () => {
  const [slippage, setSlippage] = useState(0.01);
  const [customSlippage, setCustomSlippage] = useState('');

  const handleSlippageChange = (value: number) => {
    setSlippage(value);
    setCustomSlippage('');
  };

  const [expireTime, setExpireTime] = useState(5);
  const [customExpireTime, setCustomExpireTime] = useState('');

  const handleExpireTimeChange = (value: number) => {
    setExpireTime(value);
    setCustomExpireTime('');
  };

  const [maxOrders, setMaxOrders] = useState(5);
  const [customMaxOrders, setCustomMaxOrders] = useState('');

  const handleMaxOrdersChange = (value: number) => {
    setMaxOrders(value);
    setCustomMaxOrders('');
  };

  const data = [
    {
      title: 'Slippage Tolerance',
      value: slippage,
      setValue: setSlippage,
      customValue: customSlippage,
      setCustomValue: setCustomSlippage,
      values: slippageValues,
      handleValueChange: handleSlippageChange,
    },
    {
      title: 'Transaction Expiration Time',
      value: expireTime,
      setValue: setExpireTime,
      customValue: customExpireTime,
      setCustomValue: setCustomExpireTime,
      values: expireTimeValues,
      handleValueChange: handleExpireTimeChange,
    },
    {
      title: 'Maximum Orders',
      value: maxOrders,
      setValue: setMaxOrders,
      customValue: customMaxOrders,
      setCustomValue: setCustomMaxOrders,
      values: maxOrdersValues,
      handleValueChange: handleMaxOrdersChange,
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
                onClick={() => item.handleValueChange(value)}
                className={`${buttonClasses} ${
                  item.value === value && !item.customValue
                    ? buttonActiveClasses
                    : ''
                }`}
              >
                +{value}%
              </Button>
            ))}
            <input
              placeholder={'custom'}
              value={item.customValue}
              onChange={(e) =>
                item.setCustomValue(sanitizeNumberInput(e.target.value))
              }
              className={`${buttonClasses} ${inputClasses} ${
                item.customValue ? buttonActiveClasses : ''
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
