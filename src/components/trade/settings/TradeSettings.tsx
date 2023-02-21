import { useStore } from 'store';
import { SettingsRow } from './SettingsRow';
import { DataType } from './utils';

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
      {data.map((item, i) => (
        <SettingsRow key={item.id} item={item} i={i} numOfItems={data.length} />
      ))}
    </div>
  );
};
