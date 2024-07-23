import { useWagmi } from 'libs/wagmi';
import { useActivityQuery } from './useActivityQuery';
import { useEffect, useState } from 'react';
import { useStore } from 'store';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { Link } from '@tanstack/react-router';
import { lsService } from 'services/localeStorage';
import { toPairSlug } from 'utils/pairSearch';

export const useActivityToast = () => {
  const { user } = useWagmi();
  const [previous, setPrevious] = useState<number | null>(null);
  const query = useActivityQuery({});
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
        const id = toaster.addToast(
          <div className="flex">
            <Link
              to="/explore/$type/$slug/activity"
              params={{ type: 'token-pair', slug: toPairSlug(base, quote) }}
              className="flex flex-1 gap-4 p-16"
              onClick={() => toaster.removeToast(id)}
            >
              <TokensOverlap tokens={[base, quote]} size={18} />
              {base.symbol}/{quote.symbol} Trade
            </Link>
            <button
              className="p-16 text-white/80"
              aria-label="close message"
              onClick={() => toaster.removeToast(id)}
            >
              <IconClose className="size-10" />
            </button>
          </div>,
          {
            duration: 2000,
          }
        );
      }, (30_000 * (Math.random() + i)) / max);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.fetchStatus, toaster.addToast, toaster.removeToast]);
};
