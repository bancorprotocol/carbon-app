import { useWagmi } from 'libs/wagmi';
import { useActivityQuery } from './useActivityQuery';
import { useEffect, useState } from 'react';
import { useNotifications } from 'hooks/useNotifications';
import { getUnixTime } from 'date-fns';

export const useActivityNotifications = () => {
  const { user } = useWagmi();
  const [previousUser, setPreviousUser] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(getUnixTime(new Date()));
  const query = useActivityQuery({ ownerId: user, start: lastFetch });
  const allActivities = query.data || [];
  const buyOrSell = allActivities.filter(
    (a) => a.action === 'sell' || a.action === 'buy'
  );
  const { dispatchNotification } = useNotifications();

  useEffect(() => {
    if (query.isPending) return;
    // We need to keep this in the same useEffect to force re-evaluate previous in next render
    if (user && user !== previousUser) {
      setPreviousUser(user);
      return;
    }
    for (const activity of buyOrSell) {
      dispatchNotification('activity', { activity });
    }
    setLastFetch(getUnixTime(new Date()));
  }, [
    buyOrSell,
    dispatchNotification,
    lastFetch,
    query.isPending,
    previousUser,
    user,
  ]);
};
