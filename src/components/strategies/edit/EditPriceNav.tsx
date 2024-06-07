import { useEditStrategyCtx } from './EditStrategyContext';
import { Link, useParams } from '@tanstack/react-router';
import {
  toDisposablePricesSearch,
  toOverlappingPricesSearch,
  toRecurringPricesSearch,
} from 'libs/routing/routes/strategyEdit';

export const EditPriceNav = () => {
  const params = useParams({ from: '/strategies/edit/$strategyId' });
  const isDisposable = window.location.pathname.includes('disposable');
  const isRecurring = window.location.pathname.includes('recurring');
  const isOverlapping = window.location.pathname.includes('overlapping');
  const { strategy } = useEditStrategyCtx();
  return (
    <nav
      className="border-background-900 text-14 flex gap-4 rounded-full border-2 p-6"
      aria-label="Switch between type of strategy"
    >
      <Link
        className="aria-current-page:bg-white/10 aria-current-page:text-white flex-1 rounded-full bg-transparent py-4 text-center text-white/60"
        to="/strategies/edit/$strategyId/prices/disposable"
        search={toDisposablePricesSearch(strategy)}
        params={params}
        replace={true}
        aria-current={isDisposable ? 'page' : 'false'}
      >
        Disposable
      </Link>
      <Link
        className="aria-current-page:bg-white/10 aria-current-page:text-white flex-1 rounded-full bg-transparent py-4 text-center text-white/60"
        to="/strategies/edit/$strategyId/prices/recurring"
        search={toRecurringPricesSearch(strategy)}
        params={params}
        replace={true}
        aria-current={isRecurring ? 'page' : 'false'}
      >
        Recurring
      </Link>
      <Link
        className="aria-current-page:bg-white/10 aria-current-page:text-white flex-1 rounded-full bg-transparent py-4 text-center text-white/60"
        to="/strategies/edit/$strategyId/prices/overlapping"
        search={toOverlappingPricesSearch(strategy)}
        params={params}
        replace={true}
        aria-current={isOverlapping ? 'page' : 'false'}
      >
        Overlapping
      </Link>
    </nav>
  );
};
