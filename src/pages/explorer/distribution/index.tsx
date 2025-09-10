import { PortfolioAllTokens } from 'components/strategies/portfolio/allTokens/PortfolioAllTokens';
import { useNavigate } from 'libs/routing';
import { useStrategyCtx } from 'hooks/useStrategies';
import { GetPortfolioTokenHref } from 'components/strategies/portfolio/types';
import { useCallback } from 'react';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';

const href = '/explore/distribution/token/$address';
export const ExplorerDistribution = () => {
  const navigate = useNavigate();
  const { strategies, isPending } = useStrategyCtx();

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

  if (isPending) {
    return (
      <div className="grid place-items-center grow grid-area-[list]">
        <CarbonLogoLoading className="h-80" />
      </div>
    );
  }

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
