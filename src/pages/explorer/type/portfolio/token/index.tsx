import { PortfolioToken } from 'components/strategies/portfolio';
import { useExplorerParams } from 'components/explorer/useExplorerParams';
import { useStrategyCtx } from 'hooks/useStrategies';

export const ExplorerTypePortfolioTokenPage = () => {
  const { address, type, slug } = useExplorerParams();
  const { strategies, isLoading } = useStrategyCtx();

  if (!address) return <div>error no address provided</div>;

  return (
    <PortfolioToken
      strategies={strategies}
      isLoading={isLoading}
      address={address}
      backLinkHref="/explore/$type/$slug/portfolio"
      backLinkHrefParams={{ type, slug }}
    />
  );
};
