import { useModal } from 'modals/ModalProvider';
import { Modal } from 'modals/Modal';
import { ModalFC } from 'modals/modals.types';
import { ConnectionType, useWeb3 } from 'web3';
import { useState } from 'react';

export const ModalWallet: ModalFC<undefined> = ({ id }) => {
  const { closeModal } = useModal();
  const { connect } = useWeb3();
  const [selectedConnection, setSelectedConnection] =
    useState<ConnectionType | null>(null);
  const [connectionError, setConnectionError] = useState('');

  const onClickConnect = async (type: ConnectionType) => {
    setSelectedConnection(type);
    try {
      await connect(type);
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
          connectionError ? (
            <div>
              <h3>Error</h3>
              <div>{connectionError}</div>
            </div>
          ) : (
            <div>
              <h3>Loading</h3>
              <div>connecting to {selectedConnection}</div>
            </div>
          )
        ) : (
          <div className={'space-y-20'}>
            <button
              onClick={() => onClickConnect(ConnectionType.INJECTED)}
              className={'w-full rounded bg-gray-100 p-16'}
            >
              MetaMask
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
