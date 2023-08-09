import { ExplorerRouteGenerics } from 'components/explorer/utils';
import { PortfolioToken } from 'components/strategies/portfolio';
import { useGetPairStrategies } from 'libs/queries';
import { useMatch } from 'libs/routing';
import { useExplorer } from 'pages/explorer/useExplorer';

export const ExplorerTypePortfolioTokenPage = () => {
  const {
    params: { type, slug, address },
  } = useMatch<ExplorerRouteGenerics>();

  const { exactMatch } = useExplorer({
    slug: type === 'token-pair' ? slug : '',
  });
  const strategiesByPairQuery = useGetPairStrategies({
    token0: exactMatch?.baseToken.address,
    token1: exactMatch?.quoteToken.address,
  });

  switch (type) {
    case 'wallet': {
      return (
        <PortfolioToken
          strategiesQuery={strategiesByPairQuery}
          address={address}
        />
      );
    }
    case 'token-pair': {
      return (
        <PortfolioToken
          strategiesQuery={strategiesByPairQuery}
          address={address}
        />
      );
    }
  }

  return null;
};
