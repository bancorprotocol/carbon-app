import { Page } from 'components/common/page';
import { ExplorerSearch, useExplorer } from 'components/explorer';
import {
  StrategyPageTabs,
  StrategyTab,
} from 'components/strategies/StrategyPageTabs';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { Outlet, PathNames, useLocation, Navigate } from 'libs/routing';
import { useEffect, useState } from 'react';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';

export const ExplorerPage = () => {
  const {
    current: { pathname },
  } = useLocation();

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 200);

  const {
    usePairs: { filteredPairs },
    routeParams: { type, slug },
  } = useExplorer({ search: debouncedSearch });

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
      // badge: strategies.data?.length || 0,
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
          filteredPairs={filteredPairs}
          search={search}
          setSearch={setSearch}
        />
        {slug && <StrategyPageTabs currentPathname={pathname} tabs={tabs} />}
        <Outlet />
      </div>
    </Page>
  );
};
