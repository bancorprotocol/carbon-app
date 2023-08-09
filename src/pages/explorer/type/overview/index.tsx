import { ExplorerRouteGenerics } from 'components/explorer/utils';
import { StrategyContent } from 'components/strategies/overview';
import { useGetPairStrategies, useGetUserStrategies } from 'libs/queries';
import { useMatch } from 'libs/routing';
import { useExplorer } from 'pages/explorer/useExplorer';

export const ExplorerTypeOverviewPage = () => {
  const {
    params: { type, slug },
  } = useMatch<ExplorerRouteGenerics>();

  // TODO check search is valid address
  const strategiesByUserQuery = useGetUserStrategies({
    user: type === 'wallet' ? slug : undefined,
  });

  const { exactMatch } = useExplorer({
    slug: type === 'token-pair' ? slug : '',
  });
  const strategiesByPairQuery = useGetPairStrategies({
    token0: exactMatch?.baseToken.address,
    token1: exactMatch?.quoteToken.address,
  });

  switch (type) {
    case 'wallet': {
      return <StrategyContent strategies={strategiesByUserQuery} />;
    }
    case 'token-pair': {
      return <StrategyContent strategies={strategiesByPairQuery} />;
    }
  }
};
