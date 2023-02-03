import { useModal } from 'hooks/useModal';
import { Modal } from 'libs/modals/Modal';
import { ModalFC } from 'libs/modals/modals.types';
import { useWeb3, Connection } from 'libs/web3';
import { useState } from 'react';
import { ModalWalletError } from 'libs/modals/modals/WalletModal/ModalWalletError';
import { ModalWalletLoading } from 'libs/modals/modals/WalletModal/ModalWalletLoading';
import { ModalWalletContent } from 'libs/modals/modals/WalletModal/ModalWalletContent';

export const ModalWallet: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();
  const { connect } = useWeb3();
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);
  const [connectionError, setConnectionError] = useState('');

  const onClickConnect = async (c: Connection) => {
    setSelectedConnection(c);
    try {
      await connect(c.type);
      closeModal(id);
    } catch (e: any) {
      console.error(`Modal Wallet onClickConnect error: `, e);
      setConnectionError(e.message || 'Unknown connection error.');
    }
  };

  return (
    <Modal id={id} title={'Connect Wallet'}>
      <div className={'mt-30'}>
        {selectedConnection !== null ? (
          <div className={'flex flex-col items-center space-y-20'}>
            {connectionError ? (
              <ModalWalletError
                logoUrl={selectedConnection.logoUrl}
                name={selectedConnection.name}
                error={connectionError}
              />
            ) : (
              <ModalWalletLoading
                name={selectedConnection.name}
                logoUrl={selectedConnection.logoUrl}
              />
            )}
          </div>
        ) : (
          <ModalWalletContent onClick={onClickConnect} />
        )}
      </div>
    </Modal>
  );
};
