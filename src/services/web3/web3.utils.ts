import { ConnectionType } from 'services/web3/web3.constants';
import {
  coinbaseWalletConnection,
  gnosisSafeConnection,
  injectedConnection,
  networkConnection,
  walletConnectConnection,
} from 'services/web3/web.connectors';

export const getConnection = (c: ConnectionType) => {
  switch (c) {
    case ConnectionType.INJECTED:
      return injectedConnection;
    case ConnectionType.COINBASE_WALLET:
      return coinbaseWalletConnection;
    case ConnectionType.WALLET_CONNECT:
      return walletConnectConnection;
    case ConnectionType.NETWORK:
      return networkConnection;
    case ConnectionType.GNOSIS_SAFE:
      return gnosisSafeConnection;
  }
};

export const getConnectionName = (
  connectionType: ConnectionType,
  isMetaMask?: boolean
) => {
  switch (connectionType) {
    case ConnectionType.INJECTED:
      return isMetaMask ? 'MetaMask' : 'Injected';
    case ConnectionType.COINBASE_WALLET:
      return 'Coinbase Wallet';
    case ConnectionType.WALLET_CONNECT:
      return 'WalletConnect';
    case ConnectionType.NETWORK:
      return 'Network';
    case ConnectionType.GNOSIS_SAFE:
      return 'Gnosis Safe';
  }
};
