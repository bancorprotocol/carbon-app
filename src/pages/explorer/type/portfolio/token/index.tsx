import { PortfolioToken } from 'components/strategies/portfolio';
import { useExplorer } from 'components/explorer/useExplorer';

export const ExplorerTypePortfolioTokenPage = () => {
  const {
    usePairs,
    useWallet,
    routeParams: { address, type },
  } = useExplorer();

  if (!address) return <div>error no address provided</div>;

  switch (type) {
    case 'wallet': {
      return (
        <PortfolioToken
          strategiesQuery={useWallet.strategiesQuery}
          address={address}
        />
      );
    }
    case 'token-pair': {
      return (
        <PortfolioToken
          strategiesQuery={usePairs.strategiesQuery}
          address={address}
        />
      );
    }
  }
};
