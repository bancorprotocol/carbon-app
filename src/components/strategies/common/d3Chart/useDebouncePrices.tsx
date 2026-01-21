import { useCallback, useEffect, useRef, useState } from 'react';
import { FormStaticOrder } from '../types';
import { OnPriceUpdates } from './D3ChartCandlesticks';
import { SafeDecimal } from 'libs/safedecimal';

export const useDebouncePrices = (
  buy: FormStaticOrder,
  sell: FormStaticOrder,
  cb: OnPriceUpdates,
) => {
  const timeout = useRef<number | null>(null);
  const [localPrices, setLocalPrices] = useState({
    buy: { min: buy.min || '0', max: buy.max || '0' },
    sell: { min: sell.min || '0', max: sell.max || '0' },
  });
  useEffect(() => {
    setLocalPrices({
      buy: { min: buy.min || '0', max: buy.max || '0' },
      sell: { min: sell.min || '0', max: sell.max || '0' },
    });
  }, [buy.min, buy.max, sell.min, sell.max]);
  const update: OnPriceUpdates = useCallback(
    ({ buy, sell }) => {
      const newPrices = {
        buy: {
          min: SafeDecimal.max(buy.min || 0, 0).toString(),
          max: SafeDecimal.max(buy.max || 0, 0).toString(),
        },
        sell: {
          min: SafeDecimal.max(sell.min || 0, 0).toString(),
          max: SafeDecimal.max(sell.max || 0, 0).toString(),
        },
      };
      setLocalPrices(newPrices);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        cb(newPrices);
      }, 200);
    },
    [cb],
  );
  return {
    prices: localPrices,
    setPrices: update,
  };
};
