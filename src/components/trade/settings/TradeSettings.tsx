import { Fragment } from 'react';
import { useStore } from 'store';
import { TradeSettingsRow } from './TradeSettingsRow';
import { TradeSettingsData } from './utils';

const toPreset = (values: string[]) => {
  return values.map((value) => ({ label: value, value }));
};

export const TradeSettings = () => {
  const {
    trade: {
      settings: { slippage, setSlippage, deadline, setDeadline, presets },
    },
  } = useStore();

  const settingsData: TradeSettingsData[] = [
    {
      id: 'slippageTolerance',
      title: 'Slippage Tolerance',
      value: slippage,
      prepend: '+',
      append: '%',
      setValue: (value) => setSlippage(value),
      presets: toPreset(presets.slippage),
      max: 50,
    },
    {
      id: 'transactionExpiration',
      title: 'Transaction Expiration Time (min)',
      value: deadline,
      prepend: '',
      append: '',
      setValue: (value) => setDeadline(value),
      presets: toPreset(presets.deadline),
    },
  ];

  return (
    <div className="mt-30">
      {settingsData.map((item) => (
        <Fragment key={item.id}>
          <TradeSettingsRow item={item} />
          <hr className="border-background-700 my-20 border-b-2 last:hidden" />
        </Fragment>
      ))}
    </div>
  );
};
