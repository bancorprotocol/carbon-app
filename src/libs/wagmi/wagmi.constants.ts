import { SelectableConnectionType } from 'libs/wagmi/wagmi.types';
import config from 'config';
import { tenderlyRpc } from 'utils/tenderly';

const CHAIN_RPC_URL = tenderlyRpc || config.network.rpc.url;
const CHAIN_RPC_HEADERS = tenderlyRpc ? {} : config.network.rpc.headers || {};
export const CHAIN_ID = config.network.chainId;

if (typeof CHAIN_RPC_URL === 'undefined') {
  throw new Error(`rpcUrl must be defined in config folder`);
}

export const IS_TENDERLY_FORK = !!tenderlyRpc;

export const selectedConnections: SelectableConnectionType[] =
  config.selectedConnections;

export const RPC_URLS = {
  [CHAIN_ID]: CHAIN_RPC_URL,
};
export const RPC_HEADERS = {
  [CHAIN_ID]: CHAIN_RPC_HEADERS,
};
