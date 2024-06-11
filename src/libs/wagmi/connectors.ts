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
import { type SelectableConnectionType } from './wagmi.types';
import { selectedConnections } from './wagmi.constants';
import { currentChain } from './chains';
import { externalLinks } from 'libs/routing';

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
        return currentChain.id;
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
        icon: compassWalletLogo,
        type: 'compass.placeholder',
      });
    case 'Tailwind':
      return createPlaceholderConnector({
        name: 'TAILWIND',
        id: 'tailwind',
        icon: tailwindWalletLogo,
        type: 'tailwind.placeholder',
      });
    case 'Seif':
      return createPlaceholderConnector({
        name: 'Seif',
        id: 'seif',
        icon: seifWalletLogo,
        type: 'seif.placeholder',
      });
    case 'MetaMask':
      return metaMask({
        extensionOnly: false,
        preferDesktop: true,
        dappMetadata: {
          name: config.appName,
          url: config.appUrl,
          iconUrl: carbonLogo,
        },
      });
    case 'Coinbase Wallet':
      return coinbaseWallet({
        appName: config.appName,
        appLogoUrl: carbonLogo,
      });
    case 'WalletConnect':
      return walletConnect({
        projectId: config.walletConnectProjectId,
        qrModalOptions: {
          themeMode: 'dark',
          privacyPolicyUrl: externalLinks.privacy,
          termsOfServiceUrl: externalLinks.terms,
        },
      });
    case 'Safe':
      return safe({
        allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
      });
  }
};

const isIframe = () =>
  typeof window !== 'undefined' && window?.parent !== window;

const getConfigConnectors = (): CreateConnectorFn[] => {
  const store = createStore();

  const providersToHide = store
    .getProviders()
    .map((provider) => provider.info.name.toLowerCase());
  if (!isIframe()) providersToHide.push('safe');

  const missingConnectors = selectedConnections.filter(
    (connection) => !providersToHide.includes(connection.toLowerCase())
  );

  store.destroy();
  return missingConnectors.map(getDefaultConnector);
};

export const configConnectors = getConfigConnectors();
