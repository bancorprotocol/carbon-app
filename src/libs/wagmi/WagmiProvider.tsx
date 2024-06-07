import { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { CarbonWeb3ProviderContext } from 'libs/wagmi/wagmi.types';
import { useWagmiTenderly } from 'libs/wagmi/useWagmiTenderly';
import { useWagmiNetwork } from 'libs/wagmi/useWagmiNetwork';
import { useWagmiImposter } from 'libs/wagmi/useWagmiImposter';
import { useWagmiUser } from 'libs/wagmi/useWagmiUser';
import { wagmiConfig } from 'libs/wagmi/config';
import config from 'config';
import { getAccount } from '@wagmi/core';

// ********************************** //
// WEB3 CONTEXT
// ********************************** //

const defaultValue: CarbonWeb3ProviderContext = {
  user: undefined,
  handleImposterAccount: () => {},
  isNetworkActive: false,
  provider: undefined,
  signer: undefined,
  currentConnector: undefined,
  connectors: [],
  chainId: 1,
  handleTenderlyRPC: () => {},
  disconnect: async () => {},
  connect: async () => {},
  isImposter: false,
  networkError: undefined,
  isSupportedNetwork: true,
  switchNetwork: () => {},
  isUserBlocked: false,
  isUncheckedSigner: false,
  setIsUncheckedSigner: () => {},
};

const CarbonWeb3CTX = createContext(defaultValue);

export const useWagmi = () => useContext(CarbonWeb3CTX);

// ********************************** //
// WEB3 PROVIDER
// ********************************** //

export const CarbonWeb3Provider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { address: walletAccount, chainId } = getAccount(wagmiConfig);

  const { provider, connectors, isNetworkActive, networkError, switchNetwork } =
    useWagmiNetwork();

  const { imposterAccount, handleImposterAccount, isImposter } =
    useWagmiImposter();

  const { handleTenderlyRPC } = useWagmiTenderly();

  const {
    user,
    signer,
    currentConnector,
    connect,
    disconnect,
    isUserBlocked,
    isUncheckedSigner,
    setIsUncheckedSigner,
  } = useWagmiUser({
    walletAccount,
    handleImposterAccount,
    imposterAccount,
  });

  const isSupportedNetwork = useMemo(
    () =>
      !(
        !!user && (chainId || config.network.chainId) !== config.network.chainId
      ),
    [chainId, user]
  );

  return (
    <CarbonWeb3CTX.Provider
      value={{
        user,
        isNetworkActive,
        provider,
        signer,
        currentConnector,
        connectors,
        chainId,
        handleTenderlyRPC,
        handleImposterAccount,
        connect,
        disconnect,
        isImposter,
        networkError,
        isSupportedNetwork,
        switchNetwork,
        isUserBlocked,
        isUncheckedSigner,
        setIsUncheckedSigner,
      }}
    >
      {children}
    </CarbonWeb3CTX.Provider>
  );
};
