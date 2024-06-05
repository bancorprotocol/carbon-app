import { useCallback, useMemo, useState } from 'react';
import { IS_TENDERLY_FORK } from 'libs/wagmi/web3.constants';
import {
  useConnect,
  useDisconnect,
  Config,
  useConnectorClient,
  Connector,
  useAccount,
} from 'wagmi';
import { type DisconnectErrorType } from '@wagmi/core';
import { isAccountBlocked } from 'utils/restrictedAccounts';
import { lsService } from 'services/localeStorage';
import { useStore } from 'store';
import { getChainInfo } from './web3.utils';
import { clientToSigner } from './ethers';
import { getUncheckedSigner } from 'utils/tenderly';

type Props = {
  imposterAccount: string;
  walletAccount?: string;
  handleImposterAccount: (account?: string) => void;
};

export const useWagmiUser = ({
  imposterAccount,
  walletAccount,
  handleImposterAccount,
}: Props) => {
  const { isCountryBlocked } = useStore();
  const [isUncheckedSigner, _setIsUncheckedSigner] = useState(
    lsService.getItem('isUncheckedSigner') || false
  );
  const { connect: _connect } = useConnect();
  const { disconnect: _disconnect } = useDisconnect();

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

  const { connector: currentConnector } = useAccount();

  const { data: client } = useConnectorClient<Config>({
    chainId: getChainInfo().chainId,
  });

  const signer = useMemo(() => {
    if (!IS_TENDERLY_FORK || !isUncheckedSigner) {
      return clientToSigner(client);
    } else {
      if (user) return getUncheckedSigner(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, IS_TENDERLY_FORK, user, isUncheckedSigner]);

  const connect = useCallback(
    async (connector: Connector) => {
      if (isCountryBlocked || isCountryBlocked === null) {
        throw new Error('Your country is restricted from using this app.');
      }
      _connect(
        {
          connector,
          chainId: getChainInfo().chainId,
        },
        {
          onError: (error) => {
            throw new Error(
              `Error connecting ${connector.name}` + error.message
            );
          },
        }
      );
    },
    [isCountryBlocked, _connect]
  );

  const disconnect = useCallback(async () => {
    _disconnect(
      {},
      {
        onSuccess: () => {
          console.log('Successfully deactivated connector');
          handleImposterAccount();
        },
        onError: (error: DisconnectErrorType) => {
          throw new Error(`Error disconnecting` + error.message);
        },
      }
    );
  }, [_disconnect, handleImposterAccount]);

  return {
    user,
    signer,
    currentConnector,
    connect,
    disconnect,
    isUserBlocked,
    isUncheckedSigner,
    setIsUncheckedSigner,
  };
};
