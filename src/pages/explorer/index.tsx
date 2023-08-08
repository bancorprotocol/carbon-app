import { Navigate, useNavigate } from '@tanstack/react-location';
import { Button } from 'components/common/button';
import { Page } from 'components/common/page';
import {
  StrategyPageTabs,
  StrategyTab,
} from 'components/strategies/StrategyPageTabs';
import { useGetUserStrategies } from 'libs/queries';
import { Link, Outlet, useLocation, useMatch } from 'libs/routing';
import { useState } from 'react';
import { ReactComponent as IconPieChart } from 'assets/icons/piechart.svg';
import { ReactComponent as IconOverview } from 'assets/icons/overview.svg';

export const ExplorerPage = () => {
  const {
    current: { pathname },
  } = useLocation();
  const { params } = useMatch();

  const [search, setSearch] = useState(params.search || '');

  const navigate = useNavigate();

  // const strategies = useGetUserStrategies({ user: params.search });

  const tabs: StrategyTab[] = [
    {
      label: 'Overview',
      href: `/explorer/${params.type}/${params.search}`,
      hrefMatches: [`/explorer/${params.type}/${params.search}`],
      icon: <IconOverview className={'h-18 w-18'} />,
      // badge: strategies.data?.length || 0,
    },
    {
      label: 'Portfolio',
      href: `/explorer/${params.type}/${params.search}/portfolio`,
      hrefMatches: [
        `/explorer/${params.type}/${params.search}/portfolio`,
        `/explorer/${params.type}/${params.search}/portfolio/token/0x`,
      ],
      icon: <IconPieChart className={'h-18 w-18'} />,
    },
  ];

  if (params.type !== 'wallet' && params.type !== 'token-pair') {
    return <Navigate to="/explorer/wallet" />;
  }

  return (
    <Page>
      ExplorerPage
      <div>
        <Link to="/explorer/wallet">Wallet</Link>
      </div>
      <div>
        <Link to="/explorer/token-pair">Token Pair</Link>
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button
        onClick={() => {
          navigate({ to: `/explorer/${params.type}/${search}` });
        }}
      >
        Go
      </Button>
      <StrategyPageTabs currentPathname={pathname} tabs={tabs} />
      <div>type: {params.type}</div>
      <pre>{JSON.stringify(params, null, 2)}</pre>
      <Outlet />
    </Page>
  );
};
