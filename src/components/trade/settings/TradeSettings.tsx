import { Fragment } from 'react';
import { useStore } from 'store';
import { TradeSettingsRow } from './TradeSettingsRow';
import { TradeSettingsData } from './utils';

export const TradeSettings = () => {
  const {
    trade: {
      settings: {
        slippage,
        setSlippage,
        deadline,
        setDeadline,
        presets,
      },
    },
  } = useStore();

  const settingsData: TradeSettingsData[] = [
    {
      id: 'slippageTolerance',
      title: 'Slippage Tolerance',
      value: slippage,
      prepend: '+',
      append: '%',
      setValue: setSlippage,
      presets: presets.slippage,
    },
    {
      id: 'transactionExpiration',
      title: 'Transaction Expiration Time',
      value: deadline,
      prepend: '',
      append: ' Min',
      setValue: setDeadline,
      presets: presets.deadline,
    },
  ];

  return (
    <div className={'mt-30'}>
      {settingsData.map((item) => (
        <Fragment key={item.id}>
          <TradeSettingsRow item={item} />
          <hr className={'my-20 border-b-2 border-grey5 last:hidden'} />
        </Fragment>
      ))}
    </div>
  );
};
