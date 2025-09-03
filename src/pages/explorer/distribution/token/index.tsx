import { PortfolioToken } from 'components/strategies/portfolio';
import { useStrategyCtx } from 'hooks/useStrategies';
import { useParams } from '@tanstack/react-router';

const url = '/explore/$slug/portfolio/token/$address';
export const ExplorerTypePortfolioTokenPage = () => {
  const { address, slug } = useParams({ from: url });
  const { strategies, isPending } = useStrategyCtx();

  if (!address) return <div>error no address provided</div>;

  return (
    <PortfolioToken
      strategies={strategies}
      isPending={isPending}
      address={address}
      backLinkHref="/explore/$slug/portfolio"
      backLinkHrefParams={{ slug }}
    />
  );
};
