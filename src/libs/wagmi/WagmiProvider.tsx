import { FC, ReactNode, useCallback } from 'react';
import { useWagmiTenderly } from 'libs/wagmi/useWagmiTenderly';
import { useWagmiNetwork } from 'libs/wagmi/useWagmiNetwork';
import { useWagmiImposter } from 'libs/wagmi/useWagmiImposter';
import { useWagmiUser } from 'libs/wagmi/useWagmiUser';
import { CarbonWagmiCTX } from './context';
import { Contract, TransactionRequest } from 'ethers';
import { NATIVE_TOKEN_ADDRESS } from 'utils/tokens';
import { useModal } from 'hooks/useModal';
import { useBatchTransaction } from './batch-transaction';

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

  const { batchTransaction } = useBatchTransaction();

  const openConnect = useCallback(() => openModal('wallet'), [openModal]);
  const sendTransaction = useCallback(
    async (tx: TransactionRequest) => {
      if (!user || !signer) throw new Error('No user connected');
      try {
        return await batchTransaction(user, tx);
      } catch (err) {
        if ((err as any).code === 5750) throw err;
        return signer!.sendTransaction(tx);
      }
    },
    [user, batchTransaction, signer],
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
