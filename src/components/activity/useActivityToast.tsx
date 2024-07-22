import { useWagmi } from 'libs/wagmi';
import { useActivityQuery } from './useActivityQuery';
import { useEffect, useState } from 'react';
import { useStore } from 'store';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { ReactComponent as IconClose } from 'assets/icons/X.svg';
import { Link } from '@tanstack/react-router';
import { lsService } from 'services/localeStorage';

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
    const displayToast = async () => {
      let max = 5;
      for (let i = 0; i < activities.length; i++) {
        if (!max) break;

        const delay = Math.max(500, (Math.random() * 30_000) / 5);
        await new Promise((res) => setTimeout(res, delay));
        const preferences = lsService.getItem('notificationPreferences');
        if (preferences?.global === false) return;

        const { base, quote, id: strategyId } = activities[i].strategy;
        const toColor =
          activities[i].action === 'buy' ? 'to-buy-dark' : 'to-sell-dark';
        const id = toaster.addToast(
          <div
            className={`from-background-900 bg-gradient-to-r ${toColor} text-14 rounded-6 flex min-w-[250px] from-30%`}
          >
            <Link
              to="/strategy/$id"
              params={{ id: strategyId }}
              className="flex flex-1 gap-4 p-16"
              onClick={() => toaster.removeToast(id)}
            >
              <TokensOverlap tokens={[base, quote]} size={18} />
              {base.symbol}/{quote.symbol} Trade
            </Link>
            <button
              className="ml-auto p-16 text-white/80"
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
        max--;
      }
    };
    displayToast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.fetchStatus, toaster.addToast, toaster.removeToast]);
};
