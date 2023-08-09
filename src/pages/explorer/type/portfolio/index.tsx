import { Row } from '@tanstack/react-table';
import { ExplorerRouteGenerics } from 'components/explorer/utils';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useGetPairStrategies, useGetUserStrategies } from 'libs/queries';
import { useMatch, useNavigate } from 'libs/routing';
import { useExplorer } from 'pages/explorer/useExplorer';

export const ExplorerTypePortfolioPage = () => {
  const {
    params: { type, slug },
  } = useMatch<ExplorerRouteGenerics>();
  const navigate = useNavigate();

  const onRowClick = (row: Row<PortfolioData>) =>
    navigate({
      to: `/explorer/${type}/${slug}/portfolio/token/${row.original.token.address}`,
    });

  const getHref = (row: PortfolioData) =>
    `/explorer/${type}/${slug}/portfolio/token/${row.token.address}`;

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
      return (
        <PortfolioAllTokens
          strategiesQuery={strategiesByUserQuery}
          onRowClick={onRowClick}
          getHref={getHref}
        />
      );
    }
    case 'token-pair': {
      return (
        <PortfolioAllTokens
          strategiesQuery={strategiesByPairQuery}
          onRowClick={onRowClick}
          getHref={getHref}
        />
      );
    }
  }
};
