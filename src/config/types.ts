import { TokenList } from 'libs/tokens';
import { SelectableConnectionType } from 'libs/wagmi';
import { FaucetToken } from 'utils/tenderly';

type address = `0x${string}`;

export interface AppConfig {
  mode: 'development' | 'production';
  appUrl: string;
  carbonApi: string;
  selectedConnections: SelectableConnectionType[];
  walletConnectProjectId: string;
  isSimulatorEnabled: boolean;
  sentryDSN?: string;
  policiesLastUpdated?: string;
  network: {
    name: string;
    logoUrl: string;
    chainId: number;
    rpc: {
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
    parser?: (data: any) => TokenList;
  }[];
  addresses: {
    tokens: { ZERO: string } & Record<string, string>;
    carbon: {
      carbonController: string;
      voucher: string;
    };
  };
  utils: {
    multicall3: {
      address: address;
      blockCreated: number;
    };
  } & Record<string, { address: address; blockCreated?: number }>;
  tenderly: {
    nativeTokenDonorAccount: string;
    faucetAmount: number;
    faucetTokens: FaucetToken[];
  };
}
