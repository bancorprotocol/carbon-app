import { useStore } from 'store';
import { lsService } from 'services/localeStorage';

const presets = {
  slippage: ['0.01', '0.05', '0.1'],
  deadline: ['10', '30', '60'],
  maxOrders: ['10', '20', '30'],
};

export const useTradeSettings = () => {
  const {
    trade: { settings },
  } = useStore();

  const setSlippage = (value: string) => {
    const slippage = value || '0.05';
    settings.setSlippage(slippage);
    lsService.setItem('tradeSlippage', slippage);
  };

  const setDeadline = (value: string) => {
    const deadline = value || '30';
    settings.setDeadline(deadline);
    lsService.setItem('tradeDeadline', deadline);
  };

  const setMaxOrders = (value: string) => {
    const maxOrders = value || '20';
    settings.setMaxOrders(maxOrders);
    lsService.setItem('tradeMaxOrders', maxOrders);
  };

  return {
    ...settings,
    setSlippage,
    setDeadline,
    setMaxOrders,
    presets,
  };
};
