import { Navigate } from '@tanstack/react-location';
import { Page } from 'components/common/page';
import { ExplorerSearch, useExplorer } from 'components/explorer';
import {
  StrategyPageTabs,
  StrategyTab,
} from 'components/strategies/StrategyPageTabs';
import { Outlet, PathNames, useLocation } from 'libs/routing';
import { useEffect, useState } from 'react';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';

export const ExplorerPage = () => {
  const {
    current: { pathname },
  } = useLocation();

  const [search, setSearch] = useState('');

  const {
    usePairs: { filteredPairs },
    routeParams: { type, slug },
  } = useExplorer({ search });

  useEffect(() => {
    if (slug) {
      setSearch(slug.toUpperCase().replace('-', '/'));
    }
  }, [slug, setSearch]);

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
    <Page>
      <div className={'space-y-20'}>
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
