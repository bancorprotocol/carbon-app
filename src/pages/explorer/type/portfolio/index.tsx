import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useNavigate } from 'libs/routing';
import { useExplorerParams } from 'components/explorer/useExplorerParams';
import { useStrategyCtx } from 'hooks/useStrategies';
import { GetPortfolioTokenHref } from 'components/strategies/portfolio/types';

export const ExplorerTypePortfolioPage = () => {
  const navigate = useNavigate();
  const { type, slug } = useExplorerParams('/explore/$type/$slug/portfolio');
  const { strategies, isPending } = useStrategyCtx();
  const href = '/explore/$type/$slug/portfolio/token/$address';

  const getPortfolioTokenHref: GetPortfolioTokenHref = (row) => ({
    href,
    params: {
      type,
      slug: slug || '',
      address: row.token.address,
    },
  });
  const onRowClick = (row: Row<PortfolioData>) =>
    navigate({
      to: href,
      params: {
        type,
        slug: slug || '',
        address: row.original.token.address,
      },
    });

  return (
    <PortfolioAllTokens
      strategies={strategies}
      isPending={isPending}
      getHref={getPortfolioTokenHref}
      onRowClick={onRowClick}
      isExplorer
    />
  );
};
