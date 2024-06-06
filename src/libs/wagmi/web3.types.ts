import {
  JsonRpcProvider,
  JsonRpcSigner,
  StaticJsonRpcProvider,
  Web3Provider,
} from '@ethersproject/providers';
import { SupportedChainId } from 'libs/wagmi/web3.constants';
import { Connector } from 'libs/wagmi';

export type ChainIdMapTo<T extends string | JsonRpcProvider> = {
  [key in SupportedChainId]: T;
};

export type SelectableConnectionType =
  | 'MetaMask'
  | 'WalletConnect'
  | 'Coinbase Wallet'
  | 'Safe'
  | 'Tailwind'
  | 'Compass Wallet'
  | 'Seif';

export interface CarbonWeb3ProviderContext {
  user: string | undefined;
  chainId: number | undefined;
  isNetworkActive: boolean;
  networkError: string | undefined;
  provider?: Web3Provider | StaticJsonRpcProvider;
  signer: JsonRpcSigner | undefined;
  currentConnector: Connector | undefined;
  connectors: readonly Connector[];
  handleTenderlyRPC: (
    url?: string,
    carbonController?: string,
    voucherAddress?: string
  ) => void;
  handleImposterAccount: (account: string) => void;
  disconnect: () => Promise<void>;
  connect: (type: Connector) => Promise<void>;
  isImposter: boolean;
  isSupportedNetwork: boolean;
  switchNetwork: () => void;
  isUserBlocked: boolean;
  isUncheckedSigner: boolean;
  setIsUncheckedSigner: (value: boolean) => void;
}
