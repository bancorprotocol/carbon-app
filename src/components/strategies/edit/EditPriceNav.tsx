import { useEditStrategyCtx } from './EditStrategyContext';
import { Link, useParams } from '@tanstack/react-router';
import {
  EditTypes,
  toDisposablePricesSearch,
  toOverlappingPricesSearch,
  toRecurringPricesSearch,
} from 'libs/routing/routes/strategyEdit';
import { ReactComponent as IconDisposable } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlapping } from 'assets/icons/overlapping.svg';
import { FC } from 'react';

interface Props {
  editType: EditTypes;
}
export const EditPriceNav: FC<Props> = ({ editType }) => {
  const params = useParams({ from: '/strategies/edit/$strategyId' });
  const isDisposable = window.location.pathname.includes('disposable');
  const isRecurring = window.location.pathname.includes('recurring');
  const isOverlapping = window.location.pathname.includes('overlapping');
  const { strategy } = useEditStrategyCtx();
  if (editType !== 'editPrices' && editType !== 'renew') return;
  return (
    <nav
      className="border-background-900 text-14 flex gap-4 rounded-full border-2 p-6"
      aria-label="Switch between type of strategy"
    >
      <Link
        className="aria-current-page:bg-white/10 aria-current-page:text-white flex flex-1 items-center justify-center gap-8 rounded-full bg-transparent py-4 text-center text-white/60 hover:text-white/80"
        to="/strategies/edit/$strategyId/prices/disposable"
        search={toDisposablePricesSearch(strategy, editType)}
        params={params}
        replace={true}
        aria-current={isDisposable ? 'page' : 'false'}
      >
        <IconDisposable className="hidden size-14 md:inline" />
        Limit / Range
      </Link>
      <Link
        className="aria-current-page:bg-white/10 aria-current-page:text-white flex flex-1 items-center justify-center gap-8 rounded-full bg-transparent py-4 text-center text-white/60 hover:text-white/80"
        to="/strategies/edit/$strategyId/prices/recurring"
        search={toRecurringPricesSearch(strategy, editType)}
        params={params}
        replace={true}
        aria-current={isRecurring ? 'page' : 'false'}
      >
        <IconRecurring className="hidden size-14 md:inline" />
        Recurring
      </Link>
      <Link
        className="aria-current-page:bg-white/10 aria-current-page:text-white flex flex-1 items-center justify-center gap-8 rounded-full bg-transparent py-4 text-center text-white/60 hover:text-white/80"
        to="/strategies/edit/$strategyId/prices/overlapping"
        search={toOverlappingPricesSearch(strategy, editType)}
        params={params}
        replace={true}
        aria-current={isOverlapping ? 'page' : 'false'}
      >
        <IconOverlapping className="hidden size-14 md:inline" />
        Concentrated
      </Link>
    </nav>
  );
};
