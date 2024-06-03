import { Connector } from '@web3-react/types';
import { Web3ReactHooks } from '@web3-react/core';
import {
  JsonRpcProvider,
  JsonRpcSigner,
  StaticJsonRpcProvider,
  Web3Provider,
} from '@ethersproject/providers';
import {
  ConnectionType,
  SupportedChainId,
  injectedProviders,
} from 'libs/web3/web3.constants';

export interface Connection {
  connector: Connector;
  hooks: Web3ReactHooks;
  type: ConnectionType;
  name: string;
  logoUrl?: string;
}

export type ChainIdMapTo<T extends string | JsonRpcProvider> = {
  [key in SupportedChainId]: T;
};

export interface CarbonWeb3ProviderContext {
  user: string | undefined;
  chainId: number | undefined;
  isNetworkActive: boolean;
  networkError: string | undefined;
  provider?: Web3Provider | StaticJsonRpcProvider;
  signer: JsonRpcSigner | undefined;
  handleTenderlyRPC: (
    url?: string,
    carbonController?: string,
    voucherAddress?: string
  ) => void;
  handleImposterAccount: (account: string) => void;
  disconnect: () => Promise<void>;
  connect: (type: ConnectionType) => Promise<void>;
  isImposter: boolean;
  isSupportedNetwork: boolean;
  switchNetwork: () => void;
  isUserBlocked: boolean;
  isUncheckedSigner: boolean;
  setIsUncheckedSigner: (value: boolean) => void;
}

export type InjectedProvider =
  (typeof injectedProviders)[keyof typeof injectedProviders];
