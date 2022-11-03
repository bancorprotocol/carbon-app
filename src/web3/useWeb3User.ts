import { useCallback, useMemo } from 'react';
import { ConnectionType, IS_TENDERLY_FORK } from 'web3/web3.constants';
import { getConnection } from 'web3/web3.utils';
import { Web3Provider } from '@ethersproject/providers';
import { Connector } from '@web3-react/types';

type Props = {
  imposterAccount: string;
  walletAccount?: string;
  provider?: Web3Provider;
  walletProvider?: Web3Provider;
  connector: Connector;
  handleImposterAccount: (account?: string) => void;
};

export const useWeb3User = ({
  imposterAccount,
  walletAccount,
  provider,
  walletProvider,
  connector,
  handleImposterAccount,
}: Props) => {
  const user = useMemo(
    () => imposterAccount || walletAccount,
    [imposterAccount, walletAccount]
  );

  const signer = useMemo(
    () =>
      IS_TENDERLY_FORK
        ? provider?.getUncheckedSigner(user)
        : walletProvider?.getSigner(user),
    [provider, user, walletProvider]
  );

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
    handleImposterAccount();
  }, [connector, handleImposterAccount]);

  return { user, signer, connect, disconnect };
};
