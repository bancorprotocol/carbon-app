import { Link, useParams } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import {
  EditTypes,
  toDisposablePricesSearch,
  toOverlappingPricesSearch,
  toRecurringPricesSearch,
} from 'libs/routing/routes/strategyEdit';

const links = [
  {
    label: 'Liquidity Position',
    to: '/strategies/edit/$strategyId/prices/overlapping',
    id: 'overlapping',
  },
  {
    label: 'Limit / Range',
    to: '/strategies/edit/$strategyId/prices/disposable',
    id: 'disposable',
  },
  {
    label: 'Recurring',
    to: '/strategies/edit/$strategyId/prices/recurring',
    id: 'recurring',
  },
] as const;

export const EditPriceNav = ({ editType }: { editType: EditTypes }) => {
  const params = useParams({ from: '/strategies/edit/$strategyId' });
  const pathName = window.location.pathname;
  const priceSearchFn = {
    disposable: toDisposablePricesSearch,
    recurring: toRecurringPricesSearch,
    overlapping: toOverlappingPricesSearch,
  };

  const { strategy } = useEditStrategyCtx();
  if (editType !== 'editPrices' && editType !== 'renew') return;

  return (
    <nav
      className="surface 2xl:grid flex rounded-2xl lg:max-2xl:rounded-full overflow-clip flex-1 bg-main-700/40 gap-4"
      aria-label="Switch between type of strategy"
    >
      {links.map((link) => (
        <Link
          key={link.id}
          to={link.to}
          search={({ chartStart, chartEnd, marketPrice }) => ({
            ...priceSearchFn[link.id](strategy, editType),
            chartStart,
            chartEnd,
            marketPrice,
          })}
          params={params}
          replace={true}
          aria-current={pathName.includes(link.id) ? 'page' : 'false'}
          data-testid={`edit-${link.id}`}
          className="px-8 py-12 sm:px-24 grid place-items-center gap-8 flex-1 text-white/60 aria-page:text-white aria-page:bg-main-500 hover:bg-main-400 aria-page:hover:bg-main-400 bg-main-500/40 2xl:py-16 2xl:flex 2xl:justify-between"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
