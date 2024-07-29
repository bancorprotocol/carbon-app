import { useWagmi } from 'libs/wagmi';
import { useActivityQuery } from './useActivityQuery';
import { useEffect, useState } from 'react';
import { useNotifications } from 'hooks/useNotifications';

export const useActivityNotifications = () => {
  const { user } = useWagmi();
  const [previousUser, setPreviousUser] = useState<string>();
  const [previous, setPrevious] = useState<number | null>(null);
  const query = useActivityQuery({ ownerId: user }, 5_000);
  const allActivities = query.data || [];
  const buyOrSell = allActivities.filter(
    (a) => a.action === 'sell' || a.action === 'buy'
  );
  const { dispatchNotification } = useNotifications();

  useEffect(() => {
    if (query.fetchStatus !== 'idle') return;
    // We need to keep this in the same useEffect to force re-evaluate previous in next render
    if (user !== previousUser) {
      setPreviousUser(user);
      setPrevious(null);
      return;
    }
    const length = buyOrSell.length;
    if (typeof previous === 'number' && length > previous) {
      // Sorted by date desc
      for (let i = 0; i < length - previous; i++) {
        const activity = buyOrSell[i];
        if (user) dispatchNotification('activity', { activity });
      }
    }
    setPrevious(length);
  }, [
    buyOrSell,
    dispatchNotification,
    previous,
    query.fetchStatus,
    previousUser,
    user,
  ]);
};
