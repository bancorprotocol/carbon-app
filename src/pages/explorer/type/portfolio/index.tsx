import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useNavigate } from 'libs/routing';
import { useExplorerParams } from 'components/explorer/useExplorerParams';
import { useStrategyCtx } from 'hooks/useStrategies';
import { getPortfolioTokenHref } from 'pages/strategies/portfolio';

export const ExplorerTypePortfolioPage = () => {
  const navigate = useNavigate();
  const { type, slug } = useExplorerParams();
  const { strategies, isLoading } = useStrategyCtx();

  const onRowClick = (row: Row<PortfolioData>) =>
    navigate({
      to: '/explorer/$type/$slug/portfolio/token/$address',
      params: {
        type,
        slug: slug || '',
        address: row.original.token.address,
      },
    });

  return (
    <>
      <PortfolioAllTokens
        strategies={strategies}
        isLoading={isLoading}
        onRowClick={onRowClick}
        getHref={getPortfolioTokenHref}
        isExplorer
      />
    </>
  );
};
