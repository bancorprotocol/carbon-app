import { useWeb3React } from '@web3-react/core';
import { createContext, FC, ReactNode, useContext, useMemo } from 'react';
import { CarbonWeb3ProviderContext } from 'libs/web3/web3.types';
import { useWeb3Network } from 'libs/web3/useWeb3Network';
import { useWeb3Imposter } from 'libs/web3/useWeb3Imposter';
import { useWeb3Tenderly } from 'libs/web3/useWeb3Tenderly';
import { useWeb3User } from 'libs/web3/useWeb3User';

// ********************************** //
// WEB3 CONTEXT
// ********************************** //

const defaultValue: CarbonWeb3ProviderContext = {
  user: undefined,
  handleImposterAccount: () => {},
  isNetworkActive: false,
  provider: undefined,
  signer: undefined,
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

export const useWeb3 = () => useContext(CarbonWeb3CTX);

// ********************************** //
// WEB3 PROVIDER
// ********************************** //

export const CarbonWeb3Provider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    account: walletAccount,
    provider: walletProvider,
    chainId,
    connector,
  } = useWeb3React();

  const { provider, isNetworkActive, networkError, switchNetwork } =
    useWeb3Network();

  const { imposterAccount, handleImposterAccount, isImposter } =
    useWeb3Imposter();

  const { handleTenderlyRPC } = useWeb3Tenderly();

  const {
    user,
    signer,
    connect,
    disconnect,
    isUserBlocked,
    isUncheckedSigner,
    setIsUncheckedSigner,
  } = useWeb3User({
    walletAccount,
    walletProvider,
    provider,
    handleImposterAccount,
    imposterAccount,
    connector,
  });

  const isSupportedNetwork = useMemo(
    () => !(!!user && (chainId || 1) !== 1),
    [chainId, user]
  );

  return (
    <CarbonWeb3CTX.Provider
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
