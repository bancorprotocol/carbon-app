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
  resetAll: () => void;
  isAllSettingsDefault: boolean;
}

const presets: TradeSettingsStore['presets'] = {
  slippage: ['0.1', '0.5', '1'],
  deadline: ['10', '30', '60'],
  maxOrders: ['10', '20', '30'],
};

export const useTradeSettingsStore = (): TradeSettingsStore => {
  const [slippage, _setSlippage] = useState(
    lsService.getItem('tradeSlippage') || presets.slippage[1]
  );

  const [deadline, _setDeadline] = useState(
    lsService.getItem('tradeDeadline') || presets.deadline[1]
  );

  const [maxOrders, _setMaxOrders] = useState(
    lsService.getItem('tradeMaxOrders') || presets.maxOrders[1]
  );

  const setSlippage = (value: string) => {
    const slippage = value || presets.slippage[1];
    _setSlippage(slippage);
    lsService.setItem('tradeSlippage', slippage);
  };

  const setDeadline = (value: string) => {
    const deadline = value || presets.deadline[1];
    _setDeadline(deadline);
    lsService.setItem('tradeDeadline', deadline);
  };

  const setMaxOrders = (value: string) => {
    const maxOrders = value || presets.maxOrders[1];
    _setMaxOrders(maxOrders);
    lsService.setItem('tradeMaxOrders', maxOrders);
  };

  const resetAll = () => {
    setSlippage(presets.slippage[1]);
    setDeadline(presets.deadline[1]);
    setMaxOrders(presets.maxOrders[1]);
  };

  const isAllSettingsDefault =
    slippage === presets.slippage[1] &&
    deadline === presets.deadline[1] &&
    maxOrders === presets.maxOrders[1];

  return {
    slippage,
    setSlippage,
    deadline,
    setDeadline,
    maxOrders,
    setMaxOrders,
    presets,
    resetAll,
    isAllSettingsDefault,
  };
};

export const defaultTradeSettingsStore: TradeSettingsStore = {
  slippage: '',
  setSlippage: () => {},
  deadline: '',
  setDeadline: () => {},
  maxOrders: '',
  setMaxOrders: () => {},
  presets,
  resetAll: () => {},
  isAllSettingsDefault: true,
};
