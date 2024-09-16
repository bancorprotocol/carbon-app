import { Link, useParams } from '@tanstack/react-router';
import { ReactComponent as IconDisposable } from 'assets/icons/disposable.svg';
import { ReactComponent as IconRecurring } from 'assets/icons/recurring.svg';
import { ReactComponent as IconOverlapping } from 'assets/icons/overlapping.svg';
import { Tooltip } from 'components/common/tooltip/Tooltip';
import { useEditStrategyCtx } from 'components/strategies/edit/EditStrategyContext';
import { EditDisposableStrategySearch } from 'pages/strategies/edit/prices/disposable';
import { EditRecurringStrategySearch } from 'pages/strategies/edit/prices/recurring';
import { EditOverlappingStrategySearch } from 'pages/strategies/edit/prices/overlapping';
import { Strategy } from 'libs/queries';
import {
  EditTypes,
  toDisposablePricesSearch,
  toOverlappingPricesSearch,
  toRecurringPricesSearch,
} from 'libs/routing/routes/strategyEdit';

const links = [
  {
    label: 'Limit / Range',
    svg: <IconDisposable className="hidden size-14 md:inline" />,
    to: '/strategies/edit/$strategyId/prices/disposable',
    text: 'Buy or sell at a specific price, or gradually scale in or out of a position.',
    id: 'disposable',
  },
  {
    label: 'Recurring',
    svg: <IconRecurring className="hidden size-14 md:inline" />,
    to: '/strategies/edit/$strategyId/prices/recurring',
    text: 'Create an automated trading cycle of buy low/sell high with two separate orders.',
    id: 'recurring',
  },
  {
    label: 'Concentrated',
    svg: <IconOverlapping className="hidden size-14 md:inline" />,
    to: '/strategies/edit/$strategyId/prices/overlapping',
    text: 'Buy and sell within custom parameters with custom fee tier and auto-compounding fees.',
    id: 'overlapping',
  },
] as const;

export const toPricesSearch = (
  strategy: Strategy,
  editType: 'editPrices' | 'renew',
  strategyType: 'disposable' | 'recurring' | 'overlapping'
):
  | EditDisposableStrategySearch
  | EditRecurringStrategySearch
  | EditOverlappingStrategySearch => {
  switch (strategyType) {
    case 'disposable':
      return toDisposablePricesSearch(strategy, editType);
    case 'recurring':
      return toRecurringPricesSearch(strategy, editType);
    case 'overlapping':
      return toOverlappingPricesSearch(strategy, editType);
  }
};

export const EditPriceNav = ({ editType }: { editType: EditTypes }) => {
  const params = useParams({ from: '/strategies/edit/$strategyId' });
  const pathName = window.location.pathname;

  const { strategy } = useEditStrategyCtx();
  if (editType !== 'editPrices' && editType !== 'renew') return;

  return (
    <article className="bg-background-900 grid gap-20 rounded p-20">
      <h2 id="edit-strategy-nav" className="text-18">
        Trading Strategy
      </h2>
      <nav
        aria-labelledby="edit-strategy-nav"
        className="text-14 grid grid-cols-1 gap-8 md:grid-cols-2"
        aria-label="Switch between type of strategy"
      >
        {links.map((link) => (
          <Link
            key={link.id}
            to={link.to}
            search={toPricesSearch(strategy, editType, link.id)}
            params={params}
            replace={true}
            aria-current={pathName.includes(link.id) ? 'page' : 'false'}
            data-testid={`edit-${link.id}`}
            className="rounded-8 hover:border-background-400 flex items-center justify-center gap-8 border border-transparent bg-black p-8 text-white/60 aria-[current=page]:border-white aria-[current=page]:text-white"
          >
            {link.svg}
            {link.label}
            <Tooltip element={link.text} iconClassName="size-14" />
          </Link>
        ))}
      </nav>
    </article>
  );
};
