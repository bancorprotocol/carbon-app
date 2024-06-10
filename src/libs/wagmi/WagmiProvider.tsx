import { createContext, FC, ReactNode, useContext } from 'react';
import { CarbonWagmiProviderContext } from 'libs/wagmi/wagmi.types';
import { useWagmiTenderly } from 'libs/wagmi/useWagmiTenderly';
import { useWagmiNetwork } from 'libs/wagmi/useWagmiNetwork';
import { useWagmiImposter } from 'libs/wagmi/useWagmiImposter';
import { useWagmiUser } from 'libs/wagmi/useWagmiUser';
import { getChainInfo } from './wagmi.utils';

// ********************************** //
// WAGMI CONTEXT
// ********************************** //

const defaultValue: CarbonWagmiProviderContext = {
  user: undefined,
  handleImposterAccount: () => {},
  isNetworkActive: false,
  provider: undefined,
  signer: undefined,
  currentConnector: undefined,
  connectors: [],
  chainId: getChainInfo().chainId,
  accountChainId: undefined,
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
    isSupportedNetwork,
    accountChainId,
  } = useWagmiUser({
    handleImposterAccount,
    imposterAccount,
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
    </CarbonWagmiCTX.Provider>
  );
};
