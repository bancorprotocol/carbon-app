import { useWagmi } from 'libs/wagmi';
import { useActivityQuery } from './useActivityQuery';
import { useEffect, useState } from 'react';
import { useStore } from 'store';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { Link } from '@tanstack/react-router';
import { lsService } from 'services/localeStorage';
import { toPairSlug } from 'utils/pairSearch';
import { BaseToast } from 'components/common/Toaster/Toast';

export const useActivityToast = () => {
  const { user } = useWagmi();
  const [previous, setPrevious] = useState<number | null>(null);
  const query = useActivityQuery({}, 5_000);
  const allActivities = query.data || [];
  const activities = allActivities.filter((a) => {
    if (a.action !== 'buy' && a.action !== 'sell') return false;
    if (user && a.strategy.owner === user) return false;
    return true;
  });
  const { toaster } = useStore();

  useEffect(() => {
    if (query.fetchStatus !== 'idle') return;
    const length = activities.length;
    setPrevious(length);
    if (typeof previous !== 'number' || length <= previous) return;
    const max = Math.min(length - previous, 8);
    for (let i = 0; i < max; i++) {
      setTimeout(() => {
        const preferences = lsService.getItem('notificationPreferences');
        if (preferences?.global === false) return;
        const { base, quote } = activities[i].strategy;
        toaster.addToast((id) => (
          <BaseToast id={id}>
            <Link
              to="/explore/$type/$slug/activity"
              params={{ type: 'token-pair', slug: toPairSlug(base, quote) }}
              className="flex flex-1 gap-4 p-16"
              onClick={() => toaster.removeToast(id)}
            >
              <TokensOverlap tokens={[base, quote]} size={18} />
              {base.symbol}/{quote.symbol} Trade
            </Link>
          </BaseToast>
        ));
      }, (30_000 * (Math.random() + i)) / max);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.fetchStatus, toaster.addToast, toaster.removeToast]);
};
