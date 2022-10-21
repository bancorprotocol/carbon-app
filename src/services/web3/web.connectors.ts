import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';
import { Network } from '@web3-react/network';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import {
  Connection,
  ConnectionType,
  RPC_PROVIDERS,
  RPC_URLS,
  SupportedChainId,
} from 'services/web3';

const onError = (error: Error) => {
  console.debug(`web3-react error: ${error}`);
};

// ********************************** //
// NETWORK CONNECTOR
// ********************************** //

const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
  (actions) =>
    new Network({ actions, urlMap: RPC_PROVIDERS, defaultChainId: 1 })
);
export const networkConnection: Connection = {
  connector: web3Network,
  hooks: web3NetworkHooks,
  type: ConnectionType.NETWORK,
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
  type: ConnectionType.INJECTED,
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
  type: ConnectionType.GNOSIS_SAFE,
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
          rpc: RPC_URLS,
          qrcode: true,
        },
        onError,
      })
  );
export const walletConnectConnection: Connection = {
  connector: web3WalletConnect,
  hooks: web3WalletConnectHooks,
  type: ConnectionType.WALLET_CONNECT,
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
          url: RPC_URLS[SupportedChainId.MAINNET][0],
          appName: 'Bancor',
          // TODO: add Bancor Logo
          appLogoUrl: '',
          reloadOnDisconnect: false,
        },
        onError,
      })
  );
export const coinbaseWalletConnection: Connection = {
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
};
