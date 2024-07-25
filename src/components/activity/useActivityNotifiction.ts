import { useWagmi } from 'libs/wagmi';
import { useActivityQuery } from './useActivityQuery';
import { useEffect, useState } from 'react';
import { useNotifications } from 'hooks/useNotifications';
import { getUnixTime } from 'date-fns';

export const useActivityNotifications = () => {
  const { user } = useWagmi();
  const [previousUser, setPreviousUser] = useState<string>();
  const [lastFetch, setLastFetch] = useState<number>(getUnixTime(new Date()));
  const query = useActivityQuery({ ownerId: user, start: lastFetch }, 5_000);
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
    query.fetchStatus,
    previousUser,
    user,
  ]);
};
