import { createContext, FC, ReactNode, useContext } from 'react';
import { CarbonWagmiProviderContext } from 'libs/wagmi/wagmi.types';
import { useWagmiTenderly } from 'libs/wagmi/useWagmiTenderly';
import { useWagmiNetwork } from 'libs/wagmi/useWagmiNetwork';
import { useWagmiImposter } from 'libs/wagmi/useWagmiImposter';
import { useWagmiUser } from 'libs/wagmi/useWagmiUser';
import { currentChain } from './chains';

// ********************************** //
// WAGMI CONTEXT
// ********************************** //

const defaultValue: CarbonWagmiProviderContext = {
  user: undefined,
  imposterAccount: undefined,
  setImposterAccount: () => {},
  isNetworkActive: false,
  provider: undefined,
  signer: undefined,
  currentConnector: undefined,
  connectors: [],
  chainId: currentChain.id,
  accountChainId: undefined,
  handleTenderlyRPC: () => {},
  disconnect: async () => {},
  connect: async () => {},
  networkError: undefined,
  isSupportedNetwork: true,
  switchNetwork: () => {},
  isUserBlocked: false,
  isUncheckedSigner: false,
  setIsUncheckedSigner: () => {},
};

const CarbonWagmiCTX = createContext(defaultValue);

export const useWagmi = () => useContext(CarbonWagmiCTX);

// ********************************** //
// WAGMI PROVIDER
// ********************************** //

export const CarbonWagmiProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    chainId,
    provider,
    connectors,
    isNetworkActive,
    networkError,
    switchNetwork,
  } = useWagmiNetwork();

  const { imposterAccount, setImposterAccount } = useWagmiImposter();

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
    isSupportedNetwork,
    accountChainId,
  } = useWagmiUser({
    imposterAccount,
    setImposterAccount,
  });

  return (
    <CarbonWagmiCTX.Provider
      value={{
        user,
        isNetworkActive,
        provider,
        signer,
        currentConnector,
        connectors,
        chainId,
        accountChainId,
        handleTenderlyRPC,
        imposterAccount,
        setImposterAccount,
        connect,
        disconnect,
        networkError,
        isSupportedNetwork,
        switchNetwork,
        isUserBlocked,
        isUncheckedSigner,
        setIsUncheckedSigner,
      }}
    >
      {children}
    </CarbonWagmiCTX.Provider>
  );
};
