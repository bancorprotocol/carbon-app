import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { PortfolioAllTokens } from 'components/strategies/portfolio/allTokens/PortfolioAllTokens';
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

  if (isPending) {
    return (
      <div className="grid place-items-center grow grid-area-[list]">
        <CarbonLogoLoading className="h-80" />
      </div>
    );
  }

  return (
    <PortfolioAllTokens
      strategies={strategies}
      getHref={getPortfolioTokenHref}
      onRowClick={onRowClick}
    />
  );
};
