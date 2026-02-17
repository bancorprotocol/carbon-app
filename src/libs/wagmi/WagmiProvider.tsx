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
import { useGetApprovalTokens, useGetApprovalTxs } from 'hooks/useApproval';

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
  const getApprovals = useGetApprovalTxs();
  const getApprovalTokens = useGetApprovalTokens();
  const { batchTransaction, canBatchTransactions } = useBatchTransaction();

  const openConnect = useCallback(() => openModal('wallet'), [openModal]);
  const sendTransaction = useCallback(
    async (tx: TransactionRequest | TransactionRequest[]) => {
      if (!user || !signer) throw new Error('No user connected');
      const txs = Array.isArray(tx) ? [...tx] : [tx];
      const canBatch = await canBatchTransactions(user);
      if (!canBatch && txs.length > 1) {
        throw new Error('Array of transaction is only allowed for EIP7702');
      }
      const customData = txs.map((tx) => tx.customData);
      if (canBatch) {
        const approvalTxs = await getApprovals(user, customData);
        txs.unshift(...approvalTxs);
      } else {
        const approvalTokens = await getApprovalTokens(user, customData);
        if (approvalTokens.length) {
          await new Promise<void>((res, rej) => {
            openModal('txConfirm', {
              approvalTokens,
              onConfirm: res,
              onClose: rej,
            });
          });
        }
      }
      try {
        return await batchTransaction(user, txs);
      } catch (err: any) {
        // Throw if error comes from EOA.
        // TODO: find a cleaner solution
        if ('code' in err) throw err;
        if (txs.length === 1) {
          return signer!.sendTransaction(txs[0]);
        } else {
          const msg =
            'Cannot fallback to regular transaction because it is an Array of txs';
          console.error(msg);
          throw err;
        }
      }
    },
    [
      user,
      signer,
      canBatchTransactions,
      getApprovals,
      getApprovalTokens,
      openModal,
      batchTransaction,
    ],
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
