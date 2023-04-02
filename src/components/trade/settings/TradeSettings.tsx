import { Token } from 'libs/tokens';
import { Fragment, FC } from 'react';
import { sendEvent } from 'services/googleTagManager';
import { useStore } from 'store';
import { TradeSettingsRow } from './TradeSettingsRow';
import { TradeSettingsData } from './utils';

export const TradeSettings: FC<{ base: Token; quote: Token }> = ({
  base,
  quote,
}) => {
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

  const handleEvent = () => {
    sendEvent('trade', 'trade_pair_settings_set', {
      token_pair: `${base.symbol}/${quote.symbol}`,
      buy_token: base.symbol,
      sell_token: quote.symbol,
    });
  };

  const settingsData: TradeSettingsData[] = [
    {
      id: 'slippageTolerance',
      title: 'Slippage Tolerance',
      value: slippage,
      prepend: '+',
      append: '%',
      setValue: (value) => {
        setSlippage(value);
        handleEvent();
        sendEvent('trade', 'trade_slippage_tolerance_change', {
          trade_slippage_tolerance: value,
        });
      },
      presets: presets.slippage,
    },
    {
      id: 'transactionExpiration',
      title: 'Transaction Expiration Time',
      value: deadline,
      prepend: '',
      append: ' Min',
      setValue: (value) => {
        setDeadline(value);
        handleEvent();
        sendEvent('trade', 'trade_transaction_expiration_time_change', {
          trade_transaction_expiration_time: value,
        });
      },
      presets: presets.deadline,
    },
    {
      id: 'maxOrders',
      title: 'Maximum Orders',
      value: maxOrders,
      prepend: '',
      append: '',
      setValue: (value) => {
        setMaxOrders(value);
        handleEvent();
        sendEvent('trade', 'trade_maximum_orders_change', {
          trade_maximum_orders: value,
        });
      },
      presets: presets.maxOrders,
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
