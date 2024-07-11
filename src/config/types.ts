import { TokenList } from 'libs/tokens';
import { SelectableConnectionName } from 'libs/wagmi';
import { FaucetToken } from 'utils/tenderly';

type address = `0x${string}`;
type ContractDetails = { address: address; blockCreated?: number };

export interface AppConfig {
  mode: 'development' | 'production';
  appName: string;
  appUrl: string;
  carbonApi: string;
  externalLinks?: Record<string, string>;
  selectedConnectors: SelectableConnectionName[];
  blockedConnectors?: SelectableConnectionName[];
  walletConnectProjectId: string;
  isSimulatorEnabled: boolean;
  sentryDSN?: string;
  policiesLastUpdated?: string;
  network: {
    name: string;
    logoUrl: string;
    chainId: number;
    walletConnectRpc: {
      url: string;
      headers?: Record<string, string>;
    };
    productionRpc?: {
      url: string;
      headers?: Record<string, string>;
    };
    blockExplorer: { name: string; url: string };
    gasToken: {
      name: string;
      symbol: string;
      decimals: number;
      address: string;
      logoURI: string;
    };
  };
  sdk: {
    cacheTTL: number;
  };
  defaultTokenPair: [string, string];
  popularPairs: [string, string][];
  popularTokens: {
    base: string[];
    quote: string[];
  };
  tokenListOverride: {
    name: string;
    symbol: string;
    decimals: number;
    address: string;
    logoURI: string;
  }[];
  tokenLists: {
    uri: string;
    parser?: (data: any) => Promise<TokenList> | TokenList;
  }[];
  addresses: {
    tokens: { ZERO: string } & Record<string, string>;
    carbon: {
      carbonController: string;
      voucher: string;
    };
  };
  utils: {
    multicall3: ContractDetails;
    [contractName: string]: ContractDetails;
  };
  tenderly: {
    nativeTokenDonorAccount: string;
    faucetAmount: number;
    faucetTokens: FaucetToken[];
  };
}
