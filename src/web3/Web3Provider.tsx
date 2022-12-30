import { useWeb3React } from '@web3-react/core';
import { createContext, FC, ReactNode, useContext } from 'react';
import { BancorWeb3ProviderContext } from 'web3/web3.types';
import { useWeb3Network } from 'web3/useWeb3Network';
import { useWeb3Imposter } from 'web3/useWeb3Imposter';
import { useWeb3Tenderly } from 'web3/useWeb3Tenderly';
import { useWeb3User } from 'web3/useWeb3User';

// ********************************** //
// WEB3 CONTEXT
// ********************************** //

const defaultValue: BancorWeb3ProviderContext = {
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
};

const BancorWeb3CTX = createContext(defaultValue);

export const useWeb3 = () => useContext(BancorWeb3CTX);

// ********************************** //
// WEB3 PROVIDER
// ********************************** //

export const BancorWeb3Provider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    account: walletAccount,
    provider: walletProvider,
    chainId,
    connector,
  } = useWeb3React();

  const { provider, isNetworkActive, networkError } = useWeb3Network();

  const { imposterAccount, handleImposterAccount, isImposter } =
    useWeb3Imposter();

  const { handleTenderlyRPC } = useWeb3Tenderly();

  const { user, signer, connect, disconnect } = useWeb3User({
    walletAccount,
    walletProvider,
    provider,
    handleImposterAccount,
    imposterAccount,
    connector,
  });

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
