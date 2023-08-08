import { useCallback, useMemo, useState } from 'react';
import { ConnectionType, IS_TENDERLY_FORK } from 'libs/web3/web3.constants';
import { getConnection } from 'libs/web3/web3.utils';
import { Web3Provider } from '@ethersproject/providers';
import { Connector } from '@web3-react/types';
import { isAccountBlocked } from 'utils/restrictedAccounts';
import { lsService } from 'services/localeStorage';
import { useStore } from 'store';

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
  const { isCountryBlocked, setSelectedWallet } = useStore();
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

  const connect = useCallback(
    async (type: ConnectionType) => {
      if (isCountryBlocked || isCountryBlocked === null) {
        throw new Error('Your country is restricted from using this app.');
      }
      const { connector } = getConnection(type);
      await connector.activate();
      lsService.setItem('connectionType', type);
      setSelectedWallet(type);
    },
    [isCountryBlocked, setSelectedWallet]
  );

  const disconnect = useCallback(async () => {
    try {
      if (!connector.deactivate) {
        throw new Error('connector does not have a deactivate method');
      }
      await connector.deactivate();
      console.log('successfully deactivated connector');
    } catch (e) {
      console.warn(
        'failed to deactivate connector, attempting to reset state instead.',
        e
      );
      try {
        await connector.resetState();
        console.log('successfully reset connector state');
      } catch (e) {
        console.error(
          'failed to reset connector state, user not logged out',
          e
        );
      } finally {
        handleImposterAccount();
        lsService.removeItem('connectionType');
        setSelectedWallet(null);
      }
    }
  }, [connector, handleImposterAccount, setSelectedWallet]);

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
