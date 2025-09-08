import { PortfolioToken } from 'components/strategies/portfolio/token/PortfolioToken';
import { useStrategyCtx } from 'hooks/useStrategies';
import { useParams } from '@tanstack/react-router';

const url = '/explore/distribution/token/$address';
export const ExplorerTypePortfolioTokenPage = () => {
  const { address } = useParams({ from: url });
  const strategies = useStrategyCtx();

  if (!address) return <div>error no address provided</div>;

  return (
    <PortfolioToken
      strategies={strategies}
      address={address}
      backLinkHref="/explore/distribution"
    />
  );
};
