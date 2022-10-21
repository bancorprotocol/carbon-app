import { getConnection, getConnectionName } from 'services/web3/web3.utils';
import {
  ConnectionType,
  RPC_PROVIDERS,
  RPC_URLS,
  SELECTABLE_CONNECTION_TYPES,
  SupportedChainId,
} from 'services/web3/web3.constants';
import {
  networkConnection,
  injectedConnection,
  gnosisSafeConnection,
  walletConnectConnection,
  coinbaseWalletConnection,
} from 'services/web3/web.connectors';
import {
  BancorWeb3ProviderContext,
  Connection,
  ChainIdMapTo,
} from 'services/web3/web3.types';

export type { BancorWeb3ProviderContext, Connection, ChainIdMapTo };

export {
  getConnection,
  getConnectionName,
  SupportedChainId,
  ConnectionType,
  SELECTABLE_CONNECTION_TYPES,
  RPC_URLS,
  RPC_PROVIDERS,
  networkConnection,
  injectedConnection,
  gnosisSafeConnection,
  walletConnectConnection,
  coinbaseWalletConnection,
};
