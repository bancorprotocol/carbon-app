import { useWagmi } from 'libs/wagmi';
import { useActivityQuery } from './useActivityQuery';
import { useEffect, useState } from 'react';
import { useNotifications } from 'hooks/useNotifications';
import { getUnixTime } from 'date-fns';

export const useActivityNotifications = () => {
  const { user } = useWagmi();
  const [previousUser, setPreviousUser] = useState<string>();
  const [lastFetch, setLastFetch] = useState<number>(getUnixTime(new Date()));
  const query = useActivityQuery({
    ownerId: user,
    start: lastFetch,
    actions: 'sell,buy',
  });
  const { dispatchNotification } = useNotifications();
  useEffect(() => {
    if (query.fetchStatus !== 'idle') return;
    // We need to keep this in the same useEffect to force re-evaluate previous in next render
    if (user !== previousUser) {
      setPreviousUser(user);
      return;
    }
    const activities = query.data || [];
    for (const activity of activities) {
      dispatchNotification('activity', { activity });
    }
    setLastFetch(getUnixTime(new Date()));
  }, [
    query.data,
    dispatchNotification,
    lastFetch,
    query.fetchStatus,
    previousUser,
    user,
  ]);
};
