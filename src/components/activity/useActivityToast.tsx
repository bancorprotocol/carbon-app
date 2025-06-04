import { useWagmi } from 'libs/wagmi';
import { useActivityQuery } from './useActivityQuery';
import { useEffect, useState } from 'react';
import { useStore } from 'store';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { Link } from '@tanstack/react-router';
import { lsService } from 'services/localeStorage';
import { toPairSlug } from 'utils/pairSearch';
import { BaseToast } from 'components/common/Toaster/Toast';
import { getUnixTime, subMilliseconds } from 'date-fns';

const max = 30;
const refetchInterval = 5 * 60 * 1_000;

export const useActivityToast = () => {
  const { user } = useWagmi();
  const [lastFetch, setLastFetch] = useState<number>(
    getUnixTime(subMilliseconds(new Date(), refetchInterval)),
  );
  const params = {
    start: lastFetch,
    limit: max,
    actions: 'buy,sell',
  };
  const queryConfig = { refetchInterval };
  const query = useActivityQuery(params, queryConfig);
  const allActivities = query.data || [];
  const activities = allActivities.filter((a) => {
    if (user && a.strategy.owner === user) return false;
    return true;
  });
  const { toaster } = useStore();

  useEffect(() => {
    if (query.fetchStatus !== 'idle') return;
    setLastFetch(getUnixTime(new Date()));
    for (let i = 0; i < activities.length; i++) {
      setTimeout(
        () => {
          const preferences = lsService.getItem('notificationPreferences');
          if (preferences?.global === false) return;
          const { base, quote } = activities[i].strategy;
          toaster.addToast((id) => (
            <BaseToast id={id}>
              <Link
                to="/explore/$slug/activity"
                params={{ slug: toPairSlug(base, quote) }}
                className="flex flex-1 gap-4 p-16"
                onClick={() => toaster.removeToast(id)}
              >
                <TokensOverlap tokens={[base, quote]} size={18} />
                {base.symbol}/{quote.symbol} Trade
              </Link>
            </BaseToast>
          ));
        },
        (refetchInterval * (Math.random() + i)) / max,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.fetchStatus, toaster.addToast, toaster.removeToast]);
};
