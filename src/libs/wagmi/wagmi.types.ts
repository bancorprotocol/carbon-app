import {
  JsonRpcSigner,
  JsonRpcProvider,
  BrowserProvider,
  TransactionRequest,
} from 'ethers';
import { Connector } from 'libs/wagmi';

export const selectableConnectionNames = [
  'MetaMask',
  'WalletConnect',
  'Coinbase Wallet',
  'Safe',
  'Tailwind',
  'Compass Wallet',
  'Seif',
] as const;

export type SelectableConnectionName =
  (typeof selectableConnectionNames)[number];

export interface CarbonWagmiProviderContext {
  user: string | undefined;
  imposterAccount: string | undefined;
  accountChainId: number | undefined;
  chainId: number;
  isNetworkActive: boolean;
  networkError: string | undefined;
  provider?: BrowserProvider | JsonRpcProvider;
  signer: JsonRpcSigner | undefined;
  sendTransaction: (
    tx: TransactionRequest | TransactionRequest[],
  ) => Promise<{ hash: string; wait: () => Promise<any> }>;
  currentConnector: Connector | undefined;
  connectors: readonly Connector[];
  handleTenderlyRPC: (
    url?: string,
    carbonController?: string,
    voucherAddress?: string,
    batcherAddress?: string,
  ) => void;
  setImposterAccount: (account?: string) => void;
  disconnect: () => Promise<void>;
  connect: (type: Connector) => Promise<void>;
  openConnect: () => void;
  isSupportedNetwork: boolean;
  switchNetwork: () => void;
  isUserBlocked: boolean;
  isUncheckedSigner: boolean;
  setIsUncheckedSigner: (value: boolean) => void;
  getBalance: (address: string) => Promise<bigint>;
}
