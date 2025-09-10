import { PortfolioToken } from 'components/strategies/portfolio/token/PortfolioToken';
import { useStrategyCtx } from 'hooks/useStrategies';
import { useParams } from '@tanstack/react-router';
import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';

const url = '/explore/distribution/token/$address';
export const ExplorerTypePortfolioTokenPage = () => {
  const { address } = useParams({ from: url });
  const { strategies, isPending } = useStrategyCtx();

  if (!address) return <div>error no address provided</div>;
  if (isPending) {
    return (
      <div className="grid place-items-center grow grid-area-[list]">
        <CarbonLogoLoading className="h-80" />
      </div>
    );
  }
  return (
    <div className="grid-area-[list]">
      <PortfolioToken
        strategies={strategies}
        address={address}
        backLinkHref="/explore/distribution"
      />
    </div>
  );
};
