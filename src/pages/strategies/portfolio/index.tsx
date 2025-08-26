import { PortfolioAllTokens } from 'components/strategies/portfolio';
import { GetPortfolioTokenHref } from 'components/strategies/portfolio/types';
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

  const onRowClick = (address: string) =>
    navigate({
      to: href,
      params: { address },
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
