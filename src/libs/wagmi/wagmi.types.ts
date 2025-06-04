import {
  JsonRpcSigner,
  StaticJsonRpcProvider,
  Web3Provider,
} from '@ethersproject/providers';
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
  provider?: Web3Provider | StaticJsonRpcProvider;
  signer: JsonRpcSigner | undefined;
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
  isSupportedNetwork: boolean;
  switchNetwork: () => void;
  isUserBlocked: boolean;
  isUncheckedSigner: boolean;
  setIsUncheckedSigner: (value: boolean) => void;
}
