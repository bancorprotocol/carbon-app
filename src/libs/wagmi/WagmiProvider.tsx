import { createContext, FC, ReactNode, useCallback, useContext } from 'react';
import { CarbonWagmiProviderContext } from 'libs/wagmi/wagmi.types';
import { useWagmiTenderly } from 'libs/wagmi/useWagmiTenderly';
import { useWagmiNetwork } from 'libs/wagmi/useWagmiNetwork';
import { useWagmiImposter } from 'libs/wagmi/useWagmiImposter';
import { useWagmiUser } from 'libs/wagmi/useWagmiUser';
import { currentChain } from './chains';
import { useModal } from 'hooks/useModal';
import { Contract, TransactionRequest } from 'ethers';
import { NATIVE_TOKEN_ADDRESS } from 'utils/tokens';

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
  sendTransaction: async () => undefined as any,
  currentConnector: undefined,
  connectors: [],
  chainId: currentChain.id,
  accountChainId: undefined,
  handleTenderlyRPC: () => {},
  disconnect: async () => {},
  openConnect: async () => {},
  connect: async () => {},
  networkError: undefined,
  isSupportedNetwork: true,
  switchNetwork: () => {},
  isUserBlocked: false,
  isUncheckedSigner: false,
  setIsUncheckedSigner: () => {},
  getBalance: async () => BigInt(0),
};

export const CarbonWagmiCTX = createContext(defaultValue);

export const useWagmi = () => useContext(CarbonWagmiCTX);

// ********************************** //
// WAGMI PROVIDER
// ********************************** //

export const CarbonWagmiProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { openModal } = useModal();
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

  const openConnect = useCallback(
    () => openModal('wallet', undefined),
    [openModal],
  );
  const sendTransaction = useCallback(
    (tx: TransactionRequest) => signer!.sendTransaction(tx),
    [signer],
  );
  const getBalance = useCallback(
    (address: string) => {
      if (!provider) throw new Error('No provider found');
      if (!user) throw new Error('No user provided');
      if (address === NATIVE_TOKEN_ADDRESS) {
        return provider.getBalance(user);
      } else {
        const contract = new Contract(
          address,
          ['function balanceOf(address owner) view returns (uint256)'],
          provider,
        );
        return contract.balanceOf(user);
      }
    },
    [user, provider],
  );

  return (
    <CarbonWagmiCTX.Provider
      value={{
        user,
        isNetworkActive,
        provider,
        signer,
        sendTransaction,
        currentConnector,
        connectors,
        chainId,
        accountChainId,
        handleTenderlyRPC,
        imposterAccount,
        setImposterAccount,
        connect,
        openConnect,
        disconnect,
        networkError,
        isSupportedNetwork,
        switchNetwork,
        isUserBlocked,
        isUncheckedSigner,
        setIsUncheckedSigner,
        getBalance,
      }}
    >
      {children}
    </CarbonWagmiCTX.Provider>
  );
};
