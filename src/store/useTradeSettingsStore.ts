import { useState } from 'react';
import { lsService } from 'services/localeStorage';

export interface TradeSettingsStore {
  slippage: string;
  setSlippage: (value: string) => void;
  deadline: string;
  setDeadline: (value: string) => void;
  maxOrders: string;
  setMaxOrders: (value: string) => void;
  presets: {
    slippage: string[];
    deadline: string[];
    maxOrders: string[];
  };
}

export const useTradeSettingsStore = (): TradeSettingsStore => {
  const [slippage, _setSlippage] = useState(
    lsService.getItem('tradeSlippage') || '0.05'
  );
  const [deadline, _setDeadline] = useState(
    lsService.getItem('tradeDeadline') || '30'
  );

  const [maxOrders, _setMaxOrders] = useState(
    lsService.getItem('tradeMaxOrders') || '20'
  );

  const setSlippage = (value: string) => {
    const slippage = value || '0.05';
    _setSlippage(slippage);
    lsService.setItem('tradeSlippage', slippage);
  };

  const setDeadline = (value: string) => {
    const deadline = value || '30';
    _setDeadline(deadline);
    lsService.setItem('tradeDeadline', deadline);
  };

  const setMaxOrders = (value: string) => {
    const maxOrders = value || '20';
    _setMaxOrders(maxOrders);
    lsService.setItem('tradeMaxOrders', maxOrders);
  };

  return {
    slippage,
    setSlippage,
    deadline,
    setDeadline,
    maxOrders,
    setMaxOrders,
    presets: {
      slippage: ['0.01', '0.05', '0.1'],
      deadline: ['10', '30', '60'],
      maxOrders: ['10', '20', '30'],
    },
  };
};

export const defaultTradeSettingsStore: TradeSettingsStore = {
  slippage: '',
  setSlippage: () => {},
  deadline: '',
  setDeadline: () => {},
  maxOrders: '',
  setMaxOrders: () => {},
  presets: {
    slippage: [],
    deadline: [],
    maxOrders: [],
  },
};
