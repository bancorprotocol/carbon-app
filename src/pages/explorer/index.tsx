import { Page } from 'components/common/page';
import { ExplorerSearch, useExplorer } from 'components/explorer';
import { StrategyFilterSort } from 'components/strategies/overview/StrategyFilterSort';
import {
  StrategyPageTabs,
  StrategyTab,
} from 'components/strategies/StrategyPageTabs';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { Outlet, PathNames, useLocation, Navigate } from 'libs/routing';
import { useEffect, useState } from 'react';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';
import { useStore } from 'store';

export const ExplorerPage = () => {
  const { aboveBreakpoint } = useBreakpoints();
  const {
    current: { pathname },
  } = useLocation();

  const {
    strategies: { sort, setSort, filter, setFilter },
  } = useStore();

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 200);

  const {
    usePairs,
    useWallet,
    routeParams: { type, slug },
  } = useExplorer({ search: debouncedSearch });

  const strategies =
    type === 'wallet'
      ? useWallet.strategiesQuery.data
      : usePairs.strategiesQuery.data;

  useEffect(() => {
    if (slug) {
      if (type === 'token-pair') {
        return setSearch(slug.toUpperCase().replace('-', '/'));
      }
      if (type === 'wallet') {
        return setSearch(slug.toLowerCase());
      }
    }
  }, [slug, setSearch, type]);

  const tabs: StrategyTab[] = [
    {
      label: 'Overview',
      href: PathNames.explorerOverview(type, slug!),
      hrefMatches: [],
      icon: <IconOverview className={'h-18 w-18'} />,
      badge: strategies?.length || 0,
    },
    {
      label: 'Portfolio',
      href: PathNames.explorerPortfolio(type, slug!),
      hrefMatches: [PathNames.explorerPortfolioToken(type, slug!, '0x')],
      icon: <IconPieChart className={'h-18 w-18'} />,
    },
  ];

  if (type !== 'wallet' && type !== 'token-pair') {
    return <Navigate to={PathNames.explorer('wallet')} />;
  }

  return (
    <Page hideTitle>
      <div className={'flex flex-grow flex-col space-y-30'}>
        <ExplorerSearch
          type={type}
          filteredPairs={usePairs.filteredPairs}
          search={search}
          setSearch={setSearch}
        />
        {slug && (
          <div className={'flex items-center justify-between'}>
            <StrategyPageTabs currentPathname={pathname} tabs={tabs} />
            {aboveBreakpoint('md') &&
              pathname === PathNames.explorerOverview(type, slug!) && (
                <StrategyFilterSort
                  sort={sort}
                  filter={filter}
                  setSort={setSort}
                  setFilter={setFilter}
                />
              )}
          </div>
        )}
        <Outlet />
      </div>
    </Page>
  );
};
