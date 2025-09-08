import { PortfolioAllTokens } from 'components/strategies/portfolio/allTokens/PortfolioAllTokens';
import { useNavigate } from 'libs/routing';
import { useStrategyCtx } from 'hooks/useStrategies';
import { GetPortfolioTokenHref } from 'components/strategies/portfolio/types';
import { useCallback } from 'react';

const href = '/explore/distribution/token/$address';
export const ExplorerDistribution = () => {
  const navigate = useNavigate();
  const strategies = useStrategyCtx();

  const getPortfolioTokenHref: GetPortfolioTokenHref = (row) => ({
    href,
    params: {
      address: row.token.address,
    },
  });

  const onRowClick = useCallback(
    (address: string) => {
      navigate({
        to: href,
        params: { address },
      });
    },
    [navigate],
  );

  return (
    <div className="grid-area-[list]">
      <PortfolioAllTokens
        strategies={strategies}
        getHref={getPortfolioTokenHref}
        onRowClick={onRowClick}
        isExplorer
      />
    </div>
  );
};
