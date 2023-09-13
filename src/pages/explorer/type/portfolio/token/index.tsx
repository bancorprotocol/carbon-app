import { PortfolioToken } from 'components/strategies/portfolio';
import { useExplorer } from 'components/explorer';
import { PathNames } from 'libs/routing';
import { useExplorerParams } from 'components/explorer/useExplorerParams';

export const ExplorerTypePortfolioTokenPage = () => {
  const { strategies, isLoading } = useExplorer();
  const { address, type, slug } = useExplorerParams();

  if (!address) return <div>error no address provided</div>;

  return (
    <PortfolioToken
      strategies={strategies}
      isLoading={isLoading}
      address={address}
      backLinkHref={PathNames.explorerPortfolio(type, slug!)}
    />
  );
};
