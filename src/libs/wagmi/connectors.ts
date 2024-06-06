import carbonLogo from 'assets/logos/carbon.svg';
import tailwindWalletLogo from 'assets/logos/tailwindWallet.svg';
import compassWalletLogo from 'assets/logos/compassWallet.svg';
import seifWalletLogo from 'assets/logos/seifWallet.svg';
import { createStore } from 'mipd';
import { CreateConnectorFn, createConnector } from 'wagmi';

import {
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
import { Address } from 'viem';

const createConnectorURL = ({
  id,
  name,
  type,
  icon,
  url,
}: {
  id: string;
  name: string;
  type: string;
  icon?: string;
  url: string;
}) => {
  return createConnector(() => {
    return {
      id: id,
      name: name,
      type: type,
      icon: icon,
      async setup() {},
      async connect() {
        window.open(url, '__blank');
        return { accounts: [] as Address[], chainId: config.network.chainId };
      },
      async disconnect() {},
      async getAccounts() {
        return [];
      },
      async getChainId() {
        return config.network.chainId;
      },
      async isAuthorized() {
        return true;
      },
      onAccountsChanged() {},
      onChainChanged() {},
      async onDisconnect(_error) {},
      async getProvider() {},
    };
  });
};

const getDefaultConnector = (connectorType: SelectableConnectionType) => {
  switch (connectorType) {
    case 'Compass Wallet':
      return createConnectorURL({
        name: 'Compass Wallet',
        id: 'compass',
        type: 'url',
        icon: compassWalletLogo,
        url: 'https://compasswallet.io/',
      });
    case 'Tailwind':
      return createConnectorURL({
        name: 'TAILWIND',
        id: 'tailwind',
        icon: tailwindWalletLogo,
        type: 'url',
        url: 'https://www.tailwind.zone/',
      });
    case 'Seif':
      return createConnectorURL({
        name: 'Seif',
        id: 'seif',
        icon: seifWalletLogo,
        type: 'url',
        url: 'https://seif.passkeywallet.com/',
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
    case 'Safe':
      return safe({ shimDisconnect: false });
  }
};

const getConfigConnectors = (): CreateConnectorFn[] => {
  const store = createStore();
  const injectedProviderNames = store
    .getProviders()
    .map((provider) => provider.info.name.toLowerCase());
  const missingConnectors = selectedConnections.filter(
    (connection) => !injectedProviderNames.includes(connection.toLowerCase())
  );
  store.destroy();
  return missingConnectors.map(getDefaultConnector);
};

export const configConnectors = getConfigConnectors();
