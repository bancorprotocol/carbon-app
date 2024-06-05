import { m } from 'libs/motion';
import { items } from 'components/strategies/common/variants';
import { useEditStrategyCtx } from './EditStrategyContext';
import { Link, useParams } from '@tanstack/react-router';
import {
  toDisposablePriceSearch,
  toOverlappingPriceSearch,
  toRecurringPriceSearch,
} from 'libs/routing/routes/strategyEdit';

export const EditPriceNav = () => {
  const params = useParams({ from: '/strategies/edit/$strategyId' });
  const isDisposable = window.location.pathname.includes('disposable');
  const isRecurring = window.location.pathname.includes('recurring');
  const isOverlapping = window.location.pathname.includes('overlapping');
  const { strategy } = useEditStrategyCtx();
  return (
    <m.nav
      variants={items}
      className="border-background-900 text-14 flex gap-4 rounded-full border-2 p-6"
      aria-label="Switch between type of strategy"
    >
      <Link
        className="aria-current-page:bg-white/10 aria-current-page:text-white flex-1 rounded-full bg-transparent py-4 text-center text-white/60"
        to="/strategies/edit/$strategyId/disposable/prices"
        search={toDisposablePriceSearch(strategy)}
        params={params}
        replace={false}
        aria-current={isDisposable ? 'page' : 'false'}
      >
        Disposable
      </Link>
      <Link
        className="aria-current-page:bg-white/10 aria-current-page:text-white flex-1 rounded-full bg-transparent py-4 text-center text-white/60"
        to="/strategies/edit/$strategyId/recurring/prices"
        search={toRecurringPriceSearch(strategy)}
        params={params}
        replace={false}
        aria-current={isRecurring ? 'page' : 'false'}
      >
        Recurring
      </Link>
      <Link
        className="aria-current-page:bg-white/10 aria-current-page:text-white flex-1 rounded-full bg-transparent py-4 text-center text-white/60"
        to="/strategies/edit/$strategyId/overlapping/prices"
        search={toOverlappingPriceSearch(strategy)}
        params={params}
        replace={false}
        aria-current={isOverlapping ? 'page' : 'false'}
      >
        Overlapping
      </Link>
    </m.nav>
  );
};
