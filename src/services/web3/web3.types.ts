import { Connector } from '@web3-react/types';
import { Web3ReactHooks } from '@web3-react/core';
import {
  JsonRpcProvider,
  JsonRpcSigner,
  StaticJsonRpcProvider,
  Web3Provider,
} from '@ethersproject/providers';
import { ConnectionType, SupportedChainId } from './web3.constants';

export interface Connection {
  connector: Connector;
  hooks: Web3ReactHooks;
  type: ConnectionType;
}

export type ChainIdMapTo<T extends string | JsonRpcProvider> = {
  [key in SupportedChainId]: T;
};

export interface BancorWeb3ProviderContext {
  user: string | undefined;
  setImposterAccount: (account: string) => void;
  chainId: number | undefined;
  isNetworkActive: boolean;
  provider?: Web3Provider | StaticJsonRpcProvider;
  signer: JsonRpcSigner | undefined;
  handleTenderlyRPC: (url?: string) => void;
}
