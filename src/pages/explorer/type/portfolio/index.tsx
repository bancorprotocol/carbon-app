import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useNavigate } from 'libs/routing';
import { useExplorer } from 'components/explorer/useExplorer';

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

  switch (type) {
    case 'wallet': {
      return (
        <PortfolioAllTokens
          strategiesQuery={useWallet.strategiesQuery}
          onRowClick={onRowClick}
          getHref={getHref}
        />
      );
    }
    case 'token-pair': {
      return (
        <PortfolioAllTokens
          strategiesQuery={usePairs.strategiesQuery}
          onRowClick={onRowClick}
          getHref={getHref}
        />
      );
    }
  }
};
