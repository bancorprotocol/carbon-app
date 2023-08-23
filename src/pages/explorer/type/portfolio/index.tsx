import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useNavigate } from 'libs/routing';
import { useExplorer } from 'components/explorer';

export const ExplorerTypePortfolioPage = () => {
  const navigate = useNavigate();

  const {
    usePairs,
    useWallet,
    routeParams: { type, slug },
  } = useExplorer();

  const onRowClick = (row: Row<PortfolioData>) =>
    navigate({
      to: `/explorer/${type}/${slug}/portfolio/token/${row.original.token.address}`,
    });

  const getHref = (row: PortfolioData) =>
    `/explorer/${type}/${slug}/portfolio/token/${row.token.address}`;

  const getStrategiesQuery = () => {
    switch (type) {
      case 'wallet': {
        return useWallet.strategiesQuery;
      }
      case 'token-pair': {
        return usePairs.strategiesQuery;
      }
    }
  };

  const strategiesQuery = getStrategiesQuery();

  return (
    <PortfolioAllTokens
      strategies={strategiesQuery.data}
      isLoading={strategiesQuery.isLoading}
      onRowClick={onRowClick}
      getHref={getHref}
    />
  );
};
