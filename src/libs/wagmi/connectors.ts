import tailwindWalletLogo from 'assets/logos/tailwindWallet.svg';
import compassWalletLogo from 'assets/logos/compassWallet.svg';
import seifWalletLogo from 'assets/logos/seifWallet.svg';
import { createStore } from 'mipd';
import { Connector, CreateConnectorFn, createConnector } from 'wagmi';
import {
  metaMask,
  coinbaseWallet,
  walletConnect,
  safe,
} from 'wagmi/connectors';
import config, { networks } from 'config';
import {
  type SelectableConnectionName,
  providerMapRdnsToName,
  selectedConnectors,
  currentChain,
} from 'libs/wagmi';
import { externalLinks } from 'libs/routing';

const PLACEHOLDER_TAG = '_placeholder';

export const isPlaceHolderConnector = (c: Connector) =>
  c.type.endsWith(PLACEHOLDER_TAG);

const createPlaceholderConnector = ({
  id,
  name,
  icon,
}: {
  id: string;
  name: string;
  icon?: string;
}) => {
  return createConnector(() => {
    return {
      id: id,
      name: name,
      type: id + PLACEHOLDER_TAG,
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

const getDefaultConnector = (connectorType: SelectableConnectionName) => {
  switch (connectorType) {
    case 'Compass Wallet':
      return createPlaceholderConnector({
        name: 'Compass Wallet',
        id: 'compass',
        icon: compassWalletLogo,
      });
    case 'Tailwind':
      return createPlaceholderConnector({
        name: 'TAILWIND',
        id: 'tailwind',
        icon: tailwindWalletLogo,
      });
    case 'Seif':
      return createPlaceholderConnector({
        name: 'Seif',
        id: 'seif',
        icon: seifWalletLogo,
      });
    case 'MetaMask':
      return metaMask({
        extensionOnly: false,
        preferDesktop: true,
        dappMetadata: {
          name: config.appName,
          url: config.appUrl,
        },
      });
    case 'Coinbase Wallet':
      return coinbaseWallet({
        appName: config.appName,
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

export const redirectSafeWallet = (
  currentId: number,
  redirectToId?: number
) => {
  if (isIframe() && redirectToId && currentId !== redirectToId) {
    const networkToRedirect = networks.find(
      (network) => network.chainId === redirectToId
    );
    if (!networkToRedirect) return;
    window.location.href = networkToRedirect.appUrl;
  }
};

export const providerRdnsToName = (
  connectionName: string
): string | undefined => providerMapRdnsToName[connectionName];

const getConfigConnectors = (): CreateConnectorFn[] => {
  const store = createStore();

  const initializedProvidersRdns = store
    .getProviders()
    .map((provider) => provider.info.rdns.toLowerCase());

  // Safe wallet always runs through an iFrame, the same check as the safe connector's getProvider is performed here.
  // The allowedDomains param in the safe connector is another way to check we're in a safe wallet
  if (!isIframe()) initializedProvidersRdns.push('safe');

  const initializedProvidersNames = initializedProvidersRdns
    .map(providerRdnsToName)
    .filter((c) => c)
    .map((c) => c!.toLowerCase());

  // Only initialize connectors that are not injected
  const missingConnectors = selectedConnectors.filter(
    (name) => !initializedProvidersNames.includes(name.toLowerCase())
  );

  store.destroy();
  return missingConnectors.map(getDefaultConnector);
};

export const configConnectors = getConfigConnectors();
