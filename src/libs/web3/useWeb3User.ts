import { useCallback, useMemo, useState } from 'react';
import { ConnectionType, IS_TENDERLY_FORK } from 'libs/web3/web3.constants';
import { getConnection } from 'libs/web3/web3.utils';
import { Web3Provider } from '@ethersproject/providers';
import { Connector } from '@web3-react/types';
import { isAccountBlocked } from 'utils/restrictedAccounts';
import { lsService } from 'services/localeStorage';

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
  const [isUncheckedSigner, _setIsUncheckedSigner] = useState(
    lsService.getItem('isUncheckedSigner') || false
  );

  const setIsUncheckedSigner = useCallback(
    (value: boolean) => {
      _setIsUncheckedSigner(value);
      lsService.setItem('isUncheckedSigner', value);
    },
    [_setIsUncheckedSigner]
  );

  const user = useMemo(
    () => imposterAccount || walletAccount,
    [imposterAccount, walletAccount]
  );

  const isUserBlocked = useMemo(() => isAccountBlocked(user), [user]);

  const signer = useMemo(() => {
    if (!IS_TENDERLY_FORK || !isUncheckedSigner) {
      return walletProvider?.getSigner(user);
    }
    return provider?.getUncheckedSigner(user);
  }, [provider, user, walletProvider, isUncheckedSigner]);

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

  return {
    user,
    signer,
    connect,
    disconnect,
    isUserBlocked,
    isUncheckedSigner,
    setIsUncheckedSigner,
  };
};
