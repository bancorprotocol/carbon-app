import { ConnectionType } from 'libs/web3/web3.constants';
import {
  coinbaseWalletConnection,
  gnosisSafeConnection,
  injectedConnection,
  networkConnection,
  walletConnectConnection,
} from 'libs/web3/web3.connectors';
import { lsService } from 'services/localeStorage';
import { UAParser } from 'ua-parser-js';

const parser = new UAParser(window.navigator.userAgent);
const { type } = parser.getDevice();

export const isMobile = type === 'mobile' || type === 'tablet';

export const getConnection = (c: ConnectionType) => {
  switch (c) {
    case ConnectionType.INJECTED:
      return injectedConnection;
    case ConnectionType.COINBASE_WALLET:
      return coinbaseWalletConnection;
    case ConnectionType.WALLET_CONNECT:
      return walletConnectConnection;
    case ConnectionType.NETWORK:
      return networkConnection;
    case ConnectionType.GNOSIS_SAFE:
      return gnosisSafeConnection;
  }
};

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
    type: ConnectionType.GNOSIS_SAFE,
    activate: true,
  },
  {
    enabled: IS_COINBASE_BROWSER,
    type: ConnectionType.COINBASE_WALLET,
    activate: true,
  },
  {
    enabled: IS_METAMASK_BROWSER,
    type: ConnectionType.INJECTED,
    activate: true,
  },
];

export const isNativeAppBrowser = NATIVE_APP_BROWSERS.find((x) => x.enabled);
