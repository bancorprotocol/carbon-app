import { Row } from '@tanstack/react-table';
import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { GetPortfolioTokenHref } from 'components/strategies/portfolio/types';
import { PortfolioData } from 'components/strategies/portfolio/usePortfolioData';
import { useStrategyCtx } from 'hooks/useStrategies';
import { useNavigate } from 'libs/routing';

export const StrategiesPortfolioPage = () => {
  const { strategies, isPending } = useStrategyCtx();
  const navigate = useNavigate();
  const href = '/portfolio/strategies/portfolio/token/$address';

  const getPortfolioTokenHref: GetPortfolioTokenHref = (row) => ({
    href,
    params: { address: row.token.address },
  });

  const onRowClick = (row: Row<PortfolioData>) =>
    navigate({
      to: href,
      params: { address: row.original.token.address },
    });

  return (
    <PortfolioAllTokens
      strategies={strategies}
      isPending={isPending}
      getHref={getPortfolioTokenHref}
      onRowClick={onRowClick}
    />
  );
};
