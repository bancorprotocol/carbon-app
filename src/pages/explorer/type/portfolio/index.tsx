import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useNavigate, useParams } from 'libs/routing';
import { useStrategyCtx } from 'hooks/useStrategies';
import { GetPortfolioTokenHref } from 'components/strategies/portfolio/types';

export const ExplorerTypePortfolioPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams({ from: '/explore/$slug/portfolio' });
  const { strategies, isPending } = useStrategyCtx();
  const href = '/explore/$slug/portfolio/token/$address';

  const getPortfolioTokenHref: GetPortfolioTokenHref = (row) => ({
    href,
    params: {
      slug: slug || '',
      address: row.token.address,
    },
  });
  const onRowClick = (row: Row<PortfolioData>) =>
    navigate({
      to: href,
      params: {
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
