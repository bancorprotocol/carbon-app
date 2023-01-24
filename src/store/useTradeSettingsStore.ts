import { Dispatch, SetStateAction, useState } from 'react';
import { lsService } from 'services/localeStorage';

export interface TradeSettingsStore {
  slippage: string;
  setSlippage: Dispatch<SetStateAction<string>>;
  deadline: string;
  setDeadline: Dispatch<SetStateAction<string>>;
  maxOrders: string;
  setMaxOrders: Dispatch<SetStateAction<string>>;
}

export const useTradeSettingsStore = (): TradeSettingsStore => {
  const [slippage, setSlippage] = useState(
    lsService.getItem('tradeSlippage') || '0.05'
  );
  const [deadline, setDeadline] = useState(
    lsService.getItem('tradeDeadline') || '30'
  );

  const [maxOrders, setMaxOrders] = useState(
    lsService.getItem('tradeMaxOrders') || '20'
  );

  return {
    slippage,
    setSlippage,
    deadline,
    setDeadline,
    maxOrders,
    setMaxOrders,
  };
};
