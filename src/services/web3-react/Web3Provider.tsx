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
import {
  ConnectionType,
  SELECTABLE_CONNECTION_TYPES,
} from 'services/web3-react/web3.constants';
import {
  getConnection,
  getConnectionName,
} from 'services/web3-react/web3.utils';
import { BancorWeb3ProviderContext } from 'services/web3-react/web3.types';
import { JsonRpcSigner, StaticJsonRpcProvider } from '@ethersproject/providers';
import { LocalStorageId, setLocalStorage } from 'services/localeStorage/index';

// ********************************** //
// WEB3 CONTEXT
// ********************************** //

const defaultValue: BancorWeb3ProviderContext = {
  user: undefined,
  setImposterAccount: (account) => console.log(account),
  isNetworkActive: false,
  provider: undefined,
  signer: undefined,
  chainId: 1,
  handleTenderlyRPC: () => {},
};

const BancorWeb3CTX = createContext(defaultValue);

export const useWeb3 = () => useContext(BancorWeb3CTX);

// ********************************** //
// WEB3 PROVIDER
// ********************************** //

const BancorWeb3Provider: FC<{ children: ReactNode }> = ({ children }) => {
  const network = getConnection(ConnectionType.NETWORK);
  const isNetworkActive = network.hooks.useIsActive();
  const networkProvider = network.hooks.useProvider();

  const {
    account: walletAccount,
    provider: walletProvider,
    chainId,
    connector,
  } = useWeb3React();

  const [imposterAccount, setImposterAccount] = useState<string>();
  const [tenderlyProvider, setTenderlyProvider] =
    useState<StaticJsonRpcProvider>();
  const [tenderlySigner, setTenderlySigner] = useState<JsonRpcSigner>();

  const user = useMemo(
    () => imposterAccount || walletAccount,
    [imposterAccount, walletAccount]
  );
  const provider = useMemo(
    () => tenderlyProvider || networkProvider,
    [tenderlyProvider, networkProvider]
  );
  const signer = useMemo(
    () => tenderlySigner || walletProvider?.getSigner(user),
    [walletProvider, tenderlySigner, user]
  );

  const handleTenderlyRPC = useCallback(
    (url?: string) => {
      setLocalStorage(LocalStorageId.TENDERLY_RPC, url);

      if (url) {
        const prov = new StaticJsonRpcProvider({
          url,
          skipFetchSetup: true,
        });
        setTenderlyProvider(prov);
        setTenderlySigner(prov.getUncheckedSigner(user));
      } else {
        setTenderlyProvider(undefined);
        setTenderlySigner(undefined);
      }
    },
    [user]
  );

  useEffect(() => {
    void network.connector.activate();
    void connector.connectEagerly?.();
  }, [connector, network.connector]);

  return (
    <BancorWeb3CTX.Provider
      value={{
        user,
        setImposterAccount,
        isNetworkActive,
        provider,
        signer,
        chainId,
        handleTenderlyRPC,
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

const key = SELECTABLE_CONNECTION_TYPES.map((type) =>
  getConnectionName(type)
).join('-');

export const Web3ReactWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Web3ReactProvider connectors={connectors} key={key}>
      <BancorWeb3Provider>{children}</BancorWeb3Provider>
    </Web3ReactProvider>
  );
};
