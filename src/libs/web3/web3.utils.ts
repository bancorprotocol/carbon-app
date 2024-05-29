import { ConnectionType } from 'libs/web3/web3.constants';
import {
  coinbaseWalletConnection,
  gnosisSafeConnection,
  injectedConnection,
  networkConnection,
  walletConnectConnection,
  tailwindWalletConnection,
  compassWalletConnection,
  seifWalletConnection,
} from 'libs/web3/web3.connectors';
import { lsService } from 'services/localeStorage';
import { UAParser } from 'ua-parser-js';
import { Connection } from './web3.types';
import config from 'config';

const parser = new UAParser(window.navigator.userAgent);
const { type } = parser.getDevice();

export const isMobile = type === 'mobile' || type === 'tablet';

// Interface to add new chain to injected wallets as per EIP-3085 (https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3085.md)
export interface AddChainParameter {
  chainId: number; // EIP-3085 specifies hex string but web3-react expects number
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number; // EIP-3085 specifies generic string but web3-react expects 18
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
}

export function getSeifInjectedProvider() {
  if (typeof window === 'undefined') return;
  if (window.ethereum && (window as any).ethereum['__seif']) {
    return window.ethereum;
  }

  if ((window as any)['__seif']) {
    return (window as any)['__seif'];
  }

  return;
}

export const getChainInfo = (): AddChainParameter => {
  return {
    chainId: config.network.chainId,
    chainName: config.network.name,
    nativeCurrency: {
      name: config.network.gasToken.name,
      symbol: config.network.gasToken.symbol,
      decimals: config.network.gasToken.decimals,
    },
    iconUrls: [config.network.gasToken.logoURI],
    rpcUrls: [config.network.rpc.url],
    blockExplorerUrls: [config.network.blockExplorer.url],
  };
};

const connections: Record<ConnectionType, Connection> = {
  injected: injectedConnection,
  coinbaseWallet: coinbaseWalletConnection,
  walletConnect: walletConnectConnection,
  gnosisSafe: gnosisSafeConnection,
  network: networkConnection,
  tailwindWallet: tailwindWalletConnection,
  compassWallet: compassWalletConnection,
  seifWallet: seifWalletConnection,
};

export const getConnection = (c: ConnectionType) => connections[c];

export const attemptToConnectWallet = async (
  t: ConnectionType,
  activate?: boolean
): Promise<{ success: boolean }> => {
  const { connector: c, name } = getConnection(t);
  try {
    if (activate) {
      await c.activate();
    } else {
      await c.connectEagerly?.();
    }
    lsService.setItem('connectionType', t);
    console.log(`connected to ${name}`);
    return { success: true };
  } catch (e: any) {
    console.error(`error connecting to ${name}`, e);
    return {
      success: false,
    };
  }
};

export const IS_IN_IFRAME = window?.self !== window.top;

export const IS_METAMASK_WALLET = Boolean(
  window?.ethereum && window?.ethereum?.isMetaMask
);

export const IS_COINBASE_WALLET =
  // @ts-ignore
  Boolean(window?.ethereum && window?.ethereum.isCoinbaseWallet);

export const IS_METAMASK_BROWSER = isMobile && IS_METAMASK_WALLET;

export const IS_COINBASE_BROWSER = isMobile && IS_COINBASE_WALLET;

const NATIVE_APP_BROWSERS = [
  {
    enabled: IS_IN_IFRAME,
    type: 'gnosisSafe',
    activate: true,
  },
  {
    enabled: IS_COINBASE_BROWSER,
    type: 'coinbaseWallet',
    activate: true,
  },
  {
    enabled: IS_METAMASK_BROWSER,
    type: 'injected',
    activate: true,
  },
] as const;

export const isNativeAppBrowser = NATIVE_APP_BROWSERS.find((x) => x.enabled);
