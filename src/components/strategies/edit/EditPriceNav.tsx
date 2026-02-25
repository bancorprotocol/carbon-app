import { Link, useParams } from '@tanstack/react-router';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import IconDisposable from 'assets/icons/disposable.svg?react';
import IconRecurring from 'assets/icons/recurring.svg?react';
import IconOverlapping from 'assets/icons/overlapping.svg?react';
import {
  EditTypes,
  toDisposablePricesSearch,
  toOverlappingPricesSearch,
  toRecurringPricesSearch,
} from 'libs/routing/routes/strategyEdit';

const links = [
  {
    id: 'overlapping' as const,
    type: 'Essentials',
    label: 'Liquidity Position',
    to: '/strategies/edit/$strategyId/prices/overlapping',
    svg: <IconOverlapping className="hidden md:block size-20" />,
  },
  {
    id: 'disposable' as const,
    type: 'Intermediate',
    label: 'Limit / Range',
    to: '/strategies/edit/$strategyId/prices/disposable',
    svg: <IconDisposable className="hidden md:block size-20" />,
  },
  {
    id: 'recurring' as const,
    type: 'Advanced',
    label: 'Recurring',
    to: '/strategies/edit/$strategyId/prices/recurring',
    svg: <IconRecurring className="hidden md:block size-20" />,
  },
];

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
      className="surface rounded-full overflow-clip flex-1 flex p-4 sm:gap-8 2xl:grid 2xl:rounded-2xl tab-list"
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
          className="px-8 py-6 grid place-items-center flex-1 text-main-0/60 tab-anchor aria-page:tab-focus 2xl:py-16 sm:px-24 2xl:justify-items-start hover:bg-main-400/60"
        >
          <span className="text-12 sm:text-14">{link.type}</span>
          <div className="flex items-center gap-8 text-10 sm:text-16">
            {link.svg}
            <span>{link.label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
};
