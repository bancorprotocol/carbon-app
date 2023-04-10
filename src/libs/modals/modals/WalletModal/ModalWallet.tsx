import { useModal } from 'hooks/useModal';
import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { useWeb3, Connection } from 'libs/web3';
import { useEffect, useState } from 'react';
import { ModalWalletError } from 'libs/modals/modals/WalletModal/ModalWalletError';
import { ModalWalletContent } from 'libs/modals/modals/WalletModal/ModalWalletContent';
import { carbonEvents } from 'services/googleTagManager';

export const ModalWallet: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();
  const { connect, user } = useWeb3();
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);
  const [connectionError, setConnectionError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setTimeout(() => {
        carbonEvents.wallet.walletConnect({
          address: user,
          name: selectedConnection?.name || '',
        });
      }, 500);
    }
  }, [isConnected, selectedConnection?.name, user]);

  const isLoading = selectedConnection !== null && !connectionError;
  const isError = selectedConnection !== null && connectionError;

  const onClickConnect = async (c: Connection) => {
    setSelectedConnection(c);
    try {
      await connect(c.type);
      closeModal(id);
      setIsConnected(true);
    } catch (e: any) {
      console.error(`Modal Wallet onClickConnect error: `, e);
      setConnectionError(e.message || 'Unknown connection error.');
    }
  };

  useEffect(() => {
    carbonEvents.wallet.walletConnectPopupView(undefined);
  }, []);

  return (
    <Modal id={id} title={'Connect Wallet'} isLoading={isLoading}>
      <div className={'mt-20'}>
        {isError ? (
          <div className={'flex flex-col items-center space-y-20'}>
            <ModalWalletError
              logoUrl={selectedConnection.logoUrl}
              name={selectedConnection.name}
              error={connectionError}
            />
          </div>
        ) : (
          <ModalWalletContent onClick={onClickConnect} isLoading={isLoading} />
        )}
      </div>
    </Modal>
  );
};
