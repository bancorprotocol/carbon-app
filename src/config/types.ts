import { TokenList } from 'libs/tokens';

export interface AppConfig {
  mode: 'development' | 'production';
  carbonApi: string;
  network: {
    name: string;
    logoUrl: string;
    chainId: number;
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
  appUrl: string;
  walletConnectProjectId: string;
  isGnosisSafeAvailable: boolean;
  isSimulatorEnabled: boolean;
  sentryDNS?: string;
  rpcUrl: string;
  blockExplorer: string;
  addresses: {
    tokens: { ZERO: string } & Record<symbol, string>;
    carbon: {
      carbonController: string;
      voucher: string;
    };
    utils: {
      multicall: string;
    };
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
}
