import { TokenList } from 'libs/tokens';
import { selectableConnectionType } from 'libs/web3/web3.constants';

export interface AppConfig {
  mode: 'development' | 'production';
  appUrl: string;
  carbonApi: string;
  selectableConnectionTypes: selectableConnectionType[];
  walletConnectProjectId: string;
  isSimulatorEnabled: boolean;
  sentryDSN?: string;
  network: {
    name: string;
    logoUrl: string;
    chainId: number;
    rpcUrl: string;
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
    tokens: { ZERO: string } & Record<symbol, string>;
    carbon: {
      carbonController: string;
      voucher: string;
    };
    utils: {
      multicall: string;
    };
  };
}
