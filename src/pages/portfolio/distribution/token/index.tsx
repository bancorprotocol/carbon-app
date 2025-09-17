import { CarbonLogoLoading } from 'components/common/CarbonLogoLoading';
import { PortfolioToken } from 'components/strategies/portfolio/token/PortfolioToken';
import { useStrategyCtx } from 'hooks/useStrategies';
import { useParams } from 'libs/routing';

export const PortfolioDistributionTokenPage = () => {
  const { strategies, isPending } = useStrategyCtx();
  const { address } = useParams({
    from: '/portfolio/distribution/token/$address',
  });

  if (isPending) {
    return (
      <div className="grid place-items-center grow grid-area-[list]">
        <CarbonLogoLoading className="h-80" />
      </div>
    );
  }

  return (
    <PortfolioToken
      strategies={strategies}
      address={address}
      backLinkHref="/portfolio/distribution"
    />
  );
};
