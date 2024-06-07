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
import { type SelectableConnectionType } from './web3.types';
import { selectedConnections } from './web3.constants';

const createPlaceholderConnector = ({
  id,
  name,
  type,
  icon,
}: {
  id: string;
  name: string;
  type: string;
  icon?: string;
}) => {
  return createConnector(() => {
    return {
      id: id,
      name: name,
      type: type,
      icon: icon,
      async setup() {},
      async connect() {
        throw Error('Wallet not installed');
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
      return createPlaceholderConnector({
        name: 'Compass Wallet',
        id: 'compass',
        type: 'url',
        icon: compassWalletLogo,
      });
    case 'Tailwind':
      return createPlaceholderConnector({
        name: 'TAILWIND',
        id: 'tailwind',
        icon: tailwindWalletLogo,
        type: 'url',
      });
    case 'Seif':
      return createPlaceholderConnector({
        name: 'Seif',
        id: 'seif',
        icon: seifWalletLogo,
        type: 'url',
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
