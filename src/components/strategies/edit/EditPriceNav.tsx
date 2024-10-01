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
  {
    label: 'Concentrated',
    to: '/strategies/edit/$strategyId/prices/overlapping',
    text: 'Buy and sell within custom parameters with custom fee tier and auto-compounding fees.',
    id: 'overlapping',
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
    <article className="bg-background-900 grid gap-20 rounded p-20">
      <h2 id="edit-strategy-nav" className="text-18">
        Trading Strategy
      </h2>
      <nav
        aria-labelledby="edit-strategy-nav"
        className="text-14 grid grid-cols-1 gap-8 md:grid-cols-3"
        aria-label="Switch between type of strategy"
      >
        {links.map((link) => (
          <Link
            key={link.id}
            to={link.to}
            search={priceSearchFn[link.id](strategy, editType)}
            params={params}
            replace={true}
            aria-current={pathName.includes(link.id) ? 'page' : 'false'}
            data-testid={`edit-${link.id}`}
            className="rounded-8 hover:border-background-400 flex items-center justify-center gap-8 border border-transparent bg-black p-8 text-white/60 aria-[current=page]:border-white aria-[current=page]:text-white"
          >
            {link.label}
            <Tooltip element={link.text} iconClassName="size-14" />
          </Link>
        ))}
      </nav>
    </article>
  );
};
