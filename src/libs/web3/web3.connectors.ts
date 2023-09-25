import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect-v2';
import { Network } from '@web3-react/network';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { RPC_URLS, SupportedChainId } from 'libs/web3/web3.constants';
import { Connection } from 'libs/web3/web3.types';
import iconMetaMask from 'assets/logos/metamask.svg';
import iconWalletConnect from 'assets/logos/walletConnect.svg';
import iconCoinbase from 'assets/logos/coinbase.svg';
import iconGnosis from 'assets/logos/gnosis.svg';
import carbonLogo from 'assets/logos/carbon.svg';
import { StaticJsonRpcProvider } from '@ethersproject/providers';

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
          projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
          rpc: RPC_URLS,
          showQrModal: true,
          chains: [SupportedChainId.MAINNET],
          metadata: {
            name: 'Carbon',
            description:
              'Trade tokens or create automated onchain trading strategies',
            url: 'https://app.carbondefi.xyz',
            icons: ['https://app.carbondefi.xyz/logo512.png'],
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
