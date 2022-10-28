import {
  useWeb3React,
  Web3ReactHooks,
  Web3ReactProvider,
} from '@web3-react/core';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Connector } from '@web3-react/types';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { lsService } from 'services/localeStorage';
import {
  ConnectionType,
  IS_TENDERLY_FORK,
  SELECTABLE_CONNECTION_TYPES,
} from 'web3/web3.constants';
import {
  NotificationType,
  useNotifications,
} from 'notifications/NotificationsProvider';
import { getConnection } from 'web3/web3.utils';
import { BancorWeb3ProviderContext } from 'web3/web3.types';

// ********************************** //
// WEB3 CONTEXT
// ********************************** //

const defaultValue: BancorWeb3ProviderContext = {
  user: undefined,
  handleImposterAccount: (account) => console.log(account),
  isNetworkActive: false,
  provider: undefined,
  signer: undefined,
  chainId: 1,
  handleTenderlyRPC: (url) => console.log(url),
  disconnect: async () => {},
  connect: async () => {},
  isImposter: false,
  networkError: undefined,
};

const BancorWeb3CTX = createContext(defaultValue);

export const useWeb3 = () => useContext(BancorWeb3CTX);

// ********************************** //
// WEB3 PROVIDER
// ********************************** //

const BancorWeb3Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const network = getConnection(ConnectionType.NETWORK);
  const provider = network.hooks.useProvider();
  const [isNetworkActive, setIsNetworkActive] = useState(false);

  const { dispatchNotification } = useNotifications();
  const {
    account: walletAccount,
    provider: walletProvider,
    chainId,
    connector,
  } = useWeb3React();

  const [imposterAccount, setImposterAccount] = useState<string>(
    lsService.getItem('imposterAccount') || ''
  );

  const [networkError, setNetworkError] = useState<string>();
  useState<StaticJsonRpcProvider>();

  const user = useMemo(
    () => imposterAccount || walletAccount,
    [imposterAccount, walletAccount]
  );

  const isImposter = useMemo(() => !!imposterAccount, [imposterAccount]);

  const signer = useMemo(
    () =>
      IS_TENDERLY_FORK
        ? provider?.getUncheckedSigner(user)
        : walletProvider?.getSigner(user),
    [provider, user, walletProvider]
  );

  const handleImposterAccount = (account = '') => {
    setImposterAccount(account);
    if (account) {
      lsService.setItem('imposterAccount', account);
    } else {
      lsService.removeItem('imposterAccount');
    }
  };

  const handleTenderlyRPC = (url?: string) => {
    if (url) {
      lsService.setItem('tenderlyRpc', url);
    } else {
      lsService.removeItem('tenderlyRpc');
    }
    window.location.reload();
  };

  const connect = useCallback(async (type: ConnectionType) => {
    const { connector } = getConnection(type);
    await connector.activate();
  }, []);

  const disconnect = useCallback(async () => {
    if (connector.deactivate) {
      await connector.deactivate();
    } else {
      await connector.resetState();
    }
    setImposterAccount('');
    lsService.removeItem('imposterAccount');
  }, [connector]);

  console.log('render');

  const activateNetwork = useCallback(async () => {
    if (networkError || isNetworkActive) {
      return;
    }
    console.log('activateNetwork');

    try {
      await network.connector.activate();
      setIsNetworkActive(true);
      await connector.connectEagerly?.();
    } catch (e: any) {
      const msg = e.message || 'Could not activate network: UNKNOWN ERROR';
      console.error('activateNetwork failed.', msg);
      setNetworkError(msg);
      dispatchNotification({
        title: 'Network Error',
        description: msg,
        type: NotificationType.Failed,
      });
    }
  }, [
    connector,
    dispatchNotification,
    isNetworkActive,
    network.connector,
    networkError,
  ]);

  useEffect(() => {
    console.log('effect');
    void activateNetwork();
    return () => console.log('unmounted');
  }, [activateNetwork]);

  return (
    <BancorWeb3CTX.Provider
      value={{
        user,
        isNetworkActive,
        provider,
        signer,
        chainId,
        handleTenderlyRPC,
        handleImposterAccount,
        connect,
        disconnect,
        isImposter,
        networkError,
      }}
    >
      {children}
    </BancorWeb3CTX.Provider>
  );
};

// ********************************** //
// WEB3 REACT LIBRARY WRAPPER
// ********************************** //

const connectors: [Connector, Web3ReactHooks][] =
  SELECTABLE_CONNECTION_TYPES.map(getConnection).map(({ hooks, connector }) => [
    connector,
    hooks,
  ]);

const key = 'Web3ReactProviderKey';

export const Web3ReactWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    console.log('effect outer');
    return () => console.log('unmounted outer');
  }, []);

  return (
    <Web3ReactProvider connectors={connectors} key={key}>
      <BancorWeb3Provider>{children}</BancorWeb3Provider>
    </Web3ReactProvider>
  );
};
