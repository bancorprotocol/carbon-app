import { Link, useParams } from '@tanstack/react-router';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import {
  EditTypes,
  toDisposablePricesSearch,
  toOverlappingPricesSearch,
  toRecurringPricesSearch,
} from 'libs/routing/routes/strategyEdit';

const links = [
  {
    label: 'Liq. Position',
    to: '/strategies/edit/$strategyId/prices/overlapping',
    text: 'Choose between a Concentrated and a Full-Range liquidity position.',
    id: 'overlapping',
  },
  {
    label: 'Limit / Range',
    to: '/strategies/edit/$strategyId/prices/disposable',
    text: 'Buy or sell at a specific price, or gradually scale in or out of a position.',
    id: 'disposable',
  },
  {
    label: 'Recurring',
    to: '/strategies/edit/$strategyId/prices/recurring',
    text: 'Create an automated trading cycle of buy low/sell high with two separate orders.',
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
      className="bg-white-gradient rounded-e-full rounded-s-8 px-16 py-8 text-14 grid grid-cols-1 gap-8 md:grid-cols-3"
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
          className="rounded-full hover:border-background-400 flex items-center justify-center gap-8 border border-transparent px-8 py-4 text-white/60 aria-[current=page]:bg-black-gradient aria-[current=page]:text-white"
        >
          {link.label}
          <Tooltip element={link.text} iconClassName="size-14" />
        </Link>
      ))}
    </nav>
  );
};
