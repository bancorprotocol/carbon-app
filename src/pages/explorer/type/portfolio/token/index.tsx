import { PortfolioToken } from 'components/strategies/portfolio';
import { useExplorerParams } from 'components/explorer/useExplorerParams';
import { useStrategyCtx } from 'hooks/useStrategies';

const url = '/explore/$type/$slug/portfolio/token/$address';
export const ExplorerTypePortfolioTokenPage = () => {
  const { address, type, slug } = useExplorerParams(url);
  const { strategies, isPending } = useStrategyCtx();

  if (!address) return <div>error no address provided</div>;

  return (
    <PortfolioToken
      strategies={strategies}
      isPending={isPending}
      address={address}
      backLinkHref="/explore/$type/$slug/portfolio"
      backLinkHrefParams={{ type, slug }}
    />
  );
};
