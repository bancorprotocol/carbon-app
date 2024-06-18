import {
  JsonRpcSigner,
  StaticJsonRpcProvider,
  Web3Provider,
} from '@ethersproject/providers';
import { Connector } from 'libs/wagmi';

export type SelectableConnectionName =
  | 'MetaMask'
  | 'WalletConnect'
  | 'Coinbase Wallet'
  | 'Safe'
  | 'Tailwind'
  | 'Compass Wallet'
  | 'Seif';

export interface CarbonWagmiProviderContext {
  user: string | undefined;
  imposterAccount: string | undefined;
  accountChainId: number | undefined;
  chainId: number;
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
  setImposterAccount: (account?: string) => void;
  disconnect: () => Promise<void>;
  connect: (type: Connector) => Promise<void>;
  isSupportedNetwork: boolean;
  switchNetwork: () => void;
  isUserBlocked: boolean;
  isUncheckedSigner: boolean;
  setIsUncheckedSigner: (value: boolean) => void;
}
