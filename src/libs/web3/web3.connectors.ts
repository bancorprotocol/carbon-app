import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { initializeConnector } from '@web3-react/core';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { EIP1193 } from '@web3-react/eip1193';
import { EMPTY, Empty } from '@web3-react/empty';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect-v2';
import { Network } from '@web3-react/network';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { TailwindConnector } from '@tailwindzone/connect-web3-react';
import iconMetaMask from 'assets/logos/metamask.svg';
import iconWalletConnect from 'assets/logos/walletConnect.svg';
import iconCoinbase from 'assets/logos/coinbase.svg';
import iconTailwindWallet from 'assets/logos/coinbase.svg';
import iconCompassWallet from 'assets/logos/compassWallet.svg';
import iconSeifWallet from 'assets/logos/seifWallet.svg';
import iconGnosis from 'assets/logos/gnosis.svg';
import carbonLogo from 'assets/logos/carbon.svg';
import config from 'config';
import {
  RPC_HEADERS,
  RPC_URLS,
  SupportedChainId,
} from 'libs/web3/web3.constants';
import { Connection } from 'libs/web3/web3.types';
import { getInjectedProvider } from './web3.utils';

const onError = (error: Error) => {
  console.debug(`web3-react error: ${error}`);
};

// ********************************** //
// NETWORK CONNECTOR
// ********************************** //

const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
  (actions) =>
    new Network({
      actions,
      urlMap: {
        ...RPC_URLS,
        [SupportedChainId.MAINNET]: new StaticJsonRpcProvider({
          url: RPC_URLS[SupportedChainId.MAINNET],
          headers: RPC_HEADERS[SupportedChainId.MAINNET],
          skipFetchSetup: true,
        }),
      },
      defaultChainId: SupportedChainId.MAINNET,
    })
);
export const networkConnection: Connection = {
  connector: web3Network,
  hooks: web3NetworkHooks,
  type: 'network',
  name: 'Network',
};

// ********************************** //
// INJECTED CONNECTOR
// ********************************** //

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions, onError })
);
export const injectedConnection: Connection = {
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: 'injected',
  name: 'MetaMask',
  logoUrl: iconMetaMask,
};

// ********************************** //
// GNOSIS CONNECTOR
// ********************************** //

const [web3GnosisSafe, web3GnosisSafeHooks] = initializeConnector<GnosisSafe>(
  (actions) => new GnosisSafe({ actions })
);
export const gnosisSafeConnection: Connection = {
  connector: web3GnosisSafe,
  hooks: web3GnosisSafeHooks,
  type: 'gnosisSafe',
  name: 'Gnosis Safe',
  logoUrl: iconGnosis,
};

// ********************************** //
// WALLETCONNECT CONNECTOR
// ********************************** //

const [web3WalletConnect, web3WalletConnectHooks] =
  initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect({
        actions,
        options: {
          projectId: config.walletConnectProjectId,
          rpc: RPC_URLS,
          showQrModal: true,
          chains: [SupportedChainId.MAINNET],
          metadata: {
            name: 'Carbon',
            description:
              'Trade tokens or create automated onchain trading strategies',
            url: config.appUrl,
            icons: [`${config.appUrl}/logo512.png`],
          },
        },
        onError,
      })
  );
export const walletConnectConnection: Connection = {
  connector: web3WalletConnect,
  hooks: web3WalletConnectHooks,
  type: 'walletConnect',
  name: 'WalletConnect',
  logoUrl: iconWalletConnect,
};

// ********************************** //
// COINBASE WALLET CONNECTOR
// ********************************** //

const [web3CoinbaseWallet, web3CoinbaseWalletHooks] =
  initializeConnector<CoinbaseWallet>(
    (actions) =>
      new CoinbaseWallet({
        actions,
        options: {
          url: RPC_URLS[SupportedChainId.MAINNET],
          appName: 'Carbon',
          appLogoUrl: carbonLogo,
          reloadOnDisconnect: false,
        },
        onError,
      })
  );
export const coinbaseWalletConnection: Connection = {
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: 'coinbaseWallet',
  name: 'Coinbase Wallet',
  logoUrl: iconCoinbase,
};

// ********************************** //
// Tailwind WALLET CONNECTOR
// ********************************** //

const [web3TailwindWallet, web3TailwindWalletHooks] =
  initializeConnector<TailwindConnector>(
    (actions) => new TailwindConnector({ actions })
  );
export const tailwindWalletConnection: Connection = {
  connector: web3TailwindWallet,
  hooks: web3TailwindWalletHooks,
  type: 'tailwindWallet',
  name: 'Tailwind Wallet',
  logoUrl: iconTailwindWallet,
};

// ********************************** //
// Compass WALLET CONNECTOR
// ********************************** //

export const [web3CompassWallet, web3CompassWalletHooks] = getInjectedProvider(
  'compassEvm',
  'isCompassWallet'
)
  ? initializeConnector<EIP1193>(
      (actions) =>
        new EIP1193({
          actions,
          provider: getInjectedProvider('compassEvm', 'isCompassWallet'),
        })
    )
  : initializeConnector<Empty>(() => EMPTY);

export const compassWalletConnection: Connection = {
  connector: web3CompassWallet,
  hooks: web3CompassWalletHooks,
  type: 'compassWallet',
  name: 'Compass Wallet',
  logoUrl: iconCompassWallet,
};

// ********************************** //
// Seif WALLET CONNECTOR
// ********************************** //

export const [web3SeifWallet, web3SeifWalletHooks] = getInjectedProvider(
  '__seif',
  '__seif'
)
  ? initializeConnector<EIP1193>(
      (actions) =>
        new EIP1193({
          actions,
          provider: getInjectedProvider('__seif', '__seif'),
        })
    )
  : initializeConnector<Empty>(() => EMPTY);

export const seifWalletConnection: Connection = {
  connector: web3SeifWallet,
  hooks: web3SeifWalletHooks,
  type: 'seifWallet',
  name: 'Seif Wallet',
  logoUrl: iconSeifWallet,
};
