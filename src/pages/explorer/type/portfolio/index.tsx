import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useNavigate } from 'libs/routing';
import { useExplorer } from 'components/explorer';
import { useExplorerParams } from 'components/explorer/useExplorerParams';

export const ExplorerTypePortfolioPage = () => {
  const navigate = useNavigate();
  const { strategies, isLoading } = useExplorer();
  const { type, slug } = useExplorerParams();

  const onRowClick = (row: Row<PortfolioData>) =>
    navigate({
      to: `/explorer/${type}/${slug}/portfolio/token/${row.original.token.address}`,
    });

  const getHref = (row: PortfolioData) =>
    `/explorer/${type}/${slug}/portfolio/token/${row.token.address}`;

  return (
    <PortfolioAllTokens
      strategies={strategies}
      isLoading={isLoading}
      onRowClick={onRowClick}
      getHref={getHref}
      isExplorer
    />
  );
};
