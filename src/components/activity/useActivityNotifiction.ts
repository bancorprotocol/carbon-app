import { useWeb3 } from 'libs/web3';
import { useActivityQuery } from './useActivityQuery';
import { useEffect, useState } from 'react';
import { useNotifications } from 'hooks/useNotifications';

export const useActivityNotifications = () => {
  const { user } = useWeb3();
  const [previous, setPrevious] = useState<number | null>(null);
  const query = useActivityQuery({ ownerId: user });
  const allActivities = query.data || [];
  const buyOrSell = allActivities.filter(
    (a) => a.action === 'sell' || a.action === 'buy'
  );
  const { dispatchNotification } = useNotifications();
  useEffect(() => {
    if (query.isLoading) return;
    const length = buyOrSell.length;
    if (typeof previous === 'number' && length > previous) {
      // Sorted by date desc
      for (let i = 0; i < length - previous; i++) {
        const activity = buyOrSell[i];
        dispatchNotification('activity', { activity });
      }
    }
    setPrevious(length);
  }, [buyOrSell, dispatchNotification, previous, query.isLoading]);
};
