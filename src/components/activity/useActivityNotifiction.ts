import { useWeb3 } from 'libs/web3';
import { useActivityQuery } from './useActivityQuery';
import { useEffect, useState } from 'react';
import { useNotifications } from 'hooks/useNotifications';

export const useActivityNotifications = () => {
  const { user } = useWeb3();
  const [size, setSize] = useState(0);
  const query = useActivityQuery({ ownerId: user });
  const buyOrSell = (query.data || []).filter(
    (a) => a.action === 'sell' || a.action === 'buy'
  );
  const { dispatchNotification } = useNotifications();
  useEffect(() => {
    if (!size) return setSize(buyOrSell.length);
    if (size === buyOrSell.length) return;
    for (let i = size; i < buyOrSell.length; i++) {
      const activity = buyOrSell[i];
      dispatchNotification('activity', { activity });
    }
    setSize(buyOrSell.length);
  }, [dispatchNotification, buyOrSell.length, size, buyOrSell]);
};
