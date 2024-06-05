import carbonLogo from 'assets/logos/carbon.svg';
import { createStore } from 'mipd';
import { CreateConnectorFn } from 'wagmi';

import {
  injected,
  metaMask,
  coinbaseWallet,
  walletConnect,
  safe,
} from 'wagmi/connectors';
import config from 'config';
import {
  SelectableConnectionType,
  selectedConnections,
} from './web3.constants';

const getDefaultConnector = (connectorType: SelectableConnectionType) => {
  switch (connectorType) {
    case 'Compass Wallet':
    case 'Tailwind Wallet':
    case 'Seif Wallet':
      return injected({
        shimDisconnect: false,
      });
    case 'MetaMask':
      return metaMask({
        extensionOnly: false,
        dappMetadata: {
          name: 'CarbonDeFi',
          url: config.appUrl,
          iconUrl: carbonLogo,
        },
      });
    case 'Coinbase Wallet':
      return coinbaseWallet({
        appName: 'Carbon DeFi',
        appLogoUrl: carbonLogo,
      });
    case 'WalletConnect':
      return walletConnect({
        projectId: config.walletConnectProjectId,
        qrModalOptions: {
          themeMode: 'dark',
        },
      });
    case 'safe':
      return safe({ shimDisconnect: false });
  }
};

const getConfigConnectors = (): CreateConnectorFn[] => {
  const store = createStore();
  const injectedProviderNames = store
    .getProviders()
    .map((provider) => provider.info.name);
  const missingConnectors = selectedConnections.filter(
    (connection) => !injectedProviderNames.includes(connection)
  );
  store.destroy();
  return missingConnectors.map(getDefaultConnector);
};

export const configConnectors = getConfigConnectors();
